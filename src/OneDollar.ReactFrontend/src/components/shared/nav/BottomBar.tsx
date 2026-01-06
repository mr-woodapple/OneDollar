import { ChartSpline, House, Plus, UserCog } from "lucide-react";
import { NavLink } from "react-router";

type BottomBarProps = {
  onAddClick?: () => void;
}

export default function BottomBar({ onAddClick }: BottomBarProps){

  return (
    <div className="apple-safe-area fixed bottom-0 left-0 z-50 w-full">
      {/* <div className="absolute inset-0 backdrop-blur-lg mask-[linear-gradient(to_bottom,transparent,black_75%)]  -z-10" /> */}
      <div className="flex flex-row p-4 space-x-2.5 justify-center">
        <div className="main flex flex-row bg-black rounded-full p-0.5">
          <NavLink to="/" 
            className={({ isActive }) => isActive
              ? "cursor-pointer p-4 rounded-full bg-white"
              : "cursor-pointer p-4 rounded-full text-white"
            }>
            <House />
          </NavLink>

          <NavLink to="stats" 
            className={({ isActive }) => isActive
              ? "cursor-pointer p-4 rounded-full bg-white"
              : "cursor-pointer p-4 rounded-full text-white"
            }>
            <ChartSpline />
          </NavLink>

          <NavLink to="settings" 
            className={({ isActive }) => isActive
              ? "cursor-pointer p-4 rounded-full bg-white"
              : "cursor-pointer p-4 rounded-full text-white"
            }>
            <UserCog />
          </NavLink>
        </div>

        <div className="fab bg-purple-700 hover:bg-neutral-700 rounded-full p-4.5 cursor-pointer" onClick={onAddClick}>
          <Plus color="white" />
        </div>
      </div>
    </div>
  )
}