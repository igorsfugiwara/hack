import React, { useEffect, useState } from 'react';
import { Gift } from 'lucide-react';

interface DailyBonusTimerProps {
    onClaim: () => void;
}

export const DailyBonusTimer: React.FC<DailyBonusTimerProps> = ({ onClaim }) => {
    const DURATION = 60; // 60 seconds (1 minute)
    const [timeLeft, setTimeLeft] = useState(DURATION);
    const [readyToClaim, setReadyToClaim] = useState(false);

    useEffect(() => {
        if (readyToClaim) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setReadyToClaim(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [readyToClaim]);

    const progress = ((DURATION - timeLeft) / DURATION) * 100;

    // Adjusted positioning to prevent overlap and clipping
    // top-[80px] ensures it sits below the header coins
    const positionClass = "absolute top-[80px] right-4 z-40 transition-opacity";

    if (readyToClaim) {
        return (
            <div 
                onClick={onClaim}
                className={`${positionClass} cursor-pointer animate-bounce group`}
            >
                <div className="relative">
                    <div className="bg-uol-yellow text-black p-2 rounded-full shadow-[0_0_15px_rgba(243,177,33,0.6)] border-2 border-white group-hover:scale-110 transition-transform">
                        <Gift size={20} strokeWidth={2.5} />
                    </div>
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white animate-pulse">
                        !
                    </div>
                    <div className="absolute top-10 right-0 bg-black/80 text-uol-yellow text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Pegar Presente
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${positionClass} flex items-center justify-center opacity-90 hover:opacity-100`}>
            {/* SVG Circle Timer with expanded viewBox to prevent clipping */}
            <div className="relative w-10 h-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                    {/* Background Circle */}
                    <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="rgba(0,0,0,0.6)"
                        strokeWidth="4"
                        fill="rgba(0,0,0,0.2)"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="#F3B121"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray="100.5" // 2 * pi * 16
                        strokeDashoffset={100.5 - (100.5 * progress) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white drop-shadow-md">
                        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                    </span>
                </div>
            </div>
        </div>
    );
};