import { ReactNode } from 'react';

interface TableRowProps {
    children?: ReactNode;
    id: number;
}

export default function TableRow({ children, id }: TableRowProps) {
    return (
        <div
            data-testid={`application-card-${id}`}
            // onClick={() => onClickApplicationModal(app)}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
        >
            {children}
        </div>
    );
}
