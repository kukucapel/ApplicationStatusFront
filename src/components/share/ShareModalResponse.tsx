'use client';

import { ShareResponseDto } from '@/dtos/ShareDto';
import Button from '../ui/Button';
import { useEffect, useState } from 'react';
import ModalAlert from '../ui/ModalUi/ModalAlert';
import Raiting from '../ui/Share/Raiting';
import downloadFile from '@/lib/download';
import { getUrlDownloadAttachmentLink } from '@/lib/updateApplication';

interface ModalBodyResponseProps {
    indexResponse: [number, ShareResponseDto];
    handleSubmitChoise: (id: number, value: 'yes' | 'no') => void;

    handleSubmitRating: (
        id: number,
        raiting: number,
        index: number,
    ) => Promise<void>;
    handleSetRating?: (id: number, value: number) => void;
    rating: Record<number, number>;
}

export default function ModalBodyResponse({
    indexResponse,
    handleSubmitChoise,
    handleSetRating,
    handleSubmitRating,
    rating,
}: ModalBodyResponseProps) {
    const [modalState, setModalState] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    useEffect(() => {
        if (modalState === 'no') {
            setModalState('');
        }
    }, [modalState]);
    if (!indexResponse) return null;

    const [index, response] = indexResponse;
    useEffect(() => {
        async function load() {
            const res = await getUrlDownloadAttachmentLink(
                response.attachments[0].id,
            );
            if (!res.status) {
                setUrl(res.url);
            } else {
                setUrl(res.json());
            }
        }
        load();
    }, []);

    return (
        <div className="space-y-5">
            {/* <div className="text-sm font-medium ">
                <span className="text-gray-500">Тип ответа:</span>
                <p className={`text-green-500`}>
                    {response.type === 'none_invite'
                        ? 'Промежуточный ответ'
                        : 'Приглашение'}
                </p>
            </div> */}
            <div className="text-sm font-medium ">
                <span className="text-gray-500">Ответ:</span>
                <a
                    className="text-gray-900 underline cursor-pointer"
                    // onClick={() => downloadFile(response.attachments[0].id)}
                    href={url}
                >
                    Скачать файл
                </a>
            </div>
            {response.rating !== null ? (
                <div className="flex flex-col gap-0.5">
                    <span className="text-gray-500 ">Ваша оценка:</span>
                    <Raiting type="view" responseRating={response.rating} />
                </div>
            ) : (
                <div className="">
                    <span className="text-gray-500 ">Оцените ответ:</span>
                    <Raiting
                        type="set"
                        handleSetRating={handleSetRating}
                        handleSubmit={() => {
                            handleSubmitRating(
                                response.id,
                                rating[response.id],
                                index,
                            );
                        }}
                        rating={rating}
                        id={response.id}
                    />
                </div>
            )}
            {response.type === 'invite' && (
                <div className="mt-10">
                    <hr className="mt-5" />

                    <div className="flex flex-col gap-2">
                        <p>Согласны ли вы на это время?</p>
                        <div className="flex gap-10 justify-between">
                            <Button
                                styleColor="blue"
                                className="flex-grow py-2"
                                onClick={() => setModalState('open_yes')}
                            >
                                Да
                            </Button>
                            <Button
                                styleColor="blue"
                                className="flex-grow py-2"
                                onClick={() => setModalState('open_no')}
                            >
                                Нет
                            </Button>
                        </div>
                    </div>
                    <ModalAlert
                        handleSubmitChoise={handleSubmitChoise}
                        id={response.id}
                        state={modalState}
                        setState={setModalState}
                    />
                </div>
            )}
        </div>
    );
}
