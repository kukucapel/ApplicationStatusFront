'use client';
import { PropsWithChildren } from 'react';

export default function PageContainer({ children }: PropsWithChildren) {
  return <main className="app-container">{children}</main>;
}
