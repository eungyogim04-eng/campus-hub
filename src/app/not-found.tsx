import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f7f6f3', fontFamily: "-apple-system,'Pretendard',sans-serif",
      padding: 24, textAlign: 'center',
    }}>
      <div>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎓</div>
        <h1 style={{ fontSize: 64, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.04em', marginBottom: 8 }}>404</h1>
        <p style={{ fontSize: 18, color: '#6e6e73', marginBottom: 40 }}>페이지를 찾을 수 없습니다</p>
        <Link href="/" style={{
          display: 'inline-flex', fontSize: 16, fontWeight: 600,
          padding: '14px 36px', borderRadius: 9999,
          background: '#3182f6', color: '#fff',
        }}>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
