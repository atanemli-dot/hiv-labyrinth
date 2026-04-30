import React from 'react';

export const TopBar: React.FC<{ title?: string; leftIcon?: string; rightText?: string; showBackground?: boolean }> = ({
  title = 'IMMUNE QUEST',
  leftIcon = 'shield',
  rightText = '⚡ 0 ⧖ 0',
  showBackground = true,
}) => {
  return (
    <header className={`fixed top-0 w-full max-w-[390px] z-50 flex justify-between items-center px-6 h-16 ${showBackground ? 'bg-[#0D0D1A]/90 backdrop-blur-md border-b border-white/10' : ''}`}>
      <div className="flex items-center gap-2">
        {leftIcon && (
          <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
            {leftIcon}
          </span>
        )}
        <h1 className="font-h1 font-bold uppercase tracking-widest text-[#00E5B0] text-lg">
          {title}
        </h1>
      </div>
      <div className="font-mono-stat text-sm font-bold text-primary-container bg-[#1E1E3A] px-3 py-1 rounded-full">
        {rightText}
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 w-full max-w-[390px] z-50 flex justify-center items-center py-3 bg-[#0D0D1A]/80 backdrop-blur-md border-t border-white/10">
      <span className="font-mono-label text-[10px] uppercase tracking-widest text-[#A0A0B8]">v1.0.4-BETA | DEFENSE PROTOCOL ACTIVE</span>
    </footer>
  );
};

export const MobileContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`relative w-full max-w-[390px] h-screen max-h-[844px] bg-[#0D0D1A] overflow-hidden shadow-2xl flex flex-col mx-auto ${className}`}>
      {children}
    </div>
  );
};
