import React from 'react';
import {
  Activity,
  BookOpen,
  FileText,
  Volume2,
  VolumeX,
  PlayCircle,
  Maximize2,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders
} from 'lucide-react';
import { useSimulationStore } from '../../simulation/useSimulationStore';
import { SIMULATION_SCENARIOS } from '../../data/scenariosData';

export const Header: React.FC = () => {
  const {
    scenario,
    verdict,
    isRunning,
    isEmergencyStopped,
    isMuted,
    viewMode,
    guidedMode,
    setScenario,
    setViewMode,
    toggleGuidedMode,
    toggleSound,
    openModal,
    triggerEmergencyStop,
  } = useSimulationStore();

  const getStatusBadge = () => {
    if (isEmergencyStopped) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 font-telemetry text-xs font-bold animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5" />
          E-STOP ENGAGED
        </span>
      );
    }
    if (isRunning) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/40 text-teal-300 font-telemetry text-xs font-bold animate-pulse">
          <Activity className="w-3.5 h-3.5 animate-spin" />
          TEST ACTIVE
        </span>
      );
    }
    if (verdict === 'PASS') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-telemetry text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          PASS VERIFIED
        </span>
      );
    }
    if (verdict === 'FAIL') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 font-telemetry text-xs font-bold">
          <XCircle className="w-3.5 h-3.5" />
          FAIL RECORDED
        </span>
      );
    }
    if (verdict === 'FAULT' || verdict === 'ABORTED' || verdict === 'STOPPED') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-telemetry text-xs font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          {verdict}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 font-telemetry text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
        SYSTEM READY
      </span>
    );
  };

  return (
    <header className="h-16 px-5 border-b border-slate-800/80 bg-industrial-950/90 backdrop-blur-md flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand & Project Identity with Lora typography */}
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 shadow-sm">
          <Sliders className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-title text-base font-bold tracking-tight text-white flex items-center gap-2">
              MCB TESTING SYSTEM
            </h1>
            <span className="text-[10px] uppercase font-telemetry tracking-wider px-2 py-0.5 rounded bg-teal-950/60 text-teal-300 border border-teal-800/50">
              3D Digital Twin
            </span>
          </div>
          <p className="text-xs text-slate-400 font-telemetry flex items-center gap-2">
            <span>Hardware Prototype</span>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => openModal('STANDARDS')}
              className="text-teal-400 hover:text-teal-300 underline underline-offset-2"
            >
              IS/IEC 60898-1 Reference
            </button>
          </p>
        </div>
      </div>

      {/* Center: Clean Scenario Selector */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800/80">
          <span className="text-xs font-telemetry text-slate-400 uppercase tracking-wider">
            Scenario:
          </span>
          <select
            value={scenario.id}
            onChange={(e) => setScenario(e.target.value as any)}
            disabled={isRunning}
            className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer max-w-sm truncate"
          >
            {SIMULATION_SCENARIOS.map((sc) => (
              <option key={sc.id} value={sc.id} className="bg-slate-900 text-slate-200">
                {sc.name}
              </option>
            ))}
          </select>
        </div>
        {getStatusBadge()}
      </div>

      {/* Right: Actions & Tools */}
      <div className="flex items-center gap-2">
        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className={`p-2 rounded-lg text-xs font-telemetry border transition-all ${
            isMuted
              ? 'bg-slate-900 border-slate-800 text-slate-500'
              : 'bg-slate-900 border-slate-700 text-teal-400 hover:border-teal-500'
          }`}
          title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Guided Walkthrough Toggle */}
        <button
          onClick={toggleGuidedMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-telemetry font-medium border transition-all ${
            guidedMode
              ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
          }`}
          title="Toggle Guided Explanation Mode"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Guided Tour</span>
        </button>

        {/* Standards Reference Modal */}
        <button
          onClick={() => openModal('STANDARDS')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-telemetry font-medium bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
          title="View IS/IEC 60898-1 Standard Reference & Curves"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Standards</span>
        </button>

        {/* Test Report Modal */}
        <button
          onClick={() => openModal('REPORT')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-telemetry font-medium bg-slate-900 border border-slate-700 text-slate-300 hover:border-teal-500 hover:text-teal-300 transition-colors"
          title="View Test Certificate & Report"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Report</span>
        </button>

        {/* Demo Mode */}
        <button
          onClick={() => setViewMode(viewMode === 'PRESENTATION' ? 'DEFAULT' : 'PRESENTATION')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-telemetry font-bold border transition-all ${
            viewMode === 'PRESENTATION'
              ? 'bg-teal-600 text-slate-950 border-teal-400'
              : 'bg-slate-900 border-slate-700 text-teal-400 hover:border-teal-500'
          }`}
          title="Judge Presentation / Demo Mode"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Demo</span>
        </button>

        {/* Emergency Stop Button */}
        <button
          onClick={triggerEmergencyStop}
          className={`p-2 rounded-lg border font-bold text-xs transition-all ${
            isEmergencyStopped
              ? 'bg-rose-600 text-white border-rose-500 ring-2 ring-rose-400 animate-pulse'
              : 'bg-rose-950/40 border-rose-900/60 text-rose-400 hover:bg-rose-900/60'
          }`}
          title={isEmergencyStopped ? 'Reset Emergency Stop' : 'Trip Emergency Stop'}
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
