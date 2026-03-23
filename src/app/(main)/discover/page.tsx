'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'
import { DATA } from '@/lib/data/items'
import { DEPARTMENTS, TYPE_LABELS, TYPE_BADGE_CLASSES, DIFF_BADGE_CLASSES, SpecItem } from '@/types'

function daysLeft(ds: string | null): number | null {
  if (!ds) return null
  const t = new Date(ds)
  if (isNaN(t.getTime())) return null
  const n = new Date(); n.setHours(0, 0, 0, 0)
  return Math.floor((t.getTime() - n.getTime()) / 86400000)
}

export default function DiscoverPage() {
  const { profile } = useAuth()
  const { showToast } = useToast()
  const supabase = createClient()
  const [curDept, setCurDept] = useState<string>(profile?.department || '')
  const [curType, setCurType] = useState<string>('all')
  const [activeDiffs, setActiveDiffs] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingItem, setPendingItem] = useState<SpecItem | null>(null)
  const [modalDate, setModalDate] = useState('')
  const [modalMemo, setModalMemo] = useState('')
  const [modalAlert, setModalAlert] = useState('7')

  const items = useMemo(() => {
    if (!curDept) return []
    const pool = DATA[curDept] || []
    return pool.filter(it => {
      if (curType !== 'all' && it.type !== curType) return false
      if (activeDiffs.size > 0 && !activeDiffs.has(it.diff)) return false
      if (search) {
        const kw = search.toLowerCase()
        if (!it.title.toLowerCase().includes(kw) && !it.desc.toLowerCase().includes(kw) && !it.org.toLowerCase().includes(kw)) return false
      }
      return true
    })
  }, [curDept, curType, activeDiffs, search])

  const toggleDiff = (diff: string) => {
    setActiveDiffs(prev => {
      const next = new Set(prev)
      if (next.has(diff)) next.delete(diff)
      else next.add(diff)
      return next
    })
  }

  const openModal = (item: SpecItem) => {
    setPendingItem(item)
    setModalDate(item.deadline || '')
    setModalMemo('')
    setModalAlert('7')
    setModalOpen(true)
  }

  const confirmAdd = async () => {
    if (!pendingItem) return
    const { error } = await supabase.from('schedules').insert({
      item_id: pendingItem.id,
      item_data: pendingItem,
      date: modalDate || null,
      memo: modalMemo,
      alert_days: parseInt(modalAlert),
      dept: curDept,
    })
    if (!error) {
      setAddedIds(prev => new Set(prev).add(pendingItem.id))
      showToast(`📅 "${pendingItem.title}" 일정 추가!`)
    }
    setModalOpen(false)
    setPendingItem(null)
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-xl font-semibold">공모전 · 자격증 · 대외활동</div>
          <div className="text-[13px] text-[var(--tx3)] mt-0.5">학과 계열 선택 → 항목 클릭 → 일정 추가</div>
        </div>
      </div>

      {/* Dept Grid */}
      <div className="text-[11px] font-medium text-[var(--tx3)] mb-2 tracking-wider">학과 계열</div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-5">
        {DEPARTMENTS.map(dept => (
          <div
            key={dept.id}
            onClick={() => setCurDept(dept.id)}
            className={`dept-card ${curDept === dept.id ? 'active' : ''}`}
          >
            <span className="dept-em">{dept.emoji}</span>
            <div className="dept-nm">{dept.name}</div>
            <div className="dept-sub">{dept.sub}</div>
          </div>
        ))}
      </div>

      {/* Type Tabs */}
      <div className="flex gap-1.5 mb-3.5 flex-wrap">
        {[
          { key: 'all', label: '전체' },
          { key: 'contest', label: '🏆 공모전' },
          { key: 'cert', label: '📜 자격증' },
          { key: 'activity', label: '🤝 대외활동' },
          { key: 'scholarship', label: '🎓 장학금' },
        ].map(tab => (
          <div
            key={tab.key}
            onClick={() => setCurType(tab.key)}
            className={`type-tab ${curType === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3.5 flex-wrap items-center">
        <span className="text-[11px] font-semibold text-[var(--tx3)]">난이도</span>
        {['쉬움', '보통', '어려움'].map(diff => (
          <div
            key={diff}
            onClick={() => toggleDiff(diff)}
            className={`filter-chip ${diff === '쉬움' ? 'diff-easy' : diff === '보통' ? 'diff-med' : 'diff-hard'} ${activeDiffs.has(diff) ? 'active' : ''}`}
          >
            {diff === '쉬움' ? '🟢' : diff === '보통' ? '🟡' : '🔴'} {diff}
          </div>
        ))}
        <div className="flex-1 min-w-[160px]">
          <input
            className="form-input"
            placeholder="🔍 키워드 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Results Meta */}
      {curDept && (
        <div className="text-xs text-[var(--tx3)] mb-3">
          <span className="font-bold text-[var(--p)]">{curDept}</span> · {items.length}개
        </div>
      )}

      {/* Item Grid */}
      {!curDept ? (
        <div className="empty"><div className="empty-ic">🎓</div><p>위에서 학과 계열을 선택해주세요</p></div>
      ) : items.length === 0 ? (
        <div className="empty"><div className="empty-ic">🔍</div><p>검색 결과가 없습니다</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((it, i) => {
            const isSaved = addedIds.has(it.id)
            const d = daysLeft(it.deadline)
            const dlText = d === null ? it.deadline || '—' : d < 0 ? '마감됨' : d === 0 ? '오늘!' : `D-${d}`
            const dlHot = d !== null && d >= 0 && d <= 14

            return (
              <div key={it.id} className={`item-card ${isSaved ? 'added' : ''}`} style={{ opacity: 0, animation: 'cardIn .3s ease forwards', animationDelay: `${i * 0.03}s` }}>
                {isSaved && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-[var(--tl)] text-[var(--t)] rounded-full flex items-center justify-center text-[11px] font-bold">✓</div>
                )}
                <div className="flex gap-2.5 items-start">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg flex-shrink-0" style={{ background: it.bg || '#EEEDFE' }}>{it.icon}</div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold leading-snug">{it.title}</div>
                    <div className="text-[11px] text-[var(--tx3)] mt-0.5">{it.org}</div>
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap">
                  <span className={`badge ${TYPE_BADGE_CLASSES[it.type]}`}>{TYPE_LABELS[it.type]}</span>
                  <span className={`badge ${DIFF_BADGE_CLASSES[it.diff]}`}>{it.diff}</span>
                </div>
                <div className="text-xs text-[var(--tx2)] leading-relaxed">{it.desc}</div>
                <div className="text-[11px] p-2 bg-[var(--sur2)] rounded-lg">{it.benefit}</div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[11px]">
                    <span className="text-[var(--tx3)]">마감 </span>
                    <span className={`font-semibold ${dlHot ? 'text-[var(--c)]' : ''}`}>{dlText}</span>
                  </div>
                  {isSaved ? (
                    <button className="btn-ghost btn-sm" style={{ color: 'var(--t)', borderColor: 'var(--tm)' }} disabled>✓ 추가됨</button>
                  ) : (
                    <button className="btn btn-sm" onClick={() => openModal(it)}>+ 일정 추가</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Schedule Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="📅 일정에 추가" subtitle="마감일을 설정하고 내 일정에 등록하세요">
        {pendingItem && (
          <>
            <div className="bg-[var(--sur2)] rounded-lg p-3 mb-3.5 border-l-[3px] border-[var(--p)]">
              <div className="text-[13px] font-semibold mb-0.5">{pendingItem.title}</div>
              <div className="text-[11px] text-[var(--tx3)]">{pendingItem.org} · {TYPE_LABELS[pendingItem.type]}</div>
            </div>
            <div className="form-group">
              <label className="form-label">마감일 / 시험일</label>
              <input className="form-input" type="date" value={modalDate} onChange={e => setModalDate(e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">알림</label>
                <select className="form-input" value={modalAlert} onChange={e => setModalAlert(e.target.value)}>
                  <option value="7">1주일 전</option>
                  <option value="3">3일 전</option>
                  <option value="1">하루 전</option>
                  <option value="0">없음</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">메모</label>
                <input className="form-input" type="text" value={modalMemo} onChange={e => setModalMemo(e.target.value)} placeholder="준비 사항 등" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setModalOpen(false)}>취소</button>
              <button className="btn btn-teal" onClick={confirmAdd}>✓ 일정 추가</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
