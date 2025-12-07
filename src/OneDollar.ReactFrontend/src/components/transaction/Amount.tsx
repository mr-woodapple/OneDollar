import { useEffect, useState } from "react";

interface AmountProps {
  amount: string;
  isExpenseCategory?: boolean;
}

export default function Amount({ amount, isExpenseCategory }: AmountProps) {
  const [prefix, setPrefix] = useState<string>();

  useEffect(() => {
    if (isExpenseCategory) {
      isExpenseCategory ? setPrefix("- ") : setPrefix("+ ");
    } else if (Number(amount) != 0) {
      Number(amount) < 0 ? setPrefix("- ") : setPrefix("+ ");
    }
  }, [isExpenseCategory])

  // const prefix = isExpenseCategory === undefined ? "" : (isExpenseCategory ? "- " : "+ ");

  return(
    <div className="text-center my-20">
      <span className="text-5xl font-bold">{prefix}{ amount } €</span>
    </div>
  )
}