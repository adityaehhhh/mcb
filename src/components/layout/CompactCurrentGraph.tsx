import React, { useMemo } from 'react';
import { useSimulationStore } from '../../simulation/useSimulationStore';
import { Activity, Thermometer } from 'lucide-react';

export const CompactCurrentGraph: React.FC = () => {
  const { telemetryHistory, telemetry, scenario, testConfig, selectedComponentId } = useSimulationStore();

  const isTempGraph =
    scenario.id === 'TEMPERATURE_SENSOR_FAILURE' ||
    scenario.id === 'OVER_TEMPERATURE_HAZARD';

  const maxVal = useMemo(() => {
    if (isTempGraph) {
      const highestT = Math.max(...telemetryHistory.map((p) => p.temperature), 30);
      return Math.max(80, highestT * 1.15);
    }
    const highestInHistory = Math.max(...telemetryHistory.map((p) => p.current), 0);
    const expectedTarget = scenario.targetCurrentA || 16.0;
    return Math.max(25, highestInHistory * 1.15, expectedTarget * 1.15);
  }, [telemetryHistory, scenario.targetCurrentA, isTempGraph]);

  // Dimensions
  const width = 230;
  const height = 55;
  const padding = 5;

  const pointsString = useMemo(() => {
    if (telemetryHistory.length < 2) {
      return `0,${height - padding} ${width},${height - padding}`;
    }

    return telemetryHistory
      .map((p, idx) => {
        const x = (idx / (telemetryHistory.length - 1)) * (width - padding * 2) + padding;
        const val = isTempGraph ? p.temperature : p.current;
        const normalizedY = (val / maxVal) * (height - padding * 2);
        const y = height - padding - normalizedY;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [telemetryHistory, maxVal, width, height, isTempGraph]);

  const ratedY = isTempGraph
    ? height - padding - (60 / maxVal) * (height - padding * 2)
    : height - padding - (testConfig.mcbRatingA / maxVal) * (height - padding * 2);

  return (
    <div
      className={`absolute top-4 ${
        selectedComponentId ? 'right-96' : 'right-4'
      } z-20 pointer-events-auto select-none transition-all duration-300 animate-fade-in hidden sm:block`}
    >
      <div className="lab-card rounded-xl p-2.5 border border-slate-700/60 shadow-xl w-60">
        {/* Header */}
        <div className="flex items-center justify-between text-[11px] font-telemetry mb-1 text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-200 font-medium">
            {isTempGraph ? (
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Activity className="w-3.5 h-3.5 text-teal-400" />
            )}
            <span>{isTempGraph ? 'Temp vs Time' : 'Current vs Time'}</span>
          </span>
          <span className={isTempGraph ? 'text-amber-300 font-bold font-mono' : 'text-teal-300 font-bold font-mono'}>
            {isTempGraph ? `${telemetry.temperature.toFixed(1)} °C` : `${telemetry.current.toFixed(2)} A`}
          </span>
        </div>

        {/* Graph Canvas */}
        <div className="relative bg-slate-950/90 rounded-lg p-1 border border-slate-800/80 overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-12 overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Grid line */}
            <line
              x1="0"
              y1={height / 2}
              x2={width}
              y2={height / 2}
              stroke="#1e293b"
              strokeDasharray="2 2"
              strokeWidth="0.8"
            />

            {/* Benchmark Line */}
            {ratedY >= 0 && ratedY <= height && (
              <line
                x1="0"
                y1={ratedY}
                x2={width}
                y2={ratedY}
                stroke="#64748b"
                strokeDasharray="2 2"
                strokeWidth="0.75"
              />
            )}

            {/* Area Fill */}
            <polygon
              points={`0,${height - padding} ${pointsString} ${width},${height - padding}`}
              fill={isTempGraph ? 'rgba(245, 158, 11, 0.12)' : 'rgba(20, 184, 166, 0.12)'}
            />

            {/* Curve */}
            <polyline
              fill="none"
              stroke={isTempGraph ? '#f59e0b' : '#14b8a6'}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsString}
            />
          </svg>

          {/* Benchmark Labels */}
          <div className="flex items-center justify-between text-[8.5px] font-telemetry text-slate-500 mt-0.5">
            <span>0{isTempGraph ? '°C' : 'A'}</span>
            <span>{isTempGraph ? 'Limit: 60°C' : `Rated: ${testConfig.mcbRatingA}A`}</span>
            <span>Max: {maxVal.toFixed(0)}{isTempGraph ? '°C' : 'A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
