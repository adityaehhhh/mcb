import React from 'react';
import {
  X,
  Info,
  Sliders,
  Zap,
  ShieldAlert,
  Radio,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Activity,
  Layers
} from 'lucide-react';
import { PROTOTYPE_COMPONENTS } from '../../data/componentsData';
import { ComponentMetadata } from '../../types/components';
import { useSimulationStore } from '../../simulation/useSimulationStore';

export const ContextualComponentModal: React.FC = () => {
  const {
    selectedComponentId,
    componentStates,
    stage,
    scenario,
    selectComponent
  } = useSimulationStore();

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
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 text-xs font-telemetry font-bold animate-pulse">
            ● Active / Energized
          </span>
        );
      case 'TRIPPED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-xs font-telemetry font-bold">
            ● Tripped / Isolated (Safe)
          </span>
        );
      case 'FAULT':
      case 'OVERHEATED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40 text-xs font-telemetry font-bold">
            ● Fault Condition
          </span>
        );
      case 'ISOLATED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-telemetry">
            ● De-energized / Isolated
          </span>
        );
      case 'READY':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/40 text-xs font-telemetry font-bold">
            ● Ready
          </span>
        );
    }
  };

  // Stage relevance explanation
  const getStageBehavior = () => {
    const isActive = stage.activeComponentIds.includes(component.id);
    const isEnergized = stage.energizedComponents.includes(component.id);

    if (component.id === 'mcb_bank') {
      if (stage.id === 'TEST_CONDITION_DEVELOPMENT') {
        return scenario.id === 'SHORT_CIRCUIT_HIGH_CURRENT'
          ? 'Magnetic flux buildup in solenoid coil responding to downstream current surge.'
          : 'Bimetal strip heating and expanding under continuous overcurrent draw.';
      }
      if (stage.id === 'MCB_RESPONSE' || stage.id === 'TRIP_DETECTION') {
        return 'Trip latch disengages, moving contact separates rapidly, arc chutes quench plasma, and toggle snaps to OFF.';
      }
      if (stage.id === 'CIRCUIT_ISOLATION') {
        return 'Contacts fully open and isolated. Downstream test circuit de-energized.';
      }
    }

    if (isActive) {
      return `Currently active in Stage ${stage.index} (${stage.title}): ${stage.description}`;
    }
    if (isEnergized) {
      return `Energized in the active test loop under stage conditions.`;
    }
    return `In standby state during Stage ${stage.index}.`;
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-end p-4 md:p-6 bg-black/40 backdrop-blur-sm pointer-events-auto select-none animate-fade-in"
      onClick={() => selectComponent(null)}
    >
      <div
        className="w-full max-w-md max-h-[90vh] lab-card rounded-2xl border border-slate-700/60 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-telemetry uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
              {component.subsystem}
            </span>
            {getStatusBadge()}
          </div>
          <button
            onClick={() => selectComponent(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Component Name & Type */}
          <div>
            <h3 className="font-serif-title text-lg font-bold text-white tracking-tight leading-snug">
              {component.name}
            </h3>
            <p className="text-xs text-slate-400 font-telemetry mt-0.5">
              {component.type}
            </p>
          </div>

          {/* Live Telemetry Box */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-telemetry text-slate-400 border-b border-slate-800 pb-1.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Radio className="w-3.5 h-3.5 text-teal-400" />
                <span>Live Component State</span>
              </span>
              <span className="text-teal-400 text-[10px]">Active</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-telemetry">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <span className="text-[9px] text-slate-400 block uppercase">Voltage</span>
                <span className="text-xs font-bold text-slate-200">{currentV.toFixed(1)} V</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <span className="text-[9px] text-slate-400 block uppercase">Current</span>
                <span className="text-xs font-bold text-teal-300">{currentI.toFixed(2)} A</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <span className="text-[9px] text-slate-400 block uppercase">Temp</span>
                <span className="text-xs font-bold text-amber-300">{currentT.toFixed(1)} °C</span>
              </div>
            </div>

            <div className="text-[11px] font-telemetry text-slate-300 bg-slate-950/70 p-2 rounded border border-slate-800/60">
              <span className="text-slate-500">Operating State: </span>
              <span>{liveState?.stateText || 'Standby'}</span>
            </div>
          </div>

          {/* What is it & What does it do? */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-telemetry tracking-wider text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 text-teal-400" />
              <span>What is it & What does it do?</span>
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
              {component.purpose}
            </p>
          </div>

          {/* What happens to it during this stage? */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-telemetry tracking-wider text-teal-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-teal-400" />
              <span>What happens to it during this stage?</span>
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans bg-teal-950/20 p-3 rounded-xl border border-teal-900/40">
              {getStageBehavior()}
            </p>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-telemetry tracking-wider text-slate-400 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-teal-400" />
              <span>Technical Specifications</span>
            </span>
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 divide-y divide-slate-800/60 text-xs font-telemetry">
              {Object.entries(component.technicalSpecs).map(([key, val]) => (
                <div key={key} className="p-2.5 flex items-start justify-between gap-2">
                  <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-slate-200 text-right font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Circuit Role */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-telemetry tracking-wider text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Circuit & Test Role</span>
            </span>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800/60 font-sans">
              {component.circuitRole}
            </p>
          </div>

          {/* Safety & Failure Modes */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-telemetry tracking-wider text-rose-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              <span>Safety & Failure Modes</span>
            </span>
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/50 text-xs text-rose-200/90 leading-relaxed font-sans">
              {component.safetyConsiderations}
            </div>
            <div className="space-y-1 mt-1.5">
              <span className="text-[10px] font-telemetry text-slate-400">Known Failure Modes:</span>
              <div className="flex flex-wrap gap-1">
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
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={() => selectComponent(null)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-telemetry font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
