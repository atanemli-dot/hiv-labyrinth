import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface SwipeSortItem {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface SwipeSortProps {
  items: SwipeSortItem[];
  onComplete: (correct: number, total: number) => void;
  accentColor?: string;
}

export const SwipeSort: React.FC<SwipeSortProps> = ({ 
  items, 
  onComplete, 
  accentColor = '#00E5B0' 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAttempted, setWrongAttempted] = useState<Set<string>>(new Set());

  // Sürükleme ve animasyon durumları
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [flyAwayDir, setFlyAwayDir] = useState<'left' | 'right' | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const maxDrag = 80; // Kararın kabul edilmesi için geçilmesi gereken piksel mesafesi

  if (!items || items.length === 0 || activeIndex >= items.length) return null;

  const handleDragStart = (clientX: number) => {
    if (flyAwayDir || isShaking) return;
    setIsDragging(true);
    setStartX(clientX - dragX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    setDragX(clientX - startX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragX > maxDrag) {
      verifySwipe('right');
    } else if (dragX < -maxDrag) {
      verifySwipe('left');
    } else {
      // 80px'i geçmediyse geri merkeze dön
      setDragX(0);
    }
  };

  const verifySwipe = (dir: 'left' | 'right') => {
    const item = items[activeIndex];
    const isRight = dir === 'right';
    
    // Sağ: Güvenli/Doğru, Sol: Riskli/Yanlış sınıflandırması
    const isCorrectClassification = item.isCorrect === isRight;

    if (isCorrectClassification) {
      // Başarılı kaydırma, kartı ekrandan uçur
      setFlyAwayDir(dir);
      setDragX(dir === 'right' ? window.innerWidth + 200 : -window.innerWidth - 200);

      const wasWrongBefore = wrongAttempted.has(item.id);
      if (!wasWrongBefore) {
        setScore(s => s + 1);
      }

      // Yeni karta geçiş
      setTimeout(() => {
        if (activeIndex + 1 >= items.length) {
          onComplete(score + (!wasWrongBefore ? 1 : 0), items.length);
        } else {
          setActiveIndex(idx => idx + 1);
          setDragX(0);
          setFlyAwayDir(null);
          setFeedbackMsg(null);
        }
      }, 350);
    } else {
      // Başarısız kaydırma: Titreme animasyonu ve hata geri bildirimi
      setWrongAttempted(prev => {
        const next = new Set(prev);
        next.add(item.id);
        return next;
      });
      setDragX(0);
      setIsShaking(true);
      setFeedbackMsg('Yanlış Sınıflandırma!');
      
      setTimeout(() => {
        setIsShaking(false);
        setFeedbackMsg(null);
      }, 500);
    }
  };

  // Stack/Yığın efekti için maksimum 3 kartı üst üste gösteriyoruz
  const cardsToRender = items.slice(activeIndex, activeIndex + 3).map((item, idx) => {
    return { item, diff: idx, originalIdx: activeIndex + idx };
  }).reverse();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-sm mx-auto aspect-[3/4] flex items-center justify-center select-none overflow-visible touch-none"
    >
      <style>{`
        @keyframes swipeShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-15px) rotate(-4deg); }
          40% { transform: translateX(15px) rotate(4deg); }
          60% { transform: translateX(-15px) rotate(-4deg); }
          80% { transform: translateX(15px) rotate(4deg); }
        }
        .animate-swipe-shake {
          animation: swipeShake 0.4s ease-in-out;
        }
      `}</style>

      {cardsToRender.map(({ item, diff }) => {
        const isActive = diff === 0;

        let curDragX = 0;
        let rotation = 0;

        if (isActive) {
          curDragX = dragX;
          // Maximum ±15 derece dönüş
          rotation = (curDragX / 150) * 15;
          rotation = Math.max(-15, Math.min(15, rotation));
        }

        // Alttaki kartlar için stack efekti (küçülme ve aşağı kayma)
        const scale = isActive ? 1 : 1 - (diff * 0.05);
        const translateY = isActive ? 0 : diff * 20;

        // Görsel ipucu opaklıkları
        const safeOpacity = isActive ? Math.min(1, Math.max(0, curDragX / maxDrag)) : 0;
        const riskyOpacity = isActive ? Math.min(1, Math.max(0, -curDragX / maxDrag)) : 0;

        return (
          <div
            key={item.id}
            className="absolute w-full h-full"
            style={{
              transform: \`translate3d(\${curDragX}px, \${translateY}px, 0) scale(\${scale}) rotate(\${rotation}deg)\`,
              transition: isDragging && isActive ? 'none' : 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
              zIndex: 20 - diff,
            }}
          >
            <div
              className={\`w-full h-full bg-[#151525] rounded-3xl flex flex-col justify-center items-center p-8 border-2 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)]
                \${isActive && isShaking ? 'animate-swipe-shake border-[#FF6B6B]' : 'border-[#2A2A4A]'} 
              \`}
              style={{ cursor: isActive ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
              // Event Bindingleri
              onMouseDown={isActive ? (e: React.MouseEvent) => handleDragStart(e.clientX) : undefined}
              onMouseMove={isActive ? (e: React.MouseEvent) => handleDragMove(e.clientX) : undefined}
              onMouseUp={isActive ? handleDragEnd : undefined}
              onMouseLeave={isActive ? handleDragEnd : undefined}
              onTouchStart={isActive ? (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX) : undefined}
              onTouchMove={isActive ? (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX) : undefined}
              onTouchEnd={isActive ? handleDragEnd : undefined}
            >
              {/* Hata Bildirimi */}
              {isActive && feedbackMsg && (
                <div className="absolute top-1/4 z-50 text-[#FF6B6B] font-bold tracking-wide bg-[#FF6B6B]/15 px-6 py-3 rounded-lg border border-[#FF6B6B]/30 shadow-lg backdrop-blur-sm">
                  {feedbackMsg}
                </div>
              )}

              {/* Sağ - GÜVENLİ İpucu */}
              <div 
                className="absolute top-8 left-6 border-4 text-2xl font-black px-4 py-2 rounded-xl uppercase transform -rotate-12 pointer-events-none shadow-sm tracking-wider"
                style={{ 
                  opacity: safeOpacity, 
                  color: accentColor, 
                  borderColor: accentColor 
                }}
              >
                GÜVENLİ
              </div>
              
              {/* Sol - RİSKLİ İpucu */}
              <div 
                className="absolute top-8 right-6 border-4 border-[#FF6B6B] text-[#FF6B6B] font-black text-2xl px-4 py-2 rounded-xl uppercase transform rotate-12 pointer-events-none shadow-sm tracking-wider"
                style={{ opacity: riskyOpacity }}
              >
                RİSKLİ
              </div>

              {/* Kart Metni */}
              <div className="text-2xl text-center text-[#E2E8F0] font-semibold leading-relaxed pointer-events-none">
                {item.text}
              </div>

              {/* Alttaki yönergeler (Kart ile sürüklenmiyor ve sadece dinlenirken çıkıyor) */}
              {isActive && !isDragging && !flyAwayDir && dragX === 0 && !isShaking && (
                 <div className="absolute bottom-6 flex justify-between w-full px-8 text-sm font-bold text-gray-500 opacity-60 uppercase tracking-widest pointer-events-none transition-opacity duration-300">
                   <span>&larr; Riskli</span>
                   <span>Güvenli &rarr;</span>
                 </div>
              )}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

/*
// ==========================================
// KULLANIM ÖRNEĞİ:
// ==========================================

import { SwipeSort } from './SwipeSort';

const ornekKartlar = [
  { id: '1', text: 'Düzenli egzersiz yapmak', isCorrect: true },
  { id: '2', text: 'Aşırı şeker tüketmek', isCorrect: false },
  { id: '3', text: 'Elleri yıkamadan yemek yemek', isCorrect: false },
  { id: '4', text: 'Günde 8 saat uyumak', isCorrect: true },
];

export const OyunEkrani = () => {
  return (
    <div className="w-full h-screen bg-[#0D0D1A] flex flex-col justify-center items-center p-4">
      <div className="mb-10 text-center">
        <h2 className="text-[#00E5B0] text-3xl font-bold mb-2 drop-shadow-md">Karar Zamanı</h2>
        <p className="text-gray-400 font-medium">Bu alışkanlıklar dost mu düşman mı?</p>
      </div>

      <SwipeSort 
        items={ornekKartlar} 
        onComplete={(correct, total) => {
          alert(\`Oyun bitti! \${total} kartın \${correct} tanesini ilk denemede doğru bildiniz.\`);
        }} 
      />
    </div>
  );
};
*/
