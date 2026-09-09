import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import { WarehouseCreateForm } from '../components/WarehouseCreateForm'
import { WarehouseTable } from '../components/WarehouseTable'
import type {
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  Warehouse,
} from '../types/warehouse'

export function WarehousePage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])

  const [listLoading, setListLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [busyId, setBusyId] = useState<number | null>(null)

  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadWarehouses = useCallback(async () => {
    setListLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/warehouse')

      if (!response.ok) {
        throw new Error(
          `목록 조회 실패: HTTP ${response.status}`,
        )
      }

      const responseBody =
        (await response.json()) as Warehouse[]

      setWarehouses(responseBody)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : '창고 목록을 불러오지 못했습니다.',
      )
    } finally {
      setListLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadWarehouses()
  }, [loadWarehouses])

  const handleCreate = async (
    requestBody: CreateWarehouseRequest,
  ): Promise<boolean> => {
    setCreateLoading(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch('/api/warehouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(
          `창고 등록 실패: HTTP ${response.status}`,
        )
      }

      setMessage('창고가 등록되었습니다.')

      await loadWarehouses()

      return true
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : '창고 등록에 실패했습니다.',
      )

      return false
    } finally {
      setCreateLoading(false)
    }
  }

  const handleDelete = async (
    warehouse: Warehouse,
  ): Promise<void> => {
    const confirmed = window.confirm(
      `${warehouse.warehouseName}을(를) 삭제하시겠습니까?`,
    )

    if (!confirmed) {
      return
    }

    setBusyId(warehouse.warehouseId)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch(
        `/api/warehouse/${warehouse.warehouseId}`,
        {
          method: 'DELETE',
        },
      )

      if (!response.ok) {
        throw new Error(
          `창고 삭제 실패: HTTP ${response.status}`,
        )
      }

      setMessage('창고가 삭제되었습니다.')

      await loadWarehouses()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : '창고 삭제에 실패했습니다.',
      )
    } finally {
      setBusyId(null)
    }
  }

  const handleUpdateLocation = async (
    warehouse: Warehouse,
    location: string,
    ): Promise<boolean> => {
    setBusyId(warehouse.warehouseId)
    setMessage(null)
    setError(null)

    const requestBody: UpdateWarehouseRequest = {
        location,
    }

    try {
        const response = await fetch(
        `/api/warehouse/${warehouse.warehouseId}`,
        {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        },
        )

        if (!response.ok) {
        throw new Error(
            `창고 수정 실패: HTTP ${response.status}`,
        )
        }

        setMessage('창고 위치가 수정되었습니다.')

        await loadWarehouses()

        return true
    } catch (requestError) {
        setError(
        requestError instanceof Error
            ? requestError.message
            : '창고 위치 수정에 실패했습니다.',
        )

        return false
    } finally {
        setBusyId(null)
    }
    }
    

  return (
    <main>
      <WarehouseCreateForm
        loading={createLoading}
        onCreate={handleCreate}
      />

      {message && <p>{message}</p>}
      {error && <p className="error">{error}</p>}

      <hr />

      <section>
        <h2>등록된 창고</h2>

        <WarehouseTable
            warehouses={warehouses}
            loading={listLoading}
            busyId={busyId}
            onUpdateLocation={handleUpdateLocation}
            onDelete={handleDelete}
        />
      </section>
    </main>
  )
}