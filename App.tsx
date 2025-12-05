import React, { useState, useEffect, useRef } from 'react';
import { Post, Reward, UserStats, InterestCategory, Product } from './types';
import { FeedItem } from './components/FeedItem';
import { Store } from './components/Store';
import { DailyBonusTimer } from './components/DailyBonusTimer';
import { FlashCoinIcon } from './components/FlashCoinIcon';
import { LoginModal } from './components/LoginModal';
import { InterestsModal } from './components/InterestsModal';
import { Home, ShoppingBag, User, Bookmark, CheckCircle, Flame } from 'lucide-react';
import { generatePersonalizedFeedItem } from './services/geminiService';

// Mock Data for Sponsored Products with FIXED images
const SPONSOR_PRODUCTS: Product[] = [
    { id: 'sp1', name: 'Smartphone Galaxy S24', price: 'R$ 4.599', category: 'tech', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=300&q=80', affiliateLink: '#', sponsorName: 'Samsung' },
    { id: 'sp2', name: 'Tênis Nike Air Max', price: 'R$ 699,90', category: 'fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80', affiliateLink: '#', sponsorName: 'Netshoes' },
    { id: 'sp3', name: 'Pacote Cancun 7 Dias', price: 'R$ 3.200', category: 'travel', image: 'https://images.unsplash.com/photo-1544551763-46a8723ba3f9?auto=format&fit=crop&w=300&q=80', affiliateLink: '#', sponsorName: 'CVC' },
    { id: 'sp4', name: 'Smartwatch Series 8', price: 'R$ 2.100', category: 'tech', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=300&q=80', affiliateLink: '#', sponsorName: 'Amazon' },
    { id: 'sp5', name: 'Whey Protein Gold', price: 'R$ 189,90', category: 'sports', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=300&q=80', affiliateLink: '#', sponsorName: 'Growth' },
];

// REFACTORED INITIAL POSTS: Ensuring text matches video content (Google Storage samples)
// Avatars updated to UOL Logo for consistency
const UOL_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/UOL_logo.svg/200px-UOL_logo.svg.png';

const INITIAL_POSTS: Post[] = [
    {
        id: '1',
        type: 'video',
        category: 'travel',
        // Nature/Travel Video
        contentUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
        thumbnailUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80',
        title: 'Fugindo da Rotina',
        description: 'Descubra paisagens incríveis para suas próximas férias. A natureza espera por você!',
        author: { id: 'a1', name: 'Nossa Viagem', avatar: UOL_LOGO, followers: 54000 },
        likes: 1240,
        comments: 342,
        shares: 89,
        linkedProduct: {
            id: 'p1',
            name: 'Pacote Ecoturismo',
            price: 'R$ 2.499',
            image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=200&q=80',
            affiliateLink: '#',
            category: 'travel'
        }
    },
    {
        id: '2',
        type: 'video',
        category: 'tech',
        // Joyrides (Driving/Action) - MARKED AS AD (Position 2 / Index 1)
        contentUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
        thumbnailUrl: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=1000&q=80',
        title: 'Liberdade na Estrada',
        description: 'Registre cada momento da sua aventura com a melhor qualidade de imagem.',
        author: { id: 'a2', name: 'Tilt UOL', avatar: UOL_LOGO, followers: 120000 },
        likes: 3120,
        comments: 450,
        shares: 120,
        isAd: true, // This is the requested Ad at index 1
        linkedProduct: {
            id: 'p_cam',
            name: 'Action Cam 4K',
            price: 'R$ 1.899,90',
            image: 'https://images.unsplash.com/photo-1526660690293-bcd32dc3b123?auto=format&fit=crop&w=200&q=80',
            affiliateLink: '#',
            category: 'tech'
        }
    },
    {
        id: '3',
        type: 'carousel',
        category: 'tech',
        contentUrl: '',
        slides: [
             'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
             'https://images.unsplash.com/photo-1504270997636-07ddf9488335?auto=format&fit=crop&w=1000&q=80'
        ],
        title: 'Devs: Setup dos Sonhos',
        description: 'Inspiração para quem quer codar com estilo e conforto.',
        author: { id: 'a3', name: 'UOL', avatar: UOL_LOGO },
        likes: 3400,
        comments: 890,
        shares: 500,
         linkedProduct: {
            id: 'p2',
            name: 'Teclado Mecânico RGB',
            price: 'R$ 499,90',
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b91a603?auto=format&fit=crop&w=200&q=80',
            affiliateLink: '#',
            category: 'tech'
        }
    },
    {
        id: '4',
        type: 'video',
        category: 'sports',
        // Bullrun (Cars/Lifestyle)
        contentUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80',
        title: 'Estilo de Vida Radical',
        description: 'Viva intensamente. O equipamento certo faz toda a diferença.',
        author: { id: 'a4', name: 'UOL Esporte', avatar: UOL_LOGO },
        likes: 560,
        comments: 80,
        shares: 20,
        linkedProduct: {
            id: 'p_oculos',
            name: 'Óculos Esportivo UV',
            price: 'R$ 450,00',
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=200&q=80',
            affiliateLink: '#',
            category: 'sports'
        }
    },
    {
        id: 'roulette_promo',
        type: 'roulette',
        category: 'entertainment',
        contentUrl: '',
        title: 'Gire e Ganhe',
        description: 'Tente a sorte e ganhe Flash Coins!',
        author: { id: 'uol-flash', name: 'UOL Flash', avatar: UOL_LOGO },
        likes: 0,
        comments: 0,
        shares: 0,
    },
    {
        id: '5',
        type: 'video',
        category: 'food',
        // Meltdowns (Funny/Commercial style) - Using as "Home Cooking" context
        contentUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
        title: 'Cozinha Prática',
        description: 'Prepare refeições deliciosas sem estresse e bagunça.',
        author: { id: 'a5', name: 'VivaBem', avatar: UOL_LOGO },
        likes: 2100,
        comments: 150,
        shares: 300,
        linkedProduct: {
            id: 'p_airfryer',
            name: 'AirFryer Digital',
            price: 'R$ 349,90',
            image: 'https://images.unsplash.com/photo-1585834896791-3850239b1285?auto=format&fit=crop&w=200&q=80',
            affiliateLink: '#',
            category: 'food'
        }
    }
];

const REWARDS: Reward[] = [
    { 
        id: 'r1', 
        title: '1 mês de Clube UOL', 
        cost: 500, 
        partner: 'Clube UOL', 
        image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&w=300&q=80', 
        description: 'Acesso completo a descontos em cinemas e shows.',
        minLevel: 1
    },
    { 
        id: 'r2', 
        title: 'Cupom 20% Netshoes', 
        cost: 300, 
        partner: 'Guia de Compras', 
        image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=300&q=80', 
        description: 'Válido para categoria esportes.',
        minLevel: 1
    },
    { 
        id: 'r4', 
        title: 'UOL Play 3 meses', 
        cost: 2500, 
        partner: 'UOL Play', 
        image: 'https://images.unsplash.com/photo-1522869635100-1f4d061dd70d?auto=format&fit=crop&w=300&q=80', 
        description: 'Assista séries e campeonatos exclusivos.',
        minLevel: 2 
    },
    { 
        id: 'r5', 
        title: 'Meet & Greet Virtual', 
        cost: 5000, 
        partner: 'Splash UOL', 
        image: 'https://images.unsplash.com/photo-1501386761106-1803616ac733?auto=format&fit=crop&w=300&q=80', 
        description: 'Encontro exclusivo com colunistas do UOL.',
        minLevel: 2 
    },
];

// Simple Toast Component
const ToastNotification = ({ message, visible }: { message: string; visible: boolean }) => {
    if (!visible) return null;
    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-fade-in pointer-events-none w-max">
            <div className="bg-black/90 text-white px-6 py-3 rounded-full shadow-2xl border border-uol-yellow flex items-center gap-3">
                <CheckCircle className="text-uol-yellow" size={20} />
                <span className="font-bold text-sm">{message}</span>
            </div>
        </div>
    );
};

export default function App() {
    const [view, setView] = useState<'feed' | 'store' | 'profile'>('feed');
    const [feedTab, setFeedTab] = useState<'foryou' | 'following'>('foryou');
    const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
    const [stats, setStats] = useState<UserStats>({ coins: 120, streakDays: 3, level: 1, boostActive: false });
    const [activePostIndex, setActivePostIndex] = useState(0);
    const [animatingCoins, setAnimatingCoins] = useState(false);
    
    // Toast State
    const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });
    
    // User Preferences Logic
    const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
    const [followingAuthors, setFollowingAuthors] = useState<Set<string>>(new Set());
    const [shareCounts, setShareCounts] = useState<Record<string, number>>({});
    const [userInterests, setUserInterests] = useState<InterestCategory[]>(['general']);
    
    // Timer Logic - Bonus can only be claimed once per session
    const [bonusClaimed, setBonusClaimed] = useState(false);

    // Login & Roulette Logic
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showInterestsModal, setShowInterestsModal] = useState(false);
    const [pendingRoulettePoints, setPendingRoulettePoints] = useState(0);
    const [pendingRoulettePostId, setPendingRoulettePostId] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    const triggerConfetti = () => {
        if (window.confetti) {
            window.confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#F3B121', '#1C1C1C', '#FFFFFF']
            });
        }
    };
    
    const handleClaimBonus = () => {
        addPoints(500); 
        setBonusClaimed(true);
        triggerConfetti();
        showToast("BÔNUS DIÁRIO! +500 Flash Coins");
    };

    // Iframe Sync
    useEffect(() => {
        const appContainer = document.getElementById('app-container');
        if (appContainer && window.syncHeight) {
            window.syncHeight(appContainer, true);
        }
    }, [view, posts.length]);

    const addPoints = (amount: number) => {
        // Apply Boost if active
        const finalAmount = stats.boostActive ? amount * 2 : amount;

        setStats(prev => {
            const newCoins = prev.coins + finalAmount;
            const newLevel = Math.floor(newCoins / 1000) + 1;
            return { ...prev, coins: newCoins, level: newLevel };
        });
        
        // Trigger subtle animation
        setAnimatingCoins(true);
        setTimeout(() => setAnimatingCoins(false), 500);
    };

    const handleLoginSuccess = () => {
        setShowLoginModal(false);
        // Instead of awarding points immediately, show interests modal
        setShowInterestsModal(true);
    };

    const handleInterestsConfirmed = (selectedInterests: InterestCategory[]) => {
        setUserInterests(selectedInterests);
        setShowInterestsModal(false);
        
        // Show confirmation toast
        showToast("Preferências salvas!");

        // Award Pending Roulette Points if applicable
        if (pendingRoulettePoints > 0) {
            addPoints(pendingRoulettePoints);
            triggerConfetti();
            setPendingRoulettePoints(0);
            
            // Remove the roulette post after 2 seconds
            if (pendingRoulettePostId) {
                setTimeout(() => {
                    setPosts(prev => prev.filter(p => p.id !== pendingRoulettePostId));
                    setPendingRoulettePostId(null);
                }, 2000);
            }
        }
        
        // Optionally refresh feed with new interests immediately (mocked here)
        console.log("Personalizing feed for:", selectedInterests);
    };

    const handleInteraction = (type: 'like' | 'comment' | 'share' | 'view' | 'save' | 'follow' | 'spin', category?: InterestCategory, postId?: string, extraData?: number) => {
        let points = 0;
        
        // Update user interests based on interaction (implicit)
        if (category && type !== 'view' && type !== 'spin') {
             setUserInterests(prev => {
                 if (prev.includes(category)) return prev;
                 return [category, ...prev].slice(0, 5); // Keep top 5 recent interests
             });
        }

        switch (type) {
            case 'like': points = 10; break;
            case 'comment': points = 50; break; 
            case 'share': 
                if (postId) {
                    const currentShares = shareCounts[postId] || 0;
                    setShareCounts(prev => ({ ...prev, [postId]: currentShares + 1 }));
                    
                    // Only award points from the 2nd share onwards
                    if (currentShares >= 1) {
                        points = 100;
                    }
                }
                break; 
            case 'view': 
                // Check if it's the specific Ad post or any Ad
                if (postId) {
                    const p = posts.find(post => post.id === postId);
                    if (p?.isAd) {
                        points = 40; // Specific Ad Points for completing ad
                    } else {
                        points = 5;
                    }
                } else {
                    points = 5;
                }
                break; 
            case 'spin': 
                // Do not award points immediately. Require login.
                if (extraData && postId) {
                    setPendingRoulettePoints(extraData);
                    setPendingRoulettePostId(postId);
                    setShowLoginModal(true);
                }
                points = 0;
                break;
            case 'save': 
                if (postId) {
                    setSavedPostIds(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(postId)) newSet.delete(postId);
                        else newSet.add(postId);
                        return newSet;
                    });
                }
                points = 0; 
                break;
            case 'follow':
                if (postId) {
                     const post = posts.find(p => p.id === postId);
                     if (post) {
                         setFollowingAuthors(prev => {
                             const newSet = new Set(prev);
                             if (newSet.has(post.author.id)) newSet.delete(post.author.id);
                             else newSet.add(post.author.id);
                             return newSet;
                         });
                     }
                }
                points = 5; 
                break;
        }
        
        if (points > 0) addPoints(points);
    };

    // Infinite scroll / Load more AI content
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const index = Math.round(container.scrollTop / container.clientHeight);
        
        if (index !== activePostIndex) {
            setActivePostIndex(index);
            // If near end, generate new content
            if (index >= visiblePosts.length - 2 && feedTab === 'foryou') {
                fetchNewContent();
            }
        }
    };

    const fetchNewContent = async () => {
        const primaryInterest = userInterests[0] || 'general';
        const isAd = Math.random() > 0.7;
        
        try {
            if (!process.env.API_KEY) throw new Error("No API Key");

            const newPost = await generatePersonalizedFeedItem([primaryInterest], isAd);
            
            if (newPost) {
                const finalPost = { ...newPost, id: Date.now().toString(), category: primaryInterest as InterestCategory };
                setPosts(prev => [...prev, finalPost]);
                return;
            }
        } catch (e) {
            console.log("AI generation failed or limited, using fallback");
        }

        // Fallback Content if AI fails
        const fallbackPost: Post = {
            id: `fallback-${Date.now()}`,
            type: 'image',
            category: 'general',
            contentUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1000&q=80',
            title: 'Explore o Mundo',
            description: 'Descubra lugares incríveis com o UOL Flash.',
            author: { id: 'uol-travel', name: 'Nossa Viagem', avatar: UOL_LOGO },
            likes: 42,
            comments: 5,
            shares: 1
        };
        setPosts(prev => [...prev, fallbackPost]);
    };

    const handleRedeem = (reward: Reward) => {
        if (stats.coins >= reward.cost && stats.level >= (reward.minLevel || 1)) {
            setStats(prev => ({ ...prev, coins: prev.coins - reward.cost }));
        }
    };

    const handleActivateBoost = () => {
        setStats(prev => ({ ...prev, boostActive: true }));
        triggerConfetti();
        showToast("BOOST ATIVADO! Moedas em dobro por 1h.");
    };

    // Filter posts based on active tab
    const visiblePosts = feedTab === 'foryou' 
        ? posts 
        : posts.filter(p => followingAuthors.has(p.author.id));

    return (
        <div id="app-container" className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-black relative shadow-2xl overflow-hidden font-sans">
            <ToastNotification message={toast.message} visible={toast.visible} />
            
            {/* Login Modal Overlay */}
            {showLoginModal && (
                <LoginModal 
                    onSuccess={handleLoginSuccess} 
                    onClose={() => setShowLoginModal(false)} 
                />
            )}

            {/* Interests Modal Overlay */}
            {showInterestsModal && (
                <InterestsModal 
                    onConfirm={handleInterestsConfirmed}
                />
            )}

            {/* HUD & Overlays - Only show if not claimed */}
            {!bonusClaimed && <DailyBonusTimer onClaim={handleClaimBonus} />}

            {/* Main Viewport */}
            <div className="flex-1 overflow-hidden relative">
                {view === 'feed' && (
                    <>
                        {visiblePosts.length === 0 && feedTab === 'following' ? (
                            <div className="h-full flex flex-col items-center justify-center text-white p-6 text-center">
                                <User size={48} className="mb-4 text-gray-600" />
                                <h3 className="text-xl font-bold mb-2">Você ainda não segue ninguém</h3>
                                <p className="text-gray-400 mb-6">Siga criadores na aba "Para você" para ver o conteúdo deles aqui.</p>
                                <button 
                                    onClick={() => setFeedTab('foryou')}
                                    className="bg-uol-yellow text-black px-6 py-2 rounded-full font-bold"
                                >
                                    Ir para Explorar
                                </button>
                            </div>
                        ) : (
                            <div 
                                className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth"
                                onScroll={handleScroll}
                            >
                                {visiblePosts.map((post, index) => (
                                    <FeedItem 
                                        key={post.id} 
                                        post={post} 
                                        isActive={index === activePostIndex}
                                        onInteraction={(type, cat, amount) => handleInteraction(type, cat, post.id, amount)}
                                        isSaved={savedPostIds.has(post.id)}
                                        isFollowing={followingAuthors.has(post.author.id)}
                                    />
                                ))}
                            </div>
                        )}
                        
                        {/* Feed Tab Switcher (Floating) */}
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-4 z-40">
                             <button 
                                onClick={() => setFeedTab('following')}
                                className={`text-sm font-bold drop-shadow-md transition-colors ${feedTab === 'following' ? 'text-white border-b-2 border-uol-yellow pb-1' : 'text-white/60 hover:text-white/80'}`}
                             >
                                 Seguindo
                             </button>
                             <div className="w-px h-4 bg-white/30 my-auto"></div>
                             <button 
                                onClick={() => setFeedTab('foryou')}
                                className={`text-sm font-bold drop-shadow-md transition-colors ${feedTab === 'foryou' ? 'text-white border-b-2 border-uol-yellow pb-1' : 'text-white/60 hover:text-white/80'}`}
                             >
                                 Para você
                             </button>
                        </div>
                    </>
                )}

                {view === 'store' && (
                    <div className="h-full overflow-y-auto no-scrollbar">
                        <Store 
                            stats={stats} 
                            rewards={REWARDS} 
                            sponsorProducts={SPONSOR_PRODUCTS}
                            onRedeem={handleRedeem}
                            onActivateBoost={handleActivateBoost}
                            userInterests={userInterests}
                        />
                    </div>
                )}

                {view === 'profile' && (
                    <div className="h-full bg-white overflow-y-auto p-6">
                        <div className="flex flex-col items-center mb-6">
                             <div className="w-24 h-24 rounded-full bg-gray-200 mb-3 border-4 border-uol-yellow overflow-hidden">
                                 <img src={UOL_LOGO} className="w-full h-full object-cover" alt="Profile" />
                             </div>
                             <h2 className="text-xl font-bold text-black">Visitante</h2>
                             <p className="text-gray-500 text-sm">Nível {stats.level} • {stats.coins} Flash Coins</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-xl text-center">
                                <span className="block text-2xl font-bold text-black">{stats.streakDays}</span>
                                <span className="text-xs text-gray-500 uppercase font-bold">Dias seguidos</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl text-center">
                                <span className="block text-2xl font-bold text-black">{savedPostIds.size}</span>
                                <span className="text-xs text-gray-500 uppercase font-bold">Salvos</span>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-black">
                            <Bookmark className="text-uol-yellow" size={20} /> Itens Salvos
                        </h3>
                        
                        {savedPostIds.size === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">Você ainda não salvou nada.</p>
                        ) : (
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from(savedPostIds).map(id => {
                                    const savedPost = posts.find(p => p.id === id);
                                    if (!savedPost) return null;
                                    return (
                                        <div key={id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                                            <img 
                                                src={savedPost.thumbnailUrl || (savedPost.type === 'carousel' ? savedPost.slides?.[0] : savedPost.contentUrl)} 
                                                className="w-full h-full object-cover" 
                                                alt="" 
                                            />
                                            {savedPost.type === 'video' && (
                                                <div className="absolute top-1 right-1 bg-black/50 p-1 rounded-full">
                                                    <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="h-16 bg-black border-t border-gray-900 flex justify-around items-center z-50 shrink-0">
                <button 
                    onClick={() => setView('feed')}
                    className={`flex flex-col items-center gap-1 transition-colors ${view === 'feed' ? 'text-uol-yellow' : 'text-gray-500 hover:text-white'}`}
                >
                    <Home size={24} />
                    <span className="text-[10px] font-bold">Feed</span>
                </button>
                <button 
                    onClick={() => setView('store')}
                    className={`flex flex-col items-center gap-1 transition-colors ${view === 'store' ? 'text-uol-yellow' : 'text-gray-500 hover:text-white'}`}
                >
                    <ShoppingBag size={24} />
                    <span className="text-[10px] font-bold">Clube</span>
                </button>
                <button 
                    onClick={() => setView('profile')}
                    className={`flex flex-col items-center gap-1 transition-colors ${view === 'profile' ? 'text-uol-yellow' : 'text-gray-500 hover:text-white'}`}
                >
                    <User size={24} />
                    <span className="text-[10px] font-bold">Perfil</span>
                </button>
            </div>

            {/* Header / Top Bar */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none z-50">
                <div className="pointer-events-auto">
                    <div className="bg-uol-yellow text-black px-2 py-0.5 font-black text-xl tracking-tighter italic transform -rotate-2 shadow-lg inline-block">
                        UOL <span className="text-white bg-black px-1 not-italic">FLASH</span>
                    </div>
                </div>

                <div className={`pointer-events-auto flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 transition-all duration-300 ${animatingCoins ? 'scale-110 border-uol-yellow bg-uol-yellow/20' : ''}`}>
                    {stats.boostActive && <Flame size={14} className="text-orange-500 animate-pulse fill-orange-500" />}
                    <FlashCoinIcon size={20} />
                    <span className={`font-black text-white text-sm ${animatingCoins ? 'text-uol-yellow' : ''}`}>{stats.coins}</span>
                </div>
            </div>
        </div>
    );
}