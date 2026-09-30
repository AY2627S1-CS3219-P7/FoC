import type { Supplier } from '../interfaces'
import { clearToken, getToken, 
  UnauthorizedError, ForbiddenError, NotFoundError } from './users'

const BASE_URL = 'http://localhost:3001/api/suppliers'

export type ApiSupplier = Omit<Supplier, 'operatingHours' | 'latitude' | 'longitude'> & {
  latitude: string
  longitude: string
}

// create and update endpoints format
export type SupplierInput = {
  name: string
  type: string
  building: string
  floor: string
  location_description: string
  starting_time: string
  closing_time: string
  latitude: number
  longitude: number
}

export function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 || 12
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`
}

export function formatHours(start: string, end: string) {
  if (start.startsWith('00:00') && end.startsWith('23:59')) return 'Open 24 hours'
  return `${formatTime(start)} - ${formatTime(end)}`
}

// TODO: replace with s3 url when hosted on cloud
function toRawImageUrl(url: string | null): string | null {
  if (!url) return null
  return url
    .replace('https://github.com/', 'https://raw.githubusercontent.com/')
    .replace('/blob/', '/')
}

function toSupplier(s: ApiSupplier): Supplier {
  return {
    ...s,
    image_url: toRawImageUrl(s.image_url),
    latitude: Number(s.latitude),
    longitude: Number(s.longitude),
    operatingHours: formatHours(s.starting_time, s.closing_time)
  }
}

async function request(url: string, init: RequestInit = {}) {
  const token = getToken()
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(token ? {Authorization: `Bearer ${token}`}: {}),
      ...init.headers
    },
  })

  if (response.status === 401) {
    clearToken()
    throw new UnauthorizedError('Not authenticated')
  }
  if (response.status === 403) throw new ForbiddenError('You do not have permission to do this')
  if (response.status === 404) throw new NotFoundError('Not found')

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`Request failed: ${response.status} ${errorBody}`)
  }
  return response
}

export async function fetchSuppliers(): Promise<Supplier[]> {
  const response = await request(BASE_URL)
  const data: ApiSupplier[] = await response.json()
  return data.filter((s) => s.is_active).map(toSupplier)
}


export async function fetchSupplierById(id: string): Promise<Supplier | null> {
  const response = await fetch(`${BASE_URL}/${id}`)
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  const data: ApiSupplier | null = await response.json()
  if (!data || !data.is_active) return null
  return toSupplier(data)
}

const jsonHeaders = { 'Content-Type': 'application/json' }

export async function createSupplier(input: SupplierInput) {
  await request(BASE_URL, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(input),
  })
}

export async function updateSupplier(id: string, input: SupplierInput) {
  await request(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify(input),
  })
}

export async function deleteSupplier(id: string) {
  await request(`${BASE_URL}/deactivate/${id}`, { method: 'PATCH' })
}
