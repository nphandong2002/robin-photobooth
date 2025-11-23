'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

interface rhfRangeType extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
}

export function RHFRange({ name, label, description, ...props }: rhfRangeType) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between mb-1">
            <FormLabel>{label}</FormLabel>
            <span className="text-sm text-muted-foreground">{field.value}</span>
          </div>

          <FormControl>
            <input
              type="range"
              {...props}
              value={field.value}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </FormControl>

          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
