'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyValueBar } from '@/components/events/PropertyValueBar';

interface ProgressBarData {
  label: string;
  value: number;
}

interface TabConfig<T extends ProgressBarData> {
  key: string;
  label: string;
  data: T[];
  emptyMessage: string;
  customContent?: React.ReactNode;
}

interface MultiProgressTableProps<T extends ProgressBarData> {
  title: string;
  tabs: TabConfig<T>[];
  defaultTab?: string;
}

function MultiProgressTable<T extends ProgressBarData>({ title, tabs, defaultTab }: MultiProgressTableProps<T>) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key || '');

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const renderProgressList = useCallback((data: T[], emptyMessage: string) => {
    const maxVisitors = Math.max(...data.map((item) => item.value), 1);

    if (data.length === 0) {
      return <div className='text-muted-foreground py-12 text-center'>{emptyMessage}</div>;
    }

    return (
      <div className='space-y-2'>
        {data.map((item, index) => {
          const percentage = (item.value / maxVisitors) * 100;

          return (
            <div key={item.label} className='group relative'>
              <PropertyValueBar
                value={{
                  value: `${index + 1}. ${item.label}`,
                  count: item.value,
                  percentage: Math.max(percentage, 2),
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }, []);

  const renderTabContent = useCallback(
    (tab: TabConfig<T>) => {
      if (tab.customContent) {
        return tab.customContent;
      }

      return renderProgressList(tab.data, tab.emptyMessage);
    },
    [renderProgressList],
  );

  const tabsList = useMemo(
    () => (
      <TabsList className={`grid grid-cols-${tabs.length} bg-muted/30 h-8`}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.key} value={tab.key} className='px-3 py-1 text-xs font-medium'>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    ),
    [tabs],
  );

  const tabsContent = useMemo(
    () =>
      tabs.map((tab) => (
        <TabsContent key={tab.key} value={tab.key} className='mt-0'>
          {renderTabContent(tab)}
        </TabsContent>
      )),
    [tabs, renderTabContent],
  );

  return (
    <Card className='border-border/50 h-full'>
      <CardHeader className='pb-0'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
          <Tabs value={activeTab} onValueChange={handleTabChange} className='w-auto'>
            {tabsList}
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
          {tabsContent}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default React.memo(MultiProgressTable) as <T extends ProgressBarData>(
  props: MultiProgressTableProps<T>,
) => React.ReactElement;
