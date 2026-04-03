'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ui/ThemeToggle'
import SemesterDday from '@/components/ui/SemesterDday'
import PromotionBanner from '@/components/ui/PromotionBanner'
import { createClient } from '@/lib/supabase/client'

const TODAY_EVENTS: { title: string; time: string; place: string; tag: string; tagColor: string }[] = []

const HOT_CONTESTS: { title: string; org: string; date: string; tag: string; dday: number }[] = []

const COMMUNITY_HOT: { title: string; tag: string; author: string; likes: number; comments: number; hot?: boolean }[] = []

/* Mini Calendar */
function MiniCalendar() {
  const now = new Date()
  const year = now.getFullYear(), month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = now.getDate()
  const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

  const eventDays = [15, 23, 24, 25, 27, 28, 30, 31]
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} style={{ height: 32 }} />)
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today
    const hasEvent = eventDays.includes(d)
    cells.push(
      <div key={d} style={{ height: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: isToday ? 700 : 400, color: isToday ? '#fff' : 'var(--txt)', position: 'relative' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: isToday ? '#4A7FC5' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{d}</div>
        {hasEvent && !isToday && <div style={{ position: 'absolute', bottom: 1, width: 4, height: 4, borderRadius: '50%', background: '#4A7FC5' }} />}
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{year}년 {months[month]}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 16, color: 'var(--tx3)', cursor: 'pointer' }}>‹</span>
          <span style={{ fontSize: 16, color: 'var(--tx3)', cursor: 'pointer' }}>›</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: 11, color: 'var(--tx3)', marginBottom: 4, gap: 0 }}>
        {['일','월','화','수','목','금','토'].map(w => <div key={w} style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: w === '일' ? '#4A7FC5' : w === '토' ? 'var(--b)' : 'var(--tx3)' }}>{w}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>{cells}</div>
    </div>
  )
}

export default function DashboardPage() {
  const [todayStr, setTodayStr] = useState('')
  const [userName, setUserName] = useState('사용자')
  const [scheduleCount, setScheduleCount] = useState(0)
  const [avgGpa, setAvgGpa] = useState('0.00')

  useEffect(() => {
    const d = new Date()
    const days = ['일', '월', '화', '수', '목', '금', '토']
    setTodayStr(`${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`)

    const supabase = createClient()

    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Fetch profile name
        const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single()
        if (profile?.name) {
          setUserName(profile.name)
        } else {
          const name = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자'
          setUserName(name)
        }

        // Fetch schedules count
        const { data: schedules } = await supabase.from('schedules').select('id').eq('user_id', user.id)
        if (schedules) {
          setScheduleCount(schedules.length)
        }

        // Fetch grades for GPA calculation
        const { data: grades } = await supabase.from('grades').select('grade, credits').eq('user_id', user.id)
        if (grades) {
          const totalCredits = grades.reduce((s: number, g: { grade: number; credits: number }) => s + g.credits, 0)
          const weightedSum = grades.reduce((s: number, g: { grade: number; credits: number }) => s + g.grade * g.credits, 0)
          if (totalCredits > 0) {
            setAvgGpa((weightedSum / totalCredits).toFixed(2))
          } else {
            setAvgGpa('0.00')
          }
        }
      }
    }

    loadData()
  }, [])

  return (
    <div style={{ animation: 'fadeIn .4s ease' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>안녕하세요, {userName}님 👋</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--tx3)', marginTop: 2 }}>오늘도 알찬 하루 보내세요!</div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/feedback" className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>📧 피드백</Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Promotion Banner */}
      <PromotionBanner />

      {/* Semester D-day */}
      <SemesterDday />

      {/* Row 1: Today Schedule + Mini Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 mb-5">
        {/* Today Schedule Card - Dark */}
        <div style={{ background: '#2C2C2C', borderRadius: 'var(--rad)', padding: 24, color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginBottom: 2 }}>오늘 일정</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{todayStr}</div>
            </div>
            <Link href="/schedule" style={{ fontSize: 12, color: '#4A7FC5', fontWeight: 500 }}>전체 보기 →</Link>
          </div>
          {TODAY_EVENTS.length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,.4)' }}>
              오늘 등록된 일정이 없습니다
            </div>
          ) : TODAY_EVENTS.map((ev, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: i > 0 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
              <div style={{ width: 4, height: 36, borderRadius: 2, background: ev.tagColor }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{ev.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginTop: 2 }}>🕐 {ev.time} · 📍 {ev.place}</div>
              </div>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: ev.tagColor, color: '#fff', fontWeight: 500 }}>{ev.tag}</span>
            </div>
          ))}
          <Link href="/schedule" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,.6)' }}>
            ⊕ 새 일정 추가
          </Link>
        </div>
        <MiniCalendar />
      </div>

      {/* Row 2: Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="stat-card"><div className="stat-label">총 장학금</div><div className="stat-val" style={{ color: 'var(--t)' }}>0<span className="text-[13px] font-normal">만원</span></div></div>
        <div className="stat-card"><div className="stat-label">저장된 일정</div><div className="stat-val">{scheduleCount}</div></div>
        <div className="stat-card"><div className="stat-label">평균 학점</div><div className="stat-val" style={{ color: 'var(--p)' }}>{avgGpa}</div></div>
        <div className="stat-card"><div className="stat-label">보유 자격증</div><div className="stat-val">0<span className="text-[13px] font-normal">건</span></div></div>
      </div>

      {/* Row 3: Hot Contests */}
      <div className="mb-5">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>진행 중인 공모전</div>
            <div style={{ fontSize: 12, color: 'var(--tx3)' }}>탐색 페이지에서 공모전을 확인하세요</div>
          </div>
          <Link href="/discover" style={{ fontSize: 12, color: 'var(--p)', fontWeight: 500 }}>더 보기 →</Link>
        </div>
        {HOT_CONTESTS.length === 0 ? (
          <div className="card" style={{ padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
            <div style={{ fontSize: 13, color: 'var(--tx3)' }}>탐색 페이지에서 공모전을 둘러보세요</div>
            <Link href="/discover" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: 'var(--p)', fontWeight: 500 }}>공모전 탐색하기 →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {HOT_CONTESTS.map((c, i) => (
              <Link key={i} href="/discover" className="card" style={{ padding: 0, overflow: 'hidden', transition: 'transform .2s, box-shadow .2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--pm)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '' }}
              >
                <div style={{ height: 120, background: ['#4A7FC5','#2D8A56','#1A5FA0'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: 40, opacity: 0.4 }}>{['🏆','🎨','💻'][i]}</span>
                  {i < 2 && <span style={{ position: 'absolute', top: 10, left: 10, background: '#4A7FC5', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>HOT</span>}
                  <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 16, cursor: 'pointer', opacity: 0.7 }}>🔖</span>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--p)', fontWeight: 600 }}>{c.tag}</span>
                    <span style={{ fontSize: 11, color: 'var(--c)', fontWeight: 600 }}>D-{c.dday}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--tx3)' }}>🏢 {c.org}</div>
                  <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>📅 {c.date}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Row 4: Community Hot */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              <span style={{ background: '#4A7FC5', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, marginRight: 8 }}>HOT</span>
              커뮤니티 인기 글
            </div>
            <div style={{ fontSize: 12, color: 'var(--tx3)' }}>커뮤니티에서 소통해보세요</div>
          </div>
          <Link href="/community" style={{ fontSize: 12, color: 'var(--p)', fontWeight: 500 }}>더 보기 →</Link>
        </div>
        {COMMUNITY_HOT.length === 0 ? (
          <div className="card" style={{ padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
            <div style={{ fontSize: 13, color: 'var(--tx3)' }}>커뮤니티에 첫 글을 작성해보세요</div>
            <Link href="/community" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: 'var(--p)', fontWeight: 500 }}>커뮤니티 가기 →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {COMMUNITY_HOT.map((post, i) => (
              <Link key={i} href="/community" className="card" style={{ padding: 16, transition: 'transform .2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--pm)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '' }}
              >
                <div style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'var(--pl)', color: 'var(--p)', fontWeight: 600 }}>{post.tag}</span>
                  {post.hot && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#FCEBEB', color: '#4A7FC5', fontWeight: 600 }}>🔥 HOT</span>}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{post.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--tx3)' }}>
                  <span>👤 {post.author}</span>
                  <span>·</span>
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  )
}
