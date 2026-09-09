import type { Warehouse } from '../types/warehouse'

interface WarehouseTableProps {
  warehouses: Warehouse[]
  loading: boolean
  busyId: number | null
  onDelete: (warehouse: Warehouse) => Promise<void>
}

export function WarehouseTable({
  warehouses,
  loading,
  busyId,
  onDelete,
}: WarehouseTableProps) {
  if (loading) {
    return <p>창고를 불러오는 중입니다.</p>
  }

  if (warehouses.length === 0) {
    return <p>등록된 창고가 없습니다.</p>
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>사용 설정</th>
            <th>삭제</th>
          </tr>
        </thead>

        <tbody>
          {warehouses.map((warehouse) => {
            const disabled =
              busyId === warehouse.warehouseId

            return (
              <tr key={warehouse.warehouseId}>
                <td>{warehouse.warehouseName}</td>

                <td>
                  {warehouse.isSet ? '사용' : '미사용'}
                </td>

                <td>
                  <button
                    className="delete-button"
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      void onDelete(warehouse)
                    }
                  >
                    {disabled ? '삭제 중...' : '삭제'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}