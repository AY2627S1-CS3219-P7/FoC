export interface Wallet {
  user_id: string;
  available_credits: number;
  reserved_credits: number;
}

export interface TransactionRecord {
  user_id: string;
  order_id: string;
  type: string;
  amount: number;
}
