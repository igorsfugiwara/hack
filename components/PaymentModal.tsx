import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, CheckCircle, Loader2, Copy, QrCode, Check } from 'lucide-react';
import { Reward } from '../types';

interface PaymentModalProps {
    reward: Reward;
    onConfirm: () => void;
    onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ reward, onConfirm, onClose }) => {
    const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
    const [selectedMethod, setSelectedMethod] = useState<'pix' | 'card'>('pix');
    const [couponCode] = useState(`FLASH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (step === 'success' && window.QRious) {
            new window.QRious({
                element: document.getElementById('coupon-qr'),
                value: couponCode,
                size: 120,
            });
        }
    }, [step, couponCode]);

    const handlePay = () => {
        setStep('processing');
        // Simulate API call
        setTimeout(() => {
            setStep('success');
            onConfirm(); // Deduct points immediately
        }, 2000);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(couponCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-6 animate-slide-up relative">
                
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                    <X size={24} />
                </button>

                {step === 'method' && (
                    <>
                        <div className="flex items-center gap-2 mb-1 text-uol-yellow">
                            <Lock size={16} />
                            <span className="text-xs font-bold uppercase tracking-wide text-black">Checkout Seguro</span>
                        </div>
                        <h2 className="text-xl font-black text-gray-900 mb-2">Finalizar Resgate</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Você está trocando seus Flash Coins por: <br/>
                            <strong className="text-black">{reward.title}</strong>
                        </p>

                        <div className="space-y-3 mb-6">
                            <div 
                                onClick={() => setSelectedMethod('pix')}
                                className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${selectedMethod === 'pix' ? 'border-uol-yellow bg-yellow-50' : 'border-gray-200'}`}
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                    {selectedMethod === 'pix' && <div className="w-3 h-3 bg-uol-yellow rounded-full" />}
                                </div>
                                <span className="font-bold text-sm">Pix Instantâneo</span>
                                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Grátis</span>
                            </div>

                            <div 
                                onClick={() => setSelectedMethod('card')}
                                className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${selectedMethod === 'card' ? 'border-uol-yellow bg-yellow-50' : 'border-gray-200'}`}
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                    {selectedMethod === 'card' && <div className="w-3 h-3 bg-uol-yellow rounded-full" />}
                                </div>
                                <CreditCard size={20} className="text-gray-600" />
                                <span className="font-bold text-sm">Cartão de Crédito</span>
                            </div>
                        </div>

                        <button 
                            onClick={handlePay}
                            className="w-full bg-black text-uol-yellow py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                        >
                            Confirmar Resgate
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-4">
                            Seus dados estão protegidos pela UOL Segurança.
                        </p>
                    </>
                )}

                {step === 'processing' && (
                    <div className="py-10 flex flex-col items-center justify-center text-center">
                        <Loader2 className="w-12 h-12 text-uol-yellow animate-spin mb-4" />
                        <h3 className="font-bold text-lg">Processando...</h3>
                        <p className="text-sm text-gray-500">Estamos validando seus Flash Coins.</p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="py-2 flex flex-col items-center justify-center text-center animate-fade-in w-full">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600">
                            <CheckCircle size={32} strokeWidth={3} />
                        </div>
                        <h3 className="font-black text-2xl mb-1">Resgate Concluído!</h3>
                        <p className="text-xs text-gray-500 mb-4 px-4">
                            Enviado por e-mail. Disponível na plataforma Club UOL.
                        </p>
                        
                        <div className="bg-gray-50 w-full rounded-xl p-4 border border-dashed border-gray-300 mb-4 flex flex-col items-center">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Seu Cupom</p>
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm w-full mb-3">
                                <span className="flex-1 font-mono font-bold text-lg text-center tracking-widest text-uol-black">{couponCode}</span>
                                <button 
                                    onClick={copyToClipboard} 
                                    className={`transition-colors flex items-center gap-1 ${copied ? 'text-green-600' : 'text-uol-yellow hover:text-black'}`}
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                </button>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-gray-100">
                                <canvas id="coupon-qr" className="rounded"></canvas>
                            </div>
                        </div>

                        <button 
                            onClick={onClose}
                            className="w-full bg-gray-100 text-black py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};