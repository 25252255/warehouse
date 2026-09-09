import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { WarehousePage } from './pages/WarehousePage'

type DatabaseStatus = {
  connected: boolean
  version: string
  database: string
}

function App() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const checkDatabase = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/db-health')

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = (await response.json()) as DatabaseStatus
      setStatus(data)
    } catch (requestError) {
      setStatus(null)
      setError(
        requestError instanceof Error
          ? requestError.message
          : '알 수 없는 오류가 발생했습니다.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void checkDatabase()
  }, [checkDatabase])

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">WAREHOUSE PRACTICE</p>
        <h1>연결 상태</h1>
        <p className="flow">React → NestJS → MySQL</p>

        <div className={`status ${status?.connected ? 'success' : 'waiting'}`}>
          <span className="dot" aria-hidden="true" />
          {loading && '데이터베이스 연결 확인 중...'}
          {!loading && status?.connected && '데이터베이스 연결 성공'}
          {!loading && error && '데이터베이스 연결 실패'}
        </div>

        {status && (
          <dl>
            <div>
              <dt>MySQL 버전</dt>
              <dd>{status.version}</dd>
            </div>
            <div>
              <dt>데이터베이스</dt>
              <dd>{status.database}</dd>
            </div>
          </dl>
        )}

        {error && <p className="error">{error}</p>}

        <button type="button" onClick={() => void checkDatabase()} disabled={loading}>
          다시 확인
        </button><hr /><hr />


        <WarehousePage />
      </section>
    </main>
  )
}

export default App
