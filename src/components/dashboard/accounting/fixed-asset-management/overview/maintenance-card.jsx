import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function MaintenanceCard({title, description, className, variant, status}) {
  return (
    <div className={cn("px-8 py-4 rounded-xl", 
          variant === 'danger' && 'bg-[#830000]/10  text-[#830000]',
          variant === 'success' && 'bg-[#254C00]/10 text-[#254C00]',
          variant === 'info' && 'bg-[#FFAE4C]/10 text-[#FFAE4C]',
          variant === 'warn' && 'bg-[#1677FF]/10 text-[#1677FF]',
          className)
    }>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm">{description}</p>
        </div>
        <Badge variant={variant}>{ status }</Badge>
      </div>
    </div>
  )
}