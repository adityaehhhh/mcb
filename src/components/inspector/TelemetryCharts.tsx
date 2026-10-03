import React, { useState } from 'react';
import { Activity, Zap, Thermometer, Gauge } from 'lucide-react';
import { useSimulationStore } from '../../simulation/useSimulationStore';

export const TelemetryCharts: React.FC = () => {
  const { telemetryHistory, telemetry, scenario } = useSimulationStore();
  const [activeChart, setActiveChart] = useState<'CURRENT' | 'VOLTAGE' | 'TEMP' | 'POWER'>('CURRENT');

  // SVG Chart Dimensions
  const width = 340;
  const height = 150;
  const padding = 28;

  // Extract series data based on active chart
  const data = telemetryHistory.map((pt, idx) => ({
    x: idx,
    y: activeChart === 'CURRENT' ? pt.current 
      : activeChart === 'VOLTAGE' ? pt.voltage 
      : activeChart === 'TEMP' ? pt.temperature 
      : pt.power
  }));

  const yMax = Math.max(
    activeChart === 'CURRENT' ? Math.max(30, scenario.targetCurrentA * 1.2)
    : activeChart === 'VOLTAGE' ? 260
    : activeChart === 'TEMP' ? 70
    : 10,
    ...data.map((d) => d.y)
  );

  const yMin = activeChart === 'VOLTAGE' ? 180 : 0;

  // Build SVG Path
  const pointsString = data
    .map((d, i) => {
      const x = padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
      const normalizedY = (d.y - yMin) / Math.max(1, yMax - yMin);
      const y = height - padding - normalizedY * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const areaString = data.length > 0 
    ? `${pointsString} ${width - padding},${height - padding} ${padding},${height - padding}`
    : '';

  const chartColor = 
    activeChart === 'CURRENT' ? '#00f2fe'
    : activeChart === 'VOLTAGE' ? '#38bdf8'
    : activeChart === 'TEMP' ? '#f59e0b'
    : '#10b981';

  return (
    <div className="p-4 space-y-4">
      {/* Chart Switcher Buttons */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
        <button
          onClick={() => setActiveChart('CURRENT')}
          className={`py-1.5 rounded text-[11px] font-mono font-semibold transition-all ${
            activeChart === 'CURRENT' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Current (A)
        </button>
        <button
          onClick={() => setActiveChart('VOLTAGE')}
          className={`py-1.5 rounded text-[11px] font-mono font-semibold transition-all ${
            activeChart === 'VOLTAGE' ? 'bg-blue-500/20 text-blue-300 border border-blue-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Voltage (V)
        </button>
        <button
          onClick={() => setActiveChart('TEMP')}
          className={`py-1.5 rounded text-[11px] font-mono font-semibold transition-all ${
            activeChart === 'TEMP' ? 'bg-amber-500/20 text-amber-300 border border-amber-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Temp (°C)
        </button>
        <button
          onClick={() => setActiveChart('POWER')}
          className={`py-1.5 rounded text-[11px] font-mono font-semibold transition-all ${
            activeChart === 'POWER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Power (kW)
        </button>
      </div>

      {/* SVG Interactive Line Chart Card */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {activeChart === 'CURRENT' && <Zap className="w-4 h-4 text-cyan-400" />}
            {activeChart === 'VOLTAGE' && <Activity className="w-4 h-4 text-blue-400" />}
            {activeChart === 'TEMP' && <Thermometer className="w-4 h-4 text-amber-400" />}
            {activeChart === 'POWER' && <Gauge className="w-4 h-4 text-emerald-400" />}
            <span className="text-xs font-bold font-mono text-slate-200 uppercase">
              {activeChart} vs Time (Live Stream)
            </span>
          </div>
          <span className="text-xs font-mono font-bold" style={{ color: chartColor }}>
            {activeChart === 'CURRENT' ? `${telemetry.current.toFixed(2)} A`
              : activeChart === 'VOLTAGE' ? `${telemetry.voltage.toFixed(1)} V`
              : activeChart === 'TEMP' ? `${telemetry.temperature.toFixed(1)} °C`
              : `${telemetry.power.toFixed(2)} kW`}
          </span>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          <defs>
            <linearGradient id={`chart-grad-${activeChart}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={chartColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1e293b" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#1e293b" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" />

          {/* Y Axis Labels */}
          <text x={padding - 6} y={padding + 4} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
            {yMax.toFixed(0)}
          </text>
          <text x={padding - 6} y={height / 2 + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
            {((yMax + yMin) / 2).toFixed(0)}
          </text>
          <text x={padding - 6} y={height - padding + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
            {yMin.toFixed(0)}
          </text>

          {/* Area Fill */}
          {data.length > 1 && (
            <polygon points={areaString} fill={`url(#chart-grad-${activeChart})`} />
          )}

          {/* Line Stroke */}
          {data.length > 1 && (
            <polyline
              fill="none"
              stroke={chartColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsString}
            />
          )}

          {/* Current Live Pulse Dot */}
          {data.length > 0 && (
            <circle
              cx={width - padding}
              cy={height - padding - ((data[data.length - 1].y - yMin) / Math.max(1, yMax - yMin)) * (height - padding * 2)}
              r="4.5"
              fill={chartColor}
              className="animate-ping"
            />
          )}
        </svg>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
          <span>T - 60s window</span>
          <span>Sampling @ 20Hz True-RMS</span>
          <span>Live Telemetry</span>
        </div>
      </div>

      {/* Telemetry Statistics Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Peak Recorded</span>
          <span className="text-sm font-bold font-mono text-slate-200">
            {Math.max(...data.map(d => d.y), 0).toFixed(2)}
          </span>
        </div>
        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Test Multiplier</span>
          <span className="text-sm font-bold font-mono text-cyan-300">
            {scenario.multiplierIn}× In
          </span>
        </div>
      </div>
    </div>
  );
};
