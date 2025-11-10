'use client';

import Button from '@/components/ui/Button';
import ModalAdminMainBody from '@/components/ui/ModalUi/ModalAdminMainBody';
import { Employee, EmployeeUpdate, Role } from '@/dtos/AdminDto';
import { updateEmployee } from '@/lib/adminData';
import { useState } from 'react';

interface ModalAdminEmployeeProps {
    employee: Employee;
    roleItems: Role[];
    setModalIsActive: (state: null) => void;
    loadEmployees: () => Promise<void>;
}

export default function ModalAdminEmployee({
    employee,
    setModalIsActive,
    loadEmployees,
    roleItems,
}: ModalAdminEmployeeProps) {
    const [form, setForm] = useState<EmployeeUpdate>({
        fio: employee?.fio,
        email: employee?.email,
        role: employee?.role,
        unit_id: employee?.unit_id,
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [successfully, setSuccessfully] = useState<string>('');

    const isActive =
        (form.fio === employee.fio &&
            form.email === employee.email &&
            form.role === employee.role) ||
        form.fio === '' ||
        form.email === '' ||
        form.role === '';

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

        try {
            const result = await updateEmployee(form, employee.id);
            await loadEmployees();
            setSuccessfully('Успешно сохранено');
        } catch {
            setError('Не удалось сохранить');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalAdminMainBody setModalIsActive={setModalIsActive}>
            <form
                className="transition-all duration-150 space-y-4 w-full "
                onSubmit={handleSubmit}
            >
                {/* ID */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-500">ID</label>
                    <input
                        type="text"
                        value={employee?.id ?? ''}
                        readOnly
                        className="mt-1 rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                </div>

                {/* ФИО */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-500">ФИО</label>
                    <input
                        id="fio"
                        name="fio"
                        type="text"
                        defaultValue={form.fio || ''}
                        onChange={handleChange}
                        className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-500">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={form.email}
                        onChange={handleChange}
                        className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                    />
                </div>

                {/* Роль */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-500">Роль</label>
                    <select
                        name="role"
                        value={form.role || ''}
                        onChange={handleChange}
                        className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                    >
                        {roleItems.map((r) => (
                            <option key={r.id} value={r.name}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>

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
                        onClick={() => setModalIsActive(null)}
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
