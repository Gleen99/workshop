import axios from "axios";
import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

const OPENAI_API_URL = 'https://api.openai.com/v1/gpt-3.5-turbo/chat/completions';
const OPENAI_API_KEY = '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';

app.use(express.json());

app.post('/query', async (req: Request, res: Response) => {
    try {
        const promptText = req.body.prompt;
        const response = await axios.post(OPENAI_API_URL, {
            messages: [{
                role: "user",
                content: promptText
            }],
            temperature: 0.7,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.send(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à OpenAI:", error);
        res.status(500).send( "Erreur interne du serveur");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export class queryOpenAI {
}