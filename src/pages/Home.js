import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Home() {
  const [inputText, setInputText] = useState('');
  const navigate = useNavigate();

  const handleSend = () => {
    if (inputText.trim()) {
      navigate('/chat', { state: { query: inputText } });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <h1 className="hero-text">
          I'm Your Data Engineer. What Would You Like To Analyze Today?
        </h1>
        
        <div className="chat-container">
          <div className="chat-input-container">
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Ask me about your data..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="send-button" onClick={handleSend}>Send</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home; 