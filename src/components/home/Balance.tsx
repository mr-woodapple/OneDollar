export default function Balance() {
  const amount = 17.88;
  const humandReadableAmount = amount.toString().replace(".", ",");

  return(
    <div className="text-center my-20">
      <span className="text-5xl font-bold">{ humandReadableAmount } €</span>
    </div>
  )
}