'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'
import Link from 'next/link'
import ShareButton from '@/components/ui/ShareButton'
import { Post } from '@/types'

const CATEGORIES: Record<string, { label: string; icon: string }> = {
  team_recruit: { label: '팀원 모집', icon: '👥' },
  review_share: { label: '후기 공유', icon: '📝' },
  free: { label: '자유게시판', icon: '💬' },
}

const REPORT_REASONS = ['스팸/광고', '불쾌한 내용', '허위 정보', '기타']

function ReportButton({ targetId, targetType = 'post' }: { targetId: string; targetType?: string }) {
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)
  const [reported, setReported] = useState(false)

  useEffect(() => {
    const reports = JSON.parse(localStorage.getItem('campus-hub-reports') || '[]')
    if (reports.some((r: any) => r.targetId === targetId && r.targetType === targetType)) {
      setReported(true)
    }
  }, [targetId, targetType])

  const submitReport = (reason: string) => {
    const reports = JSON.parse(localStorage.getItem('campus-hub-reports') || '[]')
    reports.push({ targetId, targetType, reason, createdAt: new Date().toISOString() })
    localStorage.setItem('campus-hub-reports', JSON.stringify(reports))
    setReported(true)
    setOpen(false)
    showToast('신고가 접수되었습니다. 검토 후 조치하겠습니다.')
  }

  return (
    <span className="relative" onClick={e => e.preventDefault()}>
      {reported ? (
        <span style={{ fontSize: 12, color: 'var(--tx3)', cursor: 'default' }}>신고됨</span>
      ) : (
        <span
          onClick={e => { e.stopPropagation(); setOpen(!open) }}
          style={{ fontSize: 12, color: 'var(--tx3)', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--r)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--tx3)')}
        >🚨</span>
      )}
      {open && (
        <span
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', bottom: '100%', right: 0, marginBottom: 4,
            background: 'var(--sur)', border: '1px solid var(--bor)', borderRadius: 8,
            padding: '6px 0', zIndex: 50, minWidth: 130, boxShadow: '0 4px 12px rgba(0,0,0,.12)'
          }}
        >
          {REPORT_REASONS.map(reason => (
            <span
              key={reason}
              onClick={() => submitReport(reason)}
              style={{
                display: 'block', padding: '6px 14px', fontSize: 12, color: 'var(--tx2)',
                cursor: 'pointer', whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--sur2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >{reason}</span>
          ))}
        </span>
      )}
    </span>
  )
}

export default function CommunityPage() {
  const supabase = createClient()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', category: 'free', tags: '' })

  useEffect(() => { loadPosts() }, [filter])

  const loadPosts = async () => {
    let query = supabase
      .from('posts')
      .select('*, profiles(name, department, avatar_url)')
      .order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('category', filter)
    const { data } = await query
    setPosts(data || [])
  }

  const createPost = async () => {
    if (!form.title.trim() || !form.body.trim()) { showToast('⚠️ 제목과 내용을 입력해주세요'); return }
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    const insertData: any = {
      title: form.title.trim(), body: form.body.trim(),
      category: form.category, tags,
    }
    if (user) insertData.user_id = user.id
    await supabase.from('posts').insert(insertData)
    setModalOpen(false)
    setForm({ title: '', body: '', category: 'free', tags: '' })
    loadPosts()
    showToast('📝 게시글이 등록되었습니다!')
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-xl font-semibold">커뮤니티</div>
          <div className="text-[13px] text-[var(--tx3)] mt-0.5">공모전 팀원 모집, 후기 공유, 자유게시판</div>
        </div>
        <button className="btn" onClick={() => setModalOpen(true)}>+ 글쓰기</button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        <div onClick={() => setFilter('all')} className={`type-tab ${filter === 'all' ? 'active' : ''}`}>전체</div>
        {Object.entries(CATEGORIES).map(([key, val]) => (
          <div key={key} onClick={() => setFilter(key)} className={`type-tab ${filter === key ? 'active' : ''}`}>{val.icon} {val.label}</div>
        ))}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="empty"><div className="empty-ic">💬</div><p>아직 게시글이 없습니다. 첫 글을 작성해보세요!</p></div>
      ) : (
        posts.map(post => {
          const cat = CATEGORIES[post.category] || CATEGORIES.free
          const d = new Date(post.created_at)
          const timeStr = `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
          return (
            <Link href={`/community/${post.id}`} key={post.id} className="post-card block">
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge ${post.category === 'team_recruit' ? 'badge-purple' : post.category === 'review_share' ? 'badge-teal' : 'badge-blue'}`}>
                  {cat.icon} {cat.label}
                </span>
                {post.tags?.map(tag => (
                  <span key={tag} className="text-[10px] text-[var(--tx3)] bg-[var(--sur2)] px-2 py-0.5 rounded-full">#{tag}</span>
                ))}
              </div>
              <div className="text-[14px] font-semibold mb-1">{post.title}</div>
              <div className="text-xs text-[var(--tx2)] line-clamp-2 leading-relaxed mb-3">{post.body}</div>
              <div className="flex items-center justify-between text-[11px] text-[var(--tx3)]">
                <div className="flex items-center gap-3">
                  <span>{post.profiles?.name || '익명'}</span>
                  <span>{timeStr}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>❤️ {post.like_count}</span>
                  <span>💬 {post.comment_count}</span>
                  <ShareButton title={post.title} description={post.body?.slice(0,50)||''} />
                  <ReportButton targetId={post.id} targetType="post" />
                </div>
              </div>
            </Link>
          )
        })
      )}

      {/* Create Post Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="📝 글쓰기" subtitle="커뮤니티에 글을 작성해보세요" width="480px">
        <div className="form-group"><label className="form-label">카테고리</label>
          <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {Object.entries(CATEGORIES).map(([key, val]) => <option key={key} value={key}>{val.icon} {val.label}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-label">제목</label><input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="제목을 입력하세요" autoFocus /></div>
        <div className="form-group"><label className="form-label">내용</label><textarea className="form-input" rows={6} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="내용을 입력하세요" /></div>
        <div className="form-group"><label className="form-label">태그 (쉼표로 구분)</label><input className="form-input" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="마케팅, 공모전, 팀원모집" /></div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={() => setModalOpen(false)}>취소</button>
          <button className="btn" onClick={createPost}>✓ 등록</button>
        </div>
      </Modal>
    </div>
  )
}
