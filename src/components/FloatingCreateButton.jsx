import { Link, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function FloatingCreateButton() {
  const [user, setUser] = useState(null)
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Hide button on login/signup pages or if not logged in
  if (!user || ['/login', '/signup'].includes(location.pathname)) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Link
          to="/updates"
          state={{ create: true }}
          className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 transition-all hover:scale-110 active:scale-95 group"
          title="Create New Post"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </Link>
      </motion.div>
    </AnimatePresence>
  )
}
