import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Lock, User, Shield, AlertTriangle, Save, Loader2 } from 'lucide-react'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Settings() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Password State
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passLoading, setPassLoading] = useState(false)
  const [passMessage, setPassMessage] = useState(null)
  const [passError, setPassError] = useState(null)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setPassLoading(true)
    setPassMessage(null)
    setPassError(null)

    if (!oldPassword) {
      setPassError("Please enter your current password")
      setPassLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setPassError("New passwords do not match")
      setPassLoading(false)
      return
    }

    if (password.length < 6) {
      setPassError("New password must be at least 6 characters")
      setPassLoading(false)
      return
    }

    // Verify old password first by re-authenticating
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword
    })

    if (signInError) {
      setPassError("Incorrect current password")
      setPassLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setPassError(error.message)
    } else {
      setPassMessage("Password updated successfully")
      setOldPassword('')
      setPassword('')
      setConfirmPassword('')
    }
    setPassLoading(false)
  }

  if (loading) return <LoadingSpinner />

  if (!user) {
     return (
        <div className="text-center py-20 text-gray-500">
           Please log in to view settings.
        </div>
     )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-2 text-gray-500">Manage your account preferences and security.</p>
      </div>

      <div className="space-y-6">
        {/* Security Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
             <Shield className="text-indigo-600" size={20} />
             <h2 className="text-lg font-semibold text-gray-900">Security</h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
               {/* Hidden username field for accessibility and password managers */}
               <input type="text" name="username" value={user?.email || ''} autoComplete="username" className="hidden" readOnly />

               <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input 
                          type="password" 
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          placeholder="••••••••"
                          autoComplete="current-password"
                        />
                      </div>
                    </div>
                    <div className="border-t border-gray-100 my-4"></div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          placeholder="••••••••"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          placeholder="••••••••"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                  </div>
               </div>

               {/* Feedback Messages */}
               {passError && (
                 <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertTriangle size={16} />
                    {passError}
                 </div>
               )}
               {passMessage && (
                 <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                    <Shield size={16} />
                    {passMessage}
                 </div>
               )}

               <button 
                 type="submit"
                 disabled={passLoading || !password || !oldPassword}
                 className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {passLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                 Update Password
               </button>
            </form>
          </div>
        </div>

        {/* Danger Zone (Optional / Placeholder) */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
           <div className="px-6 py-4 border-b border-red-50 bg-red-50/30 flex items-center gap-3">
             <AlertTriangle className="text-red-500" size={20} />
             <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
           </div>
           <div className="p-6">
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-sm font-medium text-gray-900">Delete Account</h3>
                    <p className="text-xs text-gray-500 mt-1">Permanently delete your account and all of your content.</p>
                 </div>
                 <button className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors">
                    Delete
                 </button>
              </div>
           </div>
        </div>

      </div>
    </motion.div>
  )
}
