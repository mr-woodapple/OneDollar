import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useAccounts } from "@/api/hooks/useAccounts";
import Outflows from "@/components/stats/Outflows"
import ErrorAlert from "@/components/shared/alerts/ErrorAlert";
import Incomes from "@/components/stats/Incomes";


export default function StatisticsPage() {
  const { accounts } = useAccounts();

  const [selectedRange, setSelectedRange] = useState<"7d" | "30d" | "lastMonth">("30d");
  const [selectedAccountId, setSelectedAccountId] = useState<number>();

  // TODO: Use useMemo for this?
  useEffect(() => {
    // Only initialize if not already selected
    if (selectedAccountId != undefined) return;

    // Assign the accountId to filter transactions later
    if (!accounts.isPending && !accounts.isError && accounts.data) {
      const savedId = localStorage.getItem("defaultAccount");

      if (savedId) {
        const found = accounts.data.find(a => a.accountId === Number(savedId));
        if (found) {
          setSelectedAccountId(found.accountId!);
          return;
        }
      }
      if (accounts.data.length > 0) {
        setSelectedAccountId(accounts.data[0].accountId!);
      }
    }
  });

  return (
    <div className="m-5">
      <div className="text-center">Statistics</div>

      {/* Overall stats section with expenses, income & selectors for date range and account ?? */}
      <div className="text-sm text-neutral-500 pb-2 ps-4 mt-5">
        Show data for...
      </div>
      <div className="border border-neutral-200 rounded-lg p-4 space-y-10">
        {/* Range and account selectors */}
        <div className="rangeSelector flex flex-row gap-4">
          {/* Range selector */}
          <Select defaultValue="30d" onValueChange={(v) => setSelectedRange(v as "7d" | "30d" | "lastMonth")}>
            <SelectTrigger>
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              {/* 
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="365d">365 Days</SelectItem>
                <SelectItem value="lastYear">Last Year</SelectItem>
                <SelectItem value="total">Total</SelectItem> 
              */}
            </SelectContent>
          </Select>

          {/* Account selector */}
          {
            accounts.isPending ? (<p className="dbg">Loading...</p>) :
            accounts.isError ? (<ErrorAlert error={accounts.error} />) :
            (
              <Select
                disabled={accounts.data.length === 0}
                value={selectedAccountId?.toString()}
                onValueChange={(val) => setSelectedAccountId(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Create an account first." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">All</SelectItem>
                  {accounts.data.map((acc) => (
                    <SelectItem className="cursor-pointer"
                      value={acc.accountId!.toString()} key={acc.accountId}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }
        </div>
      </div>

      <div className="text-sm text-neutral-500 pb-2 ps-4 mt-5">
        Outflows
      </div>
      <Outflows
        selectedRange={selectedRange}
        selectedAccountId={selectedAccountId} />

      <div className="text-sm text-neutral-500 pb-2 ps-4 mt-5">
        Incomes
      </div>
      <Incomes
        selectedRange={selectedRange}
        selectedAccountId={selectedAccountId} />

      {/* TODO: Add Sankey diagram for general cashflow */}
      {/* TODO: Add diagram that shows what's left for a month (like whats going in and out) */}
    </div >
  )
}