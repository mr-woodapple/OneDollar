import { ChartSpline } from "lucide-react";

export default function EmptyStats() {

  return(
    <div className="flex flex-col my-10 gap-y-5 text-center justify-center items-center">
      <div className="bg-neutral-200 p-2.5 rounded-lg">
        <ChartSpline />
      </div>
      <h2 className="text-2xl font-semibold">Looks like there's nothing here!</h2>
      <p className="text-muted-foreground">Try another date range or change the active filters.</p>
    </div>
  )
}