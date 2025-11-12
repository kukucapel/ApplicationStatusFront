'use client';
import { PropsWithChildren } from 'react';

export default function Pill({ children }: PropsWithChildren) {
  return <span className="pill">{children}</span>;
}
