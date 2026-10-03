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

export const RelayModule3D: React.FC<Props> = ({
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
  const isActive = status === 'ACTIVE' || status === 'ENERGIZED';

  const pcbMaterial = new THREE.MeshStandardMaterial({
    color: isDimmed ? '#1e3a8a' : (isSelected ? '#0284c7' : '#1e40af'),
    roughness: 0.4,
    metalness: 0.1,
    transparent: isXRay || isDimmed,
    opacity: isDimmed ? 0.3 : (isXRay ? 0.4 : 1.0),
  });

  const relayCubeMaterial = new THREE.MeshStandardMaterial({
    color: '#2563eb', // Blue Songle relay cubes
    roughness: 0.2,
    metalness: 0.1,
    emissive: isActive ? '#1d4ed8' : '#000000',
    emissiveIntensity: isActive ? 0.3 : 0,
  });

  const terminalBlockMaterial = new THREE.MeshStandardMaterial({
    color: '#15803d', // Green screw terminals
    roughness: 0.5,
  });

  const ledMaterial = new THREE.MeshBasicMaterial({
    color: isActive ? '#ef4444' : '#334155', // Red channel active LEDs
  });

  return (
    <group
      position={[0.65 + explodedOffset[0], 0.45 + explodedOffset[1], 0.28 + explodedOffset[2]]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Blue PCB Board Base */}
      <mesh material={pcbMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.16, 0.01]} />
      </mesh>

      {/* 4 Blue Relay Cubes */}
      {[-0.075, -0.025, 0.025, 0.075].map((x, i) => (
        <group key={`relay-cube-${i}`} position={[x, 0.01, 0.025]}>
          <mesh material={relayCubeMaterial} castShadow>
            <boxGeometry args={[0.04, 0.075, 0.04]} />
          </mesh>
          {/* Status Indicator SMD LED */}
          <mesh position={[0, -0.05, 0.01]} material={ledMaterial}>
            <cylinderGeometry args={[0.003, 0.003, 0.005, 8]} />
          </mesh>
        </group>
      ))}

      {/* Green 3-Pin Screw Terminal Blocks on Top Edge */}
      {[-0.075, -0.025, 0.025, 0.075].map((x, i) => (
        <mesh key={`relay-term-${i}`} position={[x, 0.065, 0.02]} material={terminalBlockMaterial} castShadow>
          <boxGeometry args={[0.038, 0.025, 0.03]} />
        </mesh>
      ))}

      {/* 4-Pin Logic Header on Bottom Edge */}
      <mesh position={[0, -0.065, 0.015]}>
        <boxGeometry args={[0.1, 0.015, 0.02]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Selection Glow */}
      {isSelected && (
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.24, 0.18, 0.07]} />
          <meshBasicMaterial color="#818cf8" wireframe transparent opacity={0.65} />
        </mesh>
      )}
    </group>
  );
};
