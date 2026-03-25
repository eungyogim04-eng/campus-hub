'use client'

interface MobileTopbarProps {
  onMenuClick: () => void
}

export default function MobileTopbar({ onMenuClick }: MobileTopbarProps) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'var(--sur)', borderBottom: '.5px solid var(--bor2)',
      height: 52, padding: '0 16px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--p)' }}>✨ 스펙잇</div>
      <button
        onClick={onMenuClick}
        aria-label="메뉴 열기"
        style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        ☰
      </button>
    </div>
  )
}
