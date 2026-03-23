interface ErrorContext {
  page?: string
  action?: string
  userId?: string
  extra?: Record<string, unknown>
}

class ErrorReporter {
  private static instance: ErrorReporter
  private errors: Array<{ error: Error; context: ErrorContext; timestamp: string }> = []
  private dsn: string | null = null

  static getInstance() {
    if (!ErrorReporter.instance) ErrorReporter.instance = new ErrorReporter()
    return ErrorReporter.instance
  }

  init(dsn?: string) {
    this.dsn = dsn || null
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (e) => {
        this.captureError(new Error(e.reason?.message || 'Unhandled rejection'), { action: 'unhandledrejection' })
      })
      window.addEventListener('error', (e) => {
        this.captureError(e.error || new Error(e.message), { action: 'window.onerror' })
      })
    }
    console.log('[ErrorReporter] Initialized', dsn ? 'with DSN' : 'in dev mode')
  }

  captureError(error: Error, context: ErrorContext = {}) {
    const entry = { error, context, timestamp: new Date().toISOString() }
    this.errors.push(entry)
    if (this.errors.length > 100) this.errors = this.errors.slice(-100)
    if (this.dsn) {
      // TODO: Send to Sentry API
    }
    console.error('[ErrorReporter]', error.message, context)
  }

  captureMessage(message: string, context: ErrorContext = {}) {
    this.captureError(new Error(message), context)
  }

  getErrors() { return [...this.errors] }
  clearErrors() { this.errors = [] }
}

export const errorReporter = ErrorReporter.getInstance()
export const captureError = (error: Error, context?: ErrorContext) => errorReporter.captureError(error, context)
export const captureMessage = (message: string, context?: ErrorContext) => errorReporter.captureMessage(message, context)
