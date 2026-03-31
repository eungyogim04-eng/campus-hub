export default function MainLoading() {
  return (
    <div style={{ padding: '40px 0', textAlign: 'center' }}>
      <div style={{
        width: 32, height: 32, border: '3px solid rgba(0,0,0,.06)',
        borderTopColor: '#4A7FC5', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 12px',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ fontSize: 13, color: '#8e8e93' }}>로딩 중...</div>
    </div>
  )
}
