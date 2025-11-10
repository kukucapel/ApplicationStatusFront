import { LabelHTMLAttributes, ReactNode } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    children: ReactNode;
}

export default function Label({ children, ...rest }: LabelProps) {
    return (
        <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            {...rest}
        >
            {children}
        </label>
    );
}
