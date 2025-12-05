import React, { useState } from 'react';
import { FlashCoinIcon } from './FlashCoinIcon';

interface RouletteWheelProps {
    onSpinComplete: (amount: number) => void;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({ onSpinComplete }) => {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [claimed, setClaimed] = useState(false);
    const [wonAmount, setWonAmount] = useState<number | null>(null);

    // Segments configuration
    const segments = [10, 50, 20, 100, 30, 10, 80, 40];
    const segmentAngle = 360 / segments.length;

    const handleSpin = () => {
        if (spinning || claimed) return;

        setSpinning(true);
        
        // Randomly select an index
        const randomSegmentIndex = Math.floor(Math.random() * segments.length);
        
        // Calculate rotation needed to land on that segment at the top (0deg)
        // Since the wheel rotates clockwise, to get index N to the top, we need to rotate:
        // (360 - (N * angle)) 
        // We add extra spins for effect.
        
        const extraSpins = 5 * 360; // 5 full rotations
        // Current rotation + extra spins + alignment to the target segment
        // We add segmentAngle/2 to center the wedge under the pointer
        const targetRotation = extraSpins + (360 - (randomSegmentIndex * segmentAngle)) - (segmentAngle / 2);
        
        // Add a tiny random offset to make it look natural, but keep it within the wedge
        const jitter = (Math.random() * segmentAngle * 0.4) - (segmentAngle * 0.2);
        
        setRotation(targetRotation + jitter);

        setTimeout(() => {
            setSpinning(false);
            setClaimed(true);
            const amount = segments[randomSegmentIndex];
            setWonAmount(amount);
            onSpinComplete(amount);
        }, 4000); // Animation duration must match CSS
    };

    // Create the conic gradient string dynamically
    // Alternating colors: UOL Yellow (#F3B121) and Black (#1C1C1C)
    const gradientStops = segments.map((_, index) => {
        const start = index * (100 / segments.length);
        const end = (index + 1) * (100 / segments.length);
        const color = index % 2 === 0 ? '#F3B121' : '#1C1C1C';
        return `${color} ${start}% ${end}%`;
    }).join(', ');

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-uol-yellow/10 via-black to-black opacity-80"></div>

            <div className="z-10 text-center mb-10">
                <h2 className="text-4xl font-black text-uol-yellow uppercase tracking-tighter italic drop-shadow-lg">Roleta da Sorte</h2>
                <p className="text-sm font-medium text-gray-300 mt-2">Gire para ganhar Flash Coins!</p>
            </div>

            <div className="relative z-10 scale-110">
                {/* Pointer */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 w-8 h-10 filter drop-shadow-lg">
                    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                         <path d="M12 22L2 2h20L12 22z" />
                    </svg>
                </div>

                {/* Wheel Container */}
                <div 
                    className="w-72 h-72 rounded-full border-4 border-white shadow-[0_0_30px_rgba(243,177,33,0.3)] relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1)"
                    style={{ 
                        transform: `rotate(${rotation}deg)`,
                        background: `conic-gradient(${gradientStops})`
                    }}
                >
                    {/* Numbers Overlay */}
                    {segments.map((value, index) => (
                        <div 
                            key={index}
                            className="absolute w-full h-full top-0 left-0 pointer-events-none"
                            style={{ 
                                transform: `rotate(${index * segmentAngle + (segmentAngle/2)}deg)`,
                            }}
                        >
                             <div 
                                className="absolute top-4 left-1/2 -translate-x-1/2 font-bold text-lg"
                                style={{ 
                                    color: index % 2 === 0 ? '#000' : '#FFF'
                                }}
                             >
                                {value}
                            </div>
                        </div>
                    ))}
                    
                    {/* Center Cap */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg z-30 border-4 border-gray-100">
                        <FlashCoinIcon size={28} />
                    </div>
                </div>
            </div>

            <div className="mt-16 z-10 h-20 flex items-center justify-center">
                {wonAmount ? (
                    <div className="animate-bounce flex flex-col items-center">
                        <p className="text-xl font-bold mb-1">Parabéns!</p>
                        <div className="flex items-center gap-2 bg-white/10 px-6 py-2 rounded-full backdrop-blur-md border border-uol-yellow/50">
                            <FlashCoinIcon size={28} />
                            <span className="text-3xl font-black text-uol-yellow">+{wonAmount}</span>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleSpin}
                        disabled={spinning}
                        className="bg-uol-yellow text-black font-black text-xl px-12 py-4 rounded-full shadow-[0_0_20px_rgba(243,177,33,0.5)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                    >
                        {spinning ? 'Girando...' : 'GIRAR AGORA'}
                    </button>
                )}
            </div>
        </div>
    );
};