import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatPageDataSources from './pages/ChatPageDataSources';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPageDataSources />} />
      </Routes>
    </Router>
  );
}

export default App;
