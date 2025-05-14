import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SecondPage from './pages/SecondPage';
import NewsPage from './pages/NewsPage';
import './App.css';
import './index.css';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/join" element={<SecondPage />} />
      <Route path="/news" element={<NewsPage />} />
    </Routes>
  );
};

export default App; 