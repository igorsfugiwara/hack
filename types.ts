export type InterestCategory = 'fashion' | 'tech' | 'travel' | 'food' | 'entertainment' | 'sports' | 'general';

export interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    affiliateLink: string;
    category: InterestCategory;
    sponsorName?: string;
}

export interface Post {
    id: string;
    type: 'video' | 'image' | 'carousel' | 'ad' | 'roulette';
    contentUrl: string; // Video URL or Main Image
    thumbnailUrl?: string; // For videos in Share card
    slides?: string[]; // For carousels
    title: string;
    description: string;
    category: InterestCategory;
    author: {
        id: string;
        name: string;
        avatar: string;
        bio?: string;
        followers?: number;
    };
    likes: number;
    comments: number;
    shares: number;
    linkedProduct?: Product;
    isAd?: boolean;
}

export interface Reward {
    id: string;
    title: string;
    cost: number;
    image: string;
    partner: 'Clube UOL' | 'Guia de Compras' | 'UOL Play' | 'Splash UOL';
    description: string;
    minLevel?: number;
}

export interface UserStats {
    coins: number; // Renamed from points
    streakDays: number;
    level: number;
    boostActive?: boolean;
}

declare global {
    interface Window {
        syncHeight?: (element: HTMLElement | null, force?: boolean) => void;
        confetti?: (options?: any) => Promise<null>;
    }
}