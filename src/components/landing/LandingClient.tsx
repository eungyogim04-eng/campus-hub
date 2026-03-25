'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import Link from 'next/link'
import { HeroIllust, IconSearch, IconCalendar, IconGrade, IconRoadmap, IconCommunity, IconScholarship } from './Illustrations'

/* ─── Scroll Reveal (kakaopay-style: 100px up, 1s, cubic-bezier) ─── */
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(80px)',
      transition: `opacity 1s cubic-bezier(0,.21,.03,1) ${delay}s, transform 1s cubic-bezier(0,.21,.03,1) ${delay}s`,
    }}>
      {children}
    </div>
  )
}

/* ─── Highlight (kakaopay-style yellow underline) ─── */
function Hl({ children }: { children: ReactNode }) {
  return (
    <span style={{
      boxShadow: 'inset 0 -14px 0 rgba(49,130,246,.15)',
      paddingBottom: 2,
    }}>
      {children}
    </span>
  )
}

/* ─── Data ─── */
const ICONS = [IconSearch, IconCalendar, IconGrade, IconRoadmap, IconCommunity, IconScholarship]
const FEATURES = [
  { title: '학과 맞춤 탐색', desc: '12개 계열별 공모전·자격증·대외활동을 한눈에 탐색하세요.' },
  { title: 'D-day 일정관리', desc: '마감일 자동 계산과 캘린더로 중요한 일정을 놓치지 마세요.' },
  { title: '학점 계산기', desc: '과목별 성적을 입력하면 평균 학점과 분포를 바로 확인할 수 있어요.' },
  { title: '스펙 로드맵', desc: '1학년부터 4학년까지, 학년별 추천 스펙을 체크리스트로 관리하세요.' },
  { title: '커뮤니티', desc: '팀원 모집, 합격 후기, 정보 공유. 같은 목표의 동료를 만나세요.' },
  { title: '장학금 탐색', desc: '학과별 교외 장학금 정보와 마감일을 한눈에 확인하세요.' },
]

export default function LandingClient() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      background: '#fff', color: '#060b11',
      fontFamily: "'Pretendard','Noto Sans KR',-apple-system,sans-serif",
      letterSpacing: '-0.3px', lineHeight: 1.6, wordBreak: 'keep-all' as const,
    }}>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,.06)' : 'none',
        boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,.04)' : 'none',
        transition: 'all .4s',
      }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: 18, fontWeight: 700, color: '#060b11', display: 'flex', alignItems: 'center', gap: 8 }}>
            🎓 캠퍼스 허브
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link href="/auth/login" style={{ fontSize: 15, color: '#6e6e73', fontWeight: 500 }}>로그인</Link>
            <Link href="/auth/signup" style={{
              fontSize: 15, fontWeight: 600, padding: '10px 24px', borderRadius: 9999,
              background: '#3182f6', color: '#fff',
            }}>시작하기</Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ paddingTop: 180, paddingBottom: 60, textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px' }}>
          <Reveal>
            <h1 style={{
              fontSize: 'clamp(32px, 5.5vw, 56px)',
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: '-0.04em',
              color: '#060b11',
              marginBottom: 20,
            }}>
              <Hl>공모전, 자격증, 대외활동.</Hl><br />
              한 곳에서 관리하세요.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p style={{
              fontSize: 'clamp(15px, 1.8vw, 19px)',
              color: 'rgba(6,11,17,.56)',
              lineHeight: 1.65,
              marginBottom: 40,
              fontWeight: 300,
            }}>
              12개 학과 맞춤 정보부터 D-day 관리, 학점 계산, 스펙 로드맵까지.<br />
              대학생활에 필요한 모든 도구를 하나의 대시보드에서.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link href="/auth/signup" style={{
                fontSize: 17, fontWeight: 600, padding: '16px 40px', borderRadius: 9999,
                background: '#3182f6', color: '#fff', height: 56, display: 'inline-flex', alignItems: 'center',
                transition: 'all .25s',
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                무료로 시작하기
              </Link>
              <Link href="/dashboard" style={{
                fontSize: 17, fontWeight: 500, padding: '16px 40px', borderRadius: 9999,
                background: '#f2f3f5', color: '#060b11', height: 56, display: 'inline-flex', alignItems: 'center',
              }}>
                둘러보기
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Hero Illustration */}
        <Reveal delay={0.3}>
          <div style={{ maxWidth: 640, margin: '60px auto 0', padding: '0 24px', animation: 'float 6s ease-in-out infinite' }}>
            <HeroIllust />
          </div>
        </Reveal>
      </section>

      {/* ═══ FEATURES — 리스트형 ═══ */}
      <section style={{ padding: '160px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.035em', marginBottom: 14 }}>
                필요한 기능, <Hl>전부</Hl> 있어요.
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(6,11,17,.5)', fontWeight: 300 }}>대학생활에 필요한 모든 도구를 한 곳에서.</p>
            </div>
          </Reveal>

          {FEATURES.map((f, i) => {
            const Icon = ICONS[i]
            return (
              <Reveal key={f.title} delay={i * 0.06}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 28,
                  padding: '32px 0',
                  borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(0,0,0,.06)' : 'none',
                  borderLeft: '3px solid transparent',
                  paddingLeft: '20px',
                  transition: 'border-color .25s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderLeftColor = '#3182f6')}
                  onMouseLeave={e => (e.currentTarget.style.borderLeftColor = 'transparent')}
                >
                  <div style={{ flexShrink: 0 }}><Icon /></div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>{f.title}</h3>
                    <p style={{ fontSize: 15, color: 'rgba(6,11,17,.45)', lineHeight: 1.6, fontWeight: 300 }}>{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ═══ 중간 강조 배너 ═══ */}
      <section style={{ padding: '120px 24px', background: '#f8f9fa' }}>
        <Reveal>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <p style={{
              fontSize: 'clamp(22px, 3vw, 36px)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              lineHeight: 1.5,
            }}>
              흩어진 공모전 정보, 까먹는 마감일,<br />
              복잡한 학점 계산.<br />
              <span style={{ color: '#3182f6' }}>캠퍼스 허브 하나로 끝.</span>
            </p>
          </div>
        </Reveal>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ padding: '120px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <Reveal>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 48 }}>
              자주 묻는 질문
            </h2>
          </Reveal>
          {[
            { q: '정말 무료인가요?', a: '네. 모든 기능을 무료로 이용할 수 있습니다.' },
            { q: '어떤 학과를 지원하나요?', a: '인문, 사회, 경영, 공학, 자연과학, 예술, 의약, 교육, 법학, 미디어, 농림, 건축 등 12개 계열을 지원합니다.' },
            { q: '데이터는 어디서 오나요?', a: '큐넷, 링커리어, 각 기관 공식사이트에서 수집·검증합니다.' },
            { q: '모바일에서도 사용 가능한가요?', a: '반응형 웹앱이라 스마트폰, 태블릿 어디서든 사용 가능합니다.' },
          ].map((f, i) => (
            <Reveal key={f.q} delay={i * 0.06}>
              <div style={{
                background: '#f8f9fa', borderRadius: 16, padding: '24px 28px',
                marginBottom: 12,
              }}>
                <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{f.q}</div>
                <div style={{ fontSize: 15, color: 'rgba(6,11,17,.5)', lineHeight: 1.7, fontWeight: 300 }}>{f.a}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ padding: '100px 24px 120px', textAlign: 'center', background: '#f8f9fa' }}>
        <Reveal>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.035em', marginBottom: 16 }}>
            지금 바로 시작하세요.
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(6,11,17,.5)', marginBottom: 40, fontWeight: 300 }}>가입은 30초면 충분합니다.</p>
          <Link href="/auth/signup" style={{
            display: 'inline-flex', alignItems: 'center',
            fontSize: 17, fontWeight: 600,
            padding: '16px 44px', height: 56, borderRadius: 9999,
            background: '#3182f6', color: '#fff',
          }}>
            무료로 시작하기
          </Link>
        </Reveal>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: '1px solid rgba(0,0,0,.06)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: 13, color: '#8e8e93' }}>© 2026 캠퍼스 허브</div>
          <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#8e8e93' }}>
            <Link href="/terms" style={{ color: '#8e8e93' }}>이용약관</Link>
            <Link href="/privacy" style={{ color: '#8e8e93' }}>개인정보처리방침</Link>
            <a href="mailto:eungyogim04@gmail.com" style={{ color: '#8e8e93' }}>문의하기</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
      `}</style>
    </div>
  )
}
