import React, { useState } from 'react';
import { queryOpenAI } from "../back/OpenaiQuery";

function App() {
    const [userInput, setUserInput] = useState('');
    const [botResponse, setBotResponse] = useState('');

    const handleAsk = async () => {
        try {
            const response = await queryOpenAI(userInput);
            setBotResponse(response);
        } catch (error) {
            console.error('Erreur lors de l\'interrogation de OpenAI:', error);
            setBotResponse('Désolé, je n\'ai pas pu obtenir une réponse.');
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Chatbot avec OpenAI</h1>

                <textarea
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    placeholder="Posez votre question ici..."
                />
                <button onClick={handleAsk}>Demander</button>

                {botResponse && (
                    <div className="bot-response">
                        <p><strong>Bot:</strong> {botResponse}</p>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
