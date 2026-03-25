'use client'
import { useState, useRef, useEffect } from 'react'

interface ExportButtonProps {
  data: any[]
  columns: { key: string; label: string }[]
  filename: string
  title: string
}

export default function ExportButton({ data, columns, filename, title }: ExportButtonProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const exportCSV = () => {
    const BOM = '\uFEFF'
    const header = columns.map(c => c.label).join(',')
    const rows = data.map(row =>
      columns.map(c => {
        const val = row[c.key]
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : String(val ?? '')
      }).join(',')
    )
    const csv = BOM + [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${filename}.csv`; a.click()
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  const exportPrint = () => {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
      <style>body{font-family:-apple-system,sans-serif;padding:40px;color:#333}
      h1{font-size:20px;margin-bottom:8px}
      .meta{font-size:12px;color:#888;margin-bottom:24px}
      table{width:100%;border-collapse:collapse;font-size:13px}
      th{background:#f5f5f5;padding:10px 12px;text-align:left;border-bottom:2px solid #ddd;font-weight:600}
      td{padding:8px 12px;border-bottom:1px solid #eee}
      tr:hover td{background:#fafafa}
      @media print{body{padding:20px}}</style></head><body>
      <h1>${title}</h1>
      <div class="meta">스펙잇 · ${new Date().toLocaleDateString('ko-KR')} · ${data.length}건</div>
      <table><thead><tr>${columns.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
      <tbody>${data.map(row => `<tr>${columns.map(c => `<td>${row[c.key] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table>
      </body></html>`)
    w.document.close()
    setTimeout(() => w.print(), 300)
    setOpen(false)
  }

  if (data.length === 0) return null

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen(!open)} className="btn-ghost" style={{ fontSize: 13, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
        ⬇️ 내보내기
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 100,
          background: 'var(--sur)', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,.12)',
          border: '1px solid var(--bor)', padding: 4, minWidth: 160,
        }}>
          {[
            { icon: '📊', label: 'CSV 다운로드', onClick: exportCSV },
            { icon: '🖨️', label: '인쇄 (PDF)', onClick: exportPrint },
          ].map(opt => (
            <button key={opt.label} onClick={opt.onClick} style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '8px 12px', border: 'none', background: 'transparent', borderRadius: 8,
              fontSize: 13, color: 'var(--txt)', cursor: 'pointer',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--sur2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span>{opt.icon}</span><span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
