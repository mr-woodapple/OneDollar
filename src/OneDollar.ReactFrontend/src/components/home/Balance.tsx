import { useAccounts } from "@/api/hooks/useAccounts";

interface BalanceProps {
  selectedAccountId: number;
}

export default function Balance({ selectedAccountId }: BalanceProps) {
  const { accountBalance } = useAccounts();

  const humandReadableAmount = accountBalance(selectedAccountId).toString().replace(".", ",");

  return(
    <div className="text-center my-20">
      <span className="text-5xl font-bold">{ humandReadableAmount } €</span>
    </div>
  )
}