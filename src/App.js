import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatPageDataSources from './pages/ChatPageDataSources';
import ChatPagePipelineSteps from './pages/ChatPagePipelineSteps';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPageDataSources />} />
        <Route path="/pipeline-steps" element={<ChatPagePipelineSteps />} />
      </Routes>
    </Router>
  );
}

export default App;
