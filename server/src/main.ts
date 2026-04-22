// Server entry - touched for reload
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors(); // 开启跨域支持
  
  // 增加请求体限制，支持大图片上传
  const { json, urlencoded } = require('express');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  // 静态文件服务
  app.useStaticAssets(join(process.cwd(), 'public'));
  app.useStaticAssets(join(process.cwd(), 'public/uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 3100;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
