'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { ROADMAP_DATA } from '@/lib/data/roadmap'
import ShareButton from '@/components/ui/ShareButton'

export default function RoadmapPage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [year, setYear] = useState(1)
  const [done, setDone] = useState<Record<string, boolean>>({})
  useEffect(() => { const load = async () => { const { data } = await supabase.from('roadmap_progress').select('*'); if (data) { const m: Record<string,boolean> = {}; data.forEach((d: { item_id: string; completed: boolean }) => m[d.item_id] = d.completed); setDone(m) } }; load() }, [])
  const toggleItem = async (id: string) => { const nv = !done[id]; setDone(p => ({...p,[id]:nv})); if(nv) await supabase.from('roadmap_progress').upsert({item_id:id,completed:true}); else await supabase.from('roadmap_progress').delete().eq('item_id',id) }
  const data = ROADMAP_DATA[year] || []; const all = data.flatMap(s=>s.items); const dc = all.filter(i=>done[i.id]).length; const tot = all.length
  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3"><div><div className="text-xl font-semibold">스펙 로드맵</div><div className="text-[13px] text-[var(--tx3)] mt-0.5">학년별 추천 스펙 타임라인</div></div><ShareButton title="스펙잇 - 스펙 로드맵" description="학년별 추천 스펙을 확인하세요!" /></div>
        <div className="flex items-center gap-1.5"><span className="text-xs text-[var(--tx3)]">학년</span><div className="flex border border-[var(--bor2)] rounded-lg overflow-hidden">{[1,2,3,4].map(y=>(<div key={y} className={`grade-tab ${year===y?'active':''}`} onClick={()=>setYear(y)}>{y}학년</div>))}</div></div>
      </div>
      <div className="card mb-5" style={{padding:'16px 18px'}}><div className="flex items-center justify-between mb-2.5"><div className="text-[13px] font-semibold">{year}학년 로드맵 · <span className="text-[var(--p)]">{profile?.department||'경영·경제'}</span></div><div className="text-xs text-[var(--tx3)]">{dc}/{tot} 완료</div></div><div className="progress-wrap"><div className="progress-bar" style={{width:`${tot?Math.round(dc/tot*100):0}%`}}/></div></div>
      {data.map(section=>(<div key={section.q} className="roadmap-section"><div className="roadmap-quarter">{section.q}</div><div className="roadmap-items">{section.items.map(item=>(<div key={item.id} className={`roadmap-item ${done[item.id]?'done':''}`}><div className="text-xl flex-shrink-0 mt-0.5">{item.icon}</div><div className="flex-1"><div className="text-[13px] font-semibold">{item.title}</div><div className="text-[11px] text-[var(--tx3)] mt-0.5 leading-relaxed">{item.desc}</div></div><div className={`roadmap-check ${done[item.id]?'done':''}`} onClick={()=>toggleItem(item.id)}>{done[item.id]?'✓':''}</div></div>))}</div></div>))}
    </div>
  )
}
