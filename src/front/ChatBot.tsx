import React, {useEffect, useState} from 'react';
import {queryOpenAI} from "../back/OpenaiQuery";
import './index.css';

type ChatEntry = {
    question: string; answer: string;
}

function App() {
    const [userInput, setUserInput] = useState('');
    const [displayedText, setDisplayedText] = useState('');
    const [isTypingDone, setIsTypingDone] = useState(false);
    const originalText = 'Partagez votre expérience pro en toute confiance.';
    const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < originalText.length) {
                setDisplayedText((prevText) => prevText + originalText[index]);
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
        try {
            const response = await queryOpenAI(chatHistory, userInput);
            const newEntry = { question: userInput, answer: response };
            setChatHistory(prevHistory => [...prevHistory, newEntry]);
            setUserInput('');
        } catch (error) {
            console.error('Erreur lors de l\'interrogation de OpenAI:', error);
            const errorEntry = { question: userInput, answer: 'Désolé, je n\'ai pas pu obtenir une réponse.' };
            setChatHistory(prevHistory => [...prevHistory, errorEntry]);
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
            <h1>{displayedText}<span className={isTypingDone ? 'typing-indicator' : ''}>|</span></h1>
            <div className="TextMain" >Merci de raconter les faits sans donner de données personnelles (noms, prenoms, ...)
                <br></br>
                    Si vous n’êtes pas satisfait des réponses et que vous ne savez pas à qui en parler, vous pouvez
                    contacter le 17.

            </div>
            <div className="mainChatBot">
                {chatHistory.map((entry, index) => (<div key={index}>
                        <div className="user-question">
                            {entry.question && <strong className="user-icon"></strong>}
                            {entry.question}
                        </div>
                        {entry.answer && (<div className="bot-response">
                                <strong className="bot-icon"></strong>
                                {entry.answer}
                            </div>)}
                    </div>))}
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
    </div>
);
}

export default App;
