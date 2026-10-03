import React, { useState } from 'react';
import { Download, Terminal, Search, Trash2 } from 'lucide-react';
import { useSimulationStore } from '../../simulation/useSimulationStore';
import { LogEvent } from '../../types/simulation';

export const EventLogsView: React.FC = () => {
  const { logs } = useSimulationStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportLogsAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mcb-test-logs-${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getLevelBadge = (level: LogEvent['level']) => {
    switch (level) {
      case 'SUCCESS':
        return <span className="text-emerald-400 font-bold">[OK]</span>;
      case 'DANGER':
        return <span className="text-rose-400 font-bold">[FAIL]</span>;
      case 'WARN':
        return <span className="text-amber-400 font-bold">[WARN]</span>;
      case 'TELEMETRY':
        return <span className="text-blue-400 font-bold">[DATA]</span>;
      case 'INFO':
      default:
        return <span className="text-cyan-400 font-bold">[INFO]</span>;
    }
  };

  return (
    <div className="p-4 space-y-3 flex flex-col h-full overflow-hidden">
      {/* Search & Export Toolbar */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search event logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
        <button
          onClick={exportLogsAsJSON}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500 transition-colors shrink-0"
          title="Export Logs JSON"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Real-time Log Stream Container */}
      <div className="flex-1 overflow-y-auto rounded-lg bg-slate-950/90 border border-slate-800 p-3 font-mono text-xs space-y-2">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 text-center py-8">No log events recorded.</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="leading-relaxed border-b border-slate-900/80 pb-1.5 last:border-0">
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span>{log.timestamp}</span>
                {getLevelBadge(log.level)}
                <span className="text-slate-400 font-semibold">{log.source}</span>
                {log.stageIndex && (
                  <span className="text-slate-600">S{log.stageIndex}</span>
                )}
              </div>
              <div className="text-slate-300 text-[11px] mt-0.5">{log.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
