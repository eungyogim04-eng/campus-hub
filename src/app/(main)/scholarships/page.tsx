'use client'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import ExportButton from '@/components/ui/ExportButton'

interface Scholarship {
  id: string
  name: string
  org: string
  amount: number
  semester: string
  type: '전액' | '반액' | '일부' | '생활비' | '기타'
  status: 'received' | 'applied' | 'rejected'
  memo: string
}

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  '전액': { bg: 'var(--gl)', color: '#3B6D11' },
  '반액': { bg: 'var(--bl)', color: '#1A5FA0' },
  '일부': { bg: 'var(--al)', color: '#BA7517' },
  '생활비': { bg: 'var(--pl)', color: '#7B3EA0' },
  '기타': { bg: 'var(--sur2)', color: 'var(--tx2)' },
}

const STATUS_META: Record<string, { label: string; cls: string }> = {
  received: { label: '수령 완료', cls: 'badge-teal' },
  applied: { label: '신청중', cls: 'badge-amber' },
  rejected: { label: '탈락', cls: 'badge-coral' },
}

const DEMO: Scholarship[] = [
  { id: 's1', name: '국가장학금 1유형', org: '한국장학재단', amount: 2250000, semester: '2026-1', type: '반액', status: 'received', memo: '3구간 선정' },
  { id: 's2', name: '교내 성적우수 장학금', org: '○○대학교', amount: 1500000, semester: '2025-2', type: '일부', status: 'received', memo: '학과 수석' },
  { id: 's3', name: '삼성꿈장학재단', org: '삼성꿈장학재단', amount: 5000000, semester: '2025-2', type: '전액', status: 'received', memo: '연간 장학금, 2년차' },
  { id: 's4', name: '국가장학금 2유형', org: '한국장학재단', amount: 1000000, semester: '2025-1', type: '일부', status: 'received', memo: '' },
  { id: 's5', name: 'KT&G 상상장학재단', org: 'KT&G', amount: 3000000, semester: '2026-1', type: '생활비', status: 'applied', memo: '서류 제출 완료' },
  { id: 's6', name: '관정이종환장학재단', org: '관정이종환장학재단', amount: 10000000, semester: '2026-1', type: '전액', status: 'rejected', memo: '면접 탈락' },
]

export default function ScholarshipsPage() {
  const { showToast } = useToast()
  const [items, setItems] = useState<Scholarship[]>(DEMO)
  const [modalOpen, setModalOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ name: '', org: '', amount: '', semester: '2026-1', type: '일부' as Scholarship['type'], status: 'received' as Scholarship['status'], memo: '' })

  const add = () => {
    if (!form.name.trim()) { showToast('⚠️ 장학금명을 입력해주세요'); return }
    const item: Scholarship = {
      id: `s${Date.now()}`, name: form.name.trim(), org: form.org.trim(),
      amount: parseInt(form.amount) || 0, semester: form.semester,
      type: form.type, status: form.status, memo: form.memo,
    }
    setItems(prev => [item, ...prev])
    setModalOpen(false)
    setForm({ name: '', org: '', amount: '', semester: '2026-1', type: '일부', status: 'received', memo: '' })
    showToast(`🎓 ${form.name} 추가 완료!`)
  }

  const del = (id: string) => { setItems(prev => prev.filter(s => s.id !== id)); showToast('🗑️ 삭제됨') }

  const filtered = filter === 'all' ? items : items.filter(s => s.status === filter)
  const received = items.filter(s => s.status === 'received')
  const totalReceived = received.reduce((s, i) => s + i.amount, 0)
  const semesterGroups: Record<string, Scholarship[]> = {}
  filtered.forEach(s => { if (!semesterGroups[s.semester]) semesterGroups[s.semester] = []; semesterGroups[s.semester].push(s) })

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-xl font-semibold">장학금 관리</div>
          <div className="text-[13px] text-[var(--tx3)] mt-0.5">받은 장학금과 신청 현황을 한눈에 관리하세요</div>
        </div>
        <div className="flex gap-2">
          <ExportButton data={items} columns={[{key:'semester',label:'학기'},{key:'name',label:'장학금명'},{key:'org',label:'지급기관'},{key:'type',label:'유형'},{key:'amount',label:'금액'},{key:'status',label:'상태'}]} filename="장학금내역" title="장학금 수령 내역" />
          <button className="btn" onClick={() => setModalOpen(true)}>+ 추가</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="stat-card">
          <div className="stat-label">총 수령액</div>
          <div className="stat-val" style={{ color: 'var(--t)', fontSize: 22 }}>{(totalReceived / 10000).toFixed(0)}만원</div>
        </div>
        <div className="stat-card"><div className="stat-label">수령 건수</div><div className="stat-val">{received.length}건</div></div>
        <div className="stat-card"><div className="stat-label">신청중</div><div className="stat-val" style={{ color: 'var(--a)' }}>{items.filter(s => s.status === 'applied').length}</div></div>
        <div className="stat-card">
          <div className="stat-label">학기당 평균</div>
          <div className="stat-val">{received.length > 0 ? Math.round(totalReceived / new Set(received.map(r => r.semester)).size / 10000) + '만원' : '—'}</div>
        </div>
      </div>

      {/* Chart - 학기별 수령액 */}
      <div className="card mb-5">
        <div className="card-title">학기별 수령 현황</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 100, marginTop: 12 }}>
          {['2024-2', '2025-1', '2025-2', '2026-1'].map(sem => {
            const total = items.filter(s => s.semester === sem && s.status === 'received').reduce((a, b) => a + b.amount, 0)
            const maxH = 80
            const h = totalReceived > 0 ? Math.max(4, (total / totalReceived) * maxH) : 4
            return (
              <div key={sem} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{total > 0 ? `${(total / 10000).toFixed(0)}만` : ''}</div>
                <div style={{ width: '100%', maxWidth: 48, height: h, background: total > 0 ? 'var(--p)' : 'var(--sur2)', borderRadius: 6, transition: 'height .3s' }} />
                <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{sem.replace('-', '.')}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {[{ key: 'all', label: '전체' }, { key: 'received', label: '✅ 수령' }, { key: 'applied', label: '⏳ 신청중' }, { key: 'rejected', label: '❌ 탈락' }].map(f => (
          <div key={f.key} onClick={() => setFilter(f.key)} className={`filter-chip ${filter === f.key ? 'active' : ''}`}>{f.label}</div>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty"><div className="empty-ic">🎓</div><p>장학금 내역이 없습니다</p></div>
      ) : (
        Object.entries(semesterGroups).sort((a, b) => b[0].localeCompare(a[0])).map(([sem, list]) => (
          <div key={sem} className="mb-4">
            <div className="text-[11px] font-semibold text-[var(--tx3)] mb-2 flex justify-between">
              <span>{sem.replace('-', '년 ')}학기</span>
              <span>합계 <b style={{ color: 'var(--p)' }}>{(list.filter(s => s.status === 'received').reduce((a, b) => a + b.amount, 0) / 10000).toFixed(0)}만원</b></span>
            </div>
            {list.map(s => {
              const tc = TYPE_COLORS[s.type] || TYPE_COLORS['기타']
              const sm = STATUS_META[s.status]
              return (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                  background: 'var(--sur)', borderRadius: 'var(--rad)', border: '1px solid var(--bor)',
                  marginBottom: 8,
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🎓</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>
                      {s.org} · <span style={{ background: tc.bg, color: tc.color, padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 500 }}>{s.type}</span>
                      {s.memo && <span> · {s.memo}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: s.status === 'received' ? 'var(--t)' : 'var(--tx2)' }}>{s.amount > 0 ? `${(s.amount / 10000).toFixed(0)}만원` : '—'}</div>
                    <span className={`badge ${sm.cls}`} style={{ fontSize: 10 }}>{sm.label}</span>
                  </div>
                  <button onClick={() => del(s.id)} style={{ background: 'none', border: 'none', color: 'var(--tx3)', cursor: 'pointer', fontSize: 15, padding: 4 }}>×</button>
                </div>
              )
            })}
          </div>
        ))
      )}

      {/* Add Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="🎓 장학금 추가" subtitle="받은 장학금이나 신청 현황을 기록하세요">
        <div className="form-group"><label className="form-label">장학금명 *</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="예: 국가장학금 1유형" autoFocus /></div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}><label className="form-label">지급기관</label><input className="form-input" value={form.org} onChange={e => setForm({ ...form, org: e.target.value })} placeholder="예: 한국장학재단" /></div>
          <div className="form-group" style={{ flex: 1 }}><label className="form-label">금액 (원)</label><input className="form-input" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="2250000" /></div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}><label className="form-label">학기</label><select className="form-input" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })}><option value="2026-1">2026년 1학기</option><option value="2025-2">2025년 2학기</option><option value="2025-1">2025년 1학기</option><option value="2024-2">2024년 2학기</option></select></div>
          <div className="form-group" style={{ flex: 1 }}><label className="form-label">유형</label><select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Scholarship['type'] })}><option value="전액">전액</option><option value="반액">반액</option><option value="일부">일부</option><option value="생활비">생활비</option><option value="기타">기타</option></select></div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}><label className="form-label">상태</label><select className="form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Scholarship['status'] })}><option value="received">수령 완료</option><option value="applied">신청중</option><option value="rejected">탈락</option></select></div>
          <div className="form-group" style={{ flex: 1 }}><label className="form-label">메모</label><input className="form-input" value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })} placeholder="선택사항" /></div>
        </div>
        <div className="modal-actions"><button className="btn-ghost" onClick={() => setModalOpen(false)}>취소</button><button className="btn" onClick={add}>✓ 추가</button></div>
      </Modal>
    </div>
  )
}
