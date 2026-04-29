import { api } from './api'

export interface Merchant {
  id:        string
  email:     string
  name:      string
  status:    string
  plan:      string
  createdAt: string
}

export interface AuthResponse {
  merchant:     Merchant
  accessToken:  string
  refreshToken: string
}

// ── Storage helpers ────────────────────────────────────────────────────────
export function saveSession(data: AuthResponse) {
  localStorage.setItem('access_token',  data.accessToken)
  localStorage.setItem('refresh_token', data.refreshToken)
  localStorage.setItem('merchant',      JSON.stringify(data.merchant))
}

export function clearSession() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('merchant')
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

export function getMerchant(): Merchant | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('merchant')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken())
}

// ── API calls ──────────────────────────────────────────────────────────────
export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password })
  saveSession(data)
  return data
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  saveSession(data)
  return data
}

export async function logout(): Promise<void> {
  try { await api.post('/auth/logout') } catch { /* ignore */ }
  clearSession()
}

export async function refreshTokens(): Promise<AuthResponse> {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) throw new Error('No refresh token')
  const { data } = await api.post<AuthResponse>('/auth/refresh', { refreshToken })
  saveSession(data)
  return data
}
