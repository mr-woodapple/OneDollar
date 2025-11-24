import React from "react";
import { ChevronLeft } from "lucide-react";
import { NumPadButton } from "./NumPadButton";

interface NumPadProps {
  handleNumpadInput: (token: string) => void;
}

type NumpadKey = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "decimal" | "backspace";

export default function NumPad({ handleNumpadInput }: NumPadProps) {
  
  // Defining the available buttons on the numpad
  const keys: Array<{ display: React.ReactNode; token: NumpadKey; aria?: string }> = [
    { display: "1", token: "1" },
    { display: "2", token: "2" },
    { display: "3", token: "3" },
    { display: "4", token: "4" },
    { display: "5", token: "5" },
    { display: "6", token: "6" },
    { display: "7", token: "7" },
    { display: "8", token: "8" },
    { display: "9", token: "9" },
    { display: ",", token: "decimal", aria: "decimal" }, // Show comma for locale, but send a dot token to the handler
    { display: "0", token: "0" },
    { display: <ChevronLeft />, token: "backspace", aria: "backspace" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {keys.map(({ display, token, aria }, idx) => (
        <NumPadButton
          key={idx}
          value={display}
          ariaLabel={aria}
          onPress={() => handleNumpadInput(token)}
        />
      ))}
    </div>
  );
}
