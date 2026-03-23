'use client'
import { useEffect } from 'react'
import { errorReporter } from '@/lib/errorReporting'

export default function ErrorReporterInit() {
  useEffect(() => {
    errorReporter.init(process.env.NEXT_PUBLIC_SENTRY_DSN)
  }, [])
  return null
}
