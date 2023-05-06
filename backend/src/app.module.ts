import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { APP_GUARD } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as dotenv from 'dotenv';
dotenv.config();

const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_ORIGIN,
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
};

@Module({
  imports: [SearchModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useValue: {
        canActivate: (context: any) => {
          const request = context.switchToHttp().getRequest();
          const response = context.switchToHttp().getResponse();
          if (request.method === 'OPTIONS') {
            response.setHeader('Access-Control-Allow-Origin', corsOptions.origin);
            response.setHeader('Access-Control-Allow-Methods', corsOptions.methods);
            response.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders);
            response.status(200).end();
            return false;
          }
          return true;
        },
      },
    },
  ],
})
export class AppModule {}
