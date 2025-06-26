'use client';

import { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  value: number;
}

export function AnimatedCounter({ value }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <span
      className={`inline-block font-mono transition-all duration-300 ease-out ${
        isAnimating ? 'scale-110 text-green-500' : 'scale-100'
      }`}
    >
      {displayValue}
    </span>
  );
}
