import React, { useMemo } from "react";
import { ResponsiveContainer, Area, AreaChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ChartData {
  date: string;
  [key: string]: string | number;
}

interface SummaryCardProps<T extends ChartData = ChartData> {
  title: React.ReactNode;
  value: React.ReactNode;
  
  // Mini chart data
  rawChartData?: T[];
  valueField?: keyof T;
  chartColor?: string;
  
  // Interactive props
  isActive?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
}

interface TrendData {
  direction: 'up' | 'down' | 'neutral';
  percentage: number;
  isPositive: boolean;
}

function calculateTrend<T extends ChartData>(
  data: T[],
  valueField: keyof T
): TrendData | null {
  if (data.length < 2) return null;
  
  const firstValue = Number(data[0][valueField]);
  const lastValue = Number(data[data.length - 1][valueField]);
  
  if (firstValue === 0) return null;
  
  const percentageChange = ((lastValue - firstValue) / firstValue) * 100;
  const absPercentage = Math.abs(percentageChange);
  
  let direction: 'up' | 'down' | 'neutral' = 'neutral';
  if (absPercentage > 0) {
    direction = percentageChange > 0 ? 'up' : 'down';
  }
  
  return {
    direction,
    percentage: absPercentage,
    isPositive: percentageChange > 0
  };
}

const SummaryCard = React.memo(<T extends ChartData = ChartData>({ 
  title, 
  value, 
  rawChartData,
  valueField,
  chartColor = "var(--chart-1)",
  isActive = false,
  onClick,
  isLoading = false
}: SummaryCardProps<T>) => {
  const trendData = useMemo(() => 
    rawChartData && valueField 
      ? calculateTrend(rawChartData, valueField)
      : null,
    [rawChartData, valueField]
  );

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-200 group py-4 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-primary/20' : ''
      } ${
        isActive 
          ? 'border-primary/50 shadow-md ring-2 ring-primary/20' 
          : 'hover:border-primary/10'
      }`}
      onClick={onClick}
    >
      {rawChartData && rawChartData.length > 0 && valueField && (
        <div className="absolute bottom-0 right-0 left-0 h-16 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity duration-200 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rawChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey={valueField as string}
                stroke={chartColor} 
                strokeWidth={2} 
                fill={`url(#gradient-${title})`}
                dot={false}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <CardContent className="relative z-10 space-y-0 px-4 py-2">
        <div className="mb-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground tracking-tight">
            {value}
          </span>
          {trendData && trendData.direction !== 'neutral' && (
            <Badge 
              variant="outline" 
              className={`gap-1 text-xs ${
                trendData.isPositive ? 'text-green-600 border-none' : 'text-red-600 border-none'
              }`}
            >
              {trendData.direction === 'up' ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              <span>{trendData.percentage.toFixed(1)}%</span>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default SummaryCard; 