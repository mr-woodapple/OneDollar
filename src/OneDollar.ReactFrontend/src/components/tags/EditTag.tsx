import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";

import type { Tag } from "@/models/Tag";
import { useTags } from "@/api/hooks/useTags";

interface EditTagProps {
  tag?: Tag;
  isAddMode: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_COLOR = "#6366f1";

export default function EditTag({ tag, isAddMode, isOpen, onOpenChange }: EditTagProps) {
  const { addTag, updateTag } = useTags();

  const [tagName, setTagName] = useState<string>("");
  const [tagColor, setTagColor] = useState<string>(DEFAULT_COLOR);

  useEffect(() => {
    if (!isOpen) { return; }

    if (isAddMode) {
      setTagName("");
      setTagColor(DEFAULT_COLOR);
      return;
    }

    setTagName(tag?.name ?? "");
    setTagColor(tag?.color ?? DEFAULT_COLOR);
  }, [isOpen, isAddMode, tag]);

  async function handleSave() {
    const t: Tag = {
      name: tagName ?? "",
      color: tagColor ?? DEFAULT_COLOR
    }

    tag
      ? await updateTag.mutateAsync({ id: tag!.tagId!, data: t })
      : await addTag.mutateAsync(t);

    if (tag ? updateTag.error == null : addTag.error == null) {
      onOpenChange(false);
    };
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="apple-safe-area max-w-screen-sm mx-auto">
        <DrawerHeader>
          <div className="flex flex-row justify-between items-center">
            <DrawerTitle>
              { isAddMode ? "Create tag" : "Update tag" }
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
            <Label htmlFor="tagName">Tag Name</Label>
            <Input
              id="tagName"
              placeholder="Move, Vacation, ..." value={tagName}
              onChange={(e) => setTagName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagColor">Tag Color</Label>
            <div className="flex flex-row items-center gap-3">
              <Input
                id="tagColor"
                type="color"
                className="h-10 w-16 p-1"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)} />
              <span className="text-sm text-muted-foreground">{tagColor}</span>
            </div>
          </div>
        </div>

        <DrawerFooter className="mt-10">
          <Button onClick={() => handleSave()} disabled={addTag.isPending || updateTag.isPending}>
            {(addTag.isPending || updateTag.isPending) && <Spinner />}
            {(addTag.isPending || updateTag.isPending) ? (isAddMode ? "Creating" : "Updating") : (isAddMode ? "Create" : "Update")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
