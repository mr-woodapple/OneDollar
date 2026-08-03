import { useEffect, useRef, useState } from "react";
import { Pen, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia } from "../ui/item";
import { Drawer, DrawerContent, DrawerHeading } from "../shared/GenericDrawer";

import { useCategories } from "@/api/hooks/useCategories";
import type { Category } from "@/models/Category";
import ErrorAlert from "../shared/alerts/ErrorAlert";
import EmptyCategories from "../shared/empty/EmptyCategories";
import GenericDialog, { type GenericDialogHandle } from "../shared/GenericDialog";
import EditCategory from "./EditCategory";

interface CategoriesDrawerProps {
  useSelectionMode?: boolean;
  showAddButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCategory?: (category: Category) => void;
}

/**
 * Drawer component for categories. Needs to be opened or closed from outside 
 * by controlling the "isOpen" state of this component.
 * Can be used for managing and/or just selecting categories (for example when editing a transaction).
 * 
 * @param useSelectionMode If true, a category can be selected (and after selecting the drawer closes).
 * @param showAddButton If true, a full-width "add category" button is shown above the categories list.
 * @param showEditButton If true, an edit button is shown for each category.
 * @param showDeleteButton If true, a delete button is shown for each category.
 * @param isOpen If true, the drawer is visible.
 * @param onOpenChange Called if the open state of the drawer should be changed.
 * @param onSelectCategory Called if the selected category changes.
 * @returns Drawer component to select, list, edit and delete categories.
 */
export default function CategoriesDrawer({ 
  useSelectionMode,
  showAddButton, 
  showEditButton, 
  showDeleteButton, 
  isOpen, 
  onOpenChange,
  onSelectCategory
}: CategoriesDrawerProps) {
  const { categories, deleteCategory } = useCategories();

  const [isAddCategory, setIsAddCategory] = useState(true);
  const [editCategoryDrawerState, setEditCategoryDrawerState] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
  const [transactionCategories, setTransactionCategories] = useState<Category[]>();
  const deleteDialogRef = useRef<GenericDialogHandle>(null);

  // TODO: Is this actually required? Or can this block be omitted?
  useEffect(() => {
    if (!categories.isPending && !categories.isError) {
      setTransactionCategories(categories.data)
    }
  }, [categories.data])

  // Only handle selecting a category, if selectionMode is active
  async function handleSelect(category: Category) {
    if (useSelectionMode && onSelectCategory) {
      onSelectCategory(category);
      onOpenChange(false);
    }
  }

  // Handle deleting categories
  async function handleDelete(id?: number) {
    if (id == null) { return; }

    const confirmed = await deleteDialogRef.current?.openDialog();
    if (!confirmed) { return; }

    await deleteCategory.mutateAsync(id);
  }

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeading>
            <h2 className="font-semibold">Categories</h2>
          </DrawerHeading>
          <div className="drawer-content mb-1 flex max-h-[70vh] flex-col px-5">
            {
              categories.isPending ? (<p className="dbg">Loading...</p>) :
              categories.isError ? (<ErrorAlert error={categories.error} />) :
              (
                <>
                  { showAddButton && 
                    <Button onClick={() => {
                      setEditCategoryDrawerState(true);
                      setIsAddCategory(true);
                      setSelectedCategory(undefined);
                    }}>
                      Add Category
                    </Button>
                  }

                  { transactionCategories?.length === 0 && <EmptyCategories /> }

                  { transactionCategories &&
                    <div className="overflow-y-auto">
                      <ItemGroup className="bg-neutral-100 rounded-xl my-5">
                        {transactionCategories.map((category) => (
                          <Item key={category.categoryId} 
                                onClick={() => handleSelect(category)}
                                className={useSelectionMode ? "cursor-pointer" : undefined}>
                            <ItemMedia>
                              <span>{category.icon}</span>
                            </ItemMedia>
                            <ItemContent>
                              <span>{category.name}</span>
                            </ItemContent>

                            <ItemActions>
                              { showEditButton &&
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditCategoryDrawerState(true);
                                    setIsAddCategory(false);
                                    setSelectedCategory(category);
                                  }}>
                                  <Pen />
                                </Button>
                              }

                              { showDeleteButton &&
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => {
                                    handleDelete(category.categoryId);
                                  }}>
                                  <Trash />
                                </Button>
                              }
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

      <GenericDialog 
        ref={deleteDialogRef}
        title="Delete category" 
        content="This action cannot be undone. The selected category will be permanently deleted."
        buttonCancel="Cancel"
        buttonConfirm="Delete" 
        buttonConfirmDestructive />

      <EditCategory
        category={selectedCategory}
        isAddMode={isAddCategory}
        isOpen={editCategoryDrawerState}
        onOpenChange={setEditCategoryDrawerState} />
    </>
  )
}
