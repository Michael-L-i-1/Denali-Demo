import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme
import 'prismjs/components/prism-python'; // Python language support
import '../styles/ChatPage.css';

function ChatPagePipelineSteps() {
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
        <div className="execution-plan">
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
              <div className="status-header">Execution Plan</div>
              <div className="status-item success">
                <span className="status-icon">✓</span>
                <span>Sync Reddit Data to S3 Data Lake with Airbyte</span>
              </div>
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
        </div>
      </div>
      <div className="workspace-side">
          <div className="workspace-header">
            <span>WORKSPACE</span>
          </div>
          <div className="workspace-explorer">
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
