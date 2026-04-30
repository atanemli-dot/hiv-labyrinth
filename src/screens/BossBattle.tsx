import React, { useState, useEffect } from 'react';
import { TopBar, Footer } from '../components/SharedElements';
import { useGame } from '../context/GameContext';
import { bosssoruUret } from '../services/geminiService';
import { Soru } from '../types/game';

interface BossBattleProps {
  onNavigate: (screen: string) => void;
}

export const BossBattle: React.FC<BossBattleProps> = ({ onNavigate }) => {
  const { oyun, dogruCevap, yanlisCevap, rozet } = useGame();
  const [selected, setSelected] = useState<string | null>(null);
  const [bossSoru, setBossSoru] = useState<Soru | null>(null);
  const [bossCan, setBossCan] = useState(3);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(false);
  const [cevapVerildi, setCevapVerildi] = useState(false);

  const yeniSoruGetir = async () => {
    setYukleniyor(true);
    setHata(false);
    setSelected(null);
    setCevapVerildi(false);
    try {
      const yeni = await bosssoruUret(oyun.mevcutModul);
      setBossSoru(yeni);
    } catch (e) {
      console.error(e);
      setHata(true);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    yeniSoruGetir();
  }, [oyun.mevcutModul]);

  const handleSubmit = () => {
    if (!selected || !bossSoru || cevapVerildi) return;
    setCevapVerildi(true);
    const dogru = selected === bossSoru.dogru;
    
    if (dogru) {
      dogruCevap(bossSoru);
      setBossCan(c => c - 1);
      setTimeout(() => {
        if (bossCan - 1 <= 0) {
          rozet("Bağışıklık Kalkanı");
          onNavigate('ReportCard');
        } else {
          yeniSoruGetir();
        }
      }, 1500);
    } else {
      yanlisCevap(bossSoru);
      setBossCan(c => Math.min(3, c + 1));
      setTimeout(() => {
        yeniSoruGetir();
      }, 2000);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#0D0D1A] overflow-hidden flex flex-col">
      <TopBar />

      <div className="absolute inset-0 pointer-events-none z-0 mt-16" style={{
         background: 'repeating-linear-gradient(transparent 0px, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)'
      }}></div>

      <div className="relative z-10 h-full flex flex-col pt-16">
        {/* TOP SECTION */}
        <div className="h-[45%] flex flex-col pt-4 shrink-0">
          {/* Boss Banner */}
          <div className="h-[50px] w-full bg-[#ff6b6b1f] border-b border-[#ff6b6b4d] flex items-center justify-center">
            <span className="font-bold text-[14px] text-[#FF6B6B] tracking-wider uppercase">★ BOSS · {oyun.mevcutModul.replace('_', ' ')} MİTLERİ ★</span>
          </div>

          {/* Health Bar Area */}
          <div className="px-margin mt-4">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[11px] text-[#A0A0B8] uppercase font-mono-label">Patron Canı</span>
              <span className="text-[11px] text-[#FF6B6B] font-mono-stat">{bossCan} / 3</span>
            </div>
            <div className="w-full h-[8px] bg-[#1E1E3A] rounded-full overflow-hidden transition-all duration-300">
              <div className="h-full bg-[#FF6B6B] transition-all duration-300" style={{ width: `${(bossCan / 3) * 100}%` }}></div>
            </div>
          </div>

          {/* Boss Visual Container */}
          <div className="flex-1 flex flex-col justify-center items-center relative">
            <div className="relative w-[120px] h-[120px] flex justify-center items-center animate-pulse">
              {/* Spikes rendering as a simplified star/sun */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[100px] h-[100px] border border-[#ff6b6b] rounded-full opacity-20"></div>
                <div className="absolute w-[120px] h-1 bg-[#ff6b6b] opacity-40 rotate-0"></div>
                <div className="absolute w-[120px] h-1 bg-[#ff6b6b] opacity-40 rotate-[60deg]"></div>
                <div className="absolute w-[120px] h-1 bg-[#ff6b6b] opacity-40 rotate-[120deg]"></div>
              </div>
              <div className="w-[80px] h-[80px] bg-[#1E1E3A] border-2 border-[#ff6b6b] flex items-center justify-center relative z-10"
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                <div className="w-[16px] h-[16px] bg-[#ff6b6b] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Battle Status */}
          <div className="px-margin pb-6 flex flex-col items-center">
            <span className="text-[11px] text-[#A0A0B8] mb-3 tracking-widest uppercase font-mono-label">3 DOĞRU CEVAP GEREKİYOR</span>
            <div className="flex items-center gap-4">
               {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center border ${3 - bossCan > i ? 'border-[#00E5B0] bg-[#00E5B0]/20 text-[#00E5B0]' : 'border-[#343342] bg-[#1E1E3A] text-[#A0A0B8]'}`}>
                    {3 - bossCan > i ? <span className="text-[12px] font-bold">✓</span> : <span className="text-[10px] font-mono-stat">{i + 1}</span>}
                  </div>
               ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION (QUESTION CARD) */}
        <div className="flex-1 bg-[#141428] rounded-t-[20px] border-t border-[#ff6b6b4d] p-margin flex flex-col relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] overflow-y-auto pb-20">
          {/* Meta Row */}
          <div className="flex gap-2 mb-4 shrink-0">
            <span className="px-2 py-1 bg-red-900/40 text-[#FF6B6B] text-[10px] font-bold rounded-sm border border-[#FF6B6B]/30 tracking-wider">BOSS SORUSU</span>
            <span className="px-2 py-1 bg-[#42008a]/40 text-[#d6baff] text-[10px] font-bold rounded-sm border border-[#d6baff]/30 tracking-wider">+{bossSoru?.xp || 50} XP</span>
          </div>

          {yukleniyor && (
             <div className="flex-1 flex flex-col items-center justify-center gap-4">
                 <div className="w-8 h-8 border-2 border-[#ff6b6b] border-t-transparent rounded-full animate-spin" />
                 <span className="text-[#ff6b6b] font-mono-label text-xs uppercase">Saldırı Hazırlanıyor...</span>
             </div>
          )}

          {hata && (
             <div className="flex-1 flex flex-col items-center justify-center">
               <p className="text-[#FF6B6B] mb-2 font-body text-sm">Hata oluştu.</p>
               <button onClick={yeniSoruGetir} className="text-white underline font-mono-label text-xs">Tekrar Dene</button>
             </div>
          )}

          {!yukleniyor && !hata && bossSoru && (
             <>
               <h2 className="text-[15px] text-white font-bold mb-6 leading-relaxed shrink-0">
                 {bossSoru.soru}
               </h2>

               <div className="flex flex-col gap-3 mb-auto">
                 {(Object.entries(bossSoru.secenekler) as [string, string][]).filter(([,v]) => v).map(([harf, metin]) => {
                    let isCorrect = harf === bossSoru.dogru;
                    let btnClass = `bg-[#1E1E3A] border-[#ff6b6b40]`;
                    let letClass = `bg-[#0D0D1A] border-[#343342] text-[#A0A0B8]`;
                    
                    if (selected === harf && !cevapVerildi) {
                       btnClass = `bg-primary-container/10 border-primary-container`;
                       letClass = `bg-primary-container text-[#002116] border-primary-container`;
                    } else if (cevapVerildi) {
                       if (isCorrect) {
                           btnClass = `bg-[#00E5B0]/10 border-[#00E5B0]`;
                           letClass = `bg-[#00E5B0] text-[#002116] border-[#00E5B0]`;
                       } else if (selected === harf) {
                           btnClass = `bg-[#FF6B6B]/10 border-[#FF6B6B] opacity-60`;
                           letClass = `bg-[#FF6B6B] text-white border-[#FF6B6B]`;
                       } else {
                           btnClass = `bg-[#1E1E3A] border-[#ff6b6b40] opacity-30`;
                       }
                    }

                    return (
                        <button 
                          key={harf}
                          onClick={() => !cevapVerildi && setSelected(harf)}
                          className={`w-full text-left p-3 rounded-lg border flex items-start gap-3 active:scale-[0.98] transition-all ${btnClass}`}
                        >
                          <span className={`w-6 h-6 rounded border flex items-center justify-center text-[12px] font-mono-label shrink-0 transition-all ${letClass}`}>{harf}</span>
                          <span className="text-[14px] text-[#e3e0f4] pt-0.5 font-body flex-1">{metin}</span>
                          {cevapVerildi && isCorrect && <span className="text-[#00E5B0] text-lg font-bold ml-auto">✓</span>}
                          {cevapVerildi && !isCorrect && selected === harf && <span className="text-[#FF6B6B] text-lg font-bold ml-auto">✕</span>}
                        </button>
                    )
                 })}
               </div>

               {cevapVerildi && (
                 <div className={`mt-3 rounded-lg p-3 border-l-4 ${selected === bossSoru.dogru ? 'bg-[#0D1F17] border-[#00E5B0]' : 'bg-[#1F0D0D] border-[#FF6B6B]'}`}>
                    <p className={`text-xs font-bold mb-1 font-body ${selected === bossSoru.dogru ? 'text-[#00E5B0]' : 'text-[#FF6B6B]'}`}>
                      {selected === bossSoru.dogru ? '✓ Hasar Verildi!' : '✕ Boss İyileşti'}
                    </p>
                    <p className="text-[#A0A0B8] text-xs leading-relaxed font-body">{bossSoru.aciklama}</p>
                 </div>
               )}

               {!cevapVerildi && (
                  <button 
                    onClick={handleSubmit}
                    disabled={!selected}
                    className={`w-full bg-[#00E5B0] text-[#002116] font-bold py-3 rounded-lg mt-4 uppercase tracking-widest text-[14px] active:scale-[0.98] transition-all shrink-0 ${selected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                  >
                    CEVABI GÖNDER
                  </button>
               )}
             </>
          )}

          {/* Player Bar */}
          <div className="mt-4 pt-4 border-t border-[#343342] flex justify-between items-center shrink-0">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#343342] border border-[#84948c] flex items-center justify-center font-bold text-white text-xs">S</div>
                <div className="text-[#00E5B0] text-sm tracking-widest font-mono-stat">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <span key={i} className={oyun.haklar > i ? 'text-[#00E5B0]' : 'text-[#343342]'} style={{ marginRight: 2 }}>♥</span>
                    ))}
                </div>
             </div>
             <div className="text-amber-500 font-mono-stat text-sm flex items-center gap-1">
                <span>🔥</span> {oyun.xp} XP
             </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
