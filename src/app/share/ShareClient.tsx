// app/share/ShareClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ShareApi } from '@/types/share';
import PageContainer from '@/components/PageContainer';
import SectionCard from '@/components/SectionCard';
import StatusBadge from '@/components/StatusBadge';
import Pill from '@/components/Pill';
import { Timeline, TimelineItem } from '@/components/Timeline';
import ErrorAlert from '@/components/ErrorAlert';
import { fmt } from '@/lib/date';
import { statusLabel } from '@/lib/status';
import { useUiShell } from '@/components/UiShell';

export default function ShareClient() {
  const search = useSearchParams();
  const token = useMemo(() => search.get('token') ?? '', [search]);

  const [data, setData] = useState<ShareApi | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // управление видимостью хедера
  const { setShowHeader } = useUiShell?.() ?? { setShowHeader: (_: boolean) => {} };

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!token) {
        if (alive) {
          setErr('missing_token');
          setShowHeader(false);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setErr(null);
        setShowHeader(true);

        const res = await fetch(`/api/v1/share/${encodeURIComponent(token)}`, { cache: 'no-store' });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          const message = j?.error || `HTTP ${res.status}`;
          if (alive && message === 'link_expired') setShowHeader(false);
          throw new Error(message);
        }

        const j = (await res.json()) as ShareApi;
        if (alive) setData(j);
        if (j?.request?.id) document.title = `Заявка №${j.request.id}`;
      } catch (e: any) {
        if (alive) setErr(e?.message || 'error');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    // при уходе со страницы возвращаем хедер
    return () => {
      alive = false;
      setShowHeader(true);
    };
  }, [token, setShowHeader]);

  if (loading) return null;

  if (err || !data) {
    const msg =
      err === 'link_expired'
        ? 'Срок действия ссылки истёк.'
        : err === 'missing_token'
        ? 'Токен не передан.'
        : 'Ссылка не найдена или истекла.';

    return <ErrorAlert>{msg}</ErrorAlert>;
  }

  const { request, history, expiresAt } = data;

  return (
    <PageContainer>
      {/* Заголовок заявки */}
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
          {request.theme}
        </h1>
        <div className="text-sm text-gray-500">
          №{request.id} • создано {fmt(request.createdAt)}
          {request.unitName ? <> • ведомство: {request.unitName}</> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <StatusBadge value={request.status} />
          {expiresAt && <Pill>Ссылка действует до {fmt(expiresAt)}</Pill>}
        </div>
      </header>

      <div className="mt-6 space-y-6">
        {/* Вопрос */}
        <SectionCard title="Ваш вопрос">
          <p className="whitespace-pre-wrap text-gray-900 leading-relaxed">
            {request.question}
          </p>
        </SectionCard>

        {/* Ответ (если есть) */}
        <SectionCard title="Ответ">
          {request.toSend ? (
            <div className="prose prose-sm max-w-none text-gray-900 whitespace-pre-wrap">
              {request.toSend}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Ответ ещё не предоставлен.</div>
          )}
        </SectionCard>

        {/* История */}
        <SectionCard title="История статусов">
          <Timeline>
            <TimelineItem>
              <div className="text-sm text-gray-700">
                Создано <span className="text-gray-500">({fmt(request.createdAt)})</span>
              </div>
            </TimelineItem>

            {history.length ? (
              history
                .slice()
                .reverse()
                .map((h) => (
                  <TimelineItem key={h.id} dotClass="bg-blue-400">
                    <div className="text-sm text-gray-800">
                      {(statusLabel[h.oldStatus ?? ''] ?? h.oldStatus ?? '—')} →{' '}
                      <span className="font-medium">
                        {statusLabel[h.newStatus] ?? h.newStatus}
                      </span>{' '}
                      <span className="text-gray-500">({fmt(h.createdAt)})</span>
                    </div>
                  </TimelineItem>
                ))
            ) : (
              <TimelineItem>
                <div className="text-sm text-gray-600">Пока без изменений</div>
              </TimelineItem>
            )}
          </Timeline>
        </SectionCard>
      </div>
    </PageContainer>
  );
}
