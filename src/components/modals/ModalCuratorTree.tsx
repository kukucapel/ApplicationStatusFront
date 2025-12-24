'use client';

import { useState, useEffect } from 'react';
import { ApplicationUnitUpdate } from '@/dtos/ApplicationDto';
import { Curator, Unit } from '@/dtos/AdminDto';
import Button from '../ui/Button';
import { Building2, ChevronDown, ChevronRight, User, X } from 'lucide-react';
import { UpdateApplicationDataProps } from '@/lib/updateApplication';

interface CuratorTreeModalProps {
    onClose: () => void;
    handleSubmit?: (data: UpdateApplicationDataProps) => Promise<void>;
    handleChange?: (newUnitId: number, newUnitName: string) => void;
    unitTree: Curator[];
    selectedNow: number;
}

function TreeNode({
    node,
    selectedNow,
    newSelected,
    setNewSelected,
    setNewUnitName,
    level = 0, // добавили уровень
}: {
    node: Curator;
    selectedNow: number;
    newSelected: number;
    setNewSelected: (newState: number) => void;
    setNewUnitName: (newName: string) => void;
    level?: number; // корень по умолчанию 0
}) {
    const [expanded, setExpanded] = useState(true);

    const hasChildren = node.children && Object.keys(node.children).length > 0;

    useEffect(() => {
        const hasSelectedChild = (n: Curator): boolean => {
            if (n.id === selectedNow) return true;
            return Object.values(n.children || {}).some(hasSelectedChild);
        };

        if (!hasChildren && hasSelectedChild(node)) {
            setExpanded(true);
        }
    }, [node, selectedNow, hasChildren]);

    const isSelected = selectedNow === node.id;
    const isNewSelected = newSelected === node.id;

    return (
        <div className={`mt-2 ml-${level === 0 ? 0 : 7}`}>
            <div
                className={`flex gap-1 items-center border py-2 px-5 rounded-xl border-blue-700 transition-all duration-150 select-none
                    ${
                        isSelected
                            ? 'bg-green-100'
                            : isNewSelected
                            ? 'bg-green-200'
                            : 'cursor-pointer hover:bg-green-200'
                    }
                `}
                onClick={() => {
                    if (!isSelected && !isNewSelected) {
                        setNewSelected(node.id);
                        setNewUnitName(node.employee.fio);
                    }
                }}
            >
                <div className="flex items-center gap-3 flex-grow">
                    <User className="h-5" />
                    <div className="flex flex-col max-w-[70%]">
                        <span className="text font-medium text-gray-900">
                            {node.employee.fio}
                        </span>
                        <span className="text-sm  text-gray-700 mt-0.5">
                            {node.unit_name[0]}
                        </span>
                        {/* <span className="text-sm text-gray-500 mt-0.5">
                            {node.title.name}
                        </span> */}
                    </div>

                    {(isSelected || isNewSelected) && (
                        <span className="ml-auto text-sm text-gray-500 font-medium">
                            {isSelected ? 'Текущий' : 'Выбрано'}
                        </span>
                    )}
                </div>
            </div>

            {expanded &&
                hasChildren &&
                Object.values(node.children).map((child) => (
                    <TreeNode
                        key={child.id}
                        node={child}
                        selectedNow={selectedNow}
                        newSelected={newSelected}
                        setNewSelected={setNewSelected}
                        setNewUnitName={setNewUnitName}
                        level={level + 1} // увеличиваем уровень для потомков
                    />
                ))}
        </div>
    );
}

export default function ModalCuratorTree({
    onClose,
    handleSubmit,
    unitTree,
    selectedNow,
    handleChange,
}: CuratorTreeModalProps) {
    const [newSelected, setNewSelected] = useState<number>(0);
    const [newUnitName, setNewUnitName] = useState<string>('');
    const isActive = newSelected === 0;
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);
    return (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-l-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                <div className="px-10 pt-10 overflow-y-auto flex-1 custom-scroll">
                    <div className="mb-7 flex justify-between items-center">
                        <span className="text-xl">Назначение принимателя</span>
                        <Button
                            styleColor="white"
                            className="p-1"
                            onClick={onClose}
                        >
                            <X className="w-6 h-6 text-gray-700 transition-colors" />
                        </Button>
                    </div>
                    <hr className="text-gray-400 mb-4" />

                    {/* Рендерим дерево */}
                    <div className="mb-5">
                        {Object.values(unitTree).map((node, index) => (
                            <TreeNode
                                setNewUnitName={setNewUnitName}
                                setNewSelected={setNewSelected}
                                newSelected={newSelected}
                                selectedNow={selectedNow}
                                key={node.id || index}
                                node={node}
                            />
                        ))}
                    </div>
                </div>
                <div className="transition-all sticky px-10 py-4 bottom-0 border-gray-300 duration-150 flex gap-3 border-t">
                    <Button
                        isActive={isActive}
                        styleColor="blue"
                        onClick={
                            handleSubmit
                                ? () =>
                                      handleSubmit({
                                          to_position_id: newSelected,
                                      })
                                : handleChange &&
                                  (() => handleChange(newSelected, newUnitName))
                        }
                        className={`flex-1  ${
                            isActive
                                ? 'bg-blue-400'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        Сохранить
                    </Button>
                    <Button
                        onClick={() => onClose()}
                        styleColor="blue"
                        className="flex-1 py-2 hover:bg-blue-700"
                    >
                        Отмена
                    </Button>
                </div>
            </div>
        </div>
    );
}
