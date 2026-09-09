import { Body, Controller, Delete, Get, Param, Post, ParseIntPipe, Patch } from "@nestjs/common";
import { WarehouseService } from "./warehouse.service";
import { CreateWarehouseDto } from "./dto/create-warehouse.dto";
import { UpdateWarehouseDto } from "./dto/update-warehouse.dto";
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

    @Patch(':warehouseId')
    update(
        @Param('warehouseId', ParseIntPipe) warehouseId: number,

        @Body() updateWarehouseDto: UpdateWarehouseDto,
    ): Promise<Warehouse> {
        return this.warehouseService.update(warehouseId, updateWarehouseDto);
    }
}