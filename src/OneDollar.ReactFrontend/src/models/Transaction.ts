import type { Account } from "./Account";
import type { Category } from "./Category";

export interface Transaction {
  transactionId?: number;
  timestamp: Date;
  amount: number;
  currency: string;
  note?: string;

  categoryId: number;
  accountId: number;

  category?: Category;
  account?: Account;
}