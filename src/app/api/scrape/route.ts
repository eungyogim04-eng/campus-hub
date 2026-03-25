import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SpecIt/1.0)' },
      signal: AbortSignal.timeout(10000),
    })
    const html = await res.text()

    // Extract metadata from HTML
    const getMetaContent = (name: string): string => {
      const patterns = [
        new RegExp(`<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'),
        new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${name}["']`, 'i'),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, 'i'),
      ]
      for (const p of patterns) {
        const m = html.match(p)
        if (m) return m[1].trim()
      }
      return ''
    }

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)

    const title = getMetaContent('og:title') || titleMatch?.[1]?.trim() || ''
    const description = getMetaContent('og:description') || getMetaContent('description') || ''
    const siteName = getMetaContent('og:site_name') || ''
    const image = getMetaContent('og:image') || ''

    // Auto-classify type based on keywords in title and description
    const text = (title + ' ' + description + ' ' + url).toLowerCase()
    let type = 'contest'
    if (text.includes('자격증') || text.includes('시험') || text.includes('필기') || text.includes('실기') || text.includes('자격') || text.includes('큐넷')) {
      type = 'cert'
    } else if (text.includes('인턴') || text.includes('봉사') || text.includes('대외활동') || text.includes('서포터즈') || text.includes('체험') || text.includes('캠프') || text.includes('부스트')) {
      type = 'activity'
    }

    // Try to find deadline from text
    let deadline = ''
    const datePatterns = [
      /(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/,
      /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/,
    ]
    // Look for dates near keywords like 마감, 접수기간, 모집기간
    const deadlineSection = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
    const deadlineKeywords = ['마감', '접수', '모집기간', '신청기간', '지원기간']
    for (const keyword of deadlineKeywords) {
      const idx = deadlineSection.indexOf(keyword)
      if (idx >= 0) {
        const nearby = deadlineSection.substring(idx, idx + 100)
        for (const pattern of datePatterns) {
          const m = nearby.match(pattern)
          if (m) {
            deadline = `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`
            break
          }
        }
        if (deadline) break
      }
    }

    // Auto-determine difficulty
    let diff = '보통'
    if (text.includes('초급') || text.includes('쉬운') || text.includes('입문') || text.includes('기초')) diff = '쉬움'
    if (text.includes('고급') || text.includes('어려운') || text.includes('심화') || text.includes('전문가')) diff = '어려움'

    // Auto-determine icon
    let icon = '🏆'
    if (type === 'cert') icon = '📋'
    else if (type === 'activity') icon = '🌟'
    if (text.includes('마케팅') || text.includes('광고')) icon = '📢'
    if (text.includes('디자인') || text.includes('ui') || text.includes('ux')) icon = '🎨'
    if (text.includes('개발') || text.includes('코딩') || text.includes('프로그래밍') || text.includes('해커톤')) icon = '💻'
    if (text.includes('창업') || text.includes('스타트업')) icon = '🚀'
    if (text.includes('영어') || text.includes('토익') || text.includes('토플')) icon = '🌏'
    if (text.includes('봉사') || text.includes('사회')) icon = '🤝'

    // Extract benefit/prize info
    let benefit = ''
    const prizePatterns = [/상금[:\s]*([^\n<,]{2,30})/, /시상[:\s]*([^\n<,]{2,30})/, /혜택[:\s]*([^\n<,]{2,30})/, /지원금[:\s]*([^\n<,]{2,30})/]
    for (const p of prizePatterns) {
      const m = deadlineSection.match(p)
      if (m) { benefit = m[1].trim(); break }
    }

    return NextResponse.json({
      title,
      description: description.slice(0, 200),
      org: siteName,
      type,
      deadline,
      diff,
      icon,
      benefit,
      url,
      image,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch URL' }, { status: 500 })
  }
}
