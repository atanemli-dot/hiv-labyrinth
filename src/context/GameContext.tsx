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
  leitnerState: Record<string, { box: number, nextQuestion: number }>;
  getNextEtiket: () => string | null;
  factCheckCount: number;
  useFactCheck: () => boolean;
  shieldActive: boolean;
  shieldRemainingMs: number;
  shieldTip: 'prep' | 'vpn' | null;
  shieldPercent: number;
  activateShield: (tip: 'prep' | 'vpn', durationMs: number) => void;
  tickShield: (deltaMs: number) => void;
  hasarAl: (miktar: number) => void;
  escortMissionActive: boolean;
  escortMissionResult: 'success' | 'fail' | null;
  startEscortMission: () => void;
  completeEscortMission: (success: boolean) => void;
  anomalyPositions: import('three').Vector3[];
  setAnomalyPositions: React.Dispatch<React.SetStateAction<import('three').Vector3[]>>;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [oyun, setOyun] = useState<OyunDurumu>(BASLANGIC_DURUMU);
  const [mevcutSoru, setMevcutSoru] = useState<Soru | null>(null);
  const [leitnerState, setLeitnerState] = useState<Record<string, { box: number, nextQuestion: number }>>({});
  const [factCheckCount, setFactCheckCount] = useState<number>(3);

  const [shieldActive, setShieldActive] = useState(false);
  const [shieldRemainingMs, setShieldRemainingMs] = useState(0);
  const [shieldTip, setShieldTip] = useState<'prep' | 'vpn' | null>(null);
  const [shieldMaxMs, setShieldMaxMs] = useState(1); // To prevent division by zero

  const [escortMissionActive, setEscortMissionActive] = useState(false);
  const [escortMissionResult, setEscortMissionResult] = useState<'success' | 'fail' | null>(null);
  const [anomalyPositions, setAnomalyPositions] = useState<import('three').Vector3[]>([]);

  const activateShield = useCallback((tip: 'prep' | 'vpn', durationMs: number) => {
    setShieldActive(true);
    setShieldTip(tip);
    setShieldRemainingMs(durationMs);
    setShieldMaxMs(durationMs);
  }, []);

  const tickShield = useCallback((deltaMs: number) => {
    setShieldRemainingMs(prev => {
      if (!shieldActive || prev <= 0) return prev;
      const next = prev - deltaMs;
      if (next <= 0) {
        setShieldActive(false);
        setShieldTip(null);
        return 0;
      }
      return next;
    });
  }, [shieldActive]);

  const hasarAl = useCallback((miktar: number) => {
    setOyun(prev => ({
      ...prev,
      butunluk: Math.max(0, prev.butunluk - miktar)
    }));
  }, []);

  const shieldPercent = shieldActive && shieldMaxMs > 0 ? (shieldRemainingMs / shieldMaxMs) * 100 : 0;

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

    setLeitnerState(prev => {
      const current = prev[soru.kaynak_etiket];
      if (!current) return prev;
      
      const newBox = Math.min(3, current.box + 1);
      const delay = newBox === 1 ? 2 : newBox === 2 ? 4 : 8;
      
      return {
        ...prev,
        [soru.kaynak_etiket]: { box: newBox, nextQuestion: oyun.toplamSoru + 1 + delay }
      };
    });
  }, [oyun.toplamSoru]);

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

    setLeitnerState(prev => {
      const currentBox = prev[soru.kaynak_etiket]?.box || 2;
      const newBox = Math.max(1, currentBox - 1);
      const delay = newBox === 1 ? 2 : newBox === 2 ? 4 : 8;
      
      return {
        ...prev,
        [soru.kaynak_etiket]: { box: newBox, nextQuestion: oyun.toplamSoru + 1 + delay }
      };
    });
  }, [oyun.toplamSoru]);

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
    setLeitnerState({});
    setFactCheckCount(3);
    setShieldActive(false);
    setShieldTip(null);
    setShieldRemainingMs(0);
    setEscortMissionActive(false);
    setEscortMissionResult(null);
  }, []);

  const startEscortMission = useCallback(() => {
    setEscortMissionActive(true);
    setEscortMissionResult(null);
  }, []);

  const completeEscortMission = useCallback((success: boolean) => {
    setEscortMissionActive(false);
    setEscortMissionResult(success ? 'success' : 'fail');
    if (success) {
      setOyun(prev => ({
        ...prev,
        xp: prev.xp + 100,
        kazanilanRozetler: prev.kazanilanRozetler.includes('escort_champion')
          ? prev.kazanilanRozetler
          : [...prev.kazanilanRozetler, 'escort_champion']
      }));
    }
  }, []);

  const getNextEtiket = useCallback(() => {
    let nextEtiket: string | null = null;
    let minNextQuestion = Infinity;

    for (const [etiket, state] of Object.entries(leitnerState)) {
      if (state.nextQuestion <= oyun.toplamSoru) {
        if (state.nextQuestion < minNextQuestion) {
          minNextQuestion = state.nextQuestion;
          nextEtiket = etiket;
        }
      }
    }
    return nextEtiket;
  }, [leitnerState, oyun.toplamSoru]);

  const useFactCheck = useCallback(() => {
    if (factCheckCount > 0) {
      setFactCheckCount(prev => prev - 1);
      return true;
    }
    return false;
  }, [factCheckCount]);

  return (
    <GameContext.Provider value={{
      oyun, mevcutSoru, setMevcutSoru,
      dogruCevap, yanlisCevap, modulSec, oyunuSifirla, rozet,
      leitnerState, getNextEtiket, factCheckCount, useFactCheck,
      shieldActive, shieldRemainingMs, shieldTip, shieldPercent,
      activateShield, tickShield, hasarAl,
      escortMissionActive, escortMissionResult, startEscortMission, completeEscortMission,
      anomalyPositions, setAnomalyPositions
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
