import type { Metadata } from 'next'
import './globals.css'
import ErrorReporterInit from '@/components/ErrorReporterInit'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

export const metadata: Metadata = {
  title: {
    default: '캠퍼스 허브 - 대학생 공모전·자격증·대외활동 올인원 플랫폼',
    template: '%s | 캠퍼스 허브',
  },
  description: '공모전, 자격증, 대외활동 정보를 한 곳에서. 학점관리, 스펙 로드맵, 생활비 관리까지. 대학생 필수 플랫폼.',
  keywords: ['공모전', '자격증', '대외활동', '대학생', '스펙관리', '학점관리', '캠퍼스허브', '취업준비'],
  authors: [{ name: '캠퍼스 허브' }],
  creator: '캠퍼스 허브',
  metadataBase: new URL('https://campushub.kr'),
  openGraph: {
    title: '캠퍼스 허브 - 대학생 올인원 플랫폼',
    description: '공모전·자격증·대외활동 정보를 한 곳에서 관리하세요.',
    url: 'https://campushub.kr',
    siteName: '캠퍼스 허브',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '캠퍼스 허브',
    description: '대학생 공모전·자격증·대외활동 올인원 플랫폼',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/icon-192.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body><ErrorReporterInit /><ServiceWorkerRegister />{children}</body>
    </html>
  )
}
