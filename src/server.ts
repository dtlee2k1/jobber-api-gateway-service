import http from 'http';

import { CustomError, IErrorResponse, winstonLogger } from '@dtlee2k1/jobber-shared';
import cookieSession from 'cookie-session';
import { Application, NextFunction, Request, Response, json, urlencoded } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import compression from 'compression';

import { envConfig } from './config';
import elasticSearch from './elasticsearch';
import healthRouter from './routes/health.routes';
import { axiosAuthInstance } from './services/api/auth.service';
import authRouter from './routes/auth.routes';

const SERVER_PORT = 4000;
const logger = winstonLogger(`${envConfig.ELASTIC_SEARCH_URL}`, 'apiGatewayServer', 'debug');

export default class ApiGatewayServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start() {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.startElasticSearch();
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application) {
    app.set('trust proxy', 1);
    app.use(
      cookieSession({
        name: 'session',
        keys: [`${envConfig.SECRET_KEY_ONE}`, `${envConfig.SECRET_KEY_TWO}`],
        maxAge: 24 * 7 * 60 * 60 * 1000, // 7 days,
        secure: envConfig.NODE_ENV !== 'development'
        // sameSite: 'none'
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: envConfig.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );

    app.use((req: Request, _res: Response, next: NextFunction) => {
      if (req.session?.jwt) {
        axiosAuthInstance.defaults.headers['Authorization'] = `Bearer ${req.session.jwt}`;
      }
      next();
    });
  }

  private standardMiddleware(app: Application) {
    app.use(compression());
    app.use(urlencoded({ extended: true }));
    app.use(json());
  }

  // Frontend to API Gateway – http(s)://<host>:<port>/api/gateway/v1/auth
  // API Gateway to Auth Service – http(s)://<api-gateway-host>:<port>/api/v1/auth
  private routesMiddleware(app: Application) {
    const BASE_PATH = '/api/gateway/v1';

    app.use(healthRouter);
    app.use(BASE_PATH, authRouter);
  }

  private async startElasticSearch() {
    await elasticSearch.checkConnection();
  }

  private errorHandler(app: Application) {
    app.use('*', (req: Request, res: Response, next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      logger.log({ level: 'error', message: `${fullUrl} endpoint does not existed` });
      res.status(StatusCodes.NOT_FOUND).json({ message: 'The endpoint called does not existed' });
      next();
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      logger.log({ level: 'error', message: `GatewayService ${error.comingFrom}: ${error}` });

      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
  }

  private startServer(app: Application) {
    try {
      const httpServer = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      logger.log('error', 'GatewayService startServer() error method:', error);
    }
  }

  private async startHttpServer(httpServer: http.Server) {
    try {
      logger.info(`Gateway server has started with process id ${process.pid}`);
      httpServer.listen(SERVER_PORT, () => {
        logger.info(`Gateway server running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      logger.log('error', 'GatewayService startServer() error method:', error);
    }
  }
}
