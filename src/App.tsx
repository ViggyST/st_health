// src/App.tsx
// App shell — providers, auth gate, tab routing, nav

import { useState } from 'react'
import { UserProvider, useUserContext } from './contexts/UserContext'
import { SelectedDateProvider } from './contexts/SelectedDateContext'
import { BottomNav } from './components/nav/BottomNav'
import { FABSheet } from './components/nav/FABSheet'
import { Today }    from './pages/Today'
import { Fuel }     from './pages/Fuel'
import { Train }    from './pages/Train'
import { Sleep }    from './pages/Sleep'
import { Insights } from './pages/Insights'
import type { TabId } from './types'

// ── Loading spinner ─────────────────────────────────────────
function Spinner() {
  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0D0D0F',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: '2.5px solid var(--accent)',
        borderTopColor: 'transparent',
        animation: 'spin 0.75s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Login screen ────────────────────────────────────────────
import { supabase } from './lib/supabase'

function LoginScreen() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return
    setError('')
    setLoading(true)
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password })
    if (authErr) setError(authErr.message)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{
            fontFamily: 'var(--font-metric)',
            fontSize: '32px',
            fontWeight: 700,
            color: 'var(--accent)',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            ST.Health
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            marginTop: '6px',
          }}>
            Your personal health OS
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />

          {error && (
            <p style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--red)',
              fontSize: '13px',
              margin: 0,
            }}>
              {error}
            </p>
          )}

          <button
            className="btn-primary"
            onClick={handleLogin}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, marginTop: '4px' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Authenticated app shell ─────────────────────────────────
function AppShell() {
  const { user, authLoading } = useUserContext()
  const [activeTab, setActiveTab] = useState<TabId>('today')
  const [fabOpen, setFabOpen]     = useState(false)

  if (authLoading) return <Spinner />
  if (!user)       return <LoginScreen />

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }}>
      {/* Page content — only active tab renders */}
      <main>
        {activeTab === 'today'    && <Today />}
        {activeTab === 'fuel'     && <Fuel />}
        {activeTab === 'train'    && <Train />}
        {activeTab === 'sleep'    && <Sleep />}
        {activeTab === 'insights' && <Insights />}
      </main>

      {/* FAB action sheet */}
      <FABSheet
        isOpen={fabOpen}
        onClose={() => setFabOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab)
          setFabOpen(false)
        }}
      />

      {/* Bottom nav + FAB button */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fabOpen={fabOpen}
        onFabPress={() => setFabOpen(f => !f)}
      />
    </div>
  )
}

// ── Root — providers wrap everything ───────────────────────
export default function App() {
  return (
    <UserProvider>
      <SelectedDateProvider>
        <AppShell />
      </SelectedDateProvider>
    </UserProvider>
  )
}
