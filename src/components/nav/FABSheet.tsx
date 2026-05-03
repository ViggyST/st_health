// src/components/nav/FABSheet.tsx
// Bottom sheet triggered by FAB
// 5 log actions → navigate to relevant tab
// 2-column grid, Discipline card spans full width

import { useEffect } from 'react'
import { Utensils, Dumbbell, Activity, Moon, Zap } from 'lucide-react'
import type { TabId } from '../../types'

interface LogAction {
  id: string
  label: string
  sub: string
  Icon: React.ComponentType<{ size: number; strokeWidth: number; color: string }>
  iconBg: string
  iconColor: string
  tab: TabId
  fullWidth?: boolean
}

const ACTIONS: LogAction[] = [
  {
    id: 'meal',
    label: 'Log Meal',
    sub: 'Track food & macros',
    Icon: Utensils,
    iconBg: 'rgba(251, 146, 60, 0.15)',   // orange tint
    iconColor: '#FB923C',
    tab: 'fuel',
  },
  {
    id: 'workout',
    label: 'Log Workout',
    sub: 'Post-session entry',
    Icon: Dumbbell,
    iconBg: 'rgba(74, 222, 128, 0.15)',   // green tint
    iconColor: '#4ADE80',
    tab: 'train',
  },
  {
    id: 'physio',
    label: 'Log Physio',
    sub: 'Attendance & pain',
    Icon: Activity,
    iconBg: 'rgba(96, 165, 250, 0.15)',   // blue tint
    iconColor: '#60A5FA',
    tab: 'train',
  },
  {
    id: 'sleep',
    label: 'Log Sleep',
    sub: 'Last night\'s rest',
    Icon: Moon,
    iconBg: 'rgba(250, 204, 21, 0.12)',   // yellow tint
    iconColor: '#FACC15',
    tab: 'sleep',
  },
  {
    id: 'discipline',
    label: 'Log Discipline',
    sub: 'Smoke-free · Ate clean',
    Icon: Zap,
    iconBg: 'rgba(0, 241, 159, 0.12)',    // accent tint
    iconColor: 'var(--accent)',
    tab: 'today',
    fullWidth: true,
  },
]

interface FABSheetProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (tab: TabId) => void
}

export function FABSheet({ isOpen, onClose, onNavigate }: FABSheetProps) {
  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const rowItems    = ACTIONS.filter(a => !a.fullWidth)
  const fullWidthItem = ACTIONS.find(a => a.fullWidth)

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          zIndex: 200,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Log an activity"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--bg-surface-1)',
          borderTop: '1px solid var(--border-strong)',
          borderRadius: '20px 20px 0 0',
          zIndex: 201,
          padding: '12px 20px',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
          animation: 'slideUp 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Handle */}
        <div style={{
          width: '36px',
          height: '4px',
          background: 'var(--bg-surface-3)',
          borderRadius: '9999px',
          margin: '0 auto 20px',
        }} />

        {/* Header */}
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '16px',
          fontFamily: 'var(--font-body)',
        }}>
          What are you logging?
        </p>

        {/* 2-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
        }}>
          {rowItems.map(action => (
            <ActionCard
              key={action.id}
              action={action}
              onTap={() => onNavigate(action.tab)}
            />
          ))}

          {/* Full-width discipline card */}
          {fullWidthItem && (
            <div style={{ gridColumn: '1 / -1' }}>
              <ActionCard
                action={fullWidthItem}
                onTap={() => onNavigate(fullWidthItem.tab)}
                horizontal
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ── Individual action card ──────────────────────────────────
interface ActionCardProps {
  action: LogAction
  onTap: () => void
  horizontal?: boolean
}

function ActionCard({ action, onTap, horizontal = false }: ActionCardProps) {
  const { label, sub, Icon, iconBg, iconColor } = action

  const handlePress = (el: HTMLButtonElement | null, scale: string) => {
    if (el) el.style.transform = `scale(${scale})`
  }

  return (
    <button
      onClick={onTap}
      style={{
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        alignItems: horizontal ? 'center' : 'flex-start',
        gap: horizontal ? '14px' : '10px',
        background: 'var(--bg-surface-2)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '14px',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
      onMouseDown={e => handlePress(e.currentTarget, '0.96')}
      onMouseUp={e => handlePress(e.currentTarget, '1')}
      onMouseLeave={e => handlePress(e.currentTarget, '1')}
      onTouchStart={e => handlePress(e.currentTarget, '0.96')}
      onTouchEnd={e => handlePress(e.currentTarget, '1')}
    >
      {/* Icon circle */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} strokeWidth={2} color={iconColor} />
      </div>

      {/* Text */}
      <div>
        <p style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
          lineHeight: 1.2,
          margin: 0,
        }}>
          {label}
        </p>
        <p style={{
          fontSize: '12px',
          fontWeight: 400,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          marginTop: '3px',
          lineHeight: 1.3,
          margin: 0,
        }}>
          {sub}
        </p>
      </div>
    </button>
  )
}