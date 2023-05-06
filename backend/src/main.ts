import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const server = express();

// CORS設定の追加
const corsOptions: CorsOptions = {
  origin: process.env.BACKEND_ALLOWED_ORIGIN || 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Accept',
};

async function createApp() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors(corsOptions);
  return app;
}

export default async (req: express.Request, res: express.Response) => {
  const app = await createApp();
  app.init();
  server(req, res);
};
