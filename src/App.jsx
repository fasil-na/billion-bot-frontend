import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Backtest from './pages/Backtest';
import Configuration from './pages/Configuration';
import LiveTrades from './pages/LiveTrades';
import Sidebar from './components/Sidebar';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-white relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
          <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            QuantPlatform
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Backdrop for mobile */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
          <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden flex flex-col w-full">
          <Routes>
            <Route path="/" element={
              <div className="flex flex-col items-center justify-center flex-1 p-4">
                <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 p-8 text-center">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
                    Welcome to QuantPlatform
                  </h1>
                  <p className="text-slate-300 mb-8 text-sm md:text-base">
                    Your advanced algorithmic trading dashboard.
                  </p>
                  <Link to="/backtest" className="inline-block w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-1">
                    Start Backtesting
                  </Link>
                </div>
              </div>
            } />
            <Route path="/backtest" element={<Backtest />} />
            <Route path="/config" element={<Configuration />} />
            <Route path="/live-trades" element={<LiveTrades />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
