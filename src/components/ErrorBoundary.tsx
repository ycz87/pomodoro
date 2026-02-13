/**
 * ErrorBoundary — Catches React render errors to prevent full app crash.
 * Shows a recovery UI with error details instead of a blank/black screen.
 *
 * Also installs global window.onerror and unhandledrejection handlers
 * to catch errors outside React's render cycle.
 */
import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/** Global error log visible on screen — survives React crashes */
const ERROR_LOG_ID = 'wm-error-overlay';

function showGlobalError(msg: string): void {
  if (import.meta.env.PROD) {
    console.error(msg);
    return;
  }
  let el = document.getElementById(ERROR_LOG_ID);
  if (!el) {
    el = document.createElement('div');
    el.id = ERROR_LOG_ID;
    Object.assign(el.style, {
      position: 'fixed', bottom: '0', left: '0', right: '0', zIndex: '99999',
      maxHeight: '40vh', overflow: 'auto', padding: '12px 16px',
      backgroundColor: 'rgba(0,0,0,0.92)', color: '#f87171',
      fontFamily: 'monospace', fontSize: '11px', lineHeight: '1.5',
      whiteSpace: 'pre-wrap', wordBreak: 'break-all',
      borderTop: '2px solid #f87171',
    });
    document.body.appendChild(el);
  }
  const time = new Date().toLocaleTimeString();
  el.textContent += `[${time}] ${msg}\n`;
  el.scrollTop = el.scrollHeight;
}

/** Install global error handlers — call once at app startup */
export function installGlobalErrorHandlers(): void {
  // 生产环境不显示错误 overlay，只在开发环境显示
  if (import.meta.env.PROD) return;

  window.addEventListener('error', (e) => {
    showGlobalError(`ERROR: ${e.message}\n  at ${e.filename}:${e.lineno}:${e.colno}`);
  });
  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason instanceof Error ? e.reason.message : String(e.reason);
    showGlobalError(`UNHANDLED REJECTION: ${reason}`);
  });
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message || 'Unknown error' };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
    showGlobalError(`REACT: ${error.message}\n${info.componentStack?.slice(0, 500) || ''}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          backgroundColor: '#111114',
          color: 'rgba(255,255,255,0.9)',
          fontFamily: 'system-ui, sans-serif',
          padding: '24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px' }}>🍉</div>
          <div style={{ fontSize: '18px', fontWeight: 600 }}>出了点问题</div>
          <div style={{ fontSize: '12px', color: '#f87171', maxWidth: '300px', wordBreak: 'break-all' }}>
            {this.state.errorMessage}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '8px',
              padding: '10px 24px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#f43f5e',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
