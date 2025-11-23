'use client';

import * as z from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Button } from 'src/shared/components/ui/button';
import { FormError, FormProvider, RHFInput } from 'src/shared/components/hook-form';

const formSchema = z.object({
  code: z.string().length(6, 'Mã phòng phải có đúng 6 ký tự'),
});

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = form.handleSubmit(async (valueForm) => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: valueForm.code.toUpperCase().trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Mã phòng không hợp lệ');
        return;
      }

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
      <RHFInput
        name="code"
        label="Nhập mã phòng để tham gia"
        className="w-full px-4 py-3 text-center text-2xl font-bold uppercase tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
        placeholder="Nhập mã phòng"
      />
      <Button type="submit" className="my-2 w-full" disabled={loading}>
        {loading ? 'Đang tham gia...' : 'Tham gia phòng'}
      </Button>
      {session?.user && (
        <Button variant="outline" type="button" className="w-full" onClick={() => router.push('/create-room')}>
          Tạo phòng mới
        </Button>
      )}
    </FormProvider>
  );
}
