import * as React from "react"
import { Scroll, Sheet } from "@silk-hq/components"

import { cn } from "@/lib/utils"

type DrawerProps = Omit<
  React.ComponentProps<typeof Sheet.Root>,
  "defaultPresented" | "license" | "onPresentedChange" | "presented"
> & {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

function Drawer({
  className,
  defaultOpen,
  onOpenChange,
  open,
  ...props
}: DrawerProps) {
  return (
    <Sheet.Root
      data-slot="drawer"
      license="non-commercial"
      sheetRole="dialog"
      className={cn("contents", className)}
      defaultPresented={defaultOpen}
      presented={open}
      onPresentedChange={onOpenChange}
      {...props}
    />
  )
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof Sheet.Trigger>) {
  return <Sheet.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof Sheet.Portal>) {
  return <Sheet.Portal {...props} />
}

function DrawerClose({
  ...props
}: Omit<React.ComponentProps<typeof Sheet.Trigger>, "action">) {
  return (
    <Sheet.Trigger
      data-slot="drawer-close"
      action="dismiss"
      {...props}
    />
  )
}

function DrawerOverlay({
  className,
  travelAnimation = { opacity: [0, 0.5] },
  ...props
}: React.ComponentProps<typeof Sheet.Backdrop>) {
  return (
    <Sheet.Backdrop
      data-slot="drawer-overlay"
      className={cn("bg-black", className)}
      travelAnimation={travelAnimation}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Sheet.Content>) {
  return (
    <DrawerPortal>
      <Sheet.View
        data-slot="drawer-view"
        className="z-50 h-[var(--silk-100-lvh-dvh-pct)]"
        nativeEdgeSwipePrevention
      >
        <DrawerOverlay />
        <Sheet.Content
          data-slot="drawer-content"
          className={cn(
            "relative grid h-auto max-h-[calc(var(--silk-100-lvh-dvh-pct)-1rem)] w-full max-w-screen-sm grid-rows-[auto_minmax(0,1fr)]",
            className
          )}
          {...props}
        >
          <Sheet.BleedingBackground
            data-slot="drawer-bleeding-background"
            className="rounded-t-xl border-t bg-background shadow-lg"
          />
          <Sheet.Handle
            data-slot="drawer-handle"
            action="dismiss"
            className="mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full bg-muted p-0"
            aria-label="Dismiss drawer"
          />
          <Scroll.Root className="min-h-0">
            <Scroll.View
              data-slot="drawer-scroll"
              className="h-full overscroll-contain"
            >
              <Scroll.Content className="flex min-h-full flex-col">
                {children}
              </Scroll.Content>
            </Scroll.View>
          </Scroll.Root>
        </Sheet.Content>
      </Sheet.View>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-0.5 p-4 text-center md:gap-1.5 md:text-left",
        className
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof Sheet.Title>) {
  return (
    <Sheet.Title
      data-slot="drawer-title"
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof Sheet.Description>) {
  return (
    <Sheet.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
