import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";

import type { Category } from "@/models/Category";
import { useCategories } from "@/api/hooks/useCategories";

interface AddCategoryProps  {
  isExpenseCategory: boolean;
}

export default function AddCategory({ isExpenseCategory }: AddCategoryProps) {
  const { addCategory } = useCategories();
  const [open, setOpen] = useState<boolean>(false);
  const [categoryTitle, setCategoryTitle] = useState<string>();
  const [categoryIcon, setCategoryIcon] = useState<string>();

  async function handleCreate() {
    const category: Category = { icon: categoryIcon || "", name: categoryTitle || "", isExpenseCategory:  isExpenseCategory };
    await addCategory.mutateAsync(category);

    if (addCategory.error == null) { setOpen(false) };
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <div className="flex flex-row justify-center mt-2 p-2 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer">
          <span><Plus className="text-neutral-500 me-2" /></span>
          <span className="font-medium text-neutral-500">Add Category</span>
        </div>
      </DrawerTrigger>

      <DrawerContent className="apple-safe-area">
        <DrawerHeader>
          <div className="flex flex-row justify-between items-center">
            <DrawerTitle>
              {isExpenseCategory ? "Create Expense Category" : "Create Income Category"}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="categoryIcon">Category Icon</Label>
            <Input
              id="categoryIcon"
              placeholder="🎁, 🫑, ..." value={categoryIcon}
              onChange={(e) => setCategoryIcon(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryTitle">Category Title</Label>
            <Input
              id="categoryTitle"
              placeholder="Food..." value={categoryTitle}
              onChange={(e) => setCategoryTitle(e.target.value)} />
          </div>
        </div>

        <DrawerFooter className="mt-10">
          <Button onClick={() => handleCreate()} disabled={addCategory.isPending}>
            {addCategory.isPending && <Spinner />}
            {addCategory.isPending ? "Creating" : "Create"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}