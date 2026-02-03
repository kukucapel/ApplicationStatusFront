import { ReactNode } from 'react';

interface TableRowProps {
    children?: ReactNode;
    id: number;
    editMode?: boolean;
    deleteMode: boolean;
    onClickTableModal: () => void;
    onClickDelete: () => void;
    className?: string;
    admin?: boolean;
}

export default function TableRow({
    children,
    id,
    className,
    editMode,
    deleteMode,
    onClickDelete,
    onClickTableModal,
    admin = false,
}: TableRowProps) {
    return (
        <div
            onClick={
                editMode && !admin
                    ? onClickTableModal
                    : deleteMode
                      ? onClickDelete
                      : () => {}
            }
            className={`${className} border relative rounded-lg p-4 transition-all duration-200 ${
                editMode && !admin
                    ? 'cursor-pointer border-gray-400  hover:shadow-md'
                    : deleteMode
                      ? 'cursor-pointer border-red-300 hover:border-red-600'
                      : 'border-gray-200'
            }`}
        >
            {children}
        </div>
    );
}
