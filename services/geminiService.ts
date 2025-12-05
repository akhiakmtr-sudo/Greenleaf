import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { PRODUCTS } from "../constants";

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const SYSTEM_INSTRUCTION = `
You are "Leafy", the friendly and knowledgeable AI herbalist assistant for the e-commerce store "Green Leaf Herbals".
Your goal is to help customers find products from our catalog that match their health needs.
Keep answers concise (under 50 words unless detailed explanation is needed) and helpful.
Use emojis sparingly but effectively 🌿.

Here is our product catalog:
${JSON.stringify(PRODUCTS.map(p => ({ name: p.name, category: p.category, price: p.price, description: p.description, id: p.id })))}

If a user asks about a specific ailment, recommend a product from the list above if applicable.
If you recommend a product, bold its name.
Do not make up products not in the list.
`;

export const createChatSession = (): Chat => {
  const client = getAI();
  return client.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
};

export const sendMessageStream = async (chat: Chat, message: string) => {
  return await chat.sendMessageStream({ message });
};
