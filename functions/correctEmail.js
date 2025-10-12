const fetch = require('node-fetch');

const correctEmailWithAI = async (text) => {
    const apiKey = (process.env.API_KEY || '').trim();

    if (!apiKey) {
        throw new Error('Missing OpenAI API key');
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'user', content: `Please correct the following email: "${text}"` },
                ],
            }),
        });

        if (!response.ok) {
            // Try to parse JSON error first
            let errorMessage = 'Unknown error';
            const rawText = await response.text();
            try {
                const errorData = JSON.parse(rawText);
                errorMessage = errorData.error?.message || errorMessage;
            } catch {
                // Response wasn't JSON — keep raw text
                errorMessage = rawText;
            }

            console.error('OpenAI API error:', errorMessage);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error in correctEmailWithAI:', error);
        throw error; // don't overwrite the real error
    }
};

module.exports = correctEmailWithAI;
