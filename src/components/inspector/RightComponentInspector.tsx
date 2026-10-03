import React, { useEffect } from 'react';
import {
  X,
  Info,
  Sliders,
  Zap,
  ShieldAlert,
  Radio,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { PROTOTYPE_COMPONENTS } from '../../data/componentsData';
import { ComponentMetadata } from '../../types/components';
import { useSimulationStore } from '../../simulation/useSimulationStore';

export const RightComponentInspector: React.FC = () => {
  const {
    selectedComponentId,
    componentStates,
    selectComponent
  } = useSimulationStore();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectComponent(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectComponent]);

  if (!selectedComponentId) return null;

  const component: ComponentMetadata | undefined = PROTOTYPE_COMPONENTS[selectedComponentId];
  if (!component) return null;

  const liveState = componentStates[component.id];
  const status = liveState?.status || component.status;
  const currentV = liveState?.voltage ?? component.liveMetrics.voltage ?? 0;
  const currentI = liveState?.current ?? component.liveMetrics.current ?? 0;
  const currentT = liveState?.temp ?? component.liveMetrics.temperature ?? 26.5;

  const getStatusBadge = () => {
    switch (status) {
      case 'ENERGIZED':
      case 'ACTIVE':
        return (
          <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/40 text-[11px] font-telemetry font-bold">
            ● ACTIVE
          </span>
        );
      case 'TRIPPED':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-[11px] font-telemetry font-bold">
            ● TRIPPED / SAFE
          </span>
        );
      case 'FAULT':
      case 'OVERHEATED':
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40 text-[11px] font-telemetry font-bold">
            ● FAULT
          </span>
        );
      case 'ISOLATED':
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-telemetry">
            ● ISOLATED
          </span>
        );
      case 'READY':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-telemetry font-medium">
            ● READY
          </span>
        );
    }
  };

  return (
    <aside
      className="absolute top-4 right-4 bottom-24 w-92 max-w-[calc(100vw-2rem)] z-30 flex flex-col lab-card rounded-2xl border border-slate-700/70 shadow-2xl overflow-hidden animate-fade-in pointer-events-auto select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-telemetry uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-slate-300">
            {component.subsystem}
          </span>
          {getStatusBadge()}
        </div>
        <button
          onClick={() => selectComponent(null)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Inspector (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-slate-300 text-xs">
        {/* Title */}
        <div>
          <h3 className="font-serif-title text-base font-bold text-white tracking-tight leading-snug">
            {component.name}
          </h3>
          <p className="text-[11px] text-teal-300/80 font-telemetry mt-0.5">
            {component.type}
          </p>
        </div>

        {/* Live State Box */}
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-telemetry text-slate-400 border-b border-slate-800/80 pb-1">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Radio className="w-3 h-3 text-teal-400" />
              <span>Live State</span>
            </span>
            <span className="text-[10px] text-teal-400 font-mono">Real-time</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center font-telemetry">
            <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800/70">
              <span className="text-[9px] text-slate-400 block uppercase">Voltage</span>
              <span className="text-xs font-bold text-slate-200">{currentV.toFixed(1)} V</span>
            </div>
            <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800/70">
              <span className="text-[9px] text-slate-400 block uppercase">Current</span>
              <span className="text-xs font-bold text-teal-300">{currentI.toFixed(2)} A</span>
            </div>
            <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800/70">
              <span className="text-[9px] text-slate-400 block uppercase">Temp</span>
              <span className="text-xs font-bold text-amber-300">{currentT.toFixed(1)} °C</span>
            </div>
          </div>

          <div className="text-[11px] font-telemetry text-slate-300 bg-slate-950/70 p-2 rounded border border-slate-800/60">
            <span className="text-slate-500">Operating State: </span>
            <span className="text-slate-200 font-medium">{liveState?.stateText || 'Nominal Operation'}</span>
          </div>
        </div>

        {/* Function */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-telemetry tracking-wider text-slate-400 flex items-center gap-1">
            <Info className="w-3 h-3 text-teal-400" />
            <span>Function</span>
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
            {component.purpose}
          </p>
        </div>

        {/* Technical Information */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-telemetry tracking-wider text-slate-400 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-teal-400" />
            <span>Technical Information</span>
          </span>
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 divide-y divide-slate-800/60 text-[11px] font-telemetry">
            {Object.entries(component.technicalSpecs).map(([key, val]) => (
              <div key={key} className="p-2 flex items-start justify-between gap-2">
                <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="text-slate-200 text-right font-medium">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Test Role */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-telemetry tracking-wider text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Test Role</span>
          </span>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60 font-sans">
            {component.testRelevance}
          </p>
        </div>

        {/* Safety & Failure Scenarios */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-telemetry tracking-wider text-rose-400 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Safety Role & Failure Scenarios</span>
          </span>
          <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs text-rose-200/90 leading-relaxed font-sans">
            {component.safetyConsiderations}
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            {component.failureModes.map((fm, i) => (
              <span
                key={i}
                className="text-[10px] font-telemetry px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
              >
                • {fm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
