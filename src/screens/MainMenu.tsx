import React from 'react';
import { Footer } from '../components/SharedElements';

interface MainMenuProps {
  onNavigate: (screen: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full h-full bg-[#0D0D1A] overflow-hidden flex flex-col items-center">
      {/* FIXED TOP STATUS BAR */}
      <header className="fixed top-0 w-full max-w-[390px] h-[44px] px-6 flex justify-between items-center z-50 bg-[#0D0D1A]/80 backdrop-blur-md">
        <div className="flex items-center gap-1 font-mono-stat text-mono-label text-[#F5A623]">
          <span>🔥</span> 0
        </div>
        <div className="flex items-center gap-1 font-mono-stat text-mono-label text-primary-container font-semibold">
          <span>★</span> 0 XP
        </div>
      </header>

      {/* TOP APP BAR */}
      <div className="fixed top-0 w-full max-w-[390px] z-40 flex justify-between items-center px-6 h-16 border-b border-white/10 mt-[44px]">
        <span className="font-h1 text-lg font-black text-[#00E5B0] tracking-widest">IMMUNE QUEST</span>
        <div className="text-[#A0A0B8] font-mono-label text-[10px]">⚡ 0 ⧖ 0</div>
      </div>

      {/* MAIN MENU CONTENT */}
      <main className="flex-1 w-full flex flex-col items-center justify-center px-gutter pt-20 pb-16 text-center space-y-8 z-10 relative">
        {/* SHIELD LOGO */}
        <div className="relative group">
          <div className="w-[110px] h-[130px] bg-surface-container flex items-center justify-center border-2 border-primary-container transition-transform duration-300 group-hover:scale-105"
               style={{ clipPath: 'polygon(50% 0%, 100% 18%, 100% 62%, 50% 100%, 0% 62%, 0% 18%)' }}>
            <span className="text-[40px] font-bold text-primary-container">+</span>
          </div>
        </div>

        {/* IDENTITY SECTION */}
        <div className="space-y-2 relative z-10">
          <h1 className="font-h1 text-[28px] font-bold text-white tracking-[0.08em] uppercase">IMMUNE QUEST</h1>
          <p className="font-body text-[13px] text-[#A0A0B8]">HIV &amp; Cinsel Sağlık Farkındalık Oyunu</p>
        </div>

        {/* MODULE PILLS */}
        <div className="flex flex-wrap justify-center gap-sm relative z-10">
          <span className="px-3 py-1 text-[11px] font-mono-label border border-primary-container text-primary-container bg-primary-container/10 rounded-full flex items-center gap-1">
            <span className="text-[8px]">●</span> HIV
          </span>
          <span className="px-3 py-1 text-[11px] font-mono-label border border-[#9B59FF] text-[#9B59FF] bg-[#9B59FF]/10 rounded-full flex items-center gap-1">
            <span className="text-[8px]">●</span> CİNSEL SAĞLIK
          </span>
          <span className="px-3 py-1 text-[11px] font-mono-label border border-[#FF6B6B] text-[#FF6B6B] bg-[#FF6B6B]/10 rounded-full flex items-center gap-1">
            <span className="text-[8px]">●</span> KARMA
          </span>
        </div>

        {/* ACTIONS */}
        <div className="w-full max-w-[280px] flex flex-col gap-4 mt-4 relative z-10">
          <button onClick={() => onNavigate('ModulSec')} className="h-[52px] w-full bg-primary-container text-[#0D0D1A] font-bold text-[16px] rounded-lg active:scale-[0.98] transition-transform duration-200 flex items-center justify-center gap-2">
            OYUNA BAŞLA <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
          </button>
          <button className="h-[48px] w-full border border-[#9B59FF] text-[#9B59FF] font-semibold text-[14px] rounded-lg active:scale-[0.98] transition-transform duration-200 uppercase tracking-wider">
            SKOR TABLOSU
          </button>
          <button className="h-[40px] w-full text-[#555566] text-[13px] font-medium underline decoration-dotted underline-offset-4 hover:text-[#A0A0B8] transition-colors">
            NASIL OYNANIR?
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* DECORATIVE BACKGROUND IMAGES (HUD Style) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-10 -right-20 w-64 h-64 bg-primary-container/5 blur-[100px] rounded-full"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-secondary-container/5 blur-[120px] rounded-full"></div>
        {/* Abstract Grid Pattern */}
        <svg className="absolute bottom-16 left-0 opacity-10" height="100" width="390">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#FFFFFF" strokeWidth="0.5"></path>
            </pattern>
          </defs>
          <rect width="390" height="100" fill="url(#grid)"></rect>
        </svg>
      </div>
    </div>
  );
};
