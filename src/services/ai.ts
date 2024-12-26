import { GoogleGenerativeAI } from '@google/generative-ai';
import { Template } from '@/types/compliance';

const DEFAULT_API_KEY = '';  // Remove default placeholder key

export const getStoredApiKey = () => {
  return localStorage.getItem('gemini_api_key') || DEFAULT_API_KEY;
};

export const setStoredApiKey = (apiKey: string) => {
  localStorage.setItem('gemini_api_key', apiKey);
};

export const processWithAI = async (content: string, template: Template, apiKey: string) => {
  if (!apiKey) {
    throw new Error('Please provide a valid Google Gemini API key');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
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