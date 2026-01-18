import { useEffect, useState } from "react";
import { BadgeMinus, BadgePlus, PiggyBank } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useAccounts } from "@/api/hooks/useAccounts";
import { useStats } from "@/lib/hooks/useStats";
import Outflows from "@/components/stats/Outflows"
import ErrorAlert from "@/components/shared/alerts/ErrorAlert";
import Incomes from "@/components/stats/Incomes";

/**
 * The statistics page component.
 */
export default function StatisticsPage() {
  // Variables for range and account picker
  const [selectedRange, setSelectedRange] = useState<"7d" | "30d" | "lastMonth">("30d");
  const [selectedAccountId, setSelectedAccountId] = useState<number>();
  
  // Hooks
  const { accounts } = useAccounts();
  const { incomeChartData, outflowChartData, totalIncome, totalOutcome } = useStats(selectedRange, selectedAccountId);

  // Calculate values for the overview outflow/income/leftover graph
  const difference = totalIncome - totalOutcome;
  const absDifference = Math.abs(difference);
  const visualizationTotal = totalIncome + totalOutcome + absDifference; // Normalize the bar so that all three values are represented proportionally

  const percentIncome = visualizationTotal === 0 ? 0 : (totalIncome / visualizationTotal) * 100;
  const percentOutcome = visualizationTotal === 0 ? 0 : (totalOutcome / visualizationTotal) * 100;
  const percentDifference = visualizationTotal === 0 ? 0 : (absDifference / visualizationTotal) * 100;

  // Initialize the selected account when data loads
  useEffect(() => {
    // Only initialize if not already selected
    if (selectedAccountId !== undefined) return;

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
  }, [accounts, selectedAccountId]);

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

        {/* Outflow/income/leftover graph */}
        <div className="financial-overview space-y-5">
          <div className="bar-wrapper h-2.5 flex flex-row bg-neutral-300 rounded-sm overflow-hidden">
            <div className="h-full bg-green-600" style={{ width: `${percentIncome}%` }}></div>
            <div className="h-full bg-red-600" style={{ width: `${percentOutcome}%` }}></div>
            <div style={{ width: `${percentDifference}%` }}></div>
          </div>

          <div className="flex flex-row grid-cols-3 space-x-5">
            <div className="w-full flex flex-col">
              <div className="text-green-600 pb-2"><BadgePlus /></div>
              <div>{totalIncome.toLocaleString('en-GB', { style: 'currency', currency: 'EUR' })}</div>
              <div className="text-sm text-muted-foreground">{ percentIncome.toFixed(2) } %</div>
            </div>

            <div className="w-full flex flex-col">
              <div className="text-red-600 pb-2"><BadgeMinus /></div>
              <div>{totalOutcome.toLocaleString('en-GB', { style: 'currency', currency: 'EUR' })}</div>
              <div className="text-sm text-muted-foreground">{ percentOutcome.toFixed(2) } %</div>
            </div>

            <div className="w-full flex flex-col">
              <div className="text-neutral-500 pb-2"><PiggyBank /></div>
              <div>{difference.toLocaleString('en-GB', { style: 'currency', currency: 'EUR' })}</div>
              <div className="text-sm text-muted-foreground">{ percentDifference.toFixed(2) } %</div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-neutral-500 pb-2 ps-4 mt-5">
        Outflows
      </div>
      <Outflows
        totalAmount={totalOutcome}
        chartData={outflowChartData} />

      <div className="text-sm text-neutral-500 pb-2 ps-4 mt-5">
        Incomes
      </div>
      <Incomes
        totalAmount={totalIncome}
        chartData={incomeChartData} />

      {/* TODO: Add Sankey diagram for general cashflow */}
    </div >
  );
}