import React, { useEffect, useState } from 'react';
import { queryOpenAI } from "../back/OpenaiQuery";
import './index.css';

type ChatEntry = {
    question: string;
    answer: string;
}

function App() {
    const [userInput, setUserInput] = useState('');
    const [displayedText, setDisplayedText] = useState('');
    const [isTypingDone, setIsTypingDone] = useState(false);
    const originalText = 'Partagez votre expérience pro en toute confiance.';
    const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < originalText.length) {
                setDisplayedText(originalText.substring(0, index + 1));
                index++;
                if (index === originalText.length) {
                    setIsTypingDone(true);
                }
            } else {
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const handleAsk = async () => {
        if (!userInput.trim()) {
            setErrorMessage('Veuillez écrire quelque chose avant de soumettre.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await queryOpenAI(chatHistory, userInput);

            if (chatHistory.length === 0) {
                const initialEntry = {
                    question: "",
                    answer: "Salut, je suis Jade. Avez-vous subi un harcèlement sexuel au travail ou voulez-vous savoir ce que c'est que le harcèlement sexuel? Posez-moi une question."
                };
                setChatHistory([initialEntry]);
            }

            const newEntry = {
                question: userInput,
                answer: response
            };
            setChatHistory(prevHistory => [...prevHistory, newEntry]);
            setUserInput('');
            setErrorMessage('');

        } catch (error) {
            console.error('Erreur lors de l\'interrogation de OpenAI:', error);
            const errorEntry = { question: userInput, answer: 'Désolé, je n\'ai pas pu obtenir une réponse.' };
            setChatHistory(prevHistory => [...prevHistory, errorEntry]);
            setErrorMessage('Une erreur s\'est produite. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };



    return (<div className="App">
            <header className="App-header">
                <div className="logo"/>
                <span className="title">Jade</span>
                <div className="social-links">
                    <span>Twitter</span>
                    <span>/</span>
                    <span>Facebook</span>
                </div>
            </header>
            <div className="main">
                <div className="TextMain">Merci de raconter les faits sans donner de données personnelles (noms,
                    prenoms, ...)
                    <br></br>
                    Si vous n’êtes pas satisfait des réponses et que vous ne savez pas à qui en parler, vous pouvez
                    contacter le 17.

                </div>
                <div className="mainChatBot">
                    {chatHistory.length === 0 ? (
                        <div className="initial-message">
                            <div className="initial-messageLogo" />
                            <h1>{displayedText}<span className={isTypingDone ? 'typing-indicator' : ''}>|</span></h1>
                            <p>Salut, je suis Jade. Avez-vous subi un harcèlement sexuel au travail ou voulez-vous savoir ce que c'est que le harcèlement sexuel?
                                <br/>Posez-moi une question.</p>
                        </div>
                    ) : chatHistory.map((entry, index) => (
                        <div key={index}>
                            {entry.question && (
                                <div className="user-question">
                                    <strong className="user-icon"></strong>
                                    {entry.question}
                                </div>
                            )}
                            <div className="bot-response">
                                {(isLoading && index === chatHistory.length - 1) ? (
                                    <div className="loader">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                ) : (
                                    <>
                                        <strong className="bot-icon"></strong>
                                        {entry.answer}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="notification">
                    {errorMessage && <div style={{color: 'red', marginBottom: '8px'}}>{errorMessage}</div>}
                </div>
                <div className="textarea-container">
                <textarea
                    className="custom-textarea"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    placeholder="Posez votre question ici..."
                />
                    <button className="send-icon-button" onClick={handleAsk}></button>
                </div>

            </div>
        </div>);
}

export default App;
