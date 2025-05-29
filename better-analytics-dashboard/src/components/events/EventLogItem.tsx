import React from 'react';
import { Globe, Monitor, User, ExternalLink, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EventLogEntry } from '@/entities/events';
import { formatTimeAgo } from '@/utils/dateFormatters';

const MAX_PROPERTIES_DISPLAY = 3;

interface EventLogItemProps {
  event: EventLogEntry;
  isNearEnd?: boolean;
  onRef?: (node: HTMLDivElement | null) => void;
}

const formatEventProperties = (jsonString: string) => {
  try {
    const props = JSON.parse(jsonString);
    return Object.entries(props).slice(0, MAX_PROPERTIES_DISPLAY).map(([key, value]) => (
      <Badge key={key} variant="secondary" className="text-xs font-normal">
        <span className="text-muted-foreground">{key}:</span>
        <span className="ml-1">{String(value)}</span>
      </Badge>
    ));
  } catch {
    return null;
  }
};

const formatUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname + urlObj.search;
    return path.length > 40 ? `${path.slice(0, 37)}...` : path;
  } catch {
    return url.length > 40 ? `${url.slice(0, 37)}...` : url;
  }
};

const MetadataItem = ({ icon: Icon, children, className = "" }: { 
  icon: React.ComponentType<{ className?: string }>, 
  children: React.ReactNode,
  className?: string 
}) => (
  <div className={`flex items-center gap-1.5 text-muted-foreground ${className}`}>
    <Icon className="h-3.5 w-3.5" />
    {children}
  </div>
);

export const EventLogItem = React.memo(function EventLogItem({ event, isNearEnd, onRef }: EventLogItemProps) {
  return (
    <div 
      className="group relative p-4 hover:bg-muted/40 transition-all duration-200 border-l-2 border-l-transparent hover:border-l-primary/50"
      ref={isNearEnd ? onRef : null}
    >
      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border/30">
          <Activity className="h-3.5 w-3.5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-sm leading-tight">
                {event.event_name}
              </h3>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <Badge variant="secondary" className="text-xs font-medium">
                {formatTimeAgo(new Date(event.timestamp))}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs flex-wrap">
            <MetadataItem icon={User}>
              <span className="font-mono bg-muted/60 px-1.5 py-0.5 rounded text-[10px] font-medium">
                {event.visitor_id.slice(-6)}
              </span>
            </MetadataItem>
            
            <MetadataItem icon={Monitor}> {/* TODO: Add device icon */}
              <span className="capitalize">{event.device_type}</span>
            </MetadataItem>
            
            {event.country_code && (
              <MetadataItem icon={Globe}> {/* TODO: Add flag icon */}
                <span className="uppercase font-medium">{event.country_code}</span>
              </MetadataItem>
            )}
            
            <MetadataItem icon={ExternalLink}>
              <span className="font-mono bg-muted/60 px-1.5 py-0.5 rounded text-[10px] font-medium">
                {formatUrl(event.url)}
              </span>
            </MetadataItem>
          </div>

          {event.custom_event_json && event.custom_event_json !== '{}' && (
            <div className="flex flex-wrap gap-2 pt-1">
              {formatEventProperties(event.custom_event_json)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}); 