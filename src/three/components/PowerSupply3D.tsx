import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ComponentStatus } from '../../types/components';

interface Props {
  isSelected: boolean;
  isHovered: boolean;
  status: ComponentStatus;
  isDimmed: boolean;
  isXRay: boolean;
  explodedOffset?: [number, number, number];
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}

export const PowerSupply3D: React.FC<Props> = ({
  isSelected,
  isHovered,
  status,
  isDimmed,
  isXRay,
  explodedOffset = [0, 0, 0],
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const faultPulseRef = useRef<THREE.MeshBasicMaterial>(null);
  const isFault = status === 'FAULT';
  const isEnergized = !isFault && (status === 'ENERGIZED' || status === 'ACTIVE' || status === 'READY');

  useFrame(({ clock }) => {
    if (faultPulseRef.current && isFault) {
      const pulse = Math.sin(clock.getElapsedTime() * 6) * 0.5 + 0.5;
      faultPulseRef.current.opacity = 0.35 + pulse * 0.45;
    }
  });

  const bodyColor = isFault
    ? '#7f1d1d'
    : isDimmed
    ? '#475569'
    : isSelected
    ? '#0284c7'
    : isHovered
    ? '#64748b'
    : '#94a3b8';

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: bodyColor,
    metalness: 0.85,
    roughness: 0.3,
    transparent: isXRay || isDimmed,
    opacity: isDimmed ? 0.3 : isXRay ? 0.35 : 1.0,
    emissive: isFault ? '#dc2626' : '#000000',
    emissiveIntensity: isFault ? 0.25 : 0,
  });

  const terminalBlockMaterial = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    roughness: 0.5,
  });

  const screwMaterial = new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    metalness: 0.9,
    roughness: 0.2,
  });

  return (
    <group
      position={[-0.65 + explodedOffset[0], -0.15 + explodedOffset[1], 0.28 + explodedOffset[2]]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Perforated Metal Caged SMPS Enclosure */}
      <mesh material={bodyMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.24, 0.12]} />
      </mesh>

      {/* Perforated Cooling Ventilation Grille Stamping Simulation */}
      {[-0.06, -0.02, 0.02, 0.06].map((x, i) => (
        <mesh key={`smps-vent-${i}`} position={[x, 0.04, 0.062]}>
          <boxGeometry args={[0.02, 0.12, 0.002]} />
          <meshBasicMaterial color={isFault ? '#450a0a' : '#0f172a'} />
        </mesh>
      ))}

      {/* Bottom Terminal Barrier Strip (AC L, N, FG, -V, +V) */}
      <mesh position={[0, -0.09, 0.04]} material={terminalBlockMaterial} castShadow>
        <boxGeometry args={[0.19, 0.04, 0.04]} />
      </mesh>

      {/* 5 Screw Terminals on Barrier Strip */}
      {[-0.07, -0.035, 0, 0.035, 0.07].map((x, i) => (
        <mesh key={`smps-term-${i}`} position={[x, -0.09, 0.062]} material={screwMaterial}>
          <cylinderGeometry args={[0.005, 0.005, 0.008, 12]} />
        </mesh>
      ))}

      {/* DC-OK Status LED (Red if fault, Green if normal) */}
      <mesh position={[0.07, -0.05, 0.062]}>
        <cylinderGeometry args={[0.003, 0.003, 0.005, 8]} />
        <meshBasicMaterial color={isFault ? '#ef4444' : isEnergized ? '#22c55e' : '#334155'} />
      </mesh>

      {/* Blue Voltage Trimmer Potentiometer (V Adj) */}
      <mesh position={[0.04, -0.05, 0.062]}>
        <cylinderGeometry args={[0.004, 0.004, 0.006, 12]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* Transparent Plastic Finger-Safe Terminal Cover */}
      <mesh position={[0, -0.09, 0.07]}>
        <boxGeometry args={[0.195, 0.045, 0.005]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.35} roughness={0.1} />
      </mesh>

      {/* Selection Glow */}
      {isSelected && !isFault && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.24, 0.26, 0.14]} />
          <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.65} />
        </mesh>
      )}

      {/* Fault Highlight: Subtle Red/Orange Glowing Outline & Warning Pulse */}
      {isFault && (
        <group>
          {/* Outer Pulsing Warning Box */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.25, 0.27, 0.15]} />
            <meshBasicMaterial
              ref={faultPulseRef}
              color="#f43f5e"
              wireframe
              transparent
              opacity={0.6}
            />
          </mesh>

          {/* Fault Indicator Marker Pin (World-space callout) */}
          <Html position={[0, 0.16, 0.08]} center distanceFactor={2.2} zIndexRange={[80, 0]}>
            <div className="px-2 py-1 rounded-md bg-rose-950/95 border border-rose-500/80 text-rose-200 font-mono text-[9px] shadow-2xl flex items-center gap-1.5 animate-bounce select-none pointer-events-none">
              <span className="text-amber-400 text-xs">⚠</span>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[7.5px] text-rose-300 font-medium">AC INPUT / PSU</span>
                <span className="text-[8.5px] text-amber-300 font-bold">VOLTAGE COLLAPSE</span>
              </div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
};
