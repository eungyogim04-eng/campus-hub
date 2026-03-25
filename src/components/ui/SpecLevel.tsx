'use client'
import { useState, useEffect } from 'react'

interface SpecLevelProps {
  compact?: boolean
}

interface XPSource {
  label: string
  unitXP: number
  count: number
  totalXP: number
}

interface LevelInfo {
  level: number
  icon: string
  name: string
  minXP: number
  maxXP: number
  gradient: string
}

const LEVELS: LevelInfo[] = [
  { level: 1, icon: '🌱', name: '새내기', minXP: 0, maxXP: 99, gradient: 'linear-gradient(135deg, #a8e6cf, #88d8a8)' },
  { level: 2, icon: '🌿', name: '탐험가', minXP: 100, maxXP: 299, gradient: 'linear-gradient(135deg, #88d8a8, #56ab7b)' },
  { level: 3, icon: '🌳', name: '도전자', minXP: 300, maxXP: 599, gradient: 'linear-gradient(135deg, #56ab7b, #2D8A56)' },
  { level: 4, icon: '🔥', name: '실력자', minXP: 600, maxXP: 999, gradient: 'linear-gradient(135deg, #FB8C00, #d47a2a)' },
  { level: 5, icon: '👑', name: '스펙왕', minXP: 1000, maxXP: Infinity, gradient: 'linear-gradient(135deg, #f6d365, #FB8C00)' },
]

const XP_SOURCES: XPSource[] = [
  { label: '공모전 저장', unitXP: 10, count: 3, totalXP: 30 },
  { label: '자격증 취득', unitXP: 50, count: 3, totalXP: 150 },
  { label: '수료증 등록', unitXP: 30, count: 2, totalXP: 60 },
  { label: '후기 작성', unitXP: 20, count: 3, totalXP: 60 },
  { label: '커뮤니티 글', unitXP: 10, count: 5, totalXP: 50 },
  { label: '로드맵 체크', unitXP: 5, count: 8, totalXP: 40 },
]

const BONUS_XP = 100 // 7일 연속 접속

function getLevel(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i]
  }
  return LEVELS[0]
}

export default function SpecLevel({ compact = false }: SpecLevelProps) {
  const [showBreakdown, setShowBreakdown] = useState(false)

  const totalXP = XP_SOURCES.reduce((sum, s) => sum + s.totalXP, 0) + BONUS_XP
  const currentLevel = getLevel(totalXP)
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1)
  const nextLevelXP = nextLevel ? nextLevel.minXP : currentLevel.maxXP
  const prevLevelXP = currentLevel.minXP
  const progress = nextLevel
    ? ((totalXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100
    : 100

  if (compact) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 12px',
          borderRadius: 20,
          background: currentLevel.gradient,
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'default',
          position: 'relative',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={() => setShowBreakdown(true)}
        onMouseLeave={() => setShowBreakdown(false)}
      >
        <span>{currentLevel.icon}</span>
        <span>Lv.{currentLevel.level} {currentLevel.name}</span>
        <span style={{ fontSize: 11, opacity: 0.85, fontWeight: 400 }}>
          {totalXP} XP
        </span>

        {showBreakdown && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: 8,
              background: 'var(--sur)',
              border: '1px solid var(--bor)',
              borderRadius: 12,
              padding: 16,
              minWidth: 240,
              boxShadow: '0 8px 24px rgba(0,0,0,.12)',
              zIndex: 100,
              color: 'var(--txt)',
              fontWeight: 400,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
              XP 내역
            </div>
            {XP_SOURCES.map((s) => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  padding: '3px 0',
                  color: 'var(--tx2)',
                }}
              >
                <span>{s.label} ({s.count}회)</span>
                <span style={{ fontWeight: 500 }}>+{s.totalXP} XP</span>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                padding: '3px 0',
                color: '#FB8C00',
                fontWeight: 500,
              }}
            >
              <span>7일 연속 접속 보너스</span>
              <span>+{BONUS_XP} XP</span>
            </div>
            <div
              style={{
                borderTop: '1px solid var(--bor)',
                marginTop: 6,
                paddingTop: 6,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <span>합계</span>
              <span>{totalXP} XP</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Full card view
  return (
    <div
      className="card"
      style={{ padding: 20, position: 'relative', overflow: 'hidden' }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          fontSize: 80,
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        {currentLevel.icon}
      </div>

      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: 'var(--txt)' }}>
        🏅 스펙 레벨
      </div>

      {/* Level badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: currentLevel.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            boxShadow: '0 4px 12px rgba(0,0,0,.1)',
          }}
        >
          {currentLevel.icon}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--txt)' }}>
            Lv.{currentLevel.level} {currentLevel.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>
            {nextLevel
              ? `다음 레벨까지 ${nextLevelXP - totalXP} XP 남음`
              : '최고 레벨 달성!'}
          </div>
        </div>
      </div>

      {/* XP progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            color: 'var(--tx3)',
            marginBottom: 6,
          }}
        >
          <span>{totalXP} XP</span>
          <span>{nextLevel ? `${nextLevelXP} XP` : 'MAX'}</span>
        </div>
        <div
          style={{
            height: 8,
            borderRadius: 4,
            background: 'var(--sur2)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(progress, 100)}%`,
              borderRadius: 4,
              background: currentLevel.gradient,
              transition: 'width 1s ease',
            }}
          />
        </div>
      </div>

      {/* XP breakdown */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--txt)' }}>
          XP 내역
        </div>
        {XP_SOURCES.map((s) => (
          <div
            key={s.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 12,
              padding: '4px 0',
              color: 'var(--tx2)',
            }}
          >
            <span>
              {s.label}{' '}
              <span style={{ color: 'var(--tx3)' }}>
                ({s.unitXP} XP x {s.count})
              </span>
            </span>
            <span style={{ fontWeight: 500 }}>+{s.totalXP} XP</span>
          </div>
        ))}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12,
            padding: '4px 0',
            color: '#FB8C00',
            fontWeight: 500,
          }}
        >
          <span>7일 연속 접속 보너스</span>
          <span>+{BONUS_XP} XP</span>
        </div>
        <div
          style={{
            borderTop: '1px solid var(--bor)',
            marginTop: 6,
            paddingTop: 6,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--txt)',
          }}
        >
          <span>합계</span>
          <span>{totalXP} XP</span>
        </div>
      </div>
    </div>
  )
}
