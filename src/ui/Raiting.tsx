'use client';
import { Star } from 'lucide-react';

interface RaitingProps {
    type: 'view' | 'set';
    responseRating?: number;
    rating?: Record<number, number>;
    handleSetRating?: (id: number, value: number) => void;
    handleSubmit?: () => void;
    id?: number;
}

export default function Raiting({
    type,
    handleSetRating,
    responseRating,
    rating,
    handleSubmit,
    id,
}: RaitingProps) {
    if (type === 'view' && responseRating) {
        return (
            <>
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((el) => (
                        <Star
                            key={el}
                            className={`transition-all duration-150 text-yellow-300 ${
                                responseRating >= el && 'fill-yellow-300'
                            }`}
                        />
                    ))}
                </div>
            </>
        );
    } else if (rating && handleSetRating && handleSubmit && id) {
        return (
            <>
                <div className="flex ">
                    {[1, 2, 3, 4, 5].map((el) => (
                        <Star
                            key={el}
                            className={`transition-all duration-150 text-yellow-300 ${
                                rating[id] >= el
                                    ? 'fill-yellow-300'
                                    : 'cursor-pointer hover:scale-110'
                            } ${
                                rating[id] !== el &&
                                'cursor-pointer hover:scale-110'
                            }`}
                            onClick={
                                rating[id] != el
                                    ? () => handleSetRating(id, el)
                                    : () => {}
                            }
                        />
                    ))}
                </div>
                <button
                    className={`mt-2 rounded-2xl  px-1.5 border-gray-300 transition-all duration-200 ${
                        rating[id] != 0
                            ? 'hover:scale-110 shadow-md cursor-pointer'
                            : 'text-gray-400'
                    }`}
                    onClick={handleSubmit}
                >
                    Оценить ответ
                </button>
            </>
        );
    }
}
