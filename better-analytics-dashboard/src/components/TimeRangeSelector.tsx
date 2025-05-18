'use client';

import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { TIME_RANGE_PRESETS, TimeRangeValue, getRangeForValue } from "@/utils/timeRanges";
import { GRANULARITY_RANGE_PRESETS, GranularityRangeValues } from "@/utils/granularityRanges";
import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function TimeRangeSelector({ className = "" }: { className?: string }) {
  const {
    range: contextRange,
    setRange: contextSetRange,
    granularity: contextGranularity,
    setGranularity: contextSetGranularity,
    setCustomDateRange: contextSetCustomDateRange,
    compareEnabled: contextCompareEnabled,
    setCompareEnabled: contextSetCompareEnabled,
    startDate: resolvedContextStartDate,
    endDate: resolvedContextEndDate,
  } = useTimeRangeContext();

  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);

  const [tempRange, setTempRange] = useState<TimeRangeValue>(contextRange);
  const [tempGranularity, setTempGranularity] = useState<GranularityRangeValues>(contextGranularity);
  
  const [tempCustomStart, setTempCustomStart] = useState<Date | undefined>(resolvedContextStartDate);
  const [tempCustomEnd, setTempCustomEnd] = useState<Date | undefined>(resolvedContextEndDate);
  const [tempCompare, setTempCompare] = useState<boolean>(contextCompareEnabled);

  useEffect(() => {
    setTempRange(contextRange);
    setTempGranularity(contextGranularity);
    setTempCustomStart(resolvedContextStartDate);
    setTempCustomEnd(resolvedContextEndDate);
    setTempCompare(contextCompareEnabled);
  }, [contextRange, contextGranularity, resolvedContextStartDate, resolvedContextEndDate, contextCompareEnabled]);

  const handleApply = () => {
    contextSetGranularity(tempGranularity);
    contextSetCompareEnabled(tempCompare);
    if (tempRange === 'custom' && tempCustomStart && tempCustomEnd) {
      contextSetCustomDateRange(tempCustomStart, tempCustomEnd);
    } else if (tempRange !== 'custom') {
      contextSetRange(tempRange);
    }
  };

  const handleQuickSelect = (value: TimeRangeValue) => {
    setTempRange(value);
    if (value !== 'custom') {
        const { startDate: presetStartDate, endDate: presetEndDate } = getRangeForValue(value);
        setTempCustomStart(presetStartDate);
        setTempCustomEnd(presetEndDate);
    }
  };
  
  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setTempCustomStart(date);
    setTempRange('custom'); 
    setIsStartDatePopoverOpen(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setTempCustomEnd(date);
    setTempRange('custom'); 
    setIsEndDatePopoverOpen(false);
  };

  const displayRangeLabel = () => {
    if (contextRange === 'custom') {
      if (resolvedContextStartDate && resolvedContextEndDate) {
        return `${format(resolvedContextStartDate, 'P')} - ${format(resolvedContextEndDate, 'P')}`;
      }
      return 'Custom Range';
    }
    const preset = TIME_RANGE_PRESETS.find(p => p.value === contextRange);
    return preset ? preset.label : 'Date Range';
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("min-w-[200px] justify-between shadow-sm", className, resolvedContextStartDate && "text-muted-foreground")}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span>{displayRangeLabel()}</span>
          </div>
          <ChevronDownIcon className={`ml-2 h-4 w-4 shrink-0 opacity-50`} /> 
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-6 space-y-6" align="end">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Quick select</h3>
          <div className="grid grid-cols-2 gap-2">
            {TIME_RANGE_PRESETS.filter(p => p.value !== 'custom').map((preset) => (
              <Button
                key={preset.value}
                variant={tempRange === preset.value ? "default" : "outline"}
                onClick={() => handleQuickSelect(preset.value)}
                className="w-full text-left justify-start"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Granularity</h3>
          <div className="flex gap-2 flex-wrap">
            {GRANULARITY_RANGE_PRESETS.map((gran) => (
              <Button
                key={gran.value}
                variant={tempGranularity === gran.value ? "default" : "outline"}
                onClick={() => setTempGranularity(gran.value)}
                className="flex-1"
              >
                {gran.label} 
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Current period</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="startDateInput">Start date</Label>
              <Popover open={isStartDatePopoverOpen} onOpenChange={setIsStartDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tempCustomStart && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tempCustomStart ? format(tempCustomStart, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tempCustomStart}
                    onSelect={handleStartDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label htmlFor="endDateInput">End date</Label>
              <Popover open={isEndDatePopoverOpen} onOpenChange={setIsEndDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tempCustomEnd && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tempCustomEnd ? format(tempCustomEnd, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tempCustomEnd}
                    onSelect={handleEndDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="comparePeriodCheckbox" 
            checked={tempCompare}
            onCheckedChange={(checked) => setTempCompare(checked as boolean)}
          />
          <Label htmlFor="comparePeriodCheckbox" className="text-sm font-normal text-gray-700">Compare with previous period</Label>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={handleApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
} 