import ErrorAlert from "../shared/alerts/ErrorAlert";
import { useAccounts } from "@/api/hooks/useAccounts";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface AccountSwitcherProps {
  onAccountChange: (accountId: number) => void;
  selectedAccountId: number | null;
}

export default function AccountSwitcher({ onAccountChange, selectedAccountId }: AccountSwitcherProps) {
  const { accounts } = useAccounts();
  const selectedAccountName = accounts.data?.find((account) => account.accountId === selectedAccountId)?.name;

  return (
    <div className="header flex w-full justify-center">
      {
        accounts.isPending ? (<Skeleton className="h-8 w-42" />) :
        accounts.isError ? (<ErrorAlert error={accounts.error} />) :
        (
          <Select
            disabled={accounts.data.length === 0}
            value={selectedAccountId?.toString()}
            onValueChange={(val) => onAccountChange(Number(val))}
          >
            <SelectTrigger
              className="w-fit max-w-64 min-w-0 border-0 shadow-none focus-visible:ring-0"
              title={selectedAccountName}>
              <SelectValue
                className="min-w-0 max-w-52 truncate text-center"
                placeholder="Create an account first." />
            </SelectTrigger>
            <SelectContent className="max-w-64">
              {accounts.data.map((acc) => (
                <SelectItem 
                  className="cursor-pointer overflow-hidden [&>span:last-child]:min-w-0 [&>span:last-child]:overflow-hidden"
                  title={acc.name}
                  value={acc.accountId!.toString()} key={acc.accountId}
                >
                  <span className="block truncate">{acc.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }
    </div>
  )
}