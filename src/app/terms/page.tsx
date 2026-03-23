import Link from 'next/link'

export const metadata = { title: '이용약관' }

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px', fontFamily: "-apple-system,'Pretendard',sans-serif", color: '#1d1d1f', lineHeight: 1.8 }}>
      <Link href="/" style={{ fontSize: 14, color: '#3182f6', display: 'inline-block', marginBottom: 32 }}>&larr; 홈으로</Link>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>이용약관</h1>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제1조 (목적)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>이 약관은 캠퍼스 허브(이하 &ldquo;서비스&rdquo;)의 이용조건 및 절차, 회원과 서비스 제공자의 권리·의무·책임사항 등을 규정함을 목적으로 합니다.</p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제2조 (정의)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>1. &ldquo;서비스&rdquo;란 캠퍼스 허브가 제공하는 공모전·자격증·대외활동 정보 제공, 일정 관리, 학점 관리, 커뮤니티 등의 온라인 서비스를 말합니다.<br/>2. &ldquo;회원&rdquo;이란 서비스에 가입하여 이용하는 자를 말합니다.</p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제3조 (서비스의 제공)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>서비스는 연중무휴, 1일 24시간 제공을 원칙으로 합니다. 다만, 시스템 점검 등의 사유로 서비스가 일시 중단될 수 있습니다.</p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제4조 (회원가입)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>이용자는 서비스가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제5조 (개인정보보호)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>서비스는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 자세한 사항은 개인정보처리방침을 참고하시기 바랍니다.</p>

      <div style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid rgba(0,0,0,.06)', fontSize: 13, color: '#8e8e93' }}>
        시행일: 2026년 3월 1일 | 캠퍼스 허브
      </div>
    </div>
  )
}
