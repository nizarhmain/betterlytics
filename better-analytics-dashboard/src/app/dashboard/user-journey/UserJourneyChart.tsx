'use client';

import { SankeyData } from "@/entities/userJourney";
import { Sankey, Rectangle, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";

interface UserJourneyChartProps {
  data: SankeyData;
}

export default function UserJourneyChart({ data }: UserJourneyChartProps) {
  const [activeLink, setActiveLink] = useState<number | null>(null);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  
  const CustomNode = (props: any) => {
    const { x, y, width, height, index, payload } = props;
    const isFirstColumn = payload.depth === 0;
    const isActive = activeNode === index || activeLink === undefined 
      ? false 
      : data.links.some(link => 
        (activeLink !== null && 
          ((link.source === index && link.target === data.links[activeLink].target) || 
          (link.target === index && link.source === data.links[activeLink].source)))
      );
    
    return (
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isFirstColumn ? "#0ea5e9" : "#64748b"}
        fillOpacity={activeLink !== null && !isActive ? 0.3 : 0.9}
        onMouseEnter={() => setActiveNode(index)}
        onMouseLeave={() => setActiveNode(null)}
      />
    );
  };
  
  const CustomLink = (props: any) => {
    const { sourceX, sourceY, sourceControlX, targetX, targetY, targetControlX, linkWidth, index } = props;
    
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
        onMouseEnter={() => setActiveLink(index)}
        onMouseLeave={() => setActiveLink(null)}
      />
    );
  };

  return (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={<CustomNode />}
          link={<CustomLink />}
          margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
          nodePadding={50}
          iterations={64}
        >
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
} 