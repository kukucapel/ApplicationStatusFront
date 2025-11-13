'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ResponseEntry, ShareApi } from '@/types/share';
import PageContainer from '@/components/PageContainer';
import SectionCard from '@/components/SectionCard';
import StatusBadge from '@/components/StatusBadge';
import Pill from '@/components/Pill';
import { Timeline, TimelineItem } from '@/components/Timeline';
import ErrorAlert from '@/components/ErrorAlert';
import { fmt } from '@/lib/date';
import { statusLabel } from '@/lib/status';
import { useUiShell } from '@/components/UiShell';
import { Star } from 'lucide-react';
import Button from '@/ui/Button';
import Raiting from '@/ui/Raiting';
import ModalMainBody from '@/ui/Modal';
import Modal from '@/ui/Modal';
import ModalBodyResponse from '@/ui/ModalBodyResponse';

export default function ShareClient() {
    const search = useSearchParams();
    const token = useMemo(() => search.get('token') ?? '', [search]);

    const [data, setData] = useState<ShareApi | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState<Record<number, number>>({});
    const [modalInvite, setModalInvite] = useState<ResponseEntry | null>(null);

    // управление видимостью хедера
    const { setShowHeader } = useUiShell?.() ?? {
        setShowHeader: (_: boolean) => {},
    };

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

                const res = await fetch(
                    `http://192.168.137.161:5000/api/v1/user/share/${encodeURIComponent(
                        token
                    )}`,
                    { cache: 'no-store' }
                );
                if (!res.ok) {
                    const j = await res.json().catch(() => ({}));
                    const message = j?.error || `HTTP ${res.status}`;
                    if (alive && message === 'link_expired')
                        setShowHeader(false);
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

        return () => {
            alive = false;
            setShowHeader(true);
        };
    }, [token, setShowHeader]);

    useEffect(() => {
        if (!data?.responses) return;

        const newRatings: Record<number, number> = {};

        data.responses.forEach((res) => {
            newRatings[res.id] = res.rating || 0;
        });

        setRating(newRatings);
    }, [data]);

    if (loading) return null;

    if (err || !data) {
        const msg =
            err === 'link_expired'
                ? 'Срок действия ссылки истёк.'
                : err === 'missing_token'
                ? ''
                : 'Ссылка не найдена или истекла.';

        return <ErrorAlert>{msg}</ErrorAlert>;
    }
    const {
        request,
        history,
        expiresAt,
        responses = [],
        attachments = [],
    } = data;
    // setResponses(data.responses || []);

    const handleSetRating = (id: number, value: number) => {
        setRating((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmitChoise = async (id: number, value: 'yes' | 'no') => {
        const res = await fetch(
            `http://192.168.137.161:5000/api/v1/user/share/${encodeURIComponent(
                token
            )}/choice`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    responseId: id,
                    select: value,
                }),
                cache: 'no-store',
            }
        );
    };

    const handleSubmitRaiting = async (
        id: number,
        score: number,
        index: number
    ) => {
        const res = await fetch(
            `http://192.168.137.161:5000/api/v1/user/requests/ratings/external/share/${encodeURIComponent(
                token
            )}/responses/${id}/rating`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    score: score,
                }),
                cache: 'no-store',
            }
        );
        if (res.ok) {
            setData((prev) => {
                if (!prev || !prev.responses) return prev; // если данных нет — ничего не делаем

                // создаём новую копию массива responses
                const updatedResponses = prev.responses.map((res, i) =>
                    i === index ? { ...res, rating: score } : res
                );

                // возвращаем новый объект состояния
                return { ...prev, responses: updatedResponses };
            });
        }
    };
    return (
        <PageContainer>
            {/* Заголовок заявки */}
            <header className="space-y-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[--ink-900]">
                    {request.theme}
                </h1>

                <div className="text-sm text-[--ink-700]">
                    №{request.id} • создано {fmt(request.createdAt)}
                    {request.unitName ? (
                        <> • ведомство: {request.unitName}</>
                    ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                    <StatusBadge value={request.status} />
                    {expiresAt && (
                        <Pill>Ссылка действует до {fmt(expiresAt)}</Pill>
                    )}
                </div>
            </header>

            <div className="mt-6 space-y-10">
                {/* Вопрос */}
                <SectionCard
                    title="Ваш вопрос"
                    subtitle={
                        <span>
                            Последнее обновление: {fmt(request.updatedAt)}
                        </span>
                    }
                >
                    <p className="whitespace-pre-wrap leading-relaxed text-[--ink-900]">
                        {request.question || '—'}
                    </p>
                </SectionCard>
                <SectionCard title="Тип обращения">
                    {request.toSend ? (
                        <div className="prose prose-sm max-w-none text-[--ink-900] whitespace-pre-wrap">
                            {request.toSend}
                        </div>
                    ) : (
                        <div className="text-sm text-[--ink-700]">
                            Ответ ещё не предоставлен.
                        </div>
                    )}
                </SectionCard>

                {modalInvite && (
                    <Modal
                        title={'Детали ответа'}
                        onClose={() => setModalInvite(null)}
                    >
                        <ModalBodyResponse
                            handleSubmitChoise={handleSubmitChoise}
                            response={modalInvite}
                        />
                    </Modal>
                )}

                {/* Ответ (если есть) */}
                {responses.length > 0 && (
                    <SectionCard title="Комментарии ведомства">
                        <ul className="space-y-3">
                            {responses.slice().map((r, index) => (
                                <li
                                    key={r.id}
                                    onClick={() => {
                                        setModalInvite(r);
                                    }}
                                    className={`border ${
                                        r.type === 'invite'
                                            ? 'border-orange-400'
                                            : r.type === 'invite_yes'
                                            ? 'border-green-300'
                                            : r.type === 'invite_no'
                                            ? 'border-red-300'
                                            : 'border-gray-300'
                                    } items-center justify-between  rounded-lg p-4 hover:shadow-md transition-shadow flex bg-white`}
                                >
                                    <div>
                                        <div className="text-sm text-[--ink-700] mb-1">
                                            {fmt(r.createdAt)}
                                        </div>
                                        <div className="text-[--ink-900] hidden md:block whitespace-pre-wrap">
                                            {r.comment}
                                        </div>
                                        <div className="text-[--ink-900] md:hidden block whitespace-pre-wrap">
                                            {r.type === 'none_invite'
                                                ? 'Промежуточный ответ'
                                                : 'Приглашение на личный приём'}
                                        </div>
                                    </div>

                                    <div className="hidden md:block">
                                        {r.rating === null ? (
                                            <Raiting
                                                type="set"
                                                handleSetRating={
                                                    handleSetRating
                                                }
                                                handleSubmit={() => {
                                                    handleSubmitRaiting(
                                                        r.id,
                                                        rating[r.id],
                                                        index
                                                    );
                                                }}
                                                rating={rating}
                                                id={r.id}
                                            />
                                        ) : (
                                            <Raiting
                                                type="view"
                                                responseRating={r.rating}
                                            />
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </SectionCard>
                )}

                {/* Вложения */}
                {attachments.length > 0 && (
                    <SectionCard
                        title="Вложения"
                        subtitle={<span>{attachments.length} шт.</span>}
                    >
                        <ul className="grid gap-3 sm:grid-cols-2">
                            {attachments.map((a) => (
                                <li
                                    key={a.id}
                                    className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                                >
                                    <div className="text-sm text-[--ink-700] mb-1">
                                        Загружено {fmt(a.createdAt)}
                                    </div>
                                    <a
                                        href={a.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-[color:var(--brand-700)] underline underline-offset-4 hover:opacity-80"
                                    >
                                        Открыть документ
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </SectionCard>
                )}

                {/* История */}
                <SectionCard title="История статусов">
                    <Timeline>
                        <TimelineItem>
                            <div className="text-sm text-[--ink-900]">
                                Создано{' '}
                                <span className="text-[--ink-700]">
                                    ({fmt(request.createdAt)})
                                </span>
                            </div>
                        </TimelineItem>

                        {history.length ? (
                            history
                                .slice()
                                .reverse()
                                .filter((h) => h.oldStatus !== h.newStatus)
                                .map((h) => (
                                    <TimelineItem key={h.id}>
                                        <div className="text-sm text-[--ink-900]">
                                            {statusLabel[h.oldStatus ?? ''] ??
                                                h.oldStatus ??
                                                '—'}{' '}
                                            →{' '}
                                            <span className="font-medium">
                                                {statusLabel[h.newStatus] ??
                                                    h.newStatus}
                                            </span>{' '}
                                            <span className="text-[--ink-700]">
                                                ({fmt(h.createdAt)})
                                            </span>
                                        </div>
                                    </TimelineItem>
                                ))
                        ) : (
                            <TimelineItem>
                                <div className="text-sm text-[--ink-700]">
                                    Пока без изменений
                                </div>
                            </TimelineItem>
                        )}
                    </Timeline>
                </SectionCard>
            </div>
        </PageContainer>
    );
}
