'use client'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import ExportButton from '@/components/ui/ExportButton'

interface Certificate {
  id: string
  title: string
  issuer: string
  category: 'cert' | 'completion' | 'award' | 'license' | 'other'
  issueDate: string
  expiryDate: string | null
  credentialId: string
  imageUrl: string | null
  memo: string
}

const CATEGORY_META: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  cert: { label: '자격증', icon: '📜', color: '#1A5FA0', bg: 'var(--bl)' },
  completion: { label: '수료증', icon: '🎓', color: '#3B6D11', bg: 'var(--gl)' },
  award: { label: '수상', icon: '🏆', color: '#BA7517', bg: 'var(--al)' },
  license: { label: '면허/허가', icon: '🪪', color: '#7B3EA0', bg: 'var(--pl)' },
  other: { label: '기타', icon: '📎', color: '#6e6e73', bg: 'var(--sur2)' },
}

const DEMO_CERTS: Certificate[] = []

function daysUntil(date: string | null): number | null {
  if (!date) return null
  const d = new Date(date)
  const now = new Date(); now.setHours(0, 0, 0, 0)
  return Math.floor((d.getTime() - now.getTime()) / 86400000)
}

export default function CertificatesPage() {
  const { showToast } = useToast()
  const [certs, setCerts] = useState<Certificate[]>(DEMO_CERTS)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState<Certificate | null>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    title: '', issuer: '', category: 'cert' as Certificate['category'],
    issueDate: '', expiryDate: '', credentialId: '', memo: '',
  })

  const addCert = () => {
    if (!form.title.trim()) { showToast('⚠️ 자격증/수료증 이름을 입력해주세요'); return }
    const newCert: Certificate = {
      id: `c${Date.now()}`, title: form.title.trim(), issuer: form.issuer.trim(),
      category: form.category, issueDate: form.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: form.expiryDate || null, credentialId: form.credentialId, imageUrl: null, memo: form.memo,
    }
    setCerts(prev => [newCert, ...prev])
    setModalOpen(false)
    setForm({ title: '', issuer: '', category: 'cert', issueDate: '', expiryDate: '', credentialId: '', memo: '' })
    showToast(`📜 ${form.title} 추가 완료!`)
  }

  const deleteCert = (id: string) => {
    setCerts(prev => prev.filter(c => c.id !== id))
    setDetailOpen(null)
    showToast('🗑️ 삭제되었습니다')
  }

  const filtered = certs
    .filter(c => filter === 'all' || c.category === filter)
    .filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.issuer.toLowerCase().includes(search.toLowerCase()))

  const expiringSoon = certs.filter(c => {
    const d = daysUntil(c.expiryDate)
    return d !== null && d >= 0 && d <= 90
  })

  const categories = Object.entries(CATEGORY_META)

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-xl font-semibold">수료증·자격증 관리</div>
          <div className="text-[13px] text-[var(--tx3)] mt-0.5">취득한 자격증, 수료증, 수상 이력을 한 곳에서 정리하세요</div>
        </div>
        <div className="flex gap-2">
          <ExportButton
            data={certs}
            columns={[
              { key: 'title', label: '자격증/수료증명' },
              { key: 'issuer', label: '발급기관' },
              { key: 'category', label: '분류' },
              { key: 'issueDate', label: '취득일' },
              { key: 'expiryDate', label: '만료일' },
              { key: 'credentialId', label: '자격번호' },
            ]}
            filename="수료증_자격증_목록"
            title="수료증·자격증 관리 내역"
          />
          <button className="btn" onClick={() => { setForm({ ...form, issueDate: new Date().toISOString().split('T')[0] }); setModalOpen(true) }}>+ 추가</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="stat-card"><div className="stat-label">전체</div><div className="stat-val">{certs.length}</div></div>
        <div className="stat-card"><div className="stat-label">자격증</div><div className="stat-val" style={{ color: '#1A5FA0' }}>{certs.filter(c => c.category === 'cert').length}</div></div>
        <div className="stat-card"><div className="stat-label">수료증</div><div className="stat-val" style={{ color: '#3B6D11' }}>{certs.filter(c => c.category === 'completion').length}</div></div>
        <div className="stat-card">
          <div className="stat-label">만료 임박</div>
          <div className="stat-val" style={{ color: expiringSoon.length > 0 ? 'var(--c)' : 'var(--txt)' }}>{expiringSoon.length}</div>
          {expiringSoon.length > 0 && <div className="stat-sub">90일 이내</div>}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <div className="flex gap-1.5 flex-wrap flex-1">
          <div onClick={() => setFilter('all')} className={`filter-chip ${filter === 'all' ? 'active' : ''}`}>전체</div>
          {categories.map(([key, meta]) => (
            <div key={key} onClick={() => setFilter(key)} className={`filter-chip ${filter === key ? 'active' : ''}`}>
              {meta.icon} {meta.label}
            </div>
          ))}
        </div>
        <input
          type="text" placeholder="검색..." value={search} onChange={e => setSearch(e.target.value)}
          className="form-input" style={{ width: 160, padding: '6px 12px', fontSize: 12 }}
        />
      </div>

      {/* Expiry Warning */}
      {expiringSoon.length > 0 && (
        <div style={{ background: 'var(--al)', borderRadius: 'var(--rad)', padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--a)' }}>만료 임박 자격증</div>
            <div style={{ fontSize: 12, color: 'var(--tx2)' }}>
              {expiringSoon.map(c => {
                const d = daysUntil(c.expiryDate)
                return `${c.title} (D-${d})`
              }).join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Certificate List */}
      {filtered.length === 0 ? (
        <div className="empty"><div className="empty-ic">📜</div><p>등록된 자격증이 없습니다. + 추가 버튼으로 시작하세요</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(cert => {
            const meta = CATEGORY_META[cert.category] || CATEGORY_META.other
            const expiry = daysUntil(cert.expiryDate)
            const isExpired = expiry !== null && expiry < 0

            return (
              <div key={cert.id} onClick={() => setDetailOpen(cert)} style={{
                background: 'var(--sur)', borderRadius: 'var(--rad)', border: '1px solid var(--bor)',
                padding: 16, cursor: 'pointer', transition: 'box-shadow .2s, transform .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--pm)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cert.title}</span>
                      {isExpired && <span className="badge badge-coral" style={{ fontSize: 10 }}>만료</span>}
                      {expiry !== null && expiry >= 0 && expiry <= 90 && <span className="badge badge-amber" style={{ fontSize: 10 }}>D-{expiry}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{cert.issuer}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, fontSize: 11, color: 'var(--tx3)' }}>
                      <span style={{ background: meta.bg, padding: '2px 8px', borderRadius: 6, color: meta.color, fontWeight: 500 }}>{meta.label}</span>
                      <span>취득 {cert.issueDate.replace(/-/g, '.')}</span>
                      {cert.expiryDate && <span>· 만료 {cert.expiryDate.replace(/-/g, '.')}</span>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="📜 자격증·수료증 추가" subtitle="취득한 자격증이나 수료증 정보를 입력하세요">
        <div className="form-group">
          <label className="form-label">자격증/수료증명 *</label>
          <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="예: IT 자격증, 수료증" autoFocus />
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">발급기관</label>
            <input className="form-input" value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} placeholder="예: 발급 기관명" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">분류</label>
            <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Certificate['category'] })}>
              {categories.map(([key, meta]) => <option key={key} value={key}>{meta.icon} {meta.label}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">취득일</label>
            <input className="form-input" type="date" value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">만료일 (선택)</label>
            <input className="form-input" type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">자격번호 / 인증번호 (선택)</label>
          <input className="form-input" value={form.credentialId} onChange={e => setForm({ ...form, credentialId: e.target.value })} placeholder="예: 25-0012345" />
        </div>
        <div className="form-group">
          <label className="form-label">메모 (선택)</label>
          <textarea className="form-input" value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })} placeholder="성적, 후기 등 자유롭게 기록" rows={2} style={{ resize: 'vertical' }} />
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={() => setModalOpen(false)}>취소</button>
          <button className="btn" onClick={addCert}>✓ 추가</button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!detailOpen} onClose={() => setDetailOpen(null)} title={detailOpen?.title || ''} subtitle={detailOpen?.issuer || ''}>
        {detailOpen && (() => {
          const meta = CATEGORY_META[detailOpen.category] || CATEGORY_META.other
          const expiry = daysUntil(detailOpen.expiryDate)
          return (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ background: meta.bg, padding: '4px 12px', borderRadius: 8, color: meta.color, fontWeight: 500, fontSize: 12 }}>{meta.icon} {meta.label}</span>
                {expiry !== null && expiry < 0 && <span className="badge badge-coral">만료됨</span>}
                {expiry !== null && expiry >= 0 && expiry <= 90 && <span className="badge badge-amber">D-{expiry} 만료 임박</span>}
                {expiry === null && <span className="badge badge-teal">영구</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: 13, marginBottom: 16 }}>
                <div><div style={{ color: 'var(--tx3)', fontSize: 11, marginBottom: 2 }}>취득일</div>{detailOpen.issueDate.replace(/-/g, '.')}</div>
                <div><div style={{ color: 'var(--tx3)', fontSize: 11, marginBottom: 2 }}>만료일</div>{detailOpen.expiryDate ? detailOpen.expiryDate.replace(/-/g, '.') : '없음 (영구)'}</div>
                {detailOpen.credentialId && <div style={{ gridColumn: '1/-1' }}><div style={{ color: 'var(--tx3)', fontSize: 11, marginBottom: 2 }}>자격번호</div><span style={{ fontFamily: 'monospace', background: 'var(--sur2)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{detailOpen.credentialId}</span></div>}
              </div>
              {detailOpen.memo && (
                <div style={{ background: 'var(--sur2)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--tx2)', lineHeight: 1.6, marginBottom: 16 }}>
                  💡 {detailOpen.memo}
                </div>
              )}
              <div className="modal-actions">
                <button className="btn-ghost" style={{ color: 'var(--r)' }} onClick={() => deleteCert(detailOpen.id)}>🗑️ 삭제</button>
                <button className="btn" onClick={() => setDetailOpen(null)}>닫기</button>
              </div>
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}
