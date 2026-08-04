import type { Account } from "./Account";
import type { Category } from "./Category";
import type { Tag } from "./Tag";

export interface Transaction {
  transactionId?: number;
  timestamp: Date;
  amount: number;
  currency: string;
  merchant?: string;
  isPending: boolean;
  note?: string;

  categoryId?: number;
  accountId: number;

  category?: Category;
  account?: Account;

  tags?: Tag[];
}