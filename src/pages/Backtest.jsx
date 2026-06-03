import React, { useState } from 'react';
import axios from 'axios';
import { Play, TrendingUp, BarChart2, Activity, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config/constants';

const STATIC_INSTRUMENTS = {
  'B-BTC_USDT': { maxLeverage: 20, qtyStep: 0.001, priceStep: 0.1, minNotional: 6 },
  'B-SUSHI_USDT': { maxLeverage: 10, qtyStep: 1, priceStep: 0.0001, minNotional: 6 },
  'B-XAU_USDT': { maxLeverage: 20, qtyStep: 0.01, priceStep: 0.01, minNotional: 6 },
  'SUSHIUSDT': { maxLeverage: 10, qtyStep: 1, priceStep: 0.0001, minNotional: 6 },
  'B-ETH_USDT': { maxLeverage: 20, qtyStep: 0.001, priceStep: 0.1, minNotional: 6 },
};

const instrumentKeys = Object.keys(STATIC_INSTRUMENTS);

const Backtest = () => {
  const [formData, setFormData] = useState({
    strategy: 'fvg-imbalance',
    pair: 'B-BTC_USDT',
    interval: '15m',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    riskAmount: '100',
    session: 'london'
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    let newFormData = { ...formData, [e.target.name]: e.target.value };
    if (
      (e.target.name === 'session' || e.target.name === 'strategy') &&
      newFormData.strategy === 'opening-breakout' &&
      newFormData.session === 'gold'
    ) {
      newFormData.pair = 'B-XAU_USDT';
    }
    setFormData(newFormData);
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
        riskAmount: formData.riskAmount,
        ...(formData.strategy === 'opening-breakout' && { session: formData.session })
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

  const availablePairs = formData.strategy === 'opening-breakout' && formData.session === 'gold' 
    ? ['B-XAU_USDT'] 
    : instrumentKeys;

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
                  <option value="opening-breakout">Opening Breakout</option>
                  <option value="fvg-imbalance">Fair Value Gap (FVG)</option>
                  <option value="sma_crossover">SMA Crossover (10, 30)</option>
                </select>
              </div>

              {formData.strategy === 'opening-breakout' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Session</label>
                  <select
                    name="session"
                    value={formData.session}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none"
                  >
                    <option value="asia">Asia Opening</option>
                    <option value="london">London Opening</option>
                    <option value="newyork">New York Opening</option>
                    <option value="gold">Gold Opening</option>
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Trading Pair</label>
                <select
                  name="pair"
                  value={formData.pair}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none"
                >
                  {availablePairs.map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-5">
                    <p className="text-slate-400 text-sm font-medium mb-1">Simulated Daily PnL</p>
                    <p className={`text-2xl font-bold ${results.simulatedTrades?.reduce((a, t) => a + (t.profit || 0), 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${(results.simulatedTrades?.reduce((a, t) => a + (t.profit || 0), 0) || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-5">
                    <p className="text-slate-400 text-sm font-medium mb-1">Win Rate</p>
                    <p className="text-2xl font-bold mt-2 text-indigo-400">
                      {results.simulatedTrades && results.simulatedTrades.length > 0
                        ? `${((results.simulatedTrades.filter(t => (t.profit || t.pnl) > 0).length / results.simulatedTrades.length) * 100).toFixed(1)}%`
                        : '0%'}
                    </p>
                    {results.simulatedTrades && results.simulatedTrades.length > 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        <span className="text-emerald-400">{results.simulatedTrades.filter(t => (t.profit || t.pnl) > 0).length}W</span> /
                        <span className="text-rose-400 ml-1">{results.simulatedTrades.filter(t => (t.profit || t.pnl) <= 0).length}L</span>
                      </p>
                    )}
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
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">{trade.direction === 'buy' ? 'LONG' : 'SHORT'}</p>
                                  {trade.quantity && (
                                    <span className="text-[10px] font-medium bg-slate-700/50 text-slate-300 px-1.5 py-0.5 rounded">
                                      Qty: {trade.quantity.toFixed(4)}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
                                  <p>In: {new Date(trade.entryTime || trade.time).toLocaleString()}</p>
                                  {trade.exitTime && <p>Out: {new Date(trade.exitTime).toLocaleString()}</p>}
                                </div>
                                {(trade.dayHigh !== undefined && trade.dayLow !== undefined) && (
                                  <div className="flex gap-2 mt-1.5 text-[10px] font-medium">
                                    <span className="text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded">H: {trade.dayHigh.toFixed(2)}</span>
                                    <span className="text-rose-400/80 bg-rose-500/10 px-1.5 py-0.5 rounded">L: {trade.dayLow.toFixed(2)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-200">Entry: ${trade.entryPrice ? trade.entryPrice.toFixed(4) : trade.price.toFixed(4)}</p>
                              {(trade.tp || trade.sl) && (
                                <div className="flex justify-end gap-2 mt-0.5 text-[10px]">
                                  {trade.tp && <span className="text-emerald-400/80">TP: {trade.tp.toFixed(4)}</span>}
                                  {trade.sl && <span className="text-rose-400/80">SL: {trade.sl.toFixed(4)}</span>}
                                </div>
                              )}
                              <p className="text-sm font-medium text-slate-400 mt-0.5">Exit: ${trade.exitPrice?.toFixed(4)}</p>
                              <p className={`text-sm font-semibold mt-1 ${(trade.profit ?? trade.pnl ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {(trade.profit ?? trade.pnl ?? 0) >= 0 ? '+' : ''}{(trade.profit ?? trade.pnl ?? 0).toFixed(2)} USDT
                              </p>
                              {trade.reason && (
                                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{trade.reason}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Formed FVGs Panel */}
                {formData.strategy === 'fvg-imbalance' && results.indicators && results.indicators.fvgs && (
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-xl overflow-hidden flex flex-col mt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-indigo-400" />
                      All Formed FVGs ({results.indicators.fvgs.length})
                    </h3>

                    <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[300px]">
                      {results.indicators.fvgs.length === 0 ? (
                        <div className="py-4 text-center text-slate-500">
                          No FVGs were formed during this period.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {[...results.indicators.fvgs].sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime()).map((fvg, idx) => {
                            const midpoint = (fvg.top + fvg.bottom) / 2;
                            return (
                              <div key={idx} className={`border rounded-xl p-4 flex items-center justify-between transition-colors ${fvg.filled ? 'bg-slate-900/30 border-slate-800/50 opacity-70' : 'bg-slate-900/80 border-slate-600 shadow-md hover:bg-slate-800'}`}>
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${fvg.direction === 'bullish' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                    {fvg.direction === 'bullish' ? 'B' : 'S'}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold">{fvg.direction === 'bullish' ? 'BULLISH FVG' : 'BEARISH FVG'}</p>
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${!fvg.filled
                                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse' // Highlight Active
                                        : fvg.status === 'trade_executed'
                                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                          : (fvg.status === 'skipped' || fvg.rejectReason)
                                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30' // Expired in red
                                        }`}>
                                        {!fvg.filled ? 'ACTIVELY WAITING' :
                                          fvg.status === 'trade_executed' ? 'TRADE EXECUTED' :
                                            fvg.status === 'cancelled' ? 'CANCELLED' :
                                              (fvg.status === 'skipped' || fvg.rejectReason) ? `REJECTED (${fvg.rejectReason || 'RISK LIMIT'})` :
                                                'EXPIRED'}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Formed: {new Date(fvg.endTime).toLocaleString()}</p>
                                    {fvg.filled && fvg.filledAt && (
                                      <p className="text-[10px] text-slate-500">Ended: {new Date(fvg.filledAt).toLocaleString()}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-slate-200">Midpoint: <span className="text-indigo-400 font-bold">${midpoint.toFixed(4)}</span></p>
                                  <p className="text-xs text-slate-400 mt-1">Range: {fvg.bottom.toFixed(2)} - {fvg.top.toFixed(2)}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backtest;
