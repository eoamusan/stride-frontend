import { cn } from "@/lib/utils";

export default function VarianceCard({title, description, className}) {
  return (
    <div className={cn("px-4 py-4 rounded-xl text-center", className)}>
      <h3 className="font-bold">{title}</h3>
      <p>{description}</p>
    </div>
  )
}