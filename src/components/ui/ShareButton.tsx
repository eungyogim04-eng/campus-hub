'use client'
import { useState, useRef, useEffect } from 'react'

interface ShareButtonProps {
  title: string
  description: string
  url?: string
  className?: string
}

export default function ShareButton({ title, description, url, className = '' }: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const shareKakao = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    window.open(`https://sharer.kakao.com/talk/friends/picker/shorturl?url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=480,height=640')
    setOpen(false)
  }
  const shareTwitter = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=550,height=420')
    setOpen(false)
  }
  const copyLink = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
    setOpen(false)
  }
  const nativeShare = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (navigator.share) {
      await navigator.share({ title, text: description, url: shareUrl })
    }
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }} className={className}>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open) }}
        style={{
          background: 'var(--sur2)', border: 'none', borderRadius: 8, padding: '4px 10px',
          fontSize: 12, color: 'var(--tx3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        🔗 {copied ? '복사됨!' : '공유'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', bottom: '100%', right: 0, marginBottom: 6, zIndex: 100,
          background: 'var(--sur)', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,.15)',
          border: '1px solid var(--bor)', padding: 6, minWidth: 160,
        }}>
          {[
            { icon: '💬', label: '카카오톡', onClick: shareKakao },
            { icon: '🐦', label: 'X (Twitter)', onClick: shareTwitter },
            { icon: '📋', label: '링크 복사', onClick: copyLink },
            ...(typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? [{ icon: '📤', label: '공유하기', onClick: nativeShare }] : []),
          ].map(opt => (
            <button key={opt.label} onClick={opt.onClick} style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '8px 12px', border: 'none', background: 'transparent', borderRadius: 8,
              fontSize: 13, color: 'var(--txt)', cursor: 'pointer', textAlign: 'left',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--sur2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span>{opt.icon}</span><span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
