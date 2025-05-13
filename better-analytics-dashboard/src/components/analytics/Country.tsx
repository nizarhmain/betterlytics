import React, { useEffect, useRef, useState } from 'react';
import { alpha3ToAlpha2 } from 'i18n-iso-countries';

export const CountryFlagLabel = ({
  x = 0,
  y = 0,
  payload,
  textAnchor = "end",
}: any) => {
  const alpha3 = payload?.value;
  if (!alpha3) return null;

  const alpha2 = alpha3ToAlpha2(alpha3);
  const flagUrl = `https://flagcdn.com/h20/${alpha2.toLowerCase()}.png`;

  const textRef = useRef<SVGTextElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      const bbox = textRef.current.getBBox();
      setTextWidth(bbox.width);
    }
  }, [alpha3]);

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        ref={textRef}
        x={0}
        y={5}
        dy={0}
        textAnchor={textAnchor}
        fill="#333"
      >
        {alpha3}
      </text>
      <image
        href={flagUrl}
        x={-textWidth - 28}
        y={-10}
        height={18}
        width={24}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
};

export const CountryFlagPieLabel = ({
  x = 0,
  y = 0,
  name,
}: {
  x?: number;
  y?: number;
  name?: string;
}) => {
  
  const textRef = useRef<SVGTextElement>(null);

  if (!name) return null;
  const alpha2 = alpha3ToAlpha2(name);
  const flagUrl = `https://flagcdn.com/h20/${alpha2.toLowerCase()}.png`;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        ref={textRef}
        x={0}
        y={5}
        dy={0}
        textAnchor={'center'}
        fill="#333"
      >
        {name}
      </text>
      <image
        href={flagUrl}
        x={0}
        y={-26}
        height={18}
        width={24}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
};

export function alpha3ToHue(alpha3: string): number {
  const clean = alpha3.toUpperCase();
  const A = 'A'.charCodeAt(0);

  const val =
    ((clean.charCodeAt(0) - A) * 26 * 26) +
    ((clean.charCodeAt(1) - A) * 26) +
    (clean.charCodeAt(2) - A);

  return (val % 360);
}

export function getColorFromAlpha3(alpha3: string): string {
  const hue = alpha3ToHue(alpha3);
  return `hsl(${hue}, 65%, 55%)`; 
}