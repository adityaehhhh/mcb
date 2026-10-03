import React from 'react';
import * as THREE from 'three';

interface Props {
  isXRay: boolean;
  explodedOffset?: [number, number, number];
}

export const BackboardAndRails: React.FC<Props> = ({ isXRay, explodedOffset = [0, 0, 0] }) => {
  // White insulating backboard material
  const boardMaterial = new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    roughness: 0.7,
    metalness: 0.1,
    transparent: isXRay,
    opacity: isXRay ? 0.35 : 1.0,
  });

  // Galvanized 35mm DIN rail material
  const dinRailMaterial = new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    metalness: 0.9,
    roughness: 0.25,
  });

  // Slotted PVC cable duct material
  const ductMaterial = new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    roughness: 0.5,
    metalness: 0.2,
  });

  return (
    <group position={explodedOffset}>
      {/* Upper Main Control Backboard */}
      <mesh position={[0, 0.45, 0.2]} material={boardMaterial} receiveShadow>
        <boxGeometry args={[1.65, 0.7, 0.015]} />
      </mesh>

      {/* Middle Backboard */}
      <mesh position={[0, -0.15, 0.2]} material={boardMaterial} receiveShadow>
        <boxGeometry args={[1.65, 0.45, 0.015]} />
      </mesh>

      {/* Lower Load Chamber Backboard */}
      <mesh position={[0, -0.75, 0.2]} material={boardMaterial} receiveShadow>
        <boxGeometry args={[1.65, 0.35, 0.015]} />
      </mesh>

      {/* Top DIN Rail for MCB, Contactor, Relays */}
      <mesh position={[0, 0.45, 0.22]} material={dinRailMaterial} castShadow>
        <boxGeometry args={[1.58, 0.035, 0.01]} />
      </mesh>

      {/* Middle DIN Rail for Terminal Blocks, SMPS, Sensors */}
      <mesh position={[0, -0.15, 0.22]} material={dinRailMaterial} castShadow>
        <boxGeometry args={[1.58, 0.035, 0.01]} />
      </mesh>

      {/* Lower DIN / Standoff Rail for Load Coils */}
      <mesh position={[0, -0.75, 0.22]} material={dinRailMaterial} castShadow>
        <boxGeometry args={[1.58, 0.035, 0.01]} />
      </mesh>

      {/* Upper Wiring Duct (Horizontal) */}
      <mesh position={[0, 0.75, 0.22]} material={ductMaterial} castShadow>
        <boxGeometry args={[1.58, 0.04, 0.03]} />
      </mesh>

      {/* Middle Wiring Duct (Horizontal) */}
      <mesh position={[0, 0.15, 0.22]} material={ductMaterial} castShadow>
        <boxGeometry args={[1.58, 0.04, 0.03]} />
      </mesh>

      {/* Lower Wiring Duct (Horizontal) */}
      <mesh position={[0, -0.45, 0.22]} material={ductMaterial} castShadow>
        <boxGeometry args={[1.58, 0.04, 0.03]} />
      </mesh>

      {/* Vertical Wiring Duct Left */}
      <mesh position={[-0.8, 0.1, 0.22]} material={ductMaterial} castShadow>
        <boxGeometry args={[0.04, 1.4, 0.03]} />
      </mesh>

      {/* Vertical Wiring Duct Right */}
      <mesh position={[0.8, 0.1, 0.22]} material={ductMaterial} castShadow>
        <boxGeometry args={[0.04, 1.4, 0.03]} />
      </mesh>
    </group>
  );
};
