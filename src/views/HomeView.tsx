import Balance from "@/components/home/Balance";
import TransactionList from "@/components/home/TransactionList";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";

export default function HomeView() {

  return (
    <div className="m-5">
      <div className="header flex justify-center">
        <Select defaultValue="privateAccount">
          <SelectTrigger className="border-0 shadow-none focus-visible:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="privateAccount">Private Account</SelectItem>
              <SelectItem value="sharedAccount">Shared Account</SelectItem>
              <SelectItem value="debitCard">Debit Card</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Balance />
      <TransactionList />
    </div>
  )
}