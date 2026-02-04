import { useState, useEffect } from 'react'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Trash2, Edit3, Calendar, Tag, ChevronLeft, Save, AlertCircle,
  BookOpen, Terminal, Shield, Layers, Users, Cloud, Palette, Settings, ChevronRight, Menu, X, ChevronDown, User, Zap
} from 'lucide-react'
import { Link, useLocation, useNavigate, Routes, Route, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from '../components/ui/CodeBlock'
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)
  const [deleteOnSuccess, setDeleteOnSuccess] = useState(null)

  // Form State
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState('blog')
  const [error, setError] = useState(null)

  const recentPosts = posts.slice(0, 5) // Recent 5 for sidebar

  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(username)')
      .eq('type', 'blog')
      .order('created_at', { ascending: false })
    
    if (error) setError(error.message)
    else setPosts(data)
    setLoading(false)
  }

  function requestDelete(id, onSuccess) {
    setPostToDelete(id)
    setDeleteOnSuccess(() => onSuccess) // Function wrapper to store function in state
    setDeleteModalOpen(true)
  }

  async function performDelete() {
    if (!postToDelete) return
    
    const { error } = await supabase.from('posts').delete().eq('id', postToDelete)
    if (error) {
        setError(error.message)
    } else {
        await fetchPosts()
        if (deleteOnSuccess) deleteOnSuccess()
    }
    setDeleteModalOpen(false)
    setPostToDelete(null)
    setDeleteOnSuccess(null)
  }

  function startEdit(post) {
    navigate('/create', { state: { editPost: post } })
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    fetchPosts()

    // Handle initial hash scroll
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '')
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 500)
    }
  }, [location.hash])

  // Loading state handled inside layout for better UX or here?
  // Let's keep it simple.

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex pt-12 pb-24 border-border">
        {/* Sidebar */}
        {/* Sidebar */}
        <aside className="hidden lg:block fixed top-20 bottom-0 w-72 overflow-y-auto pr-8 py-4 z-40">
          <div className="space-y-10">
            {/* Recent Updates Mini-list */}
            <div>
              <h5 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400 px-2">Recent Posts</h5>
              <div className="space-y-1">
                {recentPosts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/blog/${p.id}`)}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex flex-col gap-1 group/item hover:bg-gray-50"
                  >
                    <span className="font-semibold text-gray-700 group-hover/item:text-indigo-600 line-clamp-2 leading-snug tracking-tight transition-colors">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{new Date(p.created_at).toLocaleDateString()}</span>
                  </button>
                ))}
              </div>
            </div>


          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:ml-80 px-4 sm:px-6 lg:px-8 lg:pr-12">
            {loading && posts.length === 0 ? (
                 <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" /></div>
            ) : (
                <>
                  <div className="flex items-center justify-end mb-8">
                  </div>

                  {error && (
                    <div className="mb-8 flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                      <AlertCircle size={18} />
                      {error}
                    </div>
                  )}

                  <Routes>
                    <Route index element={
                      <BlogFeed 
                        posts={posts} 
                        user={user} 
                        startEdit={startEdit} 
                        handleDelete={requestDelete} 
                      />
                    } />
                    <Route path=":id" element={
                        <BlogDetail 
                            user={user}
                            startEdit={startEdit}
                            handleDelete={requestDelete}
                        />
                    } />
                  </Routes>
                </>
            )}
        </main>
      </div>
      <DeleteConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={performDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  )
}

const BlogFeed = ({ posts, user, startEdit, handleDelete }) => {
    // Show only the latest post on the index page
    const latestPost = posts.length > 0 ? posts[0] : null;

    return (
        <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
        >
            {!latestPost ? (
                <div className="text-center py-20 px-4 glass rounded-3xl border-dashed border-2 border-gray-300">
                    <div className="text-gray-500 italic">No posts published yet.</div>
                </div>
            ) : (
                <div className="space-y-12">
                     <article key={latestPost.id} id={`post-${latestPost.id}`} className="group relative border-b border-gray-100 pb-12">
                         <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={12} />
                                {new Date(latestPost.created_at).toLocaleDateString()}
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                            <span className="flex items-center gap-1.5">
                                <User size={12} /> {latestPost.profiles?.username || "Admin"}
                            </span>
                        </div>
                        
                        {user && (
                            <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => startEdit(latestPost)}
                                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                    title="Edit this post"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(latestPost.id)}
                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Delete this post"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-8 leading-tight break-words hyphens-auto">
                            {latestPost.title}
                        </h1>

                        <div className="prose max-w-none text-gray-700 prose-lg prose-headings:text-gray-900 prose-a:text-indigo-600 prose-strong:text-gray-900 prose-pre:bg-white prose-pre:border prose-pre:border-gray-100">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    pre: ({children}) => children,
                                    code: CodeBlock
                                }}
                            >
                                {latestPost.content}
                            </ReactMarkdown>
                        </div>
                    </article>
                </div>
            )}
        </motion.div>
    )
}

const BlogDetail = ({ user, startEdit, handleDelete }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchPost() {
            setLoading(true)
            const { data } = await supabase
                .from('posts')
                .select('*, profiles(username)')
                .eq('id', id)
                .maybeSingle()
            
            setPost(data)
            setLoading(false)
        }
        fetchPost()
    }, [id])

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" /></div>
    
    if (!post) return (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="text-gray-500">Post not found.</div>
            <Link to="/blog" className="text-indigo-500 text-sm mt-4 inline-block hover:underline">Back to blog</Link>
        </div>
    )

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-20"
        >
            <div className="mb-8">
                <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors">
                    <ChevronLeft size={14} /> Back to Blog
                </button>
            </div>

            <article className="relative group">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-1.5">
                        <User size={12} /> {post.profiles?.username || "Admin"}
                    </span>
                </div>

                {user && (
                    <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => startEdit(post)}
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                        >
                            <Edit3 size={16} />
                        </button>
                        <button
                            onClick={() => {
                                handleDelete(post.id, () => navigate('/blog'))
                            }}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-8 leading-tight break-words hyphens-auto">
                    {post.title}
                </h1>
                
                <div className="prose max-w-none text-gray-700 prose-lg prose-headings:text-gray-900 prose-a:text-indigo-600 prose-strong:text-gray-900 prose-pre:bg-white prose-pre:border prose-pre:border-gray-100">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            pre: ({children}) => children,
                            code: CodeBlock
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
            </article>
        </motion.div>
    )
}

