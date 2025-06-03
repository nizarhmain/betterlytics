import { ChevronDown, ChevronRight } from 'lucide-react';
import { EventPropertyAnalytics } from "@/entities/events";
import { PropertyValueBar } from './PropertyValueBar';
import { cn } from '@/lib/utils';

interface PropertyRowProps {
  property: EventPropertyAnalytics;
  isExpanded: boolean;
  onToggle: () => void;
}

export function PropertyRow({ property, isExpanded, onToggle }: PropertyRowProps) {
  const hasValues = property.topValues.length > 0;
  
  return (
    <div className="space-y-3 relative">
      <div 
        className={cn(
          "flex items-center gap-3 py-2 px-3 rounded cursor-pointer transition-all duration-200",
          isExpanded ? "bg-background/30" : "hover:bg-background/25"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          {hasValues ? (
            isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200" />
            )
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
          )}
        </div>
        
        <div className="flex-1 flex items-center justify-between min-w-0">
          <span className="font-medium text-foreground text-sm">
            {property.propertyName}
          </span>
        </div>
      </div>

      {isExpanded && hasValues && (
        <>
          {/* Connecting border */}
          <div className="absolute left-[1.15rem] top-10 bottom-0 w-px bg-border/80" />
          
          <div className="ml-7 space-y-2">
            {property.topValues.map((value, index) => (
              <PropertyValueBar key={index} value={value} />
            ))}
            
            {property.uniqueValueCount > property.topValues.length && (
              <div className="flex items-center gap-2 py-1.5 px-3 text-xs text-muted-foreground">
                <span>+{property.uniqueValueCount - property.topValues.length} more</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 