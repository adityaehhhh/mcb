import React from 'react';
import { Minimize2, Play, Square, Activity, Zap, Thermometer, ShieldCheck } from 'lucide-react';
import { useSimulationStore } from '../../simulation/useSimulationStore';

export const PresentationOverlay: React.FC = () => {
  const {
    viewMode,
    stage,
    scenario,
    telemetry,
    isRunning,
    verdict,
    setViewMode,
    startSimulation,
    stopSimulation,
  } = useSimulationStore();

  if (viewMode !== 'PRESENTATION') return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-between p-6 animate-fadeIn">
      {/* Top Demo HUD */}
      <div className="flex items-start justify-between">
        <div className="p-4 rounded-xl bg-slate-950/85 border border-slate-700/80 backdrop-blur-xl shadow-2xl pointer-events-auto max-w-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-800">
              JUDGE DEMO MODE
            </span>
            <span className="text-xs font-mono text-slate-400">IS/IEC 60898-1 Simulation</span>
          </div>
          <h2 className="text-base font-bold text-white">
            {scenario.name}
          </h2>
          <div className="mt-2 text-xs font-mono text-cyan-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>STAGE {stage.index}/18: {stage.title}</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {stage.description}
          </p>
        </div>

        {/* Exit Demo Mode Button */}
        <button
          onClick={() => setViewMode('DEFAULT')}
          className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 backdrop-blur-xl shadow-2xl pointer-events-auto flex items-center gap-2 text-xs font-mono font-bold transition-all"
        >
          <Minimize2 className="w-4 h-4" />
          <span>Exit Demo View</span>
        </button>
      </div>

      {/* Floating telemetry summary badge */}
      <div className="self-center p-3 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-xl shadow-2xl pointer-events-auto flex items-center gap-6 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Current: <strong className="text-cyan-300">{telemetry.current.toFixed(2)} A</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <span>Voltage: <strong className="text-blue-300">{telemetry.voltage.toFixed(1)} V</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-amber-400" />
          <span>Temp: <strong className="text-amber-300">{telemetry.temperature.toFixed(1)} °C</strong></span>
        </div>
      </div>
    </div>
  );
};
