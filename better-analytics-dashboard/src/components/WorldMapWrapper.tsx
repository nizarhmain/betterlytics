'use client';

import { useEffect, useState } from 'react';
import LeafletMap from './LeafletMap';
import { getWorldMapData } from '@/app/actions/geography';
import { GeoVisitor } from '@/services/geography';

interface VisitorMapWrapperProps {
  siteId: string;
  startDate: string;
  endDate: string;
}

export default function VisitorMapWrapper({
  siteId,
  startDate,
  endDate,
}: VisitorMapWrapperProps) {
  const [visitorData, setVisitorData] = useState<GeoVisitor[]>([]);
  const [maxVisitors, setMaxVisitors] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getWorldMapData({ siteId, startDate, endDate });
        setVisitorData(data.visitorData);
        setMaxVisitors(data.maxVisitors);
      } catch (err) {
        console.error('Error fetching visitor map data:', err);
        setError('Failed to load geographic visitor data');
        // Keep old data if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [siteId, startDate, endDate]);

  return (
    <div className="relative flex-1 w-full h-full">
      <LeafletMap
        visitorData={visitorData}
        maxVisitors={maxVisitors}
        height="100%"
      />
      
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-[1000]">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-t-blue-600 border-r-transparent border-b-blue-600 border-l-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-gray-700">Loading visitor data...</p>
          </div>
        </div>
      )}
      
      {!loading && error && (
        <div className="absolute bottom-4 right-4 bg-red-50 border border-red-200 rounded-md p-3 shadow-md z-[1000]">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {!loading && !error && visitorData.length === 0 && (
        <div className="absolute bottom-4 right-4 bg-amber-50 border border-amber-200 rounded-md p-3 shadow-md z-[1000]">
          <p className="text-amber-700 text-sm">No geographic data available for the selected period</p>
        </div>
      )}
    </div>
  );
} 