import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Calendar, MapPin, Globe, Camera } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setTempName(user?.user_metadata?.full_name || formatFallbackName(user?.email))
      setLoading(false)
    }
    getUser()
  }, [])

  function formatFallbackName(email) {
    if (!email) return 'Saboor'
    // Get part before @
    const namePart = email.split('@')[0]
    // Remove numbers and replace dots/underscores with spaces
    const cleanName = namePart.replace(/[0-9]/g, '').replace(/[._]/g, ' ')
    // Capitalize words
    return cleanName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  async function handleUpdateProfile() {
    setUpdating(true)
    
    // 1. Update Auth User Metadata (private user data)
    const { data: { user: updatedUser }, error: authError } = await supabase.auth.updateUser({
      data: { full_name: tempName }
    })

    if (authError) {
      console.error('Error updating auth user:', authError)
      setUpdating(false)
      return
    }
    
    // 2. Update Public Profiles Table (public user data)
    // Note: The profiles table has a 'username' column, we should update that or add a full_name column if it existed.
    // Based on table.sql, we only have 'username'. Let's assume we map full_name -> username for now, 
    // or if the user wants separate fields. But the request is "make sure... it effect on database".
    
    // Let's try to update the 'username' in profiles table with the new name.
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ username: tempName })
      .eq('id', user.id)

    if (profileError) {
      console.error('Error updating profiles table:', profileError)
    }

    if (updatedUser) {
      setUser(updatedUser)
      setIsEditing(false)
    }
    setUpdating(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500">
        Please log in to view your profile.
      </div>
    )
  }

  // Extract metadata or fallback to defaults
  const fullName = user.user_metadata?.full_name || formatFallbackName(user.email)
  const email = user.email
  const avatarUrl = user.user_metadata?.avatar_url
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header / Banner */}
      <div className="relative mb-8 rounded-2xl bg-indigo-600 h-32 md:h-48 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
      </div>

      <div className="relative px-4 sm:px-8 -mt-20">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center text-gray-400">
               {avatarUrl ? (
                 <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-4xl font-bold text-gray-400">
                    {/* Show the first letter of the name */}
                    {fullName.charAt(0).toUpperCase()}
                 </span>
               )}
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full text-gray-600 shadow-md border border-gray-100 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100">
              <Camera size={16} />
            </button>
          </div>

          {/* Name & Title */}
          <div className="flex-1 text-center md:text-left mb-2">
             {isEditing ? (
               <input 
                 type="text" 
                 value={tempName}
                 onChange={(e) => setTempName(e.target.value)}
                 className="text-3xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none bg-transparent w-full md:w-auto"
                 autoFocus
               />
             ) : (
               <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
             )}
             <p className="text-gray-500 font-medium">{email}</p>
          </div>

          {/* Actions */}
          <div className="mb-4 flex gap-2">
             {isEditing ? (
               <>
                 <button 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={updating}
                  >
                   Cancel
                 </button>
                 <button 
                    onClick={handleUpdateProfile}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    disabled={updating}
                  >
                   {updating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save'}
                 </button>
               </>
             ) : (
               <button 
                 onClick={() => setIsEditing(true)}
                 className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
               >
                 Edit Profile
               </button>
             )}
             {!isEditing && (
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                  Share
                </button>
             )}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">About</h3>
            <div className="space-y-4 text-sm text-gray-600">
               <div className="flex items-center gap-3">
                 <Mail size={16} className="text-gray-400" />
                 <span>{email}</span>
               </div>
               <div className="flex items-center gap-3">
                 <Calendar size={16} className="text-gray-400" />
                 <span>Joined {joinDate}</span>
               </div>
               <div className="flex items-center gap-3">
                 <Shield size={16} className="text-gray-400" />
                 <span>Verified User</span>
               </div>
               <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-400" />
                  <span>San Francisco, CA</span>
               </div>
               <div className="flex items-center gap-3">
                  <Globe size={16} className="text-gray-400" />
                  <a href="#" className="text-indigo-600 hover:underline">knowledgehub.dev</a>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity / Stats */}
        <div className="md:col-span-2 space-y-6">
           {/* Stats Cards */}
           <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                 <div className="text-2xl font-bold text-gray-900">12</div>
                 <div className="text-xs text-gray-500 font-medium uppercase mt-1">Snippets</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                 <div className="text-2xl font-bold text-gray-900">45</div>
                 <div className="text-xs text-gray-500 font-medium uppercase mt-1">Followers</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                 <div className="text-2xl font-bold text-gray-900">8</div>
                 <div className="text-xs text-gray-500 font-medium uppercase mt-1">Stars</div>
              </div>
           </div>

           {/* Empty State placeholder for "The Rest" */}
           <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                 <User size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-gray-500 max-w-sm mt-2">
                Your recent coding activity and updates will appear here once you start using the platform more actively.
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
