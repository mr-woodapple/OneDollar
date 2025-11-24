import { Boxes } from "lucide-react";

export default function EmptyCategories() {

  return (
    <div className="flex flex-col my-10 gap-y-5 text-center justify-center items-center">
      <div className="bg-neutral-200 p-2.5 rounded-lg">
        <Boxes />
      </div>
      <h2 className="text-2xl font-semibold">Shhh, there's nothing here...</h2>
      <p className="text-muted-foreground">We couldn't find any categories, please create one first!</p>
    </div>
  )
}