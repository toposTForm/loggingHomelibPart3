import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './logger/logger.service';




async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger()
  });
  app.useLogger(app.get(CustomLogger))
  app.useGlobalInterceptors();
  await app.listen(process.env.PORT ?? 4000);
  
}
bootstrap();

