import React, { useState } from 'react';
import { Check, Smartphone, Shirt, Plane, Trophy, Music, Utensils, Globe, ArrowRight } from 'lucide-react';
import { InterestCategory } from '../types';

interface InterestsModalProps {
    onConfirm: (selected: InterestCategory[]) => void;
}

const CATEGORIES: { id: InterestCategory; label: string; icon: React.ElementType }[] = [
    { id: 'tech', label: 'Tecnologia', icon: Smartphone },
    { id: 'fashion', label: 'Moda & Estilo', icon: Shirt },
    { id: 'sports', label: 'Esportes', icon: Trophy },
    { id: 'travel', label: 'Viagem', icon: Plane },
    { id: 'entertainment', label: 'Entretenimento', icon: Music },
    { id: 'food', label: 'Gastronomia', icon: Utensils },
    { id: 'general', label: 'Notícias', icon: Globe },
];

export const InterestsModal: React.FC<InterestsModalProps> = ({ onConfirm }) => {
    const [selected, setSelected] = useState<InterestCategory[]>([]);

    const toggleInterest = (id: InterestCategory) => {
        setSelected(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = () => {
        // Default to 'general' if nothing selected
        const finalSelection = selected.length > 0 ? selected : ['general'];
        onConfirm(finalSelection);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-6 animate-slide-up relative overflow-hidden h-[80vh] sm:h-auto flex flex-col">
                
                {/* Header */}
                <div className="text-center mb-6 pt-2">
                    <h2 className="text-2xl font-black text-gray-900 mb-2">O que você curte?</h2>
                    <p className="text-sm text-gray-500">
                        Selecione seus temas favoritos para personalizarmos seu UOL Flash.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6 overflow-y-auto sm:overflow-visible px-1 pb-4 flex-1 sm:flex-none">
                    {CATEGORIES.map((cat) => {
                        const isSelected = selected.includes(cat.id);
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => toggleInterest(cat.id)}
                                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                    isSelected 
                                        ? 'border-uol-yellow bg-yellow-50 shadow-md scale-[1.02]' 
                                        : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-2 right-2 bg-uol-yellow text-black rounded-full p-0.5">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                )}
                                <Icon 
                                    size={32} 
                                    className={`mb-2 ${isSelected ? 'text-black fill-uol-yellow' : 'text-gray-400'}`} 
                                    strokeWidth={1.5}
                                />
                                <span className={`text-sm font-bold ${isSelected ? 'text-black' : 'text-gray-500'}`}>
                                    {cat.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Footer Action */}
                <div className="mt-auto">
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-black text-uol-yellow font-bold py-4 rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <span>Confirmar Interesses</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};