interface BalanceProps {
  amount: number;
}

export default function Balance({ amount }: BalanceProps) {
  const humandReadableAmount = amount.toString().replace(".", ",");

  return(
    <div className="text-center my-20">
      <span className="text-5xl font-bold">{ humandReadableAmount } €</span>
    </div>
  )
}