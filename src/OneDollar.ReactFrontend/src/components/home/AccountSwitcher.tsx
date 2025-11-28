import ErrorAlert from "../shared/alerts/ErrorAlert";
import { useAccounts } from "@/api/hooks/useAccounts";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";

interface AccountSwitcherProps {
  onAccountChange: (accountId: number) => void;
  selectedAccountId: number | null;
}

export default function AccountSwitcher({ onAccountChange, selectedAccountId }: AccountSwitcherProps) {
  const { accounts } = useAccounts();

  return (
    <div className="header flex justify-center">
      {
        accounts.isPending ? (<p className="dbg">Loading...</p>) :
        accounts.isError ? (<ErrorAlert error={accounts.error} />) :
        (
          <Select value={selectedAccountId?.toString()} onValueChange={(val) => onAccountChange(Number(val))}>
            <SelectTrigger className="border-0 shadow-none focus-visible:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {accounts.data.map((acc) => (
                  <SelectItem className="cursor-pointer"
                    value={acc.accountId!.toString()} key={acc.accountId}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )
      }
    </div>
  )
}