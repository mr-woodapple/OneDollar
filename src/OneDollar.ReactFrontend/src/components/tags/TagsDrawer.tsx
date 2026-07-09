import { useEffect, useRef, useState } from "react";
import { Check, Pen, Trash, X } from "lucide-react";
import { Button } from "../ui/button";
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia } from "../ui/item";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";

import { useTags } from "@/api/hooks/useTags";
import type { Tag } from "@/models/Tag";
import ErrorAlert from "../shared/alerts/ErrorAlert";
import EmptyTags from "../shared/empty/EmptyTags";
import GenericDialog, { type GenericDialogHandle } from "../shared/GenericDialog";
import EditTag from "./EditTag";

interface TagsDrawerProps {
  useSelectionMode?: boolean;
  selectedTags?: Tag[];
  showAddButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmSelection?: (tags: Tag[]) => void;
}

/**
 * Drawer component for tags. Needs to be opened or closed from outside 
 * by controlling the "isOpen" state of this component.
 * Can be used for managing and/or selecting MULTIPLE tags (for example when editing a transaction).
 * 
 * @param useSelectionMode If true, tags can be (multi) selected and confirmed with a "Done" button.
 * @param selectedTags The tags that should be pre-selected when opening in selection mode.
 * @param showAddButton If true, a full-width "add tag" button is shown above the tags list.
 * @param showEditButton If true, an edit button is shown for each tag.
 * @param showDeleteButton If true, a delete button is shown for each tag.
 * @param isOpen If true, the drawer is visible.
 * @param onOpenChange Called if the open state of the drawer should be changed.
 * @param onConfirmSelection Called with the selected tags when the selection is confirmed.
 * @returns Drawer component to select, list, edit and delete tags.
 */
export default function TagsDrawer({
  useSelectionMode,
  selectedTags,
  showAddButton,
  showEditButton,
  showDeleteButton,
  isOpen,
  onOpenChange,
  onConfirmSelection
}: TagsDrawerProps) {
  const { tags, deleteTag } = useTags();

  const [isAddTag, setIsAddTag] = useState(true);
  const [editTagDrawerState, setEditTagDrawerState] = useState(false);
  const [tagToEdit, setTagToEdit] = useState<Tag | undefined>(undefined);
  const [pendingSelection, setPendingSelection] = useState<Tag[]>([]);
  const deleteDialogRef = useRef<GenericDialogHandle>(null);

  // Sync the internal selection with the selection passed from outside whenever
  // the drawer is (re)opened in selection mode.
  useEffect(() => {
    if (isOpen && useSelectionMode) {
      setPendingSelection(selectedTags ?? []);
    }
  }, [isOpen, useSelectionMode, selectedTags]);

  function isSelected(tag: Tag) {
    return pendingSelection.some((t) => t.tagId === tag.tagId);
  }

  // Toggle a tag in the pending selection
  function handleToggle(tag: Tag) {
    if (!useSelectionMode) { return; }

    setPendingSelection((current) =>
      current.some((t) => t.tagId === tag.tagId)
        ? current.filter((t) => t.tagId !== tag.tagId)
        : [...current, tag]);
  }

  // Confirm the current selection and close the drawer
  function handleConfirm() {
    onConfirmSelection?.(pendingSelection);
    onOpenChange(false);
  }

  // Handle deleting tags
  async function handleDelete(id?: number) {
    if (id == null) { return; }

    const confirmed = await deleteDialogRef.current?.openDialog();
    if (!confirmed) { return; }

    await deleteTag.mutateAsync(id);
  }

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="px-5 max-w-screen-sm mx-auto">
          <DrawerHeader>
            <div className="flex flex-row justify-between items-center">
              <DrawerTitle>Tags</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="apple-safe-area drawer-content flex flex-col mb-1 max-h-[70vh]">
            {
              tags.isPending ? (<p className="dbg">Loading...</p>) :
              tags.isError ? (<ErrorAlert error={tags.error} />) :
              (
                <>
                  { showAddButton &&
                    <Button onClick={() => {
                      setEditTagDrawerState(true);
                      setIsAddTag(true);
                      setTagToEdit(undefined);
                    }}>
                      Add Tag
                    </Button>
                  }

                  { tags.data?.length === 0 && <EmptyTags /> }

                  { tags.data && tags.data.length > 0 &&
                    <div className="overflow-y-auto">
                      <ItemGroup className="bg-neutral-100 rounded-xl my-5">
                        {tags.data.map((tag) => (
                          <Item key={tag.tagId}
                                onClick={() => handleToggle(tag)}
                                className={useSelectionMode ? "cursor-pointer" : undefined}>
                            <ItemMedia>
                              <span
                                className="inline-block w-3 h-3 rounded-full"
                                style={{ backgroundColor: tag.color ?? "#a3a3a3" }} />
                            </ItemMedia>
                            <ItemContent>
                              <span>{tag.name}</span>
                            </ItemContent>

                            <ItemActions>
                              { useSelectionMode && isSelected(tag) &&
                                <Check className="text-primary" />
                              }

                              { showEditButton &&
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditTagDrawerState(true);
                                    setIsAddTag(false);
                                    setTagToEdit(tag);
                                  }}>
                                  <Pen />
                                </Button>
                              }

                              { showDeleteButton &&
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(tag.tagId);
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

          { useSelectionMode &&
            <DrawerFooter>
              <Button onClick={handleConfirm}>Done</Button>
            </DrawerFooter>
          }
        </DrawerContent>
      </Drawer>

      <GenericDialog
        ref={deleteDialogRef}
        title="Delete tag"
        content="This action cannot be undone. The selected tag will be permanently deleted."
        buttonCancel="Cancel"
        buttonConfirm="Delete"
        buttonConfirmDestructive />

      <EditTag
        tag={tagToEdit}
        isAddMode={isAddTag}
        isOpen={editTagDrawerState}
        onOpenChange={setEditTagDrawerState} />
    </>
  )
}
