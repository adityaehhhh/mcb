import React, { useState, useMemo } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Printer,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  Clock,
  Zap,
  Thermometer
} from 'lucide-react';
import { useSimulationStore } from '../../simulation/useSimulationStore';

// Simple deterministic QR matrix generator for clean SVG output without external heavy dependencies
function generateQrMatrix(text: string): boolean[][] {
  const size = 21;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns at top-left, top-right, bottom-left
  const addFinder = (row: number, col: number) => {
    for (let r = -3; r <= 3; r++) {
      for (let c = -3; c <= 3; c++) {
        const isOuter = Math.abs(r) === 3 || Math.abs(c) === 3;
        const isCenter = Math.abs(r) <= 1 && Math.abs(c) <= 1;
        if (row + r >= 0 && row + r < size && col + c >= 0 && col + c < size) {
          matrix[row + r][col + c] = isOuter || isCenter;
        }
      }
    }
  };

  addFinder(3, 3);
  addFinder(3, 17);
  addFinder(17, 3);

  // Pseudo-deterministic data encoding based on hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (
        (r <= 7 && c <= 7) ||
        (r <= 7 && c >= 13) ||
        (r >= 13 && c <= 7)
      ) {
        continue;
      }
      const bit = ((hash ^ (r * 31 + c * 17)) & (1 << ((r + c) % 8))) !== 0;
      matrix[r][c] = bit;
    }
  }

  return matrix;
}

export const TestReportModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    lastTestResult,
    scenario,
    testConfig,
    telemetry,
    logs
  } = useSimulationStore();
  const [copied, setCopied] = useState(false);

  const reportId = useMemo(() => {
    return 'MCB-TR-' + Math.abs(
      (scenario.id + (lastTestResult?.timestamp || '')).split('').reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0)
    ).toString(16).toUpperCase().padStart(8, '0');
  }, [scenario.id, lastTestResult?.timestamp]);

  if (activeModal !== 'REPORT') return null;

  const result = lastTestResult || {
    verdict: 'IDLE',
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    mcbRating: `${testConfig.mcbRatingA}A (${testConfig.mcbCurve}-Curve)`,
    curveType: testConfig.mcbCurve,
    appliedCurrent: telemetry.current,
    tripDetected: telemetry.tripTimeMs > 0,
    tripTimeMs: telemetry.tripTimeMs,
    peakCurrentA: telemetry.current,
    maxTemperatureC: telemetry.temperature,
    standardClause: 'IS/IEC 60898-1 Clause 9.10 Tripping Evaluation',
    notes: 'Test completed in digital twin simulation engine.',
    timestamp: new Date().toLocaleString()
  };

  const reportUrl = `https://mcb-twin.local/report/${reportId}`;
  const qrMatrix = generateQrMatrix(reportUrl);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(reportId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-3xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-title text-base font-bold text-white tracking-tight">
                MCB Test Certificate & Performance Report
              </h2>
              <p className="text-xs text-slate-400 font-telemetry">
                Report ID: <span className="text-teal-300 font-mono">{reportId}</span>
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

        {/* Certificate Body (Printable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/90 font-sans">
          {/* Top Banner: Verification Result & Timestamp */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-telemetry text-slate-400 block uppercase">
                Test Verdict
              </span>
              <div className="flex items-center gap-2 mt-1">
                {result.verdict === 'PASS' ? (
                  <span className="flex items-center gap-1.5 font-serif-title text-xl font-bold text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" /> PASS
                  </span>
                ) : result.verdict === 'FAIL' ? (
                  <span className="flex items-center gap-1.5 font-serif-title text-xl font-bold text-rose-400">
                    <XCircle className="w-5 h-5" /> FAIL
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 font-serif-title text-xl font-bold text-amber-400">
                    <AlertTriangle className="w-5 h-5" /> {result.verdict}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right font-telemetry text-xs text-slate-400">
              <div>Date: <span className="text-slate-200">{result.timestamp}</span></div>
              <div>Standard Ref: <span className="text-teal-300 font-semibold">IS/IEC 60898-1</span></div>
            </div>
          </div>

          {/* Test Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-telemetry text-xs">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <span className="text-slate-400 text-[10px] block uppercase">Scenario</span>
              <span className="text-slate-200 font-bold mt-1 block truncate">
                {result.scenarioName}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <span className="text-slate-400 text-[10px] block uppercase">MCB Rating & Curve</span>
              <span className="text-teal-300 font-bold mt-1 block">{result.mcbRating}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <span className="text-slate-400 text-[10px] block uppercase">Trip Detected</span>
              <span className="text-slate-200 font-bold mt-1 block">
                {result.tripDetected ? 'YES (Contacts Isolated)' : 'NO (Continuous Hold)'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <span className="text-slate-400 text-[10px] block uppercase">Trip Response Time</span>
              <span className="text-emerald-300 font-bold mt-1 block">
                {result.tripTimeMs > 0 ? `${result.tripTimeMs} ms` : 'N/A'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <span className="text-slate-400 text-[10px] block uppercase">Peak Current (RMS)</span>
              <span className="text-teal-300 font-bold mt-1 block">{result.peakCurrentA.toFixed(2)} A</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <span className="text-slate-400 text-[10px] block uppercase">Max Terminal Temp</span>
              <span className="text-amber-300 font-bold mt-1 block">{result.maxTemperatureC.toFixed(1)} °C</span>
            </div>
          </div>

          {/* Observations & Test Notes */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
            <span className="text-xs font-serif-title font-bold text-slate-200 uppercase tracking-wide block">
              Engineering Observations & Sequence Analysis
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {result.notes}
            </p>
          </div>

          {/* QR Code & Digital Verification Section */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Deterministic QR Code SVG */}
              <div className="p-2 rounded-lg bg-white shrink-0 shadow-md">
                <svg viewBox="0 0 21 21" className="w-16 h-16">
                  {qrMatrix.map((row, r) =>
                    row.map((filled, c) =>
                      filled ? (
                        <rect
                          key={`${r}-${c}`}
                          x={c}
                          y={r}
                          width="1"
                          height="1"
                          fill="#0f172a"
                        />
                      ) : null
                    )
                  )}
                </svg>
              </div>

              <div>
                <span className="text-xs font-serif-title font-semibold text-white block">
                  Report QR Reference & Verification Link
                </span>
                <p className="text-[11px] text-slate-400 font-telemetry mt-0.5">
                  Scan to reference this test record: <span className="text-teal-400">{reportUrl}</span>
                </p>
                <button
                  onClick={handleCopyId}
                  className="mt-2 flex items-center gap-1 text-[11px] font-telemetry text-slate-300 hover:text-teal-300 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied to clipboard' : 'Copy Report Reference'}</span>
                </button>
              </div>
            </div>

            <div className="hidden sm:block text-right text-[10px] font-telemetry text-slate-500 max-w-[180px]">
              Digital twin engineering simulation test demonstrator. Parameters mapped to IS/IEC 60898-1 standard reference.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-telemetry font-semibold transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
          <button
            onClick={closeModal}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 text-xs font-telemetry font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
