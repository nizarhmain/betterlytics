'use client';

import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { TIME_RANGE_PRESETS, TimeRangeValue, getRangeForValue } from "@/utils/timeRanges";
import { GRANULARITY_RANGE_PRESETS, GranularityRangeValues } from "@/utils/granularityRanges";
import React, { useState, useMemo, useEffect } from "react";
import { format, addDays, differenceInCalendarDays } from 'date-fns';
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function TimeRangeSelector({ className = "" }: { className?: string }) {
  const {
    range,
    setRange,
    granularity,
    setGranularity,
    setCustomDateRange,
    compareEnabled,
    setCompareEnabled,
    startDate,
    endDate,
    compareStartDate,
    compareEndDate,
    setCompareDateRange,
  } = useTimeRangeContext();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);
  const [isCompareStartDatePopoverOpen, setIsCompareStartDatePopoverOpen] = useState(false);
  const [isCompareEndDatePopoverOpen, setIsCompareEndDatePopoverOpen] = useState(false);

  const [tempRange, setTempRange] = useState<TimeRangeValue>(range);
  const [tempGranularity, setTempGranularity] = useState<GranularityRangeValues>(granularity);
  
  const [tempCustomStart, setTempCustomStart] = useState<Date | undefined>(startDate);
  const [tempCustomEnd, setTempCustomEnd] = useState<Date | undefined>(endDate);
  const [tempCompare, setTempCompare] = useState<boolean>(compareEnabled);
  const [tempCompareStartDate, setTempCompareStartDate] = useState<Date | undefined>(compareStartDate);
  const [tempCompareEndDate, setTempCompareEndDate] = useState<Date | undefined>(compareEndDate);

  const tempMainPeriodDurationDays = useMemo(() => {
    if (tempRange === 'custom' && tempCustomStart && tempCustomEnd) {
      return differenceInCalendarDays(tempCustomEnd, tempCustomStart) + 1;
    }
    if (tempRange !== 'custom') {
      const { startDate: presetStart, endDate: presetEnd } = getRangeForValue(tempRange);
      if (presetStart && presetEnd) {
        return differenceInCalendarDays(presetEnd, presetStart) + 1;
      }
    }
    return null;
  }, [tempRange, tempCustomStart, tempCustomEnd]);

  useEffect(() => {
    if (tempCompareStartDate && tempMainPeriodDurationDays !== null) {
      setTempCompareEndDate(addDays(tempCompareStartDate, tempMainPeriodDurationDays - 1));
    }
    // We only want to run this effect if the duration of the main period changes,
    // or if the user explicitly changes the comparison start date.
  }, [tempMainPeriodDurationDays, tempCompareStartDate]);

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (open) {
      setTempRange(range);
      setTempGranularity(granularity);
      setTempCustomStart(startDate);
      setTempCustomEnd(endDate);
      setTempCompare(compareEnabled);
      setTempCompareStartDate(compareStartDate);
      setTempCompareEndDate(compareEndDate);
    }
  };

  const handleApply = () => {
    setGranularity(tempGranularity);
    setCompareEnabled(tempCompare);
    if (tempRange === 'custom' && tempCustomStart && tempCustomEnd) {
      setCustomDateRange(tempCustomStart, tempCustomEnd);
    } else if (tempRange !== 'custom') {
      setRange(tempRange);
    }
    if (tempCompare && tempCompareStartDate && tempCompareEndDate) {
      setCompareDateRange(tempCompareStartDate, tempCompareEndDate);
    }
    setIsPopoverOpen(false);
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

  const handleCompareStartDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setTempCompareStartDate(date);
    if (tempMainPeriodDurationDays !== null) {
      setTempCompareEndDate(addDays(date, tempMainPeriodDurationDays -1 ));
    }
    setIsCompareStartDatePopoverOpen(false);
  };

  const handleCompareEndDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setTempCompareEndDate(date);
    if (tempMainPeriodDurationDays !== null) {
      setTempCompareStartDate(addDays(date, -(tempMainPeriodDurationDays -1)));
    }
    setIsCompareEndDatePopoverOpen(false);
  };

  const displayRangeLabel = () => {
    if (range === 'custom') {
      return `${format(startDate, 'P')} - ${format(endDate, 'P')}`;
    }
    const preset = TIME_RANGE_PRESETS.find(p => p.value === range);
    return preset ? preset.label : 'Date Range';
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("min-w-[200px] justify-between shadow-sm", className)}
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

        {tempCompare && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 pt-4 border-t border-gray-100">Compare to period</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="compareStartDateInput">Start date</Label>
                <Popover open={isCompareStartDatePopoverOpen} onOpenChange={setIsCompareStartDatePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !tempCompareStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempCompareStartDate ? format(tempCompareStartDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tempCompareStartDate}
                      onSelect={handleCompareStartDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1">
                <Label htmlFor="compareEndDateInput">End date</Label>
                <Popover open={isCompareEndDatePopoverOpen} onOpenChange={setIsCompareEndDatePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !tempCompareEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempCompareEndDate ? format(tempCompareEndDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tempCompareEndDate}
                      onSelect={handleCompareEndDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={handleApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
} 