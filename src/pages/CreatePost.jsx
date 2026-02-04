import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { Save, AlertCircle, ChevronLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import MarkdownEditor from '../components/MarkdownEditor'

export default function CreatePost() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const textareaRef = useRef(null)

  // Form State
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState('blog')
  const [editingPost, setEditingPost] = useState(null)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useLayoutEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [title])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login')
        return
      }
      setUser(session.user)
    })

    if (location.state?.editPost) {
      const post = location.state.editPost
      setEditingPost(post)
      setTitle(post.title)
      setContent(post.content)
      setPostType(post.type === 'update' ? 'blog' : post.type || 'blog')
    } else if (location.state?.type) {
      setPostType(location.state.type)
    }
  }, [location.state, navigate])

  async function handleSave() {
    if (!user) return
    if (!title || !content) {
      setError("Title and content are required")
      return
    }

    setSaving(true)
    setError(null)

    const postData = {
      title,
      content,
      language: 'markdown',
      type: postType,
      user_id: user.id
    }

    let result;
    if (editingPost) {
      result = await supabase.from('posts').update(postData).eq('id', editingPost.id).select()
    } else {
      result = await supabase.from('posts').insert([postData]).select()
    }

    setSaving(false)

    if (result.error) {
      setError(result.error.message)
    } else {
      if (postType === 'documentation') {
        navigate(`/doc/snippet/${result.data[0].id}`)
      } else {
        navigate('/blog')
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-gray-900 transition text-xs font-black uppercase tracking-wider">
                <ChevronLeft size={16} /> Back
            </button>

            <div className="">
                <div className="flex items-center justify-end mb-8">

                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setPostType('blog')}
                                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${postType === 'blog' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Blog
                            </button>
                            <button 
                                onClick={() => setPostType('documentation')}
                                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${postType === 'documentation' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Doc
                            </button>
                        </div>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="h-8 px-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                            <Save size={14} /> {saving ? 'Saving...' : (editingPost ? 'Update' : (postType === 'documentation' ? 'Publish Doc' : 'Publish Post'))}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <textarea
                        ref={textareaRef}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={postType === 'documentation' ? "Document Title..." : "Post Title..."}
                        className="w-full bg-transparent text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 border-0 focus:ring-0 outline-none placeholder:text-gray-200 resize-none overflow-hidden leading-tight py-2"
                        rows={1}
                    />
                    <div className="min-h-[500px] border-t border-gray-100 pt-8">
                        <MarkdownEditor 
                            value={content} 
                            onChange={setContent} 
                            placeholder="Write your amazing content here..." 
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
