'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'
import { createClient } from '@/lib/supabase/client'

const INTEREST_OPTIONS = ['공모전', '자격증', '대외활동', '인턴', '코딩', '마케팅', '디자인', '영어', '데이터', '창업']

interface MateProfile {
  id: string
  user_id: string
  bio: string
  interests: string[]
  status: string
  created_at: string
  profiles: {
    id: string
    name: string
    dept: string
  }
}

interface MateRequest {
  id: string
  from_user: string
  to_user: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  from_profile?: { name: string; dept: string }
  to_profile?: { name: string; dept: string }
}

export default function StudyMatePage() {
  const supabase = createClient()
  const { showToast } = useToast()

  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'matched' | 'recommended'>('matched')
  const [modalOpen, setModalOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({ bio: '', interests: [] as string[] })
  const [myProfile, setMyProfile] = useState<MateProfile | null>(null)
  const [allProfiles, setAllProfiles] = useState<MateProfile[]>([])
  const [requests, setRequests] = useState<MateRequest[]>([])
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async (currentUserId: string) => {
    const [profileRes, allRes, reqRes] = await Promise.all([
      supabase
        .from('mate_profiles')
        .select('*, profiles(id, name, dept)')
        .eq('user_id', currentUserId)
        .maybeSingle(),
      supabase
        .from('mate_profiles')
        .select('*, profiles(id, name, dept)')
        .neq('user_id', currentUserId),
      supabase
        .from('mate_requests')
        .select('*, from_profile:profiles!mate_requests_from_user_fkey(name, dept), to_profile:profiles!mate_requests_to_user_fkey(name, dept)')
        .or(`from_user.eq.${currentUserId},to_user.eq.${currentUserId}`),
    ])

    if (profileRes.data) setMyProfile(profileRes.data as MateProfile)
    if (allRes.data) setAllProfiles(allRes.data as MateProfile[])
    if (reqRes.data) setRequests(reqRes.data as MateRequest[])
  }, [supabase])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      setUserId(user.id)
      await fetchData(user.id)
      setLoading(false)
    }
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Derive matched and recommended lists
  const acceptedRequests = requests.filter(r => r.status === 'accepted')
  const acceptedUserIds = new Set(
    acceptedRequests.flatMap(r => [r.from_user, r.to_user]).filter(id => id !== userId)
  )
  const pendingSentIds = new Set(
    requests.filter(r => r.status === 'pending' && r.from_user === userId).map(r => r.to_user)
  )

  const matchedMates = allProfiles.filter(p => acceptedUserIds.has(p.user_id))
  const recommendedMates = allProfiles.filter(p => !acceptedUserIds.has(p.user_id) && !pendingSentIds.has(p.user_id))
  const pendingReceived = requests.filter(r => r.status === 'pending' && r.to_user === userId)
  const displayMates = tab === 'matched' ? matchedMates : recommendedMates

  const handleMateRequest = async (toUserId: string) => {
    if (!userId) return
    const { error } = await supabase
      .from('mate_requests')
      .insert({ from_user: userId, to_user: toUserId, status: 'pending' })

    if (error) {
      showToast('요청을 보내는 중 오류가 발생했습니다.')
      return
    }

    const mate = allProfiles.find(p => p.user_id === toUserId)
    showToast(`🤝 ${mate?.profiles?.name ?? ''}님에게 메이트 요청을 보냈습니다!`)
    await fetchData(userId)
  }

  const handleRequestAction = async (requestId: string, action: 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from('mate_requests')
      .update({ status: action })
      .eq('id', requestId)

    if (error) {
      showToast('처리 중 오류가 발생했습니다.')
      return
    }

    showToast(action === 'accepted' ? '✅ 메이트 요청을 수락했습니다!' : '메이트 요청을 거절했습니다.')
    if (userId) await fetchData(userId)
  }

  const handleProfileSave = async () => {
    if (!userId) return
    if (!profileForm.bio.trim()) {
      showToast('⚠️ 한줄 소개를 입력해주세요')
      return
    }
    if (profileForm.interests.length === 0) {
      showToast('⚠️ 관심 분야를 1개 이상 선택해주세요')
      return
    }

    setSaving(true)
    const { error } = await supabase
      .from('mate_profiles')
      .upsert(
        { user_id: userId, bio: profileForm.bio, interests: profileForm.interests, status: 'online' },
        { onConflict: 'user_id' }
      )

    setSaving(false)

    if (error) {
      showToast('프로필 저장 중 오류가 발생했습니다.')
      return
    }

    setModalOpen(false)
    showToast('✅ 프로필이 등록되었습니다!')
    await fetchData(userId)
  }

  const toggleInterest = (interest: string) => {
    setProfileForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const openProfileModal = () => {
    if (myProfile) {
      setProfileForm({ bio: myProfile.bio, interests: myProfile.interests })
    } else {
      setProfileForm({ bio: '', interests: [] })
    }
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 14, color: 'var(--tx3)' }}>로딩 중...</div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>로그인이 필요합니다</div>
        <div style={{ fontSize: 14, color: 'var(--tx3)' }}>로그인하면 스터디 메이트를 찾을 수 있어요</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>스터디 메이트</h1>
          <p style={{ fontSize: 13, color: 'var(--tx3)', margin: '4px 0 0' }}>같은 목표를 가진 동료를 찾아보세요</p>
        </div>
        <button className="btn" onClick={openProfileModal} style={{ fontSize: 13 }}>
          {myProfile ? '프로필 수정' : '+ 프로필 등록'}
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
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>받은 요청</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{pendingReceived.length}</div>
        </div>
      </div>

      {/* Pending requests received */}
      {pendingReceived.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>받은 메이트 요청</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pendingReceived.map(req => (
              <div key={req.id} className="card" style={{
                padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{req.from_profile?.name ?? '알 수 없음'}</span>
                  <span style={{ fontSize: 12, color: 'var(--tx3)', marginLeft: 8 }}>{req.from_profile?.dept ?? ''}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn"
                    onClick={() => handleRequestAction(req.id, 'accepted')}
                    style={{ fontSize: 12, background: '#E8913A', color: '#fff', border: 'none' }}
                  >
                    수락
                  </button>
                  <button
                    className="btn"
                    onClick={() => handleRequestAction(req.id, 'rejected')}
                    style={{ fontSize: 12, background: 'var(--sur)', color: 'var(--tx2)', border: '1px solid var(--bor)' }}
                  >
                    거절
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                fontSize: 22, fontWeight: 700, color: '#C7621E', flexShrink: 0,
              }}>
                {mate.profiles?.name?.charAt(0) ?? '?'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{mate.profiles?.name ?? '알 수 없음'}</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{mate.profiles?.dept ?? ''}</div>
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

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {acceptedUserIds.has(mate.user_id) ? (
                <button
                  className="btn"
                  style={{ flex: 1, fontSize: 12 }}
                  onClick={() => showToast('💬 채팅 기능은 곧 제공됩니다!')}
                >
                  💬 채팅
                </button>
              ) : (
                <button
                  className="btn"
                  style={{ flex: 1, fontSize: 12 }}
                  onClick={() => handleMateRequest(mate.user_id)}
                >
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
        <button className="btn" onClick={handleProfileSave} disabled={saving} style={{ width: '100%', marginTop: 12 }}>
          {saving ? '저장 중...' : '저장하기'}
        </button>
      </Modal>
    </div>
  )
}
