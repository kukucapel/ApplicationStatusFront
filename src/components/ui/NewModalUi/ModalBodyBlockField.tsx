import { AttachmentInDto } from '@/dtos/ApplicationDto';

interface ModalBodyBlockFieldProps {
    icon?: React.ElementType;
    nameField: string;
    valueField: string | AttachmentInDto[];
    typeStyle?: number;
    bgColor?: 'b' | 'g';
    isLoading?: boolean;
    isFiles?: boolean;
}

export default function ModalBodyBlockField({
    icon,
    nameField,
    valueField,
    typeStyle = 1,
    bgColor = 'b',
    isLoading,
    isFiles = false,
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
                            {valueField as string}
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
                ) : isFiles && typeof valueField !== 'string' ? (
                    valueField.map((file: AttachmentInDto, index) => (
                        <div key={index} className="mt-1">
                            <a
                                href={file.url}
                                className="text-gray-900 ml-7 mt-1 whitespace-pre-wrap underline cursor-pointer"
                                target="_blank"
                            >
                                {file.fileName || 'Файл'}
                            </a>
                        </div>
                    ))
                ) : (
                    <p className="font-medium text-gray-900">
                        {valueField as string}
                    </p>
                )}
            </div>
        );
    }
}
