import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "../../ui/button"
import { Item, ItemGroup } from "../../ui/item";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../ui/drawer"

import type { Category } from "@/models/Category"
import { useCategories } from "@/api/hooks/useCategories"
import EmptyCategories from "../../shared/empty/EmptyCategories"
import ErrorAlert from "../../shared/alerts/ErrorAlert"

interface SelectCategoryProps {
  selectedCategory?: Category;
  onSelectCategory: (category: Category) => void;
}

export default function SelectCategory({ selectedCategory, onSelectCategory }: SelectCategoryProps) {
  const { categories } = useCategories();

  const [transactionCategories, setTransactionCategories] = useState<Category[]>();

  useEffect(() => {
    if (!categories.isPending && !categories.isError) {
      setTransactionCategories(categories.data);
    }
  }, [categories.data]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
          <Button variant="secondary" size="lg">
            {
              selectedCategory?.name
              ? <div className="space-x-2.5">
                <span>{selectedCategory.icon}</span>
                <span>{selectedCategory.name}</span>
              </div>
              : <span>Select Category</span>
            }
          </Button>
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

        <div className="apple-safe-area drawer-content mx-5 flex flex-col">
          {
            categories.isPending ? (<p className="dbg">Loading...</p>) :
            categories.isError ? (<ErrorAlert error={categories.error} />) :
            (
              <>
                {transactionCategories?.length === 0 && <EmptyCategories />}

                {transactionCategories &&
                  <div className="overflow-y-auto">
                    <ItemGroup className="bg-neutral-100 rounded-xl my-5">
                      {transactionCategories.map((category) => (
                        <DrawerClose asChild key={category.categoryId}>
                          <Item onClick={() => onSelectCategory(category)} className="hover:bg-neutral-200">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </Item>
                        </DrawerClose>
                      ))}
                    </ItemGroup>
                  </div>
                }
              </>
            )
          }
        </div>
      </DrawerContent>
    </Drawer>
  )
}
