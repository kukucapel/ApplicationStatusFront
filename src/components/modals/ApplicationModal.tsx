'use client';

import { useState } from 'react';
import { X, Mail, Phone, MapPin, User, FileText, Calendar } from 'lucide-react';
import { Application } from '@/lib/useAppWS';
import {
    updateApplicationStatus,
    UpdateApplicationStatusProps,
} from '@/lib/updateApplication';
import { getCookie } from '../dashboard/BodyDashboard';
import ModalHeader from '../ui/ModalUi/ModalHeader';
import ModalMainBody from '../ui/ModalUi/ModalMainBody';

interface ApplicationModalProps {
    onClose: () => void;
    application: Application;
}

export function ApplicationModal({
    onClose,
    application,
}: ApplicationModalProps) {
    const [updating, setUpdating] = useState<boolean>(false);

    const handleStatusChange = async (
        newStatus: UpdateApplicationStatusProps['new_status']
    ) => {
        console.log(newStatus);
        setUpdating(true);
        try {
            await updateApplicationStatus(
                { new_status: newStatus, comments: '1' },
                application.id,
                getCookie('token')
            );
            application.status = newStatus;
        } catch (error) {
        } finally {
            setUpdating(false);
        }
    };

    const getStatusText = (status: string) => {
        const statusMap = {
            new: 'Необработанная',
            in_progress: 'В работе',
            completed: 'Обработана',
            closed: 'Закрыта',
        } as const;
        type StatusKey = keyof typeof statusMap;

        return statusMap[status as StatusKey] || status;
    };

    return (
        <ModalMainBody>
            {/* Хедер */}
            <ModalHeader title="Детали заявки" onClose={onClose}>
                <p className="text-gray-400-100 text-sm">
                    Создано:{' '}
                    {new Date(application.created_at).toLocaleString('ru-RU')}
                </p>
            </ModalHeader>

            {/* Контент */}
            <div className="p-6 space-y-6">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Текущий статус
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {['new', 'in_progress', 'completed', 'closed'].map(
                            (status) => (
                                <button
                                    key={status}
                                    data-testid={`status-btn-${status}`}
                                    disabled={
                                        updating ||
                                        application.status === status
                                    }
                                    onClick={() =>
                                        handleStatusChange(
                                            status as UpdateApplicationStatusProps['new_status']
                                        )
                                    }
                                    className={` ${
                                        application.status === status
                                            ? status === 'new'
                                                ? 'bg-red-600 hover:bg-red-700 text-white cursor-none'
                                                : status === 'in_progress'
                                                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                                : status === 'completed'
                                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                                : 'bg-gray-600 hover:bg-gray-700 text-white'
                                            : 'hover:bg-blue-50'
                                    } p-2 rounded-md cursor-pointer`}
                                >
                                    {getStatusText(status)}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Инфа о человеке */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                        Информация о заявителе
                    </h3>
                </div>

                {/* Заявка */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                        Детали обращения
                    </h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-2">
                            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                            <p className="text-sm font-medium text-gray-700">
                                Тема
                            </p>
                        </div>
                        <p className="text-gray-900 ml-7">
                            {application.theme}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-2">
                            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                            <p className="text-sm font-medium text-gray-700">
                                Суть вопроса
                            </p>
                        </div>
                        <p className="text-gray-900 ml-7 whitespace-pre-wrap">
                            {application.question}
                        </p>
                    </div>
                </div>
            </div>
        </ModalMainBody>
    );
}
