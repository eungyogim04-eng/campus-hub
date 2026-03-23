'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DATA } from '@/lib/data/items'
import { SpecItem, TYPE_LABELS } from '@/types'

const PAGES = [
  { title: '대시보드', path: '/dashboard', icon: '⊞', desc: '홈 화면' },
  { title: '공모전·자격증 탐색', path: '/discover', icon: '🔍', desc: '학과별 공모전·자격증' },
  { title: '내 일정', path: '/schedule', icon: '📅', desc: '일정 관리·캘린더' },
  { title: '스펙 관리', path: '/spec', icon: '🏆', desc: '진행중 스펙 현황' },
  { title: '학점 관리', path: '/grade', icon: '📝', desc: '성적·GPA 계산' },
  { title: '스펙 로드맵', path: '/roadmap', icon: '🗺️', desc: '학년별 추천 스펙' },
  { title: '후기 메모', path: '/review', icon: '✍️', desc: '지원 결과·회고' },
  { title: '장학금 관리', path: '/scholarships', icon: '🎓', desc: '장학금 수령·신청 관리' },
  { title: '피드백', path: '/feedback', icon: '📧', desc: '의견 보내기' },
  { title: '커뮤니티', path: '/community', icon: '💬', desc: '게시판·팀원 모집' },
]

export default function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const kw = query.toLowerCase().trim()

  // Search pages
  const matchedPages = kw
    ? PAGES.filter(p => p.title.toLowerCase().includes(kw) || p.desc.toLowerCase().includes(kw))
    : []

  // Search items across all departments
  const matchedItems: (SpecItem & { dept: string })[] = []
  if (kw) {
    for (const [dept, items] of Object.entries(DATA)) {
      for (const item of items) {
        if (
          item.title.toLowerCase().includes(kw) ||
          item.org.toLowerCase().includes(kw) ||
          item.desc.toLowerCase().includes(kw)
        ) {
          matchedItems.push({ ...item, dept })
          if (matchedItems.length >= 8) break
        }
      }
      if (matchedItems.length >= 8) break
    }
  }

  const hasResults = matchedPages.length > 0 || matchedItems.length > 0

  const handlePageClick = (path: string) => {
    router.push(path)
    setQuery('')
    setOpen(false)
  }

  const handleItemClick = (dept: string) => {
    router.push(`/discover?dept=${encodeURIComponent(dept)}`)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={ref} data-tour="search" style={{ position: 'relative', marginBottom: 20 }}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--tx3)' }}>🔍</span>
        <input
          ref={inputRef}
          type="text"
          placeholder="검색... (Ctrl+K)"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { if (query) setOpen(true) }}
          style={{
            width: '100%', padding: '10px 40px 10px 40px',
            border: '.5px solid var(--bor2)', borderRadius: 99,
            fontSize: 13, background: 'var(--sur)', color: 'var(--txt)',
            outline: 'none', transition: 'all .15s',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && matchedPages.length > 0) handlePageClick(matchedPages[0].path)
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false) }}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: 'var(--tx3)' }}
          >×</button>
        )}
      </div>

      {open && query && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: 'var(--sur)', border: '.5px solid var(--bor2)', borderRadius: 'var(--rad)',
          boxShadow: '0 8px 28px rgba(0,0,0,.12)', zIndex: 50,
          maxHeight: 380, overflowY: 'auto',
        }}>
          {!hasResults ? (
            <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--tx3)' }}>
              &quot;{query}&quot;에 대한 결과가 없습니다
            </div>
          ) : (
            <>
              {matchedPages.length > 0 && (
                <>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', padding: '8px 14px 4px', letterSpacing: '.06em', textTransform: 'uppercase', background: 'var(--sur2)' }}>
                    페이지
                  </div>
                  {matchedPages.map(p => (
                    <div
                      key={p.path}
                      onClick={() => handlePageClick(p.path)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                        cursor: 'pointer', borderBottom: '.5px solid var(--bor)',
                        transition: 'background .1s', fontSize: 13,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sur2)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, background: 'var(--pl)', flexShrink: 0 }}>{p.icon}</div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{p.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {matchedItems.length > 0 && (
                <>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', padding: '8px 14px 4px', letterSpacing: '.06em', textTransform: 'uppercase', background: 'var(--sur2)' }}>
                    공모전·자격증·대외활동
                  </div>
                  {matchedItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item.dept)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                        cursor: 'pointer', borderBottom: '.5px solid var(--bor)',
                        transition: 'background .1s', fontSize: 13,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sur2)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, background: item.bg || '#EEEDFE', flexShrink: 0 }}>{item.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>{item.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{item.org} · {item.dept}</div>
                      </div>
                      <span className={`badge ${item.type === 'contest' ? 'badge-coral' : item.type === 'cert' ? 'badge-amber' : 'badge-teal'}`} style={{ fontSize: 9 }}>
                        {TYPE_LABELS[item.type]}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
