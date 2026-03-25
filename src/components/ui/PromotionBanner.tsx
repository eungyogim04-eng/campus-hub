'use client'
import { useState, useEffect } from 'react'

interface Promotion {
  id: string
  type: string
  title: string
  description: string
  imageUrl?: string
  linkUrl: string
  sponsor: string
  badge: string
  active: boolean
  endDate: string
}

export default function PromotionBanner() {
  const [promotions, setPromotions] = useState<Promotion[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('campus-hub-promotions')
    if (saved) {
      const all = JSON.parse(saved)
      // Only show active promotions that haven't expired
      const now = new Date().toISOString().slice(0, 10)
      setPromotions(all.filter((p: Promotion) => p.active && p.endDate >= now))
    }
  }, [])

  if (promotions.length === 0) return null

  return (
    <div style={{ marginBottom: 16 }}>
      {promotions.map(p => (
        <a
          key={p.id}
          href={p.linkUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            display: 'block',
            padding: '14px 18px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #FFF8F0, #FFF3E6)',
            border: '1px solid rgba(232,145,58,0.2)',
            marginBottom: 8,
            textDecoration: 'none',
            color: 'inherit',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 4,
              background: '#E8913A',
              color: '#fff',
            }}>{p.badge}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>{p.sponsor} · {p.description.slice(0, 50)}</div>
            </div>
            <span style={{ fontSize: 12, color: 'var(--tx3)' }}>자세히 →</span>
          </div>
        </a>
      ))}
    </div>
  )
}
