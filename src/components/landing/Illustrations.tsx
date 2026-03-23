'use client'

/* 커스텀 SVG 일러스트레이션 - 캠퍼스 허브 전용 */

export function HeroIllust() {
  return (
    <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 600 }}>
      {/* 배경 도형들 */}
      <circle cx="300" cy="200" r="160" fill="#3182f6" opacity=".06" />
      <circle cx="440" cy="120" r="80" fill="#5DCAA5" opacity=".08" />
      <circle cx="160" cy="300" r="60" fill="#EF9F27" opacity=".08" />

      {/* 메인 카드 - 대시보드 */}
      <rect x="140" y="80" width="320" height="200" rx="20" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
      {/* 카드 내부 - D-day */}
      <rect x="160" y="100" width="90" height="60" rx="10" fill="#3182f6" />
      <text x="175" y="125" fill="#fff" fontSize="10" fontWeight="500" opacity=".7">공모전</text>
      <text x="170" y="148" fill="#fff" fontSize="22" fontWeight="800">D-4</text>

      <rect x="260" y="100" width="90" height="60" rx="10" fill="#f8f9fa" stroke="#e5e7eb" strokeWidth=".5" />
      <text x="275" y="125" fill="#8e8e93" fontSize="10" fontWeight="500">자격증</text>
      <text x="268" y="148" fill="#1d1d1f" fontSize="22" fontWeight="800">D-47</text>

      <rect x="360" y="100" width="90" height="60" rx="10" fill="#f8f9fa" stroke="#e5e7eb" strokeWidth=".5" />
      <text x="372" y="125" fill="#8e8e93" fontSize="10" fontWeight="500">대외활동</text>
      <text x="368" y="148" fill="#1d1d1f" fontSize="22" fontWeight="800">D-53</text>

      {/* 스탯 바 */}
      <rect x="160" y="175" width="140" height="8" rx="4" fill="#e5e7eb" />
      <rect x="160" y="175" width="85" height="8" rx="4" fill="#3182f6" />
      <text x="160" y="200" fill="#8e8e93" fontSize="9">학점 3.82 / 4.5</text>

      <rect x="160" y="220" width="140" height="8" rx="4" fill="#e5e7eb" />
      <rect x="160" y="220" width="45" height="8" rx="4" fill="#5DCAA5" />
      <text x="160" y="245" fill="#8e8e93" fontSize="9">예산 32% 사용</text>

      {/* 체크리스트 */}
      <rect x="330" y="175" width="110" height="85" rx="10" fill="#f8f9fa" />
      <circle cx="348" cy="195" r="6" fill="#3182f6" />
      <rect x="360" y="191" width="65" height="8" rx="3" fill="#e5e7eb" />
      <circle cx="348" cy="215" r="6" fill="#5DCAA5" />
      <rect x="360" y="211" width="50" height="8" rx="3" fill="#e5e7eb" />
      <circle cx="348" cy="235" r="6" fill="none" stroke="#d1d5db" strokeWidth="1.5" />
      <rect x="360" y="231" width="58" height="8" rx="3" fill="#e5e7eb" />

      {/* 떠다니는 요소들 */}
      {/* 졸업모자 */}
      <g transform="translate(80, 60)">
        <rect x="0" y="12" width="40" height="4" rx="1" fill="#1d1d1f" transform="rotate(-5)" />
        <polygon points="20,0 35,10 5,10" fill="#1d1d1f" />
        <circle cx="20" cy="2" r="2" fill="#EF9F27" />
      </g>

      {/* 트로피 */}
      <g transform="translate(500, 140)">
        <rect x="10" y="24" width="20" height="4" rx="1" fill="#EF9F27" />
        <rect x="14" y="20" width="12" height="6" rx="1" fill="#EF9F27" />
        <path d="M12,20 Q12,8 20,4 Q28,8 28,20" fill="#EF9F27" />
        <circle cx="20" cy="4" r="3" fill="#fff" stroke="#EF9F27" strokeWidth="1.5" />
      </g>

      {/* 캘린더 */}
      <g transform="translate(490, 260)">
        <rect x="0" y="0" width="36" height="32" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
        <rect x="0" y="0" width="36" height="10" rx="6" fill="#F0997B" />
        <text x="10" y="25" fill="#1d1d1f" fontSize="12" fontWeight="700">15</text>
      </g>

      {/* 연필 */}
      <g transform="translate(60, 250) rotate(-30)">
        <rect x="0" y="0" width="6" height="35" rx="1" fill="#7c6fef" />
        <polygon points="0,35 6,35 3,42" fill="#1d1d1f" />
        <rect x="0" y="0" width="6" height="6" rx="1" fill="#F0997B" />
      </g>

      {/* 별들 */}
      <circle cx="120" cy="140" r="3" fill="#3182f6" opacity=".3" />
      <circle cx="520" cy="80" r="2" fill="#5DCAA5" opacity=".4" />
      <circle cx="100" cy="320" r="2.5" fill="#EF9F27" opacity=".3" />
      <circle cx="530" cy="340" r="2" fill="#7c6fef" opacity=".3" />
      <circle cx="250" cy="340" r="3" fill="#3182f6" opacity=".2" />
    </svg>
  )
}

export function IconSearch() {
  return (
    <svg viewBox="0 0 48 48" fill="none" style={{ width: 48, height: 48 }}>
      <rect width="48" height="48" rx="14" fill="#3182f6" opacity=".1" />
      <circle cx="22" cy="22" r="8" stroke="#3182f6" strokeWidth="2.5" fill="none" />
      <line x1="28" y1="28" x2="34" y2="34" stroke="#3182f6" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="22" cy="22" r="3" fill="#3182f6" opacity=".2" />
    </svg>
  )
}

export function IconCalendar() {
  return (
    <svg viewBox="0 0 48 48" fill="none" style={{ width: 48, height: 48 }}>
      <rect width="48" height="48" rx="14" fill="#5DCAA5" opacity=".1" />
      <rect x="12" y="14" width="24" height="22" rx="4" stroke="#5DCAA5" strokeWidth="2" fill="none" />
      <rect x="12" y="14" width="24" height="8" rx="4" fill="#5DCAA5" opacity=".15" />
      <line x1="18" y1="11" x2="18" y2="17" stroke="#5DCAA5" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="11" x2="30" y2="17" stroke="#5DCAA5" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="29" r="2" fill="#5DCAA5" />
      <circle cx="28" cy="29" r="2" fill="#5DCAA5" opacity=".4" />
    </svg>
  )
}

export function IconGrade() {
  return (
    <svg viewBox="0 0 48 48" fill="none" style={{ width: 48, height: 48 }}>
      <rect width="48" height="48" rx="14" fill="#EF9F27" opacity=".1" />
      <rect x="13" y="30" width="5" height="8" rx="1.5" fill="#EF9F27" opacity=".4" />
      <rect x="21.5" y="24" width="5" height="14" rx="1.5" fill="#EF9F27" opacity=".6" />
      <rect x="30" y="18" width="5" height="20" rx="1.5" fill="#EF9F27" />
      <path d="M12,28 Q20,16 36,14" stroke="#EF9F27" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 3" />
    </svg>
  )
}

export function IconRoadmap() {
  return (
    <svg viewBox="0 0 48 48" fill="none" style={{ width: 48, height: 48 }}>
      <rect width="48" height="48" rx="14" fill="#F0997B" opacity=".1" />
      <circle cx="16" cy="16" r="4" fill="#F0997B" />
      <circle cx="32" cy="20" r="3" fill="#F0997B" opacity=".5" />
      <circle cx="24" cy="34" r="3.5" fill="#F0997B" opacity=".7" />
      <line x1="16" y1="20" x2="24" y2="31" stroke="#F0997B" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="19" y1="16" x2="29" y2="20" stroke="#F0997B" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M10,38 L14,34 L18,36 L22,30 L26,32 L30,26 L34,28 L38,22" stroke="#F0997B" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".3" />
    </svg>
  )
}

export function IconCommunity() {
  return (
    <svg viewBox="0 0 48 48" fill="none" style={{ width: 48, height: 48 }}>
      <rect width="48" height="48" rx="14" fill="#7c6fef" opacity=".1" />
      <circle cx="20" cy="18" r="5" fill="#7c6fef" opacity=".3" />
      <circle cx="30" cy="20" r="4" fill="#7c6fef" opacity=".5" />
      <path d="M12,36 Q12,28 20,28 Q28,28 28,36" fill="#7c6fef" opacity=".2" />
      <path d="M22,34 Q22,28 30,28 Q38,28 38,34" fill="#7c6fef" opacity=".35" />
      <rect x="14" y="24" width="14" height="8" rx="4" fill="none" stroke="#7c6fef" strokeWidth="1.5" />
      <circle cx="18" cy="28" r="1" fill="#7c6fef" />
      <circle cx="22" cy="28" r="1" fill="#7c6fef" opacity=".5" />
      <circle cx="26" cy="28" r="1" fill="#7c6fef" opacity=".3" />
    </svg>
  )
}

export function IconScholarship() {
  return (
    <svg viewBox="0 0 48 48" fill="none" style={{ width: 48, height: 48 }}>
      <rect width="48" height="48" rx="14" fill="#E8913A" opacity=".1" />
      <path d="M24 14l-10 5.5 10 5.5 10-5.5L24 14z" fill="#E8913A" opacity=".8" />
      <path d="M14 19.5v5c0 2.5 4.5 5 10 5s10-2.5 10-5v-5l-10 5.5-10-5.5z" fill="#E8913A" opacity=".5" />
      <rect x="31" y="18" width="1.5" height="9" rx=".75" fill="#E8913A" />
      <circle cx="31.75" cy="28.5" r="1.5" fill="#E8913A" opacity=".6" />
    </svg>
  )
}
