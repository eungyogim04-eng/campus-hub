'use client'
import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'

interface TimetableClass {
  id: string
  name: string
  professor: string
  room: string
  day: number
  startHour: number
  endHour: number
  color: string
}

const DEMO_CLASSES: TimetableClass[] = [
  { id: 't1', name: '컴퓨터구조론', professor: '김교수', room: '공학관 301', day: 1, startHour: 9, endHour: 11, color: '#4A7FC5' },
  { id: 't2', name: '알고리즘', professor: '이교수', room: '공학관 205', day: 3, startHour: 13, endHour: 15, color: '#2D8A56' },
  { id: 't3', name: '데이터베이스', professor: '박교수', room: '공학관 102', day: 2, startHour: 10, endHour: 12, color: '#1A5FA0' },
  { id: 't4', name: '영어회화', professor: '원어민교수', room: '인문관 401', day: 4, startHour: 14, endHour: 16, color: '#993C1D' },
  { id: 't5', name: '운영체제', professor: '최교수', room: '공학관 303', day: 1, startHour: 14, endHour: 16, color: '#7B3EA0' },
]

const DAYS = ['월', '화', '수', '목', '금']
const HOURS = Array.from({ length: 10 }, (_, i) => i + 9)
const COLOR_OPTIONS = ['#4A7FC5', '#2D8A56', '#1A5FA0', '#993C1D', '#7B3EA0', '#C73E6B']

export default function TimetablePage() {
  const { showToast } = useToast()
  const [classes, setClasses] = useState<TimetableClass[]>(DEMO_CLASSES)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    professor: '',
    room: '',
    day: '1',
    startHour: '9',
    endHour: '10',
    color: COLOR_OPTIONS[0],
  })

  const addClass = () => {
    if (!form.name.trim()) {
      showToast('⚠️ 수업명을 입력해주세요')
      return
    }
    const start = parseInt(form.startHour)
    const end = parseInt(form.endHour)
    if (end <= start) {
      showToast('⚠️ 종료시간은 시작시간보다 늦어야 합니다')
      return
    }
    const newClass: TimetableClass = {
      id: 't' + Date.now(),
      name: form.name.trim(),
      professor: form.professor.trim(),
      room: form.room.trim(),
      day: parseInt(form.day),
      startHour: start,
      endHour: end,
      color: form.color,
    }
    setClasses(prev => [...prev, newClass])
    setModalOpen(false)
    setForm({ name: '', professor: '', room: '', day: '1', startHour: '9', endHour: '10', color: COLOR_OPTIONS[0] })
    showToast(`📚 ${newClass.name} 수업 추가!`)
  }

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id))
    showToast('🗑️ 수업이 삭제되었습니다')
  }

  const totalClasses = classes.length
  const totalCredits = totalClasses * 3
  const daysWithClasses = new Set(classes.map(c => c.day))
  const freeDays = DAYS.filter((_, i) => !daysWithClasses.has(i + 1))

  const CELL_HEIGHT = 60
  const DAY_COL_WIDTH = 'minmax(0, 1fr)'

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-xl font-semibold">시간표 관리</div>
          <div className="text-[13px] text-[var(--tx3)] mt-0.5">이번 학기 수업 시간표를 관리하세요</div>
        </div>
        <button className="btn" onClick={() => setModalOpen(true)}>+ 수업 추가</button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="stat-card">
          <div className="stat-label">총 수업</div>
          <div className="stat-val">{totalClasses}개</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">총 학점</div>
          <div className="stat-val">{totalCredits}학점</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">공강 요일</div>
          <div className="stat-val" style={{ fontSize: 16 }}>{freeDays.length > 0 ? freeDays.join(', ') : '없음'}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `56px repeat(5, ${DAY_COL_WIDTH})`,
          borderBottom: '1px solid var(--bor)',
          background: 'var(--sur2)',
        }}>
          <div style={{ padding: '10px 0', textAlign: 'center', fontSize: 12, color: 'var(--tx3)', borderRight: '1px solid var(--bor)' }} />
          {DAYS.map(day => (
            <div key={day} style={{
              padding: '10px 0',
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--txt)',
              borderRight: '1px solid var(--bor)',
            }}>
              {day}
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `56px repeat(5, ${DAY_COL_WIDTH})`,
          position: 'relative',
        }}>
          {/* Time labels column */}
          <div>
            {HOURS.map(hour => (
              <div key={hour} style={{
                height: CELL_HEIGHT,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: 4,
                fontSize: 11,
                color: 'var(--tx3)',
                borderRight: '1px solid var(--bor)',
                borderBottom: '1px solid var(--bor)',
              }}>
                {hour}시
              </div>
            ))}
          </div>

          {/* Day columns with class blocks */}
          {DAYS.map((_, dayIdx) => {
            const dayClasses = classes.filter(c => c.day === dayIdx + 1)
            return (
              <div key={dayIdx} style={{ position: 'relative', borderRight: '1px solid var(--bor)' }}>
                {HOURS.map(hour => (
                  <div key={hour} style={{
                    height: CELL_HEIGHT,
                    borderBottom: '1px solid var(--bor)',
                  }} />
                ))}
                {dayClasses.map(cls => {
                  const top = (cls.startHour - 9) * CELL_HEIGHT
                  const height = (cls.endHour - cls.startHour) * CELL_HEIGHT
                  return (
                    <div
                      key={cls.id}
                      onClick={() => deleteClass(cls.id)}
                      title={`${cls.name} - ${cls.professor}\n${cls.room}\n클릭하여 삭제`}
                      style={{
                        position: 'absolute',
                        top,
                        left: 2,
                        right: 2,
                        height: height - 2,
                        background: cls.color,
                        color: '#fff',
                        borderRadius: 8,
                        padding: '6px 8px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        transition: 'opacity .15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>{cls.name}</div>
                      <div style={{ fontSize: 10, opacity: 0.9 }}>{cls.room}</div>
                      <div style={{ fontSize: 10, opacity: 0.8 }}>{cls.startHour}:00~{cls.endHour}:00</div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="📚 수업 추가" subtitle="시간표에 수업을 추가하세요">
        <div className="form-group">
          <label className="form-label">수업명 *</label>
          <input
            className="form-input"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="예: 컴퓨터구조론"
            autoFocus
          />
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">교수명</label>
            <input
              className="form-input"
              value={form.professor}
              onChange={e => setForm({ ...form, professor: e.target.value })}
              placeholder="예: 김교수"
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">강의실</label>
            <input
              className="form-input"
              value={form.room}
              onChange={e => setForm({ ...form, room: e.target.value })}
              placeholder="예: 공학관 301"
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">요일</label>
          <select className="form-input" value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>
            {DAYS.map((d, i) => (
              <option key={i} value={i + 1}>{d}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">시작시간</label>
            <select className="form-input" value={form.startHour} onChange={e => setForm({ ...form, startHour: e.target.value })}>
              {Array.from({ length: 9 }, (_, i) => i + 9).map(h => (
                <option key={h} value={h}>{h}:00</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">종료시간</label>
            <select className="form-input" value={form.endHour} onChange={e => setForm({ ...form, endHour: e.target.value })}>
              {Array.from({ length: 9 }, (_, i) => i + 10).map(h => (
                <option key={h} value={h}>{h}:00</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">색상</label>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {COLOR_OPTIONS.map(c => (
              <div
                key={c}
                onClick={() => setForm({ ...form, color: c })}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: c,
                  cursor: 'pointer',
                  border: form.color === c ? '3px solid var(--txt)' : '3px solid transparent',
                  transition: 'border .12s',
                }}
              />
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={() => setModalOpen(false)}>취소</button>
          <button className="btn" onClick={addClass}>✓ 추가</button>
        </div>
      </Modal>
    </div>
  )
}
