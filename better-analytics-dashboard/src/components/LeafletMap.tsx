'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { MapContainer, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import { scaleLinear } from 'd3-scale'
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'
import { Feature, Geometry } from 'geojson'
import { GeoVisitor } from '@/entities/geography'

interface LeafletMapProps {
  visitorData: GeoVisitor[];
  maxVisitors?: number;
}

const geoJsonOptions = {
  updateWhenIdle: true,
  buffer: 2
}

const WORLD_GEOJSON_URL = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'

// To limit how far users can pan
const MAX_WORLD_BOUNDS = L.latLngBounds(
  L.latLng(-100, -220),
  L.latLng(100, 220)
)

const LeafletMap = ({ visitorData, maxVisitors }: LeafletMapProps) => {
  const [worldGeoJson, setWorldGeoJson] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const calculatedMaxVisitors = maxVisitors || Math.max(...visitorData.map(d => d.visitors), 1)
  
  // Create a simple placeholder color scale - from dark to blue
  const colorScale = useMemo(() => {
    return scaleLinear<string>()
      .domain([0, calculatedMaxVisitors])
      .range(['#0f0f0f', '#08519c'])
  }, [calculatedMaxVisitors])

  // Load GeoJSON data
  useEffect(() => {
    setIsLoading(true)

    const fetchGeoJson = async () => {
      try {
        const worldRes = await fetch(WORLD_GEOJSON_URL)
        const world = await worldRes.json()
        setWorldGeoJson(world)
      } catch (err) {
        console.error('Error loading GeoJSON data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchGeoJson()
  }, [])
  
  // Get feature ID from GeoJSON - used to match the visitor data (like country code) to the GeoJSON data
  const getFeatureId = (feature: Feature<Geometry, any>): string | undefined => {
    if (!feature || !feature.properties) return undefined
    return feature.id ? String(feature.id) : undefined
  }
  
  // Style function for the GeoJSON layers/regions
  const styleGeoJson = (feature: Feature<Geometry, any> | undefined) => {
    if (!feature) return {}

    const featureId = getFeatureId(feature)
    const visitorEntry = visitorData.find(d => d.country_code === featureId)
    const visitors = visitorEntry ? visitorEntry.visitors : 0
    
    return {
      fillColor: colorScale(visitors),
      weight: 0.5,
      opacity: 1,
      color: '#ffffff',
      fillOpacity: visitors > 0 ? 0.8 : 0.6
    }
  }
  
  // Attached the popup shown when clicking on a country to the GeoJSON data
  const onEachFeature = (feature: Feature<Geometry, any>, layer: L.Layer) => {
    if (!feature.properties) return
    
    const featureId = getFeatureId(feature)
    const visitorEntry = visitorData.find(d => d.country_code === featureId)
    const name = feature.properties.name || 
                feature.properties.NAME || 
                'Unknown'
    const visitors = visitorEntry ? visitorEntry.visitors.toLocaleString() : '0'
    
    layer.bindPopup(`
      <div>
        <strong>${name}</strong><br/>
        Visitors: ${visitors}
      </div>
    `)
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
          <div>Loading map data...</div>
        </div>
      )}
      
      <style jsx global>{`
        .leaflet-container {
          background-color: #ffffff;
        }
      `}</style>
      
      <MapContainer 
        center={[20, 0]} 
        style={{ height: '100%', width: '100%' }}
        zoom={2} 
        zoomControl={true}
        maxBounds={MAX_WORLD_BOUNDS}
        maxBoundsViscosity={0.5}
        minZoom={1}
        maxZoom={7}
        attributionControl={false}
      >
        
        {worldGeoJson && (
          <GeoJSON 
            key={JSON.stringify(visitorData.length)} // Force re-render when data changes
            data={worldGeoJson}
            style={styleGeoJson}
            onEachFeature={onEachFeature}
            {...geoJsonOptions}
          />
        )}
      </MapContainer>
      
      {/* Legend in bottom left corner displaying color gradient of visitors */}
      <div className="info-legend" style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1000, backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
        <h4>Visitors</h4>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', marginRight: '4px' }}>0</span>
          <div style={{ 
            width: '100px', 
            height: '8px', 
            background: `linear-gradient(to right, #0f0f0f, #08519c)`,
            borderRadius: '4px',
          }}></div>
          <span style={{ fontSize: '0.75rem', marginLeft: '4px' }}>{calculatedMaxVisitors.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

// Export with dynamic import to prevent SSR issues.
// Required because Leaflet requires window and document objects which doesn't exist during server-side rendering
export default dynamic(() => Promise.resolve(LeafletMap), {
  ssr: false
}) 