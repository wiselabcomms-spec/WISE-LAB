import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Reveal } from '@/components/Reveal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { listAllPostsForAdmin, upsertPost } from '@/lib/blog/api'
import type { BlogPost } from '@/lib/blog/types'
import { NAV_LINKS } from '@/lib/nav'

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const EMPTY: Omit<BlogPost, 'id'> = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  coverImageUrl: null,
  author: '',
  publishedAt: null,
  status: 'draft',
  tags: [],
  section: null,
}

export function AdminBlogEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const [post, setPost] = useState<Omit<BlogPost, 'id'> & { id?: string }>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNew)

  useEffect(() => {
    if (isNew) return
    listAllPostsForAdmin().then((posts) => {
      const found = posts.find((p) => p.id === id)
      if (found) setPost(found)
      setLoading(false)
    })
  }, [id, isNew])

  const onSave = async (status: 'draft' | 'published') => {
    setSaving(true)
    try {
      const slug = post.slug || slugify(post.title)
      await upsertPost({ ...post, slug, status })
      navigate('/admin/blog')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-plum/50">Loading…</p>

  return (
    <Reveal className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-plum sm:text-3xl">
        {isNew ? 'New post' : 'Edit post'}
      </h1>

      <div className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={post.slug}
            onChange={(e) => setPost({ ...post, slug: slugify(e.target.value) })}
            placeholder={slugify(post.title) || 'auto-generated-from-title'}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={post.author}
            onChange={(e) => setPost({ ...post, author: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="section">Homepage section</Label>
          <Select
            value={post.section ?? 'none'}
            onValueChange={(value) =>
              setPost({ ...post, section: value === 'none' ? null : (value as BlogPost['section']) })
            }
          >
            <SelectTrigger id="section">
              <SelectValue placeholder="No section (not shown on homepage)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No section (not shown on homepage)</SelectItem>
              {NAV_LINKS.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-plum/50">
            Published posts tagged to a section appear in a "Latest from the Journal" preview there on the live page.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="coverImageUrl">Cover image URL</Label>
          <Input
            id="coverImageUrl"
            value={post.coverImageUrl ?? ''}
            onChange={(e) => setPost({ ...post, coverImageUrl: e.target.value || null })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={post.excerpt}
            onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="min-h-[320px]"
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={() => onSave('draft')} disabled={saving} variant="outline">
            Save draft
          </Button>
          <Button onClick={() => onSave('published')} disabled={saving}>
            Publish
          </Button>
        </div>
      </div>
    </Reveal>
  )
}
