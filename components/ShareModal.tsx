import React, { useRef, useEffect, useState } from 'react';
import { Post } from '../types';
import { X, Share2, Loader2 } from 'lucide-react';

interface ShareModalProps {
    post: Post;
    onClose: () => void;
}

declare global {
    interface Window {
        QRious: any;
        html2canvas: any;
    }
}

export const ShareModal: React.FC<ShareModalProps> = ({ post, onClose }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [generating, setGenerating] = useState(false);
    
    // Determine the safe image to display (avoiding video URLs in img tags)
    const displayImage = post.type === 'video' 
        ? (post.thumbnailUrl || post.linkedProduct?.image || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1080&q=80') 
        : (post.type === 'carousel' && post.slides?.length ? post.slides[0] : post.contentUrl);

    // Generate QR Code on mount
    useEffect(() => {
        if (window.QRious) {
            new window.QRious({
                element: document.getElementById('qr-canvas'),
                value: `https://uol.com.br/flash/post/${post.id}`,
                size: 100,
                backgroundAlpha: 0,
                foreground: 'white'
            });
        }
    }, [post.id]);

    const handleNativeShare = async () => {
        if (!cardRef.current || !window.html2canvas) return;
        setGenerating(true);
        try {
            const canvas = await window.html2canvas(cardRef.current, { 
                useCORS: true, 
                scale: 2,
                allowTaint: true 
            });
            canvas.toBlob(async (blob: Blob | null) => {
                if (blob && navigator.share) {
                    const file = new File([blob], 'share.png', { type: 'image/png' });
                    try {
                        await navigator.share({
                            title: 'Confira no UOL Flash',
                            text: post.title,
                            files: [file]
                        });
                        onClose(); // Close after sharing
                    } catch (e) {
                        console.log("Share API error or cancellation", e);
                    }
                } else {
                    console.log("Navigator Share not supported");
                }
            });
        } catch (e) {
            console.error(e);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in p-4">
            {/* Header controls */}
            <div className="absolute top-4 right-4 z-50">
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20">
                    <X size={24} />
                </button>
            </div>

            <div className="text-white font-bold mb-4 text-center">
                <p>Compartilhar Stories</p>
                <p className="text-xs font-normal text-gray-400">Pré-visualização</p>
            </div>

            {/* The Canvas Card */}
            <div className="relative w-[280px] h-[497px] sm:w-[320px] sm:h-[568px] shadow-2xl rounded-2xl overflow-hidden border border-gray-800 shrink-0">
                <div 
                    ref={cardRef}
                    className="w-full h-full relative bg-uol-black flex flex-col"
                    style={{ aspectRatio: '9/16' }}
                >
                    {/* Background Layer */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={displayImage} 
                            alt="bg" 
                            className="w-full h-full object-cover blur-lg scale-110 opacity-60"
                            crossOrigin="anonymous" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 flex flex-col h-full p-6 justify-between">
                        {/* Top Logo */}
                        <div className="flex justify-center pt-4">
                            <div className="bg-uol-yellow text-black px-3 py-1 font-black text-xl tracking-tighter italic transform -rotate-2">
                                UOL <span className="text-white bg-black px-1 not-italic">FLASH</span>
                            </div>
                        </div>

                        {/* Middle Album Art Style */}
                        <div className="flex-1 flex items-center justify-center py-6">
                            <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-2xl border border-white/20 group">
                                <img 
                                    src={displayImage} 
                                    alt="cover" 
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                />
                                {/* Play icon overlay aesthetic for videos */}
                                {post.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center backdrop-blur-sm">
                                            <div className="w-0 h-0 border-l-[15px] border-l-white border-y-[10px] border-y-transparent ml-1" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Info */}
                        <div className="flex flex-col gap-4 pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-white leading-tight drop-shadow-lg line-clamp-3 mb-2">
                                    {post.title}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <img 
                                        src={post.author.avatar} 
                                        alt={post.author.name} 
                                        className="w-6 h-6 rounded-full border border-white"
                                        crossOrigin="anonymous"
                                    />
                                    <span className="text-sm font-bold text-gray-200">@{post.author.name}</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-500 to-transparent" />

                            {/* CTA / QR */}
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-uol-yellow font-bold text-sm uppercase tracking-wider">Leia agora</span>
                                    <span className="text-[10px] text-gray-400">uol.com.br/flash</span>
                                </div>
                                <div className="bg-white p-1 rounded-md">
                                    <canvas id="qr-canvas" className="w-12 h-12 block"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8 animate-slide-up">
                <button 
                    onClick={handleNativeShare}
                    disabled={generating}
                    className="flex items-center gap-2 px-12 py-3 bg-uol-yellow text-black font-bold rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                    {generating ? <Loader2 className="animate-spin" /> : <Share2 size={20} />}
                    <span className="inline">Compartilhar no Instagram</span>
                </button>
            </div>
        </div>
    );
};