import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ComponentStatus } from '../../types/components';

interface Props {
  coilId: 'load_coil_01' | 'load_coil_02' | 'load_coil_03';
  position: [number, number, number];
  isSelected: boolean;
  isHovered: boolean;
  status: ComponentStatus;
  isDimmed: boolean;
  isXRay: boolean;
  temp: number;
  label: string;
  explodedOffset?: [number, number, number];
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}

export const LoadCoils3D: React.FC<Props> = ({
  coilId,
  position,
  isSelected,
  isHovered,
  status,
  isDimmed,
  isXRay,
  temp,
  label,
  explodedOffset = [0, 0, 0],
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const wireGlowRef = useRef<THREE.MeshStandardMaterial>(null);
  const isActive = status === 'ACTIVE' || status === 'ENERGIZED' || status === 'OVERHEATED';

  // Spiral geometry generator for true spiral nichrome heating elements
  const spiralTurns = 9;
  const turns = useMemo(() => {
    return Array.from({ length: spiralTurns }, (_, i) => i);
  }, [spiralTurns]);

  // Animate thermal glow based on temperature & electrical loading
  useFrame(() => {
    if (wireGlowRef.current) {
      if (isActive || temp > 32) {
        const glowFactor = Math.min(1.0, (temp - 25) / 45);
        if (status === 'OVERHEATED') {
          wireGlowRef.current.emissive.set('#ef4444');
          wireGlowRef.current.emissiveIntensity = 0.95;
        } else if (temp > 50) {
          wireGlowRef.current.emissive.set('#ff4500'); // Hot orange-red
          wireGlowRef.current.emissiveIntensity = 0.85;
        } else {
          wireGlowRef.current.emissive.set('#ea580c'); // Warm amber-orange
          wireGlowRef.current.emissiveIntensity = Math.max(0.25, glowFactor * 0.7);
        }
      } else {
        wireGlowRef.current.emissive.set('#000000');
        wireGlowRef.current.emissiveIntensity = 0;
      }
    }
  });

  const ceramicMaterial = new THREE.MeshStandardMaterial({
    color: '#e2e8f0', // Steatite ceramic cylinder core
    roughness: 0.35,
    metalness: 0.05,
    transparent: isXRay || isDimmed,
    opacity: isDimmed ? 0.3 : (isXRay ? 0.4 : 1.0),
  });

  const basePlateMaterial = new THREE.MeshStandardMaterial({
    color: '#1e293b', // Dark anodized base mounting bracket
    metalness: 0.7,
    roughness: 0.4,
  });

  const brassTerminalMaterial = new THREE.MeshStandardMaterial({
    color: '#d97706',
    metalness: 0.85,
    roughness: 0.2,
  });

  const wireColor = isSelected ? '#38bdf8' : (isHovered ? '#60a5fa' : '#57534e');

  return (
    <group
      position={[
        position[0] + explodedOffset[0],
        position[1] + explodedOffset[1],
        position[2] + explodedOffset[2],
      ]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Base Standoff Mounting Bracket */}
      <mesh position={[0, -0.09, 0]} material={basePlateMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.26, 0.02, 0.14]} />
      </mesh>

      {/* Central High-Temperature Ceramic Spool Tube */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={ceramicMaterial} castShadow>
        <cylinderGeometry args={[0.032, 0.032, 0.22, 24]} />
      </mesh>

      {/* Left and Right Ceramic End Flanges */}
      <mesh position={[-0.105, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={ceramicMaterial}>
        <cylinderGeometry args={[0.048, 0.048, 0.015, 24]} />
      </mesh>
      <mesh position={[0.105, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={ceramicMaterial}>
        <cylinderGeometry args={[0.048, 0.048, 0.015, 24]} />
      </mesh>

      {/* Heavy Spiral Nichrome Heating Wire Turns */}
      <group position={[0, 0, 0]}>
        {turns.map((i) => {
          const x = -0.08 + (i / (spiralTurns - 1)) * 0.16;
          return (
            <mesh key={`spiral-turn-${i}`} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <torusGeometry args={[0.038, 0.0055, 12, 24]} />
              <meshStandardMaterial
                ref={i === 0 ? wireGlowRef : undefined}
                color={wireColor}
                metalness={0.75}
                roughness={0.3}
              />
            </mesh>
          );
        })}
      </group>

      {/* Heavy Brass Terminal Posts (Top & Bottom Feeders) */}
      <mesh position={[-0.09, 0.055, 0]} material={brassTerminalMaterial}>
        <cylinderGeometry args={[0.007, 0.007, 0.035, 12]} />
      </mesh>
      <mesh position={[0.09, 0.055, 0]} material={brassTerminalMaterial}>
        <cylinderGeometry args={[0.007, 0.007, 0.035, 12]} />
      </mesh>

      {/* Selection Glow Box */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.29, 0.16, 0.16]} />
          <meshBasicMaterial color="#ef4444" wireframe transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
};
