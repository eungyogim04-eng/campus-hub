'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Profile } from '@/types'

const NAV_ITEMS = [
  { group: null, groupIcon: '', items: [
    { path: '/dashboard', icon: '🏠', label: 'Home', tour: '' },
  ]},
  {
    group: '관리',
    groupIcon: '',
    items: [
      { path: '/schedule', icon: '📅', label: '일정관리', badge: true, tour: 'nav-schedule' },
      { path: '/discover', icon: '🔍', label: '공모전', tour: 'nav-discover' },
      { path: '/timetable', icon: '🕐', label: '시간표', tour: '' },
      { path: '/grade', icon: '📝', label: '학점관리', tour: '' },
      { path: '/goals', icon: '🎯', label: '목표·습관', tour: '' },
    ],
  },
  {
    group: '더보기',
    groupIcon: '',
    items: [
      { path: '/community', icon: '💬', label: '커뮤니티', tour: 'nav-community' },
      { path: '/studymate', icon: '🤝', label: '스터디메이트', tour: '' },
      { path: '/chat', icon: '✉️', label: '채팅', tour: '' },
      { path: '/roadmap', icon: '🗺️', label: '로드맵', tour: '' },
      { path: '/insights', icon: '📊', label: '인사이트', tour: '' },
    ],
  },
]

interface SidebarProps {
  profile: Profile | null
  mobileOpen?: boolean
  onClose?: () => void
  scheduleCount?: number
  isDesktop?: boolean
}

export default function Sidebar({ profile, mobileOpen, onClose, scheduleCount = 0, isDesktop }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleNav = (path: string) => {
    router.push(path)
    onClose?.()
  }

  const visible = isDesktop || mobileOpen

  return (
    <>
      {!isDesktop && mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 39 }}
          onClick={onClose}
        />
      )}
      <nav role="navigation" aria-label="메인 네비게이션" style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
        width: 220, background: 'var(--sur)', borderRight: '.5px solid var(--bor2)',
        display: 'flex', flexDirection: 'column', padding: '24px 0 16px',
        overflowY: 'auto', transition: 'transform .25s ease',
        transform: visible ? 'translateX(0)' : 'translateX(-100%)',
      }}>
        <div className="px-5 pb-6 text-base font-semibold flex items-center gap-2" style={{ color: '#C7621E' }}>
          <div style={{
            width: 30, height: 30, background: 'linear-gradient(135deg, #E8913A, #F0A85C)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
          }}>
            ✨
          </div>
          스펙잇
        </div>

        {NAV_ITEMS.map((group, gi) => (
          <div key={gi} style={{ padding: '0 12px', marginBottom: 2 }}>
            {group.group && (
              <div style={{ fontSize: 10, fontWeight: 500, color: '#B8860B', letterSpacing: '.07em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 4, marginTop: 16 }}>
                {group.groupIcon} {group.group}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.path
              return (
                <div
                  key={item.path}
                  role="link"
                  tabIndex={0}
                  aria-current={isActive ? 'page' : undefined}
                  {...(item.tour ? { 'data-tour': item.tour } : {})}
                  onClick={() => handleNav(item.path)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNav(item.path) } }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                    borderRadius: 'var(--rads)', cursor: 'pointer', fontSize: 13,
                    color: isActive ? '#C7621E' : 'var(--tx2)',
                    background: isActive ? '#FFF3E6' : 'transparent',
                    borderLeft: isActive ? '3px solid #E8913A' : '3px solid transparent',
                    fontWeight: isActive ? 500 : 400,
                    userSelect: 'none', transition: 'background .12s, border-left .12s',
                  }}
                >
                  <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
                  {item.label}
                  {'badge' in item && item.badge && scheduleCount > 0 && (
                    <span style={{ marginLeft: 'auto', background: '#E8913A', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 99 }}>
                      {scheduleCount}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}


        <div style={{ padding: '0 12px', borderTop: '.5px solid var(--bor)', paddingTop: 12 }}>
          <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }} onClick={onClose}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--rads)', cursor: 'pointer' }}>
              <div style={{
                width: 30, height: 30,
                background: 'linear-gradient(135deg, #F0A85C, #F5C882)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, color: '#7C4A12',
                boxShadow: '0 1px 3px rgba(232,145,58,0.25)',
              }}>
                {profile?.name?.[0] || '?'}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{profile?.name || '사용자'}</div>
                <div style={{ fontSize: 11, color: '#B8860B' }}>
                  {profile?.department || '계열 선택 전'}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </nav>
    </>
  )
}
