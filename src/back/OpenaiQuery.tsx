import axios from "axios";

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = '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';

type ChatEntry = {
    question: string; answer: string;
}

export const queryOpenAI = async (conversation: ChatEntry[], userInput:string) => {
    try {
        const messages = conversation.map(entry => {
            return { role: "user", content: entry.question };
        });
        messages.push({ role: "user", content: "Pour toute la conversation tu seras Jade, assistant virtuel pour aider les personnes victime de harcèlement. Tu es une assistante pour les personnes victimes de harcèlement sexuels au travail. Tu es française. Tu dois avoir des réponses humaines et empathique. Tu ne dois pas répondre à autres choses que des questions ou réponses en rapport avec le harcèlement. Si on te pose une question hors sujet, repart sur le bon sujet. tu dois parler seulement de harcèlement et non d'autres sujets. Tu dois poser une question par question. Evite les paragraphes, et les réponses avec plusieurs étapes. Tu dois faire attention a garder l'anonymat de la personne, préviens la personne si elle donne des informations personnelles, la personne ne doit pas donner son nom, numéro de téléphone. Utilise Monsieur ou Madame pour parler à la personne ou le prénom. Tu dois faire attention a ne pas être trop direct." });
        if(userInput.length>0){
            messages.push({ role: "user", content: userInput });
        }

        const response = await axios.post(OPENAI_API_URL, {
            messages,
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



