import { useState, useEffect } from 'react'
import { Link, Route, Routes, useLocation, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Hash, Terminal, BookOpen, Settings, Cloud, Users, Palette, Shield, Layers, Database, Edit3, Trash2,
  User, Calendar, Menu, X, ChevronDown, Plus
} from 'lucide-react'

import { supabase } from '../lib/supabase'
import FeaturedPost from '../components/FeaturedPost'
import CodeBlock from '../components/ui/CodeBlock'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import BreadCrumb from '../components/ui/BreadCrumb'
import SidebarTitle from "../components/ui/SidebarTitle";
import { checkActiveRoute } from "../components/utils/checkActiveRoute";



const Introduction = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1, transition: { duration: 0.4 } }} 
      exit={{ opacity: 0 }} 
      className="space-y-12"
    >
        <BreadCrumb label="Introduction" />
        <FeaturedPost />         
    </motion.div>
)

const AuthenticationDoc = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1, transition: { duration: 0.4 } }} 
      exit={{ opacity: 0 }} 
      className="space-y-8"
    >
        <BreadCrumb label="Authentication" />
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
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1, transition: { duration: 0.4 } }} 
      exit={{ opacity: 0 }} 
      className="space-y-8"
    >
        <BreadCrumb label="Snippet Schema" />
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


import SidebarLayout from '../components/layout/SidebarLayout'
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal'
import ArticleLayout from '../components/layout/ArticleLayout'

export default function Docs() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [dbDocs, setDbDocs] = useState([])
  const [user, setUser] = useState(null)

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)
  const [deleteOnSuccess, setDeleteOnSuccess] = useState(null)

  async function fetchDbDocs() {
      const { data } = await supabase
        .from('posts')
        .select('id, title')
        .eq('type', 'documentation')
        .order('title', { ascending: true })
      
      if (data) {
        // Filter out docs that are already in the main sections
        const mainDocTitles = ['Introduction', 'Installation', 'Authentication', 'Snippet Schema', 'Collaboration', 'Cloud Sync', 'Themes', 'Settings']
        const resources = data.filter(doc => !mainDocTitles.includes(doc.title))
        setDbDocs(resources)
      }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    fetchDbDocs()
  }, [])

  function requestDelete(id, onSuccess) {
    setPostToDelete(id)
    setDeleteOnSuccess(() => onSuccess)
    setDeleteModalOpen(true)
  }

  async function performDelete() {
    if (!postToDelete) return

    const { error } = await supabase.from('posts').delete().eq('id', postToDelete)
    if (error) {
        alert("Error deleting post: " + error.message)
    } else {
        await fetchDbDocs() // Refresh sidebar
        if (deleteOnSuccess) deleteOnSuccess()
    }
    setDeleteModalOpen(false)
    setPostToDelete(null)
    setDeleteOnSuccess(null)
  }
  
  const sections = [
    { group: "Getting Started", items: [
      { label: "Introduction", icon: <BookOpen size={16} />, to: "/doc" },
      { label: "Installation", icon: <Terminal size={16} />, to: "/doc/installation" },
      { label: "Authentication", icon: <Shield size={16} />, to: "/doc/auth" },
    ]},
    { group: "Core Concepts", items: [
      { label: "Snippet Schema", icon: <Layers size={16} />, to: "/doc/schema" },
      { label: "Collaboration", icon: <Users size={16} />, to: "/doc/collab" },
      { label: "Cloud Sync", icon: <Cloud size={16} />, to: "/doc/sync" },
    ]},

    { group: "Resources", items: dbDocs.map(doc => ({
      label: doc.title,
      icon: <Hash size={16} />,
      to: `/doc/snippet/${doc.id}`
    }))},
  ]

  const sidebarContent = (
    <nav className="space-y-8">
      {/* {user && (
        <div className="px-4 mb-6">
          <button 
            onClick={() => navigate('/create', { state: { create: true, type: 'documentation' } })}
            className="w-full h-10 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-200"
          >
            <Plus size={16} /> New Doc
          </button>
        </div>
      )} */}
      {sections.map((section, idx) => (
        <div key={idx}>
          <h5 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400 px-4">
            {section.group}
          </h5>
          <div className="space-y-0.5">
            {section.items.map((item, i) => {
              const isActive = checkActiveRoute(item.to, {
                currentPath: location.pathname, 
              });

              return (
                <SidebarTitle
               key={i}
               title={item.label}
               isActive={isActive}
               onClick={() => navigate(item.to)}
               icon={item.icon}
              
              />
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <SidebarLayout sidebar={sidebarContent} variant="docs">
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route index element={<SnippetViewer title="Introduction" onRequestDelete={requestDelete} />} />
                <Route path="installation" element={<SnippetViewer title="Installation" onRequestDelete={requestDelete} />} />
                <Route path="auth" element={<SnippetViewer title="Authentication" onRequestDelete={requestDelete} />} />
                <Route path="schema" element={<SnippetViewer title="Snippet Schema" onRequestDelete={requestDelete} />} />
                <Route path="collab" element={<SnippetViewer title="Collaboration" onRequestDelete={requestDelete} />} />
                <Route path="sync" element={<SnippetViewer title="Cloud Sync" onRequestDelete={requestDelete} />} />
                <Route path="themes" element={<SnippetViewer title="Themes" onRequestDelete={requestDelete} />} />
                <Route path="settings" element={<SnippetViewer title="Settings" onRequestDelete={requestDelete} />} />
                <Route path="snippet/:id" element={<SnippetViewer onRequestDelete={requestDelete} />} />
                <Route path="*" element={<div className="text-center py-20 text-gray-500">Documentation section coming soon.</div>} />
            </Routes>
        </AnimatePresence>

        {/* Pagination - Keep it here as footer for main content */}
        <div className="mt-20 flex items-center justify-between border-t border-gray-200 pt-10">
            <div className="flex flex-col gap-2">
                <Link to="#" className="text-indigo-500 hover:text-indigo-600 font-medium transition flex items-center gap-1">
                    ← Background
                </Link>
            </div>
            <div className="flex flex-col gap-2 text-right">
                <Link to="/doc/auth" className="text-indigo-500 hover:text-indigo-600 font-medium transition flex items-center gap-1">
                    Authentication →
                </Link>
            </div>
        </div>

        <DeleteConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={performDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document? This will remove it from the sidebar and database permanently."
        />
    </SidebarLayout>
  )
}

const SnippetViewer = ({ title: propTitle, onRequestDelete }) => {
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
        // Fetch by title (case insensitive) - only for docs
        query = query.ilike('title', propTitle).eq('type', 'documentation')
      } else if (id) {
        // Fetch by UUID - allow any type if specifically linked by ID
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
    navigate('/create', { state: { editPost: post } })
  }

  const handleDelete = async () => {
    if (onRequestDelete && post) {
        onRequestDelete(post.id, () => {
            setPost(null)
            navigate('/doc')
        })
    }
  }

  if (loading) return (
    <div>
      <BreadCrumb label={propTitle || "Loading..."} />
      <LoadingSpinner />
    </div>
  );

  if (!post) return (
    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
      <div className="text-gray-400 mb-2">No content found for "{propTitle || id}"</div>
      <div className="text-xs text-gray-500">
          To populate this page, create a new document with the exact title: <strong className="text-indigo-500">"{propTitle}"</strong>
      </div>
    </div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1, transition: { duration: 0.4 } }}
      exit={{ opacity: 0 }}
    >
      <BreadCrumb label={post.title} />
      
      <ArticleLayout 
        post={post}
        user={user}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </motion.div>
  )
}
