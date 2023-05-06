import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const server = express();

async function createApp() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // CORS設定の変更
  app.enableCors({
    origin: process.env.BACKEND_ALLOWED_ORIGIN || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Origin',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  return app;
}

export default async (req: express.Request, res: express.Response) => {
  const app = await createApp();
  app.init();
  server(req, res);
};
