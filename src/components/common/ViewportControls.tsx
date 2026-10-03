import React from 'react';
import { 
  Eye, 
  Rotate3d, 
  Layers, 
  Sliders, 
  Camera, 
  Focus, 
  Maximize, 
  Box, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useSimulationStore, CameraPreset, ViewMode } from '../../simulation/useSimulationStore';

export const ViewportControls: React.FC = () => {
  const {
    viewMode,
    explodedProgress,
    cameraPreset,
    selectedComponentId,
    setViewMode,
    setExplodedProgress,
    setCameraPreset,
  } = useSimulationStore();

  return (
    <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none z-10">
      {/* Top Left: 3D View Modes & Exploded Slider */}
      <div className="flex flex-col gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl">
          {/* Default Mode */}
          <button
            onClick={() => setViewMode('DEFAULT')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
              viewMode === 'DEFAULT'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Normal
          </button>

          {/* X-Ray Mode */}
          <button
            onClick={() => setViewMode(viewMode === 'XRAY' ? 'DEFAULT' : 'XRAY')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all flex items-center gap-1 ${
              viewMode === 'XRAY'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>X-Ray</span>
          </button>

          {/* Exploded Mode */}
          <button
            onClick={() => setViewMode(viewMode === 'EXPLODED' ? 'DEFAULT' : 'EXPLODED')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all flex items-center gap-1 ${
              viewMode === 'EXPLODED'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Exploded</span>
          </button>

          {/* Isolation Mode */}
          <button
            onClick={() => setViewMode(viewMode === 'ISOLATED' ? 'DEFAULT' : 'ISOLATED')}
            disabled={!selectedComponentId}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all flex items-center gap-1 ${
              viewMode === 'ISOLATED'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500 shadow-glow-cyan'
                : selectedComponentId
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 cursor-not-allowed'
            }`}
            title={selectedComponentId ? 'Isolate Selected Component' : 'Select a component first to isolate'}
          >
            <Focus className="w-3.5 h-3.5" />
            <span>Isolate</span>
          </button>
        </div>

        {/* Exploded View Separation Slider */}
        {viewMode === 'EXPLODED' && (
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl flex items-center gap-3 w-64 animate-fadeIn">
            <span className="text-[10px] uppercase font-mono text-slate-400 whitespace-nowrap">Explode:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explodedProgress}
              onChange={(e) => setExplodedProgress(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono text-cyan-300 font-bold w-9 text-right">
              {Math.round(explodedProgress * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Top Right: Camera Presets */}
      <div className="flex items-center gap-1 p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl pointer-events-auto">
        <Camera className="w-3.5 h-3.5 text-slate-500 mx-1" />
        {(['DEFAULT', 'FRONT', 'SIDE', 'TOP', 'MCB', 'SENSORS', 'LOAD'] as CameraPreset[]).map((preset) => (
          <button
            key={preset}
            onClick={() => setCameraPreset(preset)}
            className={`px-2 py-1 rounded text-[11px] font-mono transition-all uppercase ${
              cameraPreset === preset
                ? 'bg-slate-800 text-cyan-300 border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {preset === 'DEFAULT' ? 'ISO' : preset}
          </button>
        ))}
      </div>
    </div>
  );
};
