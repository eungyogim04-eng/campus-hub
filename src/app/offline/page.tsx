'use client'

export default function OfflinePage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f7f6f3', fontFamily: "-apple-system,'Pretendard',sans-serif",
      padding: 24, textAlign: 'center',
    }}>
      <div>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📡</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1d1d1f', marginBottom: 8 }}>오프라인 상태</h1>
        <p style={{ fontSize: 15, color: '#6e6e73', marginBottom: 32, lineHeight: 1.6 }}>
          인터넷 연결을 확인해주세요.<br />연결되면 자동으로 복구됩니다.
        </p>
        <button
          onClick={() => typeof window !== 'undefined' && window.location.reload()}
          style={{
            fontSize: 15, fontWeight: 600, padding: '12px 32px', borderRadius: 9999,
            background: '#4A7FC5', color: '#fff', border: 'none', cursor: 'pointer',
          }}
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}
