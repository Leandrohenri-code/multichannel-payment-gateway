import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

// ── Request interceptor — inject access token ──────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor — handle 401 → try refresh ───────────────────────
let isRefreshing = false
let failedQueue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(token => {
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      })
    }

    original._retry  = true
    isRefreshing     = true

    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null

    if (!refreshToken) {
      processQueue(error, null)
      isRefreshing = false
      if (typeof window !== 'undefined') window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })
      localStorage.setItem('access_token',  data.accessToken)
      localStorage.setItem('refresh_token', data.refreshToken)
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`
      processQueue(null, data.accessToken)
      original.headers.Authorization = `Bearer ${data.accessToken}`
      return api(original)
    } catch (err) {
      processQueue(err, null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('merchant')
        window.location.href = '/login'
      }
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  },
)
