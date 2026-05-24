import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LineChart, Settings, X, Activity } from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Backtest', path: '/backtest', icon: LineChart },
    { name: 'Configuration', path: '/config', icon: Settings },
    { name: 'Live Trades', path: '/live-trades', icon: Activity },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen sticky top-0">
      <div className="p-6 hidden md:block">
        <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          QuantPlatform
        </Link>
      </div>
      
      <div className="md:hidden p-4 flex justify-between items-center border-b border-slate-800">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Menu
        </span>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
