import { Button } from "@/components/ui/button";
import { House, Plus, UserCog } from "lucide-react";

type BottomBarProps = {
  onAddClick?: () => void;
  onShowHome: (arg0: boolean) => void;
}

export default function BottomBar({ onAddClick, onShowHome}: BottomBarProps){

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
      <div className="grid grid-cols-3 h-full justify-items-center content-center">
        <Button onClick={() => onShowHome(true)} variant="ghost" size="icon">
          <House />
        </Button>

        <Button onClick={onAddClick} className="cursor-pointer">
          <Plus />
        </Button>

        <Button onClick={() => onShowHome(false)} variant="ghost" size="icon">
          <UserCog />
        </Button>
      </div>
    </div>
  )
}