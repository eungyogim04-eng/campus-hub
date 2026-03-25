import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '캠퍼스 허브 - 대학생 공모전·자격증·대외활동 올인원 플랫폼',
  description: '공모전, 자격증, 대외활동 정보를 한 곳에서. 학점관리, 스펙 로드맵, 생활비 관리까지.',
  keywords: ['공모전', '자격증', '대외활동', '대학생', '스펙', '학점관리', '캠퍼스허브'],
  openGraph: {
    title: '캠퍼스 허브 - 대학생 올인원 플랫폼',
    description: '공모전·자격증·대외활동 정보를 한 곳에서 관리하세요.',
    type: 'website',
    locale: 'ko_KR',
    siteName: '캠퍼스 허브',
  },
}

export default function LandingPage() {
  redirect('/auth/login')
}
