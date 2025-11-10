import { ReactNode } from 'react';

interface TableRowProps {
    children?: ReactNode;
    id: number;
    editMode?: boolean;
    onClickTableModal: () => void;
}

export default function TableRow({
    children,
    id,
    editMode,
    onClickTableModal,
}: TableRowProps) {
    return (
        <div
            onClick={editMode ? onClickTableModal : () => {}}
            className={`border border-gray-200  rounded-lg p-4 transition-all duration-200 ${
                editMode && 'cursor-pointer border-gray-400  hover:shadow-md'
            }`}
        >
            {children}
        </div>
    );
}
