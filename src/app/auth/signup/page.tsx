'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('이름을 입력해주세요.'); return }
    if (!email) { setError('이메일을 입력해주세요.'); return }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return }
    if (password !== confirmPw) { setError('비밀번호가 일치하지 않습니다.'); return }
    if (!agree) { setError('이용약관에 동의해주세요.'); return }
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
      if (error) { setError('회원가입에 실패했습니다. 다시 시도해주세요.'); setLoading(false) }
      else { router.push('/onboarding'); router.refresh() }
    } catch {
      setError('서버 연결에 실패했습니다. 데모 모드로 체험해보세요.')
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #E5E5E5',
    fontSize: 14, outline: 'none', background: '#fff', transition: 'border-color .2s',
    boxSizing: 'border-box' as const,
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Pretendard','Noto Sans KR',sans-serif" }}>
      {/* Left - Branding */}
      <div style={{
        flex: 1, background: 'linear-gradient(135deg, #2D8A56 0%, #5BB67A 50%, #E8F5EC 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: 48, position: 'relative', overflow: 'hidden',
      }}
        className="hidden md:flex"
      >
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 72, marginBottom: 24 }}>🚀</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>
            대학생활의 시작,<br />캠퍼스 허브
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: 300 }}>
            30초만에 가입하고<br />
            맞춤 공모전·자격증 정보를 받아보세요
          </p>

          <div style={{
            marginTop: 40, background: 'rgba(255,255,255,0.15)', borderRadius: 16,
            padding: '20px 24px', backdropFilter: 'blur(10px)',
          }}>
            {['✅ 12개 학과 맞춤 공모전 탐색', '✅ D-day 일정 & 학점 관리', '✅ 스터디 메이트 매칭'].map(t => (
              <div key={t} style={{ fontSize: 14, color: '#fff', padding: '6px 0', textAlign: 'left' }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '48px 24px', background: '#FAFAF8', minHeight: '100vh',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <div className="md:hidden" style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎓</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#C7621E' }}>캠퍼스 허브</div>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1d1d1f', marginBottom: 4 }}>회원가입</h2>
          <p style={{ fontSize: 14, color: '#8e8e93', marginBottom: 28 }}>캠퍼스 허브에 가입하고 맞춤 정보를 받아보세요</p>

          {error && (
            <div style={{
              background: '#FEF2F2', color: '#DC2626', fontSize: 13, padding: '10px 14px',
              borderRadius: 10, marginBottom: 16, border: '1px solid #FECACA',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#3d3d3d', display: 'block', marginBottom: 6 }}>이름</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="이름 입력" maxLength={10}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2D8A56'}
                onBlur={e => e.target.style.borderColor = '#E5E5E5'}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#3d3d3d', display: 'block', marginBottom: 6 }}>이메일</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="email@university.ac.kr"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2D8A56'}
                onBlur={e => e.target.style.borderColor = '#E5E5E5'}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#3d3d3d', display: 'block', marginBottom: 6 }}>비밀번호</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="6자 이상" minLength={6}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2D8A56'}
                onBlur={e => e.target.style.borderColor = '#E5E5E5'}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#3d3d3d', display: 'block', marginBottom: 6 }}>비밀번호 확인</label>
              <input
                type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                placeholder="비밀번호 재입력"
                style={{
                  ...inputStyle,
                  borderColor: confirmPw && password !== confirmPw ? '#DC2626' : '#E5E5E5',
                }}
                onFocus={e => e.target.style.borderColor = '#2D8A56'}
                onBlur={e => { e.target.style.borderColor = confirmPw && password !== confirmPw ? '#DC2626' : '#E5E5E5' }}
              />
              {confirmPw && password !== confirmPw && (
                <div style={{ fontSize: 11, color: '#DC2626', marginTop: 4 }}>비밀번호가 일치하지 않습니다</div>
              )}
            </div>

            {/* Agreement */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, cursor: 'pointer' }}>
              <input
                type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#2D8A56' }}
              />
              <span style={{ fontSize: 13, color: '#6e6e73' }}>
                <Link href="/terms" style={{ color: '#E8913A', textDecoration: 'underline' }}>이용약관</Link> 및{' '}
                <Link href="/privacy" style={{ color: '#E8913A', textDecoration: 'underline' }}>개인정보처리방침</Link>에 동의합니다
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                background: loading ? '#ccc' : '#2D8A56', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all .2s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#236B44' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2D8A56' }}
            >
              {loading ? '가입 중...' : '가입하기'}
            </button>
          </form>

          {/* Demo */}
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: '1.5px dashed #E8913A',
              background: '#FFF8F0', cursor: 'pointer', fontSize: 14, fontWeight: 600,
              color: '#E8913A', marginTop: 16, transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FFF3E6' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFF8F0' }}
          >
            🎓 가입 없이 데모 체험하기
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#8e8e93', marginTop: 24 }}>
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" style={{ color: '#E8913A', fontWeight: 600, textDecoration: 'none' }}>
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
