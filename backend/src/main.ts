import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';

dotenv.config();

const server = require('express')();

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

export const handler = async (req, res) => {
  const app = await createApp();
  await app.init();
  server(req, res);
};
