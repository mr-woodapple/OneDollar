import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";
import type { Account } from "@/models/Account";

interface AccountSwitcherProps {
  onAccountChange: (accountId: number) => void;
  selectedAccountId: number | null;
  accounts: Account[] | null;
  fetching: boolean;
  error: string | null;
}

export default function AccountSwitcher({ onAccountChange, selectedAccountId, accounts, fetching, error }: AccountSwitcherProps) {

  return (
    <div className="header flex justify-center">
      {!error && !fetching && accounts && accounts.length > 0 &&
        <Select value={selectedAccountId?.toString()} onValueChange={(val) => onAccountChange(Number(val))}>
          <SelectTrigger className="border-0 shadow-none focus-visible:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {accounts.map((acc) => (
                <SelectItem className="cursor-pointer"
                  value={acc.accountId!.toString()} key={acc.accountId}>
                  {acc.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      }

      {/* TODO: Add skeleton loading animation */}
      {/* {!error && fetching && <p>Fetching...</p>} */}
    </div>
  )
}