import { alpha3ToAlpha2 } from 'i18n-iso-countries';
import React, { useEffect, useRef, useState } from 'react';

export const CountryFlagTick = ({ x, y, payload }: any) => {
  const alpha3 = payload.value;
  console.log(alpha3)
  if (!alpha3) return (<div></div>);
  const flagUrl = `https://flagcdn.com/h20/${alpha3ToAlpha2(alpha3).toLowerCase()}.png`;

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
        textAnchor="end" 
        fill="#333"
      >
        {alpha3}
      </text>

      <image
        href={flagUrl}
        x={-textWidth-28}  // Position flag to the left of the text dynamically based on the text width
        y={-10}
        height={18} 
        width={24}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
};