import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "../ui/button"
import { Item, ItemGroup } from "../ui/item"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"

import { CategoriesData } from "@/content/CategoriesData"
import type { Category } from "@/models/Category"

export default function SelectCategory() {
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="w-full h-12 grid place-items-center cursor-pointer">
          {selectedCategory?.name 
            ? <div className="space-x-2.5">
                <span>{selectedCategory.icon}</span>
                <span>{selectedCategory.name}</span>
              </div>
            : <span className="underline underline-offset-5">Select Category</span>}
        </div>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <div className="flex flex-row justify-between items-center">
            <DrawerTitle>Select Category</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto">
          <ItemGroup className="bg-neutral-100 rounded-xl m-5 cursor-pointer">
            {CategoriesData.map((category) => (
              <DrawerClose asChild key={category.id}>
                <Item onClick={() => setSelectedCategory(category)} className="hover:bg-neutral-200">
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Item>
              </DrawerClose>
            ))}
          </ItemGroup>
        </div>
      </DrawerContent>
    </Drawer>
  )
}