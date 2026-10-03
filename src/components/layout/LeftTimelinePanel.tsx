import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Shield, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Zap, 
  Cpu, 
  ListChecks,
  Compass
} from 'lucide-react';
import { useSimulationStore } from '../../simulation/useSimulationStore';
import { SIMULATION_STAGES } from '../../data/stagesData';

export const LeftTimelinePanel: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    stage,
    currentStageIndex,
    scenario,
    isRunning,
    verdict,
    guidedMode,
    selectComponent
  } = useSimulationStore();

  return (
    <div
      className={`relative border-r border-slate-800 bg-industrial-950/90 backdrop-blur-md flex flex-col transition-all duration-300 z-20 shrink-0 ${
        isCollapsed ? 'w-12' : 'w-80 sm:w-96'
      }`}
    >
      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-6 z-30 w-7 h-7 rounded-full bg-slate-800 border border-slate-600 text-slate-300 hover:text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        title={isCollapsed ? 'Expand Timeline Panel' : 'Collapse Timeline Panel'}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {isCollapsed ? (
        <div className="py-6 flex flex-col items-center gap-6 text-slate-400">
          <Layers className="w-5 h-5 text-cyan-400" />
          <div className="font-mono text-xs font-bold [writing-mode:vertical-lr] tracking-widest uppercase text-slate-500">
            TEST TIMELINE
          </div>
          <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
            {stage.index}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="p-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold font-mono tracking-wider text-slate-200 uppercase">
                  Test Process Timeline
                </h2>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-400">
                Stage {String(stage.index).padStart(2, '0')} / 18
              </span>
            </div>

            {/* Current Active Stage Summary Card */}
            <div className="mt-3 p-3 rounded-lg bg-slate-900/90 border border-cyan-500/30 shadow-glow-cyan/10">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                  {stage.title}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {stage.description}
              </p>

              {/* Hardware Checklist for Current Stage */}
              {stage.hardwareChecklist && stage.hardwareChecklist.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                    <ListChecks className="w-3 h-3 text-cyan-400" />
                    <span>Stage Verification Checklist:</span>
                  </div>
                  <div className="space-y-1">
                    {stage.hardwareChecklist.map((item, idx) => (
                      <div key={`chk-${idx}`} className="flex items-start gap-1.5 text-[11px] font-mono text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Guided Explanation Callout if Guided Mode Active */}
            {guidedMode && (
              <div className="mt-2.5 p-2.5 rounded bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2 animate-fadeIn">
                <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-300">Guided Walkthrough:</span>
                  <span>
                    Focusing on stage active components: {stage.activeComponentIds.join(', ')}. Power flow is{' '}
                    {stage.powerFlowActive ? 'ACTIVE' : 'ISOLATED'}.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 18-Stage Vertical Scrolling Timeline */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {SIMULATION_STAGES.map((stg, idx) => {
              const isCurrent = currentStageIndex === idx;
              const isCompleted = currentStageIndex > idx;
              const isFuture = currentStageIndex < idx;
              const isFaulted = (verdict === 'FAULT' || verdict === 'FAIL') && isCurrent;

              return (
                <div
                  key={stg.id}
                  onClick={() => {
                    if (stg.activeComponentIds[0]) selectComponent(stg.activeComponentIds[0]);
                  }}
                  className={`group p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                    isCurrent
                      ? isFaulted
                        ? 'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500/40'
                        : 'bg-cyan-950/40 border-cyan-500/60 text-cyan-100 ring-1 ring-cyan-500/40'
                      : isCompleted
                      ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:border-slate-800'
                  }`}
                >
                  {/* Step Number & Status Icon */}
                  <div className="shrink-0 mt-0.5">
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    ) : isCurrent ? (
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                          isFaulted
                            ? 'bg-rose-950 border border-rose-500 text-rose-400 animate-pulse'
                            : 'bg-cyan-950 border border-cyan-400 text-cyan-300 animate-pulse'
                        }`}
                      >
                        {stg.index}
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center font-mono text-[10px]">
                        {stg.index}
                      </div>
                    )}
                  </div>

                  {/* Step Title & Subtitle */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-xs font-semibold truncate ${
                          isCurrent ? 'text-cyan-200' : isCompleted ? 'text-slate-200' : 'text-slate-400'
                        }`}
                      >
                        {stg.title}
                      </span>
                      {stg.powerFlowActive && (
                        <span className="shrink-0 text-[10px] px-1.5 py-0.2 rounded bg-amber-950 border border-amber-800 text-amber-400 font-mono">
                          ⚡ LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {stg.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Scenario Info Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/80 shrink-0">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1 flex items-center justify-between">
              <span>Active Scenario:</span>
              <span className="text-cyan-400 font-bold">{scenario.category}</span>
            </div>
            <div className="text-xs font-semibold text-slate-200 truncate">
              {scenario.name}
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
              <span>Target Current: <strong className="text-cyan-300">{scenario.targetCurrentA}A</strong> ({scenario.multiplierIn}× In)</span>
              <span>Target V: <strong className="text-blue-300">{scenario.targetVoltageV}V</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
