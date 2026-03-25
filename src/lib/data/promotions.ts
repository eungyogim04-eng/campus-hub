export interface Promotion {
  id: string
  type: 'banner' | 'featured' | 'sponsored'
  title: string
  description: string
  imageUrl?: string  // external image URL
  linkUrl: string    // where to go when clicked
  sponsor: string    // company name
  category: 'contest' | 'cert' | 'activity' | 'general'
  startDate: string
  endDate: string
  active: boolean
  badge: string  // e.g. "광고", "제휴", "홍보", "스폰서"
}

// Demo promotions (empty by default, admin adds them)
export const PROMOTIONS: Promotion[] = []
