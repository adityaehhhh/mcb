import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ComponentStatus } from '../../types/components';

interface Props {
  isSelected: boolean;
  isHovered: boolean;
  status: ComponentStatus;
  isDimmed: boolean;
  isXRay: boolean;
  voltage: number;
  current: number;
  temp: number;
  stageIndex: number;
  stageTitle?: string;
  verdict?: string;
  isRunning?: boolean;
  explodedOffset?: [number, number, number];
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}

export const LCDDisplay3D: React.FC<Props> = ({
  isSelected,
  isHovered,
  status,
  isDimmed,
  isXRay,
  voltage,
  current,
  temp,
  stageIndex,
  stageTitle = 'READY',
  verdict = 'IDLE',
  isRunning = false,
  explodedOffset = [0, 0, 0],
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  // Generate dynamic canvas texture for realistic 20x4 LCD text
  const lcdTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Blue LCD background
      ctx.fillStyle = '#0a2e6b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pixel matrix grid line effect
      ctx.fillStyle = 'rgba(0, 10, 40, 0.25)';
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 1);
      }

      // High-contrast bright blue/white LCD font
      ctx.fillStyle = '#e0f2fe';
      ctx.font = 'bold 34px monospace';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;

      if (!isRunning && verdict === 'IDLE') {
        ctx.fillText('MCB TEST SYSTEM', 24, 52);
        ctx.fillText('STATUS: READY', 24, 108);
        ctx.fillText(`V: 230.0V  I: 0.00A`, 24, 164);
        ctx.fillText(`TEMP: ${temp.toFixed(1)}C  IS/IEC`, 24, 220);
      } else if (status === 'TRIPPED') {
        ctx.fillText('*** MCB TRIPPED ***', 24, 52);
        ctx.fillText('CONTACTS OPEN: 0.00A', 24, 108);
        ctx.fillText(`V: 0.0V  TEMP:${temp.toFixed(1)}C`, 24, 164);
        ctx.fillText(`RESULT: TRIP VERIFIED`, 24, 220);
      } else if (current > 35) {
        ctx.fillText('! HIGH CURRENT !', 24, 52);
        ctx.fillText(`CURRENT: ${current.toFixed(2)} A`, 24, 108);
        ctx.fillText(`VOLTAGE: ${voltage.toFixed(1)} V`, 24, 164);
        ctx.fillText(`STAGE: ${stageIndex}/12 ACTIVE`, 24, 220);
      } else if (isRunning) {
        ctx.fillText('TEST RUNNING...', 24, 52);
        ctx.fillText(`CURRENT: ${current.toFixed(2)} A`, 24, 108);
        ctx.fillText(`VOLTAGE: ${voltage.toFixed(1)} V`, 24, 164);
        ctx.fillText(`STAGE ${stageIndex}: ${stageTitle.substring(0, 12)}`, 24, 220);
      } else {
        ctx.fillText(`TEST FINISHED`, 24, 52);
        ctx.fillText(`VERDICT: ${verdict}`, 24, 108);
        ctx.fillText(`I: ${current.toFixed(2)}A V: ${voltage.toFixed(1)}V`, 24, 164);
        ctx.fillText(`TEMP: ${temp.toFixed(1)}C SAFE`, 24, 220);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [voltage, current, temp, stageIndex, stageTitle, verdict, isRunning, status]);

  const bezelMaterial = new THREE.MeshStandardMaterial({
    color: isDimmed ? '#1e293b' : (isSelected ? '#0284c7' : '#0f172a'),
    roughness: 0.5,
    metalness: 0.2,
    transparent: isXRay || isDimmed,
    opacity: isDimmed ? 0.3 : (isXRay ? 0.4 : 1.0),
  });

  const pcbMaterial = new THREE.MeshStandardMaterial({
    color: '#15803d', // Green PCB behind bezel
    roughness: 0.4,
  });

  const screenMaterial = new THREE.MeshBasicMaterial({
    map: lcdTexture,
  });

  return (
    <group
      position={[0.65 + explodedOffset[0], 0.95 + explodedOffset[1], 0.32 + explodedOffset[2]]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Green LCD PCB Board */}
      <mesh material={pcbMaterial} castShadow>
        <boxGeometry args={[0.26, 0.14, 0.012]} />
      </mesh>

      {/* Black Plastic Outer Frame Bezel */}
      <mesh position={[0, 0, 0.01]} material={bezelMaterial} castShadow>
        <boxGeometry args={[0.22, 0.10, 0.015]} />
      </mesh>

      {/* Glowing 20x4 Alphanumeric LCD Glass Face */}
      <mesh position={[0, 0, 0.019]} material={screenMaterial}>
        <planeGeometry args={[0.19, 0.075]} />
      </mesh>

      {/* 4 Corner Brass Mounting Standoff Screws */}
      {[-0.11, 0.11].map((x) =>
        [-0.055, 0.055].map((y, i) => (
          <mesh key={`lcd-screw-${x}-${y}-${i}`} position={[x, y, 0.01]}>
            <cylinderGeometry args={[0.004, 0.004, 0.006, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
        ))
      )}

      {/* Selection Glow */}
      {isSelected && (
        <mesh position={[0, 0, 0.015]}>
          <boxGeometry args={[0.28, 0.16, 0.05]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.65} />
        </mesh>
      )}
    </group>
  );
};
