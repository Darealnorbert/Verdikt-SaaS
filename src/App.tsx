import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import AuthPage from '@/pages/AuthPage'
import Dashboard from '@/pages/Dashboard'
import UpdatePassword from '@/pages/UpdatePassword'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}
