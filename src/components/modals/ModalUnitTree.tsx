'use client';

import { useState, useEffect } from 'react';
import { ApplicationUnitUpdate } from '@/dtos/ApplicationDto';
import { Unit } from '@/dtos/AdminDto';
import Button from '../ui/Button';
import { Building2, ChevronDown, ChevronRight, X } from 'lucide-react';
import { UpdateApplicationDataProps } from '@/lib/updateApplication';

interface UnitTreeModalProps {
    onClose: () => void;
    handleSubmit?: (data: UpdateApplicationDataProps) => Promise<void>;
    handleChange?: (newUnitId: number, newUnitName: string) => void;
    unitTree: Unit;
    selectedNow: number;
}

// Рекурсивный компонент для дерева
function TreeNode({
    node,
    selectedNow,
    newSelected,
    setNewSelected,
    setNewUnitName,
}: {
    node: Unit;
    selectedNow: number;
    newSelected: number;
    setNewSelected: (newState: number) => void;
    setNewUnitName: (newName: string) => void;
}) {
    const [expanded, setExpanded] = useState<boolean>(false);

    const hasChildren = Object.keys(node.children || {}).length > 0;

    useEffect(() => {
        function hasSelectedChild(n: Unit): boolean {
            if (n.id === selectedNow) return true;
            return Object.values(n.children || {}).some((child) =>
                hasSelectedChild(child)
            );
        }

        if (!hasChildren && hasSelectedChild(node)) {
            setExpanded(true);
        }
    }, [node, selectedNow, hasChildren]);

    return (
        <div className="ml-4 mt-2">
            <div
                className={`flex gap-1 items-center border py-2 px-5 rounded-xl border-blue-700  transition-all duration-150 select-none ${
                    selectedNow === node.id
                        ? 'bg-green-100'
                        : newSelected === node.id
                        ? 'bg-green-300'
                        : 'cursor-pointer hover:bg-green-300'
                }`}
                onClick={() => {
                    if (selectedNow !== node.id) {
                        if (newSelected !== node.id) {
                            setNewSelected(node.id);
                            setNewUnitName(node.unit_name);
                        }
                    }
                }}
            >
                {hasChildren && (
                    <span className="hover:scale-110 rounded-md transition-all duration-150 mr-1 cursor-pointer">
                        {!expanded ? (
                            <ChevronRight
                                onClick={() => setExpanded((prev) => !prev)}
                            />
                        ) : (
                            <ChevronDown
                                onClick={() => setExpanded((prev) => !prev)}
                            />
                        )}
                    </span>
                )}
                <div className="flex items-center gap-2 flex-grow">
                    <Building2 className="w-5" />
                    <span className="max-w-[70%]">{node.unit_name}</span>

                    {(selectedNow === node.id || newSelected === node.id) && (
                        <span className="ml-auto text-sm text-gray-500">
                            {selectedNow === node.id ? 'Текущий' : 'Выбрано'}
                        </span>
                    )}
                </div>
            </div>
            {expanded &&
                Object.values(node.children).map((child) => (
                    <TreeNode
                        setNewUnitName={setNewUnitName}
                        newSelected={newSelected}
                        setNewSelected={setNewSelected}
                        selectedNow={selectedNow}
                        key={child.id}
                        node={child}
                    />
                ))}
        </div>
    );
}

export default function ModalUnitTree({
    onClose,
    handleSubmit,
    unitTree,
    selectedNow,
    handleChange,
}: UnitTreeModalProps) {
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
                        <span className="text-xl">
                            Назначение исполнительного органа
                        </span>
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
                        {Object.values(unitTree).map((node) => (
                            <TreeNode
                                setNewUnitName={setNewUnitName}
                                setNewSelected={setNewSelected}
                                newSelected={newSelected}
                                selectedNow={selectedNow}
                                key={node.id}
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
                                          assigned_unit_id: newSelected,
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
