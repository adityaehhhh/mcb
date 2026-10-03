import React from 'react';
import { useSimulationStore } from '../../simulation/useSimulationStore';
import { Zap, Flame, AlertTriangle, Sparkles, CheckCircle2, ShieldAlert, Activity, Circle } from 'lucide-react';

export const CompactBottomStageStrip: React.FC = () => {
  const { stage, isRunning, isEmergencyStopped, verdict, scenario } = useSimulationStore();

  const getStageIcon = () => {
    if (isEmergencyStopped) {
      return <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />;
    }
    if (!isRunning) {
      if (verdict === 'PASS') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      if (verdict === 'FAIL' || verdict === 'FAULT') return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
      return <Circle className="w-2.5 h-2.5 text-teal-400 fill-teal-400" />;
    }

    // Dynamic icon based on stage index & action
    switch (stage.index) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        return <Circle className="w-2.5 h-2.5 text-teal-400 fill-teal-400 animate-ping" />;
      case 9:
        return <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />;
      case 10:
      case 11:
        return <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />;
      case 12:
        return <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />;
      case 13:
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />;
      case 14:
        return <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />;
      case 15:
      case 16:
        return <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />;
      case 17:
      case 18:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-teal-400 animate-spin" />;
    }
  };

  const getStageShortName = () => {
    if (isEmergencyStopped) return 'EMERGENCY STOP ACTIVE — CIRCUIT TRIPPED & ISOLATED';
    if (!isRunning) {
      if (verdict === 'PASS') return `TEST COMPLETE — PASSED`;
      if (verdict === 'FAIL') return `TEST COMPLETE — FAILED TOLERANCE`;
      if (verdict === 'FAULT') return `TEST HALTED (FAULT LOCATED)`;
      if (verdict === 'STOPPED' || verdict === 'ABORTED') return `TEST HALTED — STANDBY`;
      return 'READY — SYSTEM ARMED';
    }

    // Explicit concise names requested by engineering specification
    switch (stage.index) {
      case 1: return 'POWER ON & BUS ENERGIZATION';
      case 2: return 'SYSTEM & MCU INITIALIZATION';
      case 3: return 'COMPONENT SELF CHECK';
      case 4: return 'SAFETY INTERLOCK CHECK';
      case 5: return 'MCB SETUP & PROFILE VERIFICATION';
      case 6: return 'PRE-TEST INSPECTION & ZERO CAL';
      case 7: return 'CIRCUIT PREPARATION & RELAY ARMING';
      case 8: return 'CONTACTOR ACTIVATION';
      case 9: return 'CURRENT FLOW & ENERGIZATION';
      case 10: return 'LOAD APPLICATION (COILS ENERGIZED)';
      case 11: return 'LIVE TELEMETRY & THERMAL MONITORING';
      case 12: return 'HIGH-CURRENT CONDITION';
      case 13: return 'MCB TRIP DETECTION';
      case 14: return 'ARC INTERRUPTION & EXTINCTION';
      case 15: return 'CIRCUIT ISOLATED';
      case 16: return 'POST-TEST SAFETY VERIFICATION';
      case 17: return 'RESULT VALIDATION vs IEC 60898-1';
      case 18: return 'TEST RESULT & REPORT COMPLETE';
      default: return stage.title.toUpperCase();
    }
  };

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none max-w-2xl w-full px-4 flex justify-center">
      <div className="backdrop-blur-md bg-slate-950/85 border border-slate-800/90 shadow-2xl px-5 py-2 rounded-full flex items-center gap-3 transition-all duration-300">
        <div className="flex items-center justify-center w-5 h-5">
          {getStageIcon()}
        </div>
        
        <div className="font-telemetry text-xs md:text-sm font-semibold tracking-wider text-slate-100 uppercase flex items-center gap-2">
          <span>{getStageShortName()}</span>
          {isRunning && (
            <span className="text-[10px] text-teal-400 font-mono font-normal opacity-80">
              ({stage.index}/18)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
