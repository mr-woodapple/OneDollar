import { useState, useEffect } from "react"
import { ArrowLeftRight, CalendarClock, Check, Euro, Minus, Plus, Store, Trash } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Drawer, DrawerContent, DrawerHeading } from "@/components/shared/GenericDrawer"

import NumPad from "@/components/transactions/NumPad"
import CategoriesDrawer from "@/components/categories/CategoriesDrawer"
import AccountsDrawer from "@/components/accounts/AccountsDrawer"
import { useTransactions } from "@/api/hooks/useTransactions"
import { useCategories } from "@/api/hooks/useCategories"
import { useAccounts } from "@/api/hooks/useAccounts"
import { useTags } from "@/api/hooks/useTags"
import { isTimestampWithoutTimeInfo } from "@/lib/dateHelper"
import type { Account } from "@/models/Account"
import type { Category } from "@/models/Category"
import type { Tag } from "@/models/Tag"
import type { Transaction } from "@/models/Transaction"

interface AddTransactionProps {
  transaction?: Transaction;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddTransaction({ transaction, isOpen, onOpenChange }: AddTransactionProps) {
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { tags } = useTags();
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactions();

  const [note, setNote] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const [timestamp, setTimestamp] = useState<Date>(new Date());
  const [isExpense, setIsExpense] = useState<boolean>(true);
  const [isTransfer, setIsTransfer] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const [selectedDestinationAccount, setSelectedDestinationAccount] = useState<Account>();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const [categoriesDrawerState, setCategoriesDrawerState] = useState(false)
  const [accountsDrawerState, setAccountsDrawerState] = useState(false)
  const [destinationAccountsDrawerState, setDestinationAccountsDrawerState] = useState(false)

  // Only show the time information if the time is not 00:00
  const humanReadableTimestamp = isTimestampWithoutTimeInfo(timestamp) 
    ? timestamp.toLocaleString("en-GB", { weekday: "short", month: "short", day: "numeric" })
    : timestamp.toLocaleString("en-GB", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "numeric" })

  useEffect(() => {
    if (!isOpen) { return; }

    if (transaction) {
      // Edit mode: populate fields
      setNote(transaction.note ?? "");
      setIsExpense(!transaction.isTransfer && transaction.amount < 0);
      setIsTransfer(transaction.isTransfer);
      setTimestamp(new Date(transaction.timestamp));
      setAmount(Math.abs(transaction.amount).toFixed(2).toString().replace(".", ","));
      setSelectedCategory(categories.data?.find((category: Category) => category.categoryId === transaction.categoryId));
      setSelectedAccount(accounts.data?.find((account: Account) => account.accountId === transaction.accountId));
      setSelectedDestinationAccount(accounts.data?.find((account: Account) => account.accountId === transaction.destinationAccountId));
      setSelectedTags(transaction.tags ?? []);
    } else {
      // Add mode: reset fields
      setNote("");
      setAmount("0");
      setTimestamp(new Date);
      setIsExpense(true);
      setIsTransfer(false);
      setSelectedCategory(undefined);
      setSelectedAccount(undefined);
      setSelectedDestinationAccount(undefined);
      setSelectedTags([]);
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
      toast.warning(`Please select a ${isTransfer ? "source " : ""}account!`)
      return;
    }

    if (isTransfer && !selectedDestinationAccount) {
      toast.warning("Please select a destination account!")
      return;
    }

    if (isTransfer && selectedDestinationAccount?.accountId === selectedAccount.accountId) {
      toast.warning("Source and destination accounts must be different!")
      return;
    }

    let finalAmount = Number(amount.replace(",", ".")) || 0;
    finalAmount = isTransfer || !isExpense ? Math.abs(finalAmount) : -Math.abs(finalAmount);

    if (isTransfer && finalAmount <= 0) {
      toast.warning("Transfer amount must be greater than zero!")
      return;
    }

    const t: Transaction = {
      transactionId: transaction?.transactionId ?? undefined,
      timestamp,
      categoryId: isTransfer ? null : selectedCategory?.categoryId ?? null,
      accountId: selectedAccount.accountId!,
      destinationAccountId: isTransfer ? selectedDestinationAccount!.accountId! : null,
      amount: finalAmount,
      currency: "EUR",
      note: note,
      merchant: transaction?.merchant ?? undefined,
      isPending: transaction?.isPending ?? false,
      isTransfer,
      tags: selectedTags.map((tag) => ({ tagId: tag.tagId, name: tag.name, color: tag.color }))
    };

    isUpdate
      ? await updateTransaction.mutateAsync({ id: transaction!.transactionId!, data: t })
      : await addTransaction.mutateAsync(t);

    if (isUpdate ? (updateTransaction.error == null) : (addTransaction.error == null)) {
      onOpenChange(false);
      setAmount("0");
      setIsExpense(true);
      setIsTransfer(false);
      setSelectedAccount(undefined);
      setSelectedDestinationAccount(undefined);
      setSelectedCategory(undefined);
      setSelectedTags([]);
    };
  }

  async function handleDelete(id?: number) {
    if (!id) { return; }

    await deleteTransaction.mutateAsync(id);
    if (deleteTransaction.error == null) {
      onOpenChange(false);
    };
  }

  // Toggle a tag in the current selection
  function toggleTag(tag: Tag) {
    setSelectedTags((current) =>
      current.some((t) => t.tagId === tag.tagId)
        ? current.filter((t) => t.tagId !== tag.tagId)
        : [...current, tag]);
  }

  function toggleTransfer() {
    setIsTransfer((current) => {
      if (current) {
        setSelectedDestinationAccount(undefined);
      } else {
        setSelectedCategory(undefined);
      }

      return !current;
    });
  }

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeading>
            <div className="flex flex-row gap-2.5">
              <Button disabled size="sm" variant="secondary">
                <CalendarClock /> {humanReadableTimestamp}
              </Button>
              <Button disabled size="sm" variant="secondary">
                <Euro />
              </Button>
              <Button
                size="sm"
                variant={isTransfer ? "default" : "secondary"}
                onClick={toggleTransfer}>
                <ArrowLeftRight /> Transfer
              </Button>
            </div>
          </DrawerHeading>
          <div className="drawer-content mb-1 px-5">
            <div className="text-center mt-10 mb-14">
              { transaction?.merchant &&
                <Badge variant="secondary">
                  <Store /> 
                  {transaction?.merchant}
                </Badge>
              }

              <div className="flex flex-row justify-center items-center mt-2.5">
                <Button
                  disabled={isTransfer}
                  variant="ghost"
                  className="rounded-full w-auto h-auto"
                  onClick={() => setIsExpense(!isExpense)}>
                  {isExpense ? <Minus className="size-8 stroke-3" /> : <Plus className="size-8 stroke-3" />}
                </Button>  
                <span className="ml-2 text-5xl font-bold">{ amount } €</span>
              </div>
            </div>
            
            { tags.data && tags.data.length > 0 &&
              <>
                <Label>Tags</Label>
                <div className="flex flex-row gap-2 overflow-x-auto mb-4 mt-2 pb-1 -mx-5 px-5">
                  {tags.data.map((tag) => {
                    const isActive = selectedTags.some((t) => t.tagId === tag.tagId);
                    const color = tag.color ?? "#a3a3a3";

                    return (
                      <Badge
                        key={tag.tagId}
                        variant="outline"
                        onClick={() => toggleTag(tag)}
                        style={isActive
                          ? { backgroundColor: color, color: "#ffffff" }
                          : { backgroundColor: `${color}40`, color: color }}
                        className="shrink-0 cursor-pointer border-transparent transition-colors duration-200">
                        {isActive && <Check className="mr-1" />}
                        {tag.name}
                      </Badge>
                    );
                  })}
                </div>
              </>
            }

            <Label htmlFor="input-addtransaction-note">Note</Label>
            <Input 
              className="mt-2"
              id="input-addtransaction-note"
              type="text" 
              placeholder="Add a note..." 
              value={note} 
              onChange={(e) => setNote(e.target.value)} />

            <div className="grid grid-cols-2 gap-2.5 my-4">

              {isTransfer
                ? <Button
                    variant="secondary"
                    size="lg"
                    className="min-w-0 overflow-hidden"
                    onClick={() => setAccountsDrawerState(true)}>
                    {
                      selectedAccount?.name
                      ? <div className="flex min-w-0 items-center gap-2.5">
                          <span className="shrink-0">From</span>
                          <span className="truncate" title={selectedAccount.name}>
                            {selectedAccount.name}
                          </span>
                        </div>
                      : <span>Select Source</span>
                    }
                  </Button>
                : <Button
                    variant="secondary"
                    size="lg"
                    className="min-w-0 overflow-hidden"
                    onClick={() => setCategoriesDrawerState(true)}>
                    {
                      selectedCategory?.name
                      ? <div className="flex min-w-0 items-center gap-2.5">
                          <span className="shrink-0">{selectedCategory.icon}</span>
                          <span className="truncate" title={selectedCategory.name}>
                            {selectedCategory.name}
                          </span>
                        </div>
                      : <span>Select Category</span>
                    }
                  </Button>
              }


              {isTransfer
                ? <Button
                    variant="secondary"
                    size="lg"
                    className="min-w-0 overflow-hidden"
                    onClick={() => setDestinationAccountsDrawerState(true)}>
                    {
                      selectedDestinationAccount?.name
                      ? <div className="flex min-w-0 items-center gap-2.5">
                          <span className="shrink-0">To</span>
                          <span className="truncate" title={selectedDestinationAccount.name}>
                            {selectedDestinationAccount.name}
                          </span>
                        </div>
                      : <span>Select Destination</span>
                    }
                  </Button>
                : <Button
                    variant="secondary"
                    size="lg"
                    className="min-w-0 overflow-hidden"
                    onClick={() => setAccountsDrawerState(true)}>
                    {
                      selectedAccount?.name
                      ? <div className="flex min-w-0 items-center gap-2.5">
                          <span className="shrink-0">💳</span>
                          <span className="truncate" title={selectedAccount.name}>
                            {selectedAccount.name}
                          </span>
                        </div>
                      : <span>Select Account</span>
                    }
                  </Button>
              }
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
      </Drawer>

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
        onSelectAccount={(account) => {
          setSelectedAccount(account);
          if (account.accountId === selectedDestinationAccount?.accountId) {
            setSelectedDestinationAccount(undefined);
          }
        }} />
      <AccountsDrawer
        useSelectionMode
        isOpen={destinationAccountsDrawerState}
        onOpenChange={setDestinationAccountsDrawerState}
        onSelectAccount={(account) => {
          setSelectedDestinationAccount(account);
          if (account.accountId === selectedAccount?.accountId) {
            setSelectedAccount(undefined);
          }
        }} />
    </>
  )
}
