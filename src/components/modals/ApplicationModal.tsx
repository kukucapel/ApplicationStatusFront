'use client';

import { useEffect, useState } from 'react';
import {
    X,
    Mail,
    Phone,
    MapPin,
    User,
    FileText,
    Calendar,
    UserPen,
    MapPinHouse,
} from 'lucide-react';
import {
    Application,
    ApplicationDetailDto,
    ResponseCreateDto,
    ResponseDto,
} from '@/dtos/ApplicationDto';
import {
    getApplicationDetail,
    updateApplicationStatus,
    UpdateApplicationStatusProps,
    getApplicationResponses,
    addApplicationResponse,
} from '@/lib/updateApplication';
import ModalHeader from '../ui/ModalUi/ModalHeader';
import ModalMainBody from '../ui/ModalUi/ModalMainBody';
import Button from '../ui/Button';
import ModalResponse from '../ui/ModalUi/ModalResponse';

interface ApplicationModalProps {
    onClose: () => void;
    application: Application;
}

export function ApplicationModal({
    onClose,
    application,
}: ApplicationModalProps) {
    const [updating, setUpdating] = useState<boolean>(false);
    const [applicationItem, setApplicationItem] =
        useState<ApplicationDetailDto | null>(null);
    const [responseItems, setResponseItems] = useState<ResponseDto[] | null>(
        null
    );
    const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const onCloseResponseModal = () => {
        setShowResponseModal(false);
    };
    const handleSubmitResponseModal = async (
        e: React.FormEvent,
        data: ResponseCreateDto
    ) => {
        e.preventDefault();
        await addApplicationResponse(application.id, data);
        await loadResponse();
        setShowResponseModal(false);
    };

    //загрузка модалки данных
    useEffect(() => {
        async function load() {
            setApplicationItem(await getApplicationDetail(application.id));
            setResponseItems(
                (await getApplicationResponses(application.id)).items
            );
            setLoading(false);
        }
        load();
    }, [application]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

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

    const handleStatusChange = async (
        newStatus: UpdateApplicationStatusProps['new_status']
    ) => {
        setUpdating(true);
        try {
            await updateApplicationStatus(
                { new_status: newStatus, comments: '1' },
                application.id
            );
            application.status = newStatus;
        } catch (error) {
        } finally {
            setUpdating(false);
        }
    };

    const loadResponse = async () => {
        setResponseItems((await getApplicationResponses(application.id)).items);
    };

    return (
        !loading &&
        applicationItem && (
            <ModalMainBody>
                {/* Хедер */}
                <ModalHeader title="Детали заявки" onClose={onClose}>
                    <p className="text-gray-400-100 text-sm">
                        Создано:{' '}
                        {applicationItem &&
                            new Date(applicationItem.createdAt).toLocaleString(
                                'ru-RU'
                            )}
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
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">ФИО</p>
                                    <p className="font-medium text-gray-900">
                                        {applicationItem.applicant.fio || '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Email
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {applicationItem.applicant.email || '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Телефон
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {applicationItem.applicant.phone || '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPinHouse className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Адрес регистрации
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {applicationItem.applicant.address1 ||
                                            '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPinHouse className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Адрес проживания
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {applicationItem.applicant.address2 ||
                                            '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Индекс регистрации
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {applicationItem.applicant
                                            .postalCode1 || '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Индекс проживания
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {applicationItem.applicant
                                            .postalCode2 || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Заявка */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-between border-b pb-2">
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
                                {applicationItem.theme || '-'}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start gap-2 mb-2">
                                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                                <p className="text-sm font-medium text-gray-700">
                                    Детали запроа
                                </p>
                            </div>
                            <p className="text-gray-900 ml-7 whitespace-pre-wrap">
                                {applicationItem.question || '-'}
                            </p>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-start gap-2 mb-2">
                                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                                <p className="text-sm font-medium text-gray-700">
                                    Исполнительный орган
                                </p>
                            </div>
                            <p className="text-gray-900 ml-7 whitespace-pre-wrap">
                                {applicationItem.assignedUnit?.name || '-'}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start gap-2 mb-2">
                                <UserPen className="w-5 h-5 text-blue-600 mt-0.5" />
                                <p className="text-sm font-medium text-gray-700">
                                    Исполнитель
                                </p>
                            </div>
                            <p className="text-gray-900 ml-7 whitespace-pre-wrap">
                                {applicationItem.assignedEmployee || '-'}
                            </p>
                        </div>
                        <Button styleColor="blue" className="py-1 px-2">
                            Назначить исполнительного
                        </Button>
                    </div>

                    {/* Ответы */}
                    {responseItems?.length !== 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                Ответы
                            </h3>
                            <Button
                                styleColor="blue"
                                onClick={() => setShowResponseModal(true)}
                                className="py-1 px-2"
                            >
                                Создать ответ
                            </Button>
                            {showResponseModal && (
                                <ModalResponse
                                    handleSubmit={handleSubmitResponseModal}
                                    onClose={onCloseResponseModal}
                                />
                            )}
                            {responseItems?.map((res) => (
                                <div
                                    className="bg-blue-50 rounded-lg p-4"
                                    key={res.id}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-start gap-2">
                                            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <p className="text-sm font-medium text-gray-700">
                                                Ответ
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">
                                            {'Cоздан: '}
                                            {new Date(
                                                res.created_at
                                            ).toLocaleString('ru-RU')}
                                        </p>
                                    </div>
                                    <p className=" ml-7 whitespace-pre-wrap">
                                        {'Ответчик: '}
                                        {res.author.fio}
                                    </p>
                                    <p className="text-gray-900 ml-7 mt-4 whitespace-pre-wrap">
                                        {res.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ModalMainBody>
        )
    );
}
