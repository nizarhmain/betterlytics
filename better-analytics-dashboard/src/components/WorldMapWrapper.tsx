'use client';

import { useEffect, useState } from 'react';
import LeafletMap from './LeafletMap';
import { getWorldMapData } from '@/app/actions/geography';
import { GeoVisitor } from '@/services/geography';

interface VisitorMapWrapperProps {
  siteId: string;
  startDate: string;
  endDate: string;
  height?: string;
}

export default function VisitorMapWrapper({
  siteId,
  startDate,
  endDate,
  height = '500px'
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [siteId, startDate, endDate]);

  if (loading) {
    return (
      <div>
        Loading visitor map data...
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {error}
      </div>
    );
  }

  if (visitorData.length === 0) {
    return (
      <div>
        No geographic data available for the selected period
      </div>
    );
  }

  return (
    <LeafletMap
      visitorData={visitorData}
      maxVisitors={maxVisitors}
      height={height}
    />
  );
} 