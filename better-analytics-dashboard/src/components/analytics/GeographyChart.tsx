import { GeoVisitor } from '@/entities/geography';
import { useState } from 'react';
import {
  BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Label,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CountryFlagTick } from './CountryFlagTick';
import { alpha3ToAlpha2, getName } from 'i18n-iso-countries';
import DropdownSelect from '@/components/DropdownSelect';
import { capitalize } from '@/lib/utils';
import { FileChartColumnIcon, BarChart as BarChartIcon, LineChartIcon, PieChartIcon } from 'lucide-react';

export const GeographyChartType = {
  Bar: 'bar',
  Line: 'line',
  Pie: 'pie',
} as const;

export type GeographyChartType = (typeof GeographyChartType)[keyof typeof GeographyChartType];

const chartTypeToIcon = (chartType: GeographyChartType) => {
  const className ="w-4 h-4 text-foreground";
  if (chartType === GeographyChartType.Bar) {
    return < BarChartIcon className={className} />
  } else if (chartType === GeographyChartType.Line) {
    return < LineChartIcon className={className}/>
  } else if (chartType === GeographyChartType.Pie) {
    return < PieChartIcon className={className}/>
  }
}

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
    
    // TODO: Rewrite such that we can use a single CountryFlagLabel
    const renderCountryFlagLabel = (props: any) => {
      const { x, y, index } = props;
      const countryData = data[index]; // This is the original `GeoVisitor` item
      const alpha3 = countryData.country_code;
      const flagUrl = `https://flagcdn.com/h20/${alpha3ToAlpha2(alpha3).toLowerCase()}.png`;
    
      return (
        <g transform={`translate(${x},${y})`}>
          <image
            href={flagUrl}
            x={-12}
            y={-10}
            height={18}
            width={24}
            preserveAspectRatio="xMidYMid meet"
          />
          <text
            x={0}
            y={22}
            textAnchor="middle"
            fill="#333"
            fontSize={12}
          >
            {alpha3}
          </text>
        </g>
      );
    };
  
  return (
    <div className="flex flex-col overflow-hidden" {...props}>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-1">{"Top Countries"}</h3>
          <p className="text-sm text-gray-500 mb-2">{"Value distribution by country"}</p>
        </div>
        <DropdownSelect
          defaultValue={GeographyChartType.Bar}
          label={"Diagram"}
          leftIcon={< FileChartColumnIcon className="w-4 h-4"/>}
          options={
            Object.values(GeographyChartType).map(
              (ctype) => ({ key: ctype, label: { name: capitalize(ctype), icon: chartTypeToIcon(ctype) } })
            )
          }
          onChange={(value) => setChartType(value as GeographyChartType)}
          className="w-auto h-auto"
        />
      </div>
      {chartType === GeographyChartType.Bar && (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart layout="vertical" data={filteredData} margin={{ left: 24, right: 12, bottom: 24, top: 12}}> 
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis { ...VisitorsAxisProps } >
              <Label value="Unique visitors" position="bottom" offset={0} />
            </XAxis>
            <YAxis { ...CountryAlpha3AxisProps }/>
            <Tooltip labelFormatter={(value: any) => getName(value, 'en')}/>
            <Bar dataKey="visitors" fill={hexColor} /> { }
          </BarChart>
        </ResponsiveContainer>
      )}
      {chartType === GeographyChartType.Line && (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
              <XAxis { ...CountryAlpha3AxisProps } >
              </XAxis>
              <YAxis { ...VisitorsAxisProps } />
            <Tooltip labelFormatter={(value: any) => getName(value, 'en')}/>
            <Line type="monotone" dataKey="visitors" stroke={hexColor} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
      {chartType === GeographyChartType.Pie && (
        <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            dataKey="visitors"
            nameKey="country_code"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            fill={hexColor}
            paddingAngle={2}
            label={renderCountryFlagLabel}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      )}
    </div>
  );
};

export default GeographyChart;

