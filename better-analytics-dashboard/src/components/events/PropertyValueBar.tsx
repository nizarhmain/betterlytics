import { EventPropertyValue } from "@/entities/events";
import { Progress } from "@/components/ui/progress";

interface PropertyValueBarProps {
  value: EventPropertyValue;
}

export function PropertyValueBar({ value }: PropertyValueBarProps) {
  return (
    <div className="relative">
      <Progress 
        value={value.percentage} 
        className="h-10 bg-muted/50 [&>div]:bg-blue-500/30 rounded-none [&>div]:rounded-none"
      />
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <span className="text-sm font-medium text-foreground font-mono">
          {value.value}
        </span>
        <span className="text-xs font-medium text-foreground">
          {value.count.toLocaleString()} ({value.percentage}%)
        </span>
      </div>
    </div>
  );
} 