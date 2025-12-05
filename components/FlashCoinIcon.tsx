import React from 'react';
import { Zap } from 'lucide-react';

interface FlashCoinIconProps {
    size?: number;
    className?: string;
}

export const FlashCoinIcon: React.FC<FlashCoinIconProps> = ({ size = 24, className = "" }) => {
    return (
        <div 
            className={`relative flex items-center justify-center bg-uol-yellow rounded-full border-2 border-uol-black ${className}`}
            style={{ width: size, height: size }}
        >
            <Zap 
                size={size * 0.6} 
                className="fill-black text-black" 
                strokeWidth={3}
            />
        </div>
    );
};