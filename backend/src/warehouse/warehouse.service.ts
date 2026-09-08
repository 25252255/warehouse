import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Warehouse } from "./warehouse.entity";
import { CreateWarehouseDto} from './dto/create-warehouse.dto';

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

    async create(
        createWarehouseDto: CreateWarehouseDto
    ): Promise<Warehouse> {
        const warehouse = this.warehouseRepository.create(createWarehouseDto);
        return this.warehouseRepository.save(warehouse);
    }
}