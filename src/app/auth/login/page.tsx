'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요.'); return }
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError('이메일 또는 비밀번호가 올바르지 않습니다.'); setLoading(false) }
      else { router.push('/dashboard'); router.refresh() }
    } catch {
      setError('서버 연결에 실패했습니다. 데모 모드로 체험해보세요.')
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'kakao') => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
    } catch {
      setError('소셜 로그인은 Supabase 연결 후 사용 가능합니다.')
    }
  }

  const handleDemo = () => {
    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Pretendard','Noto Sans KR',sans-serif" }}>
      {/* Left - Branding */}
      <div style={{
        flex: 1, background: 'linear-gradient(135deg, #E8913A 0%, #F5C882 50%, #FFF3E6 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: 48, position: 'relative', overflow: 'hidden',
      }}
        className="hidden md:flex"
      >
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 72, marginBottom: 24 }}>🎓</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>
            캠퍼스 허브
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, maxWidth: 320 }}>
            공모전 · 자격증 · 대외활동<br />
            대학생활에 필요한 모든 것을 한 곳에서
          </p>

          <div style={{ marginTop: 40, display: 'flex', gap: 16, justifyContent: 'center' }}>
            {[
              { num: '10,000+', label: '사용자' },
              { num: '500+', label: '공모전' },
              { num: '12개', label: '학과' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.num}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>{s.label}</div>
              </div>
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

          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1d1d1f', marginBottom: 4 }}>로그인</h2>
          <p style={{ fontSize: 14, color: '#8e8e93', marginBottom: 32 }}>계정에 로그인하고 이어서 진행하세요</p>

          {error && (
            <div style={{
              background: '#FEF2F2', color: '#DC2626', fontSize: 13, padding: '10px 14px',
              borderRadius: 10, marginBottom: 16, border: '1px solid #FECACA',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#3d3d3d', display: 'block', marginBottom: 6 }}>이메일</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@university.ac.kr"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #E5E5E5',
                  fontSize: 14, outline: 'none', background: '#fff', transition: 'border-color .2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#E8913A'}
                onBlur={e => e.target.style.borderColor = '#E5E5E5'}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#3d3d3d' }}>비밀번호</label>
                <button type="button" style={{ fontSize: 12, color: '#E8913A', background: 'none', border: 'none', cursor: 'pointer' }}>
                  비밀번호 찾기
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #E5E5E5',
                  fontSize: 14, outline: 'none', background: '#fff', transition: 'border-color .2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#E8913A'}
                onBlur={e => e.target.style.borderColor = '#E5E5E5'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                background: loading ? '#ccc' : '#E8913A', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', marginTop: 20, transition: 'all .2s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#D07A2E' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#E8913A' }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E5E5E5' }} />
            <span style={{ fontSize: 12, color: '#8e8e93' }}>또는</span>
            <div style={{ flex: 1, height: 1, background: '#E5E5E5' }} />
          </div>

          {/* Social login */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => handleOAuth('google')}
              style={{
                flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #E5E5E5',
                background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: '#3d3d3d',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Google
            </button>
            <button
              onClick={() => handleOAuth('kakao')}
              style={{
                flex: 1, padding: '12px', borderRadius: 10, border: 'none',
                background: '#FEE500', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#000',
              }}
            >
              💬 카카오
            </button>
          </div>

          {/* Demo button */}
          <button
            onClick={handleDemo}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: '1.5px dashed #E8913A',
              background: '#FFF8F0', cursor: 'pointer', fontSize: 14, fontWeight: 600,
              color: '#E8913A', marginTop: 16, transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FFF3E6' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFF8F0' }}
          >
            🎓 로그인 없이 데모 체험하기
          </button>

          {/* Footer */}
          <p style={{ textAlign: 'center', fontSize: 13, color: '#8e8e93', marginTop: 24 }}>
            계정이 없으신가요?{' '}
            <Link href="/auth/signup" style={{ color: '#E8913A', fontWeight: 600, textDecoration: 'none' }}>
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
