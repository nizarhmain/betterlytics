'use client';

import { SankeyData } from "@/entities/userJourney";
import { Sankey, Rectangle, ResponsiveContainer } from "recharts";
import { useState, useRef, useEffect } from "react";

interface UserJourneyChartProps {
  data: SankeyData;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  content: {
    source: string;
    target: string;
    value: number;
  } | null;
}

export default function UserJourneyChart({ data }: UserJourneyChartProps) {
  const [activeLink, setActiveLink] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    content: null
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Reset tooltip when activeLink changes
  useEffect(() => {
    if (activeLink === null) {
      setTooltip(prev => ({ ...prev, visible: false }));
    }
  }, [activeLink]);
  
  // Global mouse move handler to ensure tooltip disappears.
  // This is to ensure the tooltip disappears when the mouse leaves the container as it sometimes doesn't trigger the onMouseLeave event for some reason
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!tooltip.visible) return;
      
      // Get container bounds
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Check if mouse is outside the container
      if (
        e.clientX < rect.left || 
        e.clientX > rect.right || 
        e.clientY < rect.top || 
        e.clientY > rect.bottom
      ) {
        setActiveLink(null);
        setTooltip(prev => ({ ...prev, visible: false }));
      }
    };
    
    if (tooltip.visible) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, [tooltip.visible]);
  
  const CustomNode = (props: any) => {
    const { x, y, width, height, index, payload } = props;
    const isFirstColumn = payload.depth === 0;
    
    return (
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isFirstColumn ? "#0ea5e9" : "#64748b"}
        fillOpacity={0.9}
      />
    );
  };
  
  const CustomLink = (props: any) => {
    const { sourceX, sourceY, sourceControlX, targetX, targetY, targetControlX, linkWidth, index, payload } = props;
    
    const handleMouseEnter = (e: React.MouseEvent) => {
      setActiveLink(index);
      
      try {
        const source = payload?.source?.name || "Unknown";
        const target = payload?.target?.name || "Unknown";
        
        const rect = containerRef.current?.getBoundingClientRect();
        const x = e.clientX - (rect?.left || 0) + 10;
        const y = e.clientY - (rect?.top || 0) - 40;
        
        setTooltip({
          visible: true,
          x, 
          y,
          content: {
            source: source,
            target: target,
            value: payload.value || 0
          }
        });
      } catch (error) {
        console.error("Error showing tooltip:", error);
      }
    };
    
    const handleMouseMove = (e: React.MouseEvent) => {
      if (activeLink === index) {
        const rect = containerRef.current?.getBoundingClientRect();
        const x = e.clientX - (rect?.left || 0) + 10;
        const y = e.clientY - (rect?.top || 0) - 40;
        
        setTooltip(prev => ({ ...prev, x, y }));
      }
    };
    
    return (
      <path
        d={`
          M${sourceX},${sourceY}
          C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
        `}
        fill="none"
        stroke={activeLink === index ? "#0ea5e9" : "#aaa"}
        strokeWidth={linkWidth}
        strokeOpacity={activeLink !== null && activeLink !== index ? 0.3 : 0.7}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
      />
    );
  };

  return (
    <div 
      className="h-[500px] w-full relative" 
      ref={containerRef}
    >
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={<CustomNode />}
          link={<CustomLink />}
          margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
          nodePadding={50}
          iterations={64}
        />
      </ResponsiveContainer>
      
      {tooltip.visible && tooltip.content && (
        <div 
          className="absolute bg-white p-2 shadow-md rounded border z-10"
          style={{ 
            left: `${tooltip.x}px`, 
            top: `${tooltip.y}px`,
            pointerEvents: 'none'
          }}
        >
          <p className="font-medium text-gray-800">
            Source: {tooltip.content.source}
            <br />
            Target: {tooltip.content.target}
          </p>
          <p className="text-sm text-gray-600">
            Count: {tooltip.content.value}
          </p>
        </div>
      )}
    </div>
  );
} 