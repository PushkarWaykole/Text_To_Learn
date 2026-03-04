import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-4">Text-to-Learn</h1>
      <p className="text-lg text-gray-600">AI-Powered Course Generator(Pushkar)</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
