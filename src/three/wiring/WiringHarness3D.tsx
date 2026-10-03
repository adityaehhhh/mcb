import React, { useMemo } from 'react';
import * as THREE from 'three';

interface Props {
  isXRay: boolean;
  explodedOffset?: [number, number, number];
}

interface WireDef {
  points: [number, number, number][];
  color: string;
  radius: number;
}

export const WiringHarness3D: React.FC<Props> = ({ isXRay, explodedOffset = [0, 0, 0] }) => {
  // Define realistic 3D wire paths representing the physical prototype wiring
  const wireDefinitions: WireDef[] = useMemo(() => [
    // 1. Mains Live Phase IN (Red): Terminal Block -> MCB Top Terminal
    {
      points: [
        [-0.08, -0.10, 0.32],
        [-0.08, 0.15, 0.32],
        [-0.65, 0.15, 0.32],
        [-0.65, 0.35, 0.32],
        [-0.65, 0.55, 0.28]
      ],
      color: '#ef4444', // Red Phase
      radius: 0.005
    },

    // 2. MCB Bottom Phase OUT -> Contactor Line Terminal L1 (Red)
    {
      points: [
        [-0.65, 0.35, 0.28],
        [-0.65, 0.22, 0.32],
        [-0.06, 0.22, 0.32],
        [-0.06, 0.54, 0.32]
      ],
      color: '#ef4444',
      radius: 0.005
    },

    // 3. Contactor Terminal T1 -> Current Sensor ACS758 IN (Red)
    {
      points: [
        [-0.06, 0.36, 0.32],
        [-0.06, 0.15, 0.32],
        [-0.39, 0.15, 0.32],
        [-0.39, 0.12, 0.33]
      ],
      color: '#ef4444',
      radius: 0.005
    },

    // 4. Current Sensor OUT -> Downstream Fault Point & Coil 1 IN (Red)
    {
      points: [
        [-0.31, 0.12, 0.33],
        [-0.31, -0.15, 0.32],
        [-0.48, -0.28, 0.32],
        [-0.52, -0.50, 0.32],
        [-0.52, -0.70, 0.28]
      ],
      color: '#ef4444',
      radius: 0.0055
    },

    // 5. Coil 1 to Coil 2 Interconnect (Red)
    {
      points: [
        [-0.43, -0.70, 0.28],
        [-0.25, -0.65, 0.28],
        [-0.09, -0.70, 0.28]
      ],
      color: '#ef4444',
      radius: 0.005
    },

    // 6. Coil 2 to Coil 3 Interconnect (Red)
    {
      points: [
        [0.09, -0.70, 0.28],
        [0.25, -0.65, 0.28],
        [0.43, -0.70, 0.28]
      ],
      color: '#f97316',
      radius: 0.005
    },

    // 7. Load Coil Bank Return -> Terminal Block Neutral N (Blue)
    {
      points: [
        [0.52, -0.70, 0.28],
        [0.52, -0.45, 0.32],
        [0.08, -0.45, 0.32],
        [0.08, -0.21, 0.32]
      ],
      color: '#0284c7', // Blue Neutral
      radius: 0.005
    },

    // 8. Contactor Aux NO Feedback -> Controller MCU Digital Pin (Yellow)
    {
      points: [
        [0.06, 0.54, 0.32],
        [0.06, 0.68, 0.32],
        [0.62, 0.68, 0.32],
        [0.62, 0.18, 0.32]
      ],
      color: '#eab308', // Yellow Signal
      radius: 0.003
    },

    // 9. Relay Module Ch1 -> Contactor Coil A1/A2 (Orange)
    {
      points: [
        [0.58, 0.51, 0.32],
        [0.58, 0.62, 0.32],
        [-0.07, 0.62, 0.32],
        [-0.07, 0.49, 0.34]
      ],
      color: '#f97316', // Orange Control
      radius: 0.0035
    },

    // 10. SMPS +5V/GND -> Microcontroller & LCD Display (Purple/Black)
    {
      points: [
        [-0.58, -0.24, 0.32],
        [-0.58, -0.05, 0.32],
        [0.55, -0.05, 0.32],
        [0.55, 0.08, 0.32]
      ],
      color: '#8b5cf6', // DC Power
      radius: 0.0035
    },

    // 11. Emergency Stop Loop (Red)
    {
      points: [
        [-0.65, 0.88, 0.34],
        [-0.65, 0.75, 0.32],
        [0.0, 0.75, 0.32],
        [0.0, 0.55, 0.32]
      ],
      color: '#dc2626',
      radius: 0.004
    }
  ], []);

  // Build 3D Bézier tube geometries
  const wireMeshes = useMemo(() => {
    return wireDefinitions.map((def, idx) => {
      const vPoints = def.points.map((p) => new THREE.Vector3(...p));
      const curve = new THREE.CatmullRomCurve3(vPoints, false, 'catmullrom', 0.2);
      const geometry = new THREE.TubeGeometry(curve, 64, def.radius, 8, false);
      const material = new THREE.MeshStandardMaterial({
        color: def.color,
        roughness: 0.4,
        metalness: 0.1,
        transparent: isXRay,
        opacity: isXRay ? 0.35 : 1.0,
      });

      return <mesh key={`wire-mesh-${idx}`} geometry={geometry} material={material} castShadow />;
    });
  }, [wireDefinitions, isXRay]);

  return (
    <group position={explodedOffset}>
      {wireMeshes}
    </group>
  );
};
