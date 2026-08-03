import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Drawer, DrawerContent, DrawerHeading } from "../shared/GenericDrawer";

import type { Account } from "@/models/Account";
import { useAccounts } from "@/api/hooks/useAccounts";

interface EditAccountProps {
  account?: Account;
  isAddMode: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditAccount({ account, isAddMode, isOpen, onOpenChange }: EditAccountProps) {
  const { addAccount, updateAccount } = useAccounts();
  const [accountName, setAccountName] = useState<string>();
  const [accountBalance, setAccountBalance] = useState<number>();

  useEffect(() => {
    if (!isOpen) { return; }

    if (isAddMode) {
      setAccountName("");
      setAccountBalance(0);
      return;
    }

    setAccountName(account?.name ?? "");
    setAccountBalance(account?.balance ?? 0);
  }, [isOpen, isAddMode, account])

  async function handleSave() {
    const a: Account = {
      name: accountName || "",
      balance: accountBalance || 0,
      status: account?.status ?? "ACTIVE"
    };

    account 
      ? await updateAccount.mutateAsync({ id: account!.accountId!, data: a})
      : await addAccount.mutateAsync(a)

    if (account ? updateAccount.error == null : addAccount.error == null) { 
      onOpenChange(false); 
    };
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeading>
          <h2 className="font-semibold">{isAddMode ? "Create account" : "Update account"}</h2>
        </DrawerHeading>
        <div className="px-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              placeholder="VisaCard, Savings, ..." value={accountName}
              onChange={(e) => setAccountName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountBalance">Account Balance (in €)</Label>
            <Input
              id="accountBalance"
              placeholder="2500, or more?" value={accountBalance}
              onChange={(e) => setAccountBalance(Number(e.target.value))} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 p-4">
          <Button onClick={() => handleSave()} disabled={addAccount.isPending}>
            {addAccount.isPending && <Spinner />}
            {addAccount.isPending ? (isAddMode ? "Creating" : "Updating") : (isAddMode ? "Create" : "Update")}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
