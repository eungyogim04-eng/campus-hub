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

export default function CommunityPage() {
  const supabase = createClient()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', category: 'free', tags: '' })

  const DEMO_POSTS = [
    { id: 'd1', user_id: 'demo', title: '삼성 마케팅 공모전 팀원 구합니다', body: '경영/디자인 전공 팀원 2명 구합니다. 7월 마감이고 주 1회 온라인 미팅 예정입니다. 관심있으신 분 댓글 남겨주세요!', category: 'team_recruit' as const, tags: ['마케팅', '공모전', '삼성'], like_count: 12, comment_count: 5, created_at: '2026-03-22T10:30:00', updated_at: '', profiles: { name: '김서연', department: '경영학과', avatar_url: null } },
    { id: 'd2', user_id: 'demo', title: '정보처리기사 필기 2주 합격 후기', body: '기출문제 5년치 + 요약 정리만으로 합격했습니다. 비전공자도 충분히 가능해요. 공부법 공유합니다.', category: 'review_share' as const, tags: ['정보처리기사', '자격증', '합격후기'], like_count: 28, comment_count: 13, created_at: '2026-03-21T14:00:00', updated_at: '', profiles: { name: '이준호', department: '컴퓨터공학과', avatar_url: null } },
    { id: 'd3', user_id: 'demo', title: '이번 학기 시간표 어떻게 짜셨나요?', body: '3학년 1학기인데 전공 8과목 중 뭘 들어야 할지 모르겠어요. 선배님들 조언 부탁드립니다.', category: 'free' as const, tags: ['시간표', '3학년'], like_count: 7, comment_count: 9, created_at: '2026-03-20T09:15:00', updated_at: '', profiles: { name: '박하은', department: '디자인학과', avatar_url: null } },
    { id: 'd4', user_id: 'demo', title: '네이버 부스트캠프 같이 준비하실 분!', body: 'AI 웹 과정 지원 예정입니다. 스터디 그룹 만들어서 코테 준비하려는데 관심있으신 분 연락주세요.', category: 'team_recruit' as const, tags: ['부스트캠프', '네이버', '스터디'], like_count: 15, comment_count: 8, created_at: '2026-03-19T16:45:00', updated_at: '', profiles: { name: '최민수', department: '소프트웨어학과', avatar_url: null } },
  ]

  useEffect(() => { loadPosts() }, [filter])

  const loadPosts = async () => {
    let query = supabase
      .from('posts')
      .select('*, profiles(name, department, avatar_url)')
      .order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('category', filter)
    const { data } = await query
    if (data && data.length > 0) {
      setPosts(data)
    } else {
      setPosts(DEMO_POSTS as any)
    }
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
