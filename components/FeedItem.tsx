import React, { useState, useEffect, useRef } from 'react';
import { Post, InterestCategory } from '../types';
import { Heart, MessageCircle, Share2, ShoppingBag, Info, Bookmark, UserPlus, Send, Volume2, VolumeX, Check } from 'lucide-react';
import { getShoppingAdvice } from '../services/geminiService';
import { ShareModal } from './ShareModal';
import { PublisherModal } from './PublisherModal';
import { RouletteWheel } from './RouletteWheel';

interface FeedItemProps {
    post: Post;
    isActive: boolean;
    onInteraction: (type: 'like' | 'comment' | 'share' | 'view' | 'save' | 'follow' | 'spin', category: InterestCategory, amount?: number) => void;
    isSaved: boolean;
    isFollowing: boolean;
}

export const FeedItem: React.FC<FeedItemProps> = ({ post, isActive, onInteraction, isSaved, isFollowing }) => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(isSaved);
    const [following, setFollowing] = useState(isFollowing);
    const [aiPitch, setAiPitch] = useState<string>('');
    const [showProduct, setShowProduct] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showPublisherModal, setShowPublisherModal] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [muted, setMuted] = useState(true);
    const [commentSent, setCommentSent] = useState(false);

    // Carousel state
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hasViewed, setHasViewed] = useState(false);
    
    // Ad Video Progress
    const [adProgress, setAdProgress] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);

    // Sync external props state
    useEffect(() => { setSaved(isSaved); }, [isSaved]);
    useEffect(() => { setFollowing(isFollowing); }, [isFollowing]);

    // Reset slide view state when post changes or inactive
    useEffect(() => {
        if (!isActive) {
            setCurrentSlide(0);
            setHasViewed(false);
            setAdProgress(0);
        }
    }, [isActive, post.id]);

    // AI Dynamic Pitch
    useEffect(() => {
        if (isActive && post.linkedProduct && !aiPitch) {
            getShoppingAdvice(post.linkedProduct.name).then(setAiPitch);
        }
    }, [isActive, post.linkedProduct, aiPitch]);

    // Video Playback Logic
    useEffect(() => {
        if (post.type === 'video' && videoRef.current) {
            if (isActive) {
                videoRef.current.currentTime = 0;
                videoRef.current.muted = muted;
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => console.log("Autoplay prevented:", e));
                }
            } else {
                videoRef.current.pause();
            }
        }
    }, [isActive, post.type, muted]);

    const handleTimeUpdate = () => {
        if (post.isAd && videoRef.current) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setAdProgress(progress);
        }
    };

    const handleVideoEnd = () => {
        if (!hasViewed) {
            onInteraction('view', post.category); 
            setHasViewed(true);
        }
    };

    // Carousel Logic
    const nextSlide = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (post.slides && currentSlide < post.slides.length - 1) {
            setCurrentSlide(p => p + 1);
        } else if (!hasViewed) {
            // Reached end of carousel - count as view ONLY ONCE
            onInteraction('view', post.category);
            setHasViewed(true);
        }
    };

    const prevSlide = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (currentSlide > 0) {
            setCurrentSlide(p => p - 1);
        }
    };

    // Keyboard Navigation for Carousel
    useEffect(() => {
        if (!isActive || post.type !== 'carousel') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, post.type, currentSlide, post.slides, hasViewed]); 

    const handleLike = () => {
        if (!liked) {
            setLiked(true);
            onInteraction('like', post.category);
        }
    };

    const handleToggleSave = () => {
        setSaved(!saved);
        onInteraction('save', post.category);
    };

    const handleToggleFollow = () => {
        setFollowing(!following);
        onInteraction('follow', post.category);
    };

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onInteraction('comment', post.category);
            setCommentText('');
            setCommentSent(true);
            setTimeout(() => {
                setCommentSent(false);
                setShowComments(false);
            }, 1500);
        }
    };

    const handleRouletteWin = (amount: number) => {
        onInteraction('spin', post.category, amount);
    };

    if (post.type === 'roulette') {
        return (
            <div className="w-full h-full snap-start flex-shrink-0 bg-black flex items-center justify-center relative">
                 <RouletteWheel onSpinComplete={handleRouletteWin} />
            </div>
        );
    }

    return (
        <>
            <div className="relative w-full h-full snap-start flex-shrink-0 bg-black overflow-hidden select-none">
                
                {/* ---------------- MEDIA LAYER ---------------- */}
                <div className="absolute inset-0 bg-gray-900" onClick={post.type === 'carousel' ? (e) => {
                    const width = e.currentTarget.offsetWidth;
                    const x = e.clientX;
                    if (x > width / 2) nextSlide(e);
                    else prevSlide(e);
                } : undefined}>
                    
                    {post.type === 'video' ? (
                         <>
                            <video
                                ref={videoRef}
                                src={post.contentUrl}
                                className="w-full h-full object-cover"
                                loop={false} 
                                playsInline
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={handleVideoEnd}
                                poster={post.thumbnailUrl}
                            />
                            <button 
                                onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                                className="absolute top-24 left-4 z-20 bg-black/50 p-2 rounded-full text-white"
                            >
                                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </button>
                         </>
                    ) : post.type === 'carousel' && post.slides ? (
                        <>
                            <img 
                                src={post.slides[currentSlide]} 
                                alt={post.title} 
                                className="w-full h-full object-cover"
                            />
                            {/* Carousel Indicators */}
                            <div className="absolute top-16 left-2 right-2 flex gap-1 z-20">
                                {post.slides.map((_, idx) => (
                                    <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full bg-white transition-all duration-300 ${
                                                idx < currentSlide ? 'w-full' : idx === currentSlide ? 'w-full' : 'w-0'
                                            }`} 
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Visual navigation hint overlay (optional, subtle tap zones) */}
                            <div className="absolute inset-y-0 left-0 w-1/4 z-10 opacity-0 hover:opacity-0" title="Previous"></div>
                            <div className="absolute inset-y-0 right-0 w-1/4 z-10 opacity-0 hover:opacity-0" title="Next"></div>
                        </>
                    ) : (
                        <img 
                            src={post.contentUrl} 
                            alt={post.title} 
                            className="w-full h-full object-cover"
                        />
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />
                </div>

                {/* ---------------- AD PROGRESS BAR ---------------- */}
                {post.isAd && (
                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-800 z-30">
                        <div 
                            className="h-full bg-uol-yellow transition-all duration-200 ease-linear"
                            style={{ width: `${adProgress}%` }}
                        />
                    </div>
                )}

                {/* ---------------- AD LABEL ---------------- */}
                {post.isAd && (
                    <div className="absolute top-20 right-4 z-20 flex flex-col items-end gap-1">
                        <div className="bg-white/90 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            Publicidade • {post.category}
                        </div>
                        {hasViewed && (
                            <div className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase animate-fade-in flex items-center gap-1">
                                <Check size={10} /> +40 Flash Coins
                            </div>
                        )}
                    </div>
                )}

                {/* ---------------- RIGHT ACTIONS ---------------- */}
                <div className="absolute right-4 bottom-32 flex flex-col items-center gap-5 z-20 pointer-events-auto">
                    
                    {/* Author Avatar with Follow logic */}
                    <div className="flex flex-col items-center relative mb-2">
                        <div onClick={() => setShowPublisherModal(true)} className="relative cursor-pointer transition-transform active:scale-95">
                             <img 
                                src={post.author.avatar} 
                                alt={post.author.name} 
                                className="w-12 h-12 rounded-full border-2 border-white bg-white object-contain p-0.5"
                            />
                            {!following && (
                                <div 
                                    onClick={(e) => { e.stopPropagation(); handleToggleFollow(); }}
                                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full p-1 text-white shadow-sm hover:scale-110 transition-transform"
                                >
                                    <UserPlus size={12} strokeWidth={3} />
                                </div>
                            )}
                        </div>
                    </div>

                    <button onClick={handleLike} className="flex flex-col items-center group">
                        <div className={`p-2.5 rounded-full bg-black/20 backdrop-blur-md transition-transform ${liked ? 'scale-110' : ''} group-active:scale-90`}>
                            <Heart className={`w-7 h-7 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                        </div>
                        <span className="text-xs font-bold mt-1 drop-shadow-md">{post.likes + (liked ? 1 : 0)}</span>
                    </button>

                    <button onClick={() => setShowComments(true)} className="flex flex-col items-center group">
                        <div className="p-2.5 rounded-full bg-black/20 backdrop-blur-md group-active:scale-90 transition-transform">
                            <MessageCircle className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-xs font-bold mt-1 drop-shadow-md">{post.comments}</span>
                    </button>

                    <button onClick={handleToggleSave} className="flex flex-col items-center group">
                         <div className="p-2.5 rounded-full bg-black/20 backdrop-blur-md group-active:scale-90 transition-transform">
                            <Bookmark className={`w-7 h-7 ${saved ? 'fill-uol-yellow text-uol-yellow' : 'text-white'}`} />
                        </div>
                        <span className="text-xs font-bold mt-1 drop-shadow-md">{saved ? 'Salvo' : 'Salvar'}</span>
                    </button>

                    <button onClick={() => { onInteraction('share', post.category); setShowShareModal(true); }} className="flex flex-col items-center group">
                        <div className="p-2.5 rounded-full bg-black/20 backdrop-blur-md group-active:scale-90 transition-transform">
                            <Share2 className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-xs font-bold mt-1 drop-shadow-md">Share</span>
                    </button>
                </div>

                {/* ---------------- BOTTOM INFO ---------------- */}
                <div className="absolute bottom-4 left-4 right-16 z-10 text-left pointer-events-none">
                    <div className="pointer-events-auto">
                        <h3 onClick={() => setShowPublisherModal(true)} className="font-bold text-lg text-white mb-1 drop-shadow-md cursor-pointer hover:underline">
                            @{post.author.name}
                        </h3>
                    </div>
                    <p className="text-sm text-gray-100 line-clamp-2 mb-2 drop-shadow-md leading-relaxed">
                        {post.description}
                    </p>
                    
                    {/* Product Integration */}
                    {post.linkedProduct && (
                        <div className="mt-3 pointer-events-auto">
                            {showProduct ? (
                                <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-uol-yellow/50 animate-in slide-in-from-bottom-5 w-[85%]">
                                    <div className="flex gap-3">
                                        <img src={post.linkedProduct.image} className="w-16 h-16 rounded-md object-cover bg-white shrink-0" alt="prod" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-uol-yellow font-bold uppercase tracking-wide">Guia de Compras</p>
                                            <p className="font-bold text-sm truncate text-white">{post.linkedProduct.name}</p>
                                            <p className="text-xs italic text-gray-300 mt-1 line-clamp-1">"{aiPitch}"</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="font-bold text-white text-sm">{post.linkedProduct.price}</span>
                                                <button className="bg-uol-yellow text-black text-[10px] font-bold px-3 py-1.5 rounded-full uppercase">
                                                    Comprar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setShowProduct(true)}
                                    className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg border-l-4 border-uol-yellow hover:bg-black/80 transition-colors"
                                >
                                    <ShoppingBag className="w-4 h-4 text-uol-yellow" />
                                    <span className="text-xs font-bold text-white">Ver {post.linkedProduct.name.split(' ')[0]}</span>
                                </button>
                            )}
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-3 opacity-60">
                         <Info className="w-3 h-3" />
                         <span className="text-[10px] uppercase tracking-widest text-shadow">
                             {post.isAd ? `Patrocinado • ${post.category}` : `UOL Flash • ${post.category}`}
                         </span>
                    </div>
                </div>
            </div>

            {/* ---------------- MODALS ---------------- */}
            
            {showShareModal && (
                <ShareModal post={post} onClose={() => setShowShareModal(false)} />
            )}

            {showPublisherModal && (
                <PublisherModal 
                    author={post.author} 
                    onClose={() => setShowPublisherModal(false)} 
                    isFollowing={following}
                    onToggleFollow={handleToggleFollow}
                />
            )}

            {/* Comments Modal - Increased Z-index to cover footer */}
            {showComments && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                     {/* Close area */}
                    <div className="absolute inset-0" onClick={() => setShowComments(false)}></div>
                    
                    <div className="bg-white w-full max-w-md rounded-t-2xl p-4 animate-slide-up z-10 relative">
                        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                        <h3 className="font-bold text-black mb-3 text-sm">Comentários ({post.comments})</h3>
                        
                        <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
                             <div className="flex gap-2">
                                 <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
                                 <div className="bg-gray-100 p-2 rounded-lg text-xs w-full">
                                     <span className="font-bold block text-gray-700">maria_silva</span>
                                     Adorei a dica! Vou testar hoje mesmo.
                                 </div>
                             </div>
                        </div>

                        <form onSubmit={handleSubmitComment} className="flex gap-2 items-center border-t pt-3 pb-2">
                            <input 
                                type="text" 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Adicione um comentário..."
                                className="flex-1 bg-gray-100 text-black text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-uol-yellow"
                                autoFocus
                            />
                            <button 
                                type="submit"
                                disabled={!commentText.trim() || commentSent}
                                className={`p-2 rounded-full transition-colors ${commentSent ? 'bg-green-500 text-white' : 'bg-uol-yellow text-black disabled:opacity-50'}`}
                            >
                                {commentSent ? <Check size={18} /> : <Send size={18} />}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};