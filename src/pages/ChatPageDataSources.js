import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme
import 'prismjs/components/prism-python'; // Python language support
import '../styles/ChatPage.css';

function ChatPageDataSources() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialQuery = location.state?.query || "What datasets should I analyze?";
  const [activeTab, setActiveTab] = useState('search');

  useEffect(() => {
    Prism.highlightAll();
  }, [activeTab]);

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
                navigate('/pipeline-steps');
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
        <div className="tabs-container">
          <button 
            className={`tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Search
          </button>
          <button 
            className={`tab ${activeTab === 'schemas' ? 'active' : ''}`}
            onClick={() => setActiveTab('schemas')}
          >
            Schemas
          </button>
          <button 
            className={`tab ${activeTab === 'etl' ? 'active' : ''}`}
            onClick={() => setActiveTab('etl')}
          >
            ETL
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'search' && (
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
                      <input type="checkbox" />
                      <span className="api-card-title" style={{ marginLeft: '8px' }}>BlueSky API</span>
                      <button className="send-button" style={{ float: 'right' }}>Schema</button>
                    </label>
                    <div className="api-meta">Format: JSON | Rate Limit: 10 requests per minute | Cost: Free</div>
                  </div>
                  <div className="api-card">
                    <label className="api-card-label">
                      <input type="checkbox" />
                      <span className="api-card-title" style={{ marginLeft: '8px' }}>Reddit API</span>
                      <button className="send-button" style={{ float: 'right' }}>Schema</button>
                    </label>
                    <div className="api-meta">Format: JSON | Rate Limit: 100 requests per minute | Cost: Premium</div>
                  </div>
                  <div className="api-card">
                    <label className="api-card-label">
                      <input type="checkbox" />
                      <span className="api-card-title" style={{ marginLeft: '8px' }}>X API</span>
                      <button className="send-button" style={{ float: 'right' }}>Schema</button>
                    </label>
                    <div className="api-meta">Format: JSON | Rate Limit: 100 requests per minute | Cost: Premium</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'schemas' && (
            <div className="schema-panel">
              <div className="panel-title">Schema</div>
              <div className="schema-card">
                <div className="schema-content">
                  <div className="schema-field">
                    <span className="field-name">id</span>
                    <span className="field-type">string</span>
                  </div>
                  <div className="schema-field">
                    <span className="field-name">address</span>
                    <span className="field-type">object</span>
                  </div>
                  <div className="schema-field nested">
                    <span className="field-name">street</span>
                    <span className="field-type">string</span>
                  </div>
                  <div className="schema-field nested">
                    <span className="field-name">city</span>
                    <span className="field-type">string</span>
                  </div>
                  <div className="schema-field">
                    <span className="field-name">square_footage</span>
                    <span className="field-type">object</span>
                  </div>
                  <div className="schema-field nested">
                    <span className="field-name">exterior</span>
                    <span className="field-type">integer</span>
                  </div>
                  <div className="schema-field nested">
                    <span className="field-name">interior</span>
                    <span className="field-type">integer</span>
                  </div>
                  <div className="schema-field">
                    <span className="field-name">price</span>
                    <span className="field-type">object</span>
                  </div>
                  <div className="schema-field nested">
                    <span className="field-name">current</span>
                    <span className="field-type">integer</span>
                  </div>
                  <div className="schema-field nested">
                    <span className="field-name">history</span>
                    <span className="field-type">array</span>
                  </div>
                  <div className="schema-field nested">
                    <span className="field-name">estimated</span>
                    <span className="field-type">integer</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'etl' && (
            <div className="etl-panel">
              <div className="panel-title">ETL Pipeline</div>
              <div className="code-block">
                <pre>
                  <code className="language-python">{`# Import required libraries
from zillow_api import ZillowClient
import pandas as pd

def extract_housing_data():
    """Extract data from Zillow API for Seattle area"""
    client = ZillowClient(api_key="****")
    return client.get_properties(city="Seattle")

def transform_data(properties):
    """Clean and transform raw property data"""
    df = pd.DataFrame(properties)
    
    # Calculate price per sqft
    df['price_per_sqft'] = df['price.current'] / df['square_footage.interior']
    
    # Add market indicators
    df['is_good_value'] = df['price.current'] < df['price.estimated']
    
    return df

# Execute pipeline
raw_data = extract_housing_data()
clean_data = transform_data(raw_data)
clean_data.to_sql('seattle_properties')`}</code>
                </pre>
              </div>
              <div className="etl-status">
                <div className="status-header">Pipeline Status</div>
                <div className="status-item success">
                  <span className="status-icon">✓</span>
                  <span>Data extraction completed - 5,283 records</span>
                </div>
                <div className="status-item success">
                  <span className="status-icon">✓</span>
                  <span>Data transformation completed - 5,104 valid records</span>
                </div>
                <div className="status-item in-progress">
                  <span className="status-icon">⟳</span>
                  <span>Database loading in progress...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPageDataSources;
