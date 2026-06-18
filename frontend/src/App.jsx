import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Scan from '@/pages/Scan'
import Results from '@/pages/Results'
import Profile from '@/pages/Profile'
import History from '@/pages/History'
import NotFound   from '@/pages/NotFound'
import DemoResults from '@/pages/DemoResults'
import Navbar from '@/components/Navbar'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token
    ? children
    : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/demo" element={<DemoResults />} />
          <Route
            path="/scan"
            element={
              <ProtectedRoute>
                <Scan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results/:scanId"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}