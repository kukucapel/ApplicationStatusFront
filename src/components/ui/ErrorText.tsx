import { error } from 'console';

interface ErrorTextProps {
    error: string;
}

export default function ErrorText({ error }: ErrorTextProps) {
    return <div className="mt-1 text-red-500">{error}</div>;
}
