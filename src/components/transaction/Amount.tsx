interface AmountProps {
  amount: string;
}

export default function Amount({ amount }: AmountProps) {

  return(
    <div className="text-center my-20">
      <span className="text-5xl font-bold">{ amount } €</span>
    </div>
  )
}