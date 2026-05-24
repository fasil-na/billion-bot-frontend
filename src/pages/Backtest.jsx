import React, { useState } from 'react';
import axios from 'axios';
import { Play, TrendingUp, BarChart2, Activity, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config/constants';

const Backtest = () => {
  const [formData, setFormData] = useState({
    strategy: 'fvg-imbalance',
    pair: 'B-BTC_USDT',
    interval: '15m',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    riskAmount: '100'
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleBacktest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const payload = {
        strategyId: formData.strategy,
        pair: formData.pair,
        interval: formData.interval,
        startDate: formData.startDate,
        endDate: formData.endDate,
        riskAmount: formData.riskAmount
      };

      const response = await axios.post(`${API_BASE_URL}/market/backtest`, payload);
      setResults(response.data);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'An error occurred during backtesting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-2">
            <Activity className="w-8 h-8 text-indigo-400" />
            Strategy Backtester
          </h1>
          <p className="text-slate-400 mt-2">Test your trading strategies against historical market data.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b border-slate-700 pb-3">
              <RefreshCw className="w-5 h-5 text-purple-400" />
              Parameters
            </h2>

            <form onSubmit={handleBacktest} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Strategy</label>
                <select
                  name="strategy"
                  value={formData.strategy}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none"
                >
                  <option value="fvg-imbalance">Fair Value Gap (FVG)</option>
                  <option value="sma_crossover">SMA Crossover (10, 30)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Trading Pair</label>
                <input
                  type="text"
                  name="pair"
                  value={formData.pair}
                  onChange={handleChange}
                  placeholder="e.g., B-BTC_USDT"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Interval</label>
                <select
                  name="interval"
                  value={formData.interval}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none"
                >
                  <option value="1m">1 Minute</option>
                  <option value="5m">5 Minutes</option>
                  <option value="15m">15 Minutes</option>
                  <option value="1h">1 Hour</option>
                  <option value="4h">4 Hours</option>
                  <option value="1d">1 Day</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-200"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-200"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Risk Amount (USDT)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="number"
                    name="riskAmount"
                    value={formData.riskAmount}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    Run Backtest
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-start gap-3">
                <div className="mt-0.5 font-bold">!</div>
                <p>{error}</p>
              </div>
            )}

            {!results && !loading && !error && (
              <div className="h-full min-h-[400px] bg-slate-800/30 border border-slate-700/50 rounded-2xl flex flex-col items-center justify-center text-slate-500 p-8 border-dashed">
                <BarChart2 className="w-16 h-16 mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-slate-400">Ready to Backtest</h3>
                <p className="text-center mt-2 max-w-md">Configure your strategy parameters on the left and run the backtest to see performance metrics here.</p>
              </div>
            )}

            {results && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-5">
                    <p className="text-slate-400 text-sm font-medium mb-1">Real Trades PnL</p>
                    <p className={`text-2xl font-bold ${results.dailyPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${(results.dailyPnl || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-5">
                    <p className="text-slate-400 text-sm font-medium mb-1">Simulated Daily PnL</p>
                    <p className={`text-2xl font-bold ${results.simulatedTrades?.reduce((a, t) => a + (t.profit || 0), 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${(results.simulatedTrades?.reduce((a, t) => a + (t.profit || 0), 0) || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-5">
                    <p className="text-slate-400 text-sm font-medium mb-1">Real Executed Trades</p>
                    <p className="text-2xl font-bold mt-2 text-indigo-400">
                      {results.tradesCount || 0}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-5">
                    <p className="text-slate-400 text-sm font-medium mb-1">Win Rate</p>
                    <p className="text-2xl font-bold mt-2 text-indigo-400">
                      {results.simulatedTrades ? results.simulatedTrades.length : 0}
                    </p>
                  </div>
                </div>

                {/* Trade Log */}
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-xl overflow-hidden flex flex-col h-[500px]">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Trade Execution Log ({(results.simulatedTrades || []).length} Trades)
                  </h3>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {!(results.simulatedTrades && results.simulatedTrades.length > 0) ? (
                      <div className="h-full flex items-center justify-center text-slate-500">
                        No trades executed in this period.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(results.simulatedTrades || []).map((trade, idx) => (
                          <div key={idx} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${trade.direction === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                {trade.direction === 'buy' ? 'L' : 'S'}
                              </div>
                              <div>
                                <p className="font-semibold">{trade.direction === 'buy' ? 'LONG' : 'SHORT'}</p>
                                <p className="text-xs text-slate-400">{new Date(trade.entryTime || trade.time).toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-200">Entry: ${trade.entryPrice ? trade.entryPrice.toFixed(4) : trade.price.toFixed(4)}</p>
                              <p className="text-sm font-medium text-slate-400">Exit: ${trade.exitPrice?.toFixed(4)}</p>
                              <p className={`text-sm font-semibold mt-1 ${(trade.profit || trade.pnl) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {(trade.profit || trade.pnl) >= 0 ? '+' : ''}{(trade.profit || trade.pnl).toFixed(2)} USDT
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backtest;
