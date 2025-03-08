import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme
import 'prismjs/components/prism-python'; // Python language support
import '../styles/ChatPage.css';
import { twitterExtractorCode } from '../assets/code/twitterExtractorCode';
import dataValidationCode from '../assets/code/dataValidationCode';
import { marked } from 'marked';

function ChatPagePipelineSteps() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialQuery = location.state?.query || "What datasets should I analyze?";
  const [activeTab, setActiveTab] = useState('search');
  const [visibleItems, setVisibleItems] = useState(0);
  const [activeSpinners, setActiveSpinners] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [showActionRequired, setShowActionRequired] = useState(false);
  const [activeView, setActiveView] = useState('pipeline');
  const [openFiles, setOpenFiles] = useState([]);

  const processingTimes = [1,2,3,4,5]; // Time in seconds for each step
  const totalSteps = 9;
  const stopIndex = 5;
  const dataValidationStopTimer = 6;

  useEffect(() => {
    Prism.highlightAll();
  }, [activeView]);

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

  useEffect(() => {
    // Add files to openFiles when they're viewed
    if (activeView === 'code' && !openFiles.includes('twitter_extractor.py')) {
      setOpenFiles([...openFiles, 'twitter_extractor.py']);
    } else if (activeView === 'notebook' && !openFiles.includes('data_validation.ipynb')) {
      setOpenFiles([...openFiles, 'data_validation.ipynb']);
    }
  }, [activeView]);

  const startPipelineExecution = () => {
    setTimeout(() => {
      setShowActionRequired(true);
    }, dataValidationStopTimer * 1000);

    for (let i = 0; i < totalSteps; i++) {
      setActiveSpinners(prev => [...prev, i]);

      const timeInMs = processingTimes[i] * 1000;
      
      if (i < stopIndex) {
        setTimeout(() => {
          setCompletedItems(prev => [...prev, i]);
          setActiveSpinners(prev => prev.filter(j => j !== i));
        }, timeInMs);
      }
    }
  };

  const renderNotebookCell = (cell) => {
    if (cell.cell_type === 'markdown') {
      return (
        <div key={cell.execution_count} className="notebook-cell markdown">
          <div dangerouslySetInnerHTML={{ __html: marked(cell.source.join('')) }} />
        </div>
      );
    } else if (cell.cell_type === 'code') {
      return (
        <div key={cell.execution_count} className="notebook-cell code">
          <div className="cell-header">
            <span className="cell-type">In [{cell.execution_count || ' '}]</span>
          </div>
          <div className="cell-content">
            <pre>
              <code className="language-python">{cell.source.join('')}</code>
            </pre>
          </div>
          {cell.outputs && cell.outputs.length > 0 && (
            <div className="cell-output">
              {cell.outputs.map((output, index) => (
                <div key={index}>
                  {output.output_type === 'stream' ? (
                    <pre>{output.text.join('')}</pre>
                  ) : output.output_type === 'execute_result' ? (
                    <div dangerouslySetInnerHTML={{ __html: output.data['text/html']?.join('') || output.data['text/plain']?.join('') }} />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
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
                  startPipelineExecution();
                  const button = document.getElementById('confirm-plan-button');
                  button.disabled = true;
                  button.textContent = 'Confirmed';
                  button.style.opacity = 0.5;
                }}
                style={{
                  cursor: 'pointer'
                }}
              >
                Confirm
              </button>
            </div>
          )}
          {showActionRequired && (
            <div className="ai-message">
              <div className="message-content">
                Data Exploration and Validation step requires your action to proceed. Please review and resolve.
              </div>
              <button
                className="confirm-button"
                id="resolve-button"
                onClick={() => {
                  const button = document.getElementById('resolve-button');
                  button.disabled = true;
                  button.textContent = 'Resolved';
                  button.style.opacity = 0.5;
                }}
                style={{
                  cursor: 'pointer'
                }}
              >
                Resolve
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
        {activeView === 'pipeline' && (
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
                    className={`status-item in-progress ${index < visibleItems ? 'visible' : ''} ${
                      completedItems.includes(index) ? 'completed' : ''
                    }`}
                    style={{
                      opacity: index < visibleItems ? 1 : 0,
                      transform: index < visibleItems ? 'translateY(0)' : 'translateY(10px)',
                      transition: 'opacity 0.3s ease, transform 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      if (item.id === 'build-x-extractor') {
                        setActiveView('code');
                      } else if (item.id === 'data-validation') {
                        setActiveView('notebook');
                      }
                    }}
                  >
                    <span className={`status-icon ${activeSpinners.includes(index) ? 'spinning' : ''}`}>
                      {completedItems.includes(index) ? '✓' : '⟳'}
                    </span>
                    <span>{item.text}</span>
                    {showActionRequired && item.id === 'data-validation' && (
                      <span className="action-required">Action Required</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'code' && (
          <div className="code-view">
            <div className="view-header">
              <button 
                className="back-button"
                onClick={() => setActiveView('pipeline')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-light)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                }}
              >
                ← Back to Pipeline
              </button>
            </div>
            <div className="code-editor" style={{ 
              display: 'block',
              width: '60vw',
              margin: '1rem auto',
            }}>
              <div className="editor-header">
                <span className="file-name">twitter_extractor.py</span>
              </div>
              <div className="editor-content">
                <pre>
                  <code className="language-python">{twitterExtractorCode}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeView === 'notebook' && (
          <div className="notebook-view">
            <div className="view-header">
              <button 
                className="back-button"
                onClick={() => setActiveView('pipeline')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-light)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                }}
              >
                ← Back to Pipeline
              </button>
            </div>
            <div className="notebook-editor" style={{ 
              display: 'block',
              width: '60vw',
              margin: '1rem auto',
            }}>
              <div className="editor-header">
                <span className="file-name">data_validation.ipynb</span>
              </div>
              <div className="editor-content">
                {(() => {
                  try {
                    return dataValidationCode.cells.map(cell => renderNotebookCell(cell));
                  } catch (error) {
                    console.error('Error rendering notebook:', error);
                    return <div>Error loading notebook</div>;
                  }
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="workspace-side" style={{ minWidth: '14vw' }}>
        <div className="workspace-header">
          <span>WORKSPACE</span>
        </div>
        <div className="workspace-explorer">
          {openFiles.length > 0 && (
            <div className="open-files">
              {openFiles.map(file => (
                <div 
                  key={file}
                  className={`file ${
                    (activeView === 'code' && file === 'twitter_extractor.py') ||
                    (activeView === 'notebook' && file === 'data_validation.ipynb')
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => {
                    if (file === 'twitter_extractor.py') {
                      setActiveView('code');
                    } else if (file === 'data_validation.ipynb') {
                      setActiveView('notebook');
                    }
                  }}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: (activeView === 'code' && file === 'twitter_extractor.py') ||
                                  (activeView === 'notebook' && file === 'data_validation.ipynb')
                      ? 'var(--primary-dark)'
                      : 'transparent',
                    color: 'var(--text-light)',
                    borderLeft: (activeView === 'code' && file === 'twitter_extractor.py') ||
                              (activeView === 'notebook' && file === 'data_validation.ipynb')
                      ? '2px solid var(--primary-green)'
                      : '2px solid transparent',
                  }}
                >
                  <span style={{ fontSize: '0.9rem' }}>
                    {file === 'twitter_extractor.py' ? '📄' : '📓'}
                  </span>
                  {file}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPagePipelineSteps;
