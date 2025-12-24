'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShareApplicationDto, ShareResponseDto } from '@/dtos/ShareDto';
import {
    getShareApplication,
    setShareInviteChoise,
    setShareRating,
} from '@/lib/share';
import formatDate from '@/lib/formatDate';
import StatusBadge from './StatusBage';
import ShareSectionCard from './ShareSectionCard';
import Raiting from '../ui/Share/Raiting';
import Modal from './ShareModal';
import ModalBodyResponse from './ShareModalResponse';
import { Timeline, TimelineItem } from './Timeline';
import { statusLabel } from '@/lib/shareStatus';
import { useRouter } from 'next/navigation';

export default function ShareClient() {
    const search = useSearchParams();
    const token = useMemo(() => search.get('token') ?? '', [search]);

    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<number | null>(null);
    const [data, setData] = useState<ShareApplicationDto | null>(null);

    const [rating, setRating] = useState<Record<number, number>>({});
    const [modalInvite, setModalInvite] = useState<
        [number, ShareResponseDto] | null
    >(null);

    const handleSetRating = (id: number, value: number) => {
        setRating((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmitRating = async (
        id: number,
        score: number,
        index: number
    ) => {
        try {
            const res = await setShareRating(id, score, token);
            setModalInvite(null);
            setData((prev) => {
                if (!prev || !prev.responses) return prev;

                const updatedResponses = prev.responses.map((res, i) =>
                    i === index ? { ...res, rating: score } : res
                );

                return { ...prev, responses: updatedResponses };
            });
        } catch {}
    };
    const handleSubmitChoise = async (id: number, value: 'yes' | 'no') => {
        try {
            const res = await setShareInviteChoise(id, value, token);
            setModalInvite(null);
            router.refresh();
        } catch {}
    };

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await getShareApplication(token);
                if (!res) {
                    setError(404);
                }
                document.title = `Заявка №${res.request.id}`;
                setData(res);
            } catch {
                setError(500);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="mt-20  flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (error || !data) {
        const msg =
            error === 404
                ? 'Срок действия ссылки истёк.'
                : error == 500
                ? 'Ссылка не найдена или истекла.'
                : '';

        return <span className="text-2xl text-red-800">{msg}</span>;
    }
    const {
        request,
        history,
        expires_at,
        responses = [],
        attachments = [],
    } = data;

    return (
        <>
            <header className="space-y-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[--ink-900]">
                    {request.theme}
                </h1>
                <div className="text-sm text-[--ink-700]">
                    №{request.id} • создано {formatDate(request.created_at)}
                    {request.to_position.unit.unit_name ? (
                        <> • {request.to_position.unit.unit_name}</>
                    ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                    <StatusBadge value={request.status} />
                    {expires_at && (
                        <span className="pill">
                            Ссылка действует до {formatDate(expires_at)}
                        </span>
                    )}
                </div>
            </header>
            <div className="mt-6 space-y-10">
                <ShareSectionCard
                    title="Ваш вопрос"
                    subtitle={
                        <span>
                            Последнее обновление:{' '}
                            {formatDate(request.updated_at)}
                        </span>
                    }
                >
                    <p className="whitespace-pre-wrap leading-relaxed text-[--ink-900]">
                        {request.theme || '—'}
                    </p>
                </ShareSectionCard>
                <ShareSectionCard title="К кому обращение">
                    {request.to_position ? (
                        <div className="prose prose-sm max-w-none text-[--ink-900] whitespace-pre-wrap">
                            <span className="font-medium">
                                {request.to_position.employee.fio}
                            </span>{' '}
                            • {request.to_position.unit.unit_name}
                        </div>
                    ) : (
                        <div className="text-sm text-[--ink-700]">
                            Ответ ещё не предоставлен.
                        </div>
                    )}
                </ShareSectionCard>

                {modalInvite && (
                    <Modal
                        title={'Детали ответа'}
                        onClose={() => setModalInvite(null)}
                    >
                        <ModalBodyResponse
                            handleSubmitRating={handleSubmitRating}
                            handleSetRating={handleSetRating}
                            rating={rating}
                            handleSubmitChoise={handleSubmitChoise}
                            indexResponse={modalInvite}
                        />
                    </Modal>
                )}

                {/* Ответы */}
                {responses.length > 0 && (
                    <ShareSectionCard title="Комментарии ведомства">
                        <ul className="space-y-3">
                            {responses.slice().map((r, index) => (
                                <li
                                    key={r.id}
                                    onClick={() => {
                                        if (window.innerWidth < 768) {
                                            setModalInvite([index, r]);
                                        }
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
                                    <div
                                        className="hover:scale-105 cursor-pointer transition-all duration-150"
                                        onClick={() =>
                                            setModalInvite([index, r])
                                        }
                                    >
                                        <div className="text-sm flex text-[--ink-700] gap-0.5 mb-1">
                                            {`${formatDate(r.created_at)} `}
                                            <span
                                                className={`font-medium ${
                                                    r.type === 'invite_yes'
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }`}
                                            >
                                                {r.type === 'invite_yes'
                                                    ? '· Приглашение принято'
                                                    : r.type === 'invite_no' &&
                                                      '· Приглашение отклонено'}
                                            </span>
                                            <span className="hidden md:block text-orange-700 font-medium">
                                                {r.type === 'invite' &&
                                                    '· Приглашение'}
                                            </span>
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
                                                    handleSubmitRating(
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
                    </ShareSectionCard>
                )}

                {/* Вложения */}
                {attachments.length > 0 && (
                    <ShareSectionCard
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
                                        Загружено {formatDate(a.created_at)}
                                    </div>
                                    <a
                                        href={a.url.split('\n')[1]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-[color:var(--brand-700)] underline underline-offset-4 hover:opacity-80"
                                    >
                                        {
                                            a.url
                                                .split('\n')[0]
                                                .split('Приложить файл: ')[1]
                                        }
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </ShareSectionCard>
                )}

                {/* История */}
                <ShareSectionCard title="История статусов">
                    <Timeline>
                        <TimelineItem>
                            <div className="text-sm text-[--ink-900]">
                                Создано{' '}
                                <span className="text-[--ink-700]">
                                    ({formatDate(request.created_at)})
                                </span>
                            </div>
                        </TimelineItem>

                        {history.length ? (
                            history
                                .slice()
                                .filter(
                                    (h) =>
                                        h.old_status !== h.new_status &&
                                        h.old_status
                                )
                                .map((h) => (
                                    <TimelineItem key={h.id}>
                                        <div className="text-sm text-[--ink-900]">
                                            {statusLabel[h.old_status ?? ''] ??
                                                h.old_status ??
                                                '—'}{' '}
                                            →{' '}
                                            <span className="font-medium">
                                                {statusLabel[
                                                    h.new_status ?? ''
                                                ] ?? h.new_status}
                                            </span>{' '}
                                            <span className="text-[--ink-700]">
                                                ({formatDate(h.created_at)})
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
                </ShareSectionCard>
            </div>
        </>
    );
}
