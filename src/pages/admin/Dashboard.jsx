// src/pages/admin/Dashboard.jsx
//
// Overview page — shows key stats and recent activity at a glance.

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase, DEMO_MODE } from '../../lib/supabase'
import { MOCK_DONATIONS, MOCK_MEMBERS, MOCK_ANNOUNCEMENTS, MOCK_EVENTS } from '../../lib/mockData'
import { usePrayerTimes } from '../../hooks/usePrayerTimes'

export default function Dashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ donations: 0, members: 0, announcements: 0, events: 0, totalDonated: 0 })
  const [recentDonations, setRecentDonations] = useState([])

  const { times } = usePrayerTimes(profile?.mosque?.latitude, profile?.mosque?.longitude)

  useEffect(() => {
    if (DEMO_MODE) {
      const total = MOCK_DONATIONS.reduce((s, d) => s + d.amount, 0)
      setStats({
        donations: MOCK_DONATIONS.length,
        members: MOCK_MEMBERS.length,
        announcements: MOCK_ANNOUNCEMENTS.length,
        events: MOCK_EVENTS.length,
        totalDonated: total,
      })
      setRecentDonations(MOCK_DONATIONS.slice(0, 4))
      return
    }

    const id = profile?.mosque_id
    if (!id) return

    Promise.all([
      supabase.from('donations').select('*').eq('mosque_id', id),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('mosque_id', id),
      supabase.from('announcements').select('id', { count: 'exact' }).eq('mosque_id', id),
      supabase.from('events').select('id', { count: 'exact' }).eq('mosque_id', id).gte('event_date', new Date().toISOString()),
    ]).then(([donations, members, ann, evts]) => {
      const total = (donations.data || []).reduce((s, d) => s + d.amount, 0)
      setStats({
        donations: donations.data?.length || 0,
        members: members.count || 0,
        announcements: ann.count || 0,
        events: evts.count || 0,
        totalDonated: total,
      })
      setRecentDonations((donations.data || []).slice(0, 4))
    })
  }, [profile])

  const statCards = [
    { label: 'Total Donated',    value: `$${stats.totalDonated.toLocaleString()}`, icon: '💚', link: '/admin/donations' },
    { label: 'Members',          value: stats.members,       icon: '👥', link: '/admin/members' },
    { label: 'Announcements',    value: stats.announcements, icon: '📢', link: '/admin/announcements' },
    { label: 'Upcoming Events',  value: stats.events,        icon: '📅', link: '/admin/events' },
  ]

  const nextPrayer = times ? Object.entries(times).find(([, t]) => {
    const [h, m] = t.split(':').map(Number)
    const now = new Date()
    return h * 60 + m > now.getHours() * 60 + now.getMinutes()
  }) : null

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Next prayer callout */}
      {nextPrayer && (
        <div style={{ background: 'linear-gradient(135deg, #1b4332, #2d6a4f)', color: 'white', borderRadius: 'var(--radius)', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ opacity: 0.85, fontSize: '0.9rem' }}>Next Prayer</span>
          <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{nextPrayer[0]} — {nextPrayer[1]}</span>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map(s => (
          <Link to={s.link} key={s.label} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--green)' }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent donations */}
      <div className="card">
        <div className="page-header" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Donations</h2>
          <Link to="/admin/donations" style={{ fontSize: '0.85rem' }}>View all →</Link>
        </div>
        {recentDonations.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No donations yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem 0', fontWeight: 500 }}>Donor</th>
                <th style={{ padding: '0.5rem 0', fontWeight: 500 }}>Amount</th>
                <th style={{ padding: '0.5rem 0', fontWeight: 500 }}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {recentDonations.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.6rem 0' }}>{d.donor_name || 'Anonymous'}</td>
                  <td style={{ padding: '0.6rem 0', color: 'var(--green)', fontWeight: 600 }}>${d.amount.toLocaleString()}</td>
                  <td style={{ padding: '0.6rem 0', color: 'var(--text-muted)' }}>{d.purpose || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
