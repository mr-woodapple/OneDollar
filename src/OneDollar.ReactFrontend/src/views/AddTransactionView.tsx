import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Trash, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

import NumPad from "@/components/transaction/NumPad"
import Amount from "@/components/transaction/Amount"
import SelectCategory from "@/components/transaction/SelectCategory"
import SelectAccount from "@/components/transaction/SelectAccount"
import type { Account } from "@/models/Account"
import type { Category } from "@/models/Category"
import type { Transaction } from "@/models/Transaction"
import { useTransactions } from "@/api/hooks/useTransactions"

interface AddTransactionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
}

export default function AddTransactionView({ isOpen, onOpenChange, transaction }: AddTransactionProps) {
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [note] = useState<string>();
  const [amount, setAmount] = useState<string>("0");
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedAccount, setSelectedAccount] = useState<Account>();

  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        // Edit mode: populate fields
        setAmount(Math.abs(transaction.amount).toString().replace(".", ","));
        setSelectedCategory(transaction.category);
        setSelectedAccount(transaction.account);
      } else {
        // Add mode: reset fields
        setAmount("0");
        setSelectedCategory(undefined);
        setSelectedAccount(undefined);
      }
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
    if (selectedCategory == null || selectedAccount == null) {
      toast.warning("Please select a category and account!")
      return;
    }

    let finalAmount = Number(amount.replace(",", ".")) || 0;
    if (selectedCategory.isExpenseCategory) {
      finalAmount = -Math.abs(finalAmount);
    } else {
      finalAmount = Math.abs(finalAmount);
    }

    const t: Transaction = {
      transactionId: transaction?.transactionId ?? undefined,
      timestamp: transaction?.timestamp ?? new Date,
      categoryId: selectedCategory.categoryId!,
      accountId: selectedAccount.accountId!,
      amount: finalAmount,
      currency: "EUR",
      note: note
    };

    isUpdate
      ? await updateTransaction.mutateAsync({ id: transaction!.transactionId!, data: t })
      : await addTransaction.mutateAsync(t);

    if (isUpdate ? (updateTransaction.error == null) : (addTransaction.error == null)) {
      onOpenChange(false);
      setAmount("0");
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
            {/* TODO: Replace with buttons for date, time (?) and concurrend option */}
            <DrawerTitle>Add Transaction</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="drawer-content mb-1">
          <Amount
            amount={amount}
            isExpenseCategory={selectedCategory?.isExpenseCategory} />

          <div className="flex flex-row gap-2.5 my-2.5">
            <SelectCategory
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory} />
            <SelectAccount
              selectedAccount={selectedAccount}
              onSelectAccount={setSelectedAccount} />
          </div>

          <NumPad handleNumpadInput={handleNumpadInput} />

          <div className="flex flex-row w-full gap-x-2.5">
            {!transaction &&
              <Button onClick={() => handleSaveOrUpdate(false)} disabled={addTransaction.isPending} className="grow mt-2.5 h-12 rounded-full">
                {addTransaction.isPending && <Spinner />}
                {addTransaction.isPending ? "Creating" : "Create"}
              </Button>
            }

            {transaction &&
              <>
                <Button onClick={() => handleSaveOrUpdate(true)} disabled={updateTransaction.isPending} className="grow mt-2.5 h-12 rounded-full">
                  {updateTransaction.isPending && <Spinner />}
                  {updateTransaction.isPending ? "Updating" : "Update"}
                </Button>
                <Button onClick={() => handleDelete(transaction.transactionId)} className="mt-2.5 h-12 w-12 rounded-full bg-red-500">
                  <Trash />
                </Button>
              </>
            }
          </div>
        </div>
      </DrawerContent>
    </Drawer >
  )
}
