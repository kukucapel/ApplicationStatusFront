export default function Logo() {
    return (
        <div className="text-center mb-8 animate-fade-in">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
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
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Система обработки заявок
            </h1>
            <p className="text-base text-gray-600">Город Калуга</p>
        </div>
    );
}
