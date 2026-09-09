import { useState, type FormEvent } from 'react'
import type { CreateWarehouseRequest } from '../types/warehouse'

interface WarehouseCreateFormProps {
  loading: boolean
  onCreate: (
    request: CreateWarehouseRequest,
  ) => Promise<boolean>
}

export function WarehouseCreateForm({
  loading,
  onCreate,
}: WarehouseCreateFormProps) {
  const [warehouseName, setWarehouseName] = useState('')
  const [isSet, setIsSet] = useState(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const success = await onCreate({
      warehouseName,
      isSet,
    })

    if (success) {
      setWarehouseName('')
      setIsSet(false)
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

        <button type="submit" disabled={loading}>
          {loading ? '등록 중...' : '창고 등록'}
        </button>
      </form>
    </section>
  )
}