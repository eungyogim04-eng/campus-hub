'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'

interface Goal {
  id: string
  title: string
  category: string
  deadline: string
  progress: number
  milestones: string[]
  completedMilestones: number[]
}

interface Habit {
  id: string
  title: string
  icon: string
  streak: number
  todayDone: boolean
}

const DEMO_GOALS: Goal[] = [
  { id: 'g1', title: '토익 900점 달성', category: '자격증', deadline: '2026-06-15', progress: 75, milestones: ['교재 구매', '단어장 1회독', '모의고사 5회', 'LC 파트 집중'], completedMilestones: [0, 1, 2] },
  { id: 'g2', title: '공모전 2개 수상', category: '공모전', deadline: '2026-08-31', progress: 50, milestones: ['팀 구성', '아이디어 기획', '제출', '수상'], completedMilestones: [0, 1] },
  { id: 'g3', title: '학점 4.0 이상', category: '학업', deadline: '2026-06-19', progress: 85, milestones: ['중간고사 A이상', '과제 100% 제출', '기말고사 A이상'], completedMilestones: [0, 1] },
]

const DEMO_HABITS: Habit[] = [
  { id: 'h1', title: '영어 단어 50개', icon: '📖', streak: 12, todayDone: true },
  { id: 'h2', title: '알고리즘 1문제', icon: '💻', streak: 7, todayDone: true },
  { id: 'h3', title: '운동 30분', icon: '🏃', streak: 3, todayDone: false },
  { id: 'h4', title: '독서 30분', icon: '📚', streak: 0, todayDone: false },
]

const WEEKLY_DATA: Record<string, boolean[]> = {
  'h1': [true, true, true, true, true, false, true],
  'h2': [true, false, true, true, true, true, true],
  'h3': [false, true, true, false, false, true, false],
  'h4': [true, false, false, true, false, false, false],
}

const CATEGORY_COLORS: Record<string, string> = {
  '자격증': '#1A5FA0',
  '공모전': '#E8913A',
  '학업': '#2D8A56',
  '기타': '#7B3EA0',
}

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

const EMOJI_OPTIONS = ['📖', '💻', '🏃', '📚', '✍️', '🧘']

function getDday(deadline: string) {
  const now = new Date()
  const target = new Date(deadline)
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff > 0) return `D-${diff}`
  if (diff === 0) return 'D-Day'
  return `D+${Math.abs(diff)}`
}

function CircularProgress({ progress, size = 60 }: { progress: number; size?: number }) {
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--sur2)" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8913A" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.3s' }} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 13, fontWeight: 600, fill: 'var(--tx)', transform: 'rotate(90deg)', transformOrigin: 'center' }}>{progress}%</text>
    </svg>
  )
}

export default function GoalsPage() {
  const { showToast } = useToast()
  const [goals, setGoals] = useState<Goal[]>(DEMO_GOALS)
  const [habits, setHabits] = useState<Habit[]>(DEMO_HABITS)
  const [weeklyData, setWeeklyData] = useState<Record<string, boolean[]>>(WEEKLY_DATA)
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [habitModalOpen, setHabitModalOpen] = useState(false)
  const [goalForm, setGoalForm] = useState({ title: '', category: '자격증', deadline: '', milestones: '' })
  const [habitForm, setHabitForm] = useState({ title: '', icon: '📖' })

  const toggleMilestone = (goalId: string, milestoneIdx: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g
      let completed = [...g.completedMilestones]
      if (completed.includes(milestoneIdx)) {
        completed = completed.filter(i => i !== milestoneIdx)
      } else {
        completed.push(milestoneIdx)
      }
      const progress = Math.round((completed.length / g.milestones.length) * 100)
      return { ...g, completedMilestones: completed, progress }
    }))
  }

  const toggleHabitToday = (habitId: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h
      const newDone = !h.todayDone
      const newStreak = newDone ? h.streak + 1 : Math.max(0, h.streak - 1)
      return { ...h, todayDone: newDone, streak: newStreak }
    }))
    setWeeklyData(prev => {
      const arr = [...(prev[habitId] || [false, false, false, false, false, false, false])]
      arr[6] = !arr[6]
      return { ...prev, [habitId]: arr }
    })
  }

  const addGoal = () => {
    if (!goalForm.title.trim()) { showToast('목표를 입력해주세요'); return }
    if (!goalForm.deadline) { showToast('마감일을 선택해주세요'); return }
    const milestones = goalForm.milestones.split('\n').map(s => s.trim()).filter(Boolean)
    const newGoal: Goal = {
      id: `g${Date.now()}`,
      title: goalForm.title.trim(),
      category: goalForm.category,
      deadline: goalForm.deadline,
      progress: 0,
      milestones,
      completedMilestones: [],
    }
    setGoals(prev => [...prev, newGoal])
    setGoalModalOpen(false)
    setGoalForm({ title: '', category: '자격증', deadline: '', milestones: '' })
    showToast('🎯 목표가 추가되었습니다!')
  }

  const addHabit = () => {
    if (!habitForm.title.trim()) { showToast('습관명을 입력해주세요'); return }
    const newHabit: Habit = {
      id: `h${Date.now()}`,
      title: habitForm.title.trim(),
      icon: habitForm.icon,
      streak: 0,
      todayDone: false,
    }
    setHabits(prev => [...prev, newHabit])
    setWeeklyData(prev => ({ ...prev, [newHabit.id]: [false, false, false, false, false, false, false] }))
    setHabitModalOpen(false)
    setHabitForm({ title: '', icon: '📖' })
    showToast('✅ 습관이 추가되었습니다!')
  }

  const completedToday = habits.filter(h => h.todayDone).length
  const maxStreak = Math.max(...habits.map(h => h.streak), 0)

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-xl font-semibold">목표 &amp; 습관</div>
          <div className="text-[13px] text-[var(--tx3)] mt-0.5">이번 학기 목표를 세우고 매일 실천하세요</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-label">진행 중 목표</div>
          <div className="stat-card-value">{goals.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">오늘 습관 완료</div>
          <div className="stat-card-value">{completedToday}/{habits.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">최장 연속 기록</div>
          <div className="stat-card-value">{maxStreak}일</div>
        </div>
      </div>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="md:!grid-cols-2">
        <style>{`.md\\:!grid-cols-2 { @media (min-width: 768px) { grid-template-columns: 1fr 1fr !important; } }`}</style>

        {/* Left - Goals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-base font-semibold">목표 관리</div>
            <button className="btn" onClick={() => setGoalModalOpen(true)} style={{ fontSize: 13, padding: '6px 14px' }}>+ 목표 추가</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {goals.map(goal => (
              <div key={goal.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{
                        background: CATEGORY_COLORS[goal.category] || CATEGORY_COLORS['기타'],
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 10px',
                        borderRadius: 99,
                      }}>{goal.category}</span>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{goal.title}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 10 }}>
                      마감: {goal.deadline} <span style={{ fontWeight: 600, color: '#E8913A', marginLeft: 6 }}>{getDday(goal.deadline)}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {goal.milestones.map((ms, idx) => {
                        const done = goal.completedMilestones.includes(idx)
                        return (
                          <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={done}
                              onChange={() => toggleMilestone(goal.id, idx)}
                              style={{ accentColor: '#E8913A' }}
                            />
                            <span style={{ textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--tx3)' : 'var(--tx)' }}>{ms}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                  <CircularProgress progress={goal.progress} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Habits */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-base font-semibold">습관 트래커</div>
            <button className="btn" onClick={() => setHabitModalOpen(true)} style={{ fontSize: 13, padding: '6px 14px' }}>+ 습관 추가</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {habits.map(habit => {
              const week = weeklyData[habit.id] || [false, false, false, false, false, false, false]
              return (
                <div key={habit.id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 22 }}>{habit.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{habit.title}</span>
                        {habit.streak > 0 && (
                          <span style={{ background: '#FFF3E6', color: '#C7621E', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99 }}>
                            🔥 {habit.streak}일
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 6 }}>
                        {week.map((done, i) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <div style={{
                              width: 14,
                              height: 14,
                              borderRadius: 3,
                              background: done ? '#E8913A' : 'var(--sur2)',
                              transition: 'background 0.2s',
                            }} />
                            <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{DAY_LABELS[i]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleHabitToday(habit.id)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: habit.todayDone ? '#2D8A56' : 'var(--sur2)',
                        color: habit.todayDone ? '#fff' : 'var(--tx3)',
                        transition: 'background 0.2s, color 0.2s',
                      }}
                    >
                      {habit.todayDone ? '✓' : '○'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      <Modal open={goalModalOpen} onClose={() => setGoalModalOpen(false)} title="목표 추가">
        <div className="form-group">
          <label className="form-label">목표</label>
          <input className="form-input" placeholder="달성할 목표를 입력하세요" value={goalForm.title} onChange={e => setGoalForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">카테고리</label>
          <select className="form-input" value={goalForm.category} onChange={e => setGoalForm(f => ({ ...f, category: e.target.value }))}>
            <option value="자격증">자격증</option>
            <option value="공모전">공모전</option>
            <option value="학업">학업</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">마감일</label>
          <input className="form-input" type="date" value={goalForm.deadline} onChange={e => setGoalForm(f => ({ ...f, deadline: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">마일스톤 (줄바꿈으로 구분)</label>
          <textarea className="form-input" rows={4} placeholder={'마일스톤 1\n마일스톤 2\n마일스톤 3'} value={goalForm.milestones} onChange={e => setGoalForm(f => ({ ...f, milestones: e.target.value }))} />
        </div>
        <div className="modal-actions">
          <button className="btn" style={{ background: 'var(--sur2)', color: 'var(--tx2)' }} onClick={() => setGoalModalOpen(false)}>취소</button>
          <button className="btn" onClick={addGoal}>추가</button>
        </div>
      </Modal>

      {/* Add Habit Modal */}
      <Modal open={habitModalOpen} onClose={() => setHabitModalOpen(false)} title="습관 추가">
        <div className="form-group">
          <label className="form-label">습관명</label>
          <input className="form-input" placeholder="추적할 습관을 입력하세요" value={habitForm.title} onChange={e => setHabitForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">아이콘</label>
          <select className="form-input" value={habitForm.icon} onChange={e => setHabitForm(f => ({ ...f, icon: e.target.value }))}>
            {EMOJI_OPTIONS.map(emoji => (
              <option key={emoji} value={emoji}>{emoji}</option>
            ))}
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn" style={{ background: 'var(--sur2)', color: 'var(--tx2)' }} onClick={() => setHabitModalOpen(false)}>취소</button>
          <button className="btn" onClick={addHabit}>추가</button>
        </div>
      </Modal>
    </div>
  )
}
