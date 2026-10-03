import React from 'react';
import { X, Settings, Check } from 'lucide-react';
import { useSimulationStore } from '../../simulation/useSimulationStore';

export const ConfigurationModal: React.FC = () => {
  const { activeModal, closeModal, testConfig, updateTestConfig } = useSimulationStore();

  if (activeModal !== 'CONFIG') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden font-sans">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-title text-base font-bold text-white tracking-tight">
                Test Parameters & MCB Rating
              </h2>
              <p className="text-xs text-slate-400 font-telemetry">
                Configure Unit Under Test (UUT) parameters and timing
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 bg-slate-950/90">
          {/* 1. MCB Rated Current (In) */}
          <div className="space-y-2">
            <label className="text-xs font-serif-title font-semibold text-slate-300 uppercase block">
              MCB Rated Current (In):
            </label>
            <div className="grid grid-cols-5 gap-2 font-telemetry">
              {[6, 10, 16, 25, 32].map((rating) => (
                <button
                  key={rating}
                  onClick={() => updateTestConfig({ mcbRatingA: rating })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    testConfig.mcbRatingA === rating
                      ? 'bg-teal-950/80 text-teal-300 border-teal-500 ring-1 ring-teal-500/50'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {rating} A
                </button>
              ))}
            </div>
          </div>

          {/* 2. Tripping Characteristic Curve */}
          <div className="space-y-2">
            <label className="text-xs font-serif-title font-semibold text-slate-300 uppercase block">
              Trip Characteristic Curve:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['B', 'C', 'D'] as const).map((curve) => (
                <button
                  key={curve}
                  onClick={() => updateTestConfig({ mcbCurve: curve })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    testConfig.mcbCurve === curve
                      ? 'bg-slate-800 border-teal-500/80 text-white'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="font-serif-title font-bold text-sm text-white">Curve {curve}</div>
                  <div className="text-[10px] font-telemetry text-slate-400 mt-1">
                    {curve === 'B' ? '3–5 In' : curve === 'C' ? '5–10 In' : '10–20 In'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Poles */}
          <div className="space-y-2">
            <label className="text-xs font-serif-title font-semibold text-slate-300 uppercase block">
              Number of Poles:
            </label>
            <div className="grid grid-cols-4 gap-2 font-telemetry">
              {['1P', '2P', '3P', '4P'].map((poles) => (
                <button
                  key={poles}
                  onClick={() => updateTestConfig({ poles })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    testConfig.poles === poles
                      ? 'bg-teal-950/80 text-teal-300 border-teal-500'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {poles}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Simulation Speed Multiplier */}
          <div className="space-y-2">
            <label className="text-xs font-serif-title font-semibold text-slate-300 uppercase block">
              Simulation Animation Speed:
            </label>
            <div className="grid grid-cols-4 gap-2 font-telemetry">
              {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                <button
                  key={speed}
                  onClick={() => updateTestConfig({ simulationSpeed: speed })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    testConfig.simulationSpeed === speed
                      ? 'bg-slate-800 text-teal-300 border-teal-500'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {speed}×
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={closeModal}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 text-xs font-telemetry font-bold transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Apply Parameters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
