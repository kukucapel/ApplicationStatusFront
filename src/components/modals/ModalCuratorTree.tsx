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
    handleMultiSubmit?: (added: number[], removed: number[]) => Promise<void>;
    handleChange?: (newUnitId: number, newUnitName: string) => void;
    unitTree: Curator[];
    title?: string;
    selectedNow: number | number[];
}

function diffAccess(
    initial: number[],
    next: number[],
): { added: number[]; removed: number[] } {
    const initialSet = new Set(initial);
    const nextSet = new Set(next);

    const added = next.filter((id) => !initialSet.has(id));
    const removed = initial.filter((id) => !nextSet.has(id));

    return { added, removed };
}

function TreeNode({
    node,
    selectedNow,
    newSelected,
    setNewSelected,
    setNewUnitName,
    multipleMode,

    level = 0,
}: {
    node: Curator;
    selectedNow: number | number[];
    newSelected: number | number[];
    setNewSelected: (newState: number | number[]) => void;
    setNewUnitName?: (newName: string) => void;
    multipleMode: boolean;
    level?: number;
}) {
    const [expanded, setExpanded] = useState(true);

    const hasChildren = node.children && Object.keys(node.children).length > 0;

    useEffect(() => {
        const isNodeSelected = (nodeId: number): boolean => {
            if (Array.isArray(selectedNow)) {
                return selectedNow.includes(nodeId);
            }
            return selectedNow === nodeId;
        };

        const hasSelectedChild = (n: Curator): boolean => {
            if (isNodeSelected(n.id)) return true;
            return Object.values(n.children || {}).some(hasSelectedChild);
        };

        if (!hasChildren && hasSelectedChild(node)) {
            setExpanded(true);
        }
    }, [node, selectedNow, hasChildren]);

    const isSelected = multipleMode
        ? Array.isArray(selectedNow) && selectedNow.includes(node.id)
        : selectedNow === node.id;

    const isNewSelected = multipleMode
        ? Array.isArray(newSelected) && newSelected.includes(node.id)
        : newSelected === node.id;

    const handleNodeClick = () => {
        if (multipleMode) {
            const currentSelected = Array.isArray(newSelected)
                ? newSelected
                : [];

            if (currentSelected.includes(node.id)) {
                setNewSelected(currentSelected.filter((id) => id !== node.id));
            } else {
                setNewSelected([...currentSelected, node.id]);
            }
        } else {
            if (!isSelected && !isNewSelected) {
                setNewSelected(node.id);
                if (setNewUnitName) {
                    setNewUnitName(node.employee.fio);
                }
            }
        }
    };

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
                onClick={handleNodeClick}
            >
                <div className="flex items-center gap-3 flex-grow">
                    {multipleMode && (
                        <div className="flex items-center justify-center w-5 h-5">
                            <input
                                type="checkbox"
                                checked={isNewSelected}
                                onChange={() => {}}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    <User className="h-5" />
                    <div className="flex flex-col max-w-[70%]">
                        <span className="text font-medium text-gray-900">
                            {node.employee.fio}
                        </span>
                        <span className="text-sm  text-gray-700 mt-0.5">
                            {node.unit_name[0]}
                        </span>
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
                        setNewUnitName={
                            multipleMode ? undefined : setNewUnitName
                        }
                        multipleMode={multipleMode}
                        level={level + 1}
                    />
                ))}
        </div>
    );
}

function arraysAreEqual(arr1: number[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((value, index) => value === sorted2[index]);
}

export default function ModalCuratorTree({
    onClose,
    handleSubmit,
    unitTree,
    handleMultiSubmit,
    selectedNow,
    handleChange,
    title = 'Назначение принимателя',
}: CuratorTreeModalProps) {
    const multipleMode = Array.isArray(selectedNow);

    const [newSelected, setNewSelected] = useState<number | number[]>(
        multipleMode ? (selectedNow as number[]) : (selectedNow as number),
    );
    const [newUnitName, setNewUnitName] = useState<string>('');

    const isActive = multipleMode
        ? !arraysAreEqual(newSelected as number[], selectedNow as number[])
        : (newSelected as number) !== 0 &&
          (newSelected as number) !== selectedNow;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleSave = () => {
        if (handleSubmit || handleMultiSubmit) {
            if (multipleMode) {
                if (handleMultiSubmit) {
                    const { added, removed } = diffAccess(
                        selectedNow,
                        newSelected as number[],
                    );

                    handleMultiSubmit(added, removed);
                }
            } else {
                if (handleSubmit)
                    handleSubmit({
                        to_position_id: newSelected as number,
                    });
            }
        } else if (handleChange) {
            if (!multipleMode) {
                handleChange(newSelected as number, newUnitName);
            }
        }
    };
    // console.log(newSelected);
    // console.log(selectedNow);
    return (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-l-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                <div className="px-10 pt-10 overflow-y-auto flex-1 custom-scroll">
                    <div className="mb-7 flex justify-between items-center">
                        <span className="text-xl">{title}</span>
                        <div className="flex items-center gap-4">
                            {multipleMode && (
                                <span className="text-sm text-gray-600">
                                    {Array.isArray(newSelected)
                                        ? `Выбрано: ${newSelected.length}`
                                        : 'Выбрано: 0'}
                                </span>
                            )}
                            <Button
                                styleColor="white"
                                className="p-1"
                                onClick={onClose}
                            >
                                <X className="w-6 h-6 text-gray-700 transition-colors" />
                            </Button>
                        </div>
                    </div>
                    <hr className="text-gray-400 mb-4" />

                    <div className="mb-5">
                        {Object.values(unitTree).map((node, index) => (
                            <TreeNode
                                key={node.id || index}
                                node={node}
                                selectedNow={selectedNow}
                                newSelected={newSelected}
                                setNewSelected={setNewSelected}
                                setNewUnitName={
                                    multipleMode ? undefined : setNewUnitName
                                }
                                multipleMode={multipleMode}
                            />
                        ))}
                    </div>
                </div>
                <div className="transition-all sticky px-10 py-4 bottom-0 border-gray-300 duration-150 flex gap-3 border-t">
                    <Button
                        isActive={!isActive}
                        styleColor="blue"
                        onClick={handleSave}
                        className={`flex-1 ${
                            isActive
                                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                                : 'bg-blue-600 cursor-not-allowed opacity-50'
                        }`}
                    >
                        Сохранить
                    </Button>
                    <Button
                        onClick={onClose}
                        styleColor="blue"
                        className="flex-1 py-2 hover:hover:bg-blue-700"
                    >
                        Отмена
                    </Button>
                </div>
            </div>
        </div>
    );
}
