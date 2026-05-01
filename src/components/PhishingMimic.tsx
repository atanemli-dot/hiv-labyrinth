import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export interface PhishingMimicProps {
  position: [number, number, number];
  onDetected: () => void;
  onFooled: () => void;
}

export const PhishingMimic: React.FC<PhishingMimicProps> = ({ 
  position, 
  onDetected, 
  onFooled 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Glitch animasyonu için baz referanslar
  const basePos = useRef(new THREE.Vector3(...position));
  const nextGlitchTime = useRef(0);
  const glitchEndTime = useRef(0);

  // Etkileşim State'leri
  const [isNear, setIsNear] = useState(false);
  const [qteActive, setQteActive] = useState(false);
  const qteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Component unmount olduğunda timer'ı temizle
  useEffect(() => {
    return () => {
      if (qteTimerRef.current) clearTimeout(qteTimerRef.current);
    };
  }, []);

  // E tuşu ile QTE başlatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && isNear && !qteActive) {
        setQteActive(true);
        // 0.8 saniye (800ms) pencere
        qteTimerRef.current = setTimeout(() => {
          setQteActive(false);
          onFooled(); // Süre dolarsa kandırıldı
        }, 800);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNear, qteActive, onFooled]);

  // "DOĞRULA" butonuna tıklandığında
  const handleVerify = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (qteActive) {
      if (qteTimerRef.current) clearTimeout(qteTimerRef.current);
      setQteActive(false);
      onDetected(); // Başarıyla doğruladı
    }
  };

  // Mesh'e direkt tıklandığında (Etkileşim butonunu atlayıp direkt basarsa)
  const handleMeshClick = (e: any) => {
    e.stopPropagation();
    if (isNear) {
      if (qteTimerRef.current) clearTimeout(qteTimerRef.current);
      setQteActive(false);
      onFooled(); // Direkt tıkladığı için kandırıldı
    }
  };

  useFrame((state) => {
    // Oyuncunun mesafesini sürekli kontrol et (2 birim mesafe)
    if (meshRef.current) {
      const dist = state.camera.position.distanceTo(basePos.current);
      if (dist <= 2 && !isNear) {
        setIsNear(true);
      } else if (dist > 2 && isNear) {
        setIsNear(false);
        // Uzaklaştığında QTE açıksa iptal et
        if (qteActive) {
          if (qteTimerRef.current) clearTimeout(qteTimerRef.current);
          setQteActive(false);
        }
      }
    }

    // Glitch Animasyonu (Her 2-3 saniyede bir, 80ms boyunca)
    const time = state.clock.elapsedTime;
    if (time > nextGlitchTime.current) {
       glitchEndTime.current = time + 0.08; // 80ms sürer
       nextGlitchTime.current = time + 2 + Math.random(); // 2 ile 3 saniye arası
    }

    if (time < glitchEndTime.current) {
       // Glitch devrede
       if (meshRef.current) {
         // ±0.02 uniform random offset
         meshRef.current.position.set(
           basePos.current.x + (Math.random() - 0.5) * 0.04,
           basePos.current.y + (Math.random() - 0.5) * 0.04,
           basePos.current.z + (Math.random() - 0.5) * 0.04
         );
       }
       if (materialRef.current) {
         materialRef.current.emissive.setHex(0xff00ff); // Glitch anında magenta
         materialRef.current.color.setHex(0xff00ff);
       }
    } else {
       // Normal Görünüm
       if (meshRef.current) {
         meshRef.current.position.copy(basePos.current);
       }
       if (materialRef.current) {
         // Sahte terminal rengi (0x00E4AE), orijinal 0x00E5B0'dan çok küçük bir farka sahip
         materialRef.current.emissive.setHex(0x00E4AE);
         materialRef.current.color.setHex(0x00E4AE);
       }
    }
  });

  return (
    <>
      <mesh 
        ref={meshRef} 
        position={position} 
        onClick={handleMeshClick}
        userData={{ type: 'phishing_mimic' }}
      >
        <boxGeometry args={[1, 2, 0.2]} />
        <meshStandardMaterial 
          ref={materialRef} 
          color="#00E4AE"
          emissive="#00E4AE"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Ekran-Üstü Arayüz (HUD) ve QTE Ekranı */}
      {isNear && (
        <Html center zIndexRange={[1000, 0]}>
          <div className="flex flex-col items-center justify-center w-[400px]">
            {!qteActive ? (
              <div className="pointer-events-none bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400 font-bold px-6 py-3 rounded shadow-[0_0_15px_rgba(234,179,8,0.5)] text-center backdrop-blur-md">
                <span className="text-xl">⚠ ŞÜPHELİ VERİ — DOĞRULA</span>
                <span className="text-sm text-yellow-200/80 block mt-2 font-medium bg-black/40 py-1 px-3 rounded">
                  Etkileşim için [E] tuşuna bas
                </span>
              </div>
            ) : (
              <div className="pointer-events-auto flex flex-col gap-4 items-center">
                <div className="bg-red-500/80 text-white text-sm font-bold px-3 py-1 rounded shadow-lg animate-bounce">
                  HIZLI OL! (0.8sn)
                </div>
                <button
                  onClick={handleVerify}
                  className="bg-red-600 hover:bg-red-500 text-white font-black text-3xl px-10 py-5 rounded-xl border-4 border-red-800 shadow-[0_0_40px_rgba(220,38,38,0.9)] transition-all transform active:scale-95"
                >
                  DOĞRULA!
                </button>
              </div>
            )}
          </div>
        </Html>
      )}
    </>
  );
};

export default PhishingMimic;
