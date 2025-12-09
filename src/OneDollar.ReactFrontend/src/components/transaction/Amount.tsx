import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";

interface AmountProps {
  amount: string;
  isExpense: boolean;
  setIsExpense: (isExpense: boolean) => void;
}

export default function Amount({ amount, isExpense, setIsExpense }: AmountProps) {
  return(
    <div className="text-center my-20">
      <div className="flex flex-row justify-center items-center">
        <Button variant="ghost" className="rounded-full w-auto h-auto" onClick={() => setIsExpense(!isExpense)}>
          {isExpense ? <Minus className="size-8 stroke-3" /> : <Plus className="size-8 stroke-3" />}     
        </Button>  
        <span className="ml-2 text-5xl font-bold">{ amount } €</span>
      </div>
    </div>
  )
}