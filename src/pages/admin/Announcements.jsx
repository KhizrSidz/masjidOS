// src/pages/admin/Announcements.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase, DEMO_MODE } from '../../lib/supabase'
import { MOCK_ANNOUNCEMENTS } from '../../lib/mockData'

export default function Announcements() {
  const { profile } = useAuth()
  const [announcements, setAnnouncements] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading]  = useState(true)
  const [saving,  setSaving]   = useState(false)

  const [title,   setTitle]   = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (DEMO_MODE) { setAnnouncements(MOCK_ANNOUNCEMENTS); setLoading(false); return }
    supabase.from('announcements').select('*').eq('mosque_id', profile?.mosque_id).order('created_at', { ascending: false })
      .then(({ data }) => { setAnnouncements(data || []); setLoading(false) })
  }, [profile])

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)

    if (DEMO_MODE) {
      setAnnouncements(prev => [{ id: Date.now(), title, message, created_at: new Date().toISOString(), mosque_id: 'mosque-1' }, ...prev])
    } else {
      const { data } = await supabase.from('announcements').insert({ mosque_id: profile.mosque_id, title, message }).select().single()
      if (data) setAnnouncements(prev => [data, ...prev])
    }

    setTitle(''); setMessage(''); setShowForm(false); setSaving(false)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this announcement?')) return
    if (!DEMO_MODE) await supabase.from('announcements').delete().eq('id', id)
    setAnnouncements(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div>
      <div className="page-header">
        <h1>Announcements</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ New Announcement</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>New Announcement</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group"><label>Title</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Eid Mubarak!" required /></div>
            <div className="form-group">
              <label>Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your announcement here..." rows={4} style={{ resize: 'vertical' }} required />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Posting...' : 'Post Announcement'}</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading...</p> : announcements.length === 0 ? (
        <div className="empty-state"><div className="icon">📢</div><p>No announcements yet.</p></div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {announcements.map(a => (
            <div key={a.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.4rem' }}>{a.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{a.message}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
                  {new Date(a.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button className="btn-danger" onClick={() => handleDelete(a.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
