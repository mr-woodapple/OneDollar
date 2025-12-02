import { useAccounts } from "@/api/hooks/useAccounts";

interface BalanceProps {
  selectedAccountId: number;
}

export default function Balance({ selectedAccountId }: BalanceProps) {
  const { accountBalance } = useAccounts();
  
  const humandReadableBalance = accountBalance(selectedAccountId).toFixed(2).toString().replace(".", ",");

  return(
    <div className="text-center my-20">
      <span className="text-5xl font-bold">{ humandReadableBalance } €</span>
    </div>
  )
}