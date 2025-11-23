'use client';

import { useFormContext } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

interface rhfRadioType {
  name: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  options: { label: string; value: string }[];
}

export function RHFRadioGroup({ name, label, description, options }: rhfRadioType) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup value={field.value} onValueChange={field.onChange}>
              {options.map((opt) => (
                <FormItem key={opt.value} className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value={opt.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{opt.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
