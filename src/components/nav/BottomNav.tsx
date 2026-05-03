// src/components/nav/BottomNav.tsx
// 5-tab bottom nav + FAB trigger
// Active tab: accent color icon + label
// Inactive tabs: 35% opacity (Whoop pattern)
// FAB: fixed bottom-right, rotates Plus → X when sheet is open

import { Home, Utensils, Dumbbell, Moon, BarChart2, Plus, X } from 'lucide-react'
import type { TabId } from '../../types'

interface NavTab {
  id: TabId
  label: string
  Icon: React.ComponentType<{ size: number; strokeWidth: number; color: string }>
}

const TABS: NavTab[] = [
  { id: 'today',    label: 'Today',    Icon: Home     },
  { id: 'fuel',     label: 'Fuel',     Icon: Utensils },
  { id: 'train',    label: 'Train',    Icon: Dumbbell },
  { id: 'sleep',    label: 'Sleep',    Icon: Moon     },
  { id: 'insights', label: 'Insights', Icon: BarChart2 },
]

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  fabOpen: boolean
  onFabPress: () => void
}

export function BottomNav({ activeTab, onTabChange, fabOpen, onFabPress }: BottomNavProps) {
  return (
    <>
      {/* ── Bottom navigation bar ── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'calc(64px + env(safe-area-inset-bottom))',
          background: 'var(--bg-surface-1)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'flex-start',
          paddingTop: '10px',
          paddingBottom: 'env(safe-area-inset-bottom)',
          zIndex: 100,
        }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const active = id === activeTab
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0',
                opacity: active ? 1 : 0.35,
                transition: 'opacity 0.15s ease',
                WebkitTapHighlightColor: 'transparent',
                // Minimum 44px touch target (Apple HIG)
                minHeight: '44px',
              }}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.8}
                color={active ? 'var(--accent)' : 'var(--text-primary)'}
              />
              <span style={{
                fontSize: '10px',
                fontWeight: active ? 600 : 500,
                fontFamily: 'var(--font-body)',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                letterSpacing: '0.02em',
                lineHeight: 1,
              }}>
                {label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* ── Floating Action Button ── */}
      <button
        onClick={onFabPress}
        aria-label={fabOpen ? 'Close log menu' : 'Log activity'}
        aria-expanded={fabOpen}
        style={{
          position: 'fixed',
          bottom: 'calc(64px + env(safe-area-inset-bottom) + 16px)',
          right: '20px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: fabOpen ? 'var(--bg-surface-2)' : 'var(--accent)',
          border: fabOpen ? '1px solid var(--border-strong)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          boxShadow: fabOpen
            ? 'none'
            : '0 0 24px rgba(0, 241, 159, 0.30)',
          transition: 'background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
          WebkitTapHighlightColor: 'transparent',
        }}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.91)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.91)')}
        onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {fabOpen
          ? <X size={20} strokeWidth={2.5} color="var(--text-primary)" />
          : <Plus size={22} strokeWidth={2.5} color="#0D0D0F" />
        }
      </button>
    </>
  )
}