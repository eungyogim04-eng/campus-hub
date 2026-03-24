'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'
import { SavedSchedule, TYPE_LABELS, DOT_COLORS } from '@/types'

function daysLeft(ds: string | null): number | null {
  if (!ds) return null
  const t = new Date(ds)
  if (isNaN(t.getTime())) return null
  const n = new Date(); n.setHours(0, 0, 0, 0)
  return Math.floor((t.getTime() - n.getTime()) / 86400000)
}

const CAT_EVENT: Record<string, { label: string; icon: string; bg: string; type: string }> = {
  contest: { label: '공모전', icon: '🏆', bg: '#FAECE7', type: 'contest' },
  cert: { label: '자격증', icon: '📜', bg: '#FAEEDA', type: 'cert' },
  activity: { label: '대외활동', icon: '🤝', bg: '#E1F5EE', type: 'activity' },
  class: { label: '수업·강의', icon: '📖', bg: '#EEEDFE', type: 'class' },
  exam: { label: '시험·과제', icon: '✏️', bg: '#FCEBEB', type: 'exam' },
  personal: { label: '개인', icon: '🗓️', bg: '#F1F0EC', type: 'personal' },
}

export default function SchedulePage() {
  const supabase = createClient()
  const { showToast } = useToast()
  const [schedules, setSchedules] = useState<SavedSchedule[]>([])
  const [view, setView] = useState<'list' | 'calendar'>('calendar')
  const [modalOpen, setModalOpen] = useState(false)
  const [cevCat, setCevCat] = useState('contest')
  const [cevTitle, setCevTitle] = useState('')
  const [cevOrg, setCevOrg] = useState('')
  const [cevDate, setCevDate] = useState('')
  const [cevMemo, setCevMemo] = useState('')
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const userRef = useRef<string | null>(null)

  useEffect(() => { loadSchedules() }, [])

  const DEMO_SCHEDULES = [
    { id: 'd1', item_id: 'demo1', item_data: { type: 'contest', title: 'SW중심대학 해커톤', org: '과학기술정보통신부', icon: '💻', bg: '#EEEDFE', diff: '보통' }, date: '2026-06-15', memo: '팀원 3명 구성 완료', alert_days: 7, dept: '공학·IT', created_at: '' },
    { id: 'd2', item_id: 'demo2', item_data: { type: 'cert', title: '정보처리기사 필기', org: '한국산업인력공단', icon: '🖥️', bg: '#EEEDFE', diff: '보통' }, date: '2026-05-09', memo: '', alert_days: 7, dept: '공학·IT', created_at: '' },
    { id: 'd3', item_id: 'demo3', item_data: { type: 'activity', title: '네이버 부스트캠프', org: '네이버 커넥트재단', icon: '🚀', bg: '#EAF3DE', diff: '보통' }, date: '2026-05-15', memo: 'AI 웹 과정', alert_days: 7, dept: '공학·IT', created_at: '' },
    { id: 'd4', item_id: 'demo4', item_data: { type: 'contest', title: 'CJ 마케팅 챌린지', org: 'CJ제일제당', icon: '🎯', bg: '#FAEEDA', diff: '보통' }, date: '2026-07-15', memo: '', alert_days: 7, dept: '경영·경제', created_at: '' },
  ]

  const loadSchedules = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    userRef.current = user?.id ?? null

    if (!user) {
      setSchedules(DEMO_SCHEDULES as any)
      return
    }

    const { data } = await supabase.from('schedules').select('*').eq('user_id', user.id).order('date', { ascending: true })
    if (data && data.length > 0) {
      setSchedules(data)
    } else {
      setSchedules(DEMO_SCHEDULES as any)
    }
  }

  const removeSchedule = async (id: string) => {
    if (id.startsWith('d') && id.length <= 3) { setSchedules(prev => prev.filter(s => s.id !== id)); return }
    await supabase.from('schedules').delete().eq('id', id)
    setSchedules(prev => prev.filter(s => s.id !== id))
  }

  const addCustomEvent = async () => {
    if (!cevTitle.trim() || !cevDate) { showToast('⚠️ 제목과 날짜를 입력해주세요'); return }
    const meta = CAT_EVENT[cevCat]
    const customItem = {
      id: 'custom_' + Date.now(),
      type: meta.type,
      title: cevTitle.trim(),
      org: cevOrg.trim() || meta.label,
      icon: meta.icon,
      bg: meta.bg,
      deadline: cevDate,
      diff: '보통' as const,
      url: '#',
      desc: cevMemo || meta.label + ' 일정',
      benefit: '',
    }
    const insertData: any = {
      item_id: customItem.id,
      item_data: customItem,
      date: cevDate,
      memo: cevMemo,
      alert_days: 7,
      dept: meta.label,
    }
    if (userRef.current) insertData.user_id = userRef.current
    await supabase.from('schedules').insert(insertData)
    setModalOpen(false)
    setCevTitle(''); setCevOrg(''); setCevMemo('')
    loadSchedules()
    showToast(`📌 "${cevTitle}" 일정 추가!`)
  }

  const moveMonth = (dir: number) => {
    if (dir === 0) { setCalYear(new Date().getFullYear()); setCalMonth(new Date().getMonth()); return }
    let m = calMonth + dir, y = calYear
    if (m > 11) { m = 0; y++ } else if (m < 0) { m = 11; y-- }
    setCalMonth(m); setCalYear(y)
  }

  // Calendar rendering
  const renderCalendar = () => {
    const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
    const today = new Date(); today.setHours(0,0,0,0)
    const firstDay = new Date(calYear, calMonth, 1).getDay()
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
    const daysInPrev = new Date(calYear, calMonth, 0).getDate()
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7

    const eventMap: Record<string, SavedSchedule[]> = {}
    schedules.forEach(s => {
      if (!s.date) return
      const d = new Date(s.date); d.setHours(0,0,0,0)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      if (!eventMap[key]) eventMap[key] = []
      eventMap[key].push(s)
    })

    const cells = []
    for (let i = 0; i < totalCells; i++) {
      let day: number, month: number, year: number, isOther = false
      if (i < firstDay) { day = daysInPrev - firstDay + i + 1; month = calMonth - 1; year = calYear; if (month < 0) { month = 11; year-- } isOther = true }
      else if (i >= firstDay + daysInMonth) { day = i - firstDay - daysInMonth + 1; month = calMonth + 1; year = calYear; if (month > 11) { month = 0; year++ } isOther = true }
      else { day = i - firstDay + 1; month = calMonth; year = calYear }

      const cellDate = new Date(year, month, day); cellDate.setHours(0,0,0,0)
      const isToday = cellDate.getTime() === today.getTime()
      const isSun = cellDate.getDay() === 0
      const isSat = cellDate.getDay() === 6
      const key = `${year}-${month}-${day}`
      const events = eventMap[key] || []

      let cls = 'cal-cell'
      if (isOther) cls += ' other-month'
      if (isToday) cls += ' today'
      if (isSun) cls += ' sun'
      if (isSat) cls += ' sat'

      cells.push(
        <div key={i} className={cls}>
          <div className="cal-cell-day">{day}</div>
          {events.slice(0, 2).map((e, ei) => (
            <div key={ei} className={`cal-chip ${e.item_data?.type || 'cert'}`} title={e.item_data?.title}>
              {(e.item_data?.title || '').length > 8 ? (e.item_data?.title || '').slice(0, 8) + '…' : e.item_data?.title}
            </div>
          ))}
          {events.length > 2 && <div className="text-[9px] text-[var(--tx3)] pl-0.5">+{events.length - 2}</div>}
        </div>
      )
    }

    return (
      <div className="grid md:grid-cols-[1fr_280px] gap-4 items-start">
        <div className="cal-container">
          <div className="cal-header">
            <div className="text-[15px] font-semibold">{calYear}년 {months[calMonth]}</div>
            <div className="flex gap-1.5">
              <button className="w-[30px] h-[30px] border border-[var(--bor2)] rounded-lg bg-[var(--sur)] cursor-pointer text-sm flex items-center justify-center hover:bg-[var(--sur2)]" onClick={() => moveMonth(-1)}>‹</button>
              <button className="h-[30px] border border-[var(--bor2)] rounded-lg bg-[var(--sur)] cursor-pointer text-[11px] px-2.5 hover:bg-[var(--sur2)]" onClick={() => moveMonth(0)}>오늘</button>
              <button className="w-[30px] h-[30px] border border-[var(--bor2)] rounded-lg bg-[var(--sur)] cursor-pointer text-sm flex items-center justify-center hover:bg-[var(--sur2)]" onClick={() => moveMonth(1)}>›</button>
            </div>
          </div>
          <div className="cal-weekdays">
            {['일','월','화','수','목','금','토'].map(w => <div key={w} className="cal-wd">{w}</div>)}
          </div>
          <div className="cal-body">{cells}</div>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="card" style={{ padding: '16px' }}>
            <div className="text-xs font-semibold text-[var(--tx2)] mb-3">범례</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs"><span className="cal-chip contest flex-shrink-0">공모전</span><span className="text-[var(--tx3)]">마감일</span></div>
              <div className="flex items-center gap-2 text-xs"><span className="cal-chip cert flex-shrink-0">자격증</span><span className="text-[var(--tx3)]">시험일</span></div>
              <div className="flex items-center gap-2 text-xs"><span className="cal-chip activity flex-shrink-0">대외활동</span><span className="text-[var(--tx3)]">마감일</span></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-xl font-semibold">내 일정</div>
          <div className="text-[13px] text-[var(--tx3)] mt-0.5">공모전·수업·시험·개인 일정을 한 곳에서 관리</div>
        </div>
        <button className="btn" onClick={() => { setCevDate(new Date().toISOString().split('T')[0]); setModalOpen(true) }}>+ 일정 추가</button>
      </div>

      {/* View Tabs */}
      <div className="flex border border-[var(--bor2)] rounded-lg overflow-hidden w-fit mb-5">
        <div className={`view-tab ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>📅 캘린더</div>
        <div className={`view-tab ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>📋 목록</div>
      </div>

      {view === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <div className="card-title">D-day 순 일정 <span className="text-[11px] text-[var(--tx3)] font-normal">{schedules.length}개</span></div>
            {schedules.length === 0 ? (
              <div className="empty"><div className="empty-ic">📭</div><p>탐색 페이지에서 일정을 추가해보세요</p></div>
            ) : (
              schedules.map(s => {
                const d = s.date ? new Date(s.date) : null
                const dl = daysLeft(s.date)
                const badgeCls = dl === null ? '' : dl < 0 ? 'badge-red' : dl <= 7 ? 'badge-coral' : dl <= 30 ? 'badge-amber' : 'badge-purple'
                const badgeText = dl === null ? '' : dl < 0 ? '마감' : `D-${dl}`
                return (
                  <div key={s.id} className="sched-item">
                    <div className="w-10 text-center flex-shrink-0">
                      <div className="text-[19px] font-semibold leading-none">{d ? d.getDate() : '—'}</div>
                      <div className="text-[9px] text-[var(--tx3)] uppercase">{d ? d.toLocaleString('en', { month: 'short' }).toUpperCase() : ''}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-medium">{s.item_data?.title}</div>
                      <div className="text-[11px] text-[var(--tx3)] mt-0.5">{s.dept} · {TYPE_LABELS[s.item_data?.type] || ''}</div>
                    </div>
                    {badgeText && <span className={`badge ${badgeCls}`}>{badgeText}</span>}
                    <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: DOT_COLORS[s.item_data?.type] || DOT_COLORS.cert }}></div>
                  </div>
                )
              })
            )}
          </div>
          <div className="card">
            <div className="card-title">저장 목록</div>
            {schedules.length === 0 ? (
              <div className="empty"><div className="empty-ic">📌</div><p>저장한 항목이 없습니다</p></div>
            ) : (
              schedules.map(s => (
                <div key={s.id} className="flex items-center gap-2.5 py-2 border-b border-[var(--bor)] last:border-b-0">
                  <div className="w-8 h-8 rounded-[9px] flex items-center justify-center text-sm flex-shrink-0" style={{ background: s.item_data?.bg || '#EEEDFE' }}>{s.item_data?.icon}</div>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{s.item_data?.title}</div>
                    <div className="text-[11px] text-[var(--tx3)]">{s.item_data?.org} · {s.date || '날짜 미정'}{s.memo ? ` · ${s.memo}` : ''}</div>
                  </div>
                  <button onClick={() => removeSchedule(s.id)} className="bg-transparent border-none text-[var(--tx3)] cursor-pointer text-[17px] leading-none p-1">×</button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        renderCalendar()
      )}

      {/* Custom Event Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="📌 일정 직접 추가" subtitle="카테고리를 선택하고 일정을 등록하세요">
        <div className="flex gap-1.5 flex-wrap mb-4">
          {Object.entries(CAT_EVENT).map(([key, val]) => (
            <div
              key={key}
              onClick={() => setCevCat(key)}
              className={`filter-chip ${cevCat === key ? 'active' : ''}`}
            >
              {val.icon} {val.label}
            </div>
          ))}
        </div>
        <div className="form-group">
          <label className="form-label">제목</label>
          <input className="form-input" value={cevTitle} onChange={e => setCevTitle(e.target.value)} placeholder="일정 제목" />
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">주관/장소</label>
            <input className="form-input" value={cevOrg} onChange={e => setCevOrg(e.target.value)} placeholder="주관 기관" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">날짜</label>
            <input className="form-input" type="date" value={cevDate} onChange={e => setCevDate(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">메모</label>
          <input className="form-input" value={cevMemo} onChange={e => setCevMemo(e.target.value)} placeholder="메모 (선택)" />
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={() => setModalOpen(false)}>취소</button>
          <button className="btn" onClick={addCustomEvent}>✓ 추가</button>
        </div>
      </Modal>
    </div>
  )
}
