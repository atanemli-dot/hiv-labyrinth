import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soruUret } from '../services/geminiService';
import { Soru } from '../types/game';

interface QuestionModalProps {
  onPass: () => void;
  onFail: () => void;
  onCancel: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({ onPass, onFail, onCancel }) => {
  const { oyun, dogruCevap, yanlisCevap, setMevcutSoru } = useGame();
  
  const [soru, setSoru] = useState<Soru | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [cevapVerildi, setCevapVerildi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(false);

  const fetchSoru = async () => {
    setYukleniyor(true);
    setHata(false);
    try {
      const yeniSoru = await soruUret(oyun, oyun.mevcutModul);
      setSoru(yeniSoru);
      setMevcutSoru(yeniSoru);
    } catch (e) {
      console.error(e);
      setHata(true);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    fetchSoru();
  }, []);

  const handleSelect = (harf: string) => {
    if (cevapVerildi || !soru) return;
    setSelected(harf);
  };

  const handleSubmit = () => {
    if (!selected || !soru || cevapVerildi) return;
    setCevapVerildi(true);
    const dogru = selected === soru.dogru;
    
    setTimeout(() => {
      if (dogru) {
        dogruCevap(soru);
        onPass();
      } else {
        yanlisCevap(soru);
        onFail();
      }
    }, dogru ? 1500 : 3000); // Wait longer on wrong answer to read protective feedback
  };

  const getOptClass = (harf: string) => {
    if (!cevapVerildi) {
      return selected === harf
        ? 'bg-primary-container/10 border-primary-container scale-[1.02]'
        : 'bg-[#292937] border-white/10 opacity-80';
    }
    if (harf === soru?.dogru) return 'bg-[#00ffff]/10 border-[#00ffff]';
    if (harf === selected && harf !== soru?.dogru) return 'bg-[#ff00ff]/10 border-[#ff00ff] opacity-60';
    return 'bg-[#292937] border-white/5 opacity-30';
  };

  const getLCClass = (harf: string) => {
    if (!cevapVerildi) return selected === harf ? 'bg-primary-container text-[#003829] border-primary-container' : 'border-white/20';
    if (harf === soru?.dogru) return 'bg-[#00ffff] text-[#003829] border-[#00ffff]';
    if (harf === selected) return 'bg-[#ff00ff] text-white border-[#ff00ff]';
    return 'border-white/20';
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col items-center justify-end md:justify-center p-0 md:p-4">
      <div className="flex flex-col w-full min-w-[320px] max-w-[450px] bg-[#0A0A10] md:border md:border-[#00ffff]/50 md:rounded-lg border-t-2 border-[#00ffff] rounded-t-xl max-h-[85vh] shadow-[0_-10px_30px_rgba(0,255,255,0.2)] md:shadow-[0_0_30px_rgba(0,255,255,0.2)] overflow-hidden">
        <div className="px-4 py-3 flex justify-between items-center border-b border-white/10 bg-[#11111A]">
           <span className="font-mono-label text-[#00ffff] tracking-widest text-xs">GÜVENLİK PROTOKOLÜ ÇALIŞIYOR...</span>
        </div>

        <div className="px-4 pb-8 pt-4 flex flex-col gap-4 overflow-y-auto">
          {/* Meta row */}
          {!yukleniyor && soru && (
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 font-mono-label text-[11px] bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30 uppercase tracking-wider">
                {soru.modul === 'hiv' ? 'HIV BİLGİ AĞI' : soru.modul === 'cinsel_saglik' ? 'C-S SAVUNMA' : 'KARMA PROTOKOL'}
              </span>
              <span className="px-3 py-1 font-mono-label text-[11px] bg-[#ff00ff]/10 text-[#ff00ff] border border-[#ff00ff]/30">
                +{soru.xp} XP
              </span>
            </div>
          )}

          {/* Loading */}
          {yukleniyor && (
            <div className="flex flex-col items-center py-12 gap-3">
              <div className="font-mono-stat text-lg text-[#00ffff] animate-pulse tracking-[0.2em]">SISTEM_BAGLANTISI...</div>
            </div>
          )}

          {/* Hata */}
          {hata && (
            <div className="text-center py-6">
              <p className="text-[#ff00ff] text-sm mb-3 font-mono-stat">SİSTEM YANITI ALINAMADI.</p>
              <button onClick={onCancel} className="text-[#00ffff] font-mono-label text-sm border border-[#00ffff]/50 px-4 py-2 hover:bg-[#00ffff]/10 mr-4">İPTAL EDİLİYOR</button>
              <button onClick={fetchSoru} className="text-[#00ffff] font-mono-label text-sm border border-[#00ffff]/50 px-4 py-2 hover:bg-[#00ffff]/10">YENİDEN DENE</button>
            </div>
          )}

          {/* Soru içeriği */}
          {!yukleniyor && !hata && soru && (
            <>
              {/* Senaryo balonu */}
              {soru.senaryo_baglam && (
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 bg-[#1E1E3A] flex items-center justify-center border border-[#ff00ff]/50 shrink-0">
                    <span className="text-sm font-bold text-[#ff00ff]">{'>_'}</span>
                  </div>
                  <div className="bg-[#11111A] p-4 border border-white/10 flex-1 relative font-mono-body text-xs text-white/80 uppercase">
                    {soru.senaryo_baglam}
                  </div>
                </div>
              )}

              {/* Soru */}
              <h2 className="text-white font-h2 text-[15px] leading-relaxed tracking-wide my-2">{soru.soru}</h2>

              {/* Şıklar */}
              <div className="flex flex-col gap-3 mt-2">
                {(Object.entries(soru.secenekler) as [string, string][])
                  .filter(([, v]) => v)
                  .map(([harf, metin]) => (
                    <button
                      key={harf}
                      onClick={() => handleSelect(harf)}
                      className={`w-full flex items-center gap-3 p-3 border text-left transition-all hover:border-[#00ffff]/50 hover:bg-[#00ffff]/5 ${getOptClass(harf)}`}
                    >
                      <div className={`w-8 h-8 border flex items-center justify-center font-mono-stat text-sm shrink-0 ${getLCClass(harf)}`}>
                        {harf}
                      </div>
                      <span className="text-white/90 font-body text-sm flex-1 leading-snug">{metin}</span>
                      {cevapVerildi && harf === soru.dogru && <span className="text-[#00ffff] text-lg font-mono-stat">✓</span>}
                      {cevapVerildi && harf === selected && harf !== soru.dogru && <span className="text-[#ff00ff] text-lg font-mono-stat">✕</span>}
                    </button>
                  ))}
              </div>

              {/* Açıklama — cevap sonrası */}
              {cevapVerildi && (
                <div className={`mt-2 p-4 border-l-4 font-mono-body flex flex-col gap-2 ${selected === soru.dogru ? 'bg-[#00ffff]/10 border-[#00ffff]' : 'bg-[#ff00ff]/10 border-[#ff00ff]'}`}>
                  <p className={`text-xs font-bold uppercase tracking-widest ${selected === soru.dogru ? 'text-[#00ffff]' : 'text-[#ff00ff]'}`}>
                    {selected === soru.dogru ? '✓ Doğrulandı - Erişim İzni Verildi' : '✕ Uyumsuz Yanıt - Güvenlik Duvarı Aktif'}
                  </p>
                  <p className="text-white/80 text-xs leading-relaxed">{soru.aciklama}</p>
                </div>
              )}

              {/* Submit */}
              {!cevapVerildi && (
                <div className="flex gap-3 mt-4">
                  <button
                     onClick={onCancel}
                     className="flex-1 py-3 font-mono-label tracking-widest text-[11px] flex items-center justify-center gap-2 border border-white/20 text-white/70 hover:bg-white/5 transition-colors"
                   >
                     İPTAL ET
                   </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selected}
                    className={`flex-[2] py-3 font-mono-label tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all ${selected ? 'bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff] shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:bg-[#00ffff]/30' : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'}`}
                  >
                    SİSTEMİ DOĞRULA
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
