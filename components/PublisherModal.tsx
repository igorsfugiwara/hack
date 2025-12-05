import React from 'react';
import { X, UserPlus, UserCheck, Bell } from 'lucide-react';
import { Post } from '../types';

interface PublisherModalProps {
    author: Post['author'];
    onClose: () => void;
    isFollowing: boolean;
    onToggleFollow: () => void;
}

export const PublisherModal: React.FC<PublisherModalProps> = ({ author, onClose, isFollowing, onToggleFollow }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div 
                className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-slide-up"
                style={{ maxHeight: '80vh' }}
            >
                {/* Header Image */}
                <div className="h-24 bg-gradient-to-r from-uol-yellow to-orange-400 relative">
                    <button onClick={onClose} className="absolute top-2 right-2 bg-black/20 text-white p-1 rounded-full hover:bg-black/30 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-6 -mt-10 relative">
                    <div className="flex justify-between items-end mb-4 relative z-10">
                        <img 
                            src={author.avatar} 
                            alt={author.name} 
                            className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-gray-200 object-cover"
                        />
                        <button 
                            onClick={onToggleFollow}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                isFollowing 
                                ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                : 'bg-black text-uol-yellow shadow-lg active:scale-95'
                            }`}
                        >
                            {isFollowing ? (
                                <>Seguindo <UserCheck size={14}/></>
                            ) : (
                                <>Seguir <UserPlus size={14}/></>
                            )}
                        </button>
                    </div>

                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-1">
                        {author.name} 
                        <span className="bg-uol-yellow rounded-full p-0.5" title="Verificado">
                            <span className="block w-2 h-2 bg-white rounded-full"></span>
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">@{author.name.toLowerCase().replace(/\s/g, '')}</p>
                    
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        {author.bio || `Conteúdo oficial do ${author.name}. Trazendo as últimas novidades, tendências e análises exclusivas para você.`}
                    </p>

                    <div className="flex gap-6 mb-6 border-b border-gray-100 pb-4">
                        <div className="text-center">
                            <span className="block font-bold text-gray-900">{author.followers || '12.5K'}</span>
                            <span className="text-xs text-gray-500">Seguidores</span>
                        </div>
                        <div className="text-center">
                            <span className="block font-bold text-gray-900">458</span>
                            <span className="text-xs text-gray-500">Posts</span>
                        </div>
                         <div className="text-center">
                            <span className="block font-bold text-gray-900">1.2M</span>
                            <span className="text-xs text-gray-500">Likes</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-bold text-sm text-gray-900 mb-2">Destaques</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden relative">
                                    <img src={`https://images.unsplash.com/photo-${i === 1 ? '1504270997636-07ddf9488335' : i === 2 ? '1546069901-ba9599a7e63c' : '1515886657613-9f3515b0c78f'}?auto=format&fit=crop&w=300&q=80`} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute bottom-1 left-1 text-[10px] text-white font-bold drop-shadow">
                                        {(i * 5.2).toFixed(1)}K
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};