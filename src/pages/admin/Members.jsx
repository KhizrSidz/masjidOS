// src/pages/admin/Members.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase, DEMO_MODE } from '../../lib/supabase'
import { MOCK_MEMBERS } from '../../lib/mockData'

export default function Members() {
  const { profile } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    if (DEMO_MODE) { setMembers(MOCK_MEMBERS); setLoading(false); return }
    supabase.from('profiles').select('*').eq('mosque_id', profile?.mosque_id).order('joined_at', { ascending: false })
      .then(({ data }) => { setMembers(data || []); setLoading(false) })
  }, [profile])

  const filtered = members.filter(m =>
    m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <h1>Members</h1>
        <input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 240 }} />
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        {members.length} total member{members.length !== 1 ? 's' : ''}
      </p>

      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading...</p> : filtered.length === 0 ? (
        <div className="empty-state"><div className="icon">👥</div><p>No members found.</p></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead style={{ background: 'var(--bg)' }}>
              <tr>
                {['Name', 'Email', 'Role', 'Joined'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontWeight: 500, color: 'var(--text-muted)', fontSize: '0.82rem', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 500 }}>{m.full_name || '—'}</td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)' }}>{m.email}</td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span className={`badge ${m.role === 'admin' ? 'badge-gold' : 'badge-grey'}`}>{m.role}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {m.joined_at ? new Date(m.joined_at).toLocaleDateString('en-CA') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
