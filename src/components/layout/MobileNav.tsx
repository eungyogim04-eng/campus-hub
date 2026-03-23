'use client'

import { usePathname, useRouter } from 'next/navigation'

const MOBILE_NAV_ITEMS = [
  { path: '/dashboard', icon: '🏠', label: '홈' },
  { path: '/schedule', icon: '📅', label: '일정' },
  { path: '/discover', icon: '🔍', label: '공모전' },
  { path: '/timetable', icon: '🕐', label: '시간표' },
  { path: '/community', icon: '💬', label: '커뮤니티' },
]

export default function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'var(--sur)', borderTop: '.5px solid var(--bor2)',
      padding: '6px 0 env(safe-area-inset-bottom, 6px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path
          return (
            <div
              key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 3, padding: '6px 12px', cursor: 'pointer', borderRadius: 'var(--rads)',
                flex: 1, transition: 'background .12s',
              }}
            >
              <span style={{ fontSize: 18, color: isActive ? 'var(--p)' : 'var(--tx3)' }}>
                {item.icon}
              </span>
              <span style={{ fontSize: 9, color: isActive ? 'var(--p)' : 'var(--tx3)', fontWeight: isActive ? 600 : 400 }}>
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
