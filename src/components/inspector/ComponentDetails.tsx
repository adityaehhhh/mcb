import React from 'react';
import { 
  Cpu, 
  Zap, 
  Thermometer, 
  ShieldAlert, 
  Info, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Layers,
  Flame,
  Radio
} from 'lucide-react';
import { PROTOTYPE_COMPONENTS } from '../../data/componentsData';
import { ComponentMetadata } from '../../types/components';
import { useSimulationStore } from '../../simulation/useSimulationStore';

interface Props {
  componentId: string | null;
}

export const ComponentDetails: React.FC<Props> = ({ componentId }) => {
  const { componentStates, setViewMode } = useSimulationStore();

  const component: ComponentMetadata | undefined = componentId 
    ? PROTOTYPE_COMPONENTS[componentId] 
    : PROTOTYPE_COMPONENTS['mcb_bank'];

  if (!component) {
    return (
      <div className="p-6 text-center text-slate-500 font-mono text-xs">
        Select a component in the 3D scene or timeline to inspect.
      </div>
    );
  }

  const liveState = componentStates[component.id];
  const status = liveState?.status || component.status;
  const currentV = liveState?.voltage ?? component.liveMetrics.voltage ?? 0;
  const currentI = liveState?.current ?? component.liveMetrics.current ?? 0;
  const currentT = liveState?.temp ?? component.liveMetrics.temperature ?? 26.5;

  const getStatusBadge = () => {
    switch (status) {
      case 'ENERGIZED':
      case 'ACTIVE':
        return <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500 text-xs font-mono font-bold animate-pulse">● ENERGIZED / ACTIVE</span>;
      case 'TRIPPED':
        return <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500 text-xs font-mono font-bold">● TRIPPED / SAFE</span>;
      case 'FAULT':
      case 'OVERHEATED':
        return <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500 text-xs font-mono font-bold">● FAULT DETECTED</span>;
      case 'ISOLATED':
        return <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono">● ISOLATED</span>;
      case 'READY':
      default:
        return <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500 text-xs font-mono font-bold">● READY</span>;
    }
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-full">
      {/* Component Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {component.subsystem}
          </span>
          {getStatusBadge()}
        </div>
        <h3 className="text-base font-bold text-white tracking-tight">
          {component.name}
        </h3>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          {component.type}
        </p>
      </div>

      {/* Live Electrical & Thermal Telemetry Box */}
      <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-1.5">
          <span className="flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>LIVE COMPONENT TELEMETRY</span>
          </span>
          <span className="text-cyan-400 text-[10px]">Real-time</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-mono">VOLTAGE</span>
            <span className="text-sm font-bold font-mono text-blue-300">{currentV.toFixed(1)} V</span>
          </div>
          <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-mono">CURRENT</span>
            <span className="text-sm font-bold font-mono text-cyan-300">{currentI.toFixed(2)} A</span>
          </div>
          <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-mono">TEMP</span>
            <span className="text-sm font-bold font-mono text-amber-300">{currentT.toFixed(1)} °C</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/60">
          <span className="text-slate-500">State: </span>
          <span className="text-slate-200">{liveState?.stateText || 'Standby'}</span>
        </div>
      </div>

      {/* Purpose */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
          <Info className="w-3 h-3 text-cyan-400" />
          <span>PURPOSE & FUNCTION</span>
        </span>
        <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-900/50 p-2.5 rounded border border-slate-800/60">
          {component.purpose}
        </p>
      </div>

      {/* Technical Specifications */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
          <Sliders className="w-3 h-3 text-cyan-400" />
          <span>TECHNICAL SPECIFICATIONS</span>
        </span>
        <div className="bg-slate-900/60 rounded-lg border border-slate-800 divide-y divide-slate-800/60 text-xs font-mono">
          {Object.entries(component.technicalSpecs).map(([key, val]) => (
            <div key={key} className="p-2 flex items-start justify-between gap-2">
              <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <span className="text-slate-200 text-right font-medium">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Circuit & Test Relevance */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>CIRCUIT & TEST ROLE</span>
        </span>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-2.5 rounded border border-slate-800/60">
          {component.circuitRole}
        </p>
        <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/30 p-2.5 rounded border border-slate-800/40 italic">
          <strong className="text-cyan-400 not-italic">Test Relevance: </strong>
          {component.testRelevance}
        </p>
      </div>

      {/* Safety & Failure Modes */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-mono tracking-wider text-rose-400 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-rose-400" />
          <span>SAFETY & FAILURE MODES</span>
        </span>
        <div className="p-2.5 rounded bg-rose-950/20 border border-rose-900/50 text-xs text-rose-200/90 leading-relaxed">
          {component.safetyConsiderations}
        </div>
        <div className="space-y-1 mt-1.5">
          <span className="text-[10px] font-mono text-slate-400">Known Failure Modes:</span>
          <div className="flex flex-wrap gap-1">
            {component.failureModes.map((fm, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                • {fm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
