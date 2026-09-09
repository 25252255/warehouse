import { Body, Controller, Delete, Get, Param, Post, ParseIntPipe } from "@nestjs/common";
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

    @Delete(':warehouseId')
    remove(
        @Param('warehouseId', ParseIntPipe) warehouseId: number,
    ): Promise<void> {
        return this.warehouseService.remove(warehouseId);
    }
}