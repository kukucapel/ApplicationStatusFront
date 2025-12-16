'use client';

import Button from '@/components/ui/Button';
import ModalAdminMainBody from '@/components/ui/ModalUi/ModalAdminMainBody';
import { useUser } from '@/contexts/UserContext';
import { Role, RoleUpdate } from '@/dtos/AdminDto';
import { addRole, updateRole } from '@/lib/adminData';
import { useEffect, useState } from 'react';

interface ModalAdminRolesProps {
    role: Role | null;
    setModalIsActive: () => void;
    loadRoles: () => Promise<void>;
}
export default function ModalAdminRoles({
    setModalIsActive,
    loadRoles,
    role,
}: ModalAdminRolesProps) {
    const { user } = useUser();

    const [form, setForm] = useState<RoleUpdate>({
        name: role?.name || '',
        description: role?.description || '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [successfully, setSuccessfully] = useState<string>('');

    const isActive: boolean = role
        ? (form.name === role.name && form.description === role.description) ||
          form.name === ''
        : !(form.name !== '');

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
            const payload = { ...form };

            const result =
                role && payload
                    ? await updateRole(payload, role.id)
                    : await addRole(form);
            await loadRoles();
            setSuccessfully('Успешно сохранено');
            setModalIsActive();
        } catch {
            setError('Не удалось сохранить');
        } finally {
            setLoading(false);
        }
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
                className="transition-all duration-150 space-y-4 w-full "
                onSubmit={handleSubmit}
            >
                {/* ID */}
                {role && (
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500">ID</label>
                        <input
                            type="text"
                            value={role?.id ?? ''}
                            readOnly
                            className="mt-1 rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>
                )}

                {/* Название */}
                <div className="flex flex-col">
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

                {/* Описание */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-500">Описание</label>
                    <input
                        id="description"
                        name="description"
                        type="text"
                        defaultValue={form.description || ''}
                        onChange={handleChange}
                        className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                    />
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
