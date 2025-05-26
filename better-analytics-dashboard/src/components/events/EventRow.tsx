import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Hash } from 'lucide-react';
import { EventTypeRow, EventPropertiesOverview } from "@/entities/events";
import { fetchEventPropertiesAnalyticsAction } from "@/app/actions";
import { TableRow, TableCell } from "@/components/ui/table";
import { PropertyRow } from './PropertyRow';
import { useDashboardId } from '@/hooks/use-dashboard-id';

interface EventRowProps {
  event: EventTypeRow;
  totalEvents: number;
  isExpanded: boolean;
  expandedProperties: Set<string>;
  onToggle: () => void;
  onToggleProperty: (propertyName: string) => void;
  dashboardId: string;
  startDate: Date;
  endDate: Date;
}

export function EventRow({
  event,
  totalEvents,
  isExpanded,
  expandedProperties,
  onToggle,
  onToggleProperty,
  startDate,
  endDate,
}: EventRowProps) {
  const dashboardId = useDashboardId();

  const percentage = Math.round((event.count / totalEvents) * 100 * 100) / 100;

  const { data: propertiesData, isLoading: propertiesLoading } = useQuery<EventPropertiesOverview>({
    queryKey: ['eventProperties', dashboardId, event.event_name, startDate, endDate],
    queryFn: () => fetchEventPropertiesAnalyticsAction(dashboardId, event.event_name, startDate, endDate),
    enabled: isExpanded,
  });

  return (
    <>
      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={onToggle}>
        <TableCell>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </TableCell>
        <TableCell className="font-medium">{event.event_name}</TableCell>
        <TableCell className="text-right">{event.count.toLocaleString()}</TableCell>
        <TableCell className="text-right">{percentage}%</TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow>
          <TableCell colSpan={4} className="p-0">
            <div className="bg-gradient-to-r from-muted/30 to-muted/10 border-l-4 border-primary/20">
              {propertiesLoading ? (
                <div className="flex flex-col items-center gap-3 py-12">
                  <div className="w-8 h-8 border-4 border-accent border-t-primary rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading properties...</p>
                </div>
              ) : propertiesData?.properties.length ? (
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-1">Event Properties</h4>
                  </div>

                  <div className="space-y-1">
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
                <div className="text-center py-12">
                  <Hash className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                  <h4 className="text-sm font-medium text-foreground mb-1">No Properties Found</h4>
                  <p className="text-xs text-muted-foreground">
                    This event doesn't have any custom properties or they're empty.
                  </p>
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
} 