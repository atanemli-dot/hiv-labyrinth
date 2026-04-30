import React, { useState, useEffect } from 'react';
import { TopBar, Footer } from '../components/SharedElements';
import { useGame } from '../context/GameContext';

interface FeedbackProps {
  onNavigate: (screen: string) => void;
  isCorrect: boolean;
}

export const Feedback: React.FC<FeedbackProps> = ({ onNavigate, isCorrect }) => {
  const { oyun, mevcutSoru } = useGame();
  const [xpAnim, setXpAnim] = useState(oyun.xp - (mevcutSoru?.xp || 20));

  useEffect(() => {
    // Animate to current XP
    if (xpAnim < oyun.xp) {
      const timer = setInterval(() => {
        setXpAnim((prev) => {
          if (prev >= oyun.xp) {
            clearInterval(timer);
            return oyun.xp;
          }
          return prev + 1;
        });
      }, 10);
      return () => clearInterval(timer);
    } else {
      setXpAnim(oyun.xp);
    }
  }, [oyun.xp]);

  const handleDevamEt = () => {
    if (oyun.haklar <= 0) {
      onNavigate('ReportCard');
      return;
    }
    const kacinciSoru = oyun.dogru + oyun.yanlis;
    if (kacinciSoru > 0 && kacinciSoru % 4 === 0) {
      onNavigate('BossBattle');
    } else {
      onNavigate('Exploration');
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col items-center transition-colors duration-500 ${isCorrect ? 'bg-[#0A1A14]' : 'bg-[#1A0A0A]'}`}>
      <TopBar />

      {/* State Toggle Bar (Simulation Control) */}
      <nav className="fixed top-16 w-full max-w-[390px] h-[48px] bg-[#0D0D1A]/95 border-b border-white/10 flex items-center justify-center gap-4 px-4 z-40">
        <div className={`px-md h-8 rounded-full ${isCorrect ? 'bg-primary-container text-[#003829]' : 'bg-surface-container text-[#bacac1]'} font-mono-label text-xs uppercase flex items-center gap-2 transition-all`}>
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          ✓ DOĞRU
        </div>
        <div className={`px-md h-8 rounded-full ${!isCorrect ? 'bg-[#ffb4ab] text-[#690005]' : 'bg-surface-container text-[#bacac1]'} font-mono-label text-xs uppercase flex items-center gap-2 transition-all`}>
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
          ✕ YANLIŞ
        </div>
      </nav>

      {/* CONTENT CANVAS */}
      <main className="flex-1 w-full flex flex-col items-center justify-center pt-[112px] pb-[64px] px-margin overflow-y-auto">
        {isCorrect ? (
          <div className="w-full max-w-md bg-[#1a1a28] border border-primary-container/30 rounded-xl p-lg flex flex-col items-center text-center my-auto">
            {/* Success Icon */}
            <div className="w-[72px] h-[72px] rounded-full border-2 border-primary-container flex items-center justify-center mb-md bg-primary-container/10">
              <span className="material-symbols-outlined text-primary-container text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
            </div>
            
            {/* Result Header */}
            <h2 className="text-primary-container font-h1 text-[28px] uppercase tracking-wider mb-sm">DOĞRU!</h2>
            
            <div className="flex flex-col items-center gap-xs mb-lg">
              <div className="flex items-center gap-2 text-primary-container">
                <span className="font-mono-stat text-2xl">{xpAnim}</span>
                <span className="font-mono-label text-xs uppercase">XP Toplam</span>
              </div>
              <div className="px-sm py-1 bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20 rounded-full flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <span className="font-mono-label text-xs">SERİ: {oyun.streak}</span>
              </div>
            </div>

            {/* Content Card */}
            <div className="w-full bg-[#343342]/30 rounded-lg p-md text-left mb-lg">
              <div className="flex items-center gap-2 mb-2 text-primary-container">
                <span className="material-symbols-outlined text-sm">info</span>
                <span className="font-mono-label text-[10px] uppercase">Doğru Bilgi</span>
              </div>
              <p className="text-[#bacac1] font-body text-sm leading-relaxed">
                {mevcutSoru?.aciklama || "Tebrikler, bu soruyu doğru bildin."}
              </p>
            </div>

            {/* Hearts Display */}
            <div className="flex gap-2 mb-lg">
              <span className={`material-symbols-outlined ${oyun.haklar >= 1 ? 'text-primary-container' : 'text-primary-container/30'}`} style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <span className={`material-symbols-outlined ${oyun.haklar >= 2 ? 'text-primary-container' : 'text-primary-container/30'}`} style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <span className={`material-symbols-outlined ${oyun.haklar >= 3 ? 'text-primary-container' : 'text-primary-container/30'}`} style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            </div>

            {/* CTA */}
            <button onClick={handleDevamEt} className="w-full h-12 bg-primary-container text-[#003829] font-h2 font-bold text-sm uppercase rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
              DEVAM ET
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md bg-[#1a1a28] border border-[#ffb4ab]/30 rounded-xl p-lg flex flex-col items-center text-center my-auto">
            {/* Error Icon */}
            <div className="w-[72px] h-[72px] rounded-full border-2 border-[#ffb4ab] flex items-center justify-center mb-md bg-[#ffb4ab]/10">
               <span className="material-symbols-outlined text-[#ffb4ab] text-4xl">close</span>
            </div>

            {/* Result Header */}
            <h2 className="text-[#ffb4ab] font-h1 text-[28px] uppercase tracking-wider mb-sm">YANLIŞ</h2>
            
            <div className="flex flex-col items-center gap-xs mb-lg">
              <div className="flex items-center gap-2 text-[#ffb4ab]">
                <span className="font-mono-label text-xs uppercase">HAK DURUMU</span>
              </div>
              <div className="flex gap-2 mt-2">
                <span className={`material-symbols-outlined ${oyun.haklar >= 1 ? 'text-[#ffb4ab]' : 'text-[#bacac1]/30'}`} style={{ fontVariationSettings: "'FILL' 1" }}>{oyun.haklar >= 1 ? 'favorite' : 'favorite_border'}</span>
                <span className={`material-symbols-outlined ${oyun.haklar >= 2 ? 'text-[#ffb4ab]' : 'text-[#bacac1]/30'}`} style={{ fontVariationSettings: "'FILL' 1" }}>{oyun.haklar >= 2 ? 'favorite' : 'favorite_border'}</span>
                <span className={`material-symbols-outlined ${oyun.haklar >= 3 ? 'text-[#ffb4ab]' : 'text-[#bacac1]/30'}`} style={{ fontVariationSettings: "'FILL' 1" }}>{oyun.haklar >= 3 ? 'favorite' : 'favorite_border'}</span>
              </div>
            </div>

             {/* Correct Answer Display */}
             {mevcutSoru && (
               <div className="w-full text-left mb-lg">
                <p className="font-mono-label text-[10px] uppercase text-[#bacac1] mb-2">Doğru Cevap:</p>
                <div className="w-full bg-primary-container/10 border border-primary-container/30 p-md rounded-lg flex items-center gap-3">
                  <div className="w-6 h-6 shrink-0 rounded-full bg-primary-container text-[#003829] font-mono-stat text-xs flex items-center justify-center">{mevcutSoru.dogru}</div>
                  <p className="text-primary font-body text-sm">{mevcutSoru.secenekler[mevcutSoru.dogru]}</p>
                </div>
                <div className="mt-3 w-full bg-[#343342]/30 rounded-lg p-md text-left">
                  <p className="text-[#bacac1] font-body text-sm leading-relaxed">{mevcutSoru.aciklama}</p>
                </div>
               </div>
             )}

            {/* CTA */}
            <button onClick={handleDevamEt} className="w-full h-12 border border-[#bacac1]/20 text-[#bacac1] font-h2 font-bold text-sm uppercase rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
              DEVAM ET
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
