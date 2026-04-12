import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";

import type { Category } from "@/models/Category";
import { useCategories } from "@/api/hooks/useCategories";


interface EditCategoryProperties {
  category?: Category;
  isAddMode: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditCategory({ category, isAddMode, isOpen, onOpenChange }: EditCategoryProperties) {
  const { addCategory, updateCategory } = useCategories();

  const [categoryTitle, setCategoryTitle] = useState<string>("");
  const [categoryIcon, setCategoryIcon] = useState<string>("");

  useEffect(() => {
    if (!isOpen) { return; }

    if (isAddMode) {
      setCategoryTitle("");
      setCategoryIcon("");
      return;
    }

    setCategoryTitle(category?.name ?? "");
    setCategoryIcon(category?.icon ?? "");
  }, [isOpen, isAddMode, category]);

  async function handleSave() {
    const c: Category = {
      icon: categoryIcon ?? "",
      name: categoryTitle ?? ""
    }

    category 
      ? await updateCategory.mutateAsync({ id: category!.categoryId!, data: c})
      : await addCategory.mutateAsync(c);

    if (category ? updateCategory.error == null : addCategory.error == null) { 
      onOpenChange(false); 
    };
  }


  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="apple-safe-area">
        <DrawerHeader>
          <div className="flex flex-row justify-between items-center">
            <DrawerTitle>
              { isAddMode ? "Create category" : "Update category" }
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
          <Button onClick={() => handleSave()} disabled={addCategory.isPending}>
            {addCategory.isPending && <Spinner />}
            {addCategory.isPending ? (isAddMode ? "Creating" : "Updating") : (isAddMode ? "Create" : "Update")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
