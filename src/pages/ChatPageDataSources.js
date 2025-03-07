import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme
import 'prismjs/components/prism-python'; // Python language support
import '../styles/ChatPage.css';
import airbyteIcon from '../images/airbyte-inc-logo-vector.svg';

function ChatPageDataSources() {
  const location = useLocation();
  const initialQuery = location.state?.query || "What datasets should I analyze?";
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [showSchemaModal, setShowSchemaModal] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [showSchemaModal]);

  const handleSchemaClick = (schemaType) => {
    setSelectedSchema(schemaType);
    setShowSchemaModal(true);
  };

  // const closeSchemaModal = () => {
  //   setShowSchemaModal(false);
  //   // Small delay to allow animation to complete before changing schema content
  //   setTimeout(() => setSelectedSchema(null), 300);
  // };

  // Schema data for each API
  const schemaContent = {
    bluesky: (
      <div className="schema-content">
        <div className="schema-field">
          <span className="field-name">post_id</span>
          <span className="field-type">string</span>
        </div>
        <div className="schema-field">
          <span className="field-name">author</span>
          <span className="field-type">object</span>
        </div>
        <div className="schema-field nested">
          <span className="field-name">did</span>
          <span className="field-type">string</span>
        </div>
        <div className="schema-field nested">
          <span className="field-name">handle</span>
          <span className="field-type">string</span>
        </div>
        <div className="schema-field">
          <span className="field-name">content</span>
          <span className="field-type">object</span>
        </div>
        <div className="schema-field nested">
          <span className="field-name">text</span>
          <span className="field-type">string</span>
        </div>
        <div className="schema-field nested">
          <span className="field-name">facets</span>
          <span className="field-type">array</span>
        </div>
        <div className="schema-field">
          <span className="field-name">indexedAt</span>
          <span className="field-type">string (ISO date)</span>
        </div>
        <div className="schema-field">
          <span className="field-name">likeCount</span>
          <span className="field-type">integer</span>
        </div>
        <div className="schema-field">
          <span className="field-name">repostCount</span>
          <span className="field-type">integer</span>
        </div>
      </div>
    ),
    reddit: (
      <div className="schema-content">
        <div className="schema-field">
          <span className="field-name">id</span>
          <span className="field-type">string</span>
        </div>
        <div className="schema-field">
          <span className="field-name">subreddit</span>
          <span className="field-type">string</span>
        </div>
        <div className="schema-field">
          <span className="field-name">title</span>
          <span className="field-type">string</span>
        </div>
        <div className="schema-field">
          <span className="field-name">author</span>
          <span className="field-type">string</span>
        </div>
        <div className="schema-field">
          <span className="field-name">selftext</span>
          <span className="field-type">string</span>
        </div>
        <div className="schema-field">
          <span className="field-name">created_utc</span>
          <span className="field-type">integer (unix timestamp)</span>
        </div>
        <div className="schema-field">
          <span className="field-name">ups</span>
          <span className="field-type">integer</span>
        </div>
        <div className="schema-field">
          <span className="field-name">downs</span>
          <span className="field-type">integer</span>
        </div>
        <div className="schema-field">
          <span className="field-name">num_comments</span>
          <span className="field-type">integer</span>
        </div>
        <div className="schema-field">
          <span className="field-name">post_hint</span>
          <span className="field-type">string</span>
        </div>
      </div>
    ),
    xapi: (
      <div className="schema-content">
        <div className="schema-field">
          <span className="field-name">id</span>
          <span className="field-type">string</span>
        </div>
        <div className="schema-field">
          <span className="field-name">text</span>
          <span className="field-type">string</span>
        </div>
        <div className="schema-field">
          <span className="field-name">user</span>
          <span className="field-type">object</span>
        </div>
        <div className="schema-field nested">
          <span className="field-name">id</span>
          <span className="field-type">string</span>
        </div>
        <div className="schema-field nested">
          <span className="field-name">name</span>
          <span className="field-type">string</span>
        </div>
        <div className="schema-field nested">
          <span className="field-name">username</span>
          <span className="field-type">string</span>
        </div>
        <div className="schema-field nested">
          <span className="field-name">verified</span>
          <span className="field-type">boolean</span>
        </div>
        <div className="schema-field">
          <span className="field-name">created_at</span>
          <span className="field-type">string (ISO date)</span>
        </div>
        <div className="schema-field">
          <span className="field-name">public_metrics</span>
          <span className="field-type">object</span>
        </div>
        <div className="schema-field nested">
          <span className="field-name">retweet_count</span>
          <span className="field-type">integer</span>
        </div>
        <div className="schema-field nested">
          <span className="field-name">reply_count</span>
          <span className="field-type">integer</span>
        </div>
        <div className="schema-field nested">
          <span className="field-name">like_count</span>
          <span className="field-type">integer</span>
        </div>
        <div className="schema-field nested">
          <span className="field-name">quote_count</span>
          <span className="field-type">integer</span>
        </div>
      </div>
    )
  };

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
              onClick={() => {
                // Assuming you want to navigate to the ChatPageGeneratePlan component
                window.location.href = '/generate-plan';
              }}
            >
              Confirm
            </button>
          </div>
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
        <div className="search-panel">
          <div className="browser-mockup">
            <div className="browser-header">
              <div className="browser-controls">
                <span className="browser-dot"></span>
                <span className="browser-dot"></span>
                <span className="browser-dot"></span>
              </div>
              <div className="browser-address-bar">denali/search/</div>
            </div>
            <div className="browser-content">
              <div className="panel-title">External Data Sources</div>
              <div className="api-card">
                <label className="api-card-label">
                  <div className="api-card-left">
                    <input type="checkbox" />
                    <span className="api-card-title">BlueSky API</span>
                  </div>
                  <div className="api-card-actions">
                    <button 
                      className="send-button"
                      onClick={() => handleSchemaClick('bluesky')}
                    >
                      Schema
                    </button>
                  </div>
                </label>
                <div className="api-meta">Format: JSON | Rate Limit: 10 requests per minute | Cost: Free</div>
              </div>
              <div className="api-card">
                <label className="api-card-label">
                  <div className="api-card-left">
                    <input type="checkbox" />
                    <span className="api-card-title">Reddit API</span>
                  </div>
                  <div className="api-card-actions">
                    <img src={airbyteIcon} alt="Airbyte" className="airbyte-icon" />
                    <button 
                      className="send-button"
                      onClick={() => handleSchemaClick('reddit')}
                    >
                      Schema
                    </button>
                  </div>
                </label>
                <div className="api-meta">Format: JSON | Rate Limit: 100 requests per minute | Cost: Premium</div>
              </div>
              <div className="api-card">
                <label className="api-card-label">
                  <div className="api-card-left">
                    <input type="checkbox" />
                    <span className="api-card-title">X API</span>
                  </div>
                  <div className="api-card-actions">
                    <button 
                      className="send-button"
                      onClick={() => handleSchemaClick('xapi')}
                    >
                      Schema
                    </button>
                  </div>
                </label>
                <div className="api-meta">Format: JSON | Rate Limit: 100 requests per minute | Cost: Premium</div>
              </div>
            </div>
          </div>
          
          {/* Schema Section */}
          {selectedSchema && (
            <div className="schema-section">
              <div className="schema-header">
                <h3>
                  {selectedSchema === 'bluesky' ? 'BlueSky API Schema' : 
                   selectedSchema === 'reddit' ? 'Reddit API Schema' : 
                   'X API Schema'}
                </h3>
              </div>
              <div className="schema-card">
                {schemaContent[selectedSchema]}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPageDataSources;
