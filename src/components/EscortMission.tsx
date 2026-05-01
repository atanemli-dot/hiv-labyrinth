import React, { useState, useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { EscortBot } from './EscortBot';
import { useGame } from '../context/GameContext';
import * as THREE from 'three';

export interface EscortMissionProps {
  active: boolean;
  startPosition?: [number, number, number];
  targetPosition?: [number, number, number];
  onComplete: (success: boolean) => void;
  labyrinthBounds: { minX: number; maxX: number; minZ: number; maxZ: number };
}

export const EscortMission: React.FC<EscortMissionProps> = ({
  active,
  startPosition,
  targetPosition,
  onComplete,
  labyrinthBounds
}) => {
  const { anomalyPositions, completeEscortMission } = useGame();
  const [failMessage, setFailMessage] = useState<boolean>(false);
  const { camera } = useThree();

  // Varsayılan pozisyonlar, prop'tan gelmediyse labyrinthBounds kullanılarak oluşturulur
  const start = startPosition || [
    (labyrinthBounds.minX + labyrinthBounds.maxX) / 2,
    0,
    labyrinthBounds.minZ + 2
  ];
  
  const target = targetPosition || [
    (labyrinthBounds.minX + labyrinthBounds.maxX) / 2,
    0,
    labyrinthBounds.maxZ - 2
  ];

  // shieldFromPlayer hesaplaması (useFrame ile)
  const isShielded = useRef(false);

  useFrame(() => {
     if (!active) return;
     // EscortBot içinde güncellenecek DOM referansına HUD can barlarını hesaplayıp basıyoruz.
     // player.distanceTo(threat) kullanarak tahmini bir sağlık hesaplayabiliriz
     // (veya bot'un gerçek pozisyonunu izlemek için custom event de atabiliriz)
     
     // Oyuncu bota yakın mı? -> shieldFromPlayer prop'una vermek için ama prop reaktif değil, 
     // en iyisi doğrudan EscortBot'un içindeki uzaklık hesabında shield kullanılıyor
     // EscortBot shieldFromPlayer prop kullanıyor. Prop statik olursa değişmez.
     // Bu nedenle, HUD için en yakın tehdit mesafesini oyuncu merkezli takip ediyoruz.
     
     if (anomalyPositions.length > 0) {
        let minDist = Infinity;
        for (const threat of anomalyPositions) {
          const d = camera.position.distanceTo(threat);
          if (d < minDist) minDist = d;
        }
        
        let health = 100;
        if (minDist < 4) {
           health = Math.max(0, Math.min(100, ((minDist - 1) / 3) * 100));
        }
        
        const healthEl = document.getElementById('escort-health-value');
        const healthBarEl = document.getElementById('escort-health-bar');
        if (healthEl && healthBarEl) {
           healthEl.innerText = Math.round(health) + '%';
           healthBarEl.style.width = Math.round(health) + '%';
           if (health < 30) {
             healthBarEl.style.backgroundColor = '#FF2D55';
           } else if (health < 70) {
             healthBarEl.style.backgroundColor = '#FFD93D';
           } else {
             healthBarEl.style.backgroundColor = '#00E5B0';
           }
        }
     }
  });

  // Re-render'ı tetiklemek için belli aralıklarla kontrol edip shield state'ini güncelleyebiliriz,
  // ancak performansı korumak için shieldFromPlayer'ı EscortBot içinde kendisi yapsın veya 
  // EscortBot'u her frame update etmemek için EscortBot'a kamera ref'i yolladık.
  const [shieldState, setShieldState] = useState(false);
  
  useEffect(() => {
    let interval: any;
    if (active) {
       interval = setInterval(() => {
          // Basit bir kalkan kontrolü (saniyede 4 kez)
          const botEl = document.getElementById('escort-mission-hud');
          if (botEl) {
            // EscortBot shieldFromPlayer prop state
             setShieldState(true); // Basitleştirmek adına hep true veya oyuncu mesasfesine göre değişebilir
          }
       }, 250);
    }
    return () => clearInterval(interval);
  }, [active]);

  const handleReachedTarget = (id: string) => {
     completeEscortMission(true);
     onComplete(true);
  };

  const handleDestroyed = (id: string) => {
     completeEscortMission(false);
     onComplete(false);
     setFailMessage(true);
     setTimeout(() => setFailMessage(false), 3000);
  };

  if (!active && !failMessage) return null;

  return (
    <>
      {active && (
        <EscortBot 
          id="mission-1"
          startPosition={start as [number, number, number]}
          targetPosition={target as [number, number, number]}
          playerPosition={camera.position}
          threats={anomalyPositions}
          shieldFromPlayer={true} // Her zaman koruma modunda (oyuncunun yanında çalışıyor)
          onReachedTarget={handleReachedTarget}
          onDestroyed={handleDestroyed}
        />
      )}

      {/* HUD Şeridi */}
      <Html fullscreen zIndexRange={[100, 0]}>
         {active && (
           <div id="escort-mission-hud" className="absolute top-8 left-1/2 transform -translate-x-1/2 w-96 max-w-full">
             <div className="bg-[#151525]/90 border-2 border-[#FFD93D] rounded-xl p-4 shadow-[0_0_20px_rgba(255,217,61,0.3)] backdrop-blur-md flex flex-col items-center">
                <span className="text-[#FFD93D] font-bold text-sm tracking-widest mb-1 text-center">GÖREV</span>
                <span className="text-white font-semibold text-center mb-3">
                  Veri paketini güvenli terminale ulaştır
                </span>
                
                {/* Sağlık Barı */}
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700 relative">
                  <div 
                    id="escort-health-bar"
                    className="h-full bg-[#00E5B0] transition-all duration-300" 
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="w-full flex justify-between mt-1 text-xs font-mono font-bold text-gray-400">
                  <span>TEHDİT SEVİYESİ</span>
                  <span id="escort-health-value">100%</span>
                </div>
             </div>
           </div>
         )}

         {/* Hata Mesajı */}
         {failMessage && (
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <div className="bg-red-600 border-4 border-red-900 text-white font-black text-3xl px-10 py-5 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.9)] animate-pulse backdrop-blur-md">
               VERİ PAKETİ KAYBOLDU
             </div>
           </div>
         )}
      </Html>
    </>
  );
};

export default EscortMission;
