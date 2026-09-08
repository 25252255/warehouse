import { Body, Controller, Get, Post } from "@nestjs/common";
import { WarehouseService } from "./warehouse.service";
import { CreateWarehouseDto } from "./dto/create-warehouse.dto";
import { Warehouse } from "./warehouse.entity";

@Controller('warehouse')
export class WarehouseController {
    constructor(
        private readonly warehouseService: WarehouseService,
    ) {}

    @Get()
    findAll(): Promise<Warehouse[]> {
        return this.warehouseService.findAll();
    }

    @Post()
    create(
        @Body() createWarehouseDto: CreateWarehouseDto,
    ): Promise<Warehouse> {
        return this.warehouseService.create(createWarehouseDto);
    }
}