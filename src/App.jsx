import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Examples from './pages/Examples';
import Quiz from './pages/Quiz';
import Compiler from './pages/Compiler';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/compiler" element={<Compiler />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
