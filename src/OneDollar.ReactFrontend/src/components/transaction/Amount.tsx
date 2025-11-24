interface AmountProps {
  amount: string;
  isExpenseCategory?: boolean;
}

export default function Amount({ amount, isExpenseCategory }: AmountProps) {
  const prefix = isExpenseCategory === undefined ? "" : (isExpenseCategory ? "- " : "+ ");

  return(
    <div className="text-center my-20">
      <span className="text-5xl font-bold">{prefix}{ amount } €</span>
    </div>
  )
}