'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import SpecLevel from '@/components/ui/SpecLevel'
import { createClient } from '@/lib/supabase/client'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        cursor: 'pointer',
        background: on ? '#E8913A' : 'var(--sur2)',
        position: 'relative',
        transition: 'background .2s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#fff',
          position: 'absolute',
          top: 3,
          left: on ? 23 : 3,
          transition: 'left .2s',
          boxShadow: '0 1px 3px rgba(0,0,0,.2)',
        }}
      />
    </div>
  )
}

function SettingRow({
  label,
  description,
  on,
  onToggle,
  border = true,
}: {
  label: string
  description: string
  on: boolean
  onToggle: () => void
  border?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: border ? '1px solid var(--bor)' : 'none',
        gap: 16,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)' }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>{description}</div>
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  )
}

export default function ProfilePage() {
  const { showToast } = useToast()
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState({ name: '로딩중...', email: '', dept: '', studentId: '' })
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', dept: '', studentId: '' })

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // Demo mode
        setUserInfo({ name: '데모 사용자', email: 'demo@campus-hub.kr', dept: '컴퓨터공학과', studentId: '20230001' })
        return
      }

      setUserId(user.id)

      // Fetch from profiles table
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

      if (profile) {
        setUserInfo({
          name: profile.name || user.user_metadata?.name || user.email?.split('@')[0] || '사용자',
          email: user.email || '',
          dept: profile.department || user.user_metadata?.dept || '미설정',
          studentId: profile.student_id || user.user_metadata?.student_id || '미설정',
        })
        setEditForm({
          name: profile.name || '',
          dept: profile.department || '',
          studentId: profile.student_id || '',
        })
      } else {
        setUserInfo({
          name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자',
          email: user.email || '',
          dept: user.user_metadata?.dept || '미설정',
          studentId: user.user_metadata?.student_id || '미설정',
        })
        setEditForm({
          name: user.user_metadata?.name || user.email?.split('@')[0] || '',
          dept: user.user_metadata?.dept || '',
          studentId: user.user_metadata?.student_id || '',
        })
      }
    }

    loadProfile()
  }, [])

  // Notification toggles
  const [scheduleNotif, setScheduleNotif] = useState(true)
  const [contestNotif, setContestNotif] = useState(true)
  const [communityNotif, setCommunityNotif] = useState(false)
  const [assignmentNotif, setAssignmentNotif] = useState(true)

  // Email toggles
  const [weeklySummary, setWeeklySummary] = useState(true)
  const [eventEmail, setEventEmail] = useState(false)

  // Display toggles
  const [darkMode, setDarkMode] = useState(false)
  const [autoSave, setAutoSave] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) setDarkMode(saved === 'true')
  }, [])

  const handleDarkModeToggle = () => {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('darkMode', String(next))
  }

  const handleSaveProfile = async () => {
    if (!userId) {
      showToast('로그인이 필요합니다')
      return
    }

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      name: editForm.name.trim(),
      department: editForm.dept.trim(),
      student_id: editForm.studentId.trim(),
    })

    if (error) {
      showToast('저장 실패: ' + error.message)
    } else {
      setUserInfo(prev => ({
        ...prev,
        name: editForm.name.trim() || prev.name,
        dept: editForm.dept.trim() || prev.dept,
        studentId: editForm.studentId.trim() || prev.studentId,
      }))
      setEditMode(false)
      showToast('프로필이 저장되었습니다!')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    showToast('로그아웃 되었습니다')
    router.push('/')
  }

  const handleDeleteAccount = () => {
    showToast('회원 탈퇴 요청이 접수되었습니다')
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-xl font-semibold">설정</div>
          <div className="text-[13px] text-[var(--tx3)] mt-0.5">알림, 화면, 계정 설정을 관리합니다</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Notification Settings */}
          <div className="card" style={{ padding: 20 }}>
            <div className="text-[15px] font-semibold mb-3" style={{ color: 'var(--txt)' }}>
              🔔 알림 설정
            </div>
            <SettingRow
              label="일정 알림"
              description="등록된 일정 시작 전 알림"
              on={scheduleNotif}
              onToggle={() => setScheduleNotif(!scheduleNotif)}
            />
            <SettingRow
              label="공모전 마감 알림"
              description="북마크 공모전 D-3 알림"
              on={contestNotif}
              onToggle={() => setContestNotif(!contestNotif)}
            />
            <SettingRow
              label="커뮤니티 알림"
              description="댓글 및 좋아요 알림"
              on={communityNotif}
              onToggle={() => setCommunityNotif(!communityNotif)}
            />
            <SettingRow
              label="과제 마감 알림"
              description="마감 24시간 전 알림"
              on={assignmentNotif}
              onToggle={() => setAssignmentNotif(!assignmentNotif)}
              border={false}
            />
          </div>

          {/* Email Notifications */}
          <div className="card" style={{ padding: 20 }}>
            <div className="text-[15px] font-semibold mb-3" style={{ color: 'var(--txt)' }}>
              ✉️ 이메일 알림
            </div>
            <SettingRow
              label="주간 요약 메일"
              description="매주 월요일 한 주 요약 수신"
              on={weeklySummary}
              onToggle={() => setWeeklySummary(!weeklySummary)}
            />
            <SettingRow
              label="이벤트 안내 메일"
              description="새로운 공모전, 이벤트 정보 수신"
              on={eventEmail}
              onToggle={() => setEventEmail(!eventEmail)}
              border={false}
            />
          </div>

          {/* Display Settings */}
          <div className="card" style={{ padding: 20 }}>
            <div className="text-[15px] font-semibold mb-3" style={{ color: 'var(--txt)' }}>
              🖥️ 화면 설정
            </div>
            <SettingRow
              label="다크 모드"
              description="어두운 테마로 전환"
              on={darkMode}
              onToggle={handleDarkModeToggle}
            />
            <SettingRow
              label="자동 저장"
              description="작성 중인 내용 자동 저장"
              on={autoSave}
              onToggle={() => setAutoSave(!autoSave)}
              border={false}
            />
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Spec Level */}
          <SpecLevel />

          {/* Account Info */}
          <div className="card" style={{ padding: 20 }}>
            <div className="text-[15px] font-semibold mb-3" style={{ color: 'var(--txt)' }}>
              👤 계정 정보
            </div>
            {editMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">이름</label>
                  <input className="form-input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="이름" />
                </div>
                <div className="form-group">
                  <label className="form-label">학과</label>
                  <input className="form-input" value={editForm.dept} onChange={e => setEditForm({ ...editForm, dept: e.target.value })} placeholder="학과" />
                </div>
                <div className="form-group">
                  <label className="form-label">학번</label>
                  <input className="form-input" value={editForm.studentId} onChange={e => setEditForm({ ...editForm, studentId: e.target.value })} placeholder="학번" />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setEditMode(false)}>취소</button>
                  <button className="btn" style={{ flex: 1 }} onClick={handleSaveProfile}>저장하기</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: '이름', value: userInfo.name },
                    { label: '학과', value: userInfo.dept },
                    { label: '학번', value: userInfo.studentId },
                    { label: '이메일', value: userInfo.email },
                  ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--tx3)' }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="btn"
                  style={{ width: '100%', marginTop: 16 }}
                  onClick={() => setEditMode(true)}
                >
                  계정 정보 수정
                </button>
              </>
            )}
          </div>

          {/* App Info */}
          <div className="card" style={{ padding: 20 }}>
            <div className="text-[15px] font-semibold mb-3" style={{ color: 'var(--txt)' }}>
              ℹ️ 앱 정보
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--tx3)' }}>버전</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)' }}>v1.0.0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--tx3)' }}>최근 업데이트</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)' }}>2026.03.23</span>
              </div>
              <div style={{ borderTop: '1px solid var(--bor)', paddingTop: 10, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link href="/privacy" style={{ fontSize: 13, color: 'var(--tx2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
                  <span>개인정보처리방침</span>
                  <span style={{ color: 'var(--tx3)' }}>&rarr;</span>
                </Link>
                <Link href="/terms" style={{ fontSize: 13, color: 'var(--tx2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
                  <span>이용약관</span>
                  <span style={{ color: 'var(--tx3)' }}>&rarr;</span>
                </Link>
                <Link href="/licenses" style={{ fontSize: 13, color: 'var(--tx2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
                  <span>오픈소스 라이선스</span>
                  <span style={{ color: 'var(--tx3)' }}>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="card" style={{ padding: 20, border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="text-[15px] font-semibold mb-3" style={{ color: 'var(--txt)' }}>
              ⚠️ 계정 관리
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                className="btn"
                style={{ width: '100%', background: 'var(--sur2)', color: 'var(--tx2)' }}
                onClick={handleLogout}
              >
                로그아웃
              </button>
              <button
                className="btn"
                style={{ width: '100%', background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                onClick={handleDeleteAccount}
              >
                회원 탈퇴
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
