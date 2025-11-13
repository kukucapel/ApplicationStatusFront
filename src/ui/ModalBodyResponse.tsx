'use client';

import { ResponseEntry } from '@/types/share';
import Button from './Button';
import { useState } from 'react';
import ModalAlert from './ModalAlert';
import Raiting from './Raiting';

interface ModalBodyResponseProps {
    response: ResponseEntry;
    handleSubmitChoise: (id: number, value: 'yes' | 'no') => void;
}

export default function ModalBodyResponse({
    response,
    handleSubmitChoise,
}: ModalBodyResponseProps) {
    const [modalState, setModalState] = useState<string>('');
    if (modalState === 'no') {
        setModalState('');
    }

    return (
        <div className="space-y-5">
            <div className="text-sm font-medium ">
                <span className="text-gray-500">Тип ответа:</span>
                <p className={`text-green-500`}>
                    {response.type === 'none_invite'
                        ? 'Промежуточный ответ'
                        : 'Приглашение'}
                </p>
            </div>
            <div className="text-sm font-medium ">
                <span className="text-gray-500">Комментарий:</span>
                <p className={`text-lg text-orange-500`}>{response.comment}</p>
            </div>
            {response.rating !== null && (
                <Raiting type="view" responseRating={response.rating} />
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
