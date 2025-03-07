import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme
import 'prismjs/components/prism-python'; // Python language support
import '../styles/ChatPage.css';

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
            <div className="code-block" style={{display: 'none'}}>
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
              {[
                "Sync Reddit Data to S3 Data Lake with Airbyte",
                "Build Data Extractor for X API",
                "Sync X Data to S3 Data Lake",
                "Load Data From S3 into Snowflake",
                "Data Cleaning and Transformation using dbt",
                "Data Exploration and Validation",
                "Perform Sentiment Analysis",
                "Productionize Pipeline",
                "Deploy Pipeline"
              ].map((text, index) => (
                <div 
                  key={index}
                  className={`status-item in-progress ${index < visibleItems ? 'visible' : ''}`}
                  style={{
                    opacity: index < visibleItems ? 1 : 0,
                    transform: index < visibleItems ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease'
                  }}
                >
                  <span className="status-icon">⟳</span>
                  <span>{text}</span>
                </div>
              ))}
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
