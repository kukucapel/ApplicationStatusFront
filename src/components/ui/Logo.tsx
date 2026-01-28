interface LogoProps {
    className?: string;
    title?: string;
    typeLogo?: number;
    subTitle?: string;
}

export default function Logo({
    className,
    title,
    typeLogo,
    subTitle,
}: LogoProps) {
    return (
        <div className={`${className} hidden md:inline-flex animate-fade-in`}>
            <div
                className={`inline-block p-3 ${
                    typeLogo === 1 && 'bg-blue-100 rounded-full'
                } rounded-2xl `}
            >
                {typeLogo === 1 ? (
                    <svg
                        className="w-12 h-12 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                ) : typeLogo === 3 ? (
                    <img
                        src="/status/logo.png"
                        alt="Герб города"
                        className=" h-20"
                    />
                ) : (
                    <img
                        src="/status/logo.png"
                        alt="Герб города"
                        className=" h-30"
                    />
                )}
            </div>

            <div>
                <h1 className="text-2xl select-none lg:text-4xl  font-bold text-gray-900 mb-2">
                    {title || 'Система обработки личного приёма'}
                </h1>
                <p className="text-base select-none text-gray-600">
                    {subTitle || 'Город Калуга'}
                </p>
            </div>
        </div>
    );
}
