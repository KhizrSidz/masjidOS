// src/pages/Login.jsx
//
// Handles both sign in and sign up.
// In demo mode the form still shows but the auth buttons navigate directly
// since AuthContext already has a demo user logged in.

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DEMO_MODE } from '../lib/supabase'

export default function Login() {
  const [mode,     setMode]     = useState('signin') // 'signin' | 'signup'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (DEMO_MODE) {
      // In demo mode, just go straight to admin
      navigate('/admin')
      return
    }

    const { error } = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password, name)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate(mode === 'signup' ? '/onboarding' : '/admin')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ fontSize: '2rem', textDecoration: 'none' }}>🕌</Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>MasjidOS</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Admin Portal</p>
        </div>

        <div className="card">
          {DEMO_MODE && (
            <div style={{ background: '#fff8e1', border: '1px solid #f0d080', borderRadius: 'var(--radius)', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#7a5c00' }}>
              🔑 Demo mode — click Sign In to explore the admin portal with mock data.
            </div>
          )}

          <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            {['signin', 'signup'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, background: 'none', borderRadius: 0,
                borderBottom: mode === m ? '2px solid var(--green)' : '2px solid transparent',
                color: mode === m ? 'var(--green)' : 'var(--text-muted)',
                padding: '0.6rem', fontWeight: mode === m ? 600 : 400,
              }}>
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="form-group">
                <label>Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Ahmed Hassan" required={!DEMO_MODE} />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required={!DEMO_MODE} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required={!DEMO_MODE} />
            </div>

            {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Link to="/">← Back to Directory</Link>
        </p>
      </div>
    </div>
  )
}
