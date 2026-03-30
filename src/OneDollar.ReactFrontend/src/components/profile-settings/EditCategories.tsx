import { useEffect, useState } from "react";
import { Trash, X } from "lucide-react";
import { Button } from "../ui/button";
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia } from "../ui/item";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

import { useCategories } from "@/api/hooks/useCategories";
import EmptyCategories from "../shared/empty/EmptyCategories";
import AddCategory from "./AddCategory";
import ErrorAlert from "../shared/alerts/ErrorAlert";
import type { Category } from "@/models/Category";

interface EditCategoriesProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditCategories({ isOpen, onOpenChange }: EditCategoriesProps) {
  const { categories, deleteCategory } = useCategories();
  const [transactionCategories, setTransactionCategories] = useState<Category[]>();

  useEffect(() => {
    if (!categories.isPending && !categories.isError) {
      setTransactionCategories(categories.data)
    }
  }, [categories.data])

  // Handle deleting categories
  async function handleDelete(id?: number) {
    if (id == null) { return; }

    await deleteCategory.mutateAsync(id);
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="px-5">
        <DrawerHeader>
          <div className="flex flex-row justify-between items-center">
            <DrawerTitle>Edit Categories</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="apple-safe-area drawer-content flex flex-col mb-1 max-h-[70vh]">
          {
            categories.isPending ? (<p className="dbg">Loading...</p>) :
            categories.isError ? (<ErrorAlert error={categories.error} />) :
            (
              <>
                <AddCategory />

                {transactionCategories?.length === 0 && <EmptyCategories />}

                {transactionCategories &&
                  <div className="overflow-y-auto">
                    <ItemGroup className="bg-neutral-100 rounded-xl my-5">
                      {transactionCategories.map((category) => (
                        <Item key={category.categoryId}>
                          <ItemMedia>
                            <span>{category.icon}</span>
                          </ItemMedia>
                          <ItemContent>
                            <span>{category.name}</span>
                          </ItemContent>

                          <ItemActions>
                            {/* TODO: Implement functionality */}
                            {/* 
                              <Button variant="ghost" size="sm">
                                <Pencil />
                              </Button> 
                            */}
                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(category.categoryId)}>
                              <Trash />
                            </Button>
                          </ItemActions>
                        </Item>
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