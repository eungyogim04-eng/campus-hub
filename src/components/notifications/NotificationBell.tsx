'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { Notification } from '@/types'
export default function NotificationBell() {
  const supabase = createClient(); const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([]); const [open, setOpen] = useState(false); const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { if(!user)return; loadNotifications(); const channel=supabase.channel('notifications').on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:`user_id=eq.${user.id}`},(payload)=>{setNotifications(prev=>[payload.new as Notification,...prev])}).subscribe(); return()=>{supabase.removeChannel(channel)} }, [user])
  useEffect(() => { const h=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))setOpen(false)}; document.addEventListener('click',h); return()=>document.removeEventListener('click',h) }, [])
  const loadNotifications = async () => { const{data}=await supabase.from('notifications').select('*').order('created_at',{ascending:false}).limit(20); if(data)setNotifications(data) }
  const markAllRead = async () => { const unread=notifications.filter(n=>!n.read).map(n=>n.id); if(!unread.length)return; await supabase.from('notifications').update({read:true}).in('id',unread); setNotifications(p=>p.map(n=>({...n,read:true}))) }
  const unreadCount = notifications.filter(n=>!n.read).length
  return (
    <div ref={ref} className="relative">
      <button onClick={()=>{setOpen(!open);if(!open)markAllRead()}} className="w-[34px] h-[34px] bg-[var(--sur)] border border-[var(--bor)] rounded-lg flex items-center justify-center cursor-pointer text-[15px] relative">🔔{unreadCount>0&&(<div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[var(--cm)] rounded-full text-[9px] text-white flex items-center justify-center font-semibold">{unreadCount}</div>)}</button>
      {open&&(<div className="absolute right-0 top-10 w-[320px] bg-[var(--sur)] border border-[var(--bor2)] rounded-xl shadow-lg z-50 max-h-[400px] overflow-y-auto"><div className="p-3 border-b border-[var(--bor)] flex items-center justify-between"><span className="text-sm font-semibold">알림</span><button onClick={markAllRead} className="text-[11px] text-[var(--p)] bg-transparent border-none cursor-pointer">모두 읽음</button></div>{notifications.length===0?(<div className="p-6 text-center text-xs text-[var(--tx3)]">알림이 없습니다</div>):(notifications.map(n=>(<div key={n.id} className={`px-3 py-2.5 border-b border-[var(--bor)] last:border-b-0 ${!n.read?'bg-[var(--pl)]':''}`}><div className="text-xs">{n.message}</div><div className="text-[10px] text-[var(--tx3)] mt-1">{new Date(n.created_at).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'numeric',minute:'2-digit'})}</div></div>)))}</div>)}
    </div>
  )
}
