export interface Department {
  id: string
  name: string
  emoji: string
  sub: string
}

export interface SpecItem {
  id: string
  type: 'contest' | 'cert' | 'activity' | 'scholarship'
  title: string
  org: string
  desc: string
  benefit: string
  deadline: string
  icon: string
  bg: string
  diff: '쉬움' | '보통' | '어려움'
  url: string
}

export interface SavedSchedule {
  id: string
  item_id: string
  item_data: SpecItem
  date: string | null
  memo: string
  alert_days: number
  dept: string
  created_at: string
}

export interface Expense {
  id: string
  amount: number
  category: string
  date: string | null
  memo: string
  created_at: string
}

export interface Budget {
  id: string
  category: string
  amount: number
  month: string
}

export interface Grade {
  id: string
  subject: string
  grade: number
  credits: number
  semester: string
  type: string
  created_at: string
}

export interface RoadmapItem {
  id: string
  icon: string
  title: string
  desc: string
}

export interface RoadmapSection {
  q: string
  items: RoadmapItem[]
}

export interface Review {
  id: string
  title: string
  org: string
  result: 'pass' | 'fail' | 'pending' | 'withdraw'
  date: string | null
  category: string
  body: string
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  title: string
  body: string
  category: 'team_recruit' | 'review_share' | 'free'
  tags: string[]
  like_count: number
  comment_count: number
  created_at: string
  updated_at: string
  profiles?: {
    name: string
    department: string | null
    avatar_url: string | null
  }
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  body: string
  created_at: string
  profiles?: {
    name: string
    avatar_url: string | null
  }
}

export interface Notification {
  id: string
  type: string
  message: string
  data: Record<string, unknown> | null
  read: boolean
  created_at: string
}

export interface Profile {
  id: string
  name: string
  department: string | null
  avatar_url: string | null
  onboarded: boolean
  created_at: string
}

export const DEPARTMENTS: Department[] = [
  { id: '인문·어문', name: '인문·어문', emoji: '📖', sub: '국문 영문 불문' },
  { id: '사회·정치', name: '사회·정치', emoji: '🏛️', sub: '사회 정치 행정' },
  { id: '경영·경제', name: '경영·경제', emoji: '📊', sub: '경영 경제 회계' },
  { id: '공학·IT', name: '공학·IT', emoji: '💻', sub: '컴공 전기 기계' },
  { id: '자연과학', name: '자연과학', emoji: '🔬', sub: '수학 물리 화학' },
  { id: '예술·디자인', name: '예술·디자인', emoji: '🎨', sub: '시각 산업 미술' },
  { id: '의약·보건', name: '의약·보건', emoji: '🏥', sub: '의대 약대 간호' },
  { id: '교육·사범', name: '교육·사범', emoji: '📚', sub: '교육 사범 유아' },
  { id: '법학', name: '법학', emoji: '⚖️', sub: '법학 법무 경찰' },
  { id: '미디어·광고', name: '미디어·광고', emoji: '📡', sub: '언론 광고 홍보' },
  { id: '농림·환경', name: '농림·환경', emoji: '🌿', sub: '농학 식품 환경' },
  { id: '건축·도시', name: '건축·도시', emoji: '🏗️', sub: '건축 도시 토목' },
]

export const TYPE_LABELS: Record<string, string> = {
  contest: '공모전',
  cert: '자격증',
  activity: '대외활동',
  scholarship: '장학금',
}

export const TYPE_BADGE_CLASSES: Record<string, string> = {
  contest: 'badge-coral',
  cert: 'badge-amber',
  activity: 'badge-teal',
  scholarship: 'badge-purple',
}

export const DIFF_BADGE_CLASSES: Record<string, string> = {
  '쉬움': 'badge-green',
  '보통': 'badge-blue',
  '어려움': 'badge-red',
}

export const DOT_COLORS: Record<string, string> = {
  contest: 'var(--cm)',
  cert: 'var(--am)',
  activity: 'var(--tm)',
}

export const CAT_META: Record<string, { icon: string; bg: string; color: string }> = {
  '식비': { icon: '🍔', bg: 'var(--al)', color: 'var(--am)' },
  '교통': { icon: '🚌', bg: 'var(--tl)', color: 'var(--tm)' },
  '교재': { icon: '📚', bg: 'var(--pl)', color: 'var(--pm)' },
  '카페': { icon: '☕', bg: 'var(--cl)', color: 'var(--cm)' },
  '여가': { icon: '🎮', bg: 'var(--bl)', color: 'var(--b)' },
  '기타': { icon: '🛍️', bg: 'var(--sur2)', color: 'var(--tx3)' },
}

export const GRADE_LABELS: Record<string, string> = {
  '4.5': 'A+', '4.0': 'A0', '3.5': 'B+', '3.0': 'B0',
  '2.5': 'C+', '2.0': 'C0', '1.5': 'D+', '1.0': 'D0',
  '0.0': 'F', '-1': 'P',
}

export const GRADE_COLORS: Record<string, string> = {
  '4.5': '#3B6D11', '4.0': '#3B6D11', '3.5': '#1A5FA0', '3.0': '#1A5FA0',
  '2.5': '#BA7517', '2.0': '#BA7517', '1.5': '#A32D2D', '1.0': '#A32D2D',
  '0.0': '#A32D2D',
}
