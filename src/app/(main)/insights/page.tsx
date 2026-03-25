'use client'

const SEMESTER_SCHOLARSHIPS = [0, 1000000, 6500000, 2250000]
const MONTH_LABELS = ['2024-1', '2024-2', '2025-1', '2025-2']

const SEMESTER_GPAS = [3.45, 3.62, 3.78, 3.90]
const SEMESTER_LABELS = ['2024-1', '2024-2', '2025-1', '2025-2']

const CATEGORY_DATA = [
  { label: '국가장학금', pct: 33, color: '#FB8C00' },
  { label: '교내장학금', pct: 15, color: '#F0A85C' },
  { label: '재단장학금', pct: 42, color: '#F59E0B' },
  { label: '기타', pct: 10, color: '#10B981' },
]

const SPEC_DATA = [
  { type: '자격증', done: 3, inProgress: 1 },
  { type: '공모전', done: 2, inProgress: 2 },
  { type: '대외활동', done: 1, inProgress: 1 },
  { type: '프로젝트', done: 4, inProgress: 3 },
  { type: '봉사', done: 2, inProgress: 0 },
]

/* ── helpers ─────────────────────────────────────────── */

function buildPolyline(
  values: number[],
  svgW: number,
  svgH: number,
  padX: number,
  padTop: number,
  padBot: number,
) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const rangeY = max - min || 1
  const usableW = svgW - padX * 2
  const usableH = svgH - padTop - padBot
  return values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * usableW
    const y = padTop + usableH - ((v - min) / rangeY) * usableH
    return { x, y, value: v }
  })
}

function yTicks(min: number, max: number, count: number) {
  const step = (max - min) / (count - 1)
  return Array.from({ length: count }, (_, i) => min + step * i)
}

/* ── Line Chart ──────────────────────────────────────── */

function LineChart({
  values,
  labels,
  formatY,
  title,
}: {
  values: number[]
  labels: string[]
  formatY: (v: number) => string
  title: string
}) {
  const svgW = 520
  const svgH = 240
  const padX = 60
  const padTop = 20
  const padBot = 32

  const pts = buildPolyline(values, svgW, svgH, padX, padTop, padBot)
  const polyStr = pts.map((p) => `${p.x},${p.y}`).join(' ')

  const min = Math.min(...values)
  const max = Math.max(...values)
  const ticks = yTicks(min, max, 5)
  const usableH = svgH - padTop - padBot
  const rangeY = max - min || 1

  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 className="card-title" style={{ marginBottom: 16 }}>{title}</h3>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ width: '100%', height: 'auto' }}
      >
        {/* grid lines + y labels */}
        {ticks.map((t, i) => {
          const y = padTop + usableH - ((t - min) / rangeY) * usableH
          return (
            <g key={i}>
              <line
                x1={padX}
                y1={y}
                x2={svgW - 12}
                y2={y}
                stroke="var(--bor)"
                strokeWidth={0.5}
              />
              <text
                x={padX - 8}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fill="var(--tx3)"
              >
                {formatY(t)}
              </text>
            </g>
          )
        })}

        {/* line */}
        <polyline
          points={polyStr}
          fill="none"
          stroke="var(--p)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* area fill */}
        <polygon
          points={`${pts[0].x},${svgH - padBot} ${polyStr} ${pts[pts.length - 1].x},${svgH - padBot}`}
          fill="var(--p)"
          opacity={0.07}
        />

        {/* dots + x labels */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill="var(--p)" />
            <circle cx={p.x} cy={p.y} r={2} fill="#fff" />
            <text
              x={p.x}
              y={svgH - padBot + 16}
              textAnchor="middle"
              fontSize={10}
              fill="var(--tx3)"
            >
              {labels[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/* ── Donut Chart (CSS conic-gradient) ────────────────── */

function DonutChart() {
  let cumulative = 0
  const stops = CATEGORY_DATA.map((d) => {
    const start = cumulative
    cumulative += d.pct
    return `${d.color} ${start}% ${cumulative}%`
  }).join(', ')

  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 className="card-title" style={{ marginBottom: 16 }}>장학금 유형별 비율</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: `conic-gradient(${stops})`,
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 40,
              borderRadius: '50%',
              background: 'var(--sur)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--tx)',
            }}
          >
            장학금
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CATEGORY_DATA.map((d) => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: d.color,
                  flexShrink: 0,
                }}
              />
              <span className="stat-label" style={{ minWidth: 36 }}>{d.label}</span>
              <span className="stat-val" style={{ fontWeight: 600 }}>{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Horizontal Bar Chart ────────────────────────────── */

function SpecBarChart() {
  const maxVal = Math.max(...SPEC_DATA.map((d) => d.done + d.inProgress))

  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 className="card-title" style={{ marginBottom: 16 }}>스펙 진행 현황</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {SPEC_DATA.map((d) => {
          const total = d.done + d.inProgress
          const donePct = (d.done / maxVal) * 100
          const ipPct = (d.inProgress / maxVal) * 100
          return (
            <div key={d.type}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                <span className="stat-label">{d.type}</span>
                <span style={{ color: 'var(--tx3)', fontSize: 11 }}>
                  완료 {d.done} / 진행 {d.inProgress}
                </span>
              </div>
              <div
                style={{
                  height: 18,
                  borderRadius: 6,
                  background: 'var(--bor)',
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    width: `${donePct}%`,
                    background: 'var(--p)',
                    borderRadius: '6px 0 0 6px',
                    transition: 'width .4s',
                  }}
                />
                <div
                  style={{
                    width: `${ipPct}%`,
                    background: 'var(--p)',
                    opacity: 0.35,
                    transition: 'width .4s',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 11, color: 'var(--tx3)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--p)' }} />
          완료
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--p)', opacity: 0.35 }} />
          진행중
        </span>
      </div>
    </div>
  )
}

/* ── Summary Stat Cards ──────────────────────────────── */

function SummaryCards() {
  const totalScholarship = SEMESTER_SCHOLARSHIPS.reduce((a, b) => a + b, 0)
  const latestGpa = SEMESTER_GPAS[SEMESTER_GPAS.length - 1]
  const totalSpecs = SPEC_DATA.reduce((a, d) => a + d.done, 0)
  const inProgressSpecs = SPEC_DATA.reduce((a, d) => a + d.inProgress, 0)

  const cards = [
    { label: '총 장학금', value: `${Math.round(totalScholarship / 10000)}만원` },
    { label: '최근 장학금', value: `${Math.round(SEMESTER_SCHOLARSHIPS[SEMESTER_SCHOLARSHIPS.length - 1] / 10000)}만원` },
    { label: '최근 학점', value: latestGpa.toFixed(2) },
    { label: '완료 스펙', value: `${totalSpecs}건` },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
      {cards.map((c) => (
        <div key={c.label} className="stat-card" style={{ padding: 16, background: 'var(--sur)', borderRadius: 'var(--rad)', border: '.5px solid var(--bor)' }}>
          <div className="stat-label" style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>{c.label}</div>
          <div className="stat-val" style={{ fontSize: 20, fontWeight: 700, color: 'var(--tx)' }}>{c.value}</div>
        </div>
      ))}
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────── */

export default function InsightsPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>인사이트</h2>

      <SummaryCards />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16, marginTop: 20 }}>
        <LineChart
          values={SEMESTER_SCHOLARSHIPS}
          labels={MONTH_LABELS}
          formatY={(v) => `${Math.round(v / 10000)}만`}
          title="학기별 장학금 수령"
        />
        <LineChart
          values={SEMESTER_GPAS}
          labels={SEMESTER_LABELS}
          formatY={(v) => v.toFixed(2)}
          title="학기별 학점 변화"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16, marginTop: 16 }}>
        <DonutChart />
        <SpecBarChart />
      </div>
    </div>
  )
}
