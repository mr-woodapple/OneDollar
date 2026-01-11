import Outflows from "@/components/stats/Outflows"

export default function StatisticsPage() {

  return (
    <div className="m-5">
      <div className="text-center">Statistics</div>

      <div className="text-sm text-neutral-500 pb-2 ps-4 mt-5">
        Outflows
      </div>
      <Outflows />

      {/* TODO: Add Sankey diagram */}
    </div >
  )
}