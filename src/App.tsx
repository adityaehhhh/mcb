import React from 'react';
import { Header } from './components/layout/Header';
import { DigitalTwinCanvas } from './three/DigitalTwinCanvas';
import { CompactCurrentGraph } from './components/layout/CompactCurrentGraph';
import { LeftFaultInspector } from './components/layout/LeftFaultInspector';
import { BottomHeroControls } from './components/layout/BottomHeroControls';
import { RightComponentInspector } from './components/inspector/RightComponentInspector';
import { StandardsModal } from './components/modals/StandardsModal';
import { TestReportModal } from './components/modals/TestReportModal';
import { ConfigurationModal } from './components/modals/ConfigurationModal';
import { useSimulationStore } from './simulation/useSimulationStore';

export const App: React.FC = () => {
  const { viewMode } = useSimulationStore();
  const isPresentation = viewMode === 'PRESENTATION';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#090d13] text-slate-100 select-none">
      {/* Top Application Header (Hidden only in full Presentation / Demo Mode) */}
      {!isPresentation && <Header />}

      {/* Main Hero 3D Viewport with Non-Intrusive Floating Controls */}
      <main className="flex-1 relative overflow-hidden w-full h-full">
        {/* 3D Machine Canvas (Hero visual - 70%+ screen) */}
        <DigitalTwinCanvas />

        {/* Compact Sleek Fault Inspector on Left Side (Top-Left) */}
        <LeftFaultInspector />

        {/* Small Compact Current/Telemetry Graph (Top-Right) */}
        <CompactCurrentGraph />

        {/* Slim Unified Bottom Action & View Bar */}
        <BottomHeroControls />

        {/* Right-Side Component Properties Inspector (Opens only when user clicks Inspect or 3D component) */}
        <RightComponentInspector />
      </main>

      {/* Dialogs & Modals */}
      <StandardsModal />
      <TestReportModal />
      <ConfigurationModal />
    </div>
  );
};

export default App;
