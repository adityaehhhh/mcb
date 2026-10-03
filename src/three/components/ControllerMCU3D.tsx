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

export const ControllerMCU3D: React.FC<Props> = ({
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
  const txLedRef = useRef<THREE.MeshBasicMaterial>(null);
  const isRunning = status === 'ACTIVE' || status === 'ENERGIZED';

  // Flash TX/RX LEDs when running
  useFrame(({ clock }) => {
    if (txLedRef.current) {
      if (isRunning) {
        const flash = Math.sin(clock.getElapsedTime() * 25) > 0;
        txLedRef.current.color.set(flash ? '#38bdf8' : '#0369a1');
      } else {
        txLedRef.current.color.set('#0369a1');
      }
    }
  });

  const pcbMaterial = new THREE.MeshStandardMaterial({
    color: isDimmed ? '#0f172a' : (isSelected ? '#0284c7' : '#0f2937'), // Industrial Matte Dark Teal/Black PCB
    roughness: 0.35,
    metalness: 0.2,
    transparent: isXRay || isDimmed,
    opacity: isDimmed ? 0.3 : (isXRay ? 0.4 : 1.0),
  });

  const rfShieldMaterial = new THREE.MeshStandardMaterial({
    color: '#cbd5e1', // Silvery ESP32-WROOM RF Shield Can
    roughness: 0.2,
    metalness: 0.95,
  });

  const pinHeaderMaterial = new THREE.MeshStandardMaterial({
    color: '#090d13',
    roughness: 0.6,
    metalness: 0.3,
  });

  const goldPinMaterial = new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    roughness: 0.2,
    metalness: 0.9,
  });

  const metalPortMaterial = new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    metalness: 0.95,
    roughness: 0.15,
  });

  const standoffMaterial = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    metalness: 0.9,
    roughness: 0.2,
  });

  return (
    <group
      position={[0.58 + explodedOffset[0], 0.22 + explodedOffset[1], 0.32 + explodedOffset[2]]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* 4 Brass/Nylon PCB Standoff Spacers on Mounting Backboard */}
      {[
        [-0.10, -0.07],
        [0.10, -0.07],
        [-0.10, 0.07],
        [0.10, 0.07]
      ].map(([sx, sy], idx) => (
        <mesh key={`standoff-${idx}`} position={[sx, sy, -0.02]} material={standoffMaterial}>
          <cylinderGeometry args={[0.005, 0.005, 0.04, 12]} />
        </mesh>
      ))}

      {/* ESP32 Main PCB Base */}
      <mesh material={pcbMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.16, 0.012]} />
      </mesh>

      {/* ESP-WROOM-32 Metal RF Module Can */}
      <mesh position={[0.02, 0.02, 0.014]} material={rfShieldMaterial} castShadow>
        <boxGeometry args={[0.10, 0.09, 0.015]} />
      </mesh>

      {/* PCB Trace Antenna (Top Copper Section) */}
      <mesh position={[0.02, 0.068, 0.008]}>
        <boxGeometry args={[0.09, 0.015, 0.004]} />
        <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* CP2102 / CH340 USB-UART IC Chip */}
      <mesh position={[-0.05, -0.04, 0.01]}>
        <boxGeometry args={[0.03, 0.03, 0.008]} />
        <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Micro-USB / Type-C Connector (Metal Shell) */}
      <mesh position={[-0.105, 0, 0.015]} material={metalPortMaterial} castShadow>
        <boxGeometry args={[0.025, 0.04, 0.02]} />
      </mesh>

      {/* Top 15-Pin Female / Male Header Socket */}
      <mesh position={[0, 0.065, 0.015]} material={pinHeaderMaterial}>
        <boxGeometry args={[0.19, 0.014, 0.02]} />
      </mesh>

      {/* Bottom 15-Pin Female / Male Header Socket */}
      <mesh position={[0, -0.065, 0.015]} material={pinHeaderMaterial}>
        <boxGeometry args={[0.19, 0.014, 0.02]} />
      </mesh>

      {/* Gold Header Pin Pins along socket */}
      {[-0.08, -0.04, 0, 0.04, 0.08].map((px, i) => (
        <group key={`mcu-pin-t-${i}`} position={[px, 0.065, 0.026]}>
          <mesh material={goldPinMaterial}>
            <boxGeometry args={[0.004, 0.004, 0.01]} />
          </mesh>
        </group>
      ))}
      {[-0.08, -0.04, 0, 0.04, 0.08].map((px, i) => (
        <group key={`mcu-pin-b-${i}`} position={[px, -0.065, 0.026]}>
          <mesh material={goldPinMaterial}>
            <boxGeometry args={[0.004, 0.004, 0.01]} />
          </mesh>
        </group>
      ))}

      {/* Red Power 3.3V LED */}
      <mesh position={[0.08, 0.05, 0.012]}>
        <cylinderGeometry args={[0.003, 0.003, 0.004, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Blue / Cyan GPIO2 & TX/RX Communication LED */}
      <mesh position={[0.08, 0.03, 0.012]}>
        <cylinderGeometry args={[0.003, 0.003, 0.004, 8]} />
        <meshBasicMaterial ref={txLedRef} color="#38bdf8" />
      </mesh>

      {/* EN (Reset) Tactile Push Button */}
      <mesh position={[-0.08, 0.04, 0.014]}>
        <boxGeometry args={[0.015, 0.015, 0.012]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* BOOT Tactile Push Button */}
      <mesh position={[-0.08, -0.04, 0.014]}>
        <boxGeometry args={[0.015, 0.015, 0.012]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* Selection Glow Wireframe */}
      {isSelected && (
        <mesh position={[0, 0, 0.015]}>
          <boxGeometry args={[0.24, 0.18, 0.06]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.7} />
        </mesh>
      )}

      {/* Subtle World-Space Label near the board */}
      <Html position={[0, -0.11, 0.02]} center distanceFactor={2.4} zIndexRange={[60, 0]}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick(e);
          }}
          className={`cursor-pointer px-2 py-0.5 rounded-md border shadow-lg flex items-center gap-1.5 transition-all duration-150 hover:scale-105 active:scale-95 select-none ${
            isSelected
              ? 'bg-slate-950/95 border-teal-400 text-teal-300 ring-1 ring-teal-400/40'
              : isHovered
              ? 'bg-slate-900/90 border-slate-500 text-slate-100'
              : 'bg-slate-950/85 border-slate-700/80 text-slate-300 hover:border-slate-500'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
          <div className="flex flex-col text-left leading-none">
            <span className="text-[7px] text-slate-400 uppercase font-mono">ESP32</span>
            <span className="text-[8px] font-bold font-mono tracking-wide text-slate-200">CONTROL UNIT</span>
          </div>
        </div>
      </Html>
    </group>
  );
};
