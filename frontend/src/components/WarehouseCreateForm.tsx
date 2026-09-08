import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from 'react'

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

  const [warehouses, setWarehouses] = useState<Warehouse[]>([])

  const [createLoading, setCreateLoading] = useState(false)
  const [listLoading, setListLoading] = useState(false)

  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadWarehouses = useCallback(async () => {
    setListLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/warehouse')

      if (!response.ok) {
        throw new Error(`목록 조회 실패: HTTP ${response.status}`)
      }

      const responseBody = (await response.json()) as Warehouse[]

      setWarehouses(responseBody)
    } catch (requestError) {
      const errorMessage =
        requestError instanceof Error
          ? requestError.message
          : '창고 목록을 불러오지 못했습니다.'

      setError(errorMessage)
    } finally {
      setListLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadWarehouses()
  }, [loadWarehouses])

  const handleSubmit = async (  event: FormEvent<HTMLFormElement>,  ) => {
    event.preventDefault()

    setCreateLoading(true)
    setError(null)
    setMessage(null)

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
        const responseMessage = Array.isArray(responseBody.message)
          ? responseBody.message.join(', ')
          : responseBody.message

        throw new Error(
          responseMessage ?? `HTTP ${response.status}`,
        )
      }

      setWarehouseName('')
      setIsSet(false)
      setMessage('창고가 등록되었습니다.')

      await loadWarehouses()
    } catch (requestError) {
      const errorMessage =
        requestError instanceof Error
          ? requestError.message
          : '창고 등록에 실패했습니다.'

      setError(errorMessage)
    } finally {
      setCreateLoading(false)
    }
  }

  return (
    <section>
      <h1>창고 등록</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
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

        <div className="checkbox-container">
          <label className="checkbox-label">
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

        <button type="submit" disabled={createLoading}>
          {createLoading ? '등록 중...' : '창고 등록'}
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <hr />

      <h2>등록된 창고</h2>

      {listLoading && <p>목록을 불러오는 중입니다...</p>}

      {!listLoading && warehouses.length === 0 && (
        <p>등록된 창고가 없습니다.</p>
      )}

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>사용 설정</th>
              {/*<th>위치</th>*/}
            </tr>
          </thead>
          <tbody>
            {warehouses.map((warehouse) => {

              return (
                <tr key={warehouse.warehouseId}>
                  <td>{warehouse.warehouseName}</td>
                  <td>{warehouse.isSet ? '사용' : '미사용'}</td>
                  {/*<td>{warehouse.location}</td>*/}
                </tr>
              )
            })}
          </tbody>
      </table>
      </div>
    </section>
  )
}

export default WarehouseCreateForm