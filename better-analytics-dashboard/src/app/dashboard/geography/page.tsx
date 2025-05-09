import React from 'react';
import { fetchVisitorsByGeography } from '@/services/visitorMapService';
import LeafletMap from '@/components/LeafletMap';

export const metadata = {
  title: 'Geography - Better Analytics',
  description: 'Geographic distribution of website visitors',
};

export default async function GeographyPage() {
  const visitorData = await fetchVisitorsByGeography();
  
  return (
    <div className="h-full w-full">
      <LeafletMap visitorData={visitorData} height="100%" />
    </div>
  );
} 