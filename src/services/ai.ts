import { GoogleGenerativeAI } from '@google/generative-ai';
import { Template } from '@/types/compliance';

const DEFAULT_API_KEY = 'YOUR_GEMINI_API_KEY';

export const getStoredApiKey = () => {
  return localStorage.getItem('gemini_api_key') || DEFAULT_API_KEY;
};

export const setStoredApiKey = (apiKey: string) => {
  localStorage.setItem('gemini_api_key', apiKey);
};

export const processWithAI = async (content: string, template: Template, apiKey: string) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey || getStoredApiKey());
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Format the following content according to this template: ${template.content}. 
                   Maintain the original meaning while adapting it to the template structure.
                   Content to format: ${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI Processing Error:', error);
    throw new Error('Failed to process content with AI');
  }
};