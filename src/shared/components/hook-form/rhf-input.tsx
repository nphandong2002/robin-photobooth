'use client';

import { useFormContext } from 'react-hook-form';

import { Input } from '../ui/input';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

interface rhfInputType extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  name: string;
}

export function RHFInput({ name, label, description, ...props }: rhfInputType) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...props} {...field} onChange={field.onChange} value={field.value} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
}
