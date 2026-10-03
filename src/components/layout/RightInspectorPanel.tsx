import React, { useState } from 'react';
import { 
  Cpu, 
  LineChart, 
  Terminal, 
  ChevronRight, 
  ChevronLeft, 
  SlidersHorizontal,
  Maximize2
} from 'lucide-react';
import { ComponentDetails } from '../inspector/ComponentDetails';
import { TelemetryCharts } from '../inspector/TelemetryCharts';
import { EventLogsView } from '../inspector/EventLogsView';
import { useSimulationStore } from '../../simulation/useSimulationStore';

export const RightInspectorPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INSPECTOR' | 'CHARTS' | 'LOGS'>('INSPECTOR');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { selectedComponentId } = useSimulationStore();

  return (
    <div
      className={`relative border-l border-slate-800 bg-industrial-950/90 backdrop-blur-md flex flex-col transition-all duration-300 z-20 shrink-0 ${
        isCollapsed ? 'w-12' : 'w-80 sm:w-96'
      }`}
    >
      {/* Collapse Toggle Handle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-3.5 top-6 z-30 w-7 h-7 rounded-full bg-slate-800 border border-slate-600 text-slate-300 hover:text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        title={isCollapsed ? 'Expand Inspector Panel' : 'Collapse Inspector Panel'}
      >
        {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {isCollapsed ? (
        <div className="py-6 flex flex-col items-center gap-6 text-slate-400">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <div className="font-mono text-xs font-bold [writing-mode:vertical-lr] tracking-widest uppercase text-slate-500">
            COMPONENT INSPECTOR
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs Navigation Header */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900/60 p-1.5 gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('INSPECTOR')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold font-mono transition-all ${
                activeTab === 'INSPECTOR'
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('CHARTS')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold font-mono transition-all ${
                activeTab === 'CHARTS'
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Telemetry</span>
            </button>

            <button
              onClick={() => setActiveTab('LOGS')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold font-mono transition-all ${
                activeTab === 'LOGS'
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Logs</span>
            </button>
          </div>

          {/* Active Tab Body */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'INSPECTOR' && <ComponentDetails componentId={selectedComponentId} />}
            {activeTab === 'CHARTS' && <TelemetryCharts />}
            {activeTab === 'LOGS' && <EventLogsView />}
          </div>
        </div>
      )}
    </div>
  );
};
