import { useState, useEffect } from "react"
import { toast } from "sonner"
import { CalendarClock, Euro, Minus, Plus, Store, Trash, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader } from "@/components/ui/drawer"

import NumPad from "@/components/transactions/addTransaction/NumPad"
import SelectCategory from "@/components/transactions/addTransaction/SelectCategory"
import SelectAccount from "@/components/transactions/addTransaction/SelectAccount"
import type { Account } from "@/models/Account"
import type { Category } from "@/models/Category"
import type { Transaction } from "@/models/Transaction"
import { useTransactions } from "@/api/hooks/useTransactions"
import { useCategories } from "@/api/hooks/useCategories"
import { useAccounts } from "@/api/hooks/useAccounts"
import { Label } from "@/components/ui/label"

interface AddTransactionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
}

export default function AddTransaction({ isOpen, onOpenChange, transaction }: AddTransactionProps) {
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { categories } = useCategories();
  const { accounts } = useAccounts();

  const [note, setNote] = useState<string>();
  const [amount, setAmount] = useState<string>("0");
  const [timestamp, setTimestamp] = useState<Date>(new Date());
  const [isExpense, setIsExpense] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedAccount, setSelectedAccount] = useState<Account>();

  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        // Edit mode: populate fields
        setNote(transaction.note);
        setIsExpense(transaction.amount < 0);
        setTimestamp(new Date(transaction.timestamp));
        setAmount(Math.abs(transaction.amount).toFixed(2).toString().replace(".", ","));
        setSelectedCategory(categories.data?.find((category: Category) => category.categoryId === transaction.categoryId));
        setSelectedAccount(accounts.data?.find((account: Account) => account.accountId === transaction.accountId));
      } else {
        // Add mode: reset fields
        setNote(undefined);
        setAmount("0");
        setSelectedCategory(undefined);
        setSelectedAccount(undefined);
      }
    }
  }, [isOpen, transaction]);

  useEffect(() => {
    if (selectedCategory) {
      setIsExpense(selectedCategory.isExpenseCategory)
    }
  }, [selectedCategory])

  // Handle button presses from the keypad
  function handleNumpadInput(token: string) {
    let tempAmount = amount;
    let hasDecimal = tempAmount.includes(",");
    let hasMoreThanTwoDecimals = tempAmount.includes(",") && tempAmount.split(",")[1].length >= 2;

    if (token === "backspace") {
      // remove last number from string using isDecimalSet
      if (tempAmount.length === 1) {
        tempAmount = "0"
      } else {
        tempAmount = tempAmount.slice(0, -1);
      }

    } else if (token === "decimal") {
      // Handle decimal seperator, but only if not already set
      if (!hasDecimal) {
        tempAmount += ",";
      }

    } else {
      // Should be a number by now, add that to the end of the string
      if (hasMoreThanTwoDecimals) { return; }

      // Handle removing 0 before any other number
      if (tempAmount === "0") { tempAmount = "" }

      tempAmount += token;
    }

    setAmount(tempAmount)
  }

  async function handleSaveOrUpdate(isUpdate: boolean) {
    if (!selectedAccount) {
      toast.warning("Please select an account!")
      return;
    }

    let finalAmount = Number(amount.replace(",", ".")) || 0;
    finalAmount = isExpense ? -Math.abs(finalAmount) : Math.abs(finalAmount);

    const t: Transaction = {
      transactionId: transaction?.transactionId ?? undefined,
      timestamp: transaction?.timestamp ?? new Date,
      categoryId: selectedCategory?.categoryId,
      accountId: selectedAccount.accountId!,
      amount: finalAmount,
      currency: "EUR",
      note: note,
      merchant: transaction?.merchant ?? undefined,
      isPending: transaction?.isPending ?? false
    };

    isUpdate
      ? await updateTransaction.mutateAsync({ id: transaction!.transactionId!, data: t })
      : await addTransaction.mutateAsync(t);

    if (isUpdate ? (updateTransaction.error == null) : (addTransaction.error == null)) {
      onOpenChange(false);
      setAmount("0");
      setIsExpense(true);
      setSelectedAccount(undefined);
      setSelectedCategory(undefined);
    };
  }

  async function handleDelete(id?: number) {
    if (!id) { return; }

    await deleteTransaction.mutateAsync(id);
    if (deleteTransaction.error == null) {
      onOpenChange(false);
    };
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="px-5">
        <DrawerHeader>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2.5">
              <Button disabled
                size="sm" 
                variant="secondary">
                  <CalendarClock /> {timestamp.toLocaleString("en-GB", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "numeric" })}
              </Button>

              <Button disabled
                size="sm"
                variant="secondary">
                <Euro />
              </Button>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="drawer-content mb-1 apple-safe-area">
          <div className="text-center mt-15 mb-20">
            <Badge variant="secondary">
              <Store /> 
              {transaction?.merchant}
            </Badge>

            <div className="flex flex-row justify-center items-center mt-2.5">
              <Button variant="ghost" className="rounded-full w-auto h-auto" onClick={() => setIsExpense(!isExpense)}>
                {isExpense ? <Minus className="size-8 stroke-3" /> : <Plus className="size-8 stroke-3" />}     
              </Button>  
              <span className="ml-2 text-5xl font-bold">{ amount } €</span>
            </div>
          </div>
          
          <Label htmlFor="input-addtransaction-note">Note</Label>
          <Input 
            className="mt-2"
            id="input-addtransaction-note"
            type="text" 
            placeholder="Add a note..." 
            value={note} 
            onChange={(e) => setNote(e.target.value)} />

          <div className="grid grid-cols-2 gap-2.5 my-4">
            <SelectCategory
              isExpense={isExpense}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory} />
            <SelectAccount
              selectedAccount={selectedAccount}
              onSelectAccount={setSelectedAccount} />
          </div>

          <NumPad handleNumpadInput={handleNumpadInput} />

          <div className="flex flex-row w-full gap-x-2.5 mt-4">
            {!transaction &&
              <Button
                onClick={() => handleSaveOrUpdate(false)} disabled={addTransaction.isPending} className="grow h-12">
                {addTransaction.isPending && <Spinner />}
                {addTransaction.isPending ? "Creating" : "Create"}
              </Button>
            }

            {transaction &&
              <>
                <Button
                  onClick={() => handleSaveOrUpdate(true)} disabled={updateTransaction.isPending} className="grow h-12">
                  {updateTransaction.isPending && <Spinner />}
                  {updateTransaction.isPending ? "Updating" : "Update"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(transaction.transactionId)} disabled={deleteTransaction.isPending} className="h-12 w-12">
                  {deleteTransaction.isPending ? <Spinner /> : <Trash />}
                </Button>
              </>
            }
          </div>
        </div>
      </DrawerContent>
    </Drawer >
  )
}
