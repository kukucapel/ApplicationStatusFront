export default function CounterApplication() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-1">Всего</div>
                    <div className="text-2xl font-bold text-gray-900">0</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-1">Новые</div>
                    <div className="text-2xl font-bold text-red-600">0</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-1">В работе</div>
                    <div className="text-2xl font-bold text-yellow-600">0</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-1">Обработаны</div>
                    <div className="text-2xl font-bold text-green-600">0</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-1">Закрыты</div>
                    <div className="text-2xl font-bold text-gray-600">0</div>
                </div>
            </div>
        </div>
    );
}
