import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Backtest from './pages/Backtest';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-white">
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              QuantPlatform
            </Link>
            <Link to="/backtest" className="text-slate-300 hover:text-white transition-colors">
              Backtest
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
              <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 p-8 text-center">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
                  Welcome to QuantPlatform
                </h1>
                <p className="text-slate-300 mb-8">
                  Your advanced algorithmic trading dashboard.
                </p>
                <Link to="/backtest" className="inline-block w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-1">
                  Start Backtesting
                </Link>
              </div>
            </div>
          } />
          <Route path="/backtest" element={<Backtest />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
