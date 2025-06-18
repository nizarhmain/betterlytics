import { type GranularityRangeValues } from '@/utils/granularityRanges';
import { utcDay, utcHour, utcMinute } from 'd3-time';

const IntervalFunctions = {
  day: utcDay,
  hour: utcHour,
  minute: utcMinute,
} as const;

type DataToAreaChartProps<K extends string> = {
  dataKey: K;
  data: Array<{ date: string } & Record<K, number>>;
  granularity: GranularityRangeValues;
};

type ToAreaChartProps<K extends string> = DataToAreaChartProps<K> & {
  compare?: Array<{ date: string } & Record<K, number>>;
};

function dataToAreaChart<K extends string>({ dataKey, data, granularity }: ToAreaChartProps<K>) {
  // Map date to value
  const groupedData = data.reduce(
    (group, row) => {
      const key = new Date(row.date).valueOf().toString();
      return { ...group, [key]: row[dataKey] };
    },
    {} as Record<string, number>,
  );

  // Calculates upper and lower bound of time and values
  const dates = Object.keys(groupedData).map((date) => +date);
  const values = Object.values(groupedData);
  const timeSeries = {
    minTime: Math.min(...dates),
    maxTime: Math.max(...dates),
    minValue: Math.min(...values),
    maxValue: Math.max(...values),
  };

  const chartData = [];

  // Find the time interval of input based on specified granularity
  const intervalFunc = IntervalFunctions[granularity];
  // Iterate through each potential time frame
  for (
    let time = new Date(timeSeries.minTime);
    time <= new Date(timeSeries.maxTime);
    time = intervalFunc.offset(time, 1)
  ) {
    const key = time.valueOf().toString();
    // Add entry - either with data from group or default value of 0
    chartData.push({
      date: +key,
      value: groupedData[key] ?? 0,
    });
  }

  return chartData;
}

export function toAreaChart<K extends string>({ dataKey, data, compare, granularity }: ToAreaChartProps<K>) {
  const chart = dataToAreaChart({
    dataKey,
    data,
    granularity,
  });

  if (compare === undefined) {
    return chart;
  }

  const compareChart = dataToAreaChart({
    dataKey,
    data: compare,
    granularity,
  });

  if (chart.length !== compareChart.length) {
    return chart;
  }

  return chart.map((point, index) => ({
    date: point.date,
    value: [point.value, compareChart[index].value],
  }));
}
