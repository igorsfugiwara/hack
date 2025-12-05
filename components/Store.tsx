import React, { useState } from 'react';
import { Reward, UserStats, Product, InterestCategory } from '../types';
import { Lock, Check, Star, ShoppingBag, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { FlashCoinIcon } from './FlashCoinIcon';
import { PaymentModal } from './PaymentModal';

interface StoreProps {
    stats: UserStats;
    rewards: Reward[];
    sponsorProducts: Product[];
    onRedeem: (reward: Reward) => void;
    onActivateBoost: () => void;
    userInterests: InterestCategory[];
}

export const Store: React.FC<StoreProps> = ({ stats, rewards, sponsorProducts, onRedeem, onActivateBoost, userInterests }) => {
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

    const handleInitialRedeem = (reward: Reward) => {
        setSelectedReward(reward);
    };

    const confirmRedemption = () => {
        if (selectedReward) {
            // Check if it's the special Boost Reward
            if (selectedReward.id === 'boost-special') {
                onActivateBoost();
                setSelectedReward(null); // Close immediately for Boost to show animation/UI change
            } else {
                onRedeem(selectedReward);
                // Do NOT close modal here for normal rewards. 
                // Let PaymentModal show the success/coupon screen.
            }
        }
    };

    const handleBuyBoost = () => {
        // Create a temporary reward object for the payment flow
        const boostReward: Reward = {
            id: 'boost-special',
            title: 'Turbo Boost (1h)',
            cost: 0, // It's a cash purchase (simulated), so coin cost is 0 or irrelevant for the modal text
            partner: 'Clube UOL',
            image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=300&q=80',
            description: 'Dobre seus Flash Coins por 1 hora!'
        };
        setSelectedReward(boostReward);
    };

    // Sort sponsor products based on user interests
    const sortedSponsors = [...sponsorProducts].sort((a, b) => {
        const aMatches = userInterests.includes(a.category) ? 1 : 0;
        const bMatches = userInterests.includes(b.category) ? 1 : 0;
        return bMatches - aMatches;
    });

    return (
        <div className="flex flex-col min-h-full bg-white text-uol-black pb-24 relative">
            
            {/* Payment Modal Overlay */}
            {selectedReward && (
                <PaymentModal 
                    reward={selectedReward} 
                    onClose={() => setSelectedReward(null)} 
                    onConfirm={confirmRedemption} 
                />
            )}

            {/* Header */}
            <div className="sticky top-0 bg-uol-yellow z-10 p-6 rounded-b-3xl shadow-lg">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold text-uol-black">Clube UOL</h2>
                        <p className="text-sm font-medium opacity-80">Troque Flash Coins por vantagens</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <span className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Saldo Atual</span>
                        <div className="flex items-center gap-2">
                             <FlashCoinIcon size={32} />
                             <span className="text-3xl font-black">{stats.coins}</span>
                        </div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Nível {stats.level}</span>
                        <span>{Math.floor((stats.coins % 1000) / 10)}% para Nível {stats.level + 1}</span>
                    </div>
                    <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-black transition-all duration-500" 
                            style={{ width: `${(stats.coins % 1000) / 10}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* BOOST BANNER (Hidden if active) */}
            {!stats.boostActive && (
                <div className="mt-4 mx-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white text-center shadow-lg transform transition-all hover:scale-[1.02] cursor-pointer" onClick={handleBuyBoost}>
                    <h3 className="text-xl font-black italic uppercase mb-2 flex justify-center items-center gap-2">
                         <Sparkles className="animate-pulse" /> Turbo Boost
                    </h3>
                    <p className="text-sm opacity-90 mb-4 font-medium">Dobre seus Flash Coins por 1 hora!</p>
                    <button 
                        className="bg-uol-yellow text-black font-bold px-6 py-2 rounded-full shadow-lg"
                    >
                        Ativar Agora
                    </button>
                </div>
            )}

            {/* SPONSOR SHOWCASE */}
            <div className="mt-6 pl-4">
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={20} className="text-uol-yellow" />
                    <h3 className="font-bold text-lg">Ofertas Patrocinadas</h3>
                    <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">by Netshoes</span>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 pr-4 no-scrollbar">
                    {sortedSponsors.map(product => (
                        <div key={product.id} className="min-w-[140px] w-[140px] flex-col bg-gray-50 rounded-xl border border-gray-100 p-2 shadow-sm relative group">
                            {userInterests.includes(product.category) && (
                                <div className="absolute top-0 right-0 bg-uol-yellow text-[8px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg z-10">
                                    TOP PICK
                                </div>
                            )}
                            <div className="w-full aspect-square bg-white rounded-lg overflow-hidden mb-2">
                                <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={product.name} />
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">{product.sponsorName}</p>
                            <h4 className="font-bold text-xs leading-tight mb-1 truncate">{product.name}</h4>
                            <p className="text-sm font-black mb-2">{product.price}</p>
                            <button className="w-full bg-black text-white text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1">
                                <ShoppingBag size={10} /> Eu quero
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAGALU EXCLUSIVE BRAND AREA */}
            <div className="mx-4 my-4 rounded-2xl overflow-hidden relative h-40 group cursor-pointer shadow-md">
                <img 
                    src="https://images.unsplash.com/photo-1598331668826-20cecc596b86?auto=format&fit=crop&w=600&q=80" 
                    alt="Magalu" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0086FF] via-[#0086FF]/80 to-transparent flex flex-col justify-center pl-6">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-white text-[#0086FF] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Parceiro Oficial</span>
                    </div>
                    <h3 className="text-white text-3xl font-black italic">Magalu</h3>
                    <p className="text-white/90 text-xs mb-3 max-w-[200px] font-medium">Tem de tudo. Tem no Magalu.</p>
                    <div className="flex items-center gap-1 text-white font-bold text-xs group-hover:gap-2 transition-all">
                        <span>Acessar Loja</span>
                        <ArrowRight size={14} />
                    </div>
                </div>
            </div>

            <div className="h-px bg-gray-100 mx-4 my-2" />

            {/* Rewards Grid */}
            <div className="p-4 pt-2">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Sparkles className="text-uol-yellow" size={20} /> Recompensas Exclusivas
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {rewards.map(reward => {
                        const levelRequired = reward.minLevel || 1;
                        const isLevelLocked = stats.level < levelRequired;
                        const canAfford = stats.coins >= reward.cost;
                        const isLocked = isLevelLocked || !canAfford;

                        return (
                            <div key={reward.id} className={`relative bg-gray-50 rounded-xl p-3 shadow-sm border ${isLevelLocked ? 'border-gray-200 bg-gray-100 opacity-90' : 'border-gray-100'} flex flex-col`}>
                                {/* Level Badge if relevant */}
                                {levelRequired > 1 && (
                                    <div className="absolute top-2 right-2 z-20 bg-black text-uol-yellow text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Star size={8} fill="#F3B121" /> NVL {levelRequired}
                                    </div>
                                )}

                                <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-gray-200">
                                    <img 
                                        src={reward.image} 
                                        alt={reward.title} 
                                        className={`w-full h-full object-cover transition-all ${isLevelLocked ? 'grayscale opacity-70' : ''}`} 
                                    />
                                    {isLevelLocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                                            <Lock className="text-white w-8 h-8" />
                                        </div>
                                    )}
                                    <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                        {reward.partner}
                                    </div>
                                </div>
                                <h3 className="font-bold text-sm leading-tight mb-1">{reward.title}</h3>
                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{reward.description}</p>
                                
                                <div className="mt-auto">
                                    <button 
                                        onClick={() => !isLocked && handleInitialRedeem(reward)}
                                        disabled={isLocked}
                                        className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all
                                            ${!isLocked 
                                                ? 'bg-uol-black text-uol-yellow hover:bg-gray-800 shadow-md active:scale-95' 
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {isLevelLocked ? (
                                            <>Bloqueado <Lock size={14} /></>
                                        ) : !canAfford ? (
                                            <>Faltam {reward.cost - stats.coins} <Lock size={14}/></>
                                        ) : (
                                            <>Resgatar <Check size={14} /></>
                                        )}
                                    </button>
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                         {isLevelLocked ? (
                                             <span className="text-xs font-bold text-red-400">Requer Nível {levelRequired}</span>
                                         ) : (
                                             <>
                                                <FlashCoinIcon size={12} />
                                                <span className={`text-xs font-bold ${canAfford ? 'text-uol-black' : 'text-gray-400'}`}>
                                                    {reward.cost}
                                                </span>
                                             </>
                                         )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};