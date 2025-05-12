'use client';

import { SankeyData } from "@/entities/userJourney";
import { Sankey, Rectangle, ResponsiveContainer } from "recharts";

interface UserJourneyChartProps {
  data: SankeyData;
}

export default function UserJourneyChart({ data }: UserJourneyChartProps) {
  const CustomNode = (props: any) => {
    const { x, y, width, height, payload } = props;
    
    return (
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={"#64748b"}
        fillOpacity={0.9}
      />
    );
  };

  return (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={<CustomNode />}
          link={{ stroke: "#aaa" }}
          margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
          nodePadding={50}
        />
      </ResponsiveContainer>
    </div>
  );
} 