import Link from 'next/link'

export const metadata = { title: '개인정보처리방침' }

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px', fontFamily: "-apple-system,'Pretendard',sans-serif", color: '#1d1d1f', lineHeight: 1.8 }}>
      <Link href="/" style={{ fontSize: 14, color: '#3182f6', display: 'inline-block', marginBottom: 32 }}>&larr; 홈으로</Link>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>개인정보처리방침</h1>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>1. 수집하는 개인정보</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>서비스는 회원가입 시 다음의 개인정보를 수집합니다: 이메일 주소, 이름, 학과 계열 정보. 서비스 이용 과정에서 일정, 학점, 지출 등의 정보가 자동으로 저장될 수 있습니다.</p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>2. 개인정보의 이용 목적</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>수집된 개인정보는 다음의 목적을 위해 이용됩니다: 회원 식별 및 인증, 맞춤 정보 제공, 서비스 개선 및 통계 분석.</p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>3. 개인정보의 보유 및 파기</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>회원 탈퇴 시 개인정보는 즉시 파기됩니다. 다만, 관련 법령에 따라 일정 기간 보관이 필요한 정보는 해당 기간 동안 보관 후 파기합니다.</p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>4. 개인정보의 제3자 제공</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>서비스는 원칙적으로 회원의 개인정보를 제3자에게 제공하지 않습니다. 다만, 법령에 의한 경우는 예외로 합니다.</p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>5. 쿠키의 사용</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>서비스는 로그인 인증 및 사용자 설정 유지를 위해 쿠키를 사용합니다.</p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>6. 문의처</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>개인정보 관련 문의: support@campushub.kr</p>

      <div style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid rgba(0,0,0,.06)', fontSize: 13, color: '#8e8e93' }}>
        시행일: 2026년 3월 1일 | 캠퍼스 허브
      </div>
    </div>
  )
}
