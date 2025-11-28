import { X } from "lucide-react"
import { Button } from "../ui/button"
import { Item, ItemGroup } from "../ui/item"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"

import type { Account } from "@/models/Account.ts"
import { useAccounts } from "@/api/hooks/useAccounts"
import EmptyAccounts from "../shared/empty/EmptyAccounts"
import ErrorAlert from "../shared/alerts/ErrorAlert"

interface SelectAccountProps {
  selectedAccount?: Account;
  onSelectAccount: (account: Account) => void;
}

export default function SelectAccount({ selectedAccount, onSelectAccount }: SelectAccountProps) {
  const { accounts } = useAccounts();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="w-full h-12 grid place-items-center cursor-pointer">
          {selectedAccount?.name
            ? <div className="space-x-2.5">
              <span>💳</span>
              <span>{selectedAccount.name}</span>
            </div>
            : <span className="underline underline-offset-5">Select Account</span>}
        </div>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <div className="flex flex-row justify-between items-center">
            <DrawerTitle>Select Account</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {
          accounts.isPending ? (<p className="dbg">Loading...</p>) :
          accounts.isError ? (<ErrorAlert error={accounts.error} />) :
          accounts.data.length === 0 ? (<EmptyAccounts />) :
          (
            <ItemGroup className="bg-neutral-100 rounded-xl m-5 cursor-pointer">
              {accounts.data.map((account) => (
                <DrawerClose asChild key={account.accountId}>
                  <Item onClick={() => onSelectAccount(account)} className="hover:bg-neutral-200">
                    <span>💳</span>
                    <span>{account.name}</span>
                  </Item>
                </DrawerClose>
              ))}
            </ItemGroup>
          )
        }
      </DrawerContent>
    </Drawer>
  )
}