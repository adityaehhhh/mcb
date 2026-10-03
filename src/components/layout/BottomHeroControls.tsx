import React from 'react';
import {
  Play,
  Square,
  RotateCcw,
  Eye,
  Layers,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import { useSimulationStore, CameraPreset } from '../../simulation/useSimulationStore';

export const BottomHeroControls: React.FC = () => {
  const {
    stage,
    verdict,
    isRunning,
    isEmergencyStopped,
    cameraPreset,
    viewMode,
    startSimulation,
    stopSimulation,
    resetSimulation,
    setCameraPreset,
    setViewMode,
  } = useSimulationStore();

  const getStageDisplay = () => {
    if (isEmergencyStopped) {
      return (
        <span className="flex items-center gap-1.5 text-rose-400 font-telemetry text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5" /> E-STOP TRIPPED
        </span>
      );
    }
    if (verdict === 'FAULT') {
      return (
        <span className="flex items-center gap-1.5 text-rose-400 font-telemetry text-xs font-bold animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> ⚠ FAULT LOCATED
        </span>
      );
    }
    if (verdict === 'ABORTED' || verdict === 'STOPPED') {
      return (
        <span className="flex items-center gap-1.5 text-amber-400 font-telemetry text-xs font-bold">
          <AlertTriangle className="w-3.5 h-3.5" /> ⚠ TEST HALTED
        </span>
      );
    }
    if (verdict === 'PASS') {
      return (
        <span className="flex items-center gap-1.5 text-emerald-400 font-telemetry text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" /> PASS VERIFIED
        </span>
      );
    }
    if (verdict === 'FAIL') {
      return (
        <span className="flex items-center gap-1.5 text-rose-400 font-telemetry text-xs font-bold">
          <XCircle className="w-3.5 h-3.5" /> FAIL
        </span>
      );
    }
    if (isRunning) {
      return (
        <span className="flex items-center gap-1.5 text-teal-300 font-telemetry text-xs font-semibold truncate max-w-[200px]">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping shrink-0" />
          <span className="truncate">{stage.title.toUpperCase()}</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-slate-400 font-telemetry text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> READY
      </span>
    );
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-3xl px-4 pointer-events-auto select-none">
      <div className="lab-card rounded-2xl px-4 py-2 border border-slate-700/60 shadow-2xl flex items-center justify-between gap-2.5">
        {/* Left: View Angles & Visualization Modes */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-xl border border-slate-800/80 text-xs font-telemetry">
          {(['DEFAULT', 'FRONT', 'TOP', 'MCB'] as CameraPreset[]).map((preset) => (
            <button
              key={preset}
              onClick={() => setCameraPreset(preset)}
              className={`px-2 py-1 rounded-lg transition-all ${
                cameraPreset === preset
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset === 'DEFAULT' ? 'Perspective' : preset}
            </button>
          ))}

          <div className="h-3.5 w-px bg-slate-700 mx-0.5" />

          <button
            onClick={() => setViewMode(viewMode === 'XRAY' ? 'DEFAULT' : 'XRAY')}
            className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
              viewMode === 'XRAY'
                ? 'bg-teal-900/60 text-teal-300 border border-teal-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle X-Ray"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">X-Ray</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'EXPLODED' ? 'DEFAULT' : 'EXPLODED')}
            className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
              viewMode === 'EXPLODED'
                ? 'bg-teal-900/60 text-teal-300 border border-teal-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Exploded View"
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">Exploded</span>
          </button>
        </div>

        {/* Center: Main Primary Controls [ ▶ START ]  [ ■ STOP ]  [ ↻ RESET ] */}
        <div className="flex items-center gap-1.5">
          {/* START */}
          <button
            onClick={startSimulation}
            disabled={isRunning || isEmergencyStopped}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-telemetry font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
              isRunning
                ? 'bg-teal-950/60 border border-teal-700/60 text-teal-300 cursor-not-allowed opacity-80'
                : isEmergencyStopped
                ? 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-500 active:scale-95 text-slate-950 border border-teal-400 shadow-teal-950/40'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start</span>
          </button>

          {/* STOP */}
          <button
            onClick={() => stopSimulation('Manual operator stop')}
            disabled={!isRunning && !isEmergencyStopped}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-telemetry font-semibold text-xs uppercase tracking-wider transition-all border ${
              isRunning || isEmergencyStopped
                ? 'bg-rose-900/70 hover:bg-rose-800 text-rose-100 border-rose-600 active:scale-95'
                : 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop</span>
          </button>

          {/* RESET */}
          <button
            onClick={resetSimulation}
            disabled={isRunning}
            className={`p-1.5 rounded-xl font-telemetry text-xs transition-all border ${
              isRunning
                ? 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-white active:scale-95'
            }`}
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Stage / Status Line */}
        <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800/80">
          {getStageDisplay()}
        </div>
      </div>
    </div>
  );
};
