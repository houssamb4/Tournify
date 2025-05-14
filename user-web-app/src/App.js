import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SecondPage from './pages/SecondPage';
import './App.css';
import './index.css';

const App = () => {
  return (
    /*
    <div>
      <nav>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/second">Second Page</Link>
          </li>
        </ul>
      </nav>
      */

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/join" element={<SecondPage />} />
      </Routes>
   // </div>
  );
};

export default App;