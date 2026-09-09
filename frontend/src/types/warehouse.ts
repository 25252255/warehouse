export type CreateWarehouseRequest = {
  warehouseName: string
  location: string
  isSet: boolean
}

export type UpdateWarehouseRequest = {
  location: string
}

export type Warehouse = {
  warehouseId: number
  warehouseName: string
  location: string
  isSet: boolean
}