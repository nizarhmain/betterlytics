import { GeoVisitor } from '@/entities/geography';
import {
  BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export const GeographyChartType = {
  Bar: 'bar',
  Line: 'line',
} as const;

export type GeographyChartType = (typeof GeographyChartType)[keyof typeof GeographyChartType];

type GeographyChartProps = {
  chartType: GeographyChartType;
  data: GeoVisitor[];
} & React.HTMLAttributes<HTMLDivElement>; 

const GeographyChart = ({ data, chartType = GeographyChartType.Line, ...props }: GeographyChartProps)=> {
  const MAX_COUNTRIES_TO_DISPLAY = 10;
  
  const filteredData = data
    .sort((a, b) => {
      if (a.visitors !== b.visitors) return b.visitors - a.visitors
      return a.country_code.localeCompare(b.country_code);
    })
    .slice(0, MAX_COUNTRIES_TO_DISPLAY)
  
  return (
    <div {...props}>
      <h3 className="text-lg font-semibold mb-1">{"Top Countries"}</h3>
      <p className="text-sm text-gray-500 mb-2">{"Value distribution by country"}</p>

      {chartType === 'bar' && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart layout="vertical" data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="country_code" type="category" interval={0} />
            <Tooltip />
            <Bar dataKey="visitors" fill="#0ea5e9" /> {/* Tailwind blue-500 */}
          </BarChart>
        </ResponsiveContainer>
      )}
      {chartType === 'line' && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country_code" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="visitors" stroke="#0ea5e9" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GeographyChart;