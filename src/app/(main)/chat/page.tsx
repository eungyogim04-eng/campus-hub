'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useToast } from '@/components/ui/Toast'

interface Message {
  id: string
  sender: string
  text: string
  time: string
  isMe: boolean
}

interface Chat {
  id: string
  type: 'group' | 'dm'
  name: string
  avatar: string
  members: string[]
  lastMessage: string
  lastTime: string
  unread: number
  messages: Message[]
}

const DEMO_CHATS: Chat[] = [
  {
    id: 'c1', type: 'group', name: '\uB9C8\uCF00\uD305 \uACF5\uBAA8\uC804 \uD300', avatar: '\uD83C\uDFE2',
    members: ['\uC774\uC11C\uC5F0', '\uD55C\uC2B9\uC6B0', '\uB098'],
    lastMessage: '\uB0B4\uC77C \uD68C\uC758 \uBA87\uC2DC\uC5D0 \uD560\uAE4C\uC694?', lastTime: '14:23', unread: 2,
    messages: [
      { id: 'msg1', sender: '\uC774\uC11C\uC5F0', text: '\uC0BC\uC131 \uB9C8\uCF00\uD305 \uACF5\uBAA8\uC804 \uC8FC\uC81C \uC815\uD588\uC5B4\uC694?', time: '13:50', isMe: false },
      { id: 'msg2', sender: '\uB098', text: '\uC800\uB294 ESG \uB9C8\uCF00\uD305 \uC8FC\uC81C\uAC00 \uC88B\uC744 \uAC83 \uAC19\uC544\uC694', time: '14:02', isMe: true },
      { id: 'msg3', sender: '\uD55C\uC2B9\uC6B0', text: '\uC88B\uC544\uC694! \uB370\uC774\uD130 \uBD84\uC11D\uC740 \uC81C\uAC00 \uB9E1\uC744\uAC8C\uC694', time: '14:15', isMe: false },
      { id: 'msg4', sender: '\uC774\uC11C\uC5F0', text: '\uB0B4\uC77C \uD68C\uC758 \uBA87\uC2DC\uC5D0 \uD560\uAE4C\uC694?', time: '14:23', isMe: false },
    ]
  },
  {
    id: 'c2', type: 'dm', name: '\uBC15\uC900\uD601', avatar: '\uD83D\uDC68\u200D\uD83D\uDCBB',
    members: ['\uBC15\uC900\uD601', '\uB098'],
    lastMessage: '\uC815\uCC98\uAE30 \uAE30\uCD9C\uBB38\uC81C \uACF5\uC720\uD560\uAC8C\uC694', lastTime: '\uC5B4\uC81C', unread: 0,
    messages: [
      { id: 'msg5', sender: '\uBC15\uC900\uD601', text: '\uC815\uCC98\uAE30 \uAC19\uC774 \uACF5\uBD80\uD558\uC2E4\uB798\uC694?', time: '\uC5B4\uC81C 10:30', isMe: false },
      { id: 'msg6', sender: '\uB098', text: '\uB124! \uC800\uB3C4 \uC774\uBC88\uC5D0 \uC900\uBE44\uD558\uB824\uACE0\uC694', time: '\uC5B4\uC81C 10:45', isMe: true },
      { id: 'msg7', sender: '\uBC15\uC900\uD601', text: '\uC815\uCC98\uAE30 \uAE30\uCD9C\uBB38\uC81C \uACF5\uC720\uD560\uAC8C\uC694', time: '\uC5B4\uC81C 11:00', isMe: false },
    ]
  },
  {
    id: 'c3', type: 'dm', name: '\uAE40\uD558\uC740', avatar: '\uD83D\uDC69\u200D\uD83D\uDCBB',
    members: ['\uAE40\uD558\uC740', '\uB098'],
    lastMessage: '\uBD80\uC2A4\uD2B8\uCEA0\uD504 \uCF54\uB529\uD14C\uC2A4\uD2B8 \uC900\uBE44 \uC5B4\uB5BB\uAC8C \uD558\uC138\uC694?', lastTime: '3\uC77C \uC804', unread: 1,
    messages: [
      { id: 'msg8', sender: '\uAE40\uD558\uC740', text: '\uBD80\uC2A4\uD2B8\uCEA0\uD504 \uCF54\uB529\uD14C\uC2A4\uD2B8 \uC900\uBE44 \uC5B4\uB5BB\uAC8C \uD558\uC138\uC694?', time: '3\uC77C \uC804', isMe: false },
    ]
  },
]

const LS_KEY = 'campus-hub-chats'

function loadChats(): Chat[] {
  if (typeof window === 'undefined') return DEMO_CHATS
  try {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return DEMO_CHATS
}

function saveChats(chats: Chat[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(chats))
  } catch {}
}

export default function ChatPage() {
  const { showToast } = useToast()
  const [chats, setChats] = useState<Chat[]>(() => loadChats())
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedChat = useMemo(() => chats.find(c => c.id === selectedChatId) || null, [chats, selectedChatId])

  const filteredChats = useMemo(() => {
    if (!search.trim()) return chats
    const q = search.toLowerCase()
    return chats.filter(c => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q))
  }, [chats, search])

  useEffect(() => {
    if (selectedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedChat?.messages.length, selectedChatId])

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId)
    setChats(prev => {
      const updated = prev.map(c => c.id === chatId ? { ...c, unread: 0 } : c)
      saveChats(updated)
      return updated
    })
  }

  const handleSend = () => {
    if (!input.trim() || !selectedChatId) return
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: '\uB098',
      text: input.trim(),
      time: timeStr,
      isMe: true,
    }
    setChats(prev => {
      const updated = prev.map(c => {
        if (c.id !== selectedChatId) return c
        return { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, lastTime: timeStr }
      })
      saveChats(updated)
      return updated
    })
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = () => {
    showToast('\uC0C8 \uCC44\uD305 \uAE30\uB2A5\uC740 \uB370\uBAA8 \uBC84\uC804\uC5D0\uC11C \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4')
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
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{'\uCC44\uD305'}</h1>
        <button
          onClick={handleNewChat}
          style={{
            background: '#E8913A', color: '#fff', border: 'none', borderRadius: 8,
            padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          {'\uC0C8 \uCC44\uD305'}
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 16px' }}>
        <input
          type="text"
          placeholder={'\uCC44\uD305 \uAC80\uC0C9...'}
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
        {filteredChats.map(chat => (
          <div
            key={chat.id}
            onClick={() => handleSelectChat(chat.id)}
            style={{
              padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
              background: selectedChatId === chat.id ? '#FFF3E6' : 'transparent',
              transition: 'background .12s',
            }}
            onMouseEnter={e => { if (selectedChatId !== chat.id) (e.currentTarget.style.background = 'var(--sur2)') }}
            onMouseLeave={e => { if (selectedChatId !== chat.id) (e.currentTarget.style.background = 'transparent') }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: 'var(--sur2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
            }}>
              {chat.avatar}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {chat.name}
                  {chat.type === 'group' && (
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--tx3)', marginLeft: 4 }}>
                      {chat.members.length}
                    </span>
                  )}
                </span>
                <span style={{ fontSize: 11, color: 'var(--tx3)', flexShrink: 0 }}>{chat.lastTime}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2 }}>
                <span style={{
                  fontSize: 12, color: 'var(--tx3)', whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {chat.lastMessage}
                </span>
                {chat.unread > 0 && (
                  <span style={{
                    background: '#E8913A', color: '#fff', fontSize: 10, fontWeight: 700,
                    minWidth: 18, height: 18, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 5px', flexShrink: 0,
                  }}>
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  /* ---- Chat Detail Panel ---- */
  const chatDetailPanel = selectedChat ? (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      {/* Detail Header */}
      <div style={{
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid var(--bor)', background: 'var(--sur)',
      }}>
        {/* Mobile back button */}
        <button
          onClick={() => setSelectedChatId(null)}
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
          {selectedChat.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{selectedChat.name}</div>
          {selectedChat.type === 'group' && (
            <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
              {'\uBA64\uBC84 '}{selectedChat.members.length}{'\uBA85'}
            </div>
          )}
        </div>
        <button
          style={{
            background: 'none', border: 'none', fontSize: 18, cursor: 'pointer',
            color: 'var(--tx3)', padding: '4px 8px',
          }}
          onClick={() => showToast('\uBA54\uB274 \uAE30\uB2A5\uC740 \uC900\uBE44 \uC911\uC785\uB2C8\uB2E4')}
        >
          {'\u22EE'}
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {selectedChat.messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: msg.isMe ? 'flex-end' : 'flex-start',
            }}
          >
            {!msg.isMe && selectedChat.type === 'group' && (
              <span style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 2, marginLeft: 4 }}>
                {msg.sender}
              </span>
            )}
            <div style={{
              maxWidth: '70%',
              padding: '10px 14px',
              borderRadius: msg.isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.isMe ? '#E8913A' : 'var(--sur2)',
              color: msg.isMe ? '#fff' : 'var(--tx)',
              fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word',
            }}>
              {msg.text}
            </div>
            <span style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2, padding: '0 4px' }}>
              {msg.time}
            </span>
          </div>
        ))}
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
          placeholder={'\uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD558\uC138\uC694...'}
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
            background: '#E8913A', color: '#fff', border: 'none',
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
      {'\uCC44\uD305\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694'}
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
        <div className={`chat-list-panel${selectedChatId ? ' chat-hidden-mobile' : ''}`}>
          {chatListPanel}
        </div>
        <div
          className={`chat-detail-panel${!selectedChatId ? ' chat-hidden-mobile' : ''}`}
          style={{ flex: 1, display: 'flex' }}
        >
          {chatDetailPanel}
        </div>
      </div>
    </>
  )
}
