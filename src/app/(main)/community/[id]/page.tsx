'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'
import { Post, Comment } from '@/types'

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
    <span className="relative" style={{ position: 'relative' }}>
      {reported ? (
        <span style={{ fontSize: 12, color: 'var(--tx3)', cursor: 'default' }}>신고됨</span>
      ) : (
        <span
          onClick={() => setOpen(!open)}
          style={{ fontSize: 12, color: 'var(--tx3)', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--r)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--tx3)')}
        >🚨</span>
      )}
      {open && (
        <span
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

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = createClient()
  const { user } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [liked, setLiked] = useState(false)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    loadPost()
    loadComments()
    checkLiked()
  }, [id])

  const loadPost = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(name, department, avatar_url)')
      .eq('id', id)
      .single()
    if (data) setPost(data)
  }

  const loadComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(name, avatar_url)')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
    if (data) setComments(data)
  }

  const checkLiked = async () => {
    if (!user) return
    const { data } = await supabase.from('likes').select('*').eq('post_id', id).eq('user_id', user.id).single()
    setLiked(!!data)
  }

  const toggleLike = async () => {
    if (!user) return
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', id).eq('user_id', user.id)
      setLiked(false)
      if (post) setPost({ ...post, like_count: post.like_count - 1 })
    } else {
      await supabase.from('likes').insert({ post_id: id })
      setLiked(true)
      if (post) setPost({ ...post, like_count: post.like_count + 1 })
    }
  }

  const addComment = async () => {
    if (!commentText.trim()) return
    await supabase.from('comments').insert({ post_id: id, body: commentText.trim() })
    setCommentText('')
    loadComments()
    loadPost()
    showToast('💬 댓글이 등록되었습니다!')
  }

  const deleteComment = async (commentId: string) => {
    await supabase.from('comments').delete().eq('id', commentId)
    loadComments()
    loadPost()
  }

  const deletePost = async () => {
    if (!confirm('게시글을 삭제할까요?')) return
    await supabase.from('posts').delete().eq('id', id)
    router.push('/community')
    showToast('🗑️ 게시글이 삭제되었습니다')
  }

  if (!post) return <div className="text-center py-20 text-[var(--tx3)]">로딩 중...</div>

  const cat = CATEGORIES[post.category] || CATEGORIES.free
  const d = new Date(post.created_at)
  const timeStr = `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`

  return (
    <div className="max-w-2xl">
      <button onClick={() => router.push('/community')} className="btn-ghost btn-sm mb-4">← 목록으로</button>

      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={`badge ${post.category === 'team_recruit' ? 'badge-purple' : post.category === 'review_share' ? 'badge-teal' : 'badge-blue'}`}>
            {cat.icon} {cat.label}
          </span>
          {post.tags?.map(tag => (
            <span key={tag} className="text-[10px] text-[var(--tx3)] bg-[var(--sur2)] px-2 py-0.5 rounded-full">#{tag}</span>
          ))}
        </div>
        <h1 className="text-lg font-semibold mb-2">{post.title}</h1>
        <div className="flex items-center gap-3 text-[11px] text-[var(--tx3)] mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-[var(--pl)] rounded-full flex items-center justify-center text-[9px] font-semibold text-[var(--p)]">
              {post.profiles?.name?.[0] || '?'}
            </div>
            <span className="font-medium text-[var(--tx2)]">{post.profiles?.name || '익명'}</span>
          </div>
          <span>{post.profiles?.department}</span>
          <span>{timeStr}</span>
        </div>
        <div className="text-sm text-[var(--tx2)] leading-relaxed whitespace-pre-wrap mb-4">{post.body}</div>
        <div className="flex items-center gap-3 pt-3 border-t border-[var(--bor)]">
          <button onClick={toggleLike} className={`btn-ghost btn-sm flex items-center gap-1 ${liked ? 'text-[var(--r)] border-[var(--rl)]' : ''}`}>
            {liked ? '❤️' : '🤍'} {post.like_count}
          </button>
          <span className="text-[11px] text-[var(--tx3)]">💬 {post.comment_count}</span>
          <ReportButton targetId={post.id} targetType="post" />
          {user?.id === post.user_id && (
            <button onClick={deletePost} className="ml-auto btn-ghost btn-sm text-[var(--tx3)] hover:text-[var(--r)]">삭제</button>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="card">
        <div className="card-title">댓글 {comments.length}</div>

        {/* Comment Form */}
        <div className="flex gap-2 mb-4">
          <input
            className="form-input flex-1"
            placeholder="댓글을 입력하세요"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addComment()}
          />
          <button className="btn btn-sm" onClick={addComment}>등록</button>
        </div>

        {comments.length === 0 ? (
          <div className="text-center py-6 text-[var(--tx3)] text-xs">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</div>
        ) : (
          comments.map(c => {
            const cd = new Date(c.created_at)
            const cTime = `${cd.getMonth() + 1}/${cd.getDate()} ${cd.getHours()}:${String(cd.getMinutes()).padStart(2, '0')}`
            return (
              <div key={c.id} className="flex gap-2.5 py-3 border-b border-[var(--bor)] last:border-b-0">
                <div className="w-7 h-7 bg-[var(--pl)] rounded-full flex items-center justify-center text-[10px] font-semibold text-[var(--p)] flex-shrink-0 mt-0.5">
                  {c.profiles?.name?.[0] || '?'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{c.profiles?.name || '익명'}</span>
                    <span className="text-[10px] text-[var(--tx3)]">{cTime}</span>
                    {user?.id === c.user_id && (
                      <button onClick={() => deleteComment(c.id)} className="text-[10px] text-[var(--tx3)] hover:text-[var(--r)] bg-transparent border-none cursor-pointer">삭제</button>
                    )}
                    <span className="ml-auto"><ReportButton targetId={c.id} targetType="comment" /></span>
                  </div>
                  <div className="text-[13px] text-[var(--tx2)] leading-relaxed">{c.body}</div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
