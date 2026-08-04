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
  isTransfer: boolean;
  note?: string;

  categoryId?: number | null;
  accountId: number;
  destinationAccountId?: number | null;

  category?: Category;
  account?: Account;
  destinationAccount?: Account;

  tags?: Tag[];
}