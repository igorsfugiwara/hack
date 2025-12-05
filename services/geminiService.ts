import { GoogleGenAI, Type } from "@google/genai";
import { Post } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generatePersonalizedFeedItem = async (currentInterests: string[], isAd: boolean = false): Promise<Post | null> => {
    if (!process.env.API_KEY) return null;

    try {
        const prompt = isAd 
            ? `Generate a JSON object for a Native Ad in a social feed for Gen Z users interested in ${currentInterests.join(', ')}.
               The ad should be for a tech product or fashion item.
               Type must be 'ad'.
               Include a linkedProduct.`
            : `Generate a JSON object representing a social media post for a Gen Z audience interested in: ${currentInterests.join(', ')}. 
               The post should be related to technology, pop culture, or shopping.
               Type can be 'image' or 'news'.
               Images should use unsplash or picsum placeholders.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ['image', 'news', 'ad'] },
                        contentUrl: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        author: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING },
                                name: { type: Type.STRING },
                                avatar: { type: Type.STRING }
                            }
                        },
                        likes: { type: Type.INTEGER },
                        comments: { type: Type.INTEGER },
                        shares: { type: Type.INTEGER },
                        isAd: { type: Type.BOOLEAN },
                        linkedProduct: {
                            type: Type.OBJECT,
                            nullable: true,
                            properties: {
                                id: { type: Type.STRING },
                                name: { type: Type.STRING },
                                price: { type: Type.STRING },
                                image: { type: Type.STRING },
                                affiliateLink: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        });

        if (response.text) {
            const data = JSON.parse(response.text) as Post;
            // Ensure ID is unique if possible or handled by caller
            return data;
        }
        return null;
    } catch (error) {
        console.error("Error generating content:", error);
        return null;
    }
};

export const getShoppingAdvice = async (productName: string): Promise<string> => {
    if (!process.env.API_KEY) return "Produto incrível com condições especiais no Guia de Compras!";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a short, punchy, 1-sentence sales pitch for Gen Z about this product: ${productName}. Use emojis. Keep it under 10 words.`
        });
        return response.text || "Confira essa oferta!";
    } catch (e) {
        return "Confira essa oferta!";
    }
}