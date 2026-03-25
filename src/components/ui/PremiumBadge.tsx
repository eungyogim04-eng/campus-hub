'use client'

export default function PremiumBadge({ small = false }: { small?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      background: 'linear-gradient(135deg, #FB8C00, #F0A85C)',
      color: '#fff', fontSize: small ? 9 : 10,
      fontWeight: 700, padding: small ? '1px 6px' : '2px 8px',
      borderRadius: 99, letterSpacing: '.03em',
    }}>
      ✦ PRO
    </span>
  )
}

export function PremiumLock({ feature }: { feature: string }) {
  return (
    <div style={{
      background: 'var(--sur)', border: '.5px solid var(--bor)',
      borderRadius: 'var(--rad)', padding: '32px 24px',
      textAlign: 'center', position: 'relative',
    }}>
      <div style={{ fontSize: 40, marginBottom: 12, opacity: .3 }}>🔒</div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{feature}</div>
      <div style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 16, lineHeight: 1.6 }}>
        프리미엄 플랜에서 이용 가능합니다
      </div>
      <a href="/#pricing" className="btn" style={{ padding: '8px 20px', fontSize: 13 }}>
        ✦ 프리미엄 시작하기
      </a>
    </div>
  )
}
