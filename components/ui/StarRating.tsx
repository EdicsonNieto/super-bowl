import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  disabled?: boolean;
  size?: number;
  gap?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  setRating, 
  disabled = false,
  size = 32,
  gap = "gap-4"
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className={`flex ${gap} justify-center py-4`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        
        return (
          <motion.button
            key={star}
            whileHover={!disabled ? { scale: 1.2 } : {}}
            whileTap={!disabled ? { scale: 0.9 } : {}}
            className={`
              relative p-1 rounded-lg transition-all duration-300
              ${disabled ? 'cursor-default' : 'cursor-pointer'}
              ${isActive ? 'text-white' : 'text-white/20'}
            `}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            onClick={() => !disabled && setRating(star)}
            type="button"
          >
            {/* Background Glow for Active Stars */}
            {isActive && (
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
            )}
            
            <Star
              size={size}
              fill={isActive ? "url(#starGradient)" : "none"}
              strokeWidth={1.5}
              className="relative z-10"
            />
          </motion.button>
        );
      })}

      {/* Define SVG Gradient for Fill */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </svg>
    </div>
  );
};