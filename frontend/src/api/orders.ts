// TEMPORARY: the Order Service API is not available yet.
// Every function here keeps the signature the views expect, so integration only
// needs to replace the function bodies with `request('/orders...')` calls
// (see ./client.ts) and remove the preview data below.

import type { Order } from '../orders/orderTypes'
import { NotFoundError } from './client'

const NOT_CONNECTED_MESSAGE = 'Order Service is not connected yet.'

// ---- Preview data (remove during integration) ----------------------------

const previewRequester = {
  id: 'preview-requester',
  username: 'you',
  firstName: 'Preview',
  lastName: 'Requester',
}

const previewCourier = {
  id: 'preview-courier',
  username: 'courier01',
  firstName: 'Alex',
  lastName: 'Lim',
}

const previewOrders: Order[] = [
  {
    id: '3f1c9a20-0001-4a00-8000-000000000001',
    status: 'OPEN',
    itemDescription: 'Chicken rice, no chilli',
    pickup: { supplierId: 'preview-1', supplierName: 'Fine Food', building: 'Town Plaza', floor: '1' },
    deliveryLocation: 'COM3, Seminar Room 1',
    creditAmount: 5,
    acceptanceDeadline: '2026-10-20T12:30:00+08:00',
    requester: previewRequester,
    courier: null,
    createdAt: '2026-10-15T10:00:00+08:00',
    updatedAt: '2026-10-15T10:00:00+08:00',
  },
  {
    id: '3f1c9a20-0002-4a00-8000-000000000002',
    status: 'ACCEPTED',
    itemDescription: 'Print 20 pages of lecture notes (black and white)',
    pickup: { supplierId: 'preview-2', supplierName: 'Print Hub', building: 'Central Library', floor: '3' },
    deliveryLocation: 'UTown Residence, Lobby',
    creditAmount: 3,
    acceptanceDeadline: null,
    requester: previewRequester,
    courier: previewCourier,
    createdAt: '2026-10-14T15:20:00+08:00',
    updatedAt: '2026-10-14T15:45:00+08:00',
  },
  {
    id: '3f1c9a20-0003-4a00-8000-000000000003',
    status: 'PICKED_UP',
    itemDescription: 'Iced latte, less sugar',
    pickup: { supplierId: 'preview-3', supplierName: 'Campus Café', building: 'Frontier', floor: '1' },
    deliveryLocation: 'Science Library, Study Area',
    creditAmount: 4,
    acceptanceDeadline: null,
    requester: previewRequester,
    courier: previewCourier,
    createdAt: '2026-10-14T09:00:00+08:00',
    updatedAt: '2026-10-14T09:40:00+08:00',
  },
  {
    id: '3f1c9a20-0004-4a00-8000-000000000004',
    status: 'COMPLETED',
    itemDescription: 'Stationery: two A4 notebooks',
    pickup: { supplierId: 'preview-4', supplierName: 'Co-op', building: 'Yusof Ishak House', floor: '1' },
    deliveryLocation: 'Engineering Block E4, Level 5',
    creditAmount: 6,
    acceptanceDeadline: null,
    requester: previewRequester,
    courier: previewCourier,
    createdAt: '2026-10-10T11:00:00+08:00',
    updatedAt: '2026-10-10T12:10:00+08:00',
  },
  {
    id: '3f1c9a20-0005-4a00-8000-000000000005',
    status: 'CANCELLED',
    itemDescription: 'Bubble tea, 50% sugar',
    pickup: { supplierId: 'preview-5', supplierName: 'Tea Bar', building: 'Town Plaza', floor: '1' },
    deliveryLocation: 'Arts Faculty, AS7',
    creditAmount: 3,
    acceptanceDeadline: null,
    requester: previewRequester,
    courier: null,
    createdAt: '2026-10-09T14:00:00+08:00',
    updatedAt: '2026-10-09T14:05:00+08:00',
  },
  {
    id: '3f1c9a20-0006-4a00-8000-000000000006',
    status: 'EXPIRED',
    itemDescription: 'Nasi lemak with fried egg',
    pickup: { supplierId: 'preview-6', supplierName: 'The Deck', building: 'Arts Canteen', floor: '1' },
    deliveryLocation: 'Business School, BIZ1',
    creditAmount: 5,
    acceptanceDeadline: '2026-10-08T12:00:00+08:00',
    requester: previewRequester,
    courier: null,
    createdAt: '2026-10-08T10:30:00+08:00',
    updatedAt: '2026-10-08T12:00:00+08:00',
  },
  // Extra preview rows so Active/Past pagination (6 per page) is visible in the UI.
  ...Array.from({ length: 5 }, (_, index) => {
    const n = index + 7
    return {
      id: `3f1c9a20-000${n}-4a00-8000-00000000000${n}`,
      status: 'OPEN' as const,
      itemDescription: `Extra open request ${n}`,
      pickup: {
        supplierId: `preview-${n}`,
        supplierName: `Preview Store ${n}`,
        building: 'Town Plaza',
        floor: '2',
      },
      deliveryLocation: `COM1, Room ${100 + n}`,
      creditAmount: 2 + (n % 4),
      acceptanceDeadline: null,
      requester: previewRequester,
      courier: null,
      createdAt: '2026-10-15T11:00:00+08:00',
      updatedAt: '2026-10-15T11:00:00+08:00',
    }
  }),
  ...Array.from({ length: 5 }, (_, index) => {
    const n = index + 12
    return {
      id: `3f1c9a20-00${n}-4a00-8000-0000000000${n}`,
      status: 'COMPLETED' as const,
      itemDescription: `Extra completed request ${n}`,
      pickup: {
        supplierId: `preview-${n}`,
        supplierName: `Preview Store ${n}`,
        building: 'UTown',
        floor: '1',
      },
      deliveryLocation: `E4, Room ${200 + n}`,
      creditAmount: 3 + (n % 3),
      acceptanceDeadline: null,
      requester: previewRequester,
      courier: previewCourier,
      createdAt: '2026-10-05T11:00:00+08:00',
      updatedAt: '2026-10-05T12:00:00+08:00',
    }
  }),
]

// In development only, `?preview=loading|empty|error` forces a view state.
function getPreviewMode(): string | null {
  if (!import.meta.env.DEV) return null
  return new URLSearchParams(window.location.search).get('preview')
}

function simulateLatency<T>(value: T): Promise<T> {
  const mode = getPreviewMode()
  if (mode === 'loading') return new Promise<T>(() => {})
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mode === 'error') reject(new Error('Preview error: orders could not be loaded.'))
      else resolve(value)
    }, 400)
  })
}

// ---- API functions (replace bodies during integration) --------------------

// Integration: GET /orders?role=requester (or the agreed endpoint)
export async function fetchMyRequests(): Promise<Order[]> {
  const orders = getPreviewMode() === 'empty' ? [] : previewOrders
  return simulateLatency(orders)
}

// Integration: GET /orders/:orderId
export async function fetchOrderById(orderId: string): Promise<Order> {
  const order = previewOrders.find((item) => item.id === orderId)
  const result = await simulateLatency(order)
  if (!result) throw new NotFoundError('Not Found')
  return result
}

// Integration: the agreed cancel endpoint, e.g. POST /orders/:orderId/cancel
export async function cancelOrder(orderId: string): Promise<Order> {
  void orderId
  throw new Error(NOT_CONNECTED_MESSAGE)
}

// Integration: the agreed confirm endpoint, e.g. POST /orders/:orderId/confirm-delivery
export async function confirmDelivery(orderId: string): Promise<Order> {
  void orderId
  throw new Error(NOT_CONNECTED_MESSAGE)
}

export function isOrderApiConnected(): boolean {
  return false
}
