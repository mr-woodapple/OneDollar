import { useState, useEffect } from "react"
import { toast } from "sonner"
import { CalendarClock, Euro, Minus, Plus, Store, Trash, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

import NumPad from "@/components/transactions/NumPad"
import CategoriesDrawer from "@/components/categories/CategoriesDrawer"
import AccountsDrawer from "@/components/accounts/AccountsDrawer"
import { useTransactions } from "@/api/hooks/useTransactions"
import { useCategories } from "@/api/hooks/useCategories"
import { useAccounts } from "@/api/hooks/useAccounts"
import { isTimestampWithoutTimeInfo } from "@/lib/dateHelper"
import type { Account } from "@/models/Account"
import type { Category } from "@/models/Category"
import type { Transaction } from "@/models/Transaction"

interface AddTransactionProps {
  transaction?: Transaction;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddTransaction({ transaction, isOpen, onOpenChange }: AddTransactionProps) {
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactions();

  const [note, setNote] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const [timestamp, setTimestamp] = useState<Date>(new Date());
  const [isExpense, setIsExpense] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedAccount, setSelectedAccount] = useState<Account>();

  const [categoriesDrawerState, setCategoriesDrawerState] = useState(false)
  const [accountsDrawerState, setAccountsDrawerState] = useState(false)

  // Only show the time information if the time is not 00:00
  const humanReadableTimestamp = isTimestampWithoutTimeInfo(timestamp) 
    ? timestamp.toLocaleString("en-GB", { weekday: "short", month: "short", day: "numeric" })
    : timestamp.toLocaleString("en-GB", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "numeric" })

  useEffect(() => {
    if (!isOpen) { return; }

    if (transaction) {
      // Edit mode: populate fields
      setNote(transaction.note ?? "");
      setIsExpense(transaction.amount < 0);
      setTimestamp(new Date(transaction.timestamp));
      setAmount(Math.abs(transaction.amount).toFixed(2).toString().replace(".", ","));
      setSelectedCategory(categories.data?.find((category: Category) => category.categoryId === transaction.categoryId));
      setSelectedAccount(accounts.data?.find((account: Account) => account.accountId === transaction.accountId));
    } else {
      // Add mode: reset fields
      setNote("");
      setAmount("0");
      setTimestamp(new Date);
      setSelectedCategory(undefined);
      setSelectedAccount(undefined);
    }
  }, [isOpen, transaction]);

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
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="px-5">
          <DrawerHeader>
            <DrawerTitle className="hidden">{ transaction ? "Edit Transaction" : "Add Transaction" }</DrawerTitle>
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-2.5">
                <Button disabled
                  size="sm" 
                  variant="secondary">
                    <CalendarClock /> {humanReadableTimestamp}
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
            <div className="text-center mt-10 mb-14">
              { transaction?.merchant &&
                <Badge variant="secondary">
                  <Store /> 
                  {transaction?.merchant}
                </Badge>
              }

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

              <Button variant="secondary" size="lg" onClick={() => setCategoriesDrawerState(true)}>
                {
                  selectedCategory?.name
                  ? <div className="space-x-2.5">
                      <span>{selectedCategory.icon}</span>
                      <span>{selectedCategory.name}</span>
                    </div>
                  : <span>Select Category</span>
                }
              </Button>


              <Button variant="secondary" size="lg" onClick={() => setAccountsDrawerState(true)}>
                {
                  selectedAccount?.name
                  ? <div className="space-x-2.5">
                      <span>💳</span>
                      <span>{selectedAccount.name}</span>
                    </div>
                  : <span>Select Account</span>
                }
              </Button>
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

      {/* Child drawers */}
      <CategoriesDrawer
        useSelectionMode
        isOpen={categoriesDrawerState} 
        onOpenChange={setCategoriesDrawerState} 
        onSelectCategory={setSelectedCategory} />
      <AccountsDrawer 
        useSelectionMode
        isOpen={accountsDrawerState} 
        onOpenChange={setAccountsDrawerState} 
        onSelectAccount={setSelectedAccount} />
    </>
  )
}
