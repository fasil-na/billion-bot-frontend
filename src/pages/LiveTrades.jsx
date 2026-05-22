import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import { API_BASE_URL, SOCKET_URL } from '../config/constants';

const LiveTrades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrades();

    // Listen to real-time updates
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socket.on('trade-history-update', (updatedTrade) => {
      setTrades((prevTrades) => {
        // If trade exists, update it. Else, add it to top.
        const exists = prevTrades.find(t => t._id === updatedTrade._id);
        if (exists) {
          return prevTrades.map(t => t._id === updatedTrade._id ? updatedTrade : t);
        } else {
          return [updatedTrade, ...prevTrades];
        }
      });
    });

    return () => socket.disconnect();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trades`);
      setTrades(response.data);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'closed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-slate-400" />;
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Live Trades</h1>
          <p className="text-slate-400 text-sm md:text-base">Monitor real-time automated trade executions.</p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-slate-400">Loading trades...</div>
        ) : trades.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-900/30">
            <Activity className="w-12 h-12 mb-3 opacity-20" />
            <p>No live trades found</p>
            <p className="text-sm mt-1">Enable auto-trade in your configurations to start trading.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Pair / Strategy</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Direction</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Entry</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Exit</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Profit (PnL%)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {trades.map((trade) => (
                  <tr key={trade._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{trade.pair}</div>
                      <div className="text-xs text-slate-400">{trade.strategyId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${trade.direction === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                        {trade.direction === 'buy' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {trade.direction.toUpperCase()}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{trade.qty} QTY | {trade.leverage}x</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">${trade.entryPrice?.toFixed(4) || '-'}</div>
                      <div className="text-xs text-slate-500">{formatDate(trade.entryTime)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{trade.exitPrice ? `$${trade.exitPrice.toFixed(4)}` : '-'}</div>
                      <div className="text-xs text-slate-500">{trade.exitTime ? formatDate(trade.exitTime) : '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-medium ${trade.profit > 0 ? 'text-emerald-400' : trade.profit < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                        {trade.profit ? `$${trade.profit.toFixed(2)}` : '-'}
                      </div>
                      {trade.pnlPercent && (
                        <div className={`text-xs ${trade.pnlPercent > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {trade.pnlPercent.toFixed(2)}%
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-1.5 capitalize text-sm text-slate-300">
                          {getStatusIcon(trade.status)}
                          {trade.status}
                        </div>
                        {trade.exitReason && (
                          <div className="text-xs text-slate-500 max-w-[120px] truncate" title={trade.exitReason}>
                            {trade.exitReason}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTrades;
