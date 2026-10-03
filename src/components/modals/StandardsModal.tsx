import React, { useState } from 'react';
import { X, BookOpen, ShieldCheck, Info, Sliders } from 'lucide-react';
import { useSimulationStore } from '../../simulation/useSimulationStore';
import { IS_IEC_60898_1_CLAUSES, MCB_TRIP_CURVES } from '../../data/standardsData';

export const StandardsModal: React.FC = () => {
  const { activeModal, closeModal } = useSimulationStore();
  const [selectedCurve, setSelectedCurve] = useState<'B' | 'C' | 'D'>('C');

  if (activeModal !== 'STANDARDS') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-title text-base font-bold text-white tracking-tight">
                IS/IEC 60898-1 Standard Reference
              </h2>
              <p className="text-xs text-slate-400 font-telemetry">
                Circuit-breakers for overcurrent protection for household and similar installations
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/90 font-sans">
          {/* Important Compliance & Simulation Disclaimer */}
          <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/30 flex items-start gap-3">
            <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed font-sans">
              <strong className="text-teal-300 font-serif-title text-sm block mb-1">
                Standard Reference vs Simulation Parameter Disclaimer:
              </strong>
              This software is a 3D digital twin demonstrator illustrating the electrical workflow and protective response of the prototype testing system. All thresholds and timing figures in the simulation are engineering references; verified compliance certification must be conducted on calibrated laboratory test equipment in accordance with verified standard procedures.
            </div>
          </div>

          {/* Tripping Characteristic Curves Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-serif-title font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              <span>IS/IEC 60898-1 Tripping Curves (Type B, C, D)</span>
            </h3>

            {/* Curve Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {MCB_TRIP_CURVES.map((curveDef) => (
                <button
                  key={curveDef.curve}
                  onClick={() => setSelectedCurve(curveDef.curve)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedCurve === curveDef.curve
                      ? 'bg-slate-800 border-teal-500/80 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif-title font-bold text-sm text-white">
                      {curveDef.name}
                    </span>
                    <span className="font-telemetry text-xs px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-teal-300">
                      Curve {curveDef.curve}
                    </span>
                  </div>
                  <div className="text-xs font-telemetry text-slate-400 space-y-0.5 mt-2">
                    <div>Thermal: <span className="text-slate-200">{curveDef.thermalBand}</span></div>
                    <div>Magnetic: <span className="text-teal-300 font-bold">{curveDef.magneticBand}</span></div>
                  </div>
                  <div className="text-xs text-slate-400 mt-2 line-clamp-2 font-sans">
                    {curveDef.typicalLoads}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Standard Clauses Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-serif-title font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Applicable Standard Test Clauses</span>
            </h3>

            <div className="space-y-3">
              {IS_IEC_60898_1_CLAUSES.map((clause, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-telemetry text-xs font-bold text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/50">
                      {clause.clauseNumber}
                    </span>
                    <span className="text-xs font-serif-title font-semibold text-slate-300">{clause.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {clause.scope}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-telemetry bg-slate-950 p-2.5 rounded-lg border border-slate-800/60">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Test Current:</span>
                      <span className="text-slate-200 font-semibold">{clause.testCurrentFormula}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Acceptance Criteria:</span>
                      <span className="text-teal-300 font-semibold">{clause.acceptanceCriteria}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-telemetry text-xs font-semibold"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
};
