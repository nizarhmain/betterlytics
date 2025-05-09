import React from 'react';
import WorldMapWrapper from '@/components/WorldMapWrapper';
import { addDays, format } from 'date-fns';

export const metadata = {
  title: 'Geography - Better Analytics',
  description: 'Geographic distribution of website visitors',
};

export default function GeographyPage() {
  // Default to showing data for the last 30 days for now
  // But we need to implement our regular date-picker as a hover
  const endDate = format(new Date(), 'yyyy-MM-dd');
  const startDate = format(addDays(new Date(), -30), 'yyyy-MM-dd');
  const siteId = 'default-site';
  
  return (
    <div className="h-full w-full flex flex-col">
      <WorldMapWrapper 
        siteId={siteId}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
} 