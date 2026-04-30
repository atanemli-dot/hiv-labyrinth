import React, { useState, useEffect } from 'react';
import { Labyrinth } from '../components/Labyrinth';
import { QuestionModal } from '../components/QuestionModal';

interface ExplorationProps {
  onNavigate: (screen: string) => void;
}

export const Exploration: React.FC<ExplorationProps> = ({ onNavigate }) => {
  const [pulse, setPulse] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptType, setPromptType] = useState<string>('terminal');
  const [showClear, setShowClear] = useState(false);
  const [activeDoor, setActiveDoor] = useState<string | null>(null);
  const [activeDoorType, setActiveDoorType] = useState<string | null>(null);
  
  // Progression & Stats
  const [level, setLevel] = useState(1);
  const [syncTime, setSyncTime] = useState(300);
  const [integrity, setIntegrity] = useState(100);
  const [terminalsFound, setTerminalsFound] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const totalTerminals = 3;

  useEffect(() => {
    if (showClear || activeDoor) return;
    const timer = setInterval(() => {
      setPulse(p => !p);
      setSyncTime(prev => {
        if (prev > 0) return prev - 1;
        setIntegrity(int => Math.max(0, int - 1)); // Time is up, integrity drops
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showClear, activeDoor]);

  const handleDoorInteraction = (doorId: string, type: 'terminal' | 'gateway' | 'anomaly') => {
    if (type === 'terminal' || type === 'anomaly') {
        if (!terminalsFound.includes(doorId)) {
            setActiveDoor(doorId); // Opens QuestionModal
            setActiveDoorType(type);
        }
    } else if (type === 'gateway') {
        if (terminalsFound.length >= totalTerminals) {
            // Boss is unlocked -> show stage clear or maybe a longer boss question?
            // "Ana Ağ Geçidi kilidi açılır. Buradaki son doğrulamayı da geçen oyuncu, daha büyük olan haritaya geçer."
            // So gateway should also open QuestionModal! But maybe boss version. ActiveDoor handles it.
            setActiveDoor(doorId);
            setActiveDoorType(type);
        } else {
            alert("Ana Ağ Geçidi kilitli. Sistem erişimi için tüm Güvenli Veri Odalarını onaylayın.");
        }
    }
  };

  const handleModalPass = () => {
      if (activeDoor) {
         if (activeDoorType === 'anomaly') {
            // Nothing to save for anomaly, just close
         } else if (activeDoorType === 'gateway') {
            setShowClear(true);
         } else {
            setTerminalsFound([...terminalsFound, activeDoor]);
         }
      }
      setActiveDoor(null);
      setActiveDoorType(null);
  };

  const handleModalFail = () => {
      setIntegrity(prev => Math.max(0, prev - 15));
      setActiveDoor(null);
      setActiveDoorType(null);
  };

  const handleModalCancel = () => {
      setActiveDoor(null);
      setActiveDoorType(null);
  };

  const nextStage = () => {
      const timeBonus = syncTime * 10;
      setTotalScore(prev => prev + 1000 + timeBonus);
      setLevel(prev => prev + 1);
      setSyncTime(300); // reset timer
      setTerminalsFound([]);
      setIntegrity(100);
      setShowClear(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-full bg-[#0D0D1A] overflow-hidden flex flex-col items-center">
      
      {/* Real 3D Labyrinth Viewport */}
      <div className="absolute inset-0 z-0">
         <Labyrinth 
            level={level}
            onAtDoor={handleDoorInteraction}
            openDoors={terminalsFound}
            isQuestionOpen={!!activeDoor || showClear}
            onActionPrompt={(show, type) => { setShowPrompt(show); if(type) setPromptType(type); }}
         />
      </div>

      {/* 1. TOP BAR */}
      <header className="fixed top-0 w-full max-w-[390px] h-[64px] bg-[#0D0D1A]/90 backdrop-blur-sm border-b border-white/10 z-50 flex items-center justify-between px-md pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          <span className="bg-primary-container text-[#006149] text-[10px] font-black px-sm py-[2px] rounded-full font-mono-label">AŞAMA {level}</span>
          <span className="text-[10px] text-[#A0A0B8] font-mono-label">Veri Bütünlüğü %{integrity}</span>
        </div>
        <div className="flex flex-col items-end gap-1 pointer-events-auto">
          <span className={`font-mono-stat text-sm ${syncTime < 60 ? 'text-[#ff6b6b] animate-pulse' : 'text-primary-container'}`}>
             Senkronizasyon: {formatTime(syncTime)}
          </span>
          <span className="text-[10px] text-[#A0A0B8] font-mono-label text-right">Terminaller: {terminalsFound.length}/{totalTerminals}</span>
        </div>
      </header>

      {/* 5. CROSSHAIR */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 mix-blend-difference">
        <div className="relative w-5 h-5">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/40"></div>
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white/40"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[#00ffff] rounded-full shadow-[0_0_8px_#00ffff]"></div>
        </div>
      </div>

      {/* 6. DOOR PROMPT */}
      {showPrompt && (
        <div
          className={`absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(0,20,40,0.9)] border ${pulse ? 'border-[#00ffff] scale-105 opacity-80' : 'border-[#00ffff] scale-100 opacity-100'} px-lg py-sm rounded-lg flex items-center gap-sm transition-all duration-300 z-40 pointer-events-none`}
        >
          <span className="text-[#00ffff] material-symbols-outlined text-sm">{promptType === 'gateway' ? 'vpn_key' : 'terminal'}</span>
          <span className="text-[#00ffff] font-mono-label text-xs uppercase tracking-widest">
              {promptType === 'gateway' ? 'Ana Ağ Geçidi [E]' : 'Veri Terminali [E]'}
          </span>
        </div>
      )}

      {/* Footer for Metadata */}
      <footer className="fixed bottom-0 w-full max-w-[390px] z-50 flex justify-center items-center py-3 bg-[#0D0D1A]/80 backdrop-blur-md border-t border-white/10 pointer-events-none">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[#A0A0B8]">Sistem Senkronize | Protokol Korunuyor</p>
      </footer>

      {activeDoor && (
         <QuestionModal 
            onPass={handleModalPass} 
            onFail={handleModalFail} 
            onCancel={handleModalCancel} 
         />
      )}

      {showClear && (
        <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm bg-[#0A0A10] border-2 border-[#00ffff] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.2)]">
                <div className="bg-[#00ffff] text-[#0A0A10] py-3 text-center font-bold font-h2 uppercase tracking-widest text-sm">
                    AŞAMA {level} TAMAMLANDI
                </div>
                <div className="p-8 flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-full border-2 border-[#00ffff] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#00ffff] text-3xl">verified_user</span>
                    </div>
                    <div className="text-center w-full">
                        <div className="flex justify-between items-center mb-2 font-mono-label text-xs">
                            <span className="text-white/60">Temel Puan:</span>
                            <span className="text-[#00ffff]">1000</span>
                        </div>
                        <div className="flex justify-between items-center mb-2 font-mono-label text-xs">
                            <span className="text-white/60">Zaman Bonusu ({formatTime(syncTime)}):</span>
                            <span className="text-[#00ffff]">{syncTime * 10}</span>
                        </div>
                        <div className="w-full h-[1px] bg-white/20 my-3"></div>
                        <div className="flex justify-between items-center font-bold tracking-widest">
                            <span className="text-white">TOPLAM:</span>
                            <span className="text-[#00ffff] text-xl">{totalScore + 1000 + (syncTime * 10)}</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={nextStage}
                        className="w-full mt-4 bg-[#00ffff] text-[#0A0A10] font-bold py-3 rounded uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        Sistem Yöneticisini Onayla
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
