const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
  windowMs?: number
  max?: number
}

export function rateLimit(options: RateLimitOptions = {}) {
  const { windowMs = 60000, max = 30 } = options

  return (identifier: string): { success: boolean; remaining: number; resetIn: number } => {
    const now = Date.now()
    const record = rateLimitMap.get(identifier)

    if (!record || now > record.resetTime) {
      rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
      return { success: true, remaining: max - 1, resetIn: windowMs }
    }

    if (record.count >= max) {
      return { success: false, remaining: 0, resetIn: record.resetTime - now }
    }

    record.count++
    return { success: true, remaining: max - record.count, resetIn: record.resetTime - now }
  }
}

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitMap) {
      if (now > value.resetTime) rateLimitMap.delete(key)
    }
  }, 60000)
}
