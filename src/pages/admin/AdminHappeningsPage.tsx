import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { deletePost, listAllPostsForAdmin } from '@/lib/happenings/api'
import type { HappeningsPost } from '@/lib/happenings/types'
import { Button } from '@/components/ui/button'

export function AdminHappeningsPage() {
  const [posts, setPosts] = useState<HappeningsPost[]>([])
  const [loading, setLoading] = useState(true)

  const reload = () => {
    setLoading(true)
    listAllPostsForAdmin().then((p) => {
      setPosts(p)
      setLoading(false)
    })
  }

  useEffect(reload, [])

  const onDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await deletePost(id)
    reload()
  }

  return (
    <div>
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-plum sm:text-3xl">Happenings</h1>
            <p className="mt-2 text-plum/60">Manage WISE Lab Happenings posts.</p>
          </div>
          <Button asChild size="sm">
            <Link to="/admin/happenings/new">
              <Plus className="h-4 w-4" /> New post
            </Link>
          </Button>
        </div>
      </Reveal>

      {loading ? (
        <p className="mt-8 text-plum/50">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-plum/10 bg-white p-6 text-plum/50">
          No posts yet.
        </p>
      ) : (
        <RevealGroup className="mt-8 space-y-3" stagger={0.05}>
          {posts.map((post) => (
            <RevealItem key={post.id}>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-plum/10 bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-plum">{post.title}</p>
                  <p className="mt-1 text-sm text-plum/50">
                    {post.status === 'published' ? 'Published' : 'Draft'}
                    {post.publishedAt && ` · ${new Date(post.publishedAt).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    to={`/admin/happenings/${post.id}`}
                    className="text-sm font-semibold text-teal hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(post.id)}
                    className="text-sm font-semibold text-destructive hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  )
}
