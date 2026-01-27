import { useState, useEffect } from 'react'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Trash2, Edit3, Calendar, Tag, ChevronLeft, Save, AlertCircle,
  BookOpen, Terminal, Shield, Layers, Users, Cloud, Palette, Settings, ChevronRight, Menu, X, ChevronDown
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import MarkdownEditor from '../components/MarkdownEditor'
import CodeBlock from '../components/ui/CodeBlock'

const SidebarItem = ({ icon, label, to, active }) => (
  <Link 
    to={to} 
    className={`group flex items-center justify-between px-4 py-2 rounded-lg transition-colors duration-200 ${
      active 
        ? 'bg-indigo-500/10 text-indigo-500' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  </Link>
)

export default function Updates() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  
  // Form State
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState(null)

  const sections = [
    { group: "Getting Started", items: [
      { label: "Introduction", icon: <BookOpen size={18} />, to: "/docs" },
      { label: "Installation", icon: <Terminal size={18} />, to: "/docs/installation" },
      { label: "Authentication", icon: <Shield size={18} />, to: "/docs/auth" },
    ]},
    { group: "Core Concepts", items: [
      { label: "Snippet Schema", icon: <Layers size={18} />, to: "/docs/schema" },
      { label: "Collaboration", icon: <Users size={18} />, to: "/docs/collab" },
      { label: "Cloud Sync", icon: <Cloud size={18} />, to: "/docs/sync" },
    ]},
    { group: "Customization", items: [
      { label: "Themes", icon: <Palette size={18} />, to: "/docs/themes" },
      { label: "Settings", icon: <Settings size={18} />, to: "/docs/settings" },
    ]},
  ]

  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) setError(error.message)
    else setPosts(data)
    setLoading(false)
  }

  function resetForm() {
    setEditingPost(null)
    setIsCreating(false)
    setTitle('')
    setContent('')
    setError(null)
  }

  async function handleSave() {
    if (!user) {
      setError("You must be logged in to post an update")
      return
    }

    if (!title || !content) {
      setError("Title and content are required")
      return
    }

    const postData = {
      title,
      content,
      language: 'markdown', // using language field as type for now
      user_id: user.id
    }

    let result;
    if (editingPost) {
      result = await supabase.from('posts').update(postData).eq('id', editingPost.id).select()
    } else {
      result = await supabase.from('posts').insert([postData]).select()
    }

    if (result.error) {
      setError(result.error.message)
    } else {
      resetForm()
      if (result.data && result.data[0]) {
        navigate(`/docs/snippet/${result.data[0].id}`)
      } else {
        fetchPosts()
      }
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) setError(error.message)
      else fetchPosts()
    }
  }

  function startEdit(post) {
    setEditingPost(post)
    setTitle(post.title)
    setContent(post.content)
    setIsCreating(true)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    fetchPosts()

    // Check for incoming edit request from other pages
    if (location.state?.editPost) {
      const post = location.state.editPost
      setEditingPost(post)
      setTitle(post.title)
      setContent(post.content)
      setIsCreating(true)
      // Clear state to prevent reopening on refresh
      window.history.replaceState({}, document.title)
    } else if (location.state?.create) {
      resetForm()
      setIsCreating(true)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Loading state handled inside layout for better UX or here?
  // Let's keep it simple.

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex pt-12 pb-24 border-border">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-20 self-start h-[calc(100vh-6rem)] overflow-y-auto pr-6 py-4">
          <nav className="space-y-8">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h5 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400 px-4">{section.group}</h5>
                <div className="space-y-0.5">
                  {section.items.map((item, i) => (
                    <SidebarItem 
                      key={i} 
                      {...item} 
                      active={item.to === "/updates"} // Highlight Updates if explicit or just normal logic? Updates is not in the list.
                    />
                  ))}
                  {/* Manually add Updates link to sidebar if it's the current page? 
                      Actually, Updates is not in the list. The user wants it to LOOK like Docs. 
                      Maybe I should add "Updates" to the sidebar list?
                      "Project Updates" could be in "Getting Started" or its own thing.
                      For now I'll just render the standard docs sidebar.
                  */}
                </div>
              </div>
            ))}

          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:pl-12 px-2 sm:px-6 lg:px-0">

            <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
                <span className="hover:text-indigo-500 cursor-pointer transition">Docs</span>
                <ChevronRight size={14} />
                <span className="text-gray-600 font-medium">Project Updates</span>
            </div>

            {loading && posts.length === 0 ? (
                 <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" /></div>
            ) : (
                <>
                  <div className="flex items-center justify-between mb-12">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Project Updates</h1>
                      <div className="text-sm text-gray-500">Latest news and development progress of KnowledgeHub.</div>
                    </div>
                    {/* Button removed from here as it is in Navbar now? 
                        The user removed it from SnippetsDemo but might want it here?
                        "move it somewhere it else small". I moved it to Navbar.
                        So I will NOT render the big button here anymore unless necessary.
                        Actually, Updates page is the DESTINATION of the "New" button.
                        If I'm ALREADY on Updates page, maybe I should show the button or maybe the form opens automatically?
                        I will leave the big button here for context if user navigates manually, OR rely on Navbar.
                        Let's keep the button here but maybe smaller? Or just rely on Navbar.
                        I'll keep it for now as it's the main page action.
                    */}
                    {!isCreating && user && (
                      <button 
                        onClick={() => setIsCreating(true)}
                        className="w-24 h-9 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-indigo-500/10"
                      >
                        <Plus size={14} /> New
                      </button>
                    )}
                  </div>

                  {error && (
                    <div className="mb-8 flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                      <AlertCircle size={18} />
                      {error}
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {isCreating ? (
                      <motion.div 
                        key="editor"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <button onClick={resetForm} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition text-xs">
                            <ChevronLeft size={16} /> Back to list
                          </button>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={resetForm}
                              className="w-24 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition-all border border-gray-200"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={handleSave}
                              className="w-24 h-9 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-indigo-500/10"
                            >
                              <Save size={14} /> {editingPost ? 'Update' : 'Publish'}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Update Title"
                            className="w-full bg-transparent text-3xl font-bold text-gray-900 border-0 focus:ring-0 outline-none placeholder:text-gray-400"
                          />
                          <MarkdownEditor 
                            value={content} 
                            onChange={setContent} 
                            placeholder="Write your update in Markdown..." 
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-12"
                      >
                        {posts.length === 0 ? (
                          <div className="text-center py-20 px-4 glass rounded-3xl border-dashed border-2 border-gray-300">
                            <div className="text-gray-500 italic">No updates published yet.</div>
                          </div>
                        ) : (
                          posts.map((post) => (
                            <article key={post.id} className="group relative">
                                <div className="pb-12 border-b border-gray-100 mb-12">
                                  <div className="transition-all duration-300">
                                      <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-1">
                                           <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="flex items-center gap-1 text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full"><Tag size={12} /> Update</span>
                                          </div>
                                          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{post.title}</h2>
                                        </div>
                                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEdit(post)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"><Edit3 size={18} /></button>
                                            <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={18} /></button>
                                          </div>
                                      </div>
                                      <div className="prose max-w-none text-gray-600 prose-p:text-sm prose-p:leading-relaxed prose-headings:text-gray-900 prose-a:text-indigo-600 prose-strong:text-gray-900 prose-pre:bg-transparent prose-pre:p-0">
                                        <ReactMarkdown 
                                          remarkPlugins={[remarkGfm]}
                                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                                          components={{
                                            pre: ({children}) => children,
                                            code: CodeBlock
                                          }}
                                        >
                                          {post.content}
                                        </ReactMarkdown>
                                      </div>
                                  </div>
                                </div>
                            </article>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
            )}
        </main>
      </div>
    </div>
  )
}

