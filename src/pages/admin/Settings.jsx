// src/pages/admin/Settings.jsx

import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase, DEMO_MODE } from '../../lib/supabase'

export default function Settings() {
  const { profile } = useAuth()
  const mosque = profile?.mosque

  const [name,        setName]        = useState(mosque?.name || '')
  const [city,        setCity]        = useState(mosque?.city || '')
  const [address,     setAddress]     = useState(mosque?.address || '')
  const [phone,       setPhone]       = useState(mosque?.phone || '')
  const [email,       setEmail]       = useState(mosque?.email || '')
  const [description, setDescription] = useState(mosque?.description || '')
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    if (!DEMO_MODE) {
      await supabase.from('mosques').update({ name, city, address, phone, email, description }).eq('id', mosque.id)
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <div className="page-header"><h1>Settings</h1></div>

      <div className="card" style={{ maxWidth: 600 }}>
        <h2 style={{ fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem' }}>Mosque Information</h2>
        <form onSubmit={handleSave}>
          <div className="form-group"><label>Mosque Name</label><input value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="form-row">
            <div className="form-group"><label>City</label><input value={city} onChange={e => setCity(e.target.value)} /></div>
            <div className="form-group"><label>Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} /></div>
          </div>
          <div className="form-group"><label>Address</label><input value={address} onChange={e => setAddress(e.target.value)} /></div>
          <div className="form-group"><label>Public Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ resize: 'vertical' }} placeholder="Brief description shown on your public page..." />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            {saved && <span style={{ color: 'var(--green)', fontSize: '0.9rem', fontWeight: 500 }}>✓ Saved!</span>}
          </div>
        </form>
      </div>

      {DEMO_MODE && (
        <div className="card" style={{ maxWidth: 600, marginTop: '1.5rem', borderLeft: '3px solid var(--gold)' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>🔗 Connect to Supabase</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Currently running in demo mode. To connect a real database:
          </p>
          <ol style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 2, paddingLeft: '1.25rem' }}>
            <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer">supabase.com</a></li>
            <li>Copy your project URL and anon key</li>
            <li>Create a <code style={{ background: '#f1f3f5', padding: '0 4px', borderRadius: 4 }}>.env</code> file from <code style={{ background: '#f1f3f5', padding: '0 4px', borderRadius: 4 }}>.env.example</code></li>
            <li>Paste your credentials and restart the dev server</li>
          </ol>
        </div>
      )}
    </div>
  )
}
