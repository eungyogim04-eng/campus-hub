'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { ToastProvider } from '@/components/ui/Toast'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import MobileTopbar from '@/components/layout/MobileTopbar'
import GlobalSearch from '@/components/ui/GlobalSearch'
import PageTransition from '@/components/ui/PageTransition'
import { Profile } from '@/types'

const KeyboardShortcuts = dynamic(() => import('@/components/ui/KeyboardShortcuts'), { ssr: false })
const OnboardingTour = dynamic(() => import('@/components/ui/OnboardingTour'), { ssr: false })

const DEMO_PROFILE: Profile = {
  id: 'demo',
  name: '김민준',
  department: '공학·IT',
  avatar_url: null,
  onboarded: true,
  created_at: new Date().toISOString(),
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <ToastProvider>
      <style>{`
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        .sr-only.focus\\:not-sr-only:focus { position: static; width: auto; height: auto; padding: 0.5rem 1rem; margin: 0; overflow: visible; clip: auto; white-space: normal; background: var(--p); color: #fff; z-index: 100; font-size: 14px; }
      `}</style>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <a href="#main-content" className="sr-only focus:not-sr-only">본문 바로가기</a>
        {!isDesktop && (
          <MobileTopbar onMenuClick={() => setMobileOpen(!mobileOpen)} />
        )}
        <Sidebar
          profile={DEMO_PROFILE}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          isDesktop={isDesktop}
        />
        <main id="main-content" style={{
          marginLeft: isDesktop ? 220 : 0,
          flex: 1,
          padding: isDesktop ? '32px' : '16px',
          paddingTop: isDesktop ? '32px' : '70px',
          paddingBottom: isDesktop ? '56px' : '80px',
        }}>
          <GlobalSearch />
          <PageTransition>{children}</PageTransition>
        </main>
        {!isDesktop && <MobileNav />}
        <KeyboardShortcuts />
        <OnboardingTour />
      </div>
    </ToastProvider>
  )
}
