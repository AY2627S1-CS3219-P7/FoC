// TEMPORARY: Credit Service API is not connected yet.
// Replace function bodies with `request('/credit/...')` during integration.
// Teammate skeleton (unmerged) outlines wallet + tx routes; do not invent
// production endpoint contracts here beyond these view helpers.

import type { CreditActivityItem, CreditWallet } from '../credits/creditTypes'

const NOT_CONNECTED_MESSAGE = 'Credit Service is not connected yet.'

// ---- Preview data (remove during integration) ----------------------------

const previewWallet: CreditWallet = {
  userId: 'preview-user',
  totalCredits: 42,
  availableCredits: 30,
  reservedCredits: 12,
  updatedAt: '2026-10-15T16:00:00+08:00',
}

const previewActivity: CreditActivityItem[] = [
  {
    id: 'tx-0006',
    operationType: 'TRANSFER',
    amount: 4,
    signedAmount: 4,
    orderId: '3f1c9a20-0003-4a00-8000-000000000003',
    description: 'Earned credits after successful delivery.',
    status: 'completed',
    createdAt: '2026-10-14T10:05:00+08:00',
  },
  {
    id: 'tx-0005',
    operationType: 'RELEASE',
    amount: 3,
    signedAmount: 3,
    orderId: '3f1c9a20-0005-4a00-8000-000000000005',
    description: 'Reserved credits returned after cancellation.',
    status: 'completed',
    createdAt: '2026-10-09T14:06:00+08:00',
  },
  {
    id: 'tx-0004',
    operationType: 'RESERVE',
    amount: 5,
    signedAmount: -5,
    orderId: '3f1c9a20-0001-4a00-8000-000000000001',
    description: 'Credits reserved for an open order.',
    status: 'completed',
    createdAt: '2026-10-15T10:00:00+08:00',
  },
  {
    id: 'tx-0003',
    operationType: 'RESERVE',
    amount: 4,
    signedAmount: -4,
    orderId: '3f1c9a20-0003-4a00-8000-000000000003',
    description: 'Credits reserved for pickup and delivery.',
    status: 'completed',
    createdAt: '2026-10-14T09:00:00+08:00',
  },
  {
    id: 'tx-0002',
    operationType: 'RELEASE',
    amount: 5,
    signedAmount: 5,
    orderId: '3f1c9a20-0006-4a00-8000-000000000006',
    description: 'Reserved credits returned after the order expired.',
    status: 'completed',
    createdAt: '2026-10-08T12:01:00+08:00',
  },
  {
    id: 'tx-0001',
    operationType: 'INITIAL_ALLOCATION',
    amount: 50,
    signedAmount: 50,
    orderId: null,
    description: 'Starting credits allocated when the account was created.',
    status: 'completed',
    createdAt: '2026-10-01T09:00:00+08:00',
  },
]

function getPreviewMode(): string | null {
  if (!import.meta.env.DEV) return null
  return new URLSearchParams(window.location.search).get('preview')
}

function simulateLatency<T>(value: T): Promise<T> {
  const mode = getPreviewMode()
  if (mode === 'loading') return new Promise<T>(() => {})
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mode === 'error') {
        reject(new Error('Preview error: credits could not be loaded.'))
      } else {
        resolve(value)
      }
    }, 400)
  })
}

// ---- API helpers (replace bodies during integration) ---------------------

// Integration: GET wallet for the logged-in user (e.g. /credit/wallet/:userId)
export async function fetchMyWallet(): Promise<CreditWallet> {
  return simulateLatency(previewWallet)
}

// Integration: GET recent transactions (e.g. /credit/tx/:userId)
export async function fetchMyCreditActivity(): Promise<CreditActivityItem[]> {
  const items = getPreviewMode() === 'empty' ? [] : previewActivity
  return simulateLatency(items)
}

export function isCreditApiConnected(): boolean {
  return false
}

export function getCreditNotConnectedMessage(): string {
  return NOT_CONNECTED_MESSAGE
}
