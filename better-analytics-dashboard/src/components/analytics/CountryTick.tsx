import { alpha3ToAlpha2 } from 'i18n-iso-countries';
import React, { useEffect, useRef, useState } from 'react';

export const CountryFlagTick = ({ x, y, payload }: any) => {
  const alpha3 = payload.value;
  const flagUrl = `https://flagcdn.com/h20/${alpha3ToAlpha2(alpha3).toLowerCase()}.png`;

  // References for the text and image elements
  const textRef = useRef<SVGTextElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  // UseEffect hook to calculate text width once it's rendered
  useEffect(() => {
    if (textRef.current) {
      const bbox = textRef.current.getBBox(); // Get bounding box of the text
      setTextWidth(bbox.width); // Set the width of the text
    }
  }, [alpha3]);

  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        ref={textRef} // Set the reference to the text element
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