import { useState } from 'react'
import type { Warehouse } from '../types/warehouse'

interface WarehouseTableProps {
  warehouses: Warehouse[]
  loading: boolean
  busyId: number | null

  onUpdateLocation: (
    warehouse: Warehouse,
    location: string,
  ) => Promise<boolean>

  onDelete: (
    warehouse: Warehouse,
  ) => Promise<void>
}

export function WarehouseTable({
  warehouses,
  loading,
  busyId,
  onUpdateLocation,
  onDelete,
}: WarehouseTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)

  const [editingLocation, setEditingLocation] = useState('')

  const startEditing = (warehouse: Warehouse) => {
    setEditingId(warehouse.warehouseId)
    setEditingLocation(warehouse.location)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingLocation('')
  }

  const saveLocation = async (
    warehouse: Warehouse,
  ) => {
    const location = editingLocation.trim()

    if (location === '') {
      return
    }

    const success = await onUpdateLocation(
      warehouse,
      location,
    )

    if (success) {
      cancelEditing()
    }
  }

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
            <th>위치</th>
            <th>사용 설정</th>
            <th>작업</th>
          </tr>
        </thead>

        <tbody>
          {warehouses.map((warehouse) => {
            const isEditing =
              editingId === warehouse.warehouseId

            const isBusy =
              busyId === warehouse.warehouseId

            return (
              <tr key={warehouse.warehouseId}>
                <td>{warehouse.warehouseName}</td>

                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingLocation}
                      disabled={isBusy}
                      onChange={(event) =>
                        setEditingLocation(
                          event.target.value,
                        )
                      }
                    />
                  ) : (
                    warehouse.location
                  )}
                </td>

                <td>
                  {warehouse.isSet ? '사용' : '미사용'}
                </td>

                <td>
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        disabled={
                          isBusy ||
                          editingLocation.trim() === ''
                        }
                        onClick={() =>
                          void saveLocation(warehouse)
                        }
                      >
                        {isBusy ? '처리 중...' : '저장'}
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={cancelEditing}
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() =>
                        startEditing(warehouse)
                      }
                    >
                      위치 수정
                    </button>
                  )}

                  <button
                    className="delete-button"
                    type="button"
                    style={{ backgroundColor: 'red' }}
                    disabled={busyId !== null}
                    onClick={() =>
                      void onDelete(warehouse)
                    }
                  >
                    {isBusy ? '처리 중...' : '삭제'}
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