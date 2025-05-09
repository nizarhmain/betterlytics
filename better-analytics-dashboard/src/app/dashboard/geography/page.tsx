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
    <div className="grid gap-6 w-full h-full">
      <LeafletMap visitorData={visitorData} />
    </div>
  );
} 