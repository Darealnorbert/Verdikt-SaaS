import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthModal from '@/components/auth/AuthModal'

const Home = lazy(() => import('@/pages/Home'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const UpdatePassword = lazy(() => import('@/pages/UpdatePassword'))

export default function App() {
  return (
    <Router>
      <AuthModal />
      <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--ink)' }}></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
