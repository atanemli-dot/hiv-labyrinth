import React from 'react';
import { WallLog } from '../data/wallLogs';

export interface WallLogOverlayProps {
  log: WallLog;
  onClose: () => void;
}

const TYPE_COLORS: Record<WallLog['tip'], string> = {
  hasta_gunlugu: '#9B59FF',
  klinik_notu: '#00E5B0',
  hacker_notu: '#FF6B6B',
  arastirma_verisi: '#FFD93D'
};

const TITLE_NAMES: Record<WallLog['tip'], string> = {
  hasta_gunlugu: 'HASTA GÜNLÜĞÜ',
  klinik_notu: 'KLİNİK NOTU',
  hacker_notu: 'HACKER NOTU',
  arastirma_verisi: 'ARAŞTIRMA VERİSİ'
};

export const WallLogOverlay: React.FC<WallLogOverlayProps> = ({ log, onClose }) => {
  const color = TYPE_COLORS[log.tip];

  return (
    <div className="absolute inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 pointer-events-auto">
      <div 
        className="w-full max-w-sm bg-[#1E1E1E] rounded-lg p-8 text-center"
        style={{
          border: `2px solid ${color}`,
          borderTop: `16px solid ${color}`,
          boxShadow: `0 0 30px ${color}60`
        }}
      >
        <div style={{ color, letterSpacing: '2px' }} className="text-sm mb-4 font-bold uppercase">
          {TITLE_NAMES[log.tip]}
        </div>
        
        <h2 className="text-2xl mb-6 leading-snug text-white font-bold">
          {log.baslik}
        </h2>
        
        <div className="bg-[#111] p-6 rounded-md text-lg leading-relaxed mb-8 text-[#EEE] text-left">
          {log.icerik}
        </div>

        <button 
          onClick={onClose}
          className="uppercase tracking-widest font-bold py-3 px-10 rounded transition-colors"
          style={{
            backgroundColor: color,
            color: '#000',
            boxShadow: `0 0 10px ${color}80`
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = color!}
        >
          Kapat
        </button>
      </div>
    </div>
  );
};

export default WallLogOverlay;
