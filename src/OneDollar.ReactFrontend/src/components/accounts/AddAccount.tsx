import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";

import type { Account } from "@/models/Account";
import { useAccounts } from "@/api/hooks/useAccounts";

export default function AddAccount() {
  const { addAccount } = useAccounts();
  const [open, setOpen] = useState<boolean>(false);
  const [accountName, setAccountName] = useState<string>();
  const [accountBalance, setAccountBalance] = useState<number>();

  async function handleCreate() {
    const account: Account =  { name: accountName || "", balance: accountBalance || 0 };
    await addAccount.mutateAsync(account)

    if (addAccount.error == null) { setOpen(false) };
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="w-full">
        <div className="flex flex-row justify-center mt-2 p-2 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer">
          <span><Plus className="text-neutral-500 me-2" /></span>
          <span className="font-medium text-neutral-500">Add Account</span>
        </div>
      </DrawerTrigger>

      <DrawerContent className="apple-safe-area">
        <DrawerHeader>
          <div className="flex flex-row justify-between items-center">
            <DrawerTitle>Create Account</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

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

        <DrawerFooter className="mt-10">
          <Button onClick={() => handleCreate()} disabled={addAccount.isPending}>
            {addAccount.isPending && <Spinner />}
            {addAccount.isPending ? "Creating" : "Create"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}