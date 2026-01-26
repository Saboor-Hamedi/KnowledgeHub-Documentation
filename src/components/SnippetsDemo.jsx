import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { Code2, Tag, Calendar, Plus, Terminal } from 'lucide-react'

export default function SnippetsDemo() {
  const [snippets, setSnippets] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    fetchSnippets()
  }, [])

  const fetchSnippets = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*, post_tags(tags(name))')
      .order('created_at', { ascending: false })
      .limit(3)

    if (!error) setSnippets(data)
    setLoading(false)
  }

  // Remove the !user check to allow public viewing

  return (
    <div className="space-y-6 mt-12">
      <div className="flex items-center justify-between">
        {user && (
          <button className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl border border-indigo-200 hover:bg-indigo-100 transition">
            <Plus size={18} /> New Snippet
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Posts removed for clean view */}
      </div>
    </div>
  )
}
