// 금지어 필터 - 커뮤니티 게시글/댓글/태그에 적용
const BANNED_WORDS = [
  // 욕설/비속어
  '시발', '씨발', '씨팔', '시팔', '개새끼', '새끼', '병신', '빙신', '지랄', '좆', '썅',
  '닥쳐', '꺼져', 'ㅅㅂ', 'ㅂㅅ', 'ㅈㄹ', 'ㅆㅂ', 'ㅗ',
  // 차별/혐오
  '한남', '한녀', '틀딱', '급식충',
  // 도박/불법
  '도박', '카지노', '토토', '불법도박',
  // 성인/음란
  '야동', '포르노', '성인사이트',
  // 사기
  '대리시험', '대필', '레포트대행',
]

// 변형 탐지 (ㅅㅣ발, 시 발, s1bal 등 기본 우회 차단)
function normalize(text: string): string {
  return text
    .replace(/\s+/g, '')           // 공백 제거
    .replace(/[.\-_*!@#$%^&]/g, '') // 특수문자 제거
    .toLowerCase()
}

export function containsBannedWord(text: string): { found: boolean; word?: string } {
  const normalized = normalize(text)
  for (const word of BANNED_WORDS) {
    if (normalized.includes(normalize(word))) {
      return { found: true, word }
    }
  }
  return { found: false }
}

export function filterText(text: string): string {
  let result = text
  for (const word of BANNED_WORDS) {
    const regex = new RegExp(word.split('').join('[\\s.*_-]*'), 'gi')
    result = result.replace(regex, '***')
  }
  return result
}

// 관리자가 금지어를 추가/제거할 수 있도록 localStorage 지원
export function getCustomBannedWords(): string[] {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem('campus-hub-banned-words')
  return saved ? JSON.parse(saved) : []
}

export function addCustomBannedWord(word: string) {
  const words = getCustomBannedWords()
  if (!words.includes(word)) {
    words.push(word)
    localStorage.setItem('campus-hub-banned-words', JSON.stringify(words))
  }
}

export function containsBannedWordFull(text: string): { found: boolean; word?: string } {
  // 기본 금지어 체크
  const basic = containsBannedWord(text)
  if (basic.found) return basic

  // 커스텀 금지어 체크
  const custom = getCustomBannedWords()
  const normalized = normalize(text)
  for (const word of custom) {
    if (normalized.includes(normalize(word))) {
      return { found: true, word }
    }
  }
  return { found: false }
}
