interface ModalBodyBlockFieldProps {
    icon?: React.ElementType;
    nameField: string;
    valueField: string;
    typeStyle?: number;
    bgColor?: 'b' | 'g';
    isLoading?: boolean;
}

export default function ModalBodyBlockField({
    icon,
    nameField,
    valueField,
    typeStyle = 1,
    bgColor = 'b',
    isLoading,
}: ModalBodyBlockFieldProps) {
    const IconComponent = icon;
    if (typeStyle === 1) {
        return (
            <div className="flex items-start gap-3">
                {IconComponent && (
                    <IconComponent className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                    <p className="text-sm text-gray-600">{nameField}</p>
                    {isLoading ? (
                        <div className="h-6 w-full max-w-[240px] animate-pulse rounded bg-gray-200" />
                    ) : (
                        <p className="font-medium text-gray-900">
                            {valueField}
                        </p>
                    )}
                </div>
            </div>
        );
    } else {
        return (
            <div
                className={`${
                    bgColor === 'g' ? 'bg-gray-50' : 'bg-blue-50'
                }  rounded-lg p-4`}
            >
                <div className="flex items-start gap-2 mb-2">
                    {IconComponent && (
                        <IconComponent className="w-5 h-5 text-blue-600 mt-0.5" />
                    )}
                    <p className="text-sm font-medium text-gray-700">
                        {nameField}
                    </p>
                </div>
                {isLoading ? (
                    <div className="h-6 w-full max-w-[240px] animate-pulse rounded bg-gray-200" />
                ) : (
                    <p className="font-medium text-gray-900">{valueField}</p>
                )}
            </div>
        );
    }
}
