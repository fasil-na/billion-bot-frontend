import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, Server, Info, Search, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../config/constants';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async (pageNum) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/logs?page=${pageNum}&limit=50`);
      if (!res.ok) throw new Error('Failed to fetch logs');
      const data = await res.json();
      setLogs(data.logs);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearAllLogs = async () => {
    if (!window.confirm('Are you sure you want to delete all system logs? This cannot be undone.')) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/logs`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to clear logs');
      setLogs([]);
      setTotalPages(1);
      setPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchLogs(1);
  }, []);

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'error': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'info': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              System Logs
            </h1>
            <p className="text-slate-400 mt-1 text-sm md:text-base">
              Monitor application errors and system events
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearAllLogs}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear Logs</span>
            </button>
            <button
              onClick={() => fetchLogs(page)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
            >
              Refresh Logs
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-semibold border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Level</th>
                  <th className="px-6 py-4">Context</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                      Loading logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                      No logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4 text-slate-300">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-500" />
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-medium">
                        {log.context}
                      </td>
                      <td className="px-6 py-4 text-slate-300 truncate max-w-xs" title={log.message}>
                        {log.message}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {log.data ? (
                          <div className="max-w-[200px] truncate" title={JSON.stringify(log.data)}>
                            {JSON.stringify(log.data)}
                          </div>
                        ) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-700 flex items-center justify-between bg-slate-900/30">
              <button
                disabled={page === 1}
                onClick={() => fetchLogs(page - 1)}
                className="px-4 py-2 bg-slate-800 disabled:opacity-50 text-white rounded-lg text-sm transition-colors hover:bg-slate-700"
              >
                Previous
              </button>
              <span className="text-slate-400 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => fetchLogs(page + 1)}
                className="px-4 py-2 bg-slate-800 disabled:opacity-50 text-white rounded-lg text-sm transition-colors hover:bg-slate-700"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logs;
