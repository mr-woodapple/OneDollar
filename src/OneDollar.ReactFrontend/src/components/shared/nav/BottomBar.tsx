import { Button } from "@/components/ui/button";
import { House, Plus, UserCog } from "lucide-react";

type BottomBarProps = {
  onAddClick?: () => void;
  onShowHome: (arg0: boolean) => void;
}

export default function BottomBar({ onAddClick, onShowHome}: BottomBarProps){

  return (
    <div className="apple-safe-area fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200">
      <div className="grid grid-cols-3 h-full justify-items-center content-center m-2.5">
        <Button onClick={() => onShowHome(true)} variant="ghost">
          <House />
        </Button>

        <Button onClick={onAddClick}>
          <Plus />
        </Button>

        <Button onClick={() => onShowHome(false)} variant="ghost">
          <UserCog />
        </Button>
      </div>
    </div>
  )
}