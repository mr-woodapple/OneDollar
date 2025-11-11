import type { Account } from "./Account";
import type { Category } from "./Category";

export interface Transaction {
  id: number;
  timestamp: string;
  category: Category;
  account: Account;
  amount: number;
  currency: string;
}