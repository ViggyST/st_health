import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100dvh', background: '#0D0D0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #E8604C', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (!user) return (
    <div style={{ minHeight: '100dvh', background: '#0D0D0F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <LoginScreen />
    </div>
  )

  return (
    <div style={{ minHeight: '100dvh', background: '#0D0D0F', color: '#F2F0EA' }}>
      <div style={{ textAlign: 'center', paddingTop: 80 }}>
        <p style={{ color: '#3DBA6E', fontSize: 18, fontWeight: 600 }}>✅ Sprint 0 complete</p>
        <p style={{ color: '#9B9B9B', fontSize: 14, marginTop: 8 }}>Logged in as {user.email}</p>
        <p style={{ color: '#555558', fontSize: 13, marginTop: 4 }}>Supabase connected · Dark theme active · Ready for Sprint 1</p>
      </div>
    </div>
  )
}

function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F2F0EA', margin: 0 }}>ST.Health</h1>
        <p style={{ color: '#9B9B9B', fontSize: 14, marginTop: 6 }}>Your personal health OS</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '14px 16px', borderRadius: 12, background: '#1A1A1E', border: '1px solid #2A2A2E', color: '#F2F0EA', fontSize: 16, outline: 'none' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{ padding: '14px 16px', borderRadius: 12, background: '#1A1A1E', border: '1px solid #2A2A2E', color: '#F2F0EA', fontSize: 16, outline: 'none' }}
        />
        {error && <p style={{ color: '#E8604C', fontSize: 13, margin: 0 }}>{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ padding: '14px', borderRadius: 12, background: '#E8604C', color: '#fff', fontSize: 16, fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}