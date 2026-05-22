import React, { useState, useEffect } from 'react';
import { Save, Plus, Activity, Power, Trash2, Edit2, X } from 'lucide-react';
import { API_BASE_URL } from '../config/constants';

const STATIC_INSTRUMENTS = {
  'B-BTC_USDT': { maxLeverage: 20, qtyStep: 0.001, priceStep: 0.1, minNotional: 6 },
  'B-SUSHI_USDT': { maxLeverage: 10, qtyStep: 1, priceStep: 0.0001, minNotional: 6 },
  'B-XAU_USDT': { maxLeverage: 20, qtyStep: 0.01, priceStep: 0.01, minNotional: 6 },
  'SUSHIUSDT': { maxLeverage: 10, qtyStep: 1, priceStep: 0.0001, minNotional: 6 },
};

const instrumentKeys = Object.keys(STATIC_INSTRUMENTS);

const STRATEGY_IDS = {
  'fvg-imbalance': 'FVG Imbalance',
  'sma_crossover': 'SMA Crossover'
};

const strategyKeys = Object.keys(STRATEGY_IDS);

const Configuration = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = {
    pair: instrumentKeys[0], // Use the first instrument dynamically
    strategyId: 'fvg-imbalance',
    timeInterval: '15',
    riskAmount: 5,
    autoTrade: false,
    isEnabled: true
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchConfigs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/configs`);
      if (response.ok) {
        const data = await response.json();
        setConfigs(data);
      }
    } catch (error) {
      console.error('Failed to fetch configs:', error);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        riskAmount: Number(formData.riskAmount)
      };

      const url = editingId 
        ? `${API_BASE_URL}/configs/${editingId}`
        : `${API_BASE_URL}/configs`;
        
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchConfigs();
        if (editingId) {
          handleCancelEdit();
        }
      }
    } catch (error) {
      console.error('Failed to save config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config) => {
    setEditingId(config._id);
    setFormData({
      pair: config.pair,
      strategyId: config.strategyId,
      timeInterval: config.timeInterval,
      riskAmount: config.riskAmount,
      autoTrade: config.autoTrade,
      isEnabled: config.isEnabled
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this configuration?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/configs/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchConfigs();
        if (editingId === id) {
          handleCancelEdit();
        }
      }
    } catch (error) {
      console.error('Failed to delete config:', error);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Live Trading Configuration</h1>
          <p className="text-slate-400 text-sm md:text-base">Manage your active trading pairs and strategies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-5 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {editingId ? (
                  <Edit2 className="w-5 h-5 text-amber-400" />
                ) : (
                  <Plus className="w-5 h-5 text-indigo-400" />
                )}
                <h2 className="text-lg md:text-xl font-semibold text-white">
                  {editingId ? 'Edit Parameters' : 'Strategy Parameters'}
                </h2>
              </div>
              {editingId && (
                <button onClick={handleCancelEdit} className="text-slate-400 hover:text-white transition-colors" title="Cancel edit">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Trading Pair</label>
                <select
                  name="pair"
                  value={formData.pair}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  required
                >
                  {instrumentKeys.map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Strategy ID</label>
                <select
                  name="strategyId"
                  value={formData.strategyId}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                >
                  {strategyKeys.map((key) => (
                    <option key={key} value={key}>{STRATEGY_IDS[key]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Time Interval (Minutes)</label>
                <select
                  name="timeInterval"
                  value={formData.timeInterval}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                >
                  <option value="1">1m</option>
                  <option value="5">5m</option>
                  <option value="15">15m</option>
                  <option value="60">1h</option>
                  <option value="240">4h</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Risk Amount (%)</label>
                <input
                  type="number"
                  name="riskAmount"
                  value={formData.riskAmount}
                  onChange={handleInputChange}
                  min="0.1"
                  step="0.1"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="autoTrade"
                      checked={formData.autoTrade}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`block w-12 h-6 rounded-full transition-colors ${formData.autoTrade ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.autoTrade ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <span className="text-slate-300 group-hover:text-white transition-colors">Auto Trade Enabled</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isEnabled"
                      checked={formData.isEnabled}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`block w-12 h-6 rounded-full transition-colors ${formData.isEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isEnabled ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <span className="text-slate-300 group-hover:text-white transition-colors">Configuration Active</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 py-3 px-4 text-white rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  editingId 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/30' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/30'
                }`}
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : (editingId ? 'Update Configuration' : 'Save Configuration')}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-5 md:p-6 h-full">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg md:text-xl font-semibold text-white">Active Configurations</h2>
            </div>
            
            {configs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
                <Power className="w-12 h-12 mb-3 opacity-20" />
                <p>No configurations found</p>
                <p className="text-sm mt-1">Create one using the form</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {configs.map((config) => (
                  <div key={config._id} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 md:p-5 hover:border-slate-600 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">{config.pair}</h3>
                          <span className="text-xs font-medium px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md">
                            {config.strategyId}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md ${config.isEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${config.isEnabled ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                            {config.isEnabled ? 'Active' : 'Inactive'}
                          </div>
                          {config.autoTrade && (
                            <div className="text-xs font-medium px-2 py-1 bg-amber-500/20 text-amber-400 rounded-md">
                              Auto-Trade ON
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t border-slate-800 mb-4">
                        <div>
                          <span className="block text-slate-500 mb-1">Time Interval</span>
                          <span className="text-slate-300 font-medium">{config.timeInterval}m</span>
                        </div>
                        <div>
                          <span className="block text-slate-500 mb-1">Risk Amount</span>
                          <span className="text-slate-300 font-medium">{config.riskAmount}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-auto">
                      <button 
                        onClick={() => handleEdit(config)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors border border-slate-700"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(config._id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg text-sm font-medium transition-colors border border-rose-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Configuration;
