import React from 'react';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Zap, 
  Thermometer, 
  Timer, 
  ShieldCheck, 
  Activity,
  AlertOctagon
} from 'lucide-react';
import { useSimulationStore } from '../../simulation/useSimulationStore';

export const BottomControlBar: React.FC = () => {
  const {
    telemetry,
    stage,
    verdict,
    isRunning,
    isEmergencyStopped,
    startSimulation,
    stopSimulation,
    resetSimulation,
  } = useSimulationStore();

  return (
    <div className="border-t border-slate-800 bg-industrial-950/95 backdrop-blur-xl px-4 py-3 z-30 shrink-0 select-none shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col gap-3">
        {/* TOP ROW: Live Telemetry Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* 1. CURRENT */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">CURRENT</span>
                <div className="text-base font-bold font-mono text-cyan-300">
                  {telemetry.current.toFixed(2)} <span className="text-xs text-slate-400">A</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. VOLTAGE */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">VOLTAGE</span>
                <div className="text-base font-bold font-mono text-blue-300">
                  {telemetry.voltage.toFixed(1)} <span className="text-xs text-slate-400">V</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. TEMPERATURE */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">TEMP</span>
                <div className="text-base font-bold font-mono text-amber-300">
                  {telemetry.temperature.toFixed(1)} <span className="text-xs text-slate-400">°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. TRIP TIME */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">TRIP TIME</span>
                <div className="text-base font-bold font-mono text-emerald-300">
                  {telemetry.tripTimeMs > 0 ? (
                    <span>{telemetry.tripTimeMs} <span className="text-xs text-slate-400">ms</span></span>
                  ) : (
                    <span className="text-slate-500">-- ms</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 5. STATUS */}
          <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">STATUS</span>
                <div className="text-xs font-bold font-mono uppercase tracking-wide truncate max-w-[110px]">
                  {isEmergencyStopped ? (
                    <span className="text-rose-400">E-STOP</span>
                  ) : isRunning ? (
                    <span className="text-emerald-400 animate-pulse">STAGE {stage.index}/18</span>
                  ) : verdict === 'PASS' ? (
                    <span className="text-emerald-400">PASS</span>
                  ) : verdict === 'FAIL' ? (
                    <span className="text-rose-400">FAIL</span>
                  ) : (
                    <span className="text-cyan-400">READY</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Action Buttons [ ▶ START ]  [ ■ STOP ]  [ ↻ RESET ] */}
        <div className="flex items-center justify-center gap-4 pt-1">
          {/* START BUTTON */}
          <button
            onClick={startSimulation}
            disabled={isRunning || isEmergencyStopped}
            className={`flex items-center justify-center gap-2.5 px-8 py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition-all shadow-lg min-w-[190px] ${
              isRunning
                ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-300 cursor-not-allowed animate-pulse shadow-glow-emerald'
                : isEmergencyStopped
                ? 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white border border-emerald-400 shadow-emerald-900/40'
            }`}
          >
            {isRunning ? (
              <>
                <Activity className="w-5 h-5 animate-spin" />
                <span>RUNNING...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>START TEST</span>
              </>
            )}
          </button>

          {/* STOP BUTTON */}
          <button
            onClick={() => stopSimulation('Manual operator stop')}
            disabled={!isRunning && !isEmergencyStopped}
            className={`flex items-center justify-center gap-2.5 px-8 py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition-all shadow-lg min-w-[170px] ${
              isRunning || isEmergencyStopped
                ? 'bg-rose-600 hover:bg-rose-500 active:scale-95 text-white border border-rose-400 shadow-glow-rose'
                : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Square className="w-5 h-5 fill-current" />
            <span>STOP</span>
          </button>

          {/* RESET BUTTON */}
          <button
            onClick={resetSimulation}
            disabled={isRunning}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm tracking-wider uppercase transition-all border ${
              isRunning
                ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border-slate-600 hover:border-slate-500'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET</span>
          </button>
        </div>
      </div>
    </div>
  );
};
