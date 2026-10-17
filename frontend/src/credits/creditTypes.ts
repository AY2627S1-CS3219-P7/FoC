// TEMPORARY credit model for frontend views until the Credit Service API
// contract is finalized. Align field names with Credit Service during
// integration (teammate branch currently uses available_credits /
// reserved_credits). Do not treat any frontend-derived figures as truth.

export type CreditOperationType =
  | 'INITIAL_ALLOCATION'
  | 'RESERVE'
  | 'RELEASE'
  | 'TRANSFER'

export interface CreditWallet {
  userId: string
  /** Total credits on the account, as reported by Credit Service. */
  totalCredits: number
  /** Credits free to spend on new orders. */
  availableCredits: number
  /** Credits held for open / accepted orders. */
  reservedCredits: number
  updatedAt: string
}

export interface CreditActivityItem {
  id: string
  operationType: CreditOperationType
  amount: number
  /** Positive = credits added to this wallet; negative = credits removed/held. */
  signedAmount: number
  orderId: string | null
  description: string
  status: 'completed' | 'pending' | 'failed'
  createdAt: string
}

export const creditOperationDisplay: Record<
  CreditOperationType,
  { label: string; color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'info' }
> = {
  INITIAL_ALLOCATION: { label: 'Initial allocation', color: 'success' },
  RESERVE: { label: 'Reserved for order', color: 'warning' },
  RELEASE: { label: 'Released', color: 'info' },
  TRANSFER: { label: 'Transfer / earning', color: 'primary' },
}

export function formatCreditAmount(amount: number): string {
  return `${amount} ${amount === 1 ? 'credit' : 'credits'}`
}

export function formatOrderRef(orderId: string | null): string {
  if (!orderId) return '—'
  return `#${orderId.slice(0, 8).toUpperCase()}`
}
