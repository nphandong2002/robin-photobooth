import * as z from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

import { FieldGroup } from 'src/sections/components/ui/field';
import RHFInput from 'src/sections/components/hook-form/rhf-input';

const formSchema = z.object({
  code: z.string().length(6, 'Mã phòng phải có đúng 6 ký tự'),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {};
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <RHFInput name="code" label="Mã phòng" placeholder="Nhập mã phòng" />
      </FieldGroup>
    </form>
  );
}
