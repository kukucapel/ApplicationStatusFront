'use client';

import Button from '@/components/ui/Button';
import ModalAdminMainBody from '@/components/ui/ModalUi/ModalAdminMainBody';
import { useUser } from '@/contexts/UserContext';
import {
    UserCreate,
    Employee,
    EmployeeUpdate,
    Position,
    Role,
    UserUpdate,
    EmployeeCreate,
    Curator,
} from '@/dtos/AdminDto';
import {
    addCuratorAccess,
    addEmployee,
    addUser,
    createUser,
    deleteUser,
    removeCuratorAccess,
    updateEmployee,
    updateUser,
} from '@/lib/adminData';
import { useEffect, useState } from 'react';
import { Unit } from '@/dtos/AdminDto';
import Select from 'react-select';

import { getUnitTreeForApplication } from '@/lib/updateApplication';
import Switch from '@/components/ui/Switch';
import { Trash2 } from 'lucide-react';
import ModalSubmit from '../ModalSubmit';
import Access from '@/components/ui/Access';
import ModalCuratorTree from '../ModalCuratorTree';

const SWITCH_BUTTONS = [
    ['Сотрудник', 'employee'],
    ['Пользователь', 'user'],
];

interface ModalAdminEmployeeProps {
    employee: Employee | null;
    positionItems: Position[] | null;
    roleItems: Role[] | null;
    curatorTreeItems: Curator[] | null;
    setModalIsActive: () => void;
    loadEmployees: () => Promise<void>;
}

export default function ModalAdminEmployee({
    employee,
    setModalIsActive,
    loadEmployees,
    positionItems,
    curatorTreeItems,
    roleItems,
}: ModalAdminEmployeeProps) {
    const { user } = useUser();

    const [formEmployee, setFormEmployee] = useState<EmployeeUpdate>({
        fio: employee?.fio || '',
        email: employee?.email || '',
        position_id: employee?.position?.id || null,
    });
    const [formUser, setFormUser] = useState<UserUpdate>({
        login: employee?.user?.login || '',
        role_id: employee?.user?.role.id || null,
        password: '',
    });
    const [formCreateUser, setFormCreateUser] = useState<UserCreate>({
        fio: '',
        email: '',
        position_id: null,
        login: '',
        password: '',
        role_id: 2,
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [successfully, setSuccessfully] = useState<string>('');
    const [page, setPage] = useState<string>(SWITCH_BUTTONS[0][1]);
    const [modalSubmit, setModalSubmit] = useState<number | null>(null);
    const [modalCuratorTree, setModalCuratorTree] = useState<boolean>(false);

    const isActiveEmployee: boolean = employee
        ? (formEmployee.fio === employee.fio &&
              formEmployee.email === employee.email &&
              (formEmployee.position_id === employee.position?.id ||
                  formEmployee.position_id === employee.position)) ||
          formEmployee.fio === '' ||
          formEmployee.email === ''
        : !(formEmployee.email !== '' && formEmployee.fio !== '');

    const isActiveUpdateUser: boolean = employee
        ? employee?.user
            ? (formUser.login === employee?.user.login &&
                  formUser.role_id === employee.user.role.id &&
                  formUser.password === '') ||
              formUser.login === '' ||
              formUser.role_id === null
            : !(
                  formUser.login !== '' &&
                  formUser.password !== '' &&
                  formUser.role_id !== null
              )
        : !(
              formCreateUser.login !== '' &&
              formCreateUser.password !== '' &&
              formCreateUser.role_id !== null &&
              formCreateUser.fio !== ''
          );

    const handleDeleteUser = async (id: number) => {
        await deleteUser(id);
        loadEmployees();
        setModalSubmit(null);

        setModalIsActive();
    };

    const handleCuratorSumbit = async (added: number[], removed: number[]) => {
        try {
            if (employee?.user?.id) {
                await Promise.all([
                    ...added.map((id) =>
                        addCuratorAccess(employee!.user!.id!, id),
                    ),

                    ...removed.map((positionId) => {
                        const access = employee?.user!.curatorAccess?.find(
                            (item) => item.curatorPosition.id === positionId,
                        );

                        if (!access) return Promise.resolve();

                        return removeCuratorAccess(
                            employee!.user!.id!,
                            access.id,
                        );
                    }),
                ]);

                await loadEmployees();
                setModalCuratorTree(false);
                setModalIsActive();
            }
        } catch (error) {
            setError('Ошибка при обновлении доступов');
        }
    };
    const handleChangeEmployee = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setError('');
        setSuccessfully('');
        setFormEmployee({ ...formEmployee, [e.target.name]: e.target.value });
    };
    const handleChangeCreateUser = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setError('');
        setSuccessfully('');
        setFormCreateUser({
            ...formCreateUser,
            [e.target.name]: e.target.value,
        });
    };
    const handleChangeUser = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setError('');
        setSuccessfully('');
        setFormUser({ ...formUser, [e.target.name]: e.target.value });
    };
    // const handleSubmitChangeUnit = (
    //     newSelected: number,
    //     newUnitName: string
    // ) => {
    //     setForm({ ...form, unit_id: newSelected });
    //     setShowUnit(false);
    //     setUnitName(newUnitName);
    // };

    const handleSubmitEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessfully('');

        if (employee) {
            try {
                const result = await updateEmployee(formEmployee, employee.id);
                if (result.employee_id) {
                    await loadEmployees();
                    setSuccessfully('Успешно сохранено');
                    setModalIsActive();
                }
                setError('Не удалось сохранить');
            } catch {
                setError('Не удалось сохранить');
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const result = await addEmployee(
                    formEmployee as EmployeeCreate,
                );
                if (result.employee_id) {
                    await loadEmployees();
                    setSuccessfully('Успешно сохранено');
                    setModalIsActive();
                }
                setError('Не удалось сохранить');
            } catch {
                setError('Не удалось сохранить');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmitUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessfully('');
        if (employee) {
            if (employee.user) {
                try {
                    const payload = { ...formUser };
                    if (payload.password === '') {
                        delete payload.password;
                    }
                    const result = await updateUser(employee.user.id, payload);

                    if (result.id) {
                        await loadEmployees();
                        setSuccessfully('Успешно сохранено');
                        setModalIsActive();
                    }
                    setError('Не удалось сохранить');
                } catch {
                    setError('Не удалось сохранить');
                } finally {
                    setLoading(false);
                }
            } else {
                try {
                    const result = await addUser(employee.id, formUser);
                    if (result.id) {
                        await loadEmployees();
                        setSuccessfully('Успешно сохранено');
                        setModalIsActive();
                    }
                    setError('Не удалось сохранить');
                } catch {
                    setError('Не удалось сохранить');
                } finally {
                    setLoading(false);
                }
            }
        } else {
            try {
                const payload: UserCreate = { ...formCreateUser };
                if (!payload.email) {
                    payload.email = formCreateUser.login;
                }
                const result = await createUser(payload);
                if (result.id) {
                    await loadEmployees();
                    setSuccessfully('Успешно сохранено');
                    setModalIsActive();
                }
                setError('Не удалось сохранить');
            } catch {
                setError('Не удалось сохранить');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        // const load = async () =>
        //     user?.role !== 'worker' &&
        //     setUnit((await getUnitTreeForApplication()).items);
        // load();
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <ModalAdminMainBody
            title={employee ? 'Редактирование' : 'Создание'}
            setModalIsActive={setModalIsActive}
        >
            <Switch
                page={page}
                onClickSwitchButton={setPage}
                buttonsList={SWITCH_BUTTONS}
                className="mb-4"
            />

            {page === SWITCH_BUTTONS[0][1] && (
                <form
                    className="transition-all duration-150 space-y-4 w-full "
                    onSubmit={handleSubmitEmployee}
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
                            defaultValue={formEmployee.fio || ''}
                            onChange={handleChangeEmployee}
                            className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    {/* Личный email */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500">
                            Личный email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            defaultValue={formEmployee.email || ''}
                            onChange={handleChangeEmployee}
                            className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    {/* Позиция */}
                    {user?.role === 'admin' && positionItems && (
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500 mb-1">
                                Позиция
                            </label>

                            <Select
                                name="position_id"
                                options={[
                                    { value: '', label: 'Без позиции' },
                                    ...positionItems.map((r) => ({
                                        value: r.id,
                                        label: `${r.id}. ${r.titlePosition} ${r.unitName && `(${r.unitName})`} `,
                                        isDisabled:
                                            !!r.assignee &&
                                            r.assignee.employee_id !==
                                                employee?.id,
                                    })),
                                ]}
                                className="cursor-pointer"
                                value={
                                    [
                                        { value: '', label: 'Без позиции' },
                                        ...positionItems.map((r) => ({
                                            value: r.id,
                                            label: `${r.id}. ${r.titlePosition} ${r.unitName && `(${r.unitName})`} `,
                                        })),
                                    ].find(
                                        (option) =>
                                            option.value ===
                                            (formEmployee.position_id ?? ''),
                                    ) || { value: '', label: 'Без позиции' }
                                }
                                onChange={(option) => {
                                    handleChangeEmployee({
                                        target: {
                                            name: 'position_id',
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
                            isActive={isActiveEmployee}
                            styleColor="blue"
                            className={`flex-1  ${
                                isActiveEmployee
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
            )}

            {/* Пользователь */}
            {page === SWITCH_BUTTONS[1][1] && (
                <form
                    className="transition-all duration-150 space-y-4 w-full "
                    onSubmit={handleSubmitUser}
                >
                    {/* ID */}
                    {employee?.user && (
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500">ID</label>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={employee?.user?.id ?? ''}
                                    readOnly
                                    className="flex-1 mt-1 rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                                />

                                <Button
                                    type="button"
                                    className="mt-1 px-2 py-2 bg-red-500 hover:bg-red-600"
                                    styleColor="blue"
                                    onClick={() =>
                                        setModalSubmit(employee.id_user!)
                                    }
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        </div>
                    )}

                    {!employee ? (
                        <>
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500">
                                    ФИО
                                </label>
                                <input
                                    id="fio"
                                    name="fio"
                                    type="text"
                                    defaultValue={formCreateUser.fio || ''}
                                    onChange={handleChangeCreateUser}
                                    className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500">
                                    Личный email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder="Если не указывать, то останется таким же как и логин"
                                    defaultValue={formCreateUser.email || ''}
                                    onChange={handleChangeCreateUser}
                                    className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            {/* Позиция */}
                            {user?.role === 'admin' && positionItems && (
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-500 mb-1">
                                        Позиция
                                    </label>

                                    <Select
                                        name="position_id"
                                        id="position_id"
                                        options={[
                                            { value: '', label: 'Без позиции' },
                                            ...positionItems.map((r) => ({
                                                value: r.id,
                                                label: `${r.id}. ${r.titlePosition} ${r.unitName && `(${r.unitName})`} `,
                                                isDisabled: !!r.assignee,
                                            })),
                                        ]}
                                        className="cursor-pointer"
                                        value={
                                            [
                                                {
                                                    value: '',
                                                    label: 'Без позиции',
                                                },
                                                ...positionItems.map((r) => ({
                                                    value: r.id,
                                                    label: `${r.id}. ${r.titlePosition} ${r.unitName && `(${r.unitName})`} `,
                                                })),
                                            ].find(
                                                (option) =>
                                                    option.value ===
                                                    (formCreateUser.position_id ??
                                                        ''),
                                            ) || {
                                                value: '',
                                                label: 'Без позиции',
                                            }
                                        }
                                        onChange={(option) => {
                                            handleChangeCreateUser({
                                                target: {
                                                    name: 'position_id',
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
                                        menuPlacement="bottom"
                                    />
                                </div>
                            )}

                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500">
                                    Логин
                                </label>
                                <input
                                    id="login"
                                    name="login"
                                    type="text"
                                    defaultValue={formCreateUser.login || ''}
                                    onChange={handleChangeCreateUser}
                                    className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500">
                                    {'Пароль'}
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    defaultValue={formCreateUser.password}
                                    onChange={handleChangeCreateUser}
                                    placeholder="********"
                                    className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>

                            {user?.role === 'admin' && roleItems && (
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-500 mb-1">
                                        Роль
                                    </label>

                                    <Select
                                        name="role_id"
                                        options={roleItems.map((r) => ({
                                            value: r.id,
                                            label: r.name,
                                        }))}
                                        className="cursor-pointer"
                                        value={roleItems
                                            .map((r) => ({
                                                value: r.id,
                                                label: r.name,
                                            }))
                                            .find(
                                                (option) =>
                                                    option.value ===
                                                    formCreateUser.role_id,
                                            )}
                                        onChange={(option) => {
                                            if (!option) return;

                                            handleChangeCreateUser({
                                                target: {
                                                    name: 'role_id',
                                                    value: option.value,
                                                },
                                            } as any);
                                        }}
                                        placeholder="Выберите роль"
                                        isSearchable
                                        menuPlacement="top"
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500">
                                    Логин
                                </label>
                                <input
                                    id="login"
                                    name="login"
                                    type="text"
                                    defaultValue={formUser.login || ''}
                                    onChange={handleChangeUser}
                                    className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>

                            {/* Пароль */}
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500">
                                    {employee?.user ? 'Новый пароль' : 'Пароль'}
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    defaultValue={formUser.password}
                                    onChange={handleChangeUser}
                                    placeholder="********"
                                    className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>

                            {user?.role === 'admin' && roleItems && (
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-500 mb-1">
                                        Роль
                                    </label>

                                    <Select
                                        name="role_id"
                                        options={roleItems.map((r) => ({
                                            value: r.id,
                                            label: r.name,
                                        }))}
                                        className="cursor-pointer"
                                        value={roleItems
                                            .map((r) => ({
                                                value: r.id,
                                                label: r.name,
                                            }))
                                            .find(
                                                (option) =>
                                                    option.value ===
                                                    formUser.role_id,
                                            )}
                                        onChange={(option) => {
                                            if (!option) return;

                                            handleChangeUser({
                                                target: {
                                                    name: 'role_id',
                                                    value: option.value,
                                                },
                                            } as any);
                                        }}
                                        placeholder="Выберите роль"
                                        isSearchable
                                        menuPlacement="top"
                                    />
                                </div>
                            )}
                            <Access
                                handleClick={() => setModalCuratorTree(true)}
                                curatorAccessItems={
                                    employee?.user?.curatorAccess || null
                                }
                            />
                        </>
                    )}

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
                            isActive={isActiveUpdateUser}
                            styleColor="blue"
                            className={`flex-1  ${
                                isActiveUpdateUser
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
            )}
            {modalSubmit && (
                <ModalSubmit
                    handleSubmit={() => handleDeleteUser(modalSubmit)}
                    onClose={() => setModalSubmit(null)}
                />
            )}
            {modalCuratorTree && curatorTreeItems && (
                <ModalCuratorTree
                    title="Настройка доступа"
                    selectedNow={
                        (employee?.user?.curatorAccess?.map(
                            (item) => item.curatorPosition.id,
                        ) as number[]) || []
                    }
                    unitTree={curatorTreeItems}
                    handleMultiSubmit={handleCuratorSumbit}
                    onClose={() => setModalCuratorTree(false)}
                />
            )}
        </ModalAdminMainBody>
    );
}
