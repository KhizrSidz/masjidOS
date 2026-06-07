// src/pages/admin/Events.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase, DEMO_MODE } from '../../lib/supabase'
import { MOCK_EVENTS } from '../../lib/mockData'

export default function Events() {
  const { profile } = useAuth()
  const [events,   setEvents]   = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)

  const [title,    setTitle]    = useState('')
  const [desc,     setDesc]     = useState('')
  const [date,     setDate]     = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    if (DEMO_MODE) { setEvents(MOCK_EVENTS); setLoading(false); return }
    supabase.from('events').select('*').eq('mosque_id', profile?.mosque_id).order('event_date')
      .then(({ data }) => { setEvents(data || []); setLoading(false) })
  }, [profile])

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)

    if (DEMO_MODE) {
      setEvents(prev => [...prev, { id: Date.now(), title, description: desc, event_date: date, location, mosque_id: 'mosque-1' }])
    } else {
      const { data } = await supabase.from('events').insert({ mosque_id: profile.mosque_id, title, description: desc, event_date: date, location }).select().single()
      if (data) setEvents(prev => [...prev, data])
    }

    setTitle(''); setDesc(''); setDate(''); setLocation(''); setShowForm(false); setSaving(false)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this event?')) return
    if (!DEMO_MODE) await supabase.from('events').delete().eq('id', id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div>
      <div className="page-header">
        <h1>Events</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Event</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>New Event</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group"><label>Title</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Youth Basketball Night" required /></div>
            <div className="form-group"><label>Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Details about the event..." rows={3} style={{ resize: 'vertical' }} /></div>
            <div className="form-row">
              <div className="form-group"><label>Date & Time</label><input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required /></div>
              <div className="form-group"><label>Location</label><input value={location} onChange={e => setLocation(e.target.value)} placeholder="Masjid Hall" /></div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Event'}</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading...</p> : events.length === 0 ? (
        <div className="empty-state"><div className="icon">📅</div><p>No events yet. Add your first one!</p></div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {events.map(ev => (
            <div key={ev.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.3rem' }}>{ev.title}</h3>
                {ev.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.5rem' }}>{ev.description}</p>}
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span>📅 {new Date(ev.event_date).toLocaleDateString('en-CA', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  {ev.location && <span>📍 {ev.location}</span>}
                </div>
              </div>
              <button className="btn-danger" onClick={() => handleDelete(ev.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
