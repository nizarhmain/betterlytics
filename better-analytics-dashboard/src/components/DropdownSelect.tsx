import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export type DropdownSelectOption = {
  key: string;
  label: { name: string; icon?: React.ReactNode },
  disabled?: boolean;
};

export type DropdownSelectProps = {
  defaultValue: string;
  label: string;
  options: DropdownSelectOption[];
  onChange?: (selectedKey: string) => void;
  leftIcon?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const DropdownSelect = ({
  defaultValue,
  label,
  options,
  onChange,
  leftIcon,
  className,
  ...props
}: DropdownSelectProps) => {
  const [selectedKey, setSelectedKey] = useState(defaultValue);

  useEffect(() => {
    setSelectedKey(defaultValue);
  }, [defaultValue]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`inline-flex items-center gap-2 rounded-none px-1.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 ${className}`}
        >
          {leftIcon}
          <span>{label}</span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={4} className="z-1000 p-0 rounded-none border-none !min-w-[auto]">
        {options.map(({ key, label, disabled }) => {
          const isSelected = key === selectedKey;
          return (
            <DropdownMenuItem
              key={key}
              disabled={disabled}
              onSelect={() => {
                if (!disabled) {
                  setSelectedKey(key);
                  onChange?.(key);
                }
              }}
              className={cn(
                'transition-colors duration-200 rounded-none px-3',
                disabled && 'bg-muted cursor-not-allowed text-muted-foreground',
                isSelected && 'bg-slate-400 font-semibold pointer-events-none',
                !disabled && !isSelected && 'hover:!bg-slate-300'
              )}
            >
              {label.icon}
              <span>{label.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownSelect;
