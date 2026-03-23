'use client'

const ADS = [
  {
    title: '📚 에듀윌 자격증 패키지',
    desc: '정보처리기사·컴활 1급 합격보장반 50% 할인',
    cta: '자세히 보기',
    bg: 'linear-gradient(135deg, #EEEDFE, #E5F0FB)',
    color: 'var(--p)',
  },
  {
    title: '🎯 링커리어 공모전',
    desc: '이번 주 마감 공모전 TOP 10 확인하기',
    cta: '바로가기',
    bg: 'linear-gradient(135deg, #FAEEDA, #FAECE7)',
    color: 'var(--a)',
  },
  {
    title: '💼 잡코리아 인턴 채용관',
    desc: '대기업·공기업 인턴 모집 중 | 지금 지원하세요',
    cta: '채용 보기',
    bg: 'linear-gradient(135deg, #E1F5EE, #EAF3DE)',
    color: 'var(--t)',
  },
]

interface AdBannerProps {
  variant?: 'horizontal' | 'sidebar'
  index?: number
}

export default function AdBanner({ variant = 'horizontal', index = 0 }: AdBannerProps) {
  const ad = ADS[index % ADS.length]

  if (variant === 'sidebar') {
    return (
      <div style={{
        background: ad.bg, borderRadius: 'var(--rads)', padding: 14,
        marginTop: 8, cursor: 'pointer', transition: 'opacity .12s',
      }}>
        <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6, letterSpacing: '.05em' }}>AD</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: ad.color, marginBottom: 4 }}>{ad.title}</div>
        <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>{ad.desc}</div>
      </div>
    )
  }

  return (
    <div style={{
      background: ad.bg, borderRadius: 'var(--rad)', padding: '16px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 16, marginBottom: 16, cursor: 'pointer', transition: 'opacity .12s',
      flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--tx3)', letterSpacing: '.05em', background: 'rgba(255,255,255,.5)', padding: '1px 6px', borderRadius: 4 }}>AD</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: ad.color }}>{ad.title}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--tx2)' }}>{ad.desc}</div>
      </div>
      <div style={{
        background: ad.color, color: '#fff', fontSize: 12, fontWeight: 600,
        padding: '6px 16px', borderRadius: 8, whiteSpace: 'nowrap',
      }}>
        {ad.cta} →
      </div>
    </div>
  )
}

export function NativeAdCard() {
  const ad = ADS[Math.floor(Math.random() * ADS.length)]
  return (
    <div className="post-card" style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 8, fontWeight: 600, color: 'var(--tx3)', letterSpacing: '.05em', background: 'var(--sur2)', padding: '2px 6px', borderRadius: 4 }}>AD</span>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: ad.color }}>{ad.title}</div>
      <div style={{ fontSize: 13, color: 'var(--tx2)', marginBottom: 12 }}>{ad.desc}</div>
      <div style={{ fontSize: 12, color: ad.color, fontWeight: 600, cursor: 'pointer' }}>{ad.cta} →</div>
    </div>
  )
}
