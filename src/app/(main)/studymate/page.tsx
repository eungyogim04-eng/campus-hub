'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'

interface Mate {
  id: string
  name: string
  dept: string
  year: number
  avatar: string
  status: 'online' | 'offline'
  bio: string
  interests: string[]
  sharedSpecs: string[]
  matched: boolean
}

const INITIAL_MATES: Mate[] = [
  { id: 'm1', name: '이서연', dept: '경영·경제', year: 3, avatar: '🧑‍🎓', status: 'online', bio: '마케팅 공모전 함께 준비할 팀원 찾아요!', interests: ['마케팅', '공모전', '창업'], sharedSpecs: ['삼성 마케팅 공모전', 'CJ 마케팅 챌린지'], matched: true },
  { id: 'm2', name: '박준혁', dept: '공학·IT', year: 2, avatar: '👨‍💻', status: 'online', bio: '정처기 같이 공부할 스터디원 모집중', interests: ['자격증', '코딩', '알고리즘'], sharedSpecs: ['정보처리기사 필기'], matched: true },
  { id: 'm3', name: '김하은', dept: '공학·IT', year: 3, avatar: '👩‍💻', status: 'offline', bio: '네이버 부스트캠프 같이 준비해요', interests: ['대외활동', '개발', 'AI'], sharedSpecs: ['네이버 부스트캠프'], matched: true },
  { id: 'm4', name: '최도윤', dept: '사회·정치', year: 4, avatar: '📚', status: 'online', bio: 'KOTRA 인턴 준비하는 국제학과생', interests: ['인턴', '대외활동', '영어'], sharedSpecs: [], matched: false },
  { id: 'm5', name: '정유진', dept: '예술·디자인', year: 2, avatar: '🎨', status: 'offline', bio: 'UX/UI 디자인 공모전 팀원 구합니다', interests: ['디자인', '공모전', 'UX'], sharedSpecs: [], matched: false },
  { id: 'm6', name: '한승우', dept: '경영·경제', year: 3, avatar: '📊', status: 'online', bio: 'SQLD, 데이터분석 자격증 스터디', interests: ['자격증', '데이터', 'SQL'], sharedSpecs: ['SQLD 자격증'], matched: false },
]

const INTEREST_OPTIONS = ['공모전', '자격증', '대외활동', '인턴', '코딩', '마케팅', '디자인', '영어', '데이터', '창업']

export default function StudyMatePage() {
  const { showToast } = useToast()
  const [mates, setMates] = useState<Mate[]>(INITIAL_MATES)
  const [tab, setTab] = useState<'matched' | 'recommended'>('matched')
  const [modalOpen, setModalOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({ bio: '', interests: [] as string[] })

  const matchedMates = mates.filter(m => m.matched)
  const recommendedMates = mates.filter(m => !m.matched)
  const sharedSpecCount = new Set(matchedMates.flatMap(m => m.sharedSpecs)).size
  const displayMates = tab === 'matched' ? matchedMates : recommendedMates

  const handleMateRequest = (id: string) => {
    setMates(prev => prev.map(m => m.id === id ? { ...m, matched: true } : m))
    const mate = mates.find(m => m.id === id)
    showToast(`🤝 ${mate?.name}님에게 메이트 요청을 보냈습니다!`)
  }

  const handleProfileSave = () => {
    if (!profileForm.bio.trim()) {
      showToast('⚠️ 한줄 소개를 입력해주세요')
      return
    }
    if (profileForm.interests.length === 0) {
      showToast('⚠️ 관심 분야를 1개 이상 선택해주세요')
      return
    }
    setModalOpen(false)
    setProfileForm({ bio: '', interests: [] })
    showToast('✅ 프로필이 등록되었습니다!')
  }

  const toggleInterest = (interest: string) => {
    setProfileForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>스터디 메이트</h1>
          <p style={{ fontSize: 13, color: 'var(--tx3)', margin: '4px 0 0' }}>같은 목표를 가진 동료를 찾아보세요</p>
        </div>
        <button className="btn" onClick={() => setModalOpen(true)} style={{ fontSize: 13 }}>
          + 프로필 등록
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>내 메이트</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{matchedMates.length}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>추천 메이트</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{recommendedMates.length}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>공유 스펙</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{sharedSpecCount}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          className="btn"
          onClick={() => setTab('matched')}
          style={{
            fontSize: 13,
            background: tab === 'matched' ? '#E8913A' : 'var(--sur)',
            color: tab === 'matched' ? '#fff' : 'var(--tx2)',
            border: tab === 'matched' ? 'none' : '1px solid var(--bor)',
          }}
        >
          내 메이트
        </button>
        <button
          className="btn"
          onClick={() => setTab('recommended')}
          style={{
            fontSize: 13,
            background: tab === 'recommended' ? '#E8913A' : 'var(--sur)',
            color: tab === 'recommended' ? '#fff' : 'var(--tx2)',
            border: tab === 'recommended' ? 'none' : '1px solid var(--bor)',
          }}
        >
          추천 메이트
        </button>
      </div>

      {/* Mate cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {displayMates.map(mate => (
          <div key={mate.id} className="card" style={{ padding: 20, position: 'relative' }}>
            {/* Status dot */}
            <div style={{
              position: 'absolute', top: 16, right: 16,
              width: 8, height: 8, borderRadius: '50%',
              background: mate.status === 'online' ? '#22C55E' : '#D1D5DB',
            }} />

            {/* Avatar + Info */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: '#FFF3E6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, flexShrink: 0,
              }}>
                {mate.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{mate.name}</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{mate.dept} · {mate.year}학년</div>
              </div>
            </div>

            {/* Bio */}
            <p style={{ fontSize: 13, color: 'var(--tx2)', margin: '0 0 12px', lineHeight: 1.5 }}>{mate.bio}</p>

            {/* Interest tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {mate.interests.map(tag => (
                <span key={tag} style={{
                  background: '#FFF3E6', color: '#C7621E', fontSize: 11,
                  padding: '2px 8px', borderRadius: 99,
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Shared specs */}
            {mate.sharedSpecs.length > 0 && (
              <div style={{ marginBottom: 14, padding: '8px 10px', background: 'var(--bg)', borderRadius: 8, fontSize: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>📌 함께 준비중</div>
                {mate.sharedSpecs.map(spec => (
                  <div key={spec} style={{ color: 'var(--tx2)', marginTop: 2 }}>· {spec}</div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {mate.matched ? (
                <>
                  <button className="btn" style={{ flex: 1, fontSize: 12 }}>💬 메시지</button>
                  <button className="btn" style={{ flex: 1, fontSize: 12, background: 'var(--sur)', color: 'var(--tx2)', border: '1px solid var(--bor)' }}>📋 공유 스펙 보기</button>
                </>
              ) : (
                <button className="btn" style={{ flex: 1, fontSize: 12 }} onClick={() => handleMateRequest(mate.id)}>
                  🤝 메이트 요청
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {displayMates.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--tx3)', fontSize: 14 }}>
          {tab === 'matched' ? '아직 메이트가 없습니다.' : '추천 메이트가 없습니다.'}
        </div>
      )}

      {/* Profile registration modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="프로필 등록" subtitle="스터디 메이트 프로필을 등록하세요">
        <div className="form-group">
          <label className="form-label">한줄 소개</label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="나를 소개해주세요 (예: 마케팅 공모전 함께 준비할 팀원 찾아요!)"
            value={profileForm.bio}
            onChange={e => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">관심 분야</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
            {INTEREST_OPTIONS.map(interest => (
              <label key={interest} style={{
                display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, cursor: 'pointer',
                padding: '4px 10px', borderRadius: 99,
                background: profileForm.interests.includes(interest) ? '#FFF3E6' : 'var(--bg)',
                color: profileForm.interests.includes(interest) ? '#C7621E' : 'var(--tx2)',
                border: profileForm.interests.includes(interest) ? '1px solid #E8913A' : '1px solid var(--bor)',
              }}>
                <input
                  type="checkbox"
                  checked={profileForm.interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                  style={{ display: 'none' }}
                />
                {interest}
              </label>
            ))}
          </div>
        </div>
        <button className="btn" onClick={handleProfileSave} style={{ width: '100%', marginTop: 12 }}>
          저장하기
        </button>
      </Modal>
    </div>
  )
}
