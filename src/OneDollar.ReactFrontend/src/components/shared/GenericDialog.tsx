import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"

interface GenericDialogProps {
  title: string;
  content: string;
  buttonCancel?: string | null;
  buttonConfirm?: string | null;
  buttonConfirmDestructive: boolean;
}

export interface GenericDialogHandle {
  openDialog: () => Promise<boolean>;
}

/**
 * Generic dialog component that can be customized.
 * 
 * @param param0 
 * @param ref 
 * @returns 
 */
function GenericDialog({
  title,
  content,
  buttonCancel,
  buttonConfirm,
  buttonConfirmDestructive,
}: GenericDialogProps, ref: ForwardedRef<GenericDialogHandle>) {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const resolverRef = useRef<((confirmed: boolean) => void) | null>(null);

  useImperativeHandle(ref, () => ({
    openDialog() {
      setIsOpen(true);
      return new Promise((resolve) => {
        resolverRef.current = resolve;
      });
    }
  }), []);

  function resolveDialog(confirmed: boolean) {
    if (resolverRef.current) {
      resolverRef.current(confirmed);
      resolverRef.current = null;
    }
    setIsOpen(false);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      resolveDialog(false);
      return;
    }

    setIsOpen(true);
  }

  const confirmButtonVariant = buttonConfirmDestructive ? "destructive" : undefined;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{ title }</AlertDialogTitle>
          <AlertDialogDescription>{ content }</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => resolveDialog(false)}>{buttonCancel ?? "Cancel"}</AlertDialogCancel>
          <AlertDialogAction variant={confirmButtonVariant} onClick={() => resolveDialog(true)}>{buttonConfirm ?? "Continue"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default forwardRef(GenericDialog);
