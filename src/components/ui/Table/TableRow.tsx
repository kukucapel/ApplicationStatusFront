import { ReactNode } from 'react';

interface TableRowProps {
    children?: ReactNode;
    id: number;
    editMode?: boolean;
    deleteMode: boolean;
    onClickTableModal: () => void;
}

export default function TableRow({
    children,
    id,
    editMode,
    deleteMode,
    onClickTableModal,
}: TableRowProps) {
    return (
        <div
            onClick={editMode ? onClickTableModal : () => {}}
            className={`border relative rounded-lg p-4 transition-all duration-200 ${
                editMode
                    ? 'cursor-pointer border-gray-400  hover:shadow-md'
                    : deleteMode
                    ? 'border-red-300 hover:border-red-600'
                    : 'border-gray-200'
            }`}
        >
            {children}
        </div>
    );
}
