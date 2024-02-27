import express from 'express';

import ApiGatewayServer from './server';

class Application {
  public init() {
    const app = express();
    const server = new ApiGatewayServer(app);
    server.start();
  }
}

const application = new Application();

application.init();
