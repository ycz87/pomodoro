/**
 * UserProfile — settings section: login prompt or user info
 */
import { useTheme } from '../hooks/useTheme'
import { useI18n } from '../i18n'
import type { User } from '../hooks/useAuth'

interface UserProfileProps {
  user: User | null
  isLoading: boolean
  onLoginClick: () => void
  onLogout: () => void
}

function InitialAvatar({ email, displayName }: { email: string; displayName: string | null }) {
  const theme = useTheme()
  const letter = (displayName || email || '?')[0].toUpperCase()
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
      style={{
        backgroundColor: `${theme.accent}25`,
        color: theme.accent,
      }}
    >
      {letter}
    </div>
  )
}

export function UserProfile({ user, isLoading, onLoginClick, onLogout }: UserProfileProps) {
  const theme = useTheme()
  const i18n = useI18n()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-3">
        <div
          className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: `${theme.accent}40`, borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="w-full py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
        style={{
          backgroundColor: `${theme.accent}15`,
          color: theme.accent,
        }}
      >
        {i18n.authLoginToSync}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt=""
          className="w-10 h-10 rounded-full shrink-0 object-cover"
        />
      ) : (
        <InitialAvatar email={user.email} displayName={user.displayName} />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate" style={{ color: theme.text }}>
          {user.displayName || user.email}
        </div>
        {user.displayName && (
          <div className="text-xs truncate" style={{ color: theme.textMuted }}>
            {user.email}
          </div>
        )}
      </div>
      <button
        onClick={onLogout}
        className="px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
        style={{
          backgroundColor: theme.inputBg,
          color: theme.textMuted,
        }}
      >
        {i18n.authLogout}
      </button>
    </div>
  )
}
