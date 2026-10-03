import React, { useMemo } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Compass,
  Radio
} from 'lucide-react';
import { useSimulationStore, getScenarioFaultData } from '../../simulation/useSimulationStore';
import { PROTOTYPE_COMPONENTS } from '../../data/componentsData';

export const LeftFaultInspector: React.FC = () => {
  const {
    verdict,
    scenario,
    isRunning,
    telemetry,
    componentStates,
    selectedComponentId,
    resetSimulation,
    selectComponent,
    setCameraPreset,
  } = useSimulationStore();

  // Determine if a fault is currently active or triggered
  const isFaultCondition =
    verdict === 'FAULT' ||
    verdict === 'ABORTED' ||
    verdict === 'FAIL' ||
    (scenario.faultTriggerStageIndex !== undefined &&
      (componentStates['power_supply']?.status === 'FAULT' ||
        componentStates['sensor_current']?.status === 'FAULT' ||
        componentStates['sensor_voltage']?.status === 'FAULT' ||
        componentStates['sensor_temp']?.status === 'FAULT' ||
        componentStates['ac_contactor']?.status === 'FAULT' ||
        componentStates['mcb_bank']?.status === 'FAULT'));

  const faultData = useMemo(() => getScenarioFaultData(scenario.id), [scenario.id]);
  const isInspectorOpen = selectedComponentId !== null;

  return (
    <div className="absolute top-4 left-4 z-20 pointer-events-auto select-none w-68 max-w-[270px]">
      {isFaultCondition ? (
        /* Compact Sleek FAULT NOTIFICATION Card */
        <div className="lab-card backdrop-blur-xl bg-slate-950/92 rounded-xl p-3 border border-rose-500/40 shadow-2xl ring-1 ring-rose-500/20 animate-fade-in transition-all">
          {/* Header Badge: ● FAULT DETECTED */}
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-rose-500/30">
            <div className="flex items-center gap-1.5 text-rose-400 font-telemetry font-bold text-[11px] uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span>FAULT DETECTED</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-700/60 font-bold">
              HALT
            </span>
          </div>

          {/* Fault Title */}
          <div className="mb-2">
            <h3 className="text-white font-serif-title text-xs font-bold leading-tight tracking-tight text-rose-100 uppercase">
              {faultData.title.replace('\n', ' ')}
            </h3>
          </div>

          {/* Section: LOCATION */}
          <div className="mb-2 bg-slate-900/90 p-2 rounded-lg border border-slate-800">
            <span className="text-[8px] text-slate-400 font-telemetry uppercase tracking-wider block leading-none mb-1">
              Location
            </span>
            <span className="text-[11px] font-mono font-bold text-amber-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span className="truncate">{faultData.locationLabel}</span>
            </span>
          </div>

          {/* Section: TELEMETRY / DELTA */}
          <div className="mb-2 bg-slate-900/90 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[8px] text-slate-400 font-telemetry uppercase tracking-wider block leading-none mb-1">
                Measurement
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="text-slate-300 font-semibold">{faultData.metricBefore}</span>
                <ArrowRight className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                <span className="text-rose-400 font-bold">{faultData.metricAfter}</span>
              </div>
            </div>
          </div>

          {/* Section: STATUS */}
          <div className="mb-2.5 bg-slate-900/90 px-2 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-[8px] text-slate-400 font-telemetry uppercase tracking-wider">Status</span>
            <span className="text-[10px] font-mono font-bold text-rose-300">{faultData.statusText}</span>
          </div>

          {/* Action Buttons: [ INSPECT ]  [ RESET ] */}
          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
            <button
              onClick={() => {
                if (isInspectorOpen) {
                  selectComponent(null);
                } else {
                  selectComponent(faultData.locationComponentId);
                }
              }}
              className={`flex-1 py-1 px-2 rounded-lg font-telemetry text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95 ${
                isInspectorOpen
                  ? 'bg-teal-900/80 text-teal-200 border border-teal-600'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600'
              }`}
            >
              <Sliders className="w-3 h-3 text-teal-400" />
              <span>{isInspectorOpen ? 'Close Drawer' : 'Inspect'}</span>
            </button>

            <button
              onClick={resetSimulation}
              className="py-1 px-2.5 rounded-lg font-telemetry text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:text-white transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
              title="Reset Simulation"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      ) : (
        /* Minimal Sleek Test Profile Widget when normal/idle */
        <div className="lab-card backdrop-blur-md bg-slate-950/85 rounded-xl p-2.5 border border-slate-800/80 shadow-xl text-xs transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="font-telemetry text-[9px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3 text-teal-400" />
              <span>Test Setup</span>
            </span>
            <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-teal-950/60 text-teal-300 border border-teal-800/60">
              READY
            </span>
          </div>
          <h4 className="text-slate-100 font-medium text-[11px] leading-tight truncate" title={scenario.name}>
            {scenario.name}
          </h4>
        </div>
      )}
    </div>
  );
};
