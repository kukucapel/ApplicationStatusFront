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
  getCuratorsTreeForApplication,
  addAttachmentResponse,
} from '@/lib/updateApplication';
import ModalHeader from '../ui/ModalUi/ModalHeader';
import Button from '../ui/Button';
import ModalResponse from '../ui/ModalUi/ModalResponse';
import { useUser } from '@/contexts/UserContext';
import { Curator, Unit } from '@/dtos/AdminDto';
import formatDate from '@/lib/formatDate';
import Modal from '../ui/NewModalUi/Modal';
import ModalBody from '../ui/NewModalUi/ModalBody';
import ModalBodyBlock from '../ui/NewModalUi/ModalBodyBlock';
import ModalBodyBlockField from '../ui/NewModalUi/ModalBodyBlockField';
import ModalSubmit from './ModalSubmit';
import ModalCuratorTree from './ModalCuratorTree';

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
    null,
  );
  const [sortedResponseItems, setSortedResponseItems] = useState<ResponseDto[]>(
    [],
  );
  const [sortResponsesFlag, setSortResponsesFlag] = useState<boolean>(true);
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);

  const [unit, setUnit] = useState<Curator[] | null>(null);
  const [showUnitModal, setShowUnitModal] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useUser();

  const [alert, setAlert] = useState<string | null>(null);

  const onCloseResponseModal = () => {
    setShowResponseModal(false);
  };
  const onCloseUnitModal = () => {
    setShowUnitModal(false);
  };
  useEffect(() => {
    document.body.style.overflow = 'hidden';
  });

  const handleSubmitResponseModal = async (
    e: React.FormEvent,
    data: ResponseCreateDto,
    file: File,
  ) => {
    e.preventDefault();
    const res = await addApplicationResponse(application.id, data);
    await addAttachmentResponse(res.id, file);
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
  const loadTree = async () => {
    setUnit((await getCuratorsTreeForApplication()).items);
  };
  const loadApplication = async () => {
    setApplicationItem(await getApplicationDetail(application.id));
  };

  //загрузка модалки данных
  useEffect(() => {
    async function load() {
      setApplicationItem(await getApplicationDetail(application.id));
      setResponseItems((await getApplicationResponses(application.id)).items);
      user?.role !== 'worker' &&
        setUnit((await getCuratorsTreeForApplication()).items);
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
      closed: 'Закрыта',
    } as const;
    type StatusKey = keyof typeof statusMap;

    return statusMap[status as StatusKey] || status;
  };

  const handleStatusChange = async (
    newStatus: UpdateApplicationStatusProps['new_status'],
  ) => {
    setUpdating(true);
    try {
      await updateApplicationStatus(
        { new_status: newStatus, comments: '1' },
        application.id,
      );
      application.status = newStatus;
    } catch (error) {
    } finally {
      setUpdating(false);
      setAlert(null);
    }
  };

  return (
    !loading &&
    applicationItem && (
      <Modal>
        <ModalHeader title="Детали заявки" onClose={onClose}>
          <div className="text-gray-400-100 text-sm">
            <p>
              Создано: {applicationItem && formatDate(application.createdAt)}
            </p>
            {applicationItem.createdAt !== applicationItem.updatedAt && (
              <p>
                Изменено:
                {applicationItem && formatDate(application.updatedAt)}
              </p>
            )}
          </div>
        </ModalHeader>

        {/* Контент */}
        <div>
          <ModalBody>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Текущий статус
              </h3>
              <div className="flex flex-wrap gap-2">
                {['new', 'in_progress', 'closed'].map((status) => (
                  <button
                    key={status}
                    data-testid={`status-btn-${status}`}
                    disabled={updating || application.status === status}
                    onClick={() => setAlert(status)}
                    className={` ${
                      application.status === status
                        ? status === 'new'
                          ? 'bg-red-600 hover:bg-red-700 text-white cursor-none'
                          : status === 'in_progress'
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-gray-600 hover:bg-gray-700 text-white'
                        : 'hover:bg-blue-50'
                    } p-2 rounded-md cursor-pointer`}
                  >
                    {getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                styleColor="blue"
                onClick={() => setShowResponseModal(true)}
                className="py-2 flex-grow"
              >
                Создать ответ
              </Button>
              {user?.role !== 'worker' && (
                <Button
                  styleColor="blue"
                  className="py-2 w-[50%]"
                  onClick={() => setShowUnitModal(true)}
                >
                  Передать приём
                </Button>
              )}
            </div>

            <ModalBodyBlock title="Информация о заявителе">
              <ModalBodyBlockField
                nameField="ФИО"
                valueField={applicationItem.applicant.fio}
                icon={User}
              />

              <ModalBodyBlockField
                nameField="Email"
                valueField={applicationItem.applicant.email}
                icon={Mail}
              />
              <ModalBodyBlockField
                nameField="Телефон"
                valueField={applicationItem.applicant.phone}
                icon={Phone}
              />
              <ModalBodyBlockField
                nameField="Адрес регистрации"
                valueField={applicationItem.applicant.address1}
                icon={MapPin}
              />
              <ModalBodyBlockField
                nameField="Адрес проживания"
                valueField={applicationItem.applicant.address2}
                icon={MapPin}
              />
              <ModalBodyBlockField
                nameField="Индекс регистрации"
                valueField={applicationItem.applicant.postalCode1 || '-'}
                icon={FileText}
              />
              <ModalBodyBlockField
                nameField="Индекс проживания"
                valueField={applicationItem.applicant.postalCode2 || '-'}
                icon={FileText}
              />
            </ModalBodyBlock>
            <ModalBodyBlock typeStyle={2} title="Детали обращения">
              <ModalBodyBlockField
                typeStyle={2}
                nameField="Тема"
                valueField={applicationItem.theme || '-'}
                icon={FileText}
              />
              <ModalBodyBlockField
                typeStyle={2}
                nameField="Суть обращения"
                valueField={applicationItem.question || '-'}
                icon={FileText}
                bgColor="g"
              />
              {/* <ModalBodyBlockField
                                typeStyle={2}
                                nameField="Исполнительный орган"
                                valueField={
                                    applicationItem.assignedUnit?.name || '-'
                                }
                                icon={FileText}
                                bgColor="g"
                            /> */}
              <ModalBodyBlockField
                typeStyle={2}
                nameField="К кому приём"
                valueField={`${applicationItem.toPosition.employee.fio}  ${
                  applicationItem.toPosition.unit?.unit_name
                    ? `• ${applicationItem.toPosition.unit?.unit_name} `
                    : ''
                }`}
                icon={FileText}
              />
              {/* <ModalBodyBlockField
                                typeStyle={2}
                                nameField="Исполнитель"
                                valueField={
                                    applicationItem.assignedUser?.fio || '-'
                                }
                                icon={UserPen}
                            /> */}
            </ModalBodyBlock>
            {/* Ответы */}
            {sortedResponseItems?.length !== 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-end justify-between text-gray-900 border-b pb-2">
                  Уведомления
                  {sortedResponseItems.length !== 1 && (
                    <div
                      className="flex cursor-pointer items-center"
                      onClick={() => setSortResponsesFlag((prev) => !prev)}
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
                          Уведомление
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        {'Cоздан: '}
                        {formatDate(res.created_at)}
                      </p>
                    </div>
                    <p className=" ml-7 whitespace-pre-wrap">
                      {'Ответчик: '}
                      {(res.author && res.author.fio) || 'Заявитель'}
                    </p>
                    <p className="text-gray-900 ml-7 mt-4 whitespace-pre-wrap">
                      {res.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ModalBody>
        </div>

        {showResponseModal && (
          <ModalResponse
            handleSubmit={handleSubmitResponseModal}
            onClose={onCloseResponseModal}
          />
        )}
        {showUnitModal && unit && (
          <ModalCuratorTree
            selectedNow={applicationItem.toPosition.id || 0}
            unitTree={unit}
            handleSubmit={handleSubmitUnit}
            onClose={onCloseUnitModal}
          />
        )}
        {alert && (
          <ModalSubmit
            onClose={() => setAlert(null)}
            handleSubmit={() =>
              handleStatusChange(
                alert as UpdateApplicationStatusProps['new_status'],
              )
            }
          />
        )}
      </Modal>
    )
  );
}
