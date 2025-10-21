interface ButtonProps {
    buttonText: string;
    className?: string;
    isActive?: boolean;
    onClick?: () => void;
}

export default function Button({
    buttonText,
    className,
    isActive,
    onClick,
}: ButtonProps) {
    return (
        <button
            className={`${className} transition border-2 rounded-lg border-gray-200 font-medium ${
                isActive
                    ? 'text-white bg-blue-600'
                    : 'cursor-pointer active:scale-95 duration-150 shadow-md'
            } `}
            disabled={isActive ? true : false}
            onClick={onClick}
        >
            {buttonText}
        </button>
    );
}
