/**
 * LoginPanel — bottom sheet login panel with email code + OAuth
 */
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../hooks/useTheme'
import { useI18n } from '../i18n'
import { CodeInput } from './CodeInput'

const API_BASE = 'https://watermelon-clock-api.yuchangzhou.workers.dev'

interface LoginPanelProps {
  open: boolean
  onClose: () => void
  onLogin: (accessToken: string) => void
}

export function LoginPanel({ open, onClose, onLogin }: LoginPanelProps) {
  const theme = useTheme()
  const i18n = useI18n()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Slide-in animation
  useEffect(() => {
    if (open) {
      setVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true))
      })
    } else if (visible) {
      setAnimating(false)
      const timer = setTimeout(() => {
        setVisible(false)
        setEmail('')
        setCode('')
        setCodeSent(false)
        setError('')
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open, visible])

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  // Auto-verify when 6 digits entered
  useEffect(() => {
    if (code.length === 6 && codeSent && !verifying) {
      handleVerify()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  const handleSendCode = async () => {
    if (!email.trim() || sending) return
    setError('')
    setSending(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/email/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (res.ok) {
        setCodeSent(true)
        setCooldown(60)
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error || i18n.authSendFailed)
      }
    } catch {
      setError(i18n.authSendFailed)
    }
    setSending(false)
  }

  const handleVerify = async () => {
    if (code.length !== 6 || verifying) return
    setError('')
    setVerifying(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/email/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), code }),
      })
      if (res.ok) {
        const data = await res.json() as { accessToken: string }
        onLogin(data.accessToken)
        onClose()
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error || i18n.authVerifyFailed)
        setCode('')
      }
    } catch {
      setError(i18n.authVerifyFailed)
    }
    setVerifying(false)
  }

  const handleOAuth = (provider: 'google' | 'microsoft') => {
    window.location.href = `${API_BASE}/api/auth/${provider}/redirect`
  }

  if (!visible) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: animating ? 1 : 0,
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-lg rounded-t-3xl px-6 pt-3 pb-8 transition-transform duration-300 ease-out"
        style={{
          backgroundColor: theme.surface,
          transform: animating ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* Drag handle + close */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1" />
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: theme.border }}
          />
          <div className="flex-1 flex justify-end">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              style={{ color: theme.textMuted }}
              aria-label={i18n.modalClose}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-center mb-6" style={{ color: theme.text }}>
          {i18n.authTitle}
        </h2>

        {/* Email input */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={i18n.authEmailPlaceholder}
              disabled={codeSent && cooldown > 0}
              className="flex-1 h-11 px-4 rounded-xl text-sm outline-none transition-colors"
              style={{
                backgroundColor: theme.inputBg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendCode() }}
            />
            <button
              onClick={handleSendCode}
              disabled={!email.trim() || sending || cooldown > 0}
              className="h-11 px-4 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: `${theme.accent}20`,
                color: theme.accent,
              }}
            >
              {sending ? '...' : cooldown > 0 ? `${cooldown}s` : i18n.authSendCode}
            </button>
          </div>
        </div>

        {/* Code input — slides in */}
        <div
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: codeSent ? '120px' : '0',
            opacity: codeSent ? 1 : 0,
            marginBottom: codeSent ? '16px' : '0',
          }}
        >
          <div className="py-2">
            <CodeInput value={code} onChange={setCode} disabled={verifying} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-xs text-center mb-4" style={{ color: '#ef4444' }}>
            {error}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
          <span className="text-xs" style={{ color: theme.textFaint }}>{i18n.authOr}</span>
          <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
        </div>

        {/* OAuth buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleOAuth('google')}
            className="h-11 rounded-xl flex items-center justify-center gap-3 text-sm font-medium transition-all cursor-pointer border"
            style={{
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: theme.border,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {i18n.authGoogle}
          </button>

          <button
            onClick={() => handleOAuth('microsoft')}
            className="h-11 rounded-xl flex items-center justify-center gap-3 text-sm font-medium transition-all cursor-pointer border"
            style={{
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: theme.border,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
            {i18n.authMicrosoft}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
