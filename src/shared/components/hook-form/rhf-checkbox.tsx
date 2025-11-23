'use client';

import { useFormContext } from 'react-hook-form';
import { Checkbox } from '../ui/checkbox';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

interface rhfCheckboxType {
  name: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
}

export function RHFCheckbox({ name, label, description }: rhfCheckboxType) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-row items-start gap-3">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{label}</FormLabel>
            </div>
          </div>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
