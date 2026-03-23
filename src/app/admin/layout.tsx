import { ToastProvider } from '@/components/ui/Toast'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px', minHeight: '100vh', background: 'var(--bg)', color: 'var(--txt)' }}>
        {children}
      </div>
    </ToastProvider>
  )
}
