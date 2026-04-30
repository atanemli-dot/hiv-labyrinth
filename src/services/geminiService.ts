// ══════════════════════════════════════
// IMMUNE QUEST — (Mocked) API Servisi
// ══════════════════════════════════════
import { Soru, ModulType, ZorlukType, FormatType, OyunDurumu } from '../types/game';
import { getRandomQuestion } from '../data/mockQuestions';

export async function soruUret(
  oyun: OyunDurumu,
  modul?: ModulType,
  zorlukOverride?: ZorlukType,
  formatOverride?: FormatType
): Promise<Soru> {
  const hedefModul = modul ?? oyun.mevcutModul;
  // Simulate network delay to maintain UI feel
  await new Promise(r => setTimeout(r, 1000));
  return getRandomQuestion(hedefModul, false);
}

export async function bosssoruUret(modul: ModulType): Promise<Soru> {
  await new Promise(r => setTimeout(r, 1500));
  return getRandomQuestion(modul, true);
}

export async function raporUret(oyun: OyunDurumu): Promise<{
  ozet: string;
  hiv_yorum: string;
  cs_yorum: string;
  karma_yorum: string;
  kaynaklar: string[];
  slogan: string;
}> {
  await new Promise(r => setTimeout(r, 1500));

  const hivOran = oyun.modulToplamSoru.hiv > 0
    ? Math.round((oyun.modulPuanlar.hiv / (oyun.modulToplamSoru.hiv * 20)) * 100) : 0;
  const csOran = oyun.modulToplamSoru.cinsel_saglik > 0
    ? Math.round((oyun.modulPuanlar.cinsel_saglik / (oyun.modulToplamSoru.cinsel_saglik * 20)) * 100) : 0;
  const karmaOran = oyun.modulToplamSoru.karma > 0
    ? Math.round((oyun.modulPuanlar.karma / (oyun.modulToplamSoru.karma * 20)) * 100) : 0;

  return {
    ozet: `Oyun boyunca sergilediğin performans harikaydı! Toplam ${oyun.xp} XP kazandın ve soruları büyük bir zihinsel dayanıklılıkla çözdün.`,
    hiv_yorum: `HIV Farkındalığı modülündeki başarının % ${hivOran}. Temel bilgilerde sağlam bir duruşun var.`,
    cs_yorum: `Cinsel Sağlık C-S modülündeki başarının % ${csOran}. Doğru iletişim ve güvenli seks konusunda pratiklerini geliştiriyorsun.`,
    karma_yorum: `Karma görevdeki başarının % ${karmaOran}. Toplumsal dezenformasyonlara karşı dikkatlisin.`,
    kaynaklar: ["https://kirmizikurdele.org", "https://pozitifyasam.org"],
    slogan: "Kendin için öğren, toplum için koru!"
  };
}
