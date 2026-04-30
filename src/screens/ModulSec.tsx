import React from 'react';
import { MODULLER } from '../types/game';
import { useGame } from '../context/GameContext';

interface ModulSecProps {
  onNavigate: (screen: string, args?: any) => void;
}

export const ModulSec: React.FC<ModulSecProps> = ({ onNavigate }) => {
  const { oyun, modulSec } = useGame();

  const handleModulSec = (modulId: typeof MODULLER[0]['id']) => {
    modulSec(modulId);
    onNavigate('Exploration');
  };

  return (
    <div className="relative w-full h-full bg-[#0D0D1A] overflow-hidden flex flex-col">
      {/* Top Bar */}
      <header className="fixed top-0 w-full max-w-[390px] h-[56px] bg-[#0D0D1A]/95 border-b border-white/10 z-50 flex items-center justify-between px-4">
        <button onClick={() => onNavigate('MainMenu')} className="text-[#A0A0B8] text-sm flex items-center gap-1">
          ← Geri
        </button>
        <span className="text-[#00E5B0] font-bold text-sm">MODÜL SEÇ</span>
        <span className="font-mono-stat text-sm text-[#00E5B0] font-bold">★ {oyun.xp} XP</span>
      </header>

      <main className="flex-1 pt-[72px] pb-6 px-4 overflow-y-auto">
        <p className="text-[#A0A0B8] text-sm mb-6 leading-relaxed font-body">
          Hangi konudan başlamak istiyorsun? Her modülün sonunda bir boss seni bekliyor.
        </p>

        <div className="flex flex-col gap-4 font-body">
          {MODULLER.map((modul) => {
            const tamamlanan = modul.odalar.filter(o =>
              oyun.tamamlananOdalar.includes(o.id)
            ).length;
            const ilerleme = Math.round((tamamlanan / modul.odalar.length) * 100);

            return (
              <button
                key={modul.id}
                onClick={() => handleModulSec(modul.id)}
                className="w-full bg-[#141428] rounded-xl border border-white/10 p-4 text-left transition-all active:scale-[0.98] hover:border-white/20"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${modul.renk}18`, border: `1px solid ${modul.renk}40` }}
                  >
                    {modul.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-bold text-[15px]">{modul.ad}</span>
                      <span className="text-xs font-mono-stat" style={{ color: modul.renk }}>{ilerleme}%</span>
                    </div>
                    <p className="text-[#A0A0B8] text-xs mb-3">{modul.aciklama}</p>
                    {/* İlerleme çubuğu */}
                    <div className="w-full h-1.5 bg-[#1E1E3A] rounded-full">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${ilerleme}%`, background: modul.renk }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-[#555566]">
                        {tamamlanan}/{modul.odalar.length} oda tamamlandı
                      </span>
                      <span className="text-xs" style={{ color: modul.renk }}>→</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Toplam ilerleme */}
        <div className="mt-6 p-4 bg-[#141428] rounded-xl border border-white/10 font-body">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[#A0A0B8]">Genel İlerleme</span>
            <span className="text-xs font-mono-stat text-[#00E5B0]">
              {oyun.tamamlananOdalar.length} / {MODULLER.reduce((t, m) => t + m.odalar.length, 0)} oda
            </span>
          </div>
          <div className="w-full h-2 bg-[#1E1E3A] rounded-full">
            <div
              className="h-full rounded-full bg-[#00E5B0] transition-all duration-500"
              style={{
                width: `${Math.round((oyun.tamamlananOdalar.length / MODULLER.reduce((t, m) => t + m.odalar.length, 0)) * 100)}%`
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
