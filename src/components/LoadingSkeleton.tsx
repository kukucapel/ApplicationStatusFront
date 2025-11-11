// components/LoadingSkeleton.tsx
'use client';
import PageContainer from './PageContainer';

export default function LoadingSkeleton() {
  return (
    <PageContainer>
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded-lg w-4/5" />
        <div className="h-4 bg-gray-200 rounded w-2/5" />
        <div className="h-24 bg-gray-100 rounded-lg" />
        <div className="h-24 bg-gray-100 rounded-lg" />
      </div>
    </PageContainer>
  );
}
