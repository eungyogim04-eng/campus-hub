'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useToast } from '@/components/ui/Toast'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

/* ---------- Types ---------- */
interface Profile {
  id: string
  name: string
  dept: string
}

interface ChatMessage {
  id: string
  room_id: string
  user_id: string
  text: string
  created_at: string
}

interface ChatRoom {
  id: string
  name: string
  type: 'dm' | 'group'
  created_at: string
  /* derived */
  members: Profile[]
  lastMessage: string
  lastTime: string
  lastMessageUserId: string | null
}

/* ---------- Helpers ---------- */
function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 86_400_000 && d.getDate() === now.getDate()) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  if (diff < 86_400_000 * 2) return '어제'
  if (diff < 86_400_000 * 7) return `${Math.floor(diff / 86_400_000)}일 전`
  return `${d.getMonth() + 1}/${d.getDate()}`
}

/* ---------- Component ---------- */
export default function ChatPage() {
  const { showToast } = useToast()
  const supabase = useMemo(() => createClient(), [])

  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  const selectedRoom = useMemo(() => rooms.find(r => r.id === selectedRoomId) ?? null, [rooms, selectedRoomId])

  /* ---- Auth ---- */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setLoading(false)
    })
  }, [supabase])

  /* ---- Fetch rooms ---- */
  const fetchRooms = useCallback(async () => {
    if (!userId) return

    // rooms the user belongs to
    const { data: memberRows } = await supabase
      .from('chat_members')
      .select('room_id')
      .eq('user_id', userId)

    if (!memberRows || memberRows.length === 0) { setRooms([]); return }

    const roomIds = memberRows.map(r => r.room_id)

    const { data: roomRows } = await supabase
      .from('chat_rooms')
      .select('*')
      .in('id', roomIds)

    if (!roomRows) { setRooms([]); return }

    // all members for these rooms
    const { data: allMembers } = await supabase
      .from('chat_members')
      .select('room_id, user_id')
      .in('room_id', roomIds)

    const memberUserIds = [...new Set((allMembers ?? []).map(m => m.user_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, dept')
      .in('id', memberUserIds)

    const profileMap: Record<string, Profile> = {}
    ;(profiles ?? []).forEach(p => { profileMap[p.id] = p })

    // latest message per room
    const { data: latestMsgs } = await supabase
      .from('chat_messages')
      .select('*')
      .in('room_id', roomIds)
      .order('created_at', { ascending: false })

    const latestByRoom: Record<string, ChatMessage> = {}
    ;(latestMsgs ?? []).forEach(m => {
      if (!latestByRoom[m.room_id]) latestByRoom[m.room_id] = m
    })

    const built: ChatRoom[] = roomRows.map(room => {
      const roomMembers = (allMembers ?? [])
        .filter(m => m.room_id === room.id)
        .map(m => profileMap[m.user_id])
        .filter(Boolean)

      const latest = latestByRoom[room.id]

      // For DMs, show the other person's name
      let displayName = room.name
      if (room.type === 'dm') {
        const other = roomMembers.find(m => m.id !== userId)
        if (other) displayName = other.name
      }

      return {
        id: room.id,
        name: displayName,
        type: room.type,
        created_at: room.created_at,
        members: roomMembers,
        lastMessage: latest?.text ?? '',
        lastTime: latest ? formatTime(latest.created_at) : '',
        lastMessageUserId: latest?.user_id ?? null,
      }
    })

    // sort by latest message time descending
    built.sort((a, b) => {
      const la = latestByRoom[a.id]?.created_at ?? a.created_at
      const lb = latestByRoom[b.id]?.created_at ?? b.created_at
      return new Date(lb).getTime() - new Date(la).getTime()
    })

    setRooms(built)
  }, [userId, supabase])

  useEffect(() => { fetchRooms() }, [fetchRooms])

  /* ---- Real-time: refresh room list on any new message ---- */
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('chat-rooms-refresh')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        () => { fetchRooms() }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase, fetchRooms])

  /* ---- Real-time: append messages in the selected room ---- */
  useEffect(() => {
    if (!userId || !selectedRoomId) return

    const channel = supabase
      .channel(`room-${selectedRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${selectedRoomId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, selectedRoomId, supabase])

  /* ---- Fetch messages for selected room ---- */
  useEffect(() => {
    if (!selectedRoomId) { setMessages([]); return }

    const load = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', selectedRoomId)
        .order('created_at', { ascending: true })

      setMessages(data ?? [])
    }
    load()
  }, [selectedRoomId, supabase])

  /* ---- Auto-scroll ---- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, selectedRoomId])

  /* ---- Profiles cache for message display ---- */
  const [profileMap, setProfileMap] = useState<Record<string, Profile>>({})

  useEffect(() => {
    // build map from room members
    const map: Record<string, Profile> = {}
    rooms.forEach(r => r.members.forEach(m => { map[m.id] = m }))
    setProfileMap(map)
  }, [rooms])

  /* ---- Filtered rooms ---- */
  const filteredRooms = useMemo(() => {
    if (!search.trim()) return rooms
    const q = search.toLowerCase()
    return rooms.filter(r => r.name.toLowerCase().includes(q) || r.lastMessage.toLowerCase().includes(q))
  }, [rooms, search])

  /* ---- Handlers ---- */
  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId)
  }

  const handleSend = async () => {
    if (!input.trim() || !selectedRoomId || !userId) return
    const text = input.trim()
    setInput('')

    const { error } = await supabase
      .from('chat_messages')
      .insert({ room_id: selectedRoomId, user_id: userId, text })

    if (error) {
      showToast('메시지 전송에 실패했습니다')
      setInput(text)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = () => {
    showToast('스터디 메이트에서 채팅을 시작할 수 있습니다')
  }

  /* ---- Not logged in / loading ---- */
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 60px)', color: 'var(--tx3)', fontSize: 14 }}>
        로딩 중...
      </div>
    )
  }

  if (!userId) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 60px)', color: 'var(--tx3)', fontSize: 14 }}>
        로그인하면 채팅을 이용할 수 있어요
      </div>
    )
  }

  /* ---- Chat List Panel ---- */
  const chatListPanel = (
    <div style={{
      width: 320, minWidth: 320, borderRight: '1px solid var(--bor)',
      display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--sur)',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--bor)',
      }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>채팅</h1>
        <button
          onClick={handleNewChat}
          style={{
            background: '#FB8C00', color: '#fff', border: 'none', borderRadius: 8,
            padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          새 채팅
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 16px' }}>
        <input
          type="text"
          placeholder="채팅 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '8px 12px', borderRadius: 8,
            border: '1px solid var(--bor)', background: 'var(--sur2)',
            fontSize: 13, outline: 'none', color: 'var(--tx)',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Chat Items */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredRooms.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>
            채팅방이 없습니다
          </div>
        )}
        {filteredRooms.map(room => {
          const isUnread = room.lastMessageUserId !== null && room.lastMessageUserId !== userId
          return (
            <div
              key={room.id}
              onClick={() => handleSelectRoom(room.id)}
              style={{
                padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                background: selectedRoomId === room.id ? '#FFF3E0' : 'transparent',
                transition: 'background .12s',
              }}
              onMouseEnter={e => { if (selectedRoomId !== room.id) e.currentTarget.style.background = 'var(--sur2)' }}
              onMouseLeave={e => { if (selectedRoomId !== room.id) e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '50%', background: 'var(--sur2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
              }}>
                {room.type === 'group' ? '\uD83D\uDC65' : '\uD83D\uDC64'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{
                    fontSize: 14, fontWeight: isUnread && selectedRoomId !== room.id ? 700 : 600,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {room.name}
                    {room.type === 'group' && (
                      <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--tx3)', marginLeft: 4 }}>
                        {room.members.length}
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--tx3)', flexShrink: 0 }}>{room.lastTime}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2 }}>
                  <span style={{
                    fontSize: 12, color: 'var(--tx3)', whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    fontWeight: isUnread && selectedRoomId !== room.id ? 600 : 400,
                  }}>
                    {room.lastMessage}
                  </span>
                  {isUnread && selectedRoomId !== room.id && (
                    <span style={{
                      background: '#FB8C00', width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    }} />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  /* ---- Chat Detail Panel ---- */
  const chatDetailPanel = selectedRoom ? (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      {/* Detail Header */}
      <div style={{
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid var(--bor)', background: 'var(--sur)',
      }}>
        <button
          onClick={() => setSelectedRoomId(null)}
          className="chat-back-btn"
          style={{
            display: 'none', background: 'none', border: 'none', fontSize: 18,
            cursor: 'pointer', padding: '4px 8px', color: 'var(--tx)',
          }}
        >
          {'\u2190'}
        </button>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: 'var(--sur2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
        }}>
          {selectedRoom.type === 'group' ? '\uD83D\uDC65' : '\uD83D\uDC64'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{selectedRoom.name}</div>
          {selectedRoom.type === 'group' && (
            <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
              멤버 {selectedRoom.members.length}명
            </div>
          )}
        </div>
        <button
          style={{
            background: 'none', border: 'none', fontSize: 18, cursor: 'pointer',
            color: 'var(--tx3)', padding: '4px 8px',
          }}
          onClick={() => showToast('메뉴 기능은 준비 중입니다')}
        >
          {'\u22EE'}
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map(msg => {
          const isMe = msg.user_id === userId
          const sender = profileMap[msg.user_id]
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start',
              }}
            >
              {!isMe && selectedRoom.type === 'group' && (
                <span style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 2, marginLeft: 4 }}>
                  {sender?.name ?? '알 수 없음'}
                </span>
              )}
              <div style={{
                maxWidth: '70%',
                padding: '10px 14px',
                borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: isMe ? '#FB8C00' : 'var(--sur2)',
                color: isMe ? '#fff' : 'var(--tx)',
                fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word',
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2, padding: '0 4px' }}>
                {formatTime(msg.created_at)}
              </span>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div style={{
        position: 'sticky', bottom: 0, background: 'var(--sur)',
        borderTop: '1px solid var(--bor)', padding: 12,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 20,
            border: '1px solid var(--bor)', background: 'var(--sur2)',
            fontSize: 14, outline: 'none', color: 'var(--tx)',
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: '#FB8C00', color: '#fff', border: 'none',
            borderRadius: '50%', width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 16, flexShrink: 0,
          }}
        >
          {'\u279C'}
        </button>
      </div>
    </div>
  ) : (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--tx3)', fontSize: 14, background: 'var(--bg)',
    }}>
      채팅을 선택해주세요
    </div>
  )

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .chat-list-panel {
            width: 100% !important;
            min-width: 100% !important;
            border-right: none !important;
          }
          .chat-detail-panel {
            width: 100% !important;
          }
          .chat-back-btn {
            display: inline-flex !important;
          }
          .chat-list-panel.chat-hidden-mobile {
            display: none !important;
          }
          .chat-detail-panel.chat-hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
        <div className={`chat-list-panel${selectedRoomId ? ' chat-hidden-mobile' : ''}`}>
          {chatListPanel}
        </div>
        <div
          className={`chat-detail-panel${!selectedRoomId ? ' chat-hidden-mobile' : ''}`}
          style={{ flex: 1, display: 'flex' }}
        >
          {chatDetailPanel}
        </div>
      </div>
    </>
  )
}
