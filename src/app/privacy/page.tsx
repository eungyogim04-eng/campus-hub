import Link from 'next/link'

export const metadata = { title: '개인정보처리방침 | 스펙잇' }

const sections = [
  {
    title: '1. 개인정보의 수집 및 이용 목적',
    content: (
      <>
        <p>스펙잇는 다음의 목적을 위해 개인정보를 수집 및 이용합니다.</p>
        <ul>
          <li><strong>회원가입 및 서비스 이용:</strong> 회원 식별, 본인 인증, 서비스 제공 및 계정 관리</li>
          <li><strong>서비스 개선 및 통계 분석:</strong> 이용 현황 분석, 서비스 품질 향상, 맞춤형 정보 제공</li>
        </ul>
      </>
    ),
  },
  {
    title: '2. 수집하는 개인정보의 항목',
    content: (
      <>
        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>항목</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="badge required">필수</span></td>
              <td>이메일, 이름 (또는 닉네임)</td>
            </tr>
            <tr>
              <td><span className="badge optional">선택</span></td>
              <td>학과, 학번, 학년</td>
            </tr>
            <tr>
              <td><span className="badge auto">자동수집</span></td>
              <td>접속 로그, 쿠키, 기기 정보 (OS, 브라우저 종류 등)</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    title: '3. 개인정보의 보유 및 이용 기간',
    content: (
      <>
        <p>원칙적으로 개인정보의 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
        <ul>
          <li><strong>회원 탈퇴 시:</strong> 즉시 파기</li>
          <li><strong>관련 법령에 따른 보관:</strong></li>
        </ul>
        <table>
          <thead>
            <tr>
              <th>보존 근거</th>
              <th>보존 항목</th>
              <th>보존 기간</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>전자상거래 등에서의 소비자보호에 관한 법률</td>
              <td>계약 또는 청약철회에 관한 기록</td>
              <td>5년</td>
            </tr>
            <tr>
              <td>전자상거래 등에서의 소비자보호에 관한 법률</td>
              <td>대금결제 및 재화 등의 공급에 관한 기록</td>
              <td>5년</td>
            </tr>
            <tr>
              <td>통신비밀보호법</td>
              <td>접속 로그 기록</td>
              <td>3개월</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    title: '4. 개인정보의 제3자 제공',
    content: (
      <>
        <p>스펙잇는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.</p>
        <ul>
          <li>이용자가 사전에 동의한 경우</li>
          <li>법령의 규정에 의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
        </ul>
      </>
    ),
  },
  {
    title: '5. 개인정보의 처리 위탁',
    content: (
      <>
        <p>스펙잇는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁하고 있습니다.</p>
        <table>
          <thead>
            <tr>
              <th>수탁업체</th>
              <th>위탁 업무 내용</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Supabase Inc.</td>
              <td>데이터 저장 및 인증 서비스</td>
            </tr>
            <tr>
              <td>Vercel Inc.</td>
              <td>웹 호스팅 및 서비스 배포</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    title: '6. 개인정보의 파기 절차 및 방법',
    content: (
      <>
        <p>스펙잇는 개인정보의 수집 및 이용 목적이 달성된 후에는 다음의 방법으로 파기합니다.</p>
        <ul>
          <li><strong>전자적 파일 형태:</strong> 복구 및 재생이 불가능한 기술적 방법을 사용하여 안전하게 삭제</li>
          <li><strong>서면 형태:</strong> 분쇄기로 분쇄하거나 소각하여 파기</li>
        </ul>
      </>
    ),
  },
  {
    title: '7. 이용자의 권리와 행사 방법',
    content: (
      <>
        <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
        <ul>
          <li>개인정보 열람 요구</li>
          <li>개인정보 정정 요구</li>
          <li>개인정보 삭제 요구</li>
          <li>개인정보 처리정지 요구</li>
        </ul>
        <p>위 권리는 서비스 내 설정 페이지에서 직접 수정하거나, 아래 개인정보 보호책임자에게 이메일로 요청하실 수 있습니다. 요청 접수 후 10일 이내에 처리 결과를 안내드립니다.</p>
      </>
    ),
  },
  {
    title: '8. 개인정보 보호책임자',
    content: (
      <>
        <p>스펙잇는 개인정보 처리에 관한 업무를 총괄하는 개인정보 보호책임자를 다음과 같이 지정하고 있습니다.</p>
        <div className="dpo-info">
          <div><span className="label">이름</span>김은교</div>
          <div><span className="label">이메일</span><a href="mailto:eungyogim04@gmail.com">eungyogim04@gmail.com</a></div>
        </div>
        <p>개인정보 관련 문의, 불만, 피해구제 등은 위 담당자에게 연락해 주시기 바랍니다.</p>
      </>
    ),
  },
  {
    title: '9. 개인정보의 안전성 확보 조치',
    content: (
      <>
        <p>스펙잇는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
        <ul>
          <li><strong>SSL/TLS 암호화:</strong> 데이터 전송 시 암호화 통신을 적용하여 개인정보를 보호합니다.</li>
          <li><strong>접근 권한 제한:</strong> 개인정보에 접근할 수 있는 담당자를 최소한으로 제한합니다.</li>
          <li><strong>정기적 보안 점검:</strong> 시스템 취약점을 주기적으로 점검하고 보안 업데이트를 실시합니다.</li>
        </ul>
      </>
    ),
  },
  {
    title: '10. 쿠키의 사용',
    content: (
      <>
        <p>스펙잇는 서비스 이용 편의를 위해 쿠키(Cookie)를 사용합니다.</p>
        <ul>
          <li><strong>사용 목적:</strong> 로그인 상태 유지, 사용자 설정 저장, 서비스 이용 통계 수집</li>
          <li><strong>쿠키 거부 방법:</strong> 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다. 다만, 쿠키를 거부할 경우 일부 서비스 이용에 제한이 있을 수 있습니다.</li>
        </ul>
      </>
    ),
  },
  {
    title: '11. 개인정보 처리방침 변경',
    content: (
      <>
        <p>이 개인정보처리방침은 법령, 정책 또는 서비스의 변경에 따라 수정될 수 있습니다.</p>
        <ul>
          <li>변경 사항이 있을 경우 시행일 최소 <strong>7일 전</strong>에 서비스 내 공지를 통해 안내합니다.</li>
          <li>중대한 변경의 경우 <strong>30일 전</strong>에 안내합니다.</li>
        </ul>
      </>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 24px 80px' }}>
      <Link
        href="/"
        style={{
          fontSize: 14,
          color: 'var(--p, #4A7FC5)',
          display: 'inline-block',
          marginBottom: 24,
          textDecoration: 'none',
        }}
      >
        &larr; 홈으로
      </Link>

      <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--tx)', marginBottom: 8 }}>
        개인정보처리방침
      </h1>
      <p style={{ fontSize: 14, color: 'var(--tx3, #8e8e93)', marginBottom: 32, lineHeight: 1.6 }}>
        스펙잇(이하 &quot;서비스&quot;)는 개인정보보호법 제30조에 따라 이용자의 개인정보를 보호하고,
        이와 관련한 고충을 신속하고 원활하게 처리하기 위하여 다음과 같이 개인정보 처리방침을 수립 및 공개합니다.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sections.map((section, i) => (
          <section key={i} className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--tx)', marginBottom: 14 }}>
              {section.title}
            </h2>
            <div className="privacy-content">{section.content}</div>
          </section>
        ))}
      </div>

      <div
        style={{
          marginTop: 40,
          paddingTop: 20,
          borderTop: '1px solid var(--bor, rgba(0,0,0,.06))',
          fontSize: 13,
          color: 'var(--tx3, #8e8e93)',
          textAlign: 'center',
        }}
      >
        <p>시행일: 2026년 3월 24일</p>
        <p style={{ marginTop: 4 }}>스펙잇</p>
      </div>

      <style>{`
        .privacy-content p {
          font-size: 14px;
          color: var(--tx2, #6e6e73);
          line-height: 1.8;
          margin-bottom: 12px;
        }
        .privacy-content ul {
          list-style: none;
          padding: 0;
          margin: 0 0 12px 0;
        }
        .privacy-content ul li {
          font-size: 14px;
          color: var(--tx2, #6e6e73);
          line-height: 1.8;
          padding-left: 16px;
          position: relative;
        }
        .privacy-content ul li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 11px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--p, #4A7FC5);
        }
        .privacy-content ul li strong {
          color: var(--tx, #1d1d1f);
          font-weight: 500;
        }
        .privacy-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
          font-size: 13px;
        }
        .privacy-content table th {
          background: var(--sur2, #f5f5f7);
          color: var(--tx2, #6e6e73);
          font-weight: 500;
          padding: 10px 12px;
          text-align: left;
          border-bottom: 1px solid var(--bor, rgba(0,0,0,.08));
        }
        .privacy-content table td {
          padding: 10px 12px;
          color: var(--tx2, #6e6e73);
          border-bottom: 1px solid var(--bor, rgba(0,0,0,.04));
          line-height: 1.6;
        }
        .privacy-content .badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
          white-space: nowrap;
        }
        .privacy-content .badge.required {
          background: rgba(74, 127, 197, 0.12);
          color: #4A7FC5;
        }
        .privacy-content .badge.optional {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }
        .privacy-content .badge.auto {
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
        }
        .privacy-content .dpo-info {
          background: var(--sur2, #f5f5f7);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
        }
        .privacy-content .dpo-info div {
          font-size: 14px;
          color: var(--tx2, #6e6e73);
          line-height: 2;
        }
        .privacy-content .dpo-info .label {
          display: inline-block;
          width: 60px;
          font-weight: 500;
          color: var(--tx, #1d1d1f);
        }
        .privacy-content .dpo-info a {
          color: var(--p, #4A7FC5);
          text-decoration: none;
        }
        .privacy-content .dpo-info a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
