import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbHealthController } from './db-health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: Number(configService.getOrThrow<string>('DB_PORT')),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_DATABASE'),
        autoLoadEntities: true,
        // 학습용: Entity 변경 내용을 테이블에 자동 반영합니다.
        // 중요한 데이터나 운영 환경에서는 false로 두고 migration을 사용하세요.
        synchronize: true,
        retryAttempts: 10,
        retryDelay: 2000,
      }),
    }),
  ],
  controllers: [AppController, DbHealthController],
  providers: [AppService],
})
export class AppModule {}
