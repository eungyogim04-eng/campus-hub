'use client'
import { useState, useEffect } from 'react'

const SEMESTER = {
  start: '2026-03-02',
  midtermStart: '2026-04-20',
  midtermEnd: '2026-04-24',
  finalStart: '2026-06-15',
  finalEnd: '2026-06-19',
  end: '2026-06-19',
  vacationStart: '2026-06-22',
  nextSemester: '2026-09-01',
}

const MILESTONES = [
  { key: 'midtermStart', label: '중간고사' },
  { key: 'finalStart', label: '기말고사' },
  { key: 'end', label: '종강' },
  { key: 'vacationStart', label: '방학' },
] as const

function daysBetween(a: string, b: string) {
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

function daysFromToday(target: string) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.floor((new Date(target).getTime() - now.getTime()) / 86400000)
}

export default function SemesterDday() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
  }, [])

  if (!now) return null

  const totalDays = daysBetween(SEMESTER.start, SEMESTER.end)
  const todayStr = now.toISOString().slice(0, 10)
  const elapsed = daysBetween(SEMESTER.start, todayStr)
  const progress = Math.min(100, Math.max(0, (elapsed / totalDays) * 100))

  // Build D-day items
  const ddayItems: { icon: string; label: string; days: number }[] = []

  const dMidterm = daysFromToday(SEMESTER.midtermStart)
  const dFinal = daysFromToday(SEMESTER.finalStart)
  const dEnd = daysFromToday(SEMESTER.end)
  const dVacation = daysFromToday(SEMESTER.vacationStart)

  if (dMidterm > 0) {
    ddayItems.push({ icon: '📝', label: '중간고사', days: dMidterm })
  }
  if (dFinal > 0) {
    ddayItems.push({ icon: '📋', label: '기말고사', days: dFinal })
  }
  ddayItems.push({ icon: '🎓', label: '종강', days: dEnd })
  ddayItems.push({ icon: '🌴', label: '방학', days: dVacation })

  // Milestone positions on the bar
  const milestonePositions = MILESTONES.map(m => ({
    label: m.label,
    pct: (daysBetween(SEMESTER.start, SEMESTER[m.key]) / totalDays) * 100,
  }))

  return (
    <div className="card" style={{ padding: '18px 20px', marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>📅 2026년 1학기 진행률</div>
        <div style={{ fontSize: 12, color: 'var(--tx3)', fontWeight: 500 }}>{Math.round(progress)}%</div>
      </div>

      {/* Progress bar with milestones */}
      <div style={{ position: 'relative', width: '100%', height: 8, background: 'var(--bg2, #eee)', borderRadius: 4, marginBottom: 18 }}>
        {/* Fill */}
        <div style={{ height: '100%', width: `${progress}%`, background: '#E8913A', borderRadius: 4, transition: 'width .6s ease' }} />
        {/* Current position marker */}
        <div style={{
          position: 'absolute', top: -3, left: `${progress}%`, transform: 'translateX(-50%)',
          width: 14, height: 14, borderRadius: '50%', background: '#E8913A', border: '2px solid #fff',
          boxShadow: '0 1px 4px rgba(0,0,0,.2)',
        }} />
        {/* Milestone dots */}
        {milestonePositions.map((m, i) => (
          <div key={i} style={{
            position: 'absolute', top: -2, left: `${Math.min(m.pct, 100)}%`, transform: 'translateX(-50%)',
            width: 12, height: 12, borderRadius: '50%', background: m.pct <= progress ? '#E8913A' : 'var(--bg2, #ddd)',
            border: '2px solid #fff', zIndex: 1,
          }}>
            <div style={{
              position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
              fontSize: 10, color: 'var(--tx3)', whiteSpace: 'nowrap', fontWeight: 500,
            }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Spacer for milestone labels */}
      <div style={{ height: 10 }} />

      {/* D-day items */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {ddayItems.map((item, i) => {
          const urgent = item.days >= 0 && item.days < 14
          const color = urgent ? '#E8913A' : '#2D8A56'
          const bg = urgent ? 'rgba(232,145,58,.1)' : 'rgba(45,138,86,.1)'
          const ddayText = item.days > 0 ? `D-${item.days}` : item.days === 0 ? 'D-Day' : `D+${Math.abs(item.days)}`
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 8, background: bg,
              fontSize: 13, fontWeight: 500,
            }}>
              <span>{item.icon}</span>
              <span style={{ color: 'var(--txt)' }}>{item.label}</span>
              <span style={{ color, fontWeight: 700 }}>{ddayText}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
