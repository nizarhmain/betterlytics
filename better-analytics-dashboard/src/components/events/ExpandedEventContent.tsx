import { Hash } from 'lucide-react';
import { EventTypeRow } from "@/entities/events";
import { PropertyRow } from './PropertyRow';
import { useDashboardId } from '@/hooks/use-dashboard-id';
import { useEventProperties } from '@/hooks/use-event-properties';
import { QueryFilter } from '@/entities/filter';
import { Spinner } from '@/components/ui/spinner';

interface ExpandedEventContentProps {
  event: EventTypeRow;
  expandedProperties: Set<string>;
  onToggleProperty: (propertyName: string) => void;
  startDate: Date;
  endDate: Date;
  queryFilters: QueryFilter[];
}

export function ExpandedEventContent({
  event,
  expandedProperties,
  onToggleProperty,
  startDate,
  endDate,
  queryFilters,
}: ExpandedEventContentProps) {
  const dashboardId = useDashboardId();
  const { data: propertiesData, isLoading: propertiesLoading } = useEventProperties(
    dashboardId,
    event.event_name,
    startDate,
    endDate,
    queryFilters
  );

  return (
    <div className="bg-muted/20 border-l-2 border-primary/30">
      {propertiesLoading ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="relative">
            <Spinner size="sm" />
          </div>
          <p className="text-sm text-muted-foreground">Loading properties...</p>
        </div>
      ) : propertiesData?.properties.length ? (
        <div className="py-4 pl-8 pr-6">
          <div className="space-y-4">
            {propertiesData.properties.map((property) => (
              <PropertyRow
                key={property.propertyName}
                property={property}
                isExpanded={expandedProperties.has(property.propertyName)}
                onToggle={() => onToggleProperty(property.propertyName)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 pl-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/40 mb-3">
            <Hash className="h-6 w-6 text-muted-foreground/60" />
          </div>
          <h4 className="text-sm font-medium text-foreground mb-1">No Properties</h4>
          <p className="text-xs text-muted-foreground">
            This event has no custom properties.
          </p>
        </div>
      )}
    </div>
  );
} 