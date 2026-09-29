import type { Supplier } from '../interfaces'

const BASE_URL = 'http://localhost:3001/api/suppliers'

export type ApiSupplier = Omit<Supplier, 'operatingHours' | 'latitude' | 'longitude'> & {
  latitude: string
  longitude: string
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

function toSupplier(s: ApiSupplier): Supplier {
  return {
    ...s,
    latitude: Number(s.latitude),
    longitude: Number(s.longitude),
    operatingHours: formatHours(s.starting_time, s.closing_time)
  }
}

async function request(url: string, init?: RequestInit) {
  const response = await fetch(url, init)
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
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
  return toSupplier(await response.json())
}

const jsonHeaders = { 'Content-Type': 'application/json' }