import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "../ui/button"
import { Item, ItemGroup } from "../ui/item"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"

import { AccountData } from "@/content/AccountData"
import { type Account } from "@/models/Account"

export default function SelectAccount() {
  const [selectedAccount, setSelectedAccount] = useState<Account>();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="w-full h-12 border-2 border-neutral-200 hover:bg-neutral-200 rounded-full grid place-items-center cursor-pointer">
          {selectedAccount?.name 
            ? <div><span>{selectedAccount.icon}</span><span>{selectedAccount.name}</span></div>
            : "Select Account"}
        </div>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <div className="flex flex-row justify-between items-center">
            <DrawerTitle>Select Account</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <ItemGroup className="bg-neutral-100 rounded-xl m-5 cursor-pointer">
          {AccountData.map((account) => (
            <DrawerClose asChild key={account.id}>
              <Item onClick={() => setSelectedAccount(account)} className="hover:bg-neutral-200">
                <span>{account.icon}</span>
                <span>{account.name}</span>
              </Item>
            </DrawerClose>
          ))}
        </ItemGroup>
      </DrawerContent>
    </Drawer>
  )
}