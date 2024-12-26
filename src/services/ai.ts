export const processWithAI = async (content: string, template: any, apiKey: string) => {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a content formatter. Format the given content according to this template: ${template.content}. 
                     Maintain the original meaning while adapting it to the template structure.`
          },
          {
            role: 'user',
            content
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Processing Error:', error);
    throw new Error('Failed to process content with AI');
  }
};