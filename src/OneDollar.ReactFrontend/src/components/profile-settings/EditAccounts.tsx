import { Trash, X } from "lucide-react";
import { Button } from "../ui/button";
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia } from "../ui/item";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

import { useAccounts } from "@/hooks/useAccounts";
import ErrorAlert from "../shared/alerts/ErrorAlert";
import AddAccount from "./AddAccount";
import EmptyAccounts from "../shared/empty/EmptyAccounts";

interface EditAccountsProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditAccounts({ isOpen, onOpenChange }: EditAccountsProps) {
  const { accounts, fetching, loading, error, addAccount, deleteAccount } = useAccounts();

  async function handleDelete(accountId?: number) {
    if (accountId == null) { return; }

    await deleteAccount(accountId);
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

        <div className="drawer-content mb-1">
          {error && <ErrorAlert errorMessage={error} />}
          {accounts && !error &&
            <>
              <AddAccount 
                addAccount={addAccount} 
                loading={loading} 
                error={error} />

              {accounts.length === 0 && <EmptyAccounts />}
              {accounts &&
                <div className="overflow-y-auto">
                  <ItemGroup className="bg-neutral-100 rounded-xl my-5">
                    {accounts.map((account) => (
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
              }
            </>
          }
        </div>
      </DrawerContent>
    </Drawer >
  )
}