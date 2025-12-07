import type { Transaction } from "@/models/Transaction";
import { useEffect, useState } from "react";

interface AmountProps {
  amount: string;
  transaction?: Transaction;
  isExpenseCategory?: boolean;
}

export default function Amount({ amount, transaction, isExpenseCategory }: AmountProps) {
  const [prefix, setPrefix] = useState<string>();

  useEffect(() => {
    if (isExpenseCategory) {
      isExpenseCategory ? setPrefix("- ") : setPrefix("+ ");
    } else if (transaction) {
      transaction.amount < 0 ? setPrefix("- ") : setPrefix("+ ");
    }
  }, [isExpenseCategory])

  // const prefix = isExpenseCategory === undefined ? "" : (isExpenseCategory ? "- " : "+ ");

  return(
    <div className="text-center my-20">
      <span className="text-5xl font-bold">{prefix}{ amount } €</span>
    </div>
  )
}