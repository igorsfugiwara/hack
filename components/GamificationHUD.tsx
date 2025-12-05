import React, { useEffect, useState } from 'react';

interface HUDProps {
    pointsAdded: number | null;
}

export const GamificationHUD: React.FC<HUDProps> = ({ pointsAdded }) => {
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (pointsAdded !== null && pointsAdded > 0) {
            setValue(pointsAdded);
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [pointsAdded]);

    if (!visible) return null;

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-[bounce_1s_infinite]">
            <div className="bg-uol-yellow text-black px-4 py-1 rounded-full shadow-xl border-2 border-white flex items-center gap-2">
                <span className="font-black text-xl">+{value}</span>
                <span className="text-xs font-bold uppercase tracking-widest">Pontos</span>
            </div>
        </div>
    );
};