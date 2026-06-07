// src/context/AuthContext.jsx
//
// Provides the current user and their mosque info to the whole app.
// In demo mode, we use a fake admin user so all pages are accessible.

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, DEMO_MODE } from '../lib/supabase'
import { MOCK_MOSQUES } from '../lib/mockData'

const AuthContext = createContext(null)

// Demo user — used when no Supabase credentials are set
const DEMO_USER = {
  id: 'demo-user-1',
  email: 'admin@masjidalnoor.ca',
  user_metadata: { full_name: 'Ahmed Hassan' },
}

const DEMO_PROFILE = {
  id: 'demo-user-1',
  full_name: 'Ahmed Hassan',
  mosque_id: 'mosque-1',
  role: 'admin',
  mosque: MOCK_MOSQUES[0],
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(DEMO_MODE ? DEMO_USER : null)
  const [profile, setProfile] = useState(DEMO_MODE ? DEMO_PROFILE : null)
  const [loading, setLoading] = useState(!DEMO_MODE)

  useEffect(() => {
    if (DEMO_MODE) return

    // Get the current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*, mosque:mosques(*)')
      .eq('id', userId)
      .single()

    setProfile(data)
    setLoading(false)
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signUp(email, password, fullName) {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    })
    return { error }
  }

  async function signOut() {
    if (!DEMO_MODE) await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
