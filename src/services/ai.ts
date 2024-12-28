import { GoogleGenerativeAI } from '@google/generative-ai';
import { Template } from '@/types/compliance';

const DEFAULT_API_KEY = 'AIzaSyAx5KfdkbX6rDK5AHox4hjq2cBzqPifrZk';

export const getStoredApiKey = () => {
  return localStorage.getItem('gemini_api_key') || DEFAULT_API_KEY;
};

export const setStoredApiKey = (apiKey: string) => {
  if (apiKey !== DEFAULT_API_KEY) {
    localStorage.setItem('gemini_api_key', apiKey);
  }
};

export const processWithAI = async (content: string, template: Template, apiKey: string) => {
  const keyToUse = apiKey || DEFAULT_API_KEY;

  try {
    const genAI = new GoogleGenerativeAI(keyToUse);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Format the following content according to this template: ${template.content}. 
                   Maintain the original meaning while adapting it to the template structure.
                   Content to format: ${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('AI Processing Error:', error);
    if (error?.message?.includes('API key not valid')) {
      throw new Error('Invalid API key. Please check your Google Gemini API key');
    }
    throw new Error('Failed to process content with AI');
  }
};