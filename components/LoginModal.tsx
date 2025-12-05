import React, { useState } from 'react';
import { X, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginModalProps {
    onSuccess: () => void;
    onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSuccess, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onSuccess();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-8 animate-slide-up relative overflow-hidden">
                
                {/* UOL Header Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-uol-yellow"></div>

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center mb-6 mt-2">
                    <div className="bg-uol-yellow text-black px-3 py-1 font-black text-2xl tracking-tighter italic transform -rotate-2 mb-2">
                        UOL
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {isLogin ? 'Acesse sua conta' : 'Crie sua conta UOL'}
                    </h2>
                    <p className="text-sm text-gray-500 text-center mt-1">
                        Para resgatar seus Flash Coins e aproveitar benefícios exclusivos.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm text-black font-medium placeholder-gray-400 focus:outline-none focus:border-uol-yellow focus:ring-1 focus:ring-uol-yellow transition-all"
                                placeholder="exemplo@uol.com.br"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm text-black font-medium placeholder-gray-400 focus:outline-none focus:border-uol-yellow focus:ring-1 focus:ring-uol-yellow transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-uol-yellow text-black font-bold py-3.5 rounded-xl shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <span className="animate-pulse">Processando...</span>
                        ) : (
                            <>
                                {isLogin ? 'Entrar' : 'Criar Conta'} <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        {isLogin ? 'Ainda não tem conta?' : 'Já possui conta?'}
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-black font-bold ml-1 hover:underline"
                        >
                            {isLogin ? 'Cadastre-se grátis' : 'Fazer login'}
                        </button>
                    </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center gap-4 opacity-60">
                     <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">f</div>
                     <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs">G</div>
                     <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs"></div>
                </div>
            </div>
        </div>
    );
};