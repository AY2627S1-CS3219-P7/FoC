import type { Supplier } from '../interfaces'
import { request, NotFoundError } from './client'

const BASE_URL = '/suppliers'

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
    operatingHours: formatHours(s.starting_time, s.closing_time),
  }
}

export async function fetchSuppliers(): Promise<Supplier[]> {
  const response = await request(BASE_URL)
  const data: ApiSupplier[] = await response.json()
  return data.filter((s) => s.is_active).map(toSupplier)
}


export async function fetchSupplierById(id: string): Promise<Supplier | null> {
  try {
    const response = await request(`${BASE_URL}/${id}`)
    const data: ApiSupplier | null = await response.json()
    if (!data || !data.is_active) return null
    return toSupplier(data)
  } catch (error) {
    if (error instanceof NotFoundError) return null
    throw error
  }
}

export async function createSupplier(input: SupplierInput) {
  await request(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function updateSupplier(id: string, input: SupplierInput) {
  await request(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deleteSupplier(id: string) {
  await request(`${BASE_URL}/deactivate/${id}`, { method: 'PATCH' })
}
