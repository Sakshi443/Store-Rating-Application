import { Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: number;
}

export const StarRating = ({ rating, onRatingChange, readonly = false, size = 16 }: StarRatingProps) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onRatingChange?.(star)}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(0)}
                    className={cn(
                        "transition-all duration-200",
                        readonly ? "cursor-default" : "cursor-pointer hover:scale-110 active:scale-90"
                    )}
                >
                    <Star
                        size={size}
                        strokeWidth={2.5}
                        className={cn(
                            "transition-colors",
                            (hoverRating || rating) >= star
                                ? "text-[#FFDA1A] fill-[#FFDA1A]"
                                : "text-gray-200 fill-transparent"
                        )}
                    />
                </button>
            ))}
        </div>
    );
};
