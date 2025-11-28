import { X } from "lucide-react"
import { Button } from "../ui/button"
import { Item, ItemGroup } from "../ui/item"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"

import type { Category } from "@/models/Category"
import { useCategories } from "@/api/hooks/useCategories"
import EmptyCategories from "../shared/empty/EmptyCategories"
import ErrorAlert from "../shared/alerts/ErrorAlert"

interface SelectCategoryProps {
  selectedCategory?: Category;
  onSelectCategory: (category: Category) => void;
}

export default function SelectCategory({ selectedCategory, onSelectCategory}: SelectCategoryProps) {
  const { categories } = useCategories();

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

      <DrawerContent className="apple-safe-area">
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

        {
          categories.isPending ? (<p className="dbg">Loading...</p>) :
          categories.isError ? (<ErrorAlert error={categories.error} />) :
          categories.data.length === 0 ? (<EmptyCategories />):
          (
            <div className="overflow-y-auto">
              <ItemGroup className="bg-neutral-100 rounded-xl m-5 cursor-pointer">
                {categories.data.map((category) => (
                  <DrawerClose asChild key={category.categoryId}>
                    <Item onClick={() => onSelectCategory(category)} className="hover:bg-neutral-200">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </Item>
                  </DrawerClose>
                ))}
              </ItemGroup>
            </div>
          )
        }
      </DrawerContent>
    </Drawer>
  )
}