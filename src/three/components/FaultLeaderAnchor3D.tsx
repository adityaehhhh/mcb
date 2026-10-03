import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSimulationStore, getScenarioFaultData } from '../../simulation/useSimulationStore';
import { PROTOTYPE_COMPONENTS } from '../../data/componentsData';

interface Props {
  explodedOffset?: [number, number, number];
}

export const FaultLeaderAnchor3D: React.FC<Props> = ({ explodedOffset = [0, 0, 0] }) => {
  const { verdict, scenario, componentStates, selectComponent } = useSimulationStore();
  const ringRef = useRef<THREE.Mesh>(null);

  // Determine if a fault is currently active or triggered
  const isFaultCondition =
    verdict === 'FAULT' ||
    verdict === 'ABORTED' ||
    verdict === 'FAIL' ||
    (scenario.faultTriggerStageIndex !== undefined &&
      (componentStates['power_supply']?.status === 'FAULT' ||
        componentStates['sensor_current']?.status === 'FAULT' ||
        componentStates['sensor_voltage']?.status === 'FAULT' ||
        componentStates['sensor_temp']?.status === 'FAULT' ||
        componentStates['ac_contactor']?.status === 'FAULT' ||
        componentStates['mcb_bank']?.status === 'FAULT'));

  const faultData = getScenarioFaultData(scenario.id);
  const targetComp = PROTOTYPE_COMPONENTS[faultData.locationComponentId];
  const targetPos = targetComp ? targetComp.threePosition : [-0.65, -0.15, 0.35];

  const anchorX = targetComp?.id === 'controller_unit' ? 0.58 : targetPos[0];
  const anchorY = targetComp?.id === 'controller_unit' ? 0.22 : targetPos[1];
  const anchorZ = 0.35;

  useFrame(({ clock }) => {
    if (ringRef.current && isFaultCondition) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 7) * 0.18;
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  if (!isFaultCondition) return null;

  return (
    <group position={[anchorX + explodedOffset[0], anchorY + explodedOffset[1], anchorZ + explodedOffset[2]]}>
      {/* 3D Local Warning Beacon Ring on Component */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.08, 0.006, 12, 24]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.75} />
      </mesh>

      {/* Tiny Warning Dot */}
      <mesh position={[0, 0, 0.02]}>
        <sphereGeometry args={[0.012, 12, 12]} />
        <meshBasicMaterial color="#dc2626" />
      </mesh>

      {/* Short Local 3D World-Space Callout Badge */}
      <Html position={[0, 0.12, 0.04]} center distanceFactor={2.4} zIndexRange={[80, 0]}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            selectComponent(faultData.locationComponentId);
          }}
          className="cursor-pointer px-2 py-0.5 rounded-md bg-rose-950/95 border border-rose-500/80 text-rose-200 font-mono text-[9px] font-bold shadow-2xl flex items-center gap-1.5 transition-transform hover:scale-105 select-none"
        >
          <span className="text-amber-400 text-[10px] animate-pulse">⚠</span>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[7.5px] text-rose-300 font-medium">{faultData.locationLabel}</span>
            <span className="text-[8.5px] text-amber-300 font-bold">FAULT POINT</span>
          </div>
        </div>
      </Html>
    </group>
  );
};
