'use client';

import { useEffect } from 'react';
import { FormProvider as Form, useFormContext, UseFormReturn } from 'react-hook-form';

function FormUseContext({ children }: { children: React.ReactNode }) {
  const context = useFormContext();
  let {
    formState: { errors },
  } = context;
  useEffect(() => {
    if (errors) {
      const elements = Object.keys(errors)
        .map((name) => document.getElementsByName(name)[0])
        .filter((el) => !!el);
      elements.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

      if (elements.length > 0) {
        const errorElement = elements[0];
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus({ preventScroll: true });
      }
    }
  }, [errors]);
  return <>{children}</>;
}

export function FormProvider({
  children,
  methods,
  onSubmit,
  style,
}: {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
  style?: React.CSSProperties;
}) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} style={style} className="w-full grow space-y-6">
        <FormUseContext>{children}</FormUseContext>
      </form>
    </Form>
  );
}
