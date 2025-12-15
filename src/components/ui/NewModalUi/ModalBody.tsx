import { ReactNode } from 'react';

interface ModalBodyProps {
    children: ReactNode;
    className?: string;
}

export default function ModalBody({ children, className }: ModalBodyProps) {
    return <div className={`${className} p-6 space-y-6`}>{children}</div>;
}
