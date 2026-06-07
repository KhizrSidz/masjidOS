// src/pages/admin/AdminLayout.jsx
//
// Persistent sidebar + top bar that wraps all admin pages.
// The <Outlet /> renders whichever admin page is currently active.

import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/admin',              label: 'Dashboard',      icon: '📊', end: true },
  { to: '/admin/donations',    label: 'Donations',      icon: '💚' },
  { to: '/admin/members',      label: 'Members',        icon: '👥' },
  { to: '/admin/events',       label: 'Events',         icon: '📅' },
  { to: '/admin/announcements',label: 'Announcements',  icon: '📢' },
  { to: '/admin/settings',     label: 'Settings',       icon: '⚙️' },
]

export default function AdminLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const mosqueName = profile?.mosque?.name || 'Your Mosque'

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: '#1b4332', color: 'white',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '1.4rem' }}>🕌</div>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '0.25rem' }}>MasjidOS</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.65, marginTop: '0.15rem', lineHeight: 1.3 }}>{mosqueName}</div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.6rem 0.75rem', borderRadius: 8, marginBottom: '0.25rem',
                textDecoration: 'none', fontSize: '0.88rem', fontWeight: isActive ? 600 : 400,
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.15s',
              })}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + sign out */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.78rem', opacity: 0.65, marginBottom: '0.5rem', lineHeight: 1.4 }}>
            {profile?.full_name || 'Admin'}<br />
            <span style={{ opacity: 0.7 }}>{profile?.role || 'admin'}</span>
          </div>
          <button onClick={handleSignOut} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.4rem 0.85rem', fontSize: '0.8rem', width: '100%' }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main style={{ flex: 1, padding: '2rem', overflow: 'auto', background: 'var(--bg)' }}>
        <Outlet />
      </main>
    </div>
  )
}
