'use client'
import { useEffect } from 'react'
import { captureError } from '@/lib/errorReporting'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    captureError(error, { page: 'global', action: 'error-boundary' })
  }, [error])
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f7f6f3', fontFamily: "-apple-system,'Pretendard',sans-serif",
      padding: 24, textAlign: 'center',
    }}>
      <div>
        <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1d1d1f', marginBottom: 8 }}>문제가 발생했습니다</h1>
        <p style={{ fontSize: 15, color: '#6e6e73', marginBottom: 32, lineHeight: 1.6 }}>
          일시적인 오류가 발생했습니다.<br />잠시 후 다시 시도해주세요.
        </p>
        <button
          onClick={reset}
          style={{
            fontSize: 15, fontWeight: 600, padding: '12px 32px', borderRadius: 9999,
            background: '#1d1d1f', color: '#fff', border: 'none', cursor: 'pointer',
          }}
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}
