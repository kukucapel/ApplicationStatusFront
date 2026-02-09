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
    token: string;
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
    token,
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

    useEffect(() => {
        async function load() {
            const res = await getUrlDownloadAttachmentLink(
                response.attachments[0].id,
                token,
            );
            if (!res.status) {
                setUrl(res.url);
            } else {
                const data = await res.json();
                const jsonString = JSON.stringify(data);
                setUrl(jsonString);
            }
        }
        if (response.attachments.length) load();
    }, []);

    const [index, response] = indexResponse;

    return (
        <div className="space-y-5">
            <div className="text-sm font-medium ">
                <span className="text-gray-500">Тип ответа:</span>
                <p
                    className={
                        response.attachments.length
                            ? 'text-green-400'
                            : response.comment ===
                                'Ответ был дан устно по телефону'
                              ? 'text-orange-400'
                              : 'text-blue-400'
                    }
                >
                    {response.attachments.length
                        ? 'Ответ файлом'
                        : response.comment === 'Ответ был дан устно по телефону'
                          ? 'Ответ по телефону'
                          : 'Ответ сообщением'}
                </p>
            </div>
            <div className="text-sm font-medium ">
                <span className="text-gray-500">Ответ: </span>
                {response.attachments.length ? (
                    <a
                        className="text-gray-900 underline cursor-pointer"
                        // onClick={() =>
                        //     downloadFile(response.attachments[0].id, token)
                        // }
                        href={url}
                    >
                        Скачать файл
                    </a>
                ) : (
                    <span>{response.comment}</span>
                )}
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
