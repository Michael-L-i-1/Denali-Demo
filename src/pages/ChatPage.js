import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme
import 'prismjs/components/prism-python'; // Python language support
import '../styles/ChatPage.css';

function ChatPage() {
  const location = useLocation();
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
          Real Estate Price Analysis
        </div>
        <div className="chat-history">
          <div className="user-message">
            <div className="message-content">{initialQuery}</div>
          </div>
          <div className="ai-message">
            <div className="message-content">
              I'll help you analyze and update your housing database. Let me:
              <br />
              <br />
              1. Search for relevant external data sources
              <br />
              2. Analyze their schemas for compatibility
              <br />
              3. Set up an ETL pipeline to merge the data
              <br />
              <br />
              Which dataset would you like to analyze?
            </div>
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
                  <div className="browser-address-bar">https://api.housing-data.org/search</div>
                </div>
                <div className="browser-content">
                  <div className="panel-title">External Housing Data Sources</div>
                  <div className="api-card">
                    <div className="api-card-title">Zillow Real Estate Data API</div>
                    <p>Access to comprehensive real estate listings, property values, and historical pricing data.</p>
                    <div className="api-meta">Format: JSON | Updated: Daily | Cost: Premium</div>
                  </div>
                  <div className="api-card">
                    <div className="api-card-title">US Housing & Urban Development (HUD) API</div>
                    <p>Official government dataset with housing market trends, low-income housing stats, and regional metrics.</p>
                    <div className="api-meta">Format: JSON/CSV | Updated: Monthly | Cost: Free</div>
                  </div>
                  <div className="api-card">
                    <div className="api-card-title">RealEstate.com Developer API</div>
                    <p>Property listings, neighborhood data, and market analysis tools with historical comparisons.</p>
                    <div className="api-meta">Format: JSON | Updated: Weekly | Cost: Tiered</div>
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

export default ChatPage; 