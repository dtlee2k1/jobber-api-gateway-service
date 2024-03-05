import express from 'express';
import ApiGatewayServer from '@gateway/server';

class Application {
  public init() {
    const app = express();
    const server = new ApiGatewayServer(app);
    server.start();
  }
}

const application = new Application();

application.init();
