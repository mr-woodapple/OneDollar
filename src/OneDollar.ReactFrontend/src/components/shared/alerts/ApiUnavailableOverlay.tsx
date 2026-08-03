import { CircleAlertIcon } from "lucide-react";

interface ApiUnavailableOverlayProps {
  isOpen: boolean;
}

export default function ApiUnavailableOverlay({ isOpen }: ApiUnavailableOverlayProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="api-unavailable-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/60 p-6 backdrop-blur-md"
    >
      <div className="flex max-w-sm items-center gap-3 rounded-lg bg-red-600 px-5 py-4 text-white shadow-xl">
        <CircleAlertIcon aria-hidden="true" className="size-5 shrink-0" />

        <div>
          <p id="api-unavailable-title" className="font-semibold">
            The API is currently unavailable.
          </p>
          <p className="text-sm text-white/80">
            Trying to reconnect
            <span aria-hidden="true" className="inline-flex">
              <span className="animate-pulse [animation-delay:-0.4s] [animation-duration:1.2s]">.</span>
              <span className="animate-pulse [animation-delay:-0.2s] [animation-duration:1.2s]">.</span>
              <span className="animate-pulse [animation-duration:1.2s]">.</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
