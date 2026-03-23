import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'

const limiter = rateLimit({ windowMs: 60000, max: 60 })

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const { success, remaining, resetIn } = limiter(ip)

  if (!success) {
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(resetIn / 1000)), 'X-RateLimit-Remaining': '0' } }
    )
  }

  return NextResponse.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    { headers: { 'X-RateLimit-Remaining': String(remaining) } }
  )
}
