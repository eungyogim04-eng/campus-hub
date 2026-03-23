'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SavedSchedule, TYPE_LABELS } from '@/types'
function daysLeft(ds:string|null):number|null{if(!ds)return null;const t=new Date(ds);if(isNaN(t.getTime()))return null;const n=new Date();n.setHours(0,0,0,0);return Math.floor((t.getTime()-n.getTime())/86400000)}

const DEMO_SPECS = [
  { id: 'ds1', item_data: { title: '삼성 마케팅 공모전', org: '삼성전자', type: 'contest', icon: '🏢' }, date: '2026-04-15', created_at: '' },
  { id: 'ds2', item_data: { title: '정보처리기사 필기', org: '한국산업인력공단', type: 'cert', icon: '📋' }, date: '2026-05-09', created_at: '' },
  { id: 'ds3', item_data: { title: '네이버 부스트캠프', org: '네이버 커넥트재단', type: 'activity', icon: '💚' }, date: '2026-05-15', created_at: '' },
  { id: 'ds4', item_data: { title: 'CJ 마케팅 챌린지', org: 'CJ그룹', type: 'contest', icon: '🎯' }, date: '2026-06-01', created_at: '' },
  { id: 'ds5', item_data: { title: 'SQLD 자격증', org: '한국데이터산업진흥원', type: 'cert', icon: '🗄️' }, date: '2026-06-20', created_at: '' },
  { id: 'ds6', item_data: { title: 'KOTRA 인턴십', org: 'KOTRA', type: 'activity', icon: '🌍' }, date: '2026-07-01', created_at: '' },
]

export default function SpecPage() {
  const supabase = createClient()
  const [schedules, setSchedules] = useState<SavedSchedule[]>([])
  useEffect(() => { const load = async () => { const{data}=await supabase.from('schedules').select('*').order('date',{ascending:true}); if(data) setSchedules(data); if (!data || data.length === 0) setSchedules(DEMO_SPECS as any) }; load() }, [])
  const upcoming = schedules.filter(s=>{const d=daysLeft(s.date);return d!==null&&d>=0})
  const thisMonth = upcoming.filter(s=>{const d=daysLeft(s.date);return d!==null&&d<=30})
  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3"><div><div className="text-xl font-semibold">스펙 관리</div><div className="text-[13px] text-[var(--tx3)] mt-0.5">진행 중인 공모전·자격증 현황</div></div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="stat-card"><div className="stat-label">진행중</div><div className="stat-val">{upcoming.length}</div></div>
        <div className="stat-card"><div className="stat-label">전체 저장</div><div className="stat-val">{schedules.length}</div></div>
        <div className="stat-card"><div className="stat-label">이번달 마감</div><div className="stat-val" style={{color:'var(--c)'}}>{thisMonth.length}</div></div>
        <div className="stat-card"><div className="stat-label">목표달성률</div><div className="stat-val">{schedules.length>0?Math.round((schedules.length-upcoming.length)/schedules.length*100):0}%</div></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {upcoming.length===0?(<div className="empty" style={{gridColumn:'1/-1'}}><div className="empty-ic">🏆</div><p>탐색 페이지에서 스펙을 추가해보세요</p></div>):(
          upcoming.map(s=>{const d=daysLeft(s.date);const pct=d!==null?Math.max(0,Math.min(100,100-(d/60*100))):0;const typeBg:Record<string,string>={contest:'var(--cl)',cert:'var(--pl)',activity:'var(--tl)'}
            return(<div key={s.id} className="spec-card"><div className="flex items-center gap-2.5 mb-2.5"><div className="w-9 h-9 rounded-[9px] flex items-center justify-center text-base" style={{background:typeBg[s.item_data?.type]||'var(--sur2)'}}>{s.item_data?.icon}</div><div className="flex-1"><div className="text-[13px] font-medium">{s.item_data?.title}</div><div className="text-[11px] text-[var(--tx3)]">{s.item_data?.org}</div></div><span className={`badge ${d!==null&&d<=7?'badge-coral':d!==null&&d<=30?'badge-amber':'badge-purple'}`} style={{marginLeft:'auto'}}>{d===0?'오늘':d!==null?`D-${d}`:'—'}</span></div><div className="text-[11px] text-[var(--tx3)] mb-1">진행률 {Math.round(pct)}%</div><div className="progress-wrap"><div className="progress-bar" style={{width:`${pct}%`}}/></div></div>)
          })
        )}
      </div>
    </div>
  )
}
