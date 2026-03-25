'use client'
import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'

const CATEGORIES = [
  { key: 'bug', label: '🐛 버그 신고', desc: '오류나 문제가 있어요' },
  { key: 'feature', label: '💡 기능 제안', desc: '새로운 기능이 있으면 좋겠어요' },
  { key: 'improve', label: '✨ 개선 요청', desc: '기존 기능을 더 좋게 만들어주세요' },
  { key: 'etc', label: '💬 기타', desc: '그 외 의견이 있어요' },
]

export default function FeedbackPage() {
  const { showToast } = useToast()
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(0)
  const [sent, setSent] = useState(false)

  const handleSubmit = () => {
    if (!category) { showToast('⚠️ 카테고리를 선택해주세요'); return }
    if (!title.trim()) { showToast('⚠️ 제목을 입력해주세요'); return }
    if (!body.trim()) { showToast('⚠️ 내용을 입력해주세요'); return }

    // mailto로 이메일 발송
    const subject = `[캠퍼스허브 피드백] [${CATEGORIES.find(c => c.key === category)?.label}] ${title}`
    const mailBody = [
      `카테고리: ${CATEGORIES.find(c => c.key === category)?.label}`,
      `제목: ${title}`,
      `평점: ${'⭐'.repeat(rating)}${rating > 0 ? ` (${rating}/5)` : '미선택'}`,
      `회신 이메일: ${email || '미입력'}`,
      '',
      '--- 내용 ---',
      body,
    ].join('\n')

    window.open(`mailto:eungyogim04@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`)
    setSent(true)
    showToast('📧 메일 앱이 열렸습니다! 전송해주세요.')
  }

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>피드백 감사합니다!</div>
        <p style={{ fontSize: 15, color: 'var(--tx3)', lineHeight: 1.7, marginBottom: 32 }}>
          메일 앱에서 전송 버튼을 눌러주세요.<br />
          소중한 의견은 서비스 개선에 반영하겠습니다.
        </p>
        <button className="btn" onClick={() => { setSent(false); setTitle(''); setBody(''); setCategory(''); setRating(0) }}>
          추가 피드백 보내기
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <div className="text-xl font-semibold">피드백 보내기</div>
        <div className="text-[13px] text-[var(--tx3)] mt-0.5">캠퍼스 허브를 더 좋게 만들어주세요. 의견을 이메일로 보내드립니다.</div>
      </div>

      {/* 만족도 */}
      <div className="card mb-4">
        <div className="card-title">캠퍼스 허브 만족도</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '12px 0' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setRating(n)} style={{
              fontSize: 32, background: 'none', border: 'none', cursor: 'pointer',
              opacity: n <= rating ? 1 : 0.2, transition: 'all .15s',
              transform: n <= rating ? 'scale(1.1)' : 'scale(1)',
            }}>⭐</button>
          ))}
        </div>
        {rating > 0 && <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--tx3)' }}>
          {rating <= 2 ? '아쉬운 점을 알려주세요 😢' : rating <= 3 ? '개선할 점이 있다면 알려주세요 🙂' : '감사합니다! 더 나은 서비스를 위해 노력할게요 😊'}
        </div>}
      </div>

      {/* 카테고리 */}
      <div className="card mb-4">
        <div className="card-title">어떤 의견인가요?</div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {CATEGORIES.map(cat => (
            <div key={cat.key} onClick={() => setCategory(cat.key)} style={{
              padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
              border: category === cat.key ? '2px solid var(--p)' : '1px solid var(--bor)',
              background: category === cat.key ? 'var(--pl)' : 'var(--sur)',
              transition: 'all .15s',
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{cat.label}</div>
              <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{cat.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 내용 */}
      <div className="card mb-4">
        <div className="form-group">
          <label className="form-label">제목 *</label>
          <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="한 줄로 요약해주세요" />
        </div>
        <div className="form-group">
          <label className="form-label">내용 *</label>
          <textarea className="form-input" value={body} onChange={e => setBody(e.target.value)} placeholder="자세히 알려주세요. 스크린샷이 있다면 메일에 첨부해주세요." rows={5} style={{ resize: 'vertical' }} />
        </div>
        <div className="form-group">
          <label className="form-label">회신받을 이메일 (선택)</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="답변을 받고 싶다면 이메일을 입력해주세요" />
        </div>
      </div>

      <button className="btn" style={{ width: '100%', height: 48, fontSize: 15 }} onClick={handleSubmit}>
        📧 이메일로 피드백 보내기
      </button>
      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--tx3)', marginTop: 8 }}>
        eungyogim04@gmail.com 로 발송됩니다
      </div>
    </div>
  )
}
