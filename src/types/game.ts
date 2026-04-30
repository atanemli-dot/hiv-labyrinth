// ══════════════════════════════════════
// IMMUNE QUEST — Merkezi Tip Sistemi
// ══════════════════════════════════════

export type ModulType = 'hiv' | 'cinsel_saglik' | 'karma';
export type ZorlukType = 'kolay' | 'orta' | 'zor';
export type FormatType = 'coktan_secmeli' | 'senaryo' | 'dogru_yanlis' | 'boss';
export type EkranType = 'MainMenu' | 'ModulSec' | 'Exploration' | 'Scenario' | 'Feedback' | 'BossBattle' | 'ReportCard';

export interface Soru {
  id: string;
  modul: ModulType;
  format: FormatType;
  zorluk: ZorlukType;
  seviye: number;
  soru: string;
  senaryo_baglam: string | null;
  secenekler: {
    A: string;
    B: string;
    C: string;
    D: string;
    E?: string;
  };
  dogru: 'A' | 'B' | 'C' | 'D' | 'E';
  aciklama: string;
  kaynak_etiket: string;
  xp: number;
}

export interface ModulBilgi {
  id: ModulType;
  ad: string;
  aciklama: string;
  renk: string;
  icon: string;
  odalar: OdaBilgi[];
}

export interface OdaBilgi {
  id: string;
  ad: string;
  soruSayisi: number;
  format: FormatType;
  zorluk: ZorlukType;
  tamamlandi: boolean;
}

export interface OyunDurumu {
  xp: number;
  haklar: number;
  streak: number;
  enIyiStreak: number;
  dogru: number;
  yanlis: number;
  toplamSoru: number;
  mevcutModul: ModulType;
  mevcutSeviye: number;
  mevcutOda: string;
  tamamlananOdalar: string[];
  zayifEtiketler: string[];
  gucluEtiketler: string[];
  kazanilanRozetler: string[];
  modulPuanlar: {
    hiv: number;
    cinsel_saglik: number;
    karma: number;
  };
  modulToplamSoru: {
    hiv: number;
    cinsel_saglik: number;
    karma: number;
  };
}

export interface NavigateArgs {
  isCorrect?: boolean;
  modul?: ModulType;
  zorluk?: ZorlukType;
  soru?: Soru;
}

// Modül tanımları
export const MODULLER: ModulBilgi[] = [
  {
    id: 'hiv',
    ad: 'HIV Farkındalığı',
    aciklama: 'Bulaşma yolları, tedavi, stigma',
    renk: '#00E5B0',
    icon: '🧬',
    odalar: [
      { id: 'hiv-bulasma', ad: 'Bulaşma Yolları', soruSayisi: 5, format: 'dogru_yanlis', zorluk: 'kolay', tamamlandi: false },
      { id: 'hiv-tedavi', ad: 'Tedavi & Koruma', soruSayisi: 4, format: 'coktan_secmeli', zorluk: 'orta', tamamlandi: false },
      { id: 'hiv-stigma', ad: 'Stigma & Destek', soruSayisi: 4, format: 'senaryo', zorluk: 'orta', tamamlandi: false },
    ]
  },
  {
    id: 'cinsel_saglik',
    ad: 'Cinsel Sağlık',
    aciklama: 'Bilinçli onay, test, iletişim',
    renk: '#9B59FF',
    icon: '💜',
    odalar: [
      { id: 'cs-onay', ad: 'Bilinçli Onay', soruSayisi: 5, format: 'senaryo', zorluk: 'orta', tamamlandi: false },
      { id: 'cs-test', ad: 'Test & Tarama', soruSayisi: 4, format: 'coktan_secmeli', zorluk: 'kolay', tamamlandi: false },
      { id: 'cs-iletisim', ad: 'İletişim & Sınırlar', soruSayisi: 4, format: 'senaryo', zorluk: 'orta', tamamlandi: false },
    ]
  },
  {
    id: 'karma',
    ad: 'Karma Görev',
    aciklama: 'Dezenformasyon, kimlik, kritik kararlar',
    renk: '#FF6B6B',
    icon: '⚡',
    odalar: [
      { id: 'km-dez', ad: 'Dezenformasyon', soruSayisi: 5, format: 'senaryo', zorluk: 'orta', tamamlandi: false },
      { id: 'km-kimlik', ad: 'Kimlik & Kapsayıcılık', soruSayisi: 4, format: 'senaryo', zorluk: 'orta', tamamlandi: false },
      { id: 'km-karar', ad: 'Kritik Karar Anı', soruSayisi: 4, format: 'senaryo', zorluk: 'zor', tamamlandi: false },
    ]
  }
];

// Başlangıç oyun durumu
export const BASLANGIC_DURUMU: OyunDurumu = {
  xp: 0,
  haklar: 3,
  streak: 0,
  enIyiStreak: 0,
  dogru: 0,
  yanlis: 0,
  toplamSoru: 0,
  mevcutModul: 'hiv',
  mevcutSeviye: 1,
  mevcutOda: 'hiv-bulasma',
  tamamlananOdalar: [],
  zayifEtiketler: [],
  gucluEtiketler: [],
  kazanilanRozetler: [],
  modulPuanlar: { hiv: 0, cinsel_saglik: 0, karma: 0 },
  modulToplamSoru: { hiv: 0, cinsel_saglik: 0, karma: 0 },
};
