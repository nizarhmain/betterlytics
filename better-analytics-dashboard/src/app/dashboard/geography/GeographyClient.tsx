'use client';

import { useEffect, useMemo, useState } from "react";
import LeafletMap from '@/components/LeafletMap';
import TimeRangeSelector from "@/components/TimeRangeSelector";
import { getRangeForValue } from "@/utils/timeRanges";
import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { getWorldMapData } from '@/app/actions/geography';
import { GeoVisitor } from '@/entities/geography';
import { alpha2ToAlpha3Code } from '@/utils/countryCodes';

export default function GeographyClient() {
  const [visitorData, setVisitorData] = useState<GeoVisitor[]>([]);
  const [maxVisitors, setMaxVisitors] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { range } = useTimeRangeContext();
  const { startDate, endDate } = useMemo(() => getRangeForValue(range), [range]);
  
  const siteId = 'default-site';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getWorldMapData({ siteId, startDate, endDate });
        
        // Convert alpha-2 country codes to alpha-3 for map compatibility with the current geojson data format
        const processedData = data.visitorData.map(visitor => {
          if (visitor.country_code === 'Localhost') {
            return visitor;
          }
          
          const alpha3 = alpha2ToAlpha3Code(visitor.country_code);
          
          return alpha3 ? {
            ...visitor,
            country_code: alpha3
          } : visitor;
        });
        
        setVisitorData(processedData);
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
  
  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="absolute inset-0 w-full h-full">
        <LeafletMap
          visitorData={visitorData}
          maxVisitors={maxVisitors}
        />
      </div>
      
      <div className="absolute top-4 right-4 z-[1001]">
        <div className="bg-white shadow-md rounded-md p-2">
          <TimeRangeSelector />
        </div>
      </div>
      
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