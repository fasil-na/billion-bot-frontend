import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // In a real app, this would be an API call to the backend
    setData({ message: "Welcome to the Premium MERN Application" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 p-8 transform hover:scale-105 transition-all duration-300">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
        
        <div className="relative">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6 text-center">
            {data ? data.message : "Loading..."}
          </h1>
          
          <p className="text-slate-300 text-center mb-8">
            This is a production-level React setup integrated with Tailwind CSS, ready for MongoDB and Node.js.
          </p>
          
          <button className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-1">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
