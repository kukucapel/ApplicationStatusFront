'use client';

import Button from '@/components/ui/Button';
import ModalAdminMainBody from '@/components/ui/ModalUi/ModalAdminMainBody';
import { useUser } from '@/contexts/UserContext';
import { Employee, EmployeeUpdate, Role } from '@/dtos/AdminDto';
import { addEmployee, updateEmployee } from '@/lib/adminData';
import { useEffect, useState } from 'react';
import { Unit } from '@/dtos/AdminDto';
import { getUnitTreeForApplication } from '@/lib/updateApplication';
import ModalUnitTree from '../ModalUnitTree';

interface ModalAdminEmployeeProps {
    employee: Employee | null;
    roleItems: Role[] | null;
    setModalIsActive: () => void;
    loadEmployees: () => Promise<void>;
}

export default function ModalAdminEmployee({
    employee,
    setModalIsActive,
    loadEmployees,
    roleItems,
}: ModalAdminEmployeeProps) {
    const { user } = useUser();

    const [form, setForm] = useState<EmployeeUpdate>({
        fio: employee?.fio || '',
        email: employee?.email || '',
        role_id: employee?.role_id || 2,
        unit_id: employee?.unit_id || 0,
        password: '',
    });
    const [unitName, setUnitName] = useState<string | null>(
        employee?.unit_name || null
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [successfully, setSuccessfully] = useState<string>('');

    const [showUnit, setShowUnit] = useState<boolean>(false);
    const [unit, setUnit] = useState<Unit | null>(null);

    const isActive: boolean = employee
        ? (form.fio === employee.fio &&
              form.email === employee.email &&
              form.role_id == employee.role_id &&
              form.unit_id === employee.unit_id) ||
          form.fio === '' ||
          form.email === ''
        : !(
              form.unit_id !== 0 &&
              form.email !== '' &&
              form.fio !== '' &&
              form.password !== ''
          );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setError('');
        setSuccessfully('');
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmitChangeUnit = (
        newSelected: number,
        newUnitName: string
    ) => {
        setForm({ ...form, unit_id: newSelected });
        setShowUnit(false);
        setUnitName(newUnitName);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessfully('');

        try {
            const payload = { ...form };
            if (payload.password === '') {
                delete payload.password;
            }
            const result =
                employee && payload
                    ? await updateEmployee(payload, employee.id)
                    : await addEmployee(form);
            await loadEmployees();
            setSuccessfully('Успешно сохранено');
            setModalIsActive();
        } catch {
            setError('Не удалось сохранить');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const load = async () =>
            user?.role !== 'worker' &&
            setUnit((await getUnitTreeForApplication()).items);
        load();
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <ModalAdminMainBody setModalIsActive={setModalIsActive}>
            <form
                className="transition-all duration-150 space-y-4 w-full "
                onSubmit={handleSubmit}
            >
                {/* ID */}
                {employee && (
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500">ID</label>
                        <input
                            type="text"
                            value={employee?.id ?? ''}
                            readOnly
                            className="mt-1 rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>
                )}
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

                {/* Пароль */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-500">
                        {employee ? 'Новый пароль' : 'Пароль'}
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        defaultValue={form.password}
                        onChange={handleChange}
                        placeholder="********"
                        className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                    />
                </div>

                {/* Роль */}
                {user?.role === 'admin' && (
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Роль</label>
                        <select
                            name="role_id"
                            value={form.role_id || ''}
                            onChange={handleChange}
                            className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                        >
                            {roleItems &&
                                roleItems.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                )}

                {/* Подразделение */}
                {showUnit && unit && (
                    <ModalUnitTree
                        selectedNow={form?.unit_id || employee?.unit_id || 0}
                        unitTree={unit}
                        handleChange={handleSubmitChangeUnit}
                        onClose={() => setShowUnit(false)}
                    ></ModalUnitTree>
                )}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-500">
                        {' '}
                        Выбрать поздразделение
                    </label>

                    <span
                        onClick={() => setShowUnit(true)}
                        className={`mt-1 rounded-md border border-gray-300 px-3 py-2 cursor-pointer ${
                            employee
                                ? employee.unit_id !== form.unit_id &&
                                  'border-green-300'
                                : form.unit_id && 'border-green-300'
                        }`}
                    >
                        {' '}
                        {unitName
                            ? unitName
                            : employee?.unit_name || 'Выбрать поздразделение'}
                    </span>
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
