// src/pages/public/MosqueDirectory.jsx
//
// Landing page — shows all mosques in the directory.
// Anyone can view this without logging in.

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, DEMO_MODE } from '../../lib/supabase'
import { MOCK_MOSQUES } from '../../lib/mockData'

export default function MosqueDirectory() {
  const [mosques, setMosques] = useState([])
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (DEMO_MODE) {
      setMosques(MOCK_MOSQUES)
      setLoading(false)
      return
    }

    supabase
      .from('mosques')
      .select('*')
      .order('name')
      .then(({ data }) => { setMosques(data || []); setLoading(false) })
  }, [])

  const filtered = mosques.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
        color: 'white',
        padding: '3rem 1rem 4rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🕌</div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>MasjidOS</h1>
        <p style={{ opacity: 0.85, fontSize: '1.05rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
          The all-in-one platform for Muslim community management
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/login">
            <button className="btn-primary" style={{ background: 'white', color: '#2d6a4f' }}>
              Admin Login
            </button>
          </Link>
        </div>
      </header>

      {/* Search + Directory */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Mosque Directory</h2>
          <input
            placeholder="Search by name or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 280 }}
          />
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading mosques...</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <p>No mosques found matching "{search}"</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {filtered.map(mosque => (
              <Link to={`/mosque/${mosque.slug}`} key={mosque.id} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>🕌</span>
                    <div>
                      <h3 style={{ fontWeight: 600, color: 'var(--text)', fontSize: '1rem' }}>{mosque.name}</h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{mosque.city}, {mosque.province}</p>
                    </div>
                  </div>
                  {mosque.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {mosque.description.length > 100 ? mosque.description.slice(0, 100) + '...' : mosque.description}
                    </p>
                  )}
                  <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--green)', fontWeight: 500 }}>
                    View page →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
