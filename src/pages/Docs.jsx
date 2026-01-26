import { useState, useEffect } from 'react'
import { Link, Route, Routes, useLocation, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Hash, Terminal, BookOpen, Settings, Cloud, Users, Palette, Shield, Layers, Database, Edit3, Trash2,
  User, Calendar, Menu, X, ChevronDown
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from '../lib/supabase'
import FeaturedPost from '../components/FeaturedPost'
import SnippetsDemo from '../components/SnippetsDemo'
import CodeBlock from '../components/ui/CodeBlock'

const DocBreadcrumb = ({ label }) => (
  <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
     <Link to="/docs" className="hover:text-indigo-500 cursor-pointer transition">Docs</Link>
     <ChevronRight size={14} />
     <span className="text-gray-600 font-medium truncate max-w-md">{label}</span>
  </div>
)

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

const Introduction = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
        <DocBreadcrumb label="Introduction" />
        <FeaturedPost />         
    </motion.div>
)

const AuthenticationDoc = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <DocBreadcrumb label="Authentication" />
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Authentication</h1>
        <div className="text-lg text-gray-500 leading-relaxed">
            Securely manage your account and access your snippets across different environments.
        </div>
        
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4 flex items-center gap-2">
                <Hash className="text-indigo-500" size={24} /> Supabase Integration
            </h2>
            <div className="text-gray-600 text-base leading-relaxed">
                KnowledgeHub uses Supabase for world-class security. Every snippet is protected by Row Level Security (RLS) policies that ensure only you can access your data.
            </div>
            
            <CodeBlock className="language-javascript">
{`const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'your-secure-password',
})`}
            </CodeBlock>
        </div>
    </motion.div>
)

const SchemaDoc = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <DocBreadcrumb label="Snippet Schema" />
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Snippet Schema</h1>
        <div className="text-lg text-gray-500 leading-relaxed">
            Understand how your data is structured. KnowledgeHub uses a relational database model to ensure performance and data integrity.
        </div>
        
        <div className="space-y-12">
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Database className="text-indigo-500" size={24} /> Database Tables
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass p-5 rounded-2xl border border-gray-200">
                        <h4 className="font-mono text-indigo-500 mb-2">profiles</h4>
                        <div className="text-xs text-gray-500 mb-4">Stores user-specific settings and identity.</div>
                        <ul className="text-sm space-y-2 text-gray-600">
                            <li><code className="text-purple-500 font-mono">id</code> (UUID, PK)</li>
                            <li><code className="text-purple-500 font-mono">username</code> (Text)</li>
                        </ul>
                    </div>
                    <div className="glass p-5 rounded-2xl border border-gray-200">
                        <h4 className="font-mono text-indigo-500 mb-2">posts</h4>
                        <div className="text-xs text-gray-500 mb-4">Core snippet data with content and language.</div>
                        <ul className="text-sm space-y-2 text-gray-600">
                            <li><code className="text-purple-500 font-mono">id</code> (UUID, PK)</li>
                            <li><code className="text-purple-500 font-mono">title</code> (Text)</li>
                            <li><code className="text-purple-500 font-mono">content</code> (Text)</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="bg-gray-100 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Relational Logic</h3>
                <div className="text-gray-600 text-sm leading-relaxed mb-6">
                    Snippets are linked to tags via a many-to-many relationship using the <code className="text-indigo-500">post_tags</code> join table. This allows for powerful filtering and categorization.
                </div>
                <div className="p-4 rounded-xl bg-gray-200 border border-gray-300 font-mono text-xs text-indigo-600">
                    -- Foreign Key Relationship<br/>
                    ALTER TABLE posts ADD CONSTRAINT user_fk <br/>
                    FOREIGN KEY (user_id) REFERENCES profiles(id);
                </div>
            </section>
        </div>
    </motion.div>
)

export default function Docs() {
  const location = useLocation()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  
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
                      active={location.pathname === item.to} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:pl-12 px-2 sm:px-6 lg:px-0">
            
            <Routes>
                <Route index element={<Introduction />} />
                <Route path="installation" element={<SnippetViewer title="Installation" />} />
                <Route path="auth" element={<SnippetViewer title="Authentication" />} />
                <Route path="schema" element={<SchemaDoc />} />
                <Route path="snippet/:id" element={<SnippetViewer />} />
                <Route path="*" element={<div className="text-center py-20 text-gray-500">Documentation section coming soon.</div>} />
            </Routes>

            {/* Pagination */}
            <div className="mt-20 flex items-center justify-between border-t border-gray-200 pt-10">
                <div className="flex flex-col gap-2">
                    <Link to="#" className="text-indigo-500 hover:text-indigo-600 font-medium transition flex items-center gap-1">
                        ← Background
                    </Link>
                </div>
                <div className="flex flex-col gap-2 text-right">
                    <Link to="/docs/auth" className="text-indigo-500 hover:text-indigo-600 font-medium transition flex items-center gap-1">
                        Authentication →
                    </Link>
                </div>
            </div>

           
        </main>
      </div>
    </div>
  )
}

const SnippetViewer = ({ title: propTitle }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  useEffect(() => {
    async function fetchPost() {
      setLoading(true)
      let query = supabase.from('posts').select('*, profiles(username)')
      
      if (propTitle) {
        // Fetch by title (case insensitive)
        query = query.ilike('title', propTitle)
      } else if (id) {
        // Fetch by UUID
        query = query.eq('id', id)
      }

      const { data, error } = await query.maybeSingle()
      
      if (data) setPost(data)
      else setPost(null)
      setLoading(false)
    }
    fetchPost()
  }, [id, propTitle])

  const handleEdit = () => {
    navigate('/updates', { state: { editPost: post } })
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
        const { error } = await supabase.from('posts').delete().eq('id', post.id)
        if (error) {
            alert("Error deleting post: " + error.message)
        } else {
            setPost(null)
            navigate('/docs')
        }
    }
  }

  if (loading) return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 w-32 bg-gray-200 rounded" />
      <div className="h-10 w-3/4 bg-gray-200 rounded" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
      </div>
    </div>
  )

  if (!post) return (
    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
      <div className="text-gray-400 mb-2">No content found for "{propTitle || id}"</div>
      <div className="text-xs text-gray-500">Create a post with this title in the Updates section to see it here.</div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <DocBreadcrumb label={post.title} />
      
      <div className="group relative">
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
              onClick={handleEdit}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              title="Edit this post"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              title="Delete this post"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>
        <div className="prose max-w-none text-gray-600 prose-headings:text-gray-900 prose-a:text-indigo-600 prose-strong:text-gray-900 prose-code:font-mono prose-pre:p-0 prose-pre:bg-transparent">
           <ReactMarkdown 
             remarkPlugins={[remarkGfm]}
             components={{
               pre: ({children}) => children,
               code: CodeBlock
             }}
           >
             {post.content}
           </ReactMarkdown>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-xs text-gray-500 italic">
            Last updated on {new Date(post.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
