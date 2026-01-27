import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Docs from './pages/Docs'
import Updates from './pages/Updates'
import Navbar from './components/layout/Navbar'

import Profile from './components/profile/Profile'
import FloatingCreateButton from './components/FloatingCreateButton'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/docs" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/docs/*" element={<Docs />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <FloatingCreateButton />
      </div>
    </Router>
  )
}

export default App
