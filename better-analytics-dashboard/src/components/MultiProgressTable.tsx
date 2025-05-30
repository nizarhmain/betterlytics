'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyValueBar } from "@/components/events/PropertyValueBar";

interface ProgressBarData {
  label: string;
  value: number;
}

interface TabConfig<T extends ProgressBarData> {
  key: string;
  label: string;
  data: T[];
  emptyMessage: string;
}

interface MultiProgressTableProps<T extends ProgressBarData> {
  title: string;
  tabs: TabConfig<T>[];
  defaultTab?: string;
  isLoading?: boolean;
}

function MultiProgressTable<T extends ProgressBarData>({ 
  title,
  tabs,
  defaultTab,
  isLoading = false
}: MultiProgressTableProps<T>) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key || "");

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const renderProgressList = useCallback((data: T[], emptyMessage: string) => {
    const maxVisitors = Math.max(...data.map(item => item.value), 1);

    if (data.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = (item.value / maxVisitors) * 100;
          
          return (
            <div key={item.label} className="relative group">
              <PropertyValueBar 
                value={{
                  value: `${index + 1}. ${item.label}`,
                  count: item.value,
                  percentage: Math.max(percentage, 2)
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }, []);

  const tabsList = useMemo(() => (
    <TabsList className={`grid grid-cols-${tabs.length} bg-muted/30 h-8`}>
      {tabs.map((tab) => (
        <TabsTrigger 
          key={tab.key} 
          value={tab.key} 
          className="text-xs font-medium px-3 py-1"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  ), [tabs]);

  const tabsContent = useMemo(() => (
    tabs.map((tab) => (
      <TabsContent key={tab.key} value={tab.key} className="mt-0">
        {renderProgressList(tab.data, tab.emptyMessage)}
      </TabsContent>
    ))
  ), [tabs, renderProgressList]);

  if (isLoading) {
    return (
      <Card className="border-border/50 h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin mb-2"></div>
            <p>Loading data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 h-full">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
            {tabsList}
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {tabsContent}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default React.memo(MultiProgressTable) as <T extends ProgressBarData>(
  props: MultiProgressTableProps<T>
) => React.ReactElement;