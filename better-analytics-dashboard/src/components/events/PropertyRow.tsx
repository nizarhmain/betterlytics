import { ChevronDown, ChevronRight } from 'lucide-react';
import { EventPropertyAnalytics } from "@/entities/events";
import { PropertyValueBar } from './PropertyValueBar';

interface PropertyRowProps {
  property: EventPropertyAnalytics;
  isExpanded: boolean;
  onToggle: () => void;
}

export function PropertyRow({ property, isExpanded, onToggle }: PropertyRowProps) {
  const hasValues = property.topValues.length > 0;
  
  return (
    <div className="relative">
      <div 
        className={`flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
          isExpanded ? 'bg-primary/10 border border-primary/20' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          {hasValues ? (
            isExpanded ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )
          ) : (
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          )}
        </div>
        
        <div className="flex-1 flex items-center justify-between">
          <span className="font-medium text-foreground">{property.propertyName}</span>
          <span className="text-sm text-muted-foreground">
            {property.totalOccurrences.toLocaleString()}
          </span>
        </div>
      </div>

      {isExpanded && hasValues && (
        <div className="ml-8 space-y-3 mt-4">
          {property.topValues.map((value, index) => (
            <PropertyValueBar key={index} value={value} />
          ))}
          
          {property.uniqueValueCount > property.topValues.length && (
            <div className="flex items-center gap-3 py-1.5 px-3 text-xs text-muted-foreground">
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              </div>
              <span>+{property.uniqueValueCount - property.topValues.length} more values</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 