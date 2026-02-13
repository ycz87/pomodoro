import { useState, useEffect } from 'react'
import { fetchUser, updateUserStatus, type UserDetailResponse } from '../api'

export function UserDetail({ userId }: { userId: string }) {
  const [data, setData] = useState<UserDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchUser(userId)
      .then(setData)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [userId])

  async function toggleStatus() {
    if (!data) return
    const newStatus = data.user.status === 'active' ? 'disabled' : 'active'
    setUpdating(true)
    try {
      await updateUserStatus(userId, newStatus as 'active' | 'disabled')
      setData({ ...data, user: { ...data.user, status: newStatus } })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-400">加载中...</div>
  if (error) return <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
  if (!data) return null

  const { user, stats } = data
  const isActive = user.status === 'active'

  return (
    <div>
      <button
        onClick={() => { window.location.hash = '#/' }}
        className="mb-4 text-sm text-gray-500 hover:text-gray-700"
      >
        ← 返回用户列表
      </button>

      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
              {(user.displayName || user.email || '?')[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{user.displayName || '未设置昵称'}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
              <span>登录方式: {user.authProvider || '—'}</span>
              <span>角色: {user.role}</span>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {isActive ? '正常' : '已禁用'}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-400">
              注册: {user.createdAt ? new Date(user.createdAt).toLocaleString('zh-CN') : '—'}
              {user.lastActiveAt && ` · 最后活跃: ${new Date(user.lastActiveAt).toLocaleString('zh-CN')}`}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="总专注时长" value={`${stats.totalMinutes} 分钟`} />
        <StatCard label="总专注次数" value={`${stats.totalCount} 次`} />
        <StatCard label="近 7 天时长" value={`${stats.recentMinutes} 分钟`} />
        <StatCard label="近 7 天次数" value={`${stats.recentCount} 次`} />
      </div>

      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={toggleStatus}
          disabled={updating}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            isActive
              ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
              : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
          } disabled:opacity-50`}
        >
          {updating ? '处理中...' : isActive ? '禁用用户' : '启用用户'}
        </button>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-semibold text-gray-900 mt-1">{value}</div>
    </div>
  )
}
