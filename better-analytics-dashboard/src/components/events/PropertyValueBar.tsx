import { EventPropertyValue } from "@/entities/events";
import { formatPercentage } from "@/utils/formatters";
import { Progress } from "@/components/ui/progress";

interface PropertyValueBarProps {
  value: EventPropertyValue;
}

export function PropertyValueBar({ value }: PropertyValueBarProps) {
  return (
    <div className="relative group hover:bg-muted/20 transition-colors duration-200 rounded-sm">
      <div className="h-7 relative overflow-hidden rounded-sm">
        <Progress 
          value={Math.max(value.percentage, 2)}
          className="h-full bg-muted/30 group-hover:bg-muted/40 transition-colors duration-200 [&>div]:bg-primary/30 rounded-sm"
        />
        
        <div className="absolute inset-0 flex items-center justify-between px-3 z-10">
          <span className="text-sm font-medium text-foreground font-mono truncate">
            {value.value}
          </span>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {formatPercentage(value.percentage)}
            </span>
            <span>{value.count.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 