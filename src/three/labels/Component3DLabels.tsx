import React from 'react';
import { Html } from '@react-three/drei';
import { PROTOTYPE_COMPONENTS } from '../../data/componentsData';
import { ViewMode } from '../../simulation/useSimulationStore';

interface Props {
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  viewMode: ViewMode;
  guidedMode: boolean;
  activeStageComponents: string[];
  explodedOffset?: [number, number, number];
  onSelectComponent: (id: string) => void;
}

export const Component3DLabels: React.FC<Props> = ({
  selectedComponentId,
  hoveredComponentId,
  viewMode,
  guidedMode,
  activeStageComponents,
  onSelectComponent,
}) => {
  // Show minimal 3D tags only when exploded, hovered, or in guided mode for active components
  const targetComponents = Object.values(PROTOTYPE_COMPONENTS).filter((comp) => {
    if (viewMode === 'EXPLODED') return true;
    if (hoveredComponentId === comp.id) return true;
    if (selectedComponentId === comp.id) return true;
    if (guidedMode && activeStageComponents.includes(comp.id)) return true;
    return false;
  });

  return (
    <group>
      {targetComponents.map((comp) => {
        const isSelected = selectedComponentId === comp.id;
        const isHovered = hoveredComponentId === comp.id;
        const labelText = comp.shortLabel || comp.name.split(' ')[0];

        return (
          <group
            key={`3d-label-${comp.id}`}
            position={[comp.threePosition[0], comp.threePosition[1] + 0.1, comp.threePosition[2] + 0.04]}
          >
            <Html center distanceFactor={2.2} zIndexRange={[50, 0]}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectComponent(comp.id);
                }}
                className={`cursor-pointer px-1.5 py-0.5 rounded text-[10px] font-mono tracking-tight whitespace-nowrap transition-all duration-150 pointer-events-auto border shadow-sm ${
                  isSelected
                    ? 'bg-slate-950/95 border-teal-400 text-teal-300 font-bold ring-1 ring-teal-400/40'
                    : isHovered
                    ? 'bg-slate-900/90 border-slate-500 text-slate-100 font-medium'
                    : 'bg-slate-950/80 border-slate-700/70 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: comp.colorAccent || '#14b8a6' }}
                  />
                  <span>{labelText}</span>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
