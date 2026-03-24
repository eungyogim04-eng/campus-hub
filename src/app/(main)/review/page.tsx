'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'
import ShareButton from '@/components/ui/ShareButton'
import { Review } from '@/types'
const RESULT_META: Record<string,{label:string;cls:string}> = { pass:{label:'합격·수상',cls:'pass'}, fail:{label:'불합격',cls:'fail'}, pending:{label:'결과대기',cls:'pending'}, withdraw:{label:'미지원',cls:'withdraw'} }
const CAT_ICON: Record<string,string> = { contest:'🏆', activity:'🤝', cert:'📜', intern:'💼' }
export default function ReviewPage() {
  const supabase = createClient(); const { showToast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([]); const [filter, setFilter] = useState('all'); const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({title:'',org:'',result:'pass',date:'',category:'contest',body:''})
  const userRef = useRef<string | null>(null)

  const DEMO_REVIEWS = [
    { id: 'd1', title: '삼성 마케팅 공모전', org: '삼성전자', result: 'pass' as const, date: '2026-02-15', category: 'contest', body: '3개월 준비해서 은상 수상. 마케팅 전략 수립 경험이 많이 도움됐음. PPT 디자인도 중요하다는 걸 깨달음.', created_at: '2026-02-15' },
    { id: 'd2', title: '정보처리기사 필기', org: '한국산업인력공단', result: 'pass' as const, date: '2026-01-20', category: 'cert', body: '2주 벼락치기로 합격. 기출문제 위주로 공부하니 충분했음.', created_at: '2026-01-20' },
    { id: 'd3', title: 'KOTRA 글로벌 인턴십', org: 'KOTRA', result: 'pending' as const, date: '2026-03-10', category: 'intern', body: '서류 합격 후 면접 대기 중. 무역 실무 경험 기대.', created_at: '2026-03-10' },
  ]

  useEffect(() => { loadReviews() }, [])

  const loadReviews = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    userRef.current = user?.id ?? null

    if (!user) {
      setReviews(DEMO_REVIEWS as any)
      return
    }

    const { data } = await supabase.from('reviews').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (data && data.length > 0) {
      setReviews(data)
    } else {
      setReviews(DEMO_REVIEWS as any)
    }
  }

  const addReview = async () => {
    if(!form.title.trim()){showToast('⚠️ 활동명을 입력해주세요');return}
    const insertData: any = {title:form.title.trim(),org:form.org.trim(),result:form.result,date:form.date||null,category:form.category,body:form.body.trim()}
    if (userRef.current) insertData.user_id = userRef.current
    await supabase.from('reviews').insert(insertData)
    setModalOpen(false); setForm({title:'',org:'',result:'pass',date:'',category:'contest',body:''}); loadReviews(); showToast('✍️ 후기 저장 완료!')
  }

  const deleteReview = async (id: string) => {
    if (id.startsWith('d') && id.length <= 3) { setReviews(p=>p.filter(r=>r.id!==id)); return }
    await supabase.from('reviews').delete().eq('id',id); setReviews(p=>p.filter(r=>r.id!==id))
  }

  const list = filter==='all'?reviews:reviews.filter(r=>r.result===filter); const passCount = reviews.filter(r=>r.result==='pass').length
  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3"><div><div className="text-xl font-semibold">후기 메모</div><div className="text-[13px] text-[var(--tx3)] mt-0.5">지원 결과·회고·준비 노하우를 기록해요</div></div><button className="btn" onClick={()=>{setForm({...form,date:new Date().toISOString().split('T')[0]});setModalOpen(true)}}>+ 후기 작성</button></div>
      <div className="grid grid-cols-2 gap-4 mb-5"><div className="stat-card"><div className="stat-label">총 후기</div><div className="stat-val">{reviews.length}</div></div><div className="stat-card"><div className="stat-label">합격</div><div className="stat-val" style={{color:'var(--t)'}}>{passCount}</div></div></div>
      <div className="flex gap-1.5 mb-3.5 flex-wrap">{[{key:'all',label:'전체'},{key:'pass',label:'✅ 합격'},{key:'fail',label:'❌ 불합격'},{key:'pending',label:'⏳ 결과대기'},{key:'withdraw',label:'🔙 미지원'}].map(f=>(<div key={f.key} onClick={()=>setFilter(f.key)} className={`filter-chip ${filter===f.key?'active':''}`}>{f.label}</div>))}</div>
      {list.length===0?(<div className="empty"><div className="empty-ic">✍️</div><p>해당 결과의 후기가 없어요</p></div>):(list.map(r=>{const rm=RESULT_META[r.result]||RESULT_META.pending;const d=r.date?new Date(r.date):null;const ds=d?`${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}`:''
        return(<div key={r.id} className="rv-card"><div className="flex items-start gap-2.5 mb-2.5"><div className="w-9 h-9 rounded-[9px] bg-[var(--sur2)] flex items-center justify-center text-base flex-shrink-0">{CAT_ICON[r.category]||'📌'}</div><div className="flex-1"><div className="text-[13px] font-semibold">{r.title}</div><div className="text-[11px] text-[var(--tx3)] mt-0.5">{r.org||'기타'}</div></div><div className={`rv-result ${rm.cls}`}>{rm.label}</div></div>{r.body&&<div className="text-xs text-[var(--tx2)] leading-relaxed whitespace-pre-wrap">{r.body}</div>}<div className="flex items-center justify-between mt-2.5 text-[11px] text-[var(--tx3)]"><span>{ds}</span><ShareButton title={r.title} description={r.body||''} /><button onClick={()=>deleteReview(r.id)} className="bg-transparent border-none text-[var(--tx3)] cursor-pointer text-xs p-1 rounded hover:text-[var(--r)]">삭제</button></div></div>)
      }))}
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="✍️ 후기 작성" subtitle="지원 결과와 후기를 기록하세요">
        <div className="form-group"><label className="form-label">활동명</label><input className="form-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="예: 삼성 마케팅 공모전" autoFocus/></div>
        <div className="form-row"><div className="form-group" style={{flex:1}}><label className="form-label">주관</label><input className="form-input" value={form.org} onChange={e=>setForm({...form,org:e.target.value})} placeholder="주관 기관"/></div><div className="form-group" style={{flex:1}}><label className="form-label">날짜</label><input className="form-input" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div></div>
        <div className="form-row"><div className="form-group" style={{flex:1}}><label className="form-label">결과</label><select className="form-input" value={form.result} onChange={e=>setForm({...form,result:e.target.value})}><option value="pass">합격·수상</option><option value="fail">불합격</option><option value="pending">결과대기</option><option value="withdraw">미지원</option></select></div><div className="form-group" style={{flex:1}}><label className="form-label">카테고리</label><select className="form-input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="contest">공모전</option><option value="activity">대외활동</option><option value="cert">자격증</option><option value="intern">인턴</option></select></div></div>
        <div className="form-group"><label className="form-label">후기 내용</label><textarea className="form-input" rows={4} value={form.body} onChange={e=>setForm({...form,body:e.target.value})} placeholder="준비 과정, 느낀 점 등"/></div>
        <div className="modal-actions"><button className="btn-ghost" onClick={()=>setModalOpen(false)}>취소</button><button className="btn" onClick={addReview}>✓ 저장</button></div>
      </Modal>
    </div>
  )
}
