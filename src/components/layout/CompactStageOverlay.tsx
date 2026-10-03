import React from 'react';
import { useSimulationStore } from '../../simulation/useSimulationStore';
import { Zap, Thermometer, Activity, ArrowRight } from 'lucide-react';

export const CompactStageOverlay: React.FC = () => {
  const { stage, telemetry, isRunning, verdict, scenario } = useSimulationStore();

  const getPowerPath = () => {
    if (!stage.powerFlowActive) {
      if (stage.index <= 4) return 'Standby & Safety Interlock Loop';
      if (stage.index <= 8) return 'Control Logic & Contactor Trigger';
      return 'Circuit Isolated & De-energized';
    }
    if (scenario.id === 'SHORT_CIRCUIT_HIGH_CURRENT' && stage.id === 'TEST_CONDITION_DEVELOPMENT') {
      return 'Mains → Contactor → MCB → [Downstream Fault Point]';
    }
    return 'Mains → Contactor → MCB → Sensor → Load Coil';
  };

  return (
    <div className="absolute top-4 left-4 z-20 max-w-sm w-full pointer-events-auto select-none animate-fade-in">
      <div className="lab-card rounded-xl p-4 border border-slate-700/60 shadow-2xl">
        {/* Stage Header */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="font-telemetry text-[11px] font-semibold tracking-wider text-teal-400 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Stage {String(stage.index).padStart(2, '0')} / 18
          </span>
          <span className="font-telemetry text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
            {stage.safetyState}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-serif-title text-base font-semibold text-white tracking-tight leading-snug">
          {stage.title}
        </h2>

        {/* Concise explanation of what is happening right now */}
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
          {stage.description}
        </p>

        {/* Live Telemetry Micro-Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center font-telemetry">
          <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800/60">
            <span className="text-[9px] text-slate-400 block uppercase">Current</span>
            <span className="text-xs font-bold text-teal-300">
              {telemetry.current.toFixed(2)} A
            </span>
          </div>
          <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800/60">
            <span className="text-[9px] text-slate-400 block uppercase">Voltage</span>
            <span className="text-xs font-bold text-slate-200">
              {telemetry.voltage.toFixed(1)} V
            </span>
          </div>
          <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800/60">
            <span className="text-[9px] text-slate-400 block uppercase">Temp</span>
            <span className="text-xs font-bold text-amber-300">
              {telemetry.temperature.toFixed(1)} °C
            </span>
          </div>
        </div>

        {/* Power Path Indicator */}
        <div className="mt-2.5 text-[10px] font-telemetry text-slate-400 flex items-center gap-1.5 truncate bg-slate-950/60 px-2 py-1 rounded border border-slate-800/50">
          <Zap className="w-3 h-3 text-teal-400 shrink-0" />
          <span className="truncate">{getPowerPath()}</span>
        </div>
      </div>
    </div>
  );
};
