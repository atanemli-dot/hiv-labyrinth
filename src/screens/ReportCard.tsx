import React, { useState, useEffect } from 'react';
import { TopBar, Footer } from '../components/SharedElements';
import { useGame } from '../context/GameContext';
import { raporUret } from '../services/geminiService';

interface ReportCardProps {
  onNavigate: (screen: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ onNavigate }) => {
  const { oyun, oyunuSifirla } = useGame();
  const [rapor, setRapor] = useState<any>(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  const isGameOver = oyun.haklar <= 0;

  useEffect(() => {
    if (isGameOver) {
      setYukleniyor(false);
      return;
    }
    const fetchRapor = async () => {
      try {
        const res = await raporUret(oyun);
        setRapor(res);
      } catch (e) {
        console.error(e);
      } finally {
        setYukleniyor(false);
      }
    };
    fetchRapor();
  }, [isGameOver, oyun]);

  const handleYenidenOyna = () => {
    oyunuSifirla();
    onNavigate('ModulSec');
  };
  
  if (yukleniyor) {
    return (
      <div className="relative w-full h-full bg-[#0d0d1a] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-primary-container font-mono-label text-sm uppercase tracking-widest">Rapor Yükleniyor...</span>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="relative w-full h-full overflow-hidden flex flex-col items-center bg-[#1A0A0A]">
          <TopBar />
          <main className="w-full h-full pt-[88px] px-gutter pb-24 flex flex-col items-center justify-center gap-lg overflow-y-auto no-scrollbar">
              <div className="w-24 h-24 rounded-full border-4 border-[#ffb4ab] flex items-center justify-center mb-4 bg-[#ffb4ab]/10">
                 <span className="material-symbols-outlined text-[#ffb4ab] text-5xl">skull</span>
              </div>
              <h2 className="text-[#ffb4ab] font-h1 text-[32px] uppercase tracking-widest text-center">OYUN BİTTİ</h2>
              
              <div className="flex flex-col items-center gap-2 mt-4 text-[#bacac1]">
                 <span className="font-mono-label text-xs uppercase uppercase">Özet İstatistikler</span>
                 <div className="flex items-center gap-8 mt-2">
                    <div className="flex flex-col items-center">
                       <span className="font-mono-stat text-3xl text-amber-500">{oyun.xp}</span>
                       <span className="font-mono-label text-[10px] uppercase text-[#A0A0B8]">XP</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="font-mono-stat text-3xl text-primary-container">{oyun.dogru}</span>
                       <span className="font-mono-label text-[10px] uppercase text-[#A0A0B8]">Doğru</span>
                    </div>
                 </div>
              </div>
              
              <p className="text-[#A0A0B8] text-center mt-6 font-body max-w-[280px]">
                Sağlık bilgilerini tazeleyip daha güçlü dönebilirsin. Hemen pes etmek yok!
              </p>
              
              <div className="flex flex-col gap-4 w-full mt-12 max-w-sm">
                 <button onClick={handleYenidenOyna} className="w-full h-[52px] bg-[#ffb4ab] text-[#690005] font-bold text-[14px] rounded-lg tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">replay</span>
                    TEKRAR DENE
                 </button>
                 <button onClick={() => onNavigate('MainMenu')} className="w-full h-[48px] bg-transparent border border-[#ffb4ab]/30 text-[#ffb4ab] font-semibold text-[14px] rounded-lg tracking-wider active:scale-[0.98] transition-all">
                    ANA MENÜ
                 </button>
              </div>
          </main>
      </div>
    );
  }

  const hivOran = oyun.modulToplamSoru.hiv > 0 ? Math.round((oyun.modulPuanlar.hiv / (oyun.modulToplamSoru.hiv * 20)) * 100) : 0;
  const csOran = oyun.modulToplamSoru.cinsel_saglik > 0 ? Math.round((oyun.modulPuanlar.cinsel_saglik / (oyun.modulToplamSoru.cinsel_saglik * 20)) * 100) : 0;
  const karmaOran = oyun.modulToplamSoru.karma > 0 ? Math.round((oyun.modulPuanlar.karma / (oyun.modulToplamSoru.karma * 20)) * 100) : 0;

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center bg-[#0d0d1a]">
      <TopBar />

      <main className="w-full h-full pt-[88px] px-gutter pb-24 flex flex-col gap-lg overflow-y-auto no-scrollbar">
        {/* Header Section */}
        <section className="flex flex-col gap-xs shrink-0">
          <span className="font-h2 text-[11px] font-bold uppercase text-[#A0A0B8]">OYUN TAMAMLANDI</span>
          <h2 className="font-h2 text-h2 text-white">Bugünkü Rapor Kartın</h2>
        </section>

        {/* Total XP */}
        <section className="flex flex-col items-center justify-center py-margin shrink-0">
          <div className="flex items-center gap-sm text-primary-container">
            <span className="text-[48px] leading-none">⬡</span>
            <span className="font-mono-stat text-[64px] leading-none">{oyun.xp}</span>
          </div>
          <span className="font-mono-label text-mono-label text-[#A0A0B8] mt-xs">TOTAL XP</span>
          <div className="w-full h-[1px] bg-primary-container/20 mt-margin"></div>
        </section>

        {/* Badges Row */}
        {oyun.kazanilanRozetler.length > 0 && (
          <section className="shrink-0">
            <h3 className="font-mono-label text-[#A0A0B8] mb-3">KAZANILAN ROZETLER</h3>
            <div className="flex gap-md overflow-x-auto pb-sm snap-x no-scrollbar">
              {oyun.kazanilanRozetler.map((r, i) => (
                <div key={i} className="min-w-[120px] bg-[#141428] rounded-lg p-md border border-white/10 flex flex-col items-center justify-center gap-sm snap-start">
                  <div className="w-12 h-12 flex items-center justify-center relative">
                     <div className="absolute inset-0 text-primary-container opacity-20 transform scale-[1.5] rotate-90">⬡</div>
                     <span className="material-symbols-outlined text-primary-container z-10 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                  </div>
                  <span className="font-mono-label text-[12px] text-center text-white leading-tight mt-2">{r}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Module Scores */}
        <section className="flex flex-col gap-md shrink-0">
          <h3 className="font-mono-label text-[#A0A0B8]">MODÜL BAŞARILARI</h3>
          
          <div className="bg-[#141428] rounded-lg p-md border border-white/10 flex flex-col gap-sm">
            <div className="flex justify-between items-center text-white">
              <span className="font-body text-[14px] font-semibold">HIV Farkındalığı</span>
              <span className="font-mono-stat text-[14px]">{hivOran}%</span>
            </div>
            <div className="h-2 w-full bg-[#1E1E3A] rounded-full overflow-hidden">
              <div className="h-full bg-primary-container rounded-full transition-all duration-1000" style={{ width: `${Math.min(hivOran, 100)}%` }}></div>
            </div>
          </div>

          <div className="bg-[#141428] rounded-lg p-md border border-white/10 flex flex-col gap-sm">
            <div className="flex justify-between items-center text-white">
              <span className="font-body text-[14px] font-semibold">Cinsel Sağlık</span>
              <span className="font-mono-stat text-[14px]">{csOran}%</span>
            </div>
            <div className="h-2 w-full bg-[#1E1E3A] rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full transition-all duration-1000" style={{ width: `${Math.min(csOran, 100)}%` }}></div>
            </div>
          </div>

          <div className="bg-[#141428] rounded-lg p-md border border-white/10 flex flex-col gap-sm">
            <div className="flex justify-between items-center text-white">
              <span className="font-body text-[14px] font-semibold">Karma Modül</span>
              <span className="font-mono-stat text-[14px]">{karmaOran}%</span>
            </div>
            <div className="h-2 w-full bg-[#1E1E3A] rounded-full overflow-hidden">
              <div className="h-full bg-[#FFB4AB] rounded-full transition-all duration-1000" style={{ width: `${Math.min(karmaOran, 100)}%` }}></div>
            </div>
          </div>
        </section>

        {/* AI Insight */}
        {rapor && (
           <section className="bg-[#141428] rounded-r-lg p-md border border-white/10 border-l-4 border-l-primary-container flex flex-col gap-sm shrink-0">
             <div className="flex items-center gap-sm">
               <span className="material-symbols-outlined text-primary-container text-[20px]">smart_toy</span>
               <span className="font-mono-label text-[12px] text-white tracking-widest uppercase">Gemini AI Analizi</span>
             </div>
             <p className="font-body text-[14px] text-[#bacac1] leading-relaxed italic mb-1">
               "{rapor.slogan}"
             </p>
             <p className="font-body text-[14px] text-[#A0A0B8] leading-relaxed">
               {rapor.ozet}
             </p>
             {oyun.zayifEtiketler.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {oyun.zayifEtiketler.map(t => (
                    <div key={t} className="inline-flex items-center gap-xs px-2 py-1 rounded bg-[#FFB4AB]/10 border border-[#FFB4AB]/30 w-fit">
                      <span className="material-symbols-outlined text-[#FFB4AB] text-[14px]">warning</span>
                      <span className="font-mono-label text-[10px] text-[#FFB4AB] uppercase">{t.substring(0, 20)}</span>
                    </div>
                  ))}
                </div>
             )}
           </section>
        )}

        {/* Resource Links */}
        {rapor?.kaynaklar?.length > 0 && (
           <section className="flex flex-col gap-sm shrink-0 mt-2">
             <h3 className="font-mono-label text-[#A0A0B8]">ÖNERİLEN KAYNAKLAR</h3>
             {rapor.kaynaklar.map((r: string, index: number) => (
                <a key={index} className="bg-[#141428] rounded-lg p-md border border-white/10 flex items-center justify-between group active:scale-[0.98] transition-transform duration-200" href="#">
                  <div className="flex items-center gap-md">
                    <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center">
                       <span className="material-symbols-outlined text-primary-container text-[16px]">public</span>
                    </div>
                    <span className="font-body text-[14px] text-white">{r}</span>
                  </div>
                  <span className="material-symbols-outlined text-[#A0A0B8] group-hover:text-white transition-colors text-sm">arrow_forward</span>
                </a>
             ))}
           </section>
        )}

        {/* Action Buttons */}
        <section className="flex flex-col gap-md py-md shrink-0 mt-4">
          <button 
             onClick={handleYenidenOyna}
             className="w-full bg-primary-container text-on-primary-container font-mono-label text-[16px] py-4 rounded-lg font-bold tracking-widest active:scale-[0.98] transition-transform duration-200 flex items-center justify-center gap-sm">
             <span className="material-symbols-outlined">rocket_launch</span>
             YENİDEN BAŞLA
          </button>
          <button 
             onClick={() => onNavigate('MainMenu')}
             className="w-full bg-transparent border border-white/20 text-white font-mono-label text-[14px] py-4 rounded-lg tracking-widest active:scale-[0.98] transition-transform duration-200">
             ANA MENÜ
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};
