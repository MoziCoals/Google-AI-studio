
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Source } from '../types';

let chat: Chat | null = null;

function initializeChat(): Chat {
    if (chat) {
        return chat;
    }
    // This is a placeholder for the API key.
    // In a real environment, process.env.API_KEY would be set.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      // In a real application, you might want to handle this more gracefully.
      // For this context, we'll proceed, but API calls will fail without a key.
      console.warn("API_KEY environment variable not set.");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey || " " });
    
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    return chat;
}

export async function sendMessageToGemini(message: string): Promise<{ text: string, sources: Source[] }> {
    try {
        const chatSession = initializeChat();
        const result: GenerateContentResponse = await chatSession.sendMessage({ message });

        const text = result.text;
        
        const rawSources = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const sources: Source[] = (rawSources || [])
            .filter(chunk => chunk.web)
            .map(chunk => ({
                uri: chunk.web.uri,
                title: chunk.web.title,
            }));

        return { text, sources };
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        if (error instanceof Error) {
            return { text: `Error: ${error.message}`, sources: [] };
        }
        return { text: "An unknown error occurred.", sources: [] };
    }
}
