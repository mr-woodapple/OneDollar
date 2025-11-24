import { CreditCard } from "lucide-react";

export default function EmptyAccounts() {

  return (
    <div className="flex flex-col my-10 gap-y-5 text-center justify-center items-center">
      <div className="bg-neutral-200 p-2.5 rounded-lg">
        <CreditCard />
      </div>
      <h2 className="text-2xl font-semibold">Dusty here...</h2>
      <p className="text-muted-foreground">We couldn't find any accounts, please create one first!</p>
    </div>
  )
}