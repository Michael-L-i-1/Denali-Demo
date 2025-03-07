import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme
import 'prismjs/components/prism-python'; // Python language support
import '../styles/ChatPage.css';
import { twitterExtractorCode } from '../assets/code/twitterExtractorCode';

function ChatPagePipelineSteps() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialQuery = location.state?.query || "What datasets should I analyze?";
  const [activeTab, setActiveTab] = useState('search');
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    Prism.highlightAll();
  }, [activeTab]);

  useEffect(() => {
    const totalItems = 9; // Total number of status items
    let currentItem = 0;
    
    const interval = setInterval(() => {
      if (currentItem < totalItems) {
        setVisibleItems(prev => prev + 1);
        currentItem++;
      } else {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chat-page">
      <div className="chat-side">
        <div className="chat-header">
          <svg
            width="20"
            height="20"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="header-logo"
          >
            <path d="M16 2L2 10L16 18L30 10L16 2Z" fill="#4CAF50" />
            <path d="M16 20L2 12V26L16 30V20Z" fill="#4CAF50" />
            <path d="M16 20L30 12V26L16 30V20Z" fill="#4CAF50" />
          </svg>
          Stock Trend Analysis Based On Social Media Sentiment Analysis
        </div>
        <div className="chat-history">
          <div className="user-message">
            <div className="message-content">{initialQuery}</div>
          </div>
          <div className="ai-message">
            <div className="message-content">
              I have identified multiple social media platforms with a public API to pull data from. Please select which APIs you would like to use and confirm.
            </div>
            <button
              className="confirm-button"
              style={{ 
                opacity: 0.5, 
                cursor: 'default' 
              }}
              disabled
            >
              Confirmed
            </button>
          </div>
          {visibleItems < 9 ? (
            <div className="ai-message">
              <div className="message-content">
                <div className="loading-spinner">⟳</div>
                Generating execution plan...
              </div>
            </div>
          ) : (
            <div className="ai-message">
              <div className="message-content">
                I have generated an execution plan for the pipeline. Please review and confirm.
              </div>
              <button
                className="confirm-button"
                id="confirm-plan-button"
                onClick={() => {
                  navigate('/pipeline-steps');
                }}
              >
                {/* When clicked, execute each plan item sequentially */}
                Confirm
              </button>
            </div>
          )}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Continue the conversation..."
          />
          <button className="send-button">Send</button>
        </div>
      </div>
      <div className="visualization-side">
        <div className="execution-plan">
          <div className="etl-panel">
            <div className="etl-status">
              <div className="status-header">Execution Plan</div>
              {[
                {id: "sync-reddit", text: "Sync Reddit Data to S3 Data Lake with Airbyte"},
                {id: "build-x-extractor", text: "Build Data Extractor for X API"},
                {id: "sync-x", text: "Sync X Data to S3 Data Lake"},
                {id: "load-snowflake", text: "Load Data From S3 into Snowflake"},
                {id: "dbt-transform", text: "Data Cleaning and Transformation using dbt"},
                {id: "data-validation", text: "Data Exploration and Validation"},
                {id: "sentiment", text: "Perform Sentiment Analysis"},
                {id: "productionize", text: "Productionize Pipeline"},
                {id: "deploy", text: "Deploy Pipeline"}
              ].map((item, index) => (
                <div 
                  key={item.id}
                  className={`status-item in-progress ${index < visibleItems ? 'visible' : ''}`}
                  style={{
                    opacity: index < visibleItems ? 1 : 0,
                    transform: index < visibleItems ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    if (item.id === 'build-x-extractor') {
                      document.querySelector('.code-editor').style.display = 'block';
                    } else {
                      document.querySelector('.code-editor').style.display = 'none';
                    }
                  }}
                >
                  <span className="status-icon">⟳</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            <div className="code-editor" style={{display: 'none'}}>
              <div className="editor-header">
                <span className="file-name">twitter_extractor.py</span>
                <button 
                  className="close-button"
                  onClick={() => {
                    document.querySelector('.code-editor').style.display = 'none';
                  }}
                >
                  ×
                </button>
              </div>
              <div className="editor-content">
                <pre>
                  <code className="language-python">{twitterExtractorCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="workspace-side" style={{ minWidth: '14vw' }}>
          <div className="workspace-header">
            <span>WORKSPACE</span>
          </div>
          <div className="workspace-explorer" style={{ display: 'none' }}>
            <div className="folder">
              <div className="folder-name">
                <span className="folder-icon">📁</span>
                data
              </div>
              <div className="file indented">
                <span className="file-icon">📄</span>
                raw_data.csv
              </div>
              <div className="file indented">
                <span className="file-icon">📄</span>
                processed_data.csv
              </div>
            </div>
            <div className="folder">
              <div className="folder-name">
                <span className="folder-icon">📁</span>
                models
              </div>
              <div className="file indented">
                <span className="file-icon">📄</span>
                sentiment_model.pkl
              </div>
            </div>
            <div className="folder">
              <div className="folder-name">
                <span className="folder-icon">📁</span>
                notebooks
              </div>
              <div className="file indented">
                <span className="file-icon">📄</span>
                analysis.ipynb
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default ChatPagePipelineSteps;
