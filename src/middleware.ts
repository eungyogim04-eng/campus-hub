import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Demo mode: allow all routes
  // TODO: Enable Supabase auth check when ready for production
  // const supabase = createServerClient(...)
  // const { data: { user } } = await supabase.auth.getUser()
  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
