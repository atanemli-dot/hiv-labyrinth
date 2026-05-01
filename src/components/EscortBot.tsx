import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export interface EscortBotProps {
  id: string;
  startPosition: [number, number, number];
  targetPosition: [number, number, number];
  playerPosition: THREE.Vector3;
  threats: THREE.Vector3[];
  shieldFromPlayer: boolean;
  onReachedTarget: (id: string) => void;
  onDestroyed: (id: string) => void;
}

export const EscortBot: React.FC<EscortBotProps> = ({
  id,
  startPosition,
  targetPosition,
  playerPosition,
  threats,
  shieldFromPlayer,
  onReachedTarget,
  onDestroyed
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const currentPos = useRef(new THREE.Vector3(...startPosition));
  const targetVec = useMemo(() => new THREE.Vector3(...targetPosition), [targetPosition]);
  const isFinishedMessageSent = useRef(false);

  useFrame((state, delta) => {
    if (!groupRef.current || isFinishedMessageSent.current) return;

    // Hedefe veya tehlikeye olan mesafeleri kontrol et
    if (currentPos.current.distanceTo(targetVec) < 1.0) {
      isFinishedMessageSent.current = true;
      onReachedTarget(id);
      return;
    }

    let destroyed = false;
    for (const threat of threats) {
      if (currentPos.current.distanceTo(threat) < 1.0) {
        destroyed = true;
        break;
      }
    }
    if (destroyed) {
      isFinishedMessageSent.current = true;
      onDestroyed(id);
      return;
    }

    const distToPlayer = currentPos.current.distanceTo(playerPosition);
    const time = state.clock.elapsedTime;
    let isFleeing = false;
    let fleeVector = new THREE.Vector3();

    // Tehditten kaçma kontrolü (4 birim)
    for (const threat of threats) {
      const dist = currentPos.current.distanceTo(threat);
      if (dist < 4.0) {
        isFleeing = true;
        const away = new THREE.Vector3().subVectors(currentPos.current, threat).normalize();
        // kaçış vektörü = tehditten uzaklaşan normalize vektör * 0.03
        fleeVector.add(away.multiplyScalar(0.03));
      }
    }

    if (isFleeing) {
      // 60fps bağımsız hale getirmek için delta kullanıyoruz (0.03 per frame => 0.03 * delta * 60)
      const correction = delta * 60;
      currentPos.current.add(fleeVector.multiplyScalar(correction));
    } else {
      if (distToPlayer <= 2.0) {
        // Oyncuya doğru yavaş git (lerp 0.008)
        const correction = delta * 60; // frame rate bağımsız lerp yaklaşımı (yaklaşık)
        currentPos.current.lerp(playerPosition, 0.008 * correction);
      } else {
        // Dur ve titriyor
        currentPos.current.x += (Math.random() - 0.5) * 0.02;
        currentPos.current.z += (Math.random() - 0.5) * 0.02;
      }
    }

    // Yükseklik sabitleme veya havada kalma
    currentPos.current.y = 0.5 + Math.sin(time * 3) * 0.1;
    groupRef.current.position.copy(currentPos.current);

    // Halkanın dönmesi
    if (shieldFromPlayer && ringRef.current) {
      ringRef.current.rotation.x += delta;
      ringRef.current.rotation.y += delta;
      ringRef.current.rotation.z += delta;
    }
  });

  return (
    <group ref={groupRef} position={startPosition}>
      {/* Bot'un kendisi (hasarlı sarı küre) */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#FFD93D" 
          transparent 
          opacity={0.8} 
          emissive="#FFD93D"
          emissiveIntensity={0.3}
          wireframe={true} // yorgun/hasarlı görünümü desteklemek için
        />
      </mesh>

      {/* Etiket */}
      <Text 
        position={[0, 0.5, 0]} 
        fontSize={0.15} 
        color="#ffffff" 
        outlineWidth={0.02} 
        outlineColor="#000000"
      >
        VERI_PKT
      </Text>

      {/* Kalkan Halkası */}
      {shieldFromPlayer && (
        <mesh ref={ringRef}>
          <torusGeometry args={[0.5, 0.02, 16, 32]} />
          <meshBasicMaterial color="#00E5B0" />
        </mesh>
      )}
    </group>
  );
};

export default EscortBot;
