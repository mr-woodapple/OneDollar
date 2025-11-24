import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";

import type { Category } from "@/models/Category";

interface AddCategoryProps  {
  addCategory: (account: Omit<Category, "id">) => Promise<any>;
  loading: boolean;
  error: string | null;
}

export default function AddCategory({ addCategory, loading, error }: AddCategoryProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [categoryTitle, setCategoryTitle] = useState<string>();
  const [categoryIcon, setCategoryIcon] = useState<string>();

  async function handleCreate() {
    const category: Category = { icon: categoryIcon || "", name: categoryTitle || "" };
    await addCategory(category);

    if (error == null) { setOpen(false) };
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <div className="flex flex-row justify-center mt-2 p-2 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer">
          <span><Plus className="text-neutral-500 me-2" /></span>
          <span className="font-medium text-neutral-500">Add Category</span>
        </div>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <div className="flex flex-row justify-between items-center">
            <DrawerTitle>Create Category</DrawerTitle>
            <DrawerClose>
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
          <Button onClick={() => handleCreate()} disabled={loading}>
            {loading && <Spinner />}
            {loading ? "Creating" : "Create"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}