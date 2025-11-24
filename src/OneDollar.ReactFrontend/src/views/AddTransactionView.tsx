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

interface AddTransactionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<any>;
  updateTransaction: (id: number, transaction: Partial<Transaction>) => Promise<any>;
  deleteTransaction: (id: number) => Promise<any>;
  loading: boolean;
  error: string | null;
  transaction?: Transaction;
}

export default function AddTransactionView({ isOpen, onOpenChange, loading, error, transaction, addTransaction, updateTransaction, deleteTransaction }: AddTransactionProps) {
  const [note] = useState<string>();
  const [amount, setAmount] = useState<string>("0");
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedAccount, setSelectedAccount] = useState<Account>();

  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        // Edit mode: populate fields
        setAmount(transaction.amount.toString().replace(".", ","));
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

    const t: Transaction = {
      transactionId: transaction?.transactionId ?? undefined,
      timestamp: transaction?.timestamp ?? new Date,
      categoryId: selectedCategory.categoryId!,
      accountId: selectedAccount.accountId!,
      amount: Number(amount) || 0,
      currency: "EUR",
      note: note
    };

    isUpdate
      ? await updateTransaction(transaction!.transactionId!, t)
      : await addTransaction(t);

    if (error == null) {
      onOpenChange(false);
      setAmount("0");
      setSelectedAccount(undefined);
      setSelectedCategory(undefined);
    };
  }


  async function handleDelete(id?: number) {
    if (!id) { return; }
    
    await deleteTransaction(id);
    if (error == null) {
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
          <Amount amount={amount} />

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
            <Button onClick={() => handleSaveOrUpdate(transaction ? true : false)} disabled={loading} className="grow mt-2.5 h-12 rounded-full">
              {loading && <Spinner />}
              {loading ? (transaction ? "Updating" : "Creating") : (transaction ? "Update" : "Create")}
            </Button>
            {transaction &&
              <Button onClick={() => handleDelete(transaction.transactionId)} className="mt-2.5 h-12 w-12 rounded-full bg-red-500">
                <Trash />
              </Button>
            }
          </div>
        </div>
      </DrawerContent>
    </Drawer >
  )
}
