import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Warehouse } from "./warehouse.entity";
import { CreateWarehouseDto} from './dto/create-warehouse.dto';

@Injectable()
export class WarehouseService {
    constructor(
        @InjectRepository(Warehouse)
        private readonly warehouseRepository: Repository<Warehouse>,
    ) {}

    async findAll(): Promise<Warehouse[]> {
        return this.warehouseRepository.find({
            order: {
                warehouseId: 'desc',
            }
        });
    }

    async create(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
        const warehouse = this.warehouseRepository.create(createWarehouseDto);
        return this.warehouseRepository.save(warehouse);
    }

    async remove(warehouseId: number): Promise<void> {
        const result = await this.warehouseRepository.delete(warehouseId)

        if (result.affected === 0) {
            throw new NotFoundException(`${warehouseId}번 창고를 찾을 수 없습니다.`);
        }

    }
}