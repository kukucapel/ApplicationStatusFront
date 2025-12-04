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
    CalendarArrowDown,
    CalendarArrowUp,
    UsersRound,
} from 'lucide-react';
import {
    Application,
    ApplicationDetailDto,
    ApplicationUnitUpdate,
    ResponseCreateDto,
    ResponseDto,
} from '@/dtos/ApplicationDto';
import {
    getApplicationDetail,
    updateApplicationStatus,
    UpdateApplicationStatusProps,
    getApplicationResponses,
    addApplicationResponse,
    getUnitTreeForApplication,
    UpdateApplicationDataProps,
    updateApplication,
} from '@/lib/updateApplication';
import ModalHeader from '../ui/ModalUi/ModalHeader';
import ModalMainBody from '../ui/ModalUi/ModalMainBody';
import Button from '../ui/Button';
import ModalResponse from '../ui/ModalUi/ModalResponse';
import { useUser } from '@/contexts/UserContext';
import { Unit } from '@/dtos/AdminDto';
import ModalUnitTree from './ModalUnitTree';
import formatDate from '@/lib/formatDate';
import { resolveMx } from 'dns';

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
    const [sortedResponseItems, setSortedResponseItems] = useState<
        ResponseDto[]
    >([]);
    const [sortResponsesFlag, setSortResponsesFlag] = useState<boolean>(true);
    const [showResponseModal, setShowResponseModal] = useState<boolean>(false);

    const [unit, setUnit] = useState<Unit | null>(null);
    const [showUnitModal, setShowUnitModal] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true);

    const { user } = useUser();

    const onCloseResponseModal = () => {
        setShowResponseModal(false);
    };
    const onCloseUnitModal = () => {
        setShowUnitModal(false);
    };

    const handleSubmitResponseModal = async (
        e: React.FormEvent,
        data: ResponseCreateDto
    ) => {
        e.preventDefault();
        await addApplicationResponse(application.id, data);
        await Promise.all([loadResponse(), loadApplication()]);
        setShowResponseModal(false);
    };

    const handleSubmitUnit = async (newUnit: UpdateApplicationDataProps) => {
        await updateApplication(newUnit, applicationItem?.id || application.id);
        await loadApplication();
        setShowUnitModal(false);
    };

    const loadResponse = async () => {
        setResponseItems((await getApplicationResponses(application.id)).items);
    };
    const loadUnit = async () => {
        setUnit((await getUnitTreeForApplication()).items);
    };
    const loadApplication = async () => {
        setApplicationItem(await getApplicationDetail(application.id));
    };

    //загрузка модалки данных
    useEffect(() => {
        async function load() {
            setApplicationItem(await getApplicationDetail(application.id));
            setResponseItems(
                (await getApplicationResponses(application.id)).items
            );
            user?.role !== 'worker' &&
                setUnit((await getUnitTreeForApplication()).items);
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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !showResponseModal) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (!responseItems) return;

        const sorted = [...responseItems].sort((a, b) => {
            const timeA = new Date(a.created_at).getTime();
            const timeB = new Date(b.created_at).getTime();

            return sortResponsesFlag
                ? timeB - timeA // true → новые → старые
                : timeA - timeB; // false → старые → новые
        });

        setSortedResponseItems(sorted);
    }, [responseItems, sortResponsesFlag]);

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

    return (
        !loading &&
        applicationItem && (
            <ModalMainBody>
                {/* Хедер */}
                <ModalHeader title="Детали заявки" onClose={onClose}>
                    <div className="text-gray-400-100 text-sm">
                        <p>
                            Создано:{' '}
                            {applicationItem &&
                                formatDate(application.createdAt)}
                        </p>
                        {applicationItem.createdAt !==
                            applicationItem.updatedAt && (
                            <p>
                                Изменено:
                                {applicationItem &&
                                    formatDate(application.updatedAt)}
                            </p>
                        )}
                    </div>
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
                    <div className="flex justify-between">
                        <Button
                            styleColor="blue"
                            onClick={() => setShowResponseModal(true)}
                            className="py-1 flex-grow"
                        >
                            Создать ответ
                        </Button>
                        {user?.role !== 'worker' && (
                            <Button
                                styleColor="blue"
                                className="py-1 w-[50%]"
                                onClick={() => setShowUnitModal(true)}
                            >
                                Назначить исполнителя
                            </Button>
                        )}
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

                        {/* <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start gap-2 mb-2">
                                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                                <p className="text-sm font-medium text-gray-700">
                                    Детали запроса
                                </p>
                            </div>
                            <p className="text-gray-900 ml-7 whitespace-pre-wrap">
                                {applicationItem.question || '-'}
                            </p>
                        </div> */}

                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-start gap-2 mb-2">
                                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                                <p className="text-sm font-medium text-gray-700">
                                    Исполнительный орган
                                </p>
                            </div>
                            <p className="text-gray-900 ml-7 whitespace-pre-wrap">
                                {applicationItem.assignedUnit.name || '-'}
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
                                {applicationItem.assignedEmployee
                                    ? applicationItem.assignedEmployee.fio
                                    : '-'}
                            </p>
                        </div>

                        {/* <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-start gap-2 mb-2">
                                <UsersRound className="w-5 h-5 text-blue-600 mt-0.5" />
                                <p className="text-sm font-medium text-gray-700">
                                    К кому обращение
                                </p>
                            </div>
                            <p className="text-gray-900 ml-7 whitespace-pre-wrap">
                                {applicationItem.toSend || '-'}
                            </p>
                        </div> */}
                    </div>

                    {showResponseModal && (
                        <ModalResponse
                            handleSubmit={handleSubmitResponseModal}
                            onClose={onCloseResponseModal}
                        />
                    )}
                    {showUnitModal && unit && (
                        <ModalUnitTree
                            selectedNow={applicationItem.assignedUnitId || 0}
                            unitTree={unit}
                            handleSubmit={handleSubmitUnit}
                            onClose={onCloseUnitModal}
                        />
                    )}

                    {/* Ответы */}
                    {sortedResponseItems?.length !== 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-end justify-between text-gray-900 border-b pb-2">
                                Ответы
                                {sortedResponseItems.length !== 1 && (
                                    <div
                                        className="flex cursor-pointer items-center"
                                        onClick={() =>
                                            setSortResponsesFlag(
                                                (prev) => !prev
                                            )
                                        }
                                    >
                                        {sortResponsesFlag ? (
                                            <CalendarArrowDown className="w-8 mt-0.5 hover:scale-125 transition-all duration-150" />
                                        ) : (
                                            <CalendarArrowUp className="w-8 mt-0.5 hover:scale-125 transition-all duration-150" />
                                        )}
                                    </div>
                                )}
                            </h3>

                            {sortedResponseItems?.map((res) => (
                                <div
                                    className={`${
                                        res.type === 'invite_yes'
                                            ? 'bg-green-50'
                                            : res.type === 'invite_no'
                                            ? 'bg-red-50'
                                            : res.type === 'invite'
                                            ? 'bg-orange-50'
                                            : 'bg-blue-50'
                                    } rounded-lg p-4`}
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
                                            {formatDate(res.created_at)}
                                        </p>
                                    </div>
                                    <p className=" ml-7 whitespace-pre-wrap">
                                        {'Ответчик: '}
                                        {(res.author && res.author.fio) ||
                                            'Заявитель'}
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
