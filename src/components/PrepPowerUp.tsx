import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export interface PrepPowerUpProps {
  position: [number, number, number];
  tip: 'prep' | 'vpn'; // modüle göre farklı görsel/etiket
  onCollect: (tip: 'prep' | 'vpn', duration: number) => void;
  collected: boolean;
}

export const PrepPowerUp: React.FC<PrepPowerUpProps> = ({
  position,
  tip,
  onCollect,
  collected
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = tip === 'prep' ? '#00E5B0' : '#4F46E5';
  const label = tip === 'prep' ? 'PrEP' : 'VPN';
  
  const [exploding, setExploding] = useState(false);
  const particles = useRef<{ pos: THREE.Vector3; vel: THREE.Vector3 }[]>([]);

  // Setup explosion particles only once when exploding begins
  if (!collected && !exploding) {
     if (particles.current.length > 0) particles.current = [];
  }

  useFrame((state, delta) => {
    // Toplanma kontrolü
    if (!collected && !exploding && meshRef.current) {
      meshRef.current.rotation.y += delta; // yavaş dönme

      const playerPos = state.camera.position; // Labyrinth.tsx'te genelde camera = oyuncudur
      // Toplama alanı: 1 birim mesafe
      if (playerPos.distanceTo(meshRef.current.position) < 1.0) {
        setExploding(true);
        // Patlama partiküllerini oluştur
        for (let i = 0; i < 8; i++) {
           particles.current.push({
             pos: new THREE.Vector3(...position),
             vel: new THREE.Vector3(
               (Math.random() - 0.5) * 5,
               (Math.random() - 0.5) * 5,
               (Math.random() - 0.5) * 5
             )
           });
        }
        
        // 30000ms = 30 second protection duration
        onCollect(tip, 30000); 
        
        // 0.5 saniye sonra patlamayı temizle
        setTimeout(() => {
          setExploding(false);
        }, 500);
      }
    }
  });

  if (collected && !exploding) return null;

  if (exploding) {
    // Render the explosion effect (8 small moving spheres)
    return (
      <group>
        {particles.current.map((p, i) => (
           <Particle key={i} p={p} color={color} />
        ))}
      </group>
    );
  }

  // Render the uncollected power-up
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
        transparent 
        opacity={0.8} 
      />
      
      {/* Etiket Gösterimi */}
      <Html center position={[0, 0.7, 0]} zIndexRange={[100, 0]}>
         <div 
           className="font-bold text-white px-2 py-1 rounded shadow-lg pointer-events-none text-sm tracking-wider"
           style={{ backgroundColor: color }}
         >
           {label}
         </div>
      </Html>
    </mesh>
  );
};

// Yardımcı Particle component (Kendi içinde güncellenir)
const Particle = ({ p, color }: { p: { pos: THREE.Vector3; vel: THREE.Vector3 }, color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.addScaledVector(p.vel, delta);
    }
  });
  
  return (
    <mesh ref={meshRef} position={p.pos}>
       <sphereGeometry args={[0.1, 8, 8]} />
       <meshBasicMaterial color={color} />
    </mesh>
  );
};

export default PrepPowerUp;
