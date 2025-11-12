'use client';
import { PropsWithChildren } from 'react';
import PageContainer from './PageContainer';

export default function ErrorAlert({
  title = 'Ссылка недоступна',
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <PageContainer>
      <div className="card border-red-200 bg-red-50 p-5 text-red-800">
        <div className="font-semibold mb-1">{title}</div>
        <div className="text-sm">{children}</div>
      </div>
    </PageContainer>
  );
}
