import { useEffect, useState } from "react";
import { Trash, X } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
  const [tab, setTab] = useState("expense");
  const [expenseCategories, setExpenseCategories] = useState<Category[]>();
  const [incomeCategories, setIncomeCategories] = useState<Category[]>();

  useEffect(() => {
    if (!categories.isPending && !categories.isError) {
      // Using this to split the categories into two groups for easier handling
      setExpenseCategories(categories.data.filter(c => c.isExpenseCategory == true));
      setIncomeCategories(categories.data.filter(c => c.isExpenseCategory == false));
    }
  }, [categories.data])

  // Make the tabs controlled
  const onTabChange = (value: string) => { setTab(value); }

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

        <div className="apple-safe-area drawer-content mb-1">
          <Tabs value={tab} onValueChange={onTabChange}>
            <TabsList className="w-full">
              <TabsTrigger value="expense">Expense</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>

            {
              categories.isPending ? (<p className="dbg">Loading...</p>) :
                categories.isError ? (<ErrorAlert error={categories.error} />) :
                  (
                    <>
                      <AddCategory
                        isExpenseCategory={tab === "expense" ? true : false} />

                      <TabsContent value="expense">
                        {expenseCategories?.length === 0 && <EmptyCategories />}

                        {expenseCategories &&
                          <div className="overflow-y-auto">
                            <ItemGroup className="bg-neutral-100 rounded-xl my-5">
                              {expenseCategories.map((category) => (
                                <Item>
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
                      </TabsContent>

                      <TabsContent value="income">
                        {incomeCategories?.length === 0 && <EmptyCategories />}

                        {incomeCategories &&
                          <div className="overflow-y-auto">
                            <ItemGroup className="bg-neutral-100 rounded-xl my-5">
                              {incomeCategories.map((category) => (
                                <Item>
                                  <ItemMedia>
                                    <span>{category.icon}</span>
                                  </ItemMedia>
                                  <ItemContent>
                                    <span>{category.name}</span>
                                  </ItemContent>

                                  <ItemActions>
                                    {/* TODO: Implement functionality */}
                                    {/* <Button variant="ghost" size="sm">
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
                      </TabsContent>
                    </>
                  )
            }
          </Tabs>

        </div>
      </DrawerContent>
    </Drawer>
  )
}