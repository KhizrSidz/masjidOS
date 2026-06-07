// src/pages/public/MosquePage.jsx
//
// Public-facing page for an individual mosque.
// Shows prayer times (live from Aladhan API), announcements, events, and donation info.
// Anyone can view this — no login required.

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, DEMO_MODE } from '../../lib/supabase'
import { MOCK_MOSQUES, MOCK_ANNOUNCEMENTS, MOCK_EVENTS, MOCK_PRAYER_TIMES } from '../../lib/mockData'
import { usePrayerTimes } from '../../hooks/usePrayerTimes'

const PRAYER_ICONS = { Fajr: '🌙', Sunrise: '🌅', Dhuhr: '☀️', Asr: '🌤️', Maghrib: '🌇', Isha: '🌃' }

export default function MosquePage() {
  const { slug } = useParams()
  const [mosque,        setMosque]        = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [events,        setEvents]        = useState([])
  const [loading,       setLoading]       = useState(true)
  const [tab,           setTab]           = useState('prayer')

  const { times: prayerTimes } = usePrayerTimes(mosque?.latitude, mosque?.longitude)

  useEffect(() => {
    if (DEMO_MODE) {
      const m = MOCK_MOSQUES.find(m => m.slug === slug) || MOCK_MOSQUES[0]
      setMosque(m)
      setAnnouncements(MOCK_ANNOUNCEMENTS.filter(a => a.mosque_id === m.id))
      setEvents(MOCK_EVENTS.filter(e => e.mosque_id === m.id))
      setLoading(false)
      return
    }

    async function load() {
      const { data: mosqueData } = await supabase.from('mosques').select('*').eq('slug', slug).single()
      if (!mosqueData) { setLoading(false); return }
      setMosque(mosqueData)

      const [{ data: ann }, { data: evts }] = await Promise.all([
        supabase.from('announcements').select('*').eq('mosque_id', mosqueData.id).order('created_at', { ascending: false }).limit(10),
        supabase.from('events').select('*').eq('mosque_id', mosqueData.id).gte('event_date', new Date().toISOString()).order('event_date').limit(10),
      ])

      setAnnouncements(ann || [])
      setEvents(evts || [])
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>
  if (!mosque)  return <div style={{ padding: '3rem', textAlign: 'center' }}>Mosque not found. <Link to="/">← Back</Link></div>

  const tabs = ['prayer', 'announcements', 'events', 'donate']

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Back link */}
      <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>← Back to Directory</Link>
      </div>

      {/* Mosque header */}
      <header style={{ background: 'linear-gradient(135deg, #1b4332, #2d6a4f)', color: 'white', padding: '2.5rem 1rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🕌</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>{mosque.name}</h1>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{mosque.address}</p>
        {mosque.phone && <p style={{ opacity: 0.7, fontSize: '0.85rem', marginTop: '0.25rem' }}>{mosque.phone}</p>}
        {mosque.description && <p style={{ opacity: 0.85, maxWidth: 500, margin: '0.75rem auto 0', fontSize: '0.9rem', lineHeight: 1.6 }}>{mosque.description}</p>}
      </header>

      {/* Tab nav */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'center', gap: '0.25rem', padding: '0 1rem' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', border: 'none', borderBottom: tab === t ? '2.5px solid var(--green)' : '2.5px solid transparent',
            color: tab === t ? 'var(--green)' : 'var(--text-muted)', padding: '0.85rem 1rem',
            fontWeight: tab === t ? 600 : 400, borderRadius: 0, textTransform: 'capitalize',
          }}>
            {t === 'prayer' ? '🕐 Prayer Times' : t === 'announcements' ? '📢 Announcements' : t === 'events' ? '📅 Events' : '💚 Donate'}
          </button>
        ))}
      </div>

      <main style={{ maxWidth: 700, margin: '2rem auto', padding: '0 1rem' }}>

        {/* Prayer Times */}
        {tab === 'prayer' && (
          <div>
            <h2 style={{ marginBottom: '1rem', fontWeight: 600 }}>Today's Prayer Times</h2>
            {prayerTimes ? (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {Object.entries(prayerTimes).map(([name, time]) => (
                  <div key={name} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{PRAYER_ICONS[name]}</span>
                      <span style={{ fontWeight: 500 }}>{name}</span>
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--green)', fontVariantNumeric: 'tabular-nums' }}>{time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Loading prayer times...</p>
            )}
          </div>
        )}

        {/* Announcements */}
        {tab === 'announcements' && (
          <div>
            <h2 style={{ marginBottom: '1rem', fontWeight: 600 }}>Announcements</h2>
            {announcements.length === 0 ? (
              <div className="empty-state"><div className="icon">📢</div><p>No announcements yet.</p></div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {announcements.map(a => (
                  <div key={a.id} className="card">
                    <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{a.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{a.message}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                      {new Date(a.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Events */}
        {tab === 'events' && (
          <div>
            <h2 style={{ marginBottom: '1rem', fontWeight: 600 }}>Upcoming Events</h2>
            {events.length === 0 ? (
              <div className="empty-state"><div className="icon">📅</div><p>No upcoming events.</p></div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {events.map(e => (
                  <div key={e.id} className="card">
                    <h3 style={{ fontWeight: 600, marginBottom: '0.4rem' }}>{e.title}</h3>
                    {e.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.6rem' }}>{e.description}</p>}
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span>📅 {new Date(e.event_date).toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      {e.location && <span>📍 {e.location}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Donate */}
        {tab === 'donate' && (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💚</div>
            <h2 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Support {mosque.name}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Your donations help maintain our masjid, fund community programs, and support families in need.
              JazakAllah Khair for your generosity.
            </p>
            {mosque.email && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                To donate, contact us at <a href={`mailto:${mosque.email}`}>{mosque.email}</a>
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
