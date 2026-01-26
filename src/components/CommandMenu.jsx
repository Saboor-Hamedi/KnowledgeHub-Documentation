import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from 'react-router-dom'

import { Search, FileText, Github, Hash, Layout, LogIn,
   Loader2, Sparkles, Sun, Moon, Database, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function CommandMenu({ open, setOpen }) {
  const navigate = useNavigate()
  const [snippets, setSnippets] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  // No body scroll lock to avoid layout shift


  // Fetch data for search
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, created_at')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setPosts(data)
      }
      
      setLoading(false)
    }

    if (open) {
      fetchData()
    }
  }, [open])

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [setOpen])

  const runCommand = (command) => {
    setOpen(false)
    command()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-32 px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 backdrop-blur-sm bg-black/20"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-lg relative z-[101]"
          >
            <Command 
              className="w-full bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
              filter={(value, search) => {
                if (value.toLowerCase().includes(search.toLowerCase())) return 1
                return 0
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault()
                  setOpen(false)
                }
              }}
            >
              <div className="flex items-center border-b border-gray-100 px-4">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <Command.Input 
                  autoFocus
                  placeholder="Search posts, snippets, or navigation..." 
                  className="w-full h-14 bg-transparent text-gray-900 outline-none placeholder:text-gray-400 text-sm font-medium"
                />
                <kbd className="hidden sm:inline-block px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] text-gray-500 font-mono">ESC</kbd>
              </div>

              <Command.List className="h-[300px] overflow-y-auto p-2 scroll-py-2 custom-scrollbar">
                {loading && (
                  <div className="px-2 space-y-2 mt-2">
                     {[1,2,3,4].map(i => (
                         <div key={i} className="h-14 bg-gray-50 rounded-lg animate-pulse box-border" />
                     ))}
                  </div>
                )}

                {!loading && (
                  <Command.Empty className="py-6 text-center text-sm text-gray-500">
                    No results found.
                  </Command.Empty>
                )}

                {!loading && posts.length > 0 && (
                  <Command.Group heading="Updates & Posts" className="text-xs font-semibold text-gray-500 mb-2 px-2">
                    {posts.map((post) => (
                      <Command.Item 
                        key={post.id}
                        value={post.title}
                        onSelect={() => runCommand(() => navigate(`/docs/snippet/${post.id}`))} 
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 aria-selected:bg-indigo-50 aria-selected:text-indigo-600 cursor-pointer transition-colors group"
                      >
                        <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-500 group-aria-selected:bg-white">
                          <BookOpen size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-medium">{post.title}</span>
                          <span className="text-[10px] text-gray-500 group-aria-selected:text-indigo-400 truncate max-w-[200px]">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {!loading && snippets.length > 0 && (
                  <Command.Group heading="Community Snippets" className="text-xs font-semibold text-gray-500 mb-2 px-2">
                    {snippets.map((snippet) => (
                      <Command.Item 
                        key={snippet.id}
                        value={snippet.title}
                        onSelect={() => runCommand(() => navigate(`/docs/snippet/${snippet.id}`))} 
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 aria-selected:bg-indigo-50 aria-selected:text-indigo-600 cursor-pointer transition-colors group"
                      >
                        <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-500 group-aria-selected:bg-white">
                          <Sparkles size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-medium">{snippet.title}</span>
                          <span className="text-[10px] text-gray-500 group-aria-selected:text-indigo-400 truncate max-w-[200px]">
                            {snippet.description || "No description"}
                          </span>
                        </div>
                        {snippet.language && (
                           <span className="ml-auto text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                             {snippet.language}
                           </span>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                <Command.Group heading="Navigation" className="text-xs font-semibold text-gray-500 mb-2 px-2 mt-2">
                  <Command.Item 
                    value="Documentation"
                    onSelect={() => runCommand(() => navigate('/docs'))}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 aria-selected:bg-indigo-50 aria-selected:text-indigo-600 cursor-pointer transition-colors"
                  >
                    <FileText size={16} className="text-gray-400 group-aria-selected:text-indigo-500" />
                    <span>Documentation</span>
                  </Command.Item>
                  <Command.Item 
                    value="Updates"
                    onSelect={() => runCommand(() => navigate('/updates'))}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 aria-selected:bg-indigo-50 aria-selected:text-indigo-600 cursor-pointer transition-colors"
                  >
                    <Layout size={16} className="text-gray-400 group-aria-selected:text-indigo-500" />
                    <span>Updates</span>
                  </Command.Item>
                  <Command.Item 
                    value="Database Schema"
                    onSelect={() => runCommand(() => navigate('/docs/schema'))}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 aria-selected:bg-indigo-50 aria-selected:text-indigo-600 cursor-pointer transition-colors"
                  >
                    <Database size={16} className="text-gray-400 group-aria-selected:text-indigo-500" />
                    <span>Database Schema</span>
                  </Command.Item>
                </Command.Group>


              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
