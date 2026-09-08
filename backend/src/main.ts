import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //AppModule을 생성하는 과정에서 TypeOrmModule 설정도 초기화되므로 MySQL 연결이 만들어짐
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:5173',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
