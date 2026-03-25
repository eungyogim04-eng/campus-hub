import Link from 'next/link'

export const metadata = { title: '이용약관' }

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px', fontFamily: "-apple-system,'Pretendard',sans-serif", color: '#1d1d1f', lineHeight: 1.8 }}>
      <Link href="/" style={{ fontSize: 14, color: '#3182f6', display: 'inline-block', marginBottom: 32 }}>&larr; 홈으로</Link>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>이용약관</h1>

      {/* 제1조 목적 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제1조 (목적)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>
        이 약관은 스펙잇(이하 &ldquo;서비스&rdquo;)의 이용에 관한 조건 및 절차, 회원과 서비스 제공자 간의 권리&middot;의무&middot;책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
      </p>

      {/* 제2조 정의 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제2조 (정의)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>
        이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
      </p>
      <ul style={{ color: '#6e6e73', fontSize: 15, paddingLeft: 20, marginTop: 8 }}>
        <li style={{ marginBottom: 6 }}>&ldquo;서비스&rdquo;란 스펙잇가 웹사이트 및 관련 플랫폼을 통해 제공하는 공모전&middot;자격증&middot;대외활동 정보 제공, 일정 관리, 학점 관리, 커뮤니티 등의 온라인 서비스를 말합니다.</li>
        <li style={{ marginBottom: 6 }}>&ldquo;회원&rdquo;이란 서비스에 가입하여 이 약관에 동의하고 서비스를 이용하는 자를 말합니다.</li>
        <li style={{ marginBottom: 6 }}>&ldquo;콘텐츠&rdquo;란 서비스 내에서 제공되거나 회원이 게시한 텍스트, 이미지, 링크 등 일체의 정보를 말합니다.</li>
        <li style={{ marginBottom: 6 }}>&ldquo;게시물&rdquo;이란 회원이 서비스 내 커뮤니티 게시판 등에 작성한 글, 댓글, 자료 등을 말합니다.</li>
      </ul>

      {/* 제3조 서비스의 제공 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제3조 (서비스의 제공)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>
        서비스는 다음의 기능을 제공합니다.
      </p>
      <ul style={{ color: '#6e6e73', fontSize: 15, paddingLeft: 20, marginTop: 8 }}>
        <li style={{ marginBottom: 6 }}>공모전, 자격증, 대외활동 등 대학생 관련 정보 수집 및 제공</li>
        <li style={{ marginBottom: 6 }}>일정 관리, 학점 관리, 지출 관리 등 개인 관리 도구</li>
        <li style={{ marginBottom: 6 }}>커뮤니티 게시판을 통한 회원 간 정보 교류</li>
        <li style={{ marginBottom: 6 }}>기타 서비스가 정하는 부가 기능</li>
      </ul>
      <p style={{ color: '#6e6e73', fontSize: 15, marginTop: 8 }}>
        서비스는 연중무휴, 1일 24시간 제공을 원칙으로 합니다. 다만, 시스템 점검, 장애 복구 등의 사유로 서비스가 일시 중단될 수 있습니다.
      </p>

      {/* 제4조 면책조항 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제4조 (면책조항)</h2>
      <div style={{ background: '#FFF8E1', border: '1px solid #FFE082', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
        <p style={{ color: '#E65100', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
          중요 안내사항
        </p>
        <ul style={{ color: '#4E342E', fontSize: 15, paddingLeft: 20, margin: 0 }}>
          <li style={{ marginBottom: 10 }}>
            본 서비스에서 제공하는 공모전, 자격증, 대외활동 정보는 참고용이며, 정보의 정확성, 완전성, 최신성을 보장하지 않습니다.
          </li>
          <li style={{ marginBottom: 10 }}>
            실제 지원 전 반드시 해당 기관의 공식 사이트에서 정보를 확인하시기 바랍니다.
          </li>
          <li style={{ marginBottom: 10 }}>
            서비스 이용으로 발생한 직접적, 간접적 손해에 대해 스펙잇는 책임을 지지 않습니다.
          </li>
          <li style={{ marginBottom: 0 }}>
            커뮤니티에 게시된 내용은 작성자 개인의 의견이며, 스펙잇의 공식 입장과 무관합니다.
          </li>
        </ul>
      </div>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>
        서비스는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.
      </p>

      {/* 제5조 회원의 의무 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제5조 (회원의 의무)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>
        회원은 다음 각 호의 행위를 하여서는 안 됩니다.
      </p>
      <ul style={{ color: '#6e6e73', fontSize: 15, paddingLeft: 20, marginTop: 8 }}>
        <li style={{ marginBottom: 6 }}>타인의 개인정보 또는 계정 정보를 도용하는 행위</li>
        <li style={{ marginBottom: 6 }}>허위 정보를 게시하거나 타인을 기만하는 행위</li>
        <li style={{ marginBottom: 6 }}>서비스의 정상적인 운영을 방해하는 행위</li>
        <li style={{ marginBottom: 6 }}>불법적이거나 음란한 콘텐츠를 게시하는 행위</li>
        <li style={{ marginBottom: 6 }}>타인의 명예를 훼손하거나 불이익을 주는 행위</li>
        <li style={{ marginBottom: 6 }}>서비스를 이용하여 영리 목적의 광고를 게시하는 행위</li>
        <li style={{ marginBottom: 6 }}>기타 관계 법령 및 서비스 이용규칙에 위반되는 행위</li>
      </ul>

      {/* 제6조 콘텐츠 관리 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제6조 (콘텐츠 관리)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>
        서비스는 다음에 해당하는 콘텐츠를 사전 통보 없이 삭제하거나 게시를 제한할 수 있습니다.
      </p>
      <ul style={{ color: '#6e6e73', fontSize: 15, paddingLeft: 20, marginTop: 8 }}>
        <li style={{ marginBottom: 6 }}>관계 법령에 위반되는 콘텐츠</li>
        <li style={{ marginBottom: 6 }}>타인의 권리를 침해하는 콘텐츠</li>
        <li style={{ marginBottom: 6 }}>음란하거나 폭력적인 콘텐츠</li>
        <li style={{ marginBottom: 6 }}>영리 목적의 광고성 콘텐츠</li>
        <li style={{ marginBottom: 6 }}>기타 서비스 운영에 부적절하다고 판단되는 콘텐츠</li>
      </ul>
      <p style={{ color: '#6e6e73', fontSize: 15, marginTop: 8 }}>
        회원이 신고한 콘텐츠는 접수일로부터 24시간 이내에 검토하며, 검토 결과에 따라 적절한 조치를 취합니다.
      </p>

      {/* 제7조 서비스 변경 및 중단 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제7조 (서비스 변경 및 중단)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>
        서비스는 운영상, 기술상의 필요에 의해 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.
      </p>
      <ul style={{ color: '#6e6e73', fontSize: 15, paddingLeft: 20, marginTop: 8 }}>
        <li style={{ marginBottom: 6 }}>서비스 변경 또는 중단 시 최소 7일 전에 서비스 내 공지사항을 통해 회원에게 안내합니다.</li>
        <li style={{ marginBottom: 6 }}>긴급한 시스템 장애, 보안 문제 등 불가피한 경우에는 사전 통보 없이 서비스를 변경하거나 중단할 수 있습니다.</li>
        <li style={{ marginBottom: 6 }}>서비스 변경 또는 중단으로 인한 손해에 대해 서비스는 고의 또는 중과실이 없는 한 책임을 지지 않습니다.</li>
      </ul>

      {/* 제8조 지식재산권 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제8조 (지식재산권)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>
        서비스가 제작한 콘텐츠(디자인, 텍스트, 로고, 소프트웨어 등)에 대한 저작권 및 지식재산권은 스펙잇 또는 원저작권자에게 귀속됩니다.
      </p>
      <p style={{ color: '#6e6e73', fontSize: 15, marginTop: 8 }}>
        회원이 서비스 내에 게시한 게시물의 저작권은 해당 작성자에게 있습니다. 다만, 회원은 서비스 내에서 해당 게시물이 검색, 노출, 공유될 수 있도록 서비스에 이용을 허락한 것으로 간주합니다.
      </p>
      <p style={{ color: '#6e6e73', fontSize: 15, marginTop: 8 }}>
        회원은 서비스를 이용하여 얻은 정보를 서비스의 사전 승인 없이 복제, 배포, 방송 등의 방법으로 상업적으로 이용할 수 없습니다.
      </p>

      {/* 제9조 개인정보 보호 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제9조 (개인정보 보호)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>
        서비스는 회원의 개인정보를 &laquo;개인정보 보호법&raquo; 등 관계 법령에 따라 보호하며, 개인정보의 수집&middot;이용&middot;제공&middot;파기 등에 관한 세부 사항은 개인정보처리방침에 따릅니다.
      </p>
      <p style={{ marginTop: 12 }}>
        <Link href="/privacy" style={{ fontSize: 15, color: '#3182f6', textDecoration: 'underline' }}>
          개인정보처리방침 보기 &rarr;
        </Link>
      </p>

      {/* 제10조 분쟁 해결 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제10조 (분쟁 해결)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>
        이 약관과 서비스 이용에 관한 분쟁에는 대한민국 법률을 적용합니다.
      </p>
      <p style={{ color: '#6e6e73', fontSize: 15, marginTop: 8 }}>
        서비스 이용과 관련하여 발생한 분쟁에 대해 소송이 제기되는 경우, 서울중앙지방법원을 제1심 관할 법원으로 합의합니다.
      </p>
      <p style={{ color: '#6e6e73', fontSize: 15, marginTop: 8 }}>
        서비스와 회원 간의 분쟁은 우선적으로 상호 협의를 통해 해결하며, 협의가 이루어지지 않을 경우 관련 법령에 따른 절차를 따릅니다.
      </p>

      {/* 제11조 약관의 변경 */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>제11조 (약관의 변경)</h2>
      <p style={{ color: '#6e6e73', fontSize: 15 }}>
        서비스는 필요한 경우 관련 법령에 위배되지 않는 범위 내에서 이 약관을 변경할 수 있습니다.
      </p>
      <ul style={{ color: '#6e6e73', fontSize: 15, paddingLeft: 20, marginTop: 8 }}>
        <li style={{ marginBottom: 6 }}>약관이 변경되는 경우 적용일 최소 7일 전에 서비스 내 공지사항을 통해 변경 내용을 안내합니다.</li>
        <li style={{ marginBottom: 6 }}>회원에게 불리한 변경의 경우 최소 30일 전에 공지하며, 개별 통지합니다.</li>
        <li style={{ marginBottom: 6 }}>변경된 약관에 동의하지 않는 회원은 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
        <li style={{ marginBottom: 6 }}>변경된 약관의 시행일 이후에도 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다.</li>
      </ul>

      <div style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid rgba(0,0,0,.06)', fontSize: 13, color: '#8e8e93' }}>
        시행일: 2026년 3월 24일 | 스펙잇
      </div>
    </div>
  )
}
