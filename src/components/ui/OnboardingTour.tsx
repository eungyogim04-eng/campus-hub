'use client'
import { useState, useEffect } from 'react'

const STEPS = [
  { target: '[data-tour="search"]', title: '🔍 검색', desc: 'Ctrl+K로 어디서든 공모전·자격증을 빠르게 검색하세요.', pos: 'bottom' as const },
  { target: '[data-tour="nav-discover"]', title: '🎯 공모전·자격증 탐색', desc: '12개 학과별 맞춤 정보를 탐색해보세요.', pos: 'right' as const },
  { target: '[data-tour="nav-schedule"]', title: '📅 일정 관리', desc: '마감일을 캘린더로 한눈에 관리하세요.', pos: 'right' as const },
  { target: '[data-tour="nav-community"]', title: '💬 커뮤니티', desc: '팀원 모집, 후기 공유로 함께 성장하세요.', pos: 'right' as const },
  { target: '[data-tour="nav-community"]', title: '💬 커뮤니티 & 피드백', desc: '팀원 모집, 후기 공유, 그리고 의견도 보내주세요.', pos: 'right' as const },
]

export default function OnboardingTour() {
  const [step, setStep] = useState(-1)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const done = localStorage.getItem('tour_done')
    if (!done) {
      const timer = setTimeout(() => setStep(0), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return
    const el = document.querySelector(STEPS[step].target)
    if (el) {
      const rect = el.getBoundingClientRect()
      const s = STEPS[step]
      let top = 0, left = 0
      if (s.pos === 'bottom') { top = rect.bottom + 12; left = rect.left + rect.width / 2 - 150 }
      else if (s.pos === 'right') { top = rect.top - 10; left = rect.right + 12 }
      else { top = rect.top - 12; left = rect.left }
      setPos({ top: Math.max(8, top), left: Math.max(8, Math.min(left, window.innerWidth - 320)) })
    }
  }, [step])

  const close = () => { setStep(-1); localStorage.setItem('tour_done', '1') }
  const next = () => { if (step >= STEPS.length - 1) close(); else setStep(step + 1) }
  const prev = () => { if (step > 0) setStep(step - 1) }

  if (step < 0 || step >= STEPS.length) return null
  const s = STEPS[step]

  return (
    <>
      <div onClick={close} style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(2px)',
      }} />
      <div style={{
        position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999,
        background: 'var(--sur, #fff)', borderRadius: 14, padding: '20px 22px',
        boxShadow: '0 8px 32px rgba(0,0,0,.18)', maxWidth: 300, minWidth: 260,
        animation: 'tourIn .25s ease',
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{s.title}</div>
        <div style={{ fontSize: 13, color: 'var(--tx2, #666)', lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'var(--tx3, #999)' }}>{step + 1} / {STEPS.length}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={close} style={{
              background: 'transparent', border: 'none', fontSize: 12,
              color: 'var(--tx3, #999)', cursor: 'pointer', padding: '4px 8px',
            }}>건너뛰기</button>
            {step > 0 && <button onClick={prev} style={{
              background: 'var(--sur2, #f2f3f5)', border: 'none', borderRadius: 8,
              fontSize: 12, padding: '6px 12px', cursor: 'pointer', color: 'var(--txt, #333)',
            }}>이전</button>}
            <button onClick={next} style={{
              background: 'var(--p, #FB8C00)', color: '#fff', border: 'none',
              borderRadius: 8, fontSize: 12, fontWeight: 600, padding: '6px 14px', cursor: 'pointer',
            }}>{step >= STEPS.length - 1 ? '완료' : '다음'}</button>
          </div>
        </div>
        <style>{`@keyframes tourIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }`}</style>
      </div>
    </>
  )
}
