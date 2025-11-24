import { BanknoteX } from "lucide-react";

export default function EmptyTransactions() {

  return(
    <div className="flex flex-col gap-y-5 text-center h-[80vh] justify-center items-center">
      <div className="bg-neutral-200 p-2.5 rounded-lg">
        <BanknoteX />
      </div>
      <h2 className="text-2xl font-semibold">Quite empty, eh?</h2>
      <p className="text-muted-foreground">You don't have any transactions yet, create one now!</p>
    </div>
  )
}