import { GeoVisitor } from '@/entities/geography';
import { Children, useState } from 'react';
import {
  BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Label,
} from 'recharts';
import { CountryFlagTick } from './CountryTick';

export const GeographyChartType = {
  Bar: 'bar',
  Line: 'line',
} as const;

export type GeographyChartType = (typeof GeographyChartType)[keyof typeof GeographyChartType];

type GeographyChartProps = {
  data: GeoVisitor[];
  maxCountries: number;
  hexColor: string;
  defaultChartType: GeographyChartType;
} & React.HTMLAttributes<HTMLDivElement>;

const CountryAlpha3AxisProps = {
  dataKey: 'country_code',
  type: 'category' as "number" | "category" | undefined,
  interval: 0,
  tick: <CountryFlagTick />,
  tickMargin: 0,
};

const VisitorsAxisProps = {
  dataKey: "visitors",
  type: "number" as "number" | "category" | undefined,
  doman: ['auto','auto'],
  allowDecimals: false
}

const GeographyChart = ({ data, maxCountries, hexColor, defaultChartType = GeographyChartType.Line, ...props }: GeographyChartProps) => {
  const [chartType, setChartType] = useState<GeographyChartType>(defaultChartType);

  const filteredData = data
    .sort((a, b) => {
      if (a.visitors !== b.visitors) return b.visitors - a.visitors
      return a.country_code.localeCompare(b.country_code);
    })
    .slice(0, maxCountries)


  return (
    <div className="flex flex-col" {...props}>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-1">{"Top Countries"}</h3>
          <p className="text-sm text-gray-500 mb-2">{"Value distribution by country"}</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-2">
          <select
            className="border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={chartType}
            onChange={e => setChartType(e.target.value as GeographyChartType)}
            aria-label="Select Chart Type"
          >
            {Object.values(GeographyChartType).map(ctype => (
              <option key={ctype} value={ctype}>{ctype}</option>
            ))}
          </select>
        </div>
      </div>
      {chartType === 'bar' && (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart layout="vertical" data={filteredData} margin={{ left: 24, right: 12 }}> 
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis { ...VisitorsAxisProps } />
              <Label value="Countries Alpha3" position="center" offset={-30}  angle={-90} />
            <YAxis { ...CountryAlpha3AxisProps }>
            </YAxis>
            <Tooltip />
            <Bar dataKey="visitors" fill={hexColor} /> { }
          </BarChart>
        </ResponsiveContainer>
      )}
        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
                <XAxis { ...CountryAlpha3AxisProps } >
                  <Label value="Countries Alpha3" position="center" offset={-10} angle={-90} />
                </XAxis>
                <YAxis { ...VisitorsAxisProps } />
              <Tooltip />
              <Line type="monotone" dataKey="visitors" stroke={hexColor} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
    </div>
  );
};

export default GeographyChart;