
import React from 'react';

const axios = require('axios');

const OPENAI_API_URL = 'https://api.openai.com/v1/engines/davinci/completions';
const OPENAI_API_KEY = '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';

const queryOpenAI = async (promptText: string) => {
    try {
        const response = await axios.post(OPENAI_API_URL, {
            prompt: promptText,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error("Erreur lors de l'appel à OpenAI:");
        throw error;
    }
};

(async () => {
    try {
        const result = await queryOpenAI("Qu'est-ce que le harcèlement au travail?");
        console.log(result);
    } catch (error) {
        console.error('Erreur lors de la récupération de la réponse:', error);
    }
})();
