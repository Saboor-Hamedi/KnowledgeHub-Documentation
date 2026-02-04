import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Docs from './pages/Docs'
import Blog from './pages/Blog'
import CreatePost from './pages/CreatePost'
import Navbar from './components/layout/Navbar'

import Profile from './components/profile/Profile'
import FloatingCreateButton from './components/FloatingCreateButton'

import Settings from './pages/Settings'

function App() {
  return (
    // Routers
    <Router>
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/doc" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/doc/*" element={<Docs />} />
          <Route path="/blog/*" element={<Blog />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <FloatingCreateButton />
      </div>
    </Router>
  )
}

export default App
