'use client';
import * as z from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Button } from 'src/shared/components/ui/button';
import { FormError, FormProvider, RHFCheckbox, RHFInput, RHFRange } from 'src/shared/components/hook-form';

const formSchema = z.object({
  title: z.string().min(6, 'Tên phòng ít nhất 6 ký tự').max(50, 'Tên phòng tối đa 50 ký tự'),
  maxMembers: z.number(),
  locked: z.boolean().optional(),
});
function CreateRoomPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: `Phòng của ${session?.user?.name || 'Người dùng'}`,
      maxMembers: 8,
      locked: false,
    },
  });
  const maxMembers = form.watch('maxMembers', 8);
  const onSubmit = form.handleSubmit(async (valueForm) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: valueForm.title.trim(),
          maxMembers: valueForm.maxMembers,
          locked: valueForm.locked,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Không thể tạo phòng');
        return;
      }

      // Chuyển đến trang phòng chụp
      router.push(`/room/${data.roomId}`);
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại');
      console.error(err);
    } finally {
      setLoading(false);
    }
  });
  return (
    <FormProvider methods={form} onSubmit={onSubmit}>
      {error && <FormError message={error} />}
      <RHFInput name="title" label="Nhập tên phòng" placeholder="Nhập tên phòng" />
      <RHFRange name="maxMembers" className="shadow-none" type="range" min="2" max="20" label="Giới hạn người dùng" />
      <RHFCheckbox name="locked" label="🔒 Khoá phòng (chỉ những người được mời mới vào)" />

      <Button type="submit" className="mt-5 w-full" disabled={loading}>
        {loading ? 'Đang tạo phòng...' : 'Tạo phòng mới'}
      </Button>
      <Button variant="outline" type="button" className="w-full" onClick={() => router.push('/')}>
        Quay lại
      </Button>
    </FormProvider>
  );
}

export default CreateRoomPage;
