import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import NumPad from "@/components/transaction/NumPad"

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddTransactionView({ isOpen, onOpenChange }: Props) {

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="px-5">
        <DrawerHeader>
          <DrawerTitle>Add transaction</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost">Close</Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="drawer-content">
          <NumPad />
        </div>

        <DrawerFooter>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}