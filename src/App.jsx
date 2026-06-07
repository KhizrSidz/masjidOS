// src/App.jsx
//
// Top-level router. Two main sections:
//   /          → public-facing pages (mosque directory, individual mosque pages)
//   /admin/*   → protected admin portal (requires login)
//   /login     → auth page
//   /onboarding → create or join a mosque after signing up

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { DEMO_MODE } from './lib/supabase'

// Public pages
import MosqueDirectory from './pages/public/MosqueDirectory'
import MosquePage      from './pages/public/MosquePage'

// Auth
import Login from './pages/Login'

// Onboarding
import Onboarding from './pages/onboarding/Onboarding'

// Admin pages
import AdminLayout      from './pages/admin/AdminLayout'
import Dashboard        from './pages/admin/Dashboard'
import Donations        from './pages/admin/Donations'
import Members          from './pages/admin/Members'
import Events           from './pages/admin/Events'
import Announcements    from './pages/admin/Announcements'
import Settings         from './pages/admin/Settings'

// Wrap admin routes — redirect to login if not authenticated
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { user, profile } = useAuth()

  return (
    <>
      {DEMO_MODE && (
        <div className="demo-banner">
          🕌 Demo Mode — Running with mock data. Add Supabase credentials to .env for live data.
        </div>
      )}

      <Routes>
        {/* Public */}
        <Route path="/"               element={<MosqueDirectory />} />
        <Route path="/mosque/:slug"   element={<MosquePage />} />

        {/* Auth */}
        <Route path="/login"          element={user ? <Navigate to="/admin" replace /> : <Login />} />

        {/* Onboarding — after signup, before admin access */}
        <Route path="/onboarding"     element={
          <ProtectedRoute>
            {profile?.mosque_id ? <Navigate to="/admin" replace /> : <Onboarding />}
          </ProtectedRoute>
        } />

        {/* Admin portal */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index                  element={<Dashboard />} />
          <Route path="donations"       element={<Donations />} />
          <Route path="members"         element={<Members />} />
          <Route path="events"          element={<Events />} />
          <Route path="announcements"   element={<Announcements />} />
          <Route path="settings"        element={<Settings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
