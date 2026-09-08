import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Warehouse } from './warehouse.entity';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Warehouse]),
        ConfigModule.forRoot({ 
        //설정이 적용된 NestJS 모듈을 반환하는 함수
        //애플리케이션 시작 시 .env를 읽고, 그 설정값을 모든 NestJS 모듈에서 ConfigService로 사용할 수 있게
            isGlobal: true,

        }),
    ],
    controllers: [WarehouseController],
    providers: [WarehouseService],
})
export class WarehouseModule {}