import { Controller, useFormContext } from 'react-hook-form';

import { Input } from '../ui/input';
import { Field, FieldError, FieldLabel } from '../ui/field';

function RHFInput({ name, label, placeholder }: { name: string; label: string; placeholder?: string }) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="form-rhf-demo-title">{label}</FieldLabel>
          <Input {...field} placeholder={placeholder || 'Nhập'} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    ></Controller>
  );
}

export default RHFInput;
