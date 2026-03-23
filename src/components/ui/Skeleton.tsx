'use client'

export function Skeleton({ width, height, radius = 5 }: { width?: string | number; height?: string | number; radius?: number }) {
  return (
    <div style={{
      width: width || '100%',
      height: height || 16,
      borderRadius: radius,
      background: 'linear-gradient(90deg, var(--sur2) 25%, var(--bor) 50%, var(--sur2) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  )
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton height={14} width="40%" />
      <Skeleton height={40} />
      <Skeleton height={12} width="70%" />
      <Skeleton height={12} width="55%" />
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Skeleton height={11} width="50%" />
      <Skeleton height={28} width="60%" radius={4} />
      <Skeleton height={11} width="40%" />
    </div>
  )
}

export function ItemCardSkeleton() {
  return (
    <div className="item-card">
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Skeleton width={40} height={40} radius={10} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton height={14} width="80%" />
          <Skeleton height={11} width="50%" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <Skeleton width={60} height={20} radius={20} />
        <Skeleton width={50} height={20} radius={20} />
      </div>
      <Skeleton height={12} />
      <Skeleton height={12} width="85%" />
      <Skeleton height={32} radius={8} />
    </div>
  )
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: '.5px solid var(--bor)' }}>
          <Skeleton width={36} height={36} radius={9} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton height={13} width="65%" />
            <Skeleton height={11} width="40%" />
          </div>
        </div>
      ))}
    </div>
  )
}
