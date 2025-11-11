'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type HistoryItem = {
  id: number;
  oldStatus: string | null;
  newStatus: string;
  oldUnitId: number | null;
  newUnitId: number | null;
  createdAt: string;
};

type ShareApi = {
  request: {
    id: number;
    theme: string;
    question: string;
    status: string;
    toSend: string | null;
    createdAt: string;
    updatedAt: string;
    assignedUnitId: number | null;
    unitName: string | null;
  };
  history: HistoryItem[];
  expiresAt: string | null;
};

const statusLabel: Record<string, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  completed: 'Выполнена',
  closed: 'Закрыта',
};

const fmt = (s: string) =>
  new Date(s).toLocaleString('ru-RU', {
    year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });

export default function ShareClient() {
  const search = useSearchParams();
  const token = useMemo(() => search.get('token') ?? '', [search]);

  const [data, setData] = useState<ShareApi | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!token) {
        setErr('missing_token');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`/api/v1/share/${encodeURIComponent(token)}`, { cache: 'no-store' });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j?.error || `HTTP ${res.status}`);
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
    return () => { alive = false; };
  }, [token]);

  if (loading) return null;

  if (err || !data) {
    const msg =
      err === 'link_expired'
        ? 'Срок действия ссылки истёк.'
        : err === 'missing_token'
        ? 'Токен не передан.'
        : 'Ссылка не найдена или истекла.';
    return (
      <main className="max-w-3xl mx-auto p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <div className="font-semibold mb-1">Ссылка недоступна</div>
          <div className="text-sm">{msg}</div>
        </div>
      </main>
    );
  }

  const { request, history, expiresAt } = data;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">{request.theme}</h1>
        <div className="text-sm text-gray-500">
          №{request.id} • создано {fmt(request.createdAt)}
          {request.unitName ? <> • ведомство: {request.unitName}</> : null}
        </div>
        <div className="inline-flex items-center gap-2 mt-2">
          <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-sm font-medium">
            Текущий статус: {statusLabel[request.status] ?? request.status}
          </span>
          {expiresAt && (
            <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 text-sm">
              Ссылка действует до {fmt(expiresAt)}
            </span>
          )}
        </div>
      </header>

      <section className="rounded-lg border border-gray-200 p-4 bg-white">
        <div className="text-sm text-gray-500 mb-2">Ваш вопрос</div>
        <p className="whitespace-pre-wrap text-gray-900">{request.question}</p>
      </section>

      <section className="rounded-lg border border-gray-200 p-4 bg-white">
        <div className="text-sm text-gray-500 mb-3">История статусов</div>
        <ol className="relative border-s border-gray-200 pl-4 space-y-4">
          <li className="ms-2">
            <div className="absolute -start-[7px] mt-1 w-3 h-3 rounded-full bg-gray-300" />
            <div className="text-sm text-gray-700">Создано ({fmt(request.createdAt)})</div>
          </li>
          {history.length
            ? history.slice().reverse().map(h => (
                <li key={h.id} className="ms-2">
                  <div className="absolute -start-[7px] mt-1 w-3 h-3 rounded-full bg-blue-400" />
                  <div className="text-sm text-gray-800">
                    {(statusLabel[h.oldStatus ?? ''] ?? h.oldStatus ?? '—')} →{' '}
                    <span className="font-medium">{statusLabel[h.newStatus] ?? h.newStatus}</span>{' '}
                    <span className="text-gray-500">({fmt(h.createdAt)})</span>
                  </div>
                </li>
              ))
            : (
              <li className="ms-2">
                <div className="absolute -start-[7px] mt-1 w-3 h-3 rounded-full bg-gray-300" />
                <div className="text-sm text-gray-600">Пока без изменений</div>
              </li>
            )}
        </ol>
      </section>
    </main>
  );
}
