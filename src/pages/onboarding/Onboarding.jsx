// src/pages/onboarding/Onboarding.jsx
//
// Shown after signup, before the admin portal.
// New users either create a new mosque or join an existing one with an invite code.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, DEMO_MODE } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function Onboarding() {
  const [step,    setStep]    = useState('choose') // 'choose' | 'create' | 'join'
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  // Create mosque form
  const [mosqueName, setMosqueName] = useState('')
  const [city,       setCity]       = useState('')
  const [address,    setAddress]    = useState('')

  // Join mosque form
  const [inviteCode, setInviteCode] = useState('')

  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleCreate(e) {
    e.preventDefault()
    if (DEMO_MODE) { navigate('/admin'); return }
    setLoading(true); setError('')

    const slug = mosqueName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const { data: mosque, error: mosqueErr } = await supabase
      .from('mosques')
      .insert({ name: mosqueName, city, address, slug })
      .select()
      .single()

    if (mosqueErr) { setError(mosqueErr.message); setLoading(false); return }

    await supabase.from('profiles').upsert({ id: user.id, mosque_id: mosque.id, role: 'admin' })
    navigate('/admin')
  }

  async function handleJoin(e) {
    e.preventDefault()
    if (DEMO_MODE) { navigate('/admin'); return }
    setLoading(true); setError('')

    const { data: mosque, error: mosqueErr } = await supabase
      .from('mosques')
      .select('id')
      .eq('invite_code', inviteCode.trim().toUpperCase())
      .single()

    if (mosqueErr || !mosque) { setError('Invalid invite code. Check with your mosque admin.'); setLoading(false); return }

    await supabase.from('profiles').upsert({ id: user.id, mosque_id: mosque.id, role: 'member' })
    navigate('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem' }}>🕌</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>Welcome to MasjidOS</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Let's set up your community.</p>
        </div>

        {step === 'choose' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div className="card" style={{ cursor: 'pointer', borderColor: 'var(--green)' }} onClick={() => setStep('create')}>
              <h3 style={{ fontWeight: 600, marginBottom: '0.4rem' }}>🏗️ Create a new mosque</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Set up your mosque on MasjidOS and become the admin.</p>
            </div>
            <div className="card" style={{ cursor: 'pointer' }} onClick={() => setStep('join')}>
              <h3 style={{ fontWeight: 600, marginBottom: '0.4rem' }}>🤝 Join an existing mosque</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Got an invite code from your mosque admin? Enter it here.</p>
            </div>
          </div>
        )}

        {step === 'create' && (
          <div className="card">
            <button onClick={() => setStep('choose')} style={{ background: 'none', color: 'var(--text-muted)', marginBottom: '1rem', padding: 0 }}>← Back</button>
            <h2 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Create Your Mosque</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Mosque Name</label>
                <input value={mosqueName} onChange={e => setMosqueName(e.target.value)} placeholder="Masjid Al-Noor" required={!DEMO_MODE} />
              </div>
              <div className="form-group">
                <label>City</label>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="Toronto" required={!DEMO_MODE} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, Toronto, ON" />
              </div>
              {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Creating...' : 'Create Mosque'}
              </button>
            </form>
          </div>
        )}

        {step === 'join' && (
          <div className="card">
            <button onClick={() => setStep('choose')} style={{ background: 'none', color: 'var(--text-muted)', marginBottom: '1rem', padding: 0 }}>← Back</button>
            <h2 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Join a Mosque</h2>
            <form onSubmit={handleJoin}>
              <div className="form-group">
                <label>Invite Code</label>
                <input value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="e.g. NOOR2024" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }} required={!DEMO_MODE} />
              </div>
              {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Joining...' : 'Join Mosque'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
