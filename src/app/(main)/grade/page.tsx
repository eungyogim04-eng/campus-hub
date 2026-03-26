'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'
import { Grade, GRADE_LABELS, GRADE_COLORS } from '@/types'
import ExportButton from '@/components/ui/ExportButton'

const DEMO_GRADES = [
  { id: 'dg1', subject: '마케팅원론', grade: 4.5, credits: 3, semester: '2025-2', type: '전공필수', created_at: '' },
  { id: 'dg2', subject: '경영학원론', grade: 4.0, credits: 3, semester: '2025-2', type: '전공필수', created_at: '' },
  { id: 'dg3', subject: '통계학', grade: 3.5, credits: 3, semester: '2025-2', type: '전공선택', created_at: '' },
  { id: 'dg4', subject: '영어회화', grade: 4.5, credits: 2, semester: '2025-2', type: '교양필수', created_at: '' },
  { id: 'dg5', subject: '심리학개론', grade: 4.0, credits: 3, semester: '2025-2', type: '교양선택', created_at: '' },
  { id: 'dg6', subject: '미시경제학', grade: 3.5, credits: 3, semester: '2025-1', type: '전공필수', created_at: '' },
  { id: 'dg7', subject: '재무관리', grade: 4.0, credits: 3, semester: '2025-1', type: '전공선택', created_at: '' },
  { id: 'dg8', subject: '글쓰기', grade: 4.5, credits: 2, semester: '2025-1', type: '교양필수', created_at: '' },
  { id: 'dg9', subject: '데이터분석', grade: 3.0, credits: 3, semester: '2025-1', type: '전공선택', created_at: '' },
]

export default function GradePage() {
  const supabase = createClient()
  const { showToast } = useToast()
  const [grades, setGrades] = useState<Grade[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [semFilter, setSemFilter] = useState('all')
  const [gpaTarget, setGpaTarget] = useState('4.0')
  const [remainSemesters, setRemainSemesters] = useState('3')
  const [gradReq, setGradReq] = useState({ total: '130', major: '60', liberal: '30', doubleMajor: '0', minor: '0' })
  const [form, setForm] = useState({ subject: '', grade: '4.5', credits: '3', semester: '2026-1', type: '전공필수' })
  const userRef = useRef<string | null>(null)

  useEffect(() => { loadGrades() }, [])

  const loadGrades = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    userRef.current = user?.id ?? null

    if (!user) {
      setGrades(DEMO_GRADES)
      return
    }

    const { data } = await supabase.from('grades').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (data) {
      setGrades(data)
    }
  }

  const addGrade = async () => {
    if (!form.subject.trim()) { showToast('⚠️ 과목명을 입력해주세요'); return }
    const insertData: Record<string, unknown> = { subject: form.subject.trim(), grade: parseFloat(form.grade), credits: parseInt(form.credits), semester: form.semester, type: form.type }
    if (userRef.current) insertData.user_id = userRef.current
    const { error } = await supabase.from('grades').insert(insertData)
    if (error) { showToast('⚠️ 성적 추가에 실패했습니다'); return }
    setModalOpen(false); setForm({ subject: '', grade: '4.5', credits: '3', semester: '2026-1', type: '전공필수' }); loadGrades(); showToast(`📝 ${form.subject} 성적 추가!`)
  }

  const deleteGrade = async (id: string) => {
    if (id.startsWith('dg')) { setGrades(prev => prev.filter(g => g.id !== id)); return }
    const { error } = await supabase.from('grades').delete().eq('id', id)
    if (error) { showToast('⚠️ 삭제에 실패했습니다'); return }
    setGrades(prev => prev.filter(g => g.id !== id))
  }

  const filtered = semFilter === 'all' ? grades : grades.filter(g => g.semester === semFilter)
  const counted = filtered.filter(g => g.grade >= 0)
  const totalCredits = counted.reduce((s, g) => s + g.credits, 0)
  const weightedSum = counted.reduce((s, g) => s + g.grade * g.credits, 0)
  const avg = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : null
  const dist: Record<string, number> = { 'A+': 0, 'A0': 0, 'B+': 0, 'B0': 0, 'C+': 0, 'C0': 0, 'D+': 0, 'D0': 0, 'F': 0 }
  counted.forEach(g => { const lbl = GRADE_LABELS[g.grade.toFixed(1)]; if (lbl && dist[lbl] !== undefined) dist[lbl]++ })
  const maxVal = Math.max(...Object.values(dist), 1)
  const barColors: Record<string, string> = { 'A+':'#3B6D11','A0':'#3B6D11','B+':'#1A5FA0','B0':'#1A5FA0','C+':'#BA7517','C0':'#BA7517','D+':'#A32D2D','D0':'#A32D2D','F':'#A32D2D' }
  const grouped: Record<string, Grade[]> = {}
  filtered.forEach(g => { if (!grouped[g.semester]) grouped[g.semester] = []; grouped[g.semester].push(g) })

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div><div className="text-xl font-semibold">학점 관리</div><div className="text-[13px] text-[var(--tx3)] mt-0.5">과목별 성적을 입력하면 평균 학점을 자동 계산해줘요</div></div>
        <div className="flex gap-2"><ExportButton data={grades} columns={[{key:'subject',label:'과목명'},{key:'semester',label:'학기'},{key:'type',label:'이수구분'},{key:'credits',label:'학점'},{key:'grade',label:'성적'}]} filename="학점관리" title="학점 관리 내역" /><button className="btn" onClick={() => setModalOpen(true)}>+ 과목 추가</button></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="stat-card"><div className="stat-label">평균 학점</div><div className="stat-val" style={{color:'var(--p)'}}>{avg||'—'}</div><div className="stat-sub">4.5 만점</div></div>
        <div className="stat-card"><div className="stat-label">이수 학점</div><div className="stat-val">{totalCredits}</div></div>
        <div className="stat-card"><div className="stat-label">수강 과목</div><div className="stat-val">{filtered.length}</div></div>
        <div className="stat-card"><div className="stat-label">목표 학점</div><div className="stat-val" style={{color:'var(--a)'}}>{gpaTarget||'—'}</div><div className="stat-sub"><input type="number" placeholder="4.0" min="0" max="4.5" step="0.1" value={gpaTarget} onChange={e=>setGpaTarget(e.target.value)} className="w-[60px] border-none bg-transparent text-[11px] text-[var(--tx3)] outline-none text-center p-0"/></div></div>
      </div>
      <div className="card mb-5"><div className="card-title">성적 분포</div><div className="flex gap-1 items-end h-20 mb-2">{Object.entries(dist).map(([lbl,cnt])=>(<div key={lbl} className="flex-1 flex flex-col items-center gap-1"><div className="text-[10px] text-[var(--tx3)]">{cnt||''}</div><div className="w-full rounded-t" style={{background:barColors[lbl],opacity:cnt?1:.15,height:`${Math.round((cnt/maxVal)*60)+4}px`}}/><div className="text-[10px] text-[var(--tx3)]">{lbl}</div></div>))}</div></div>

      {/* ═══ 졸업요건 & 목표학점 시뮬레이터 ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* 졸업요건 현황 */}
        <div className="card">
          <div className="card-title">🎓 졸업요건 현황</div>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 8 }}>졸업에 필요한 학점을 직접 설정하세요</div>
          <div className="flex gap-2 mb-3">
            <button onClick={() => setGradReq(prev => ({ ...prev, doubleMajor: parseInt(prev.doubleMajor) > 0 ? '0' : '36' }))} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, border: '1px solid var(--bor)', background: parseInt(gradReq.doubleMajor) > 0 ? 'var(--pl)' : 'transparent', color: parseInt(gradReq.doubleMajor) > 0 ? 'var(--p)' : 'var(--tx3)', cursor: 'pointer', fontWeight: 500 }}>
              {parseInt(gradReq.doubleMajor) > 0 ? '✓ 복수전공' : '+ 복수전공'}
            </button>
            <button onClick={() => setGradReq(prev => ({ ...prev, minor: parseInt(prev.minor) > 0 ? '0' : '21' }))} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, border: '1px solid var(--bor)', background: parseInt(gradReq.minor) > 0 ? 'var(--pl)' : 'transparent', color: parseInt(gradReq.minor) > 0 ? 'var(--p)' : 'var(--tx3)', cursor: 'pointer', fontWeight: 500 }}>
              {parseInt(gradReq.minor) > 0 ? '✓ 부전공' : '+ 부전공'}
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: '총 이수학점', key: 'total' as const, current: totalCredits },
              { label: '전공 학점', key: 'major' as const, current: grades.filter(g => g.type?.startsWith('전공')).reduce((s, g) => s + g.credits, 0) },
              { label: '교양 학점', key: 'liberal' as const, current: grades.filter(g => g.type?.startsWith('교양')).reduce((s, g) => s + g.credits, 0) },
              ...(parseInt(gradReq.doubleMajor) > 0 ? [{ label: '복수전공', key: 'doubleMajor' as const, current: grades.filter(g => g.type === '복수전공').reduce((s, g) => s + g.credits, 0) }] : []),
              ...(parseInt(gradReq.minor) > 0 ? [{ label: '부전공', key: 'minor' as const, current: grades.filter(g => g.type === '부전공').reduce((s, g) => s + g.credits, 0) }] : []),
            ].map(req => {
              const target = parseInt(gradReq[req.key]) || 0
              const pct = target > 0 ? Math.min(100, Math.round((req.current / target) * 100)) : 0
              const remain = Math.max(0, target - req.current)
              return (
                <div key={req.key}>
                  <div className="flex justify-between items-center mb-1">
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{req.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontSize: 12, color: pct >= 100 ? 'var(--t)' : 'var(--txt)' }}>{req.current}</span>
                      <span style={{ fontSize: 11, color: 'var(--tx3)' }}>/</span>
                      <input type="number" value={gradReq[req.key]} onChange={e => setGradReq({ ...gradReq, [req.key]: e.target.value })} style={{ width: 44, border: '1px solid var(--bor)', borderRadius: 6, padding: '2px 4px', fontSize: 12, textAlign: 'center', background: 'var(--sur2)', color: 'var(--txt)', outline: 'none' }} />
                    </div>
                  </div>
                  <div className="progress-wrap"><div className="progress-bar" style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--t)' : 'var(--p)' }} /></div>
                  <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>
                    {pct >= 100 ? '✅ 충족' : `${remain}학점 남음`}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 목표학점 시뮬레이터 */}
        <div className="card">
          <div className="card-title">🎯 목표 학점 시뮬레이터</div>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 12 }}>남은 학기 동안 필요한 평균 학점을 계산해요</div>

          <div className="flex gap-3 mb-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">목표 졸업 학점</label>
              <input type="number" className="form-input" value={gpaTarget} onChange={e => setGpaTarget(e.target.value)} min="0" max="4.5" step="0.1" style={{ fontSize: 14, fontWeight: 600, textAlign: 'center' }} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">남은 학기</label>
              <select className="form-input" value={remainSemesters} onChange={e => setRemainSemesters(e.target.value)} style={{ fontSize: 14, fontWeight: 600, textAlign: 'center' }}>
                <option value="1">1학기</option><option value="2">2학기</option><option value="3">3학기</option><option value="4">4학기</option><option value="5">5학기</option><option value="6">6학기</option>
              </select>
            </div>
          </div>

          {(() => {
            const target = parseFloat(gpaTarget) || 0
            const remain = parseInt(remainSemesters) || 1
            const totalReq = parseInt(gradReq.total) || 130
            const remainCredits = Math.max(0, totalReq - totalCredits)
            const creditsPerSem = remain > 0 ? Math.ceil(remainCredits / remain) : 0
            const currentWeighted = weightedSum
            const neededWeighted = target * totalReq
            const neededGpa = remainCredits > 0 ? Math.max(0, (neededWeighted - currentWeighted) / remainCredits) : 0
            const isPossible = neededGpa <= 4.5
            const diff = target - (parseFloat(avg || '0'))

            return (
              <div style={{ background: 'var(--sur2)', borderRadius: 12, padding: 16 }}>
                <div className="flex justify-between items-center mb-3">
                  <span style={{ fontSize: 13, color: 'var(--tx2)' }}>현재 평균</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--p)' }}>{avg || '—'}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span style={{ fontSize: 13, color: 'var(--tx2)' }}>목표까지 차이</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: diff > 0 ? 'var(--c)' : 'var(--t)' }}>
                    {diff > 0 ? `+${diff.toFixed(2)} 필요` : diff === 0 ? '달성!' : `${Math.abs(diff).toFixed(2)} 여유`}
                  </span>
                </div>
                <div style={{ borderTop: '1px solid var(--bor)', paddingTop: 12, marginTop: 4 }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ fontSize: 13, color: 'var(--tx2)' }}>남은 {remain}학기 동안 필요 평균</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: isPossible ? (neededGpa > 4.0 ? 'var(--c)' : 'var(--t)') : 'var(--r)' }}>
                      {neededGpa.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: 12, color: 'var(--tx3)' }}>학기당 이수 학점</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{creditsPerSem}학점</span>
                  </div>
                  {!isPossible && (
                    <div style={{ marginTop: 8, fontSize: 12, color: 'var(--r)', background: 'var(--rl)', padding: '6px 10px', borderRadius: 8 }}>
                      ⚠️ 4.5 만점 기준 달성이 어렵습니다. 목표를 조정해보세요.
                    </div>
                  )}
                  {isPossible && neededGpa <= parseFloat(avg || '0') && (
                    <div style={{ marginTop: 8, fontSize: 12, color: 'var(--t)', background: 'var(--gl)', padding: '6px 10px', borderRadius: 8 }}>
                      ✅ 현재 페이스를 유지하면 충분히 달성 가능합니다!
                    </div>
                  )}
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      <div className="card">
        <div className="card-title">과목 목록 <select className="form-input" style={{width:'140px',padding:'4px 8px',fontSize:'12px'}} value={semFilter} onChange={e=>setSemFilter(e.target.value)}><option value="all">전체 학기</option><option value="2026-1">2026년 1학기</option><option value="2025-2">2025년 2학기</option><option value="2025-1">2025년 1학기</option></select></div>
        {filtered.length===0?(<div className="empty"><div className="empty-ic">📝</div><p>+ 과목 추가 버튼으로 성적을 입력해보세요</p></div>):(
          Object.entries(grouped).sort((a,b)=>b[0].localeCompare(a[0])).map(([sem,list])=>{
            const sc=list.filter(g=>g.grade>=0); const st=sc.reduce((s,g)=>s+g.credits,0); const sa=st>0?(sc.reduce((s,g)=>s+g.grade*g.credits,0)/st).toFixed(2):'—'
            return(<div key={sem} className="mb-4"><div className="text-[11px] font-semibold text-[var(--tx3)] mb-2 flex justify-between"><span>{sem.replace('-','년 ')}학기</span><span>평균 <b className="text-[var(--p)]">{sa}</b> · {st}학점</span></div>
              {list.map(g=>{const lbl=GRADE_LABELS[g.grade.toFixed(1)]||'P';const col=g.grade>=0?(GRADE_COLORS[g.grade.toFixed(1)]||'var(--tx3)'):'var(--b)';const bg=g.grade>=3.5?'var(--gl)':g.grade>=2.5?'var(--bl)':g.grade>=1.5?'var(--al)':'var(--rl)'
                return(<div key={g.id} className="grade-row"><div className="flex-1"><div className="text-[13px] font-medium">{g.subject}</div><div className="text-[11px] text-[var(--tx3)]">{g.type} · {g.credits}학점</div></div><div className="grade-badge" style={{background:g.grade>=0?bg:'var(--bl)',color:col}}>{lbl}</div><button onClick={()=>deleteGrade(g.id)} className="bg-transparent border-none text-[var(--tx3)] cursor-pointer text-[15px] p-0.5">×</button></div>)
              })}</div>)
          })
        )}
      </div>
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="📝 과목 추가" subtitle="과목명과 성적을 입력하세요">
        <div className="form-group"><label className="form-label">과목명</label><input className="form-input" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="예: 마케팅원론" autoFocus/></div>
        <div className="form-row"><div className="form-group" style={{flex:1}}><label className="form-label">성적</label><select className="form-input" value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})}><option value="4.5">A+ (4.5)</option><option value="4.0">A0 (4.0)</option><option value="3.5">B+ (3.5)</option><option value="3.0">B0 (3.0)</option><option value="2.5">C+ (2.5)</option><option value="2.0">C0 (2.0)</option><option value="1.5">D+ (1.5)</option><option value="1.0">D0 (1.0)</option><option value="0.0">F (0.0)</option></select></div><div className="form-group" style={{flex:1}}><label className="form-label">학점</label><select className="form-input" value={form.credits} onChange={e=>setForm({...form,credits:e.target.value})}><option value="1">1학점</option><option value="2">2학점</option><option value="3">3학점</option><option value="4">4학점</option></select></div></div>
        <div className="form-row"><div className="form-group" style={{flex:1}}><label className="form-label">학기</label><select className="form-input" value={form.semester} onChange={e=>setForm({...form,semester:e.target.value})}><option value="2026-1">2026년 1학기</option><option value="2025-2">2025년 2학기</option><option value="2025-1">2025년 1학기</option></select></div><div className="form-group" style={{flex:1}}><label className="form-label">이수구분</label><select className="form-input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>전공필수</option><option>전공선택</option><option>교양필수</option><option>교양선택</option><option>복수전공</option><option>부전공</option></select></div></div>
        <div className="modal-actions"><button className="btn-ghost" onClick={()=>setModalOpen(false)}>취소</button><button className="btn" onClick={addGrade}>✓ 추가</button></div>
      </Modal>
    </div>
  )
}
