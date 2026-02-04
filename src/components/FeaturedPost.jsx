import { useState, useEffect } from 'react'
import rehypeRaw from 'rehype-raw'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, User, Edit3, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useNavigate } from 'react-router-dom'
import CodeBlock from './ui/CodeBlock'
import LoadingSpinner from './ui/LoadingSpinner'

export default function FeaturedPost() {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchFeaturedPost()
  }, [])

  async function fetchFeaturedPost() {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(username)')
      .eq('type', 'documentation')
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching featured post:", error)
      setLoading(false)
      return
    }
    
    setPost(data)
    setLoading(false)
  }

  const handleEdit = () => {
    navigate('/create', { state: { editPost: post } })
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this featured intro post?")) {
        const { error } = await supabase.from('posts').delete().eq('id', post.id)
        if (error) {
            alert("Error deleting post: " + error.message)
        } else {
            console.log("Post deleted")
            // refresh or clear
            setPost(null)
        }
    }
  }

  if (loading) return <LoadingSpinner />
  if (!post) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-12 group relative"
    >
      <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEdit}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          title="Edit this intro"
        >
          <Edit3 size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
          title="Delete this intro"
        >
          <Trash2 size={16} />
        </button>
      </div>

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

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 tracking-wider ">
        {post.title}
      </h1>

      <div
        className="prose max-w-none 
        prose-p:text-sm prose-p:text-gray-600 prose-p:leading-relaxed
        prose-headings:text-sm prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-4 prose-headings:mb-2
        prose-ul:text-sm prose-ul:text-gray-600
        prose-li:text-sm prose-li:text-gray-600
        prose-a:text-indigo-500"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            pre: ({ children }) => children,
            code: CodeBlock,
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
    </motion.div>
  );
}
