import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface ViralZone {
  id: string;
  center: [number, number]; // x, z (y is fixed 0)
  radius: number;
  tip: 'viral' | 'guvenli';
}

export interface ViralZeminProps {
  zones: ViralZone[];
  playerPosition: THREE.Vector3;
  shieldActive: boolean;
  onDamage: (amount: number) => void;
}

export const ViralZemin: React.FC<ViralZeminProps> = ({
  zones,
  playerPosition,
  shieldActive,
  onDamage
}) => {
  const materialRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useFrame((state, delta) => {
    // Pulsing effect for viral zones
    materialRefs.current.forEach((mat, i) => {
      if (mat && zones[i].tip === 'viral') {
         mat.emissiveIntensity = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.5;
      }
    });

    // Damage logic: Check if player is in any viral zone
    if (!shieldActive) {
      let isInsideViral = false;
      for (const zone of zones) {
        if (zone.tip === 'viral') {
           const dx = playerPosition.x - zone.center[0];
           const dz = playerPosition.z - zone.center[1];
           const distance = Math.sqrt(dx * dx + dz * dz);
           if (distance <= zone.radius) {
             isInsideViral = true;
             break;
           }
        }
      }

      if (isInsideViral) {
        // 2 damage per second
        onDamage(2 * delta);
      }
    }
  });

  return (
    <>
      {zones.map((zone, i) => {
        const isViral = zone.tip === 'viral';
        return (
          <mesh 
            key={zone.id} 
            position={[zone.center[0], 0.01, zone.center[1]]} // slightly above ground
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={1}
          >
            <circleGeometry args={[zone.radius, 32]} />
            <meshStandardMaterial
              ref={(el) => {
                if (el) materialRefs.current[i] = el;
              }}
              color={isViral ? '#FF2D55' : '#00E5B0'}
              emissive={isViral ? '#FF2D55' : '#000000'}
              transparent
              opacity={isViral ? 0.35 : 0.2}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* Visual Shield Effect on the Player's Feet */}
      {shieldActive && (
        <mesh 
          position={[playerPosition.x, 0.02, playerPosition.z]} 
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={2}
        >
          <circleGeometry args={[0.8, 32]} />
          <meshBasicMaterial 
            color="#00E5B0" 
            transparent 
            opacity={0.6}
            depthWrite={false}
          />
        </mesh>
      )}
    </>
  );
};

export default ViralZemin;
