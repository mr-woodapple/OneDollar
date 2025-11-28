import { Trash, X } from "lucide-react";
import { Button } from "../ui/button";
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia } from "../ui/item";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

import { useAccounts } from "@/api/hooks/useAccounts";
import ErrorAlert from "../shared/alerts/ErrorAlert";
import AddAccount from "./AddAccount";
import EmptyAccounts from "../shared/empty/EmptyAccounts";

interface EditAccountsProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditAccounts({ isOpen, onOpenChange }: EditAccountsProps) {
  const { accounts, deleteAccount } = useAccounts();

  async function handleDelete(accountId?: number) {
    if (accountId == null) { return; }

    await deleteAccount.mutateAsync(accountId);
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="px-5">
        <DrawerHeader>
          <div className="flex flex-row justify-between items-center">
            <DrawerTitle>Edit Accounts</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="apple-safe-area drawer-content mb-1">
          {
            accounts.isPending ? (<p className="dbg">Loading...</p>) :
            accounts.isError ? (<ErrorAlert error={accounts.error} />) :
            accounts.data.length === 0 ? (<EmptyAccounts />) :
            (
              <>
                <AddAccount />

                <div className="overflow-y-auto">
                  <ItemGroup className="bg-neutral-100 rounded-xl my-5">
                    {accounts.data.map((account) => (
                      <Item key={account.accountId}>
                        <ItemMedia>
                          <span>💳</span>
                        </ItemMedia>
                        <ItemContent>
                          <span>{account.name}</span>
                        </ItemContent>

                        <ItemActions>
                          {/* TODO: Implement functionality */}
                          {/* <Button variant="ghost" size="sm">
                                <Pencil />
                              </Button> */}
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(account.accountId)}>
                            <Trash />
                          </Button>
                        </ItemActions>
                      </Item>
                    ))}
                  </ItemGroup>
                </div>
              </>
            )
          }
        </div>
      </DrawerContent>
    </Drawer >
  )
}