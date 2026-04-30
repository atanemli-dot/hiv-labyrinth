import React, { createContext, useContext, useState, useCallback } from 'react';
import { OyunDurumu, BASLANGIC_DURUMU, Soru, ModulType } from '../types/game';

interface GameContextType {
  oyun: OyunDurumu;
  mevcutSoru: Soru | null;
  setMevcutSoru: (soru: Soru | null) => void;
  dogruCevap: (soru: Soru) => void;
  yanlisCevap: (soru: Soru) => void;
  modulSec: (modul: ModulType) => void;
  oyunuSifirla: () => void;
  rozet: (ad: string) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [oyun, setOyun] = useState<OyunDurumu>(BASLANGIC_DURUMU);
  const [mevcutSoru, setMevcutSoru] = useState<Soru | null>(null);

  const dogruCevap = useCallback((soru: Soru) => {
    setOyun(prev => {
      const yeniStreak = prev.streak + 1;
      const streakBonus = yeniStreak >= 3 ? 5 : 0;
      const kazanilanXP = soru.xp + streakBonus;

      return {
        ...prev,
        xp: prev.xp + kazanilanXP,
        dogru: prev.dogru + 1,
        streak: yeniStreak,
        enIyiStreak: Math.max(prev.enIyiStreak, yeniStreak),
        toplamSoru: prev.toplamSoru + 1,
        modulPuanlar: {
          ...prev.modulPuanlar,
          [soru.modul]: prev.modulPuanlar[soru.modul] + kazanilanXP,
        },
        modulToplamSoru: {
          ...prev.modulToplamSoru,
          [soru.modul]: prev.modulToplamSoru[soru.modul] + 1,
        },
        gucluEtiketler: prev.gucluEtiketler.includes(soru.kaynak_etiket)
          ? prev.gucluEtiketler
          : [...prev.gucluEtiketler, soru.kaynak_etiket],
      };
    });
  }, []);

  const yanlisCevap = useCallback((soru: Soru) => {
    setOyun(prev => ({
      ...prev,
      yanlis: prev.yanlis + 1,
      haklar: Math.max(0, prev.haklar - 1),
      streak: 0,
      toplamSoru: prev.toplamSoru + 1,
      modulToplamSoru: {
        ...prev.modulToplamSoru,
        [soru.modul]: prev.modulToplamSoru[soru.modul] + 1,
      },
      zayifEtiketler: [...prev.zayifEtiketler, soru.kaynak_etiket],
    }));
  }, []);

  const modulSec = useCallback((modul: ModulType) => {
    setOyun(prev => ({ ...prev, mevcutModul: modul }));
  }, []);

  const rozet = useCallback((ad: string) => {
    setOyun(prev => ({
      ...prev,
      kazanilanRozetler: prev.kazanilanRozetler.includes(ad)
        ? prev.kazanilanRozetler
        : [...prev.kazanilanRozetler, ad],
    }));
  }, []);

  const oyunuSifirla = useCallback(() => {
    setOyun(BASLANGIC_DURUMU);
    setMevcutSoru(null);
  }, []);

  return (
    <GameContext.Provider value={{
      oyun, mevcutSoru, setMevcutSoru,
      dogruCevap, yanlisCevap, modulSec, oyunuSifirla, rozet,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};
