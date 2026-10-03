import React from 'react';
import * as THREE from 'three';
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

export const TerminalBlocks3D: React.FC<Props> = ({
  isSelected,
  isHovered,
  isDimmed,
  isXRay,
  explodedOffset = [0, 0, 0],
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const terminalColors = ['#64748b', '#64748b', '#0284c7', '#0284c7', '#eab308', '#22c55e']; // Phase, Neutral, Earth

  return (
    <group
      position={[0.0 + explodedOffset[0], -0.15 + explodedOffset[1], 0.28 + explodedOffset[2]]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* 6 Modular DIN-Rail Terminal Slices */}
      {terminalColors.map((col, i) => {
        const xPos = (i - 2.5) * 0.035;
        const blockMaterial = new THREE.MeshStandardMaterial({
          color: isDimmed ? '#334155' : (isSelected ? '#a855f7' : col),
          roughness: 0.4,
          metalness: 0.1,
          transparent: isXRay || isDimmed,
          opacity: isDimmed ? 0.3 : (isXRay ? 0.4 : 1.0),
        });

        return (
          <group key={`term-slice-${i}`} position={[xPos, 0, 0]}>
            <mesh material={blockMaterial} castShadow receiveShadow>
              <boxGeometry args={[0.03, 0.16, 0.09]} />
            </mesh>
            {/* Top Wire Entry & Clamping Screw */}
            <mesh position={[0, 0.065, 0.01]}>
              <cylinderGeometry args={[0.004, 0.004, 0.015, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Bottom Wire Entry & Clamping Screw */}
            <mesh position={[0, -0.065, 0.01]}>
              <cylinderGeometry args={[0.004, 0.004, 0.015, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* White Marking Tag Strip */}
            <mesh position={[0, 0, 0.046]}>
              <planeGeometry args={[0.025, 0.03]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      })}

      {/* Terminal Block End Clamps / End Brackets */}
      <mesh position={[-0.11, 0, 0]} castShadow>
        <boxGeometry args={[0.015, 0.18, 0.095]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.11, 0, 0]} castShadow>
        <boxGeometry args={[0.015, 0.18, 0.095]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Selection Glow */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.26, 0.2, 0.12]} />
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.65} />
        </mesh>
      )}
    </group>
  );
};
