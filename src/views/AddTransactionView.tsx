import { useState } from "react"
import { Slash, X } from "lucide-react"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

import { Button } from "@/components/ui/button"
import NumPad from "@/components/transaction/NumPad"
import Amount from "@/components/transaction/Amount"
import SelectCategory from "@/components/transaction/SelectCategory"
import SelectAccount from "@/components/transaction/SelectAccount"

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddTransactionView({ isOpen, onOpenChange }: Props) {
  const [amount, setAmount] = useState<string>("0");

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
          <Amount amount={amount}/>

          <div className="flex flex-row gap-2.5 my-2.5">
            <SelectCategory />
            <Slash className="h-12 w-12"/>
            <SelectAccount />
          </div>
          
          <NumPad handleNumpadInput={handleNumpadInput} />
          <Button onClick={() => onOpenChange(false)} className="mt-2.5 h-12 w-full rounded-full">
            Next
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
