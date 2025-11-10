import { ChevronLeft } from "lucide-react";

export default function NumPad() {

  return(
    <>
      <div className="grid grid-cols-3 gap-2.5">
        
        <NumPadButton value="1" />
        <NumPadButton value="2" />
        <NumPadButton value="3" />
        <NumPadButton value="4" />
        <NumPadButton value="5" />
        <NumPadButton value="6" />
        <NumPadButton value="7" />
        <NumPadButton value="8" />
        <NumPadButton value="9" />
        <NumPadButton value="," />
        <NumPadButton value="0" />
        <NumPadButton value={<ChevronLeft />} />
      </div>
    </>
  )
}

import React from "react";

interface NumPadButtonProps {
  value: string | React.ReactNode;
}

export function NumPadButton({ value }: NumPadButtonProps) {

  return(
    <div className="bg-neutral-200 rounded-3xl h-12 grid place-items-center cursor-pointer hover:bg-neutral-300 click">
      {value}
    </div>
  )
}