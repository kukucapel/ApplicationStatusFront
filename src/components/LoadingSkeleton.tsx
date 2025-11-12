'use client';
import PageContainer from './PageContainer';

export default function LoadingSkeleton() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="h-8 rounded-lg w-4/5 skeleton" />
        <div className="h-4 rounded w-2/5 skeleton" />
        <div className="h-24 rounded-lg skeleton" />
        <div className="h-24 rounded-lg skeleton" />
      </div>
    </PageContainer>
  );
}
