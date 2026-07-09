import { NavLink } from "react-router";
import { ChartSpline, House, Plus, UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";

type SidebarProps = {
  onAddClick?: () => void;
}

export default function Sidebar({ onAddClick }: SidebarProps) {
  return (
    <div className="flex flex-col h-dvh justify-center border-r p-5">
      <div className="flex flex-col gap-5">
        <NavLink to="/">
          {({ isActive }) => <BottomBarButton isActive={isActive} iconName="House" />}
        </NavLink>

        <NavLink to="stats">
          {({ isActive }) => <BottomBarButton isActive={isActive} iconName="ChartSpline" />}
        </NavLink>

        <NavLink to="settings">
          {({ isActive }) => <BottomBarButton isActive={isActive} iconName="UserCog" />}
        </NavLink>

        <Button onClick={onAddClick}>
          <Plus />
        </Button>
      </div>
    </div>
  );
}
type BottomBarButtonProps = {
  isActive?: boolean
  iconName?: "House" | "ChartSpline" | "UserCog"
}

function BottomBarButton({ isActive, iconName }: BottomBarButtonProps) {
  const props = { strokeWidth: isActive ? 3 : 2 };

  return (
    <Button variant={isActive ? "secondary" : "ghost"}>
      {iconName === "House" && <House {...props} />}
      {iconName === "ChartSpline" && <ChartSpline {...props} />}
      {iconName === "UserCog" && <UserCog {...props} />}
    </Button>
  )
}
