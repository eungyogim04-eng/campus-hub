'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Shortcut {
  keys: string[]
  label: string
}

const NAV_SHORTCUTS: Shortcut[] = [
  { keys: ['G', 'H'], label: '홈(대시보드)으로 이동' },
  { keys: ['G', 'D'], label: '탐색 페이지' },
  { keys: ['G', 'S'], label: '일정 페이지' },
  { keys: ['G', 'C'], label: '커뮤니티' },
  { keys: ['G', 'I'], label: '인사이트' },
]

const GENERAL_SHORTCUTS: Shortcut[] = [
  { keys: ['Ctrl', 'K'], label: '검색 열기' },
  { keys: ['?'], label: '단축키 도움말' },
  { keys: ['Esc'], label: '모달/팝업 닫기' },
]

const NAV_ROUTES: Record<string, string> = {
  h: '/',
  d: '/explore',
  s: '/schedule',
  c: '/community',
  i: '/insights',
}

function KeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: '#f2f3f5',
        borderRadius: 6,
        padding: '2px 8px',
        fontFamily: 'monospace',
        fontSize: 12,
        border: '1px solid #ddd',
        lineHeight: '20px',
      }}
    >
      {children}
    </span>
  )
}

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let gPressedAt = 0

    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const tag = target.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || target.isContentEditable) {
        return
      }

      // Ctrl+K → open search
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="search"], input[placeholder*="검색"], input[data-search]'
        )
        if (searchInput) {
          searchInput.focus()
          searchInput.click()
        }
        return
      }

      // Escape → close modal
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }

      // '?' → toggle help
      if (e.key === '?') {
        e.preventDefault()
        setOpen((prev) => !prev)
        return
      }

      // 'g' → start sequence
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        gPressedAt = Date.now()
        return
      }

      // Check for G then X sequence (within 1 second)
      if (Date.now() - gPressedAt < 1000) {
        const route = NAV_ROUTES[e.key.toLowerCase()]
        if (route) {
          e.preventDefault()
          router.push(route)
          gPressedAt = 0
          return
        }
      }

      gPressedAt = 0
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  if (!open) return null

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          maxWidth: 480,
          width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          padding: '24px 28px',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            키보드 단축키
          </h2>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: '#888',
              padding: '4px 8px',
              lineHeight: 1,
            }}
            aria-label="닫기"
          >
            &times;
          </button>
        </div>

        {/* 탐색 */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#888',
              textTransform: 'uppercase',
              marginBottom: 8,
              letterSpacing: '0.05em',
            }}
          >
            탐색
          </div>
          {NAV_SHORTCUTS.map((s) => (
            <ShortcutRow key={s.label} shortcut={s} />
          ))}
        </div>

        {/* 일반 */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#888',
              textTransform: 'uppercase',
              marginBottom: 8,
              letterSpacing: '0.05em',
            }}
          >
            일반
          </div>
          {GENERAL_SHORTCUTS.map((s) => (
            <ShortcutRow key={s.label} shortcut={s} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ShortcutRow({ shortcut }: { shortcut: Shortcut }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 0',
      }}
    >
      <span style={{ fontSize: 14, color: '#333' }}>{shortcut.label}</span>
      <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {shortcut.keys.map((key, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && (
              <span style={{ fontSize: 11, color: '#aaa' }}>
                {shortcut.keys.length === 2 && key.length === 1 ? 'then' : '+'}
              </span>
            )}
            <KeyBadge>{key}</KeyBadge>
          </span>
        ))}
      </span>
    </div>
  )
}
