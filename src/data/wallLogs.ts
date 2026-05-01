export interface WallLog {
  id: string;
  modul: 'hiv' | 'cinsel_saglik' | 'karma';
  baslik: string;
  icerik: string;
  tip: 'hasta_gunlugu' | 'klinik_notu' | 'hacker_notu' | 'arastirma_verisi';
}

export const wallLogs: WallLog[] = [
  // --- HIV MODÜLÜ ---
  {
    id: 'hiv_log_1',
    modul: 'hiv',
    baslik: 'Hasta Günlüğü #3 — Damgalanma',
    icerik: 'Bugün klinikteki bakışlar yine üzerimdeydi. Düzenli tedavi görerek virüsü bulaştırmadığımı (B=B) kimse bilmiyor gibi. Sessizliği bozmalıyız.',
    tip: 'hasta_gunlugu'
  },
  {
    id: 'hiv_log_2',
    modul: 'hiv',
    baslik: 'Klinik Notu - B=B Kriteri',
    icerik: 'Hastanın viral yükü son 6 aydır saptanamayan seviyede. Bu durum (Belirlenemeyen = Bulaştırmayan) bulaş riskini sıfıra indirdi. Tedaviye devam.',
    tip: 'klinik_notu'
  },
  {
    id: 'hiv_log_3',
    modul: 'hiv',
    baslik: 'Hacker Notu :: Temas Öncesi',
    icerik: 'Sisteme sızarken PrEP (Temas Öncesi Profilaksi) dosyalarını buldum. Riskli temas öncesi ilaç kullanımıyla HIV bulaşı %99 oranında engellenebiliyor.',
    tip: 'hacker_notu'
  },
  {
    id: 'hiv_log_4',
    modul: 'hiv',
    baslik: 'Araştırma Verisi: ART Başarısı',
    icerik: 'Erken tanı ve hekime ulaşıp hemen başlanan Antiretroviral Tedavi (ART), hastaların yaşam kalitesini HIV negatif bireylerle aynı seviyeye getirdi.',
    tip: 'arastirma_verisi'
  },

  // --- CİNSEL SAĞLIK MODÜLÜ ---
  {
    id: 'cs_log_1',
    modul: 'cinsel_saglik',
    baslik: 'Klinik Acil Vakası',
    icerik: 'HPV aşısı olmayan hastada genital siğil vakası gözlemlendi. HPV aşısının hem kadınlarda hem erkeklerde yüksek oranda koruyucu olduğu hatırlatıldı.',
    tip: 'klinik_notu'
  },
  {
    id: 'cs_log_2',
    modul: 'cinsel_saglik',
    baslik: 'Bilinçli Gençlik Anketi',
    icerik: 'Öğrenciler arasında prezervatifin sadece hamileliği değil, frengi ve klamidya gibi enfeksiyonları da büyük oranda önlediği farkındalığı artıyor.',
    tip: 'arastirma_verisi'
  },
  {
    id: 'cs_log_3',
    modul: 'cinsel_saglik',
    baslik: 'Hasta Günlüğü #12 — Yanlış İnanç',
    icerik: 'Yıllarca doğum kontrol haplarının beni enfeksiyonlardan koruyacağını sanıyordum. Bugün doktorumdan bunun sadece hamileliği önlediğini öğrendim.',
    tip: 'hasta_gunlugu'
  },
  {
    id: 'cs_log_4',
    modul: 'cinsel_saglik',
    baslik: 'Sızıntı_v2: Gizli Tehlike',
    icerik: 'Bilinmeyen bağlantı noktası: Testis kanseri genç erkeklerde daha sık görülüyor. Ayda bir kez duşta kendi kendine muayene hayat kurtarır.',
    tip: 'hacker_notu'
  },

  // --- KARMA MODÜL ---
  {
    id: 'karma_log_1',
    modul: 'karma',
    baslik: 'Ortak Gözlem Raporu',
    icerik: 'Güvenli cinsel yaşam çok boyutludur: Hem bariyer yöntemlerle korunma, hem düzenli CYBE testleri hem de partnerle açık iletişim gerektirir.',
    tip: 'arastirma_verisi'
  },
  {
    id: 'karma_log_2',
    modul: 'karma',
    baslik: 'Parçalanmış Disk Verisi',
    icerik: 'Hepatit B de cinsel yolla bulaşabilir ve ciddi karaciğer hasarına yol açar. Korunmak için Hepatit B aşısı yaptırmak son derece önemlidir.',
    tip: 'hacker_notu'
  },
  {
    id: 'karma_log_3',
    modul: 'karma',
    baslik: 'Doktorun Ajandası',
    icerik: 'Damgalanma, enfeksiyonlardan daha tehlikeli. Çevremizi eğitmek zorundayız. Pozitif bireylere psikolojik destek sunmak tedavinin kendisi kadar hayati.',
    tip: 'klinik_notu'
  },
  {
    id: 'karma_log_4',
    modul: 'karma',
    baslik: 'Yeni Bir Başlangıç',
    icerik: 'Artık test sonuçlarımı düzenli takip ediyorum. Sağlığımı kontrol altında tutmak bana büyük bir güç veriyor. Kendini tanı, riskten kaçın!',
    tip: 'hasta_gunlugu'
  }
];
