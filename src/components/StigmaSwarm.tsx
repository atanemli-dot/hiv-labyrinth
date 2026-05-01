import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../context/GameContext';

export interface StigmaSwarmProps {
  position: [number, number, number];
  onDispersed: () => void;
  onEngulf: (fogDensity: number) => void;
}

export const StigmaSwarm: React.FC<StigmaSwarmProps> = ({ position, onDispersed, onEngulf }) => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  const { factCheckCount, useFactCheck } = useGame();
  
  const [isDispersing, setIsDispersing] = useState(false);
  const [hudMessage, setHudMessage] = useState<string | null>(null);
  const [lightIntensity, setLightIntensity] = useState(0);

  const { scene, camera } = useThree();

  // 12 adet küçük küre konfigürasyonu
  const spheres = useMemo(() => {
    return Array.from({ length: 12 }).map(() => {
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );
      const phase = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random();
      const velocity = offset.clone().normalize().multiplyScalar(4 + Math.random() * 2);
      return { offset, phase, speed, velocity };
    });
  }, []);

  const basePosition = useRef(new THREE.Vector3(...position));
  const fogRef = useRef<THREE.FogExp2 | null>(null);

  useEffect(() => {
    // Sahneye FogExp2 ekle
    const fog = new THREE.FogExp2(0x1a0a2e, 0);
    scene.fog = fog;
    fogRef.current = fog;
    
    return () => {
      scene.fog = null; // Unmount olunca temizle
      if (camera instanceof THREE.PerspectiveCamera) {
          camera.far = 50; // Eski haline döndür
          camera.updateProjectionMatrix();
      }
    };
  }, [scene, camera]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f' && !isDispersing) {
        if (useFactCheck()) {
          setIsDispersing(true);
          setLightIntensity(5);
        } else {
          setHudMessage("FİŞEK YOK");
          setTimeout(() => setHudMessage(null), 1500);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [useFactCheck, isDispersing]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    if (isDispersing) {
      if (lightIntensity > 0) {
         // Işık patlaması kısa sürede (0.3sn) söner
         setLightIntensity(prev => Math.max(0, prev - (5 / 0.3) * delta)); 
      }
      
      let allOut = true;
      groupRef.current.children.forEach((child, i) => {
         const s = spheres[i];
         // Dışa doğru hız vektörü uygulanır
         child.position.addScaledVector(s.velocity, delta);
         if (child.position.length() < 20) allOut = false;
      });
      
      if (lightRef.current) lightRef.current.position.copy(groupRef.current.position);

      if (allOut) {
         onDispersed();
         if (fogRef.current) fogRef.current.density = 0;
         if (camera instanceof THREE.PerspectiveCamera) {
           camera.far = 50;
           camera.updateProjectionMatrix();
         }
      }
    } else {
       // Sürünün oyuncuya olan mesafesi
       const dist = camera.position.distanceTo(basePosition.current);
       
       if (dist <= 8) {
           // Kamera hedefine yavaşça (lerp 0.02) ilerler
           basePosition.current.lerp(camera.position, 0.02 * delta * 60); 
           
           // Görüş mesafesini kapatan sis efekti interpole edilir (8 -> 0 distance => 0 -> 1 factor)
           const factor = Math.max(0, 1 - (dist / 8));
           onEngulf(factor);
           
           if (fogRef.current) {
             fogRef.current.density = factor * 0.4;
           }
           
           if (camera instanceof THREE.PerspectiveCamera) {
             camera.far = THREE.MathUtils.lerp(50, 3, factor);
             camera.updateProjectionMatrix();
           }
       }
       
       groupRef.current.position.copy(basePosition.current);
       if (lightRef.current) lightRef.current.position.copy(groupRef.current.position);

       // Swimming animasyonu (Perlin/Sine tabanlı otonom yüzme)
       groupRef.current.children.forEach((child, i) => {
           const s = spheres[i];
           child.position.x = s.offset.x + Math.sin(time * s.speed + s.phase) * 0.5;
           child.position.y = s.offset.y + Math.cos(time * s.speed + s.phase) * 0.5;
           child.position.z = s.offset.z + Math.sin(time * s.speed * 0.8 + s.phase) * 0.5;
       });
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {spheres.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial 
              color="#2D1B69" 
              emissive="#6B21A8" 
              emissiveIntensity={1}
              transparent 
              opacity={0.7} 
            />
          </mesh>
        ))}
      </group>
      
      {/* FactCheck Işık Patlaması */}
      <pointLight 
        ref={lightRef} 
        intensity={lightIntensity} 
        color="#ffffff" 
        distance={20}
      />
      
      {/* HUD Geri Bildirimi */}
      {hudMessage && (
        <Html center zIndexRange={[1000, 0]} transform={false}>
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 pointer-events-none bg-red-600 border-2 border-red-900 text-white font-bold px-6 py-3 rounded shadow-[0_0_15px_rgba(220,38,38,0.8)] text-xl backdrop-blur-md">
             {hudMessage}
          </div>
        </Html>
      )}
    </>
  );
};

export default StigmaSwarm;

/*
// ==========================================
// Labyrinth.tsx ENTEGRASYON ÖRNEĞİ:
// ==========================================

import { StigmaSwarm } from './StigmaSwarm';

export function Labyrinth({ ...props }) {
  // ... diğer state'ler
  const [showSwarm, setShowSwarm] = useState(true);

  return (
    <Canvas>
      <PerspectiveCamera makeDefault fov={75} far={50} position={[0, 1.5, 5]} />
      // ... diğer bileşenler
      
      {showSwarm && (
        <StigmaSwarm 
          position={[0, 1.5, 0]} 
          onDispersed={() => setShowSwarm(false)} 
          onEngulf={(density) => {
            // Ekranda (HUD'de) mor bir vigneting efekti göstermek veya sesi kısmak için kullanılır
            // console.log("Stigma fog density:", density);
          }} 
        />
      )}
    </Canvas>
  );
}
*/
