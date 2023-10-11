import axios from "axios";

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = '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';

export const queryOpenAI = async (promptText: string) => {
    try {
        const response = await axios.post(OPENAI_API_URL, {
            messages: [{
                role: "user",
                content: promptText
            }],
            temperature: 0.7,
            model: "gpt-3.5-turbo-0613",
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices && response.data.choices[0]?.message?.content.trim();
    } catch (error) {
        console.error("Erreur lors de l'appel à OpenAI:", error);
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
