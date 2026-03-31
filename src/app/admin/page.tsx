'use client'

import { useState, useEffect, useMemo } from 'react'
import { useToast } from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'
import { createClient } from '@/lib/supabase/client'
import { DATA } from '@/lib/data/items'
import { SpecItem } from '@/types'
import { Promotion } from '@/lib/data/promotions'

const ADMIN_PASSWORD = 'campus2026'

const allItems: SpecItem[] = Object.values(DATA).flat()

interface Announcement {
  id: string
  title: string
  content: string
  date: string
  pinned: boolean
}

const defaultAnnouncements: Announcement[] = [
  { id: 'a1', title: '2026년 상반기 공모전 일정 업데이트', content: '2026년 상반기 주요 공모전 마감일이 업데이트되었습니다. 확인 부탁드립니다.', date: '2026-03-20', pinned: true },
  { id: 'a2', title: '자격증 시험 접수 안내', content: '정보처리기사, 토익 등 주요 자격증 시험 접수 기간을 확인하세요.', date: '2026-03-18', pinned: false },
  { id: 'a3', title: '시스템 점검 안내', content: '3월 25일 오전 2시~6시 시스템 점검이 예정되어 있습니다.', date: '2026-03-15', pinned: false },
]

type ItemFormData = {
  type: 'contest' | 'cert' | 'activity'
  title: string
  org: string
  desc: string
  benefit: string
  deadline: string
  icon: string
  diff: '쉬움' | '보통' | '어려움'
  url: string
}

const emptyForm: ItemFormData = {
  type: 'contest',
  title: '',
  org: '',
  desc: '',
  benefit: '',
  deadline: '',
  icon: '',
  diff: '보통',
  url: '',
}

export default function AdminPage() {
  const { showToast } = useToast()
  const supabase = createClient()

  /* ── Auth gate ── */
  const [authenticated, setAuthenticated] = useState(false)
  const [pwInput, setPwInput] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('campus-hub-admin-auth')
    if (saved === 'true') setAuthenticated(true)
  }, [])

  const handleLogin = () => {
    if (pwInput === ADMIN_PASSWORD) {
      setAuthenticated(true)
      localStorage.setItem('campus-hub-admin-auth', 'true')
    } else {
      showToast('비밀번호가 올바르지 않습니다')
    }
  }

  /* ── Tabs ── */
  const [tab, setTab] = useState<'content' | 'users' | 'notices' | 'promotions'>('content')

  /* ── Content tab state ── */
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'contest' | 'cert' | 'activity'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ItemFormData>(emptyForm)

  /* ── URL scrape state ── */
  const [scrapeUrl, setScrapeUrl] = useState('')
  const [scraping, setScraping] = useState(false)

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false
      if (search && !item.title.includes(search) && !item.org.includes(search)) return false
      return true
    })
  }, [search, typeFilter])

  /* ── Stats ── */
  const contestCount = allItems.filter(i => i.type === 'contest').length
  const certCount = allItems.filter(i => i.type === 'cert').length
  const activityCount = allItems.filter(i => i.type === 'activity').length

  /* ── Announcements ── */
  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements)
  const [noticeModalOpen, setNoticeModalOpen] = useState(false)
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', pinned: false })

  /* ── Promotions ── */
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [promoModalOpen, setPromoModalOpen] = useState(false)
  const [promoForm, setPromoForm] = useState<Omit<Promotion, 'id'>>({
    type: 'banner',
    badge: '광고',
    title: '',
    description: '',
    sponsor: '',
    linkUrl: '',
    imageUrl: '',
    category: 'contest',
    startDate: '',
    endDate: '',
    active: true,
  })

  useEffect(() => {
    const saved = localStorage.getItem('campus-hub-promotions')
    if (saved) {
      try { setPromotions(JSON.parse(saved)) } catch {}
    }
  }, [])

  const savePromotions = (list: Promotion[]) => {
    setPromotions(list)
    localStorage.setItem('campus-hub-promotions', JSON.stringify(list))
  }

  const handleAddPromotion = () => {
    if (!promoForm.title || !promoForm.sponsor) {
      showToast('제목과 스폰서/기관명을 입력해주세요')
      return
    }
    const newPromo: Promotion = {
      ...promoForm,
      id: `promo_${Date.now()}`,
    }
    savePromotions([newPromo, ...promotions])
    setPromoForm({
      type: 'banner', badge: '광고', title: '', description: '', sponsor: '',
      linkUrl: '', imageUrl: '', category: 'contest', startDate: '', endDate: '', active: true,
    })
    setPromoModalOpen(false)
    showToast('홍보 콘텐츠가 추가되었습니다')
  }

  const togglePromoActive = (id: string) => {
    savePromotions(promotions.map(p => p.id === id ? { ...p, active: !p.active } : p))
  }

  const deletePromotion = (id: string) => {
    savePromotions(promotions.filter(p => p.id !== id))
    showToast('홍보 콘텐츠가 삭제되었습니다')
  }

  /* ── Scrape handler ── */
  const handleScrape = async () => {
    if (!scrapeUrl.trim()) { showToast('URL을 입력해주세요'); return }
    setScraping(true)
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scrapeUrl.trim() }),
      })
      const data = await res.json()
      if (data.error) { showToast('❌ ' + data.error); return }

      setEditingId(null)
      setForm({
        type: data.type || 'contest',
        title: data.title || '',
        org: data.org || '',
        desc: data.description || '',
        benefit: data.benefit || '',
        deadline: data.deadline || '',
        icon: data.icon || '🏆',
        diff: data.diff || '보통',
        url: data.url || scrapeUrl,
      })
      setModalOpen(true)
      setScrapeUrl('')
      showToast('✅ 정보가 자동으로 추출되었습니다. 확인 후 저장하세요!')
    } catch {
      showToast('❌ URL을 불러오지 못했습니다')
    } finally {
      setScraping(false)
    }
  }

  /* ── Handlers ── */
  const openAddModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEditModal = (item: SpecItem) => {
    setEditingId(item.id)
    setForm({
      type: item.type as ItemFormData['type'],
      title: item.title,
      org: item.org,
      desc: item.desc,
      benefit: item.benefit,
      deadline: item.deadline,
      icon: item.icon,
      diff: item.diff,
      url: item.url,
    })
    setModalOpen(true)
  }

  const [dbItems, setDbItems] = useState<any[]>([])

  useEffect(() => { loadItems() }, [])
  const loadItems = async () => {
    const { data } = await supabase.from('items').select('*').order('created_at', { ascending: false })
    if (data) setDbItems(data)
  }

  const handleSave = async () => {
    if (!form.title || !form.org) { showToast('제목과 기관을 입력해주세요'); return }
    const itemData = {
      type: form.type, title: form.title, org: form.org,
      description: form.desc, benefit: form.benefit, deadline: form.deadline,
      icon: form.icon, diff: form.diff, url: form.url, bg: '#EEEDFE',
    }
    if (editingId && !editingId.startsWith('static-')) {
      const { error } = await supabase.from('items').update(itemData).eq('id', editingId)
      if (error) { showToast('수정 실패: ' + error.message); return }
      showToast('✅ 항목이 수정되었습니다')
    } else {
      const { error } = await supabase.from('items').insert(itemData)
      if (error) { showToast('추가 실패: ' + error.message); return }
      showToast('✅ 항목이 추가되어 사이트에 표시됩니다!')
    }
    setModalOpen(false)
    loadItems()
  }

  const handleDelete = async (item: any) => {
    if (item._source === 'static') { showToast('기본 데이터는 삭제할 수 없습니다'); return }
    const { error } = await supabase.from('items').delete().eq('id', item.id)
    if (error) { showToast('삭제 실패: ' + error.message); return }
    showToast('✅ 삭제되었습니다')
    loadItems()
  }

  const handleAddNotice = () => {
    if (!noticeForm.title) {
      showToast('제목을 입력해주세요')
      return
    }
    const newNotice: Announcement = {
      id: `a${Date.now()}`,
      title: noticeForm.title,
      content: noticeForm.content,
      date: new Date().toISOString().slice(0, 10),
      pinned: noticeForm.pinned,
    }
    setAnnouncements(prev => [newNotice, ...prev])
    setNoticeForm({ title: '', content: '', pinned: false })
    setNoticeModalOpen(false)
    showToast('공지사항이 추가되었습니다')
  }

  const togglePin = (id: string) => {
    setAnnouncements(prev =>
      prev.map(a => (a.id === id ? { ...a, pinned: !a.pinned } : a))
    )
  }

  const typeLabel = (t: string) => {
    switch (t) {
      case 'contest': return '공모전'
      case 'cert': return '자격증'
      case 'activity': return '대외활동'
      case 'scholarship': return '장학금'
      default: return t
    }
  }

  /* ── Password gate UI ── */
  if (!authenticated) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="card" style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <h2 style={{ marginBottom: 8 }}>관리자 로그인</h2>
          <p style={{ color: 'var(--sub)', marginBottom: 20 }}>관리자 비밀번호를 입력하세요</p>
          <div className="form-group">
            <input
              className="form-input"
              type="password"
              placeholder="비밀번호"
              value={pwInput}
              onChange={e => setPwInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <button className="btn" style={{ width: '100%' }} onClick={handleLogin}>로그인</button>
        </div>
      </div>
    )
  }

  /* ── Main admin panel ── */
  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>관리자 대시보드</h1>
        <span style={{
          background: 'var(--primary)',
          color: '#fff',
          fontSize: 12,
          fontWeight: 700,
          padding: '2px 10px',
          borderRadius: 8,
        }}>관리자</span>
      </div>
      <p style={{ color: 'var(--sub)', marginBottom: 28 }}>공모전·자격증·대외활동 및 사용자를 관리합니다</p>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: '총 공모전', value: contestCount, color: '#FF6B35' },
          { label: '총 자격증', value: certCount, color: '#4A90D9' },
          { label: '총 대외활동', value: activityCount, color: '#27AE60' },
          { label: '가입 사용자', value: 'Supabase 확인', color: '#8E44AD' },
        ].map(s => (
          <div className="card" key={s.label} style={{ textAlign: 'center', padding: '18px 12px' }}>
            <div style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid var(--border)' }}>
        {([
          { key: 'content' as const, label: '공모전/자격증/대외활동 관리' },
          { key: 'users' as const, label: '사용자 관리' },
          { key: 'notices' as const, label: '공지사항' },
          { key: 'promotions' as const, label: '홍보 관리' },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '10px 20px',
              fontWeight: tab === t.key ? 700 : 500,
              color: tab === t.key ? 'var(--primary)' : 'var(--sub)',
              borderBottom: tab === t.key ? '2px solid var(--primary)' : '2px solid transparent',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              marginBottom: -2,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Content management */}
      {tab === 'content' && (
        <>
          {/* URL auto-fill section */}
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>🔗 URL로 빠르게 추가</div>
            <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 12 }}>공모전/자격증 페이지 URL을 붙여넣으면 제목, 기관, 마감일 등을 자동으로 추출합니다</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="form-input"
                style={{ flex: 1 }}
                placeholder="https://www.example.com/contest/123"
                value={scrapeUrl}
                onChange={e => setScrapeUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScrape()}
              />
              <button className="btn" onClick={handleScrape} disabled={scraping} style={{ whiteSpace: 'nowrap' }}>
                {scraping ? '⏳ 추출 중...' : '🔍 자동 추출'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center' }}>
            <input
              className="form-input"
              placeholder="제목 또는 기관으로 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              {([
                { key: 'all' as const, label: '전체' },
                { key: 'contest' as const, label: '공모전' },
                { key: 'cert' as const, label: '자격증' },
                { key: 'activity' as const, label: '대외활동' },
              ]).map(f => (
                <button
                  key={f.key}
                  className="btn"
                  onClick={() => setTypeFilter(f.key)}
                  style={{
                    background: typeFilter === f.key ? 'var(--primary)' : 'var(--card)',
                    color: typeFilter === f.key ? '#fff' : 'var(--txt)',
                    fontSize: 13,
                    padding: '6px 14px',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button className="btn" onClick={openAddModal}>+ 항목 추가</button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>타입</th>
                  <th style={{ padding: '10px 8px' }}>제목</th>
                  <th style={{ padding: '10px 8px' }}>기관</th>
                  <th style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>마감일</th>
                  <th style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>난이도</th>
                  <th style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      background: idx % 2 === 0 ? 'transparent' : 'var(--card)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover, rgba(255,107,53,0.06))')}
                    onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'var(--card)')}
                  >
                    <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: item.type === 'contest' ? '#E8F0FA' : item.type === 'cert' ? '#E8F0FF' : item.type === 'activity' ? '#E8FFE8' : '#F0E8FF',
                        color: item.type === 'contest' ? '#D4530E' : item.type === 'cert' ? '#2B6CB0' : item.type === 'activity' ? '#1E7A1E' : '#6B21A8',
                      }}>
                        {typeLabel(item.type)}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px' }}>{item.icon} {item.title}</td>
                    <td style={{ padding: '10px 8px', color: 'var(--sub)' }}>{item.org}</td>
                    <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>{item.deadline}</td>
                    <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>{item.diff}</td>
                    <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>
                      <button
                        className="btn"
                        style={{ fontSize: 12, padding: '4px 10px', marginRight: 4 }}
                        onClick={() => openEditModal(item)}
                      >수정</button>
                      <button
                        className="btn"
                        style={{ fontSize: 12, padding: '4px 10px', background: '#e74c3c', color: '#fff' }}
                        onClick={() => handleDelete(item)}
                      >삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: 'var(--sub)', fontSize: 13, marginTop: 12 }}>
            총 {filteredItems.length}개 항목 표시 중 (전체 {allItems.length}개)
          </p>
        </>
      )}

      {/* Tab 2: User management */}
      {tab === 'users' && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <h3 style={{ marginBottom: 8 }}>사용자 관리</h3>
          <p style={{ color: 'var(--sub)', marginBottom: 20 }}>
            Supabase 대시보드에서 사용자를 관리할 수 있습니다
          </p>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ display: 'inline-block' }}
          >
            Supabase 대시보드 열기 →
          </a>
        </div>
      )}

      {/* Tab 3: Announcements */}
      {tab === 'notices' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>공지사항 관리</h3>
            <button className="btn" onClick={() => setNoticeModalOpen(true)}>+ 공지 추가</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {announcements.map(a => (
              <div className="card" key={a.id} style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {a.pinned && (
                      <span style={{ fontSize: 11, fontWeight: 700, background: '#FF6B35', color: '#fff', padding: '1px 8px', borderRadius: 6 }}>고정</span>
                    )}
                    <strong>{a.title}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--sub)' }}>{a.date}</span>
                    <button
                      className="btn"
                      style={{ fontSize: 11, padding: '3px 10px' }}
                      onClick={() => togglePin(a.id)}
                    >
                      {a.pinned ? '고정 해제' : '고정'}
                    </button>
                  </div>
                </div>
                <p style={{ color: 'var(--sub)', fontSize: 14, margin: 0 }}>{a.content}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tab 4: Promotions management */}
      {tab === 'promotions' && (
        <>
          <div className="card" style={{ padding: 16, marginBottom: 16, background: '#F0F5FA', border: '1px solid rgba(74,127,197,0.2)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>홍보 콘텐츠 관리</div>
            <div style={{ fontSize: 13, color: 'var(--sub)' }}>
              기업/기관에서 홍보를 의뢰한 콘텐츠를 관리합니다. 홍보 콘텐츠는 &apos;광고&apos; 또는 &apos;제휴&apos; 뱃지가 자동으로 표시됩니다.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>홍보 콘텐츠 목록 ({promotions.length}개)</h3>
            <button className="btn" onClick={() => setPromoModalOpen(true)}>+ 홍보 추가</button>
          </div>

          {promotions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📢</div>
              <div style={{ fontSize: 14, color: 'var(--sub)' }}>등록된 홍보 콘텐츠가 없습니다</div>
              <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 4 }}>위의 &quot;+ 홍보 추가&quot; 버튼으로 새로운 홍보를 등록하세요</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {promotions.map(p => (
                <div className="card" key={p.id} style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                        background: '#4A7FC5', color: '#fff',
                      }}>{p.badge}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
                        background: p.active ? '#E8FFE8' : '#FFE8E8',
                        color: p.active ? '#1E7A1E' : '#C0392B',
                      }}>{p.active ? '활성' : '비활성'}</span>
                      <strong style={{ fontSize: 14 }}>{p.title}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn"
                        style={{ fontSize: 11, padding: '3px 10px' }}
                        onClick={() => togglePromoActive(p.id)}
                      >
                        {p.active ? '비활성화' : '활성화'}
                      </button>
                      <button
                        className="btn"
                        style={{ fontSize: 11, padding: '3px 10px', background: '#e74c3c', color: '#fff' }}
                        onClick={() => deletePromotion(p.id)}
                      >삭제</button>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 4 }}>
                    스폰서: {p.sponsor} · 타입: {p.type === 'banner' ? '배너 광고' : p.type === 'featured' ? '추천 콘텐츠' : '스폰서 게시'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--tx3)' }}>
                    링크: <a href={p.linkUrl} target="_blank" rel="noopener noreferrer sponsored" style={{ color: 'var(--p)' }}>{p.linkUrl}</a>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>
                    기간: {p.startDate} ~ {p.endDate}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add/Edit item modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? '항목 수정' : '항목 추가'} width="520px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
          <div className="form-group">
            <label className="form-label">타입</label>
            <select
              className="form-input"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value as ItemFormData['type'] })}
            >
              <option value="contest">공모전</option>
              <option value="cert">자격증</option>
              <option value="activity">대외활동</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">제목</label>
            <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="항목 제목" />
          </div>
          <div className="form-group">
            <label className="form-label">기관</label>
            <input className="form-input" value={form.org} onChange={e => setForm({ ...form, org: e.target.value })} placeholder="주최 기관" />
          </div>
          <div className="form-group">
            <label className="form-label">설명</label>
            <input className="form-input" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="간단한 설명" />
          </div>
          <div className="form-group">
            <label className="form-label">혜택</label>
            <input className="form-input" value={form.benefit} onChange={e => setForm({ ...form, benefit: e.target.value })} placeholder="혜택 정보" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">마감일</label>
              <input className="form-input" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">아이콘 (이모지)</label>
              <input className="form-input" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="예: 💻" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">난이도</label>
            <select
              className="form-input"
              value={form.diff}
              onChange={e => setForm({ ...form, diff: e.target.value as ItemFormData['diff'] })}
            >
              <option value="쉬움">쉬움</option>
              <option value="보통">보통</option>
              <option value="어려움">어려움</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">URL</label>
            <input className="form-input" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
          </div>
          <div className="modal-actions">
            <button className="btn" style={{ background: 'var(--card)', color: 'var(--txt)' }} onClick={() => setModalOpen(false)}>취소</button>
            <button className="btn" onClick={handleSave}>{editingId ? '수정' : '추가'}</button>
          </div>
        </div>
      </Modal>

      {/* Add promotion modal */}
      <Modal open={promoModalOpen} onClose={() => setPromoModalOpen(false)} title="홍보 콘텐츠 추가" width="540px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">타입</label>
              <select
                className="form-input"
                value={promoForm.type}
                onChange={e => setPromoForm({ ...promoForm, type: e.target.value as Promotion['type'] })}
              >
                <option value="banner">배너 광고</option>
                <option value="featured">추천 콘텐츠</option>
                <option value="sponsored">스폰서 게시</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">뱃지</label>
              <select
                className="form-input"
                value={promoForm.badge}
                onChange={e => setPromoForm({ ...promoForm, badge: e.target.value })}
              >
                <option value="광고">광고</option>
                <option value="제휴">제휴</option>
                <option value="홍보">홍보</option>
                <option value="스폰서">스폰서</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">제목</label>
            <input className="form-input" value={promoForm.title} onChange={e => setPromoForm({ ...promoForm, title: e.target.value })} placeholder="홍보 콘텐츠 제목" />
          </div>
          <div className="form-group">
            <label className="form-label">설명</label>
            <textarea
              className="form-input"
              rows={3}
              value={promoForm.description}
              onChange={e => setPromoForm({ ...promoForm, description: e.target.value })}
              placeholder="홍보 콘텐츠 설명"
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">스폰서/기관명</label>
            <input className="form-input" value={promoForm.sponsor} onChange={e => setPromoForm({ ...promoForm, sponsor: e.target.value })} placeholder="기업 또는 기관 이름" />
          </div>
          <div className="form-group">
            <label className="form-label">링크 URL</label>
            <input className="form-input" value={promoForm.linkUrl} onChange={e => setPromoForm({ ...promoForm, linkUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">이미지 URL (선택)</label>
            <input className="form-input" value={promoForm.imageUrl || ''} onChange={e => setPromoForm({ ...promoForm, imageUrl: e.target.value })} placeholder="https://...image.png (선택사항)" />
          </div>
          <div className="form-group">
            <label className="form-label">카테고리</label>
            <select
              className="form-input"
              value={promoForm.category}
              onChange={e => setPromoForm({ ...promoForm, category: e.target.value as Promotion['category'] })}
            >
              <option value="contest">공모전</option>
              <option value="cert">자격증</option>
              <option value="activity">대외활동</option>
              <option value="general">일반</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">시작일</label>
              <input className="form-input" type="date" value={promoForm.startDate} onChange={e => setPromoForm({ ...promoForm, startDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">종료일</label>
              <input className="form-input" type="date" value={promoForm.endDate} onChange={e => setPromoForm({ ...promoForm, endDate: e.target.value })} />
            </div>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              id="promo-active-check"
              checked={promoForm.active}
              onChange={e => setPromoForm({ ...promoForm, active: e.target.checked })}
            />
            <label htmlFor="promo-active-check" className="form-label" style={{ margin: 0 }}>활성화</label>
          </div>
          <div className="modal-actions">
            <button className="btn" style={{ background: 'var(--card)', color: 'var(--txt)' }} onClick={() => setPromoModalOpen(false)}>취소</button>
            <button className="btn" onClick={handleAddPromotion}>추가</button>
          </div>
        </div>
      </Modal>

      {/* Add notice modal */}
      <Modal open={noticeModalOpen} onClose={() => setNoticeModalOpen(false)} title="공지사항 추가" width="480px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
          <div className="form-group">
            <label className="form-label">제목</label>
            <input className="form-input" value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })} placeholder="공지 제목" />
          </div>
          <div className="form-group">
            <label className="form-label">내용</label>
            <textarea
              className="form-input"
              rows={4}
              value={noticeForm.content}
              onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
              placeholder="공지 내용을 입력하세요"
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              id="pinned-check"
              checked={noticeForm.pinned}
              onChange={e => setNoticeForm({ ...noticeForm, pinned: e.target.checked })}
            />
            <label htmlFor="pinned-check" className="form-label" style={{ margin: 0 }}>상단 고정</label>
          </div>
          <div className="modal-actions">
            <button className="btn" style={{ background: 'var(--card)', color: 'var(--txt)' }} onClick={() => setNoticeModalOpen(false)}>취소</button>
            <button className="btn" onClick={handleAddNotice}>추가</button>
          </div>
        </div>
      </Modal>
    </>
  )
}
