'use client';

import Button from '@/components/ui/Button';
import ModalAdminMainBody from '@/components/ui/ModalUi/ModalAdminMainBody';
import { useUser } from '@/contexts/UserContext';
import {
    Employee,
    Position,
    PositionTitle,
    PositionUpdate,
} from '@/dtos/AdminDto';
import { useEffect, useState } from 'react';
import Select from 'react-select';

interface ModalAdminPositionsProps {
    position?: Position | null;
    positionTitleItems: PositionTitle[] | null;
    employeeItems: Employee[] | null;
    setModalIsActive: () => void;
    loadPositions: () => Promise<void>;
    loadEmployees: () => Promise<void>;
}

export function ModalAdminPositions({
    position,
    setModalIsActive,
    positionTitleItems,
    employeeItems,
    loadPositions,
    loadEmployees,
}: ModalAdminPositionsProps) {
    const { user } = useUser();

    const [form, setForm] = useState<PositionUpdate>({
        position_title_id: position?.title.id || null,
        unit_id: position?.unit?.id || null,
        employee_id: position?.assignee?.employee_id || null,
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [successfully, setSuccessfully] = useState<string>('');

    const isActive: boolean = position
        ? form.employee_id === position.assignee?.employee_id &&
          form.position_title_id === position.title?.id
        : false;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setError('');
        setSuccessfully('');
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessfully('');

        // try {
        //     const payload = { ...form };

        //     const result =
        //         positionTitle && payload
        //             ? await updatePositionTitle(payload, positionTitle.id)
        //             : await addPositionTitle(form);
        //     await loadPositionTitles();
        //     setSuccessfully('Успешно сохранено');
        //     setModalIsActive();
        // } catch {
        //     setError('Не удалось сохранить');
        // } finally {
        //     setLoading(false);
        // }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <ModalAdminMainBody setModalIsActive={setModalIsActive}>
            <form
                className="transition-all h-full duration-150 flex flex-col items w-full gap-10"
                onSubmit={handleSubmit}
            >
                {/* ID */}
                {position && (
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500">ID</label>
                        <input
                            type="text"
                            value={position?.id ?? ''}
                            readOnly
                            className="mt-1 rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>
                )}

                {user?.role === 'admin' && positionTitleItems && (
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">
                            Должность
                        </label>

                        <Select
                            maxMenuHeight={200}
                            name="position_title_id"
                            options={[
                                { value: '', label: 'Без должности' },
                                ...positionTitleItems.map((r) => ({
                                    value: r.id,
                                    label: r.name,
                                    // isDisabled: r.id == position?.title.id,
                                })),
                            ]}
                            className="cursor-pointer"
                            value={
                                [
                                    { value: '', label: 'Без должности' },
                                    ...positionTitleItems.map((r) => ({
                                        value: r.id,
                                        label: r.name,
                                    })),
                                ].find(
                                    (option) =>
                                        option.value ===
                                        (form.position_title_id ?? ''),
                                ) || { value: '', label: 'Без должности' }
                            }
                            onChange={(option) => {
                                handleChange({
                                    target: {
                                        name: 'position_title_id',
                                        value:
                                            option && option.value !== ''
                                                ? Number(option.value)
                                                : null,
                                    },
                                } as any);
                            }}
                            placeholder="Выберите роль"
                            isSearchable
                            isClearable
                            menuPlacement="bottom"
                        />
                    </div>
                )}

                {user?.role === 'admin' && employeeItems && (
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">
                            Работник
                        </label>

                        <Select
                            name="employee_id"
                            options={[
                                { value: '', label: 'Без работника' },
                                ...employeeItems.map((r) => ({
                                    value: r.id,
                                    label: `${r.id}. ${r.fio}`,
                                    isDisabled:
                                        !!r.position &&
                                        r.id !==
                                            position?.assignee?.employee_id,
                                })),
                            ]}
                            maxMenuHeight={position ? 300 : 200}
                            className="cursor-pointer"
                            value={
                                [
                                    { value: '', label: 'Без работника' },
                                    ...employeeItems.map((r) => ({
                                        value: r.id,
                                        label: `${r.id}. ${r.fio}`,
                                    })),
                                ].find(
                                    (option) =>
                                        option.value ===
                                        (form.employee_id ?? ''),
                                ) || { value: '', label: 'Без работника' }
                            }
                            onChange={(option) => {
                                handleChange({
                                    target: {
                                        name: 'employee_id',
                                        value: option
                                            ? option.value === ''
                                                ? null
                                                : option.value
                                            : null,
                                    },
                                } as any);
                            }}
                            placeholder="Выберите роль"
                            isSearchable
                            isClearable
                            menuPlacement="top"
                        />
                    </div>
                )}

                {/* Название */}
                {/* <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Название</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            defaultValue={form.name || ''}
                            onChange={handleChange}
                            className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
    
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Описание</label>
                        <input
                            id="description"
                            name="description"
                            type="text"
                            readOnly
                            defaultValue={form.kind || ''}
                            onChange={handleChange}
                            className="mt-1 rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div> */}

                {error && (
                    <div>
                        <span className="transition-all duration-150 text-red-500">
                            {error}
                        </span>
                    </div>
                )}
                {successfully && (
                    <div>
                        <span className="transition-all duration-150  text-green-600">
                            {successfully}
                        </span>
                    </div>
                )}

                <div className="transition-all duration-150 flex gap-3 pt-4 border-t">
                    <Button
                        isActive={isActive}
                        styleColor="blue"
                        className={`flex-1  ${
                            isActive
                                ? 'bg-blue-400'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                    <Button
                        onClick={setModalIsActive}
                        styleColor="blue"
                        className="flex-1 py-2 hover:bg-blue-700"
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </ModalAdminMainBody>
    );
}
