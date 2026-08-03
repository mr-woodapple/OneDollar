import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Drawer, DrawerContent, DrawerHeading } from "@/components/shared/GenericDrawer";

import type { Tag } from "@/models/Tag";
import { useTags } from "@/api/hooks/useTags";

interface EditTagProps {
  tag?: Tag;
  isAddMode: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#ec4899",
];

export default function EditTag({ tag, isAddMode, isOpen, onOpenChange }: EditTagProps) {
  const { addTag, updateTag } = useTags();

  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState(getRandomPresetColor);
  const [customColor, setCustomColor] = useState(tagColor);
  const [customPresetColor, setCustomPresetColor] = useState<string | null>(null);
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsColorDialogOpen(false);
      return;
    }
    if (isAddMode) {
      const randomColor = getRandomPresetColor();

      setTagName("");
      setTagColor(randomColor);
      setCustomPresetColor(null);
      return;
    }

    const selectedColor = tag?.color ?? getRandomPresetColor();
    setTagName(tag?.name ?? "");
    setTagColor(selectedColor);
    setCustomPresetColor(PRESET_COLORS.includes(selectedColor) ? null : selectedColor);
  }, [isOpen, isAddMode, tag]);

  async function handleSave() {
    const t: Tag = {
      name: tagName,
      color: tagColor
    }

    tag
      ? await updateTag.mutateAsync({ id: tag!.tagId!, data: t })
      : await addTag.mutateAsync(t);

    if (tag ? updateTag.error == null : addTag.error == null) {
      onOpenChange(false);
    };
  }

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeading>
            <h2 className="font-semibold">{isAddMode ? "Create tag" : "Update tag"}</h2>
          </DrawerHeading>

          <div className="px-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="tagName">Tag Name</Label>
              <Input
                id="tagName"
                placeholder="Move, Vacation, ..." value={tagName}
                onChange={(e) => setTagName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Tag Color</Label>
                <span className="text-sm text-muted-foreground">{tagColor}</span>
              </div>

              <div
                className="grid w-full items-center gap-2 px-1 py-2"
                style={{ gridTemplateColumns: "repeat(9, minmax(0, 1fr)) 1px minmax(0, 1fr)" }}>
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Select color ${color}`}
                    aria-pressed={tagColor === color}
                    className="flex aspect-square w-full items-center justify-center rounded-full ring-offset-2 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    style={{ backgroundColor: color }}
                    onClick={() => setTagColor(color)}>
                    {tagColor === color && <Check className="size-3.5 text-white" strokeWidth={3} />}
                  </button>
                ))}

                <div className="h-6 w-px shrink-0 bg-border" aria-hidden="true" />
                <button
                  type="button"
                  aria-label={customPresetColor
                    ? `Edit custom color ${customPresetColor}`
                    : "Choose a custom color"}
                  aria-pressed={customPresetColor === tagColor}
                  aria-haspopup="dialog"
                  className="flex aspect-square w-full items-center justify-center rounded-full ring-offset-2 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={customPresetColor
                    ? { backgroundColor: customPresetColor }
                    : { background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)" }}
                  onClick={() => {
                    setCustomColor(customPresetColor ?? tagColor);
                    setIsColorDialogOpen(true);
                  }}>
                  {customPresetColor === tagColor &&
                    <Check className="size-3.5 text-white" strokeWidth={3} />
                  }
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 p-4">
            <Button onClick={() => handleSave()} disabled={addTag.isPending || updateTag.isPending}>
              {(addTag.isPending || updateTag.isPending) && <Spinner />}
              {(addTag.isPending || updateTag.isPending) ? (isAddMode ? "Creating" : "Updating") : (isAddMode ? "Create" : "Update")}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Choose a custom color</AlertDialogTitle>
            <AlertDialogDescription>
              Select a color, then save it to apply it to the tag.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <HexColorPicker
            color={customColor}
            onChange={setCustomColor}
            className="w-full!" />

          <div className="text-center text-sm text-muted-foreground">{customColor}</div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setTagColor(customColor);
              setCustomPresetColor(customColor);
            }}>
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function getRandomPresetColor() {
  return PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
}
