import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Item, ItemGroup } from "../ui/item";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"

import type { Category } from "@/models/Category"
import { useCategories } from "@/api/hooks/useCategories"
import EmptyCategories from "../shared/empty/EmptyCategories"
import ErrorAlert from "../shared/alerts/ErrorAlert"

interface SelectCategoryProps {
  isExpense: boolean;
  selectedCategory?: Category;
  onSelectCategory: (category: Category) => void;
}

export default function SelectCategory({ isExpense, selectedCategory, onSelectCategory }: SelectCategoryProps) {
  const { categories } = useCategories();

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

  useEffect(() =>{
    setTab(isExpense ? "expense" : "income");
  }, [isExpense])

  // Make the tabs controlled
  const onTabChange = (value: string) => { setTab(value); }

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

        <div className="apple-safe-area drawer-content mx-5">
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
                  <TabsContent value="expense">
                    {expenseCategories?.length === 0 && <EmptyCategories />}

                    {expenseCategories &&
                      <div className="overflow-y-auto">
                        <ItemGroup className="bg-neutral-100 rounded-xl my-5">
                          {expenseCategories.map((category) => (
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
                  </TabsContent>

                  <TabsContent value="income">
                    {incomeCategories?.length === 0 && <EmptyCategories />}

                    {incomeCategories &&
                      <div className="overflow-y-auto">
                        <ItemGroup className="bg-neutral-100 rounded-xl my-5">
                          {incomeCategories.map((category) => (
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