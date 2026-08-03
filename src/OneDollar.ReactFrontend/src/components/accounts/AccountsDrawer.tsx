import { useEffect, useRef, useState } from "react";
import { Pen, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia } from "../ui/item";
import { Drawer, DrawerContent, DrawerHeading } from "../shared/GenericDrawer";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia } from "@/components/ui/item";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { Account } from "@/models/Account";
import { useAccounts } from "@/api/hooks/useAccounts";
import EditAccount from "./EditAccount";
import ErrorAlert from "../shared/alerts/ErrorAlert";
import EmptyAccounts from "../shared/empty/EmptyAccounts";
import GenericDialog, { type GenericDialogHandle } from "../shared/GenericDialog";

interface AccountsDrawerProps {
  useSelectionMode?: boolean;
  showAddButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectAccount?: (account: Account) => void;
}

/**
 * Drawer component for accounts. Needs to be opened or closed from outside 
 * by controlling the "isOpen" state of this component.
 * Can be used for managing and/or just selecting accounts (for example when editing a transaction).
 * 
 * @param useSelectionMode If true, a account can be selected (and after selecting the drawer closes).
 * @param showAddButton If true, a full-width "add account" button is shown above the accounts list.
 * @param showEditButton If true, an edit button is shown for each account.
 * @param showDeleteButton If true, a delete button is shown for each account.
 * @param isOpen If true, the drawer is visible.
 * @param onOpenChange Called if the open state of the drawer should be changed.
 * @param onSelectAccount Called if the selected account changes.
 * @returns Drawer component to select, list, edit and delete accounts.
 */
export default function AccountsDrawer({
  useSelectionMode,
  showAddButton,
  showEditButton,
  showDeleteButton,
  isOpen,
  onOpenChange,
  onSelectAccount
}: AccountsDrawerProps) {
  const { accounts, deleteAccount } = useAccounts();

  const [isAddAccount, setIsAddAccount] = useState(true);
  const [editAccountDrawerState, setEditAccountDrawerState] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(undefined);
  const [transactionAccounts, setTransactionAccounts] = useState<Account[]>();
  const deleteDialogRef = useRef<GenericDialogHandle>(null);

  useEffect(() => {
    if (!accounts.isPending && !accounts.isError) {
      setTransactionAccounts(accounts.data)
    }
  }, [accounts.data])

  // Only handle selecting a account, if selectionMode is active
  async function handleSelect(account: Account) {
    if (useSelectionMode && onSelectAccount) {
      onSelectAccount(account);
      onOpenChange(false);
    }
  }

  // Handle deleting accounts
  async function handleDelete(accountId?: number) {
    if (accountId == null) { return; }

    const confirmed = await deleteDialogRef.current?.openDialog();
    if (!confirmed) { return; }

    await deleteAccount.mutateAsync(accountId);
  }

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeading>
            <h2 className="font-semibold">Accounts</h2>
          </DrawerHeading>
          <div className="drawer-content mb-1 flex max-h-[70vh] flex-col px-5">
            {
              accounts.isPending ? (<AccountsListSkeleton />) :
              accounts.isError ? (<ErrorAlert error={accounts.error} />) :
              (
                <>
                  { showAddButton && 
                    <Button onClick={() => {
                      setEditAccountDrawerState(true);
                      setIsAddAccount(true);
                      setSelectedAccount(undefined);
                    }}>
                      Add Account
                    </Button>
                  }

                  { transactionAccounts?.length === 0 && <EmptyAccounts />}

                  { transactionAccounts &&
                    <div className="overflow-y-auto">
                      <ItemGroup className="bg-neutral-100 rounded-xl my-5">
                        {accounts.data.map((account) => (
                          <Item 
                            key={account.accountId}
                            onClick={() => handleSelect(account)}
                            className={useSelectionMode ? "cursor-pointer" : undefined}>
                            <ItemMedia>
                              <span>💳</span>
                            </ItemMedia>
                            <ItemContent>
                              <span>{account.name}</span>
                            </ItemContent>

                            <ItemActions>
                              { showEditButton &&
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditAccountDrawerState(true);
                                    setIsAddAccount(false);
                                    setSelectedAccount(account);
                                  }}>
                                  <Pen />
                                </Button>
                              }

                              { showDeleteButton &&
                                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(account.accountId)}>
                                  <Trash />
                                </Button>
                              }
                            </ItemActions>
                          </Item>
                        ))}
                      </ItemGroup>
                    </div>
                  }
                </>
              )
            }
          </div>
        </DrawerContent>
      </Drawer>

      <GenericDialog 
        ref={deleteDialogRef}
        title="Delete account" 
        content="This action cannot be undone. The selected account will be permanently deleted."
        buttonCancel="Cancel"
        buttonConfirm="Delete"
        buttonConfirmDestructive />

      <EditAccount
        account={selectedAccount}
        isAddMode={isAddAccount}
        isOpen={editAccountDrawerState}
        onOpenChange={setEditAccountDrawerState}
      />
    </>
  )
}

/**
 * Simple component to render a skeleton list.
 * @returns A skeleton, represeting the list loading.
 */
function AccountsListSkeleton() {
   return (
    <div className="flex flex-col gap-2 my-5">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}
