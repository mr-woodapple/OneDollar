import { createContext, useContext, type ComponentProps, type ReactNode } from "react"
import { Scroll, Sheet } from "@silk-hq/components"
import { X } from "lucide-react"

interface DrawerProps {
  children: ReactNode
  onOpenChange: (open: boolean) => void
  open: boolean
  showCloseButton?: boolean
}

const DrawerContext = createContext<{ showCloseButton: boolean } | null>(null)

function Drawer({
  children,
  onOpenChange,
  open,
  showCloseButton = true,
}: DrawerProps) {
  return (
    <Sheet.Root
      license="non-commercial"
      presented={open}
      onPresentedChange={onOpenChange}
    >
      <DrawerContext value={{ showCloseButton }}>
        {children}
      </DrawerContext>
    </Sheet.Root>
  )
}

function DrawerContent({
  children,
  className,
  ...props
}: ComponentProps<typeof Sheet.Content>) {
  return (
    <Sheet.Portal>
      <Sheet.View
        className="BottomSheet-view z-50 h-[var(--silk-100-lvh-dvh-pct)]"
        nativeEdgeSwipePrevention
      >
        <Sheet.Backdrop
          className="bg-black"
          travelAnimation={{ opacity: [0, 0.5] }}
        />

        <Sheet.Content
          className={`BottomSheet-content relative grid h-auto max-h-[calc(var(--silk-100-lvh-dvh-pct)-1rem)] w-full max-w-screen-sm grid-rows-[auto_minmax(0,1fr)] ${className ?? ""}`}
          {...props}
        >
          <Sheet.BleedingBackground className="BottomSheet-bleedingBackground rounded-t-xl border-t bg-background shadow-lg" />

          <div className="flex w-full justify-center">
            <Sheet.Handle
              action="dismiss"
              className="mt-4 h-2 w-[100px] shrink-0 rounded-full bg-muted p-0"
              aria-label="Dismiss drawer"
            />
          </div>

          <Scroll.Root className="min-h-0 min-w-0 w-full max-w-full overflow-hidden">
            <Scroll.View className="h-full w-full max-w-full overflow-x-hidden overscroll-contain">
              <Scroll.Content className="apple-safe-area flex min-h-full min-w-0 w-full max-w-full flex-col overflow-x-hidden">
                {children}
              </Scroll.Content>
            </Scroll.View>
          </Scroll.Root>
        </Sheet.Content>
      </Sheet.View>
    </Sheet.Portal>
  )
}

function DrawerHeading({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  const context = useContext(DrawerContext)

  if (!context) {
    throw new Error("DrawerHeading must be used inside Drawer")
  }

  return (
    <div
      className={`flex min-h-17 items-center justify-between gap-4 px-5 py-4 ${className ?? ""}`}
      {...props}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {context.showCloseButton && (
        <Sheet.Trigger
          type="button"
          action="dismiss"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          aria-label="Close drawer"
        >
          <X className="size-4" />
        </Sheet.Trigger>
      )}
    </div>
  )
}

export {
  Drawer,
  DrawerContent,
  DrawerHeading,
}
