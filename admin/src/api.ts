import { getStoredAuth, clearStoredAuth } from './auth'

const API_BASE = import.meta.env.DEV ? 'http://localhost:8787' : 'https://api.clock.cosmelon.app'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { token } = getStoredAuth()
  const res = await fetch(`${API_BASE}/api/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (res.status === 401 || res.status === 403) {
    clearStoredAuth()
    window.location.hash = '#/login'
    throw new Error(res.status === 403 ? 'No admin access' : 'Unauthorized')
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as Record<string, unknown>
    throw new Error((data.error as string) || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export interface AdminUser {
  id: string
  email: string
  displayName: string | null
  avatarUrl: string | null
  authProvider: string
  role: string
  status: string
  createdAt: string
  lastActiveAt: string | null
}

export interface UsersResponse {
  users: AdminUser[]
  total: number
  page: number
  pageSize: number
}

export interface UserDetailResponse {
  user: AdminUser & { updatedAt: string }
  stats: {
    totalMinutes: number
    totalCount: number
    recentMinutes: number
    recentCount: number
  }
}

export function fetchUsers(page = 1, pageSize = 20, search = '') {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (search) params.set('search', search)
  return request<UsersResponse>(`/users?${params}`)
}

export function fetchUser(id: string) {
  return request<UserDetailResponse>(`/users/${id}`)
}

export function updateUserStatus(id: string, status: 'active' | 'disabled') {
  return request<{ ok: boolean; status: string }>(`/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}
