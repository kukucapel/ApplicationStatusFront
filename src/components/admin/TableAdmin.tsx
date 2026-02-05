'use client';

import { Edit, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import TableEmployees from './TableEmployees';
import { Employee, Position, PositionTitle, Role } from '@/dtos/AdminDto';
import { adminData } from '@/lib/adminData';
import { useUser } from '@/contexts/UserContext';
import TableHeader from './TableHeader';
import TableRoles from './TableRoles';
import TablePositionTitles from './TablePositionTitles';
import TablePositions from './TablePositions';

interface TableAdminProps {
    page: number;
    MENU: [string, string][];
}

export default function TableAdmin({ page, MENU }: TableAdminProps) {
    const { user } = useUser();

    const [searchMode, setSearchMode] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(
        user?.role === 'admin' && true,
    );
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);

    const [employeeItems, setEmployeeItems] = useState<Employee[] | null>(null);
    const [roleItems, setRoleItems] = useState<Role[] | null>(null);
    const [positionTitleItems, stePositionTitleItems] = useState<
        PositionTitle[] | null
    >(null);
    const [positionItems, setPositionItems] = useState<Position[] | null>(null);

    const loadEmployees = async function () {
        const employeeData = await adminData('/employees');
        const employeesWithTitle: Employee[] = employeeData.items.map(
            (employee: Employee) => ({
                ...employee,
                titlePosition: employee.position?.title.name ?? '',
                id_user: employee.user?.id ?? null,
                role: employee.user?.role.name ?? '',
                login: employee.user?.login ?? '',
            }),
        );

        setEmployeeItems(employeesWithTitle);
    };
    const loadRoles = async function () {
        const roleData = await adminData('/roles');
        setRoleItems(roleData.items);
    };
    const loadPositions = async function () {
        const positionData = await adminData('/org/positions');
        const positionWithFieldSort = positionData.items.map(
            (position: Position) => ({
                ...position,
                titlePosition: position.title?.name ?? '',
                unitName: position.unit?.unit_name ?? '',
                employeeFio: position.assignee?.fio ?? '',
            }),
        );
        setPositionItems(positionWithFieldSort);
    };
    const loadPostionTitles = async function () {
        const positionTitleData = await adminData(
            '/org/positions/position-titles',
        );
        stePositionTitleItems(positionTitleData.items);
    };

    useEffect(() => {
        async function load() {
            await Promise.all([
                loadEmployees(),
                loadPositions(),
                loadPostionTitles(),
                loadRoles(),
            ]);
        }
        load();
    }, []);

    return (
        <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 border-gray-200">
                <TableHeader
                    title={MENU[page][0]}
                    setShowAddModal={setShowAddModal}
                    role={user?.role}
                    searchMode={searchMode}
                    onClickSearch={() => setSearchMode((prev) => !prev)}
                    editMode={editMode}
                    onClickEdit={() => {
                        deleteMode && setDeleteMode(false);
                        setEditMode((prev) => !prev);
                    }}
                    deleteMode={deleteMode}
                    onClickDelete={() => {
                        editMode && setEditMode(false);
                        setDeleteMode((prev) => !prev);
                    }}
                />

                <hr className="border-gray-300 mx-6 mb-6" />
                {page === 0 ? (
                    <TableEmployees
                        positionItems={positionItems}
                        showAddModal={showAddModal}
                        setShowAddModal={setShowAddModal}
                        roleItems={roleItems}
                        employeeItems={employeeItems}
                        searchMode={searchMode}
                        editMode={editMode}
                        deleteMode={deleteMode}
                        page={MENU[page]}
                        loadEmployees={loadEmployees}
                    />
                ) : page === 1 && user?.role === 'admin' ? (
                    <TableRoles
                        deleteMode={deleteMode}
                        showAddModal={showAddModal}
                        setShowAddModal={setShowAddModal}
                        roleItems={roleItems}
                        searchMode={searchMode}
                        editMode={editMode}
                        page={MENU[page]}
                        loadRoles={loadRoles}
                    />
                ) : page === 2 && user?.role === 'admin' ? (
                    <TablePositionTitles
                        deleteMode={deleteMode}
                        showAddModal={showAddModal}
                        setShowAddModal={setShowAddModal}
                        searchMode={searchMode}
                        editMode={editMode}
                        loadPostionTitles={loadPostionTitles}
                        positionTitleItems={positionTitleItems}
                        page={MENU[page]}
                    />
                ) : page === 3 && user?.role === 'admin' ? (
                    <TablePositions
                        deleteMode={deleteMode}
                        showAddModal={showAddModal}
                        setShowAddModal={setShowAddModal}
                        searchMode={searchMode}
                        editMode={editMode}
                        loadPositions={loadPositions}
                        positionItems={positionItems}
                        page={MENU[page]}
                    />
                ) : (
                    ''
                )}
            </div>
        </main>
    );
}
