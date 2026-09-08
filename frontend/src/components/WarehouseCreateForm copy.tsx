import { useState, type FormEvent } from 'react'

type CreateWarehouseRequest = {
  warehouseName: string
  isSet: boolean
}

type Warehouse = {
  warehouseId: number
  warehouseName: string
  isSet: boolean
}

function WarehouseCreateForm() {
  const [warehouseName, setWarehouseName] = useState('')
  const [isSet, setIsSet] = useState(false)
  const [createdWarehouse, setCreatedWarehouse] = useState<Warehouse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (  event: FormEvent<HTMLFormElement>,    ) => {
    event.preventDefault()

    setLoading(true)
    setError(null)
    setCreatedWarehouse(null)

    const requestBody: CreateWarehouseRequest = {
      warehouseName,
      isSet,
    }

    try {
      const response = await fetch('/api/warehouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const responseBody = await response.json()

      if (!response.ok) {
        const message = Array.isArray(responseBody.message)
          ? responseBody.message.join(', ')
          : responseBody.message

        throw new Error(
          message ?? `HTTP ${response.status}`,
        )
      }

      setCreatedWarehouse(responseBody as Warehouse)
      setWarehouseName('')
      setIsSet(false)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : '창고 등록에 실패했습니다.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card">
      <h1>창고 등록</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="warehouseName">
            창고 이름
          </label>

          <input
            id="warehouseName"
            type="text"
            value={warehouseName}
            onChange={(event) =>
              setWarehouseName(event.target.value)
            }
            placeholder="예: 인천 제1 창고"
            required
          />
        </div>

        <div>
          <label htmlFor="isSet">
            <input
              id="isSet"
              type="checkbox"
              checked={isSet}
              onChange={(event) =>
                setIsSet(event.target.checked)
              }
            />
            사용 설정
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? '등록 중...' : '창고 등록'}
        </button>
      </form>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {createdWarehouse && (
        <div>
          <h2>등록 완료</h2>

          <p>
            ID: {createdWarehouse.warehouseId}
          </p>

          <p>
            창고명: {createdWarehouse.warehouseName}
          </p>

          <p>
            설정 여부:{' '}
            {createdWarehouse.isSet ? '설정' : '미설정'}
          </p>
        </div>
      )}
    </section>
  )
}

export default WarehouseCreateForm