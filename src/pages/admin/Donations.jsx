// src/pages/admin/Donations.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase, DEMO_MODE } from '../../lib/supabase'
import { MOCK_DONATIONS } from '../../lib/mockData'

export default function Donations() {
  const { profile } = useAuth()
  const [donations, setDonations] = useState([])
  const [showForm,  setShowForm]  = useState(false)
  const [loading,   setLoading]   = useState(true)

  const [donor,   setDonor]   = useState('')
  const [amount,  setAmount]  = useState('')
  const [purpose, setPurpose] = useState('General Fund')
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    if (DEMO_MODE) { setDonations(MOCK_DONATIONS); setLoading(false); return }
    supabase.from('donations').select('*').eq('mosque_id', profile?.mosque_id).order('created_at', { ascending: false })
      .then(({ data }) => { setDonations(data || []); setLoading(false) })
  }, [profile])

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)

    if (DEMO_MODE) {
      const newDonation = { id: Date.now(), donor_name: donor || 'Anonymous', amount: parseFloat(amount), purpose, created_at: new Date().toISOString(), mosque_id: 'mosque-1' }
      setDonations(prev => [newDonation, ...prev])
    } else {
      const { data } = await supabase.from('donations').insert({ mosque_id: profile.mosque_id, donor_name: donor || 'Anonymous', amount: parseFloat(amount), purpose }).select().single()
      if (data) setDonations(prev => [data, ...prev])
    }

    setDonor(''); setAmount(''); setPurpose('General Fund'); setShowForm(false); setSaving(false)
  }

  const total = donations.reduce((s, d) => s + d.amount, 0)

  return (
    <div>
      <div className="page-header">
        <h1>Donations</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Record Donation</button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Raised</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--green)' }}>${total.toLocaleString()}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Donations</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{donations.length}</div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Record Donation</h3>
          <form onSubmit={handleAdd}>
            <div className="form-row">
              <div className="form-group">
                <label>Donor Name</label>
                <input value={donor} onChange={e => setDonor(e.target.value)} placeholder="Ahmed Hassan (or leave blank for Anonymous)" />
              </div>
              <div className="form-group">
                <label>Amount ($)</label>
                <input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} placeholder="500" required />
              </div>
            </div>
            <div className="form-group">
              <label>Purpose</label>
              <select value={purpose} onChange={e => setPurpose(e.target.value)}>
                {['General Fund', 'Building Fund', 'Ramadan Fund', 'Zakat', 'Sadaqah', 'Other'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Donation'}</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading...</p> : donations.length === 0 ? (
        <div className="empty-state"><div className="icon">💚</div><p>No donations recorded yet.</p></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead style={{ background: 'var(--bg)' }}>
              <tr>
                {['Donor', 'Amount', 'Purpose', 'Date'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontWeight: 500, color: 'var(--text-muted)', fontSize: '0.82rem', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {donations.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 500 }}>{d.donor_name || 'Anonymous'}</td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--green)', fontWeight: 600 }}>${d.amount.toLocaleString()}</td>
                  <td style={{ padding: '0.85rem 1.25rem' }}><span className="badge badge-green">{d.purpose}</span></td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(d.created_at).toLocaleDateString('en-CA')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
