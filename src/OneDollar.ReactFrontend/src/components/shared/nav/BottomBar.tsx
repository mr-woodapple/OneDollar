import { ChartSpline, House, Plus, UserCog } from "lucide-react";

type BottomBarProps = {
  onAddClick?: () => void;
  onShowHome: (arg0: boolean) => void;
}

export default function BottomBar({ onAddClick, onShowHome}: BottomBarProps){

  return (
    <div className="apple-safe-area fixed bottom-0 left-0 z-50 w-full">
      {/* <div className="absolute inset-0 backdrop-blur-lg mask-[linear-gradient(to_bottom,transparent,black_75%)]  -z-10" /> */}
      <div className="flex flex-row p-4 space-x-2.5 justify-center">
        <div className="main flex flex-row bg-black rounded-full p-0.5">
          <div className="cursor-pointer bg-white p-4 rounded-full" onClick={() => onShowHome(true)}>
            <House />
          </div>
          <div className="cursor-pointer p-4">
            <ChartSpline color="white" />
          </div>
          <div className="cursor-pointer p-4" onClick={() => onShowHome(false)}>
            <UserCog color="white" />
          </div>
        </div>

        <div className="fab bg-purple-700 hover:bg-neutral-700 rounded-full p-4.5 cursor-pointer" onClick={onAddClick}>
          <Plus color="white" />
        </div>
      </div>
    </div>
  )
}