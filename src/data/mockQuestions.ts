import { Soru, ModulType } from '../types/game';

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export const mockQuestions: Partial<Record<ModulType, Omit<Soru, 'id' | 'modul'>[]>> = {
  hiv: [
    {
      format: 'dogru_yanlis',
      zorluk: 'kolay',
      seviye: 1,
      soru: 'HIV aynı kaptan su içmekle veya sarılmakla bulaşır.',
      senaryo_baglam: null,
      secenekler: {
        A: 'Doğru',
        B: 'Yanlış',
        C: '',
        D: ''
      },
      dogru: 'B',
      aciklama: 'HIV; sarılma, öpüşme, ter, aynı kabı kullanma gibi günlük temaslarla bulaşmaz.',
      kaynak_etiket: 'bulasma_yollari',
      xp: 10
    },
    {
      format: 'coktan_secmeli',
      zorluk: 'orta',
      seviye: 1,
      soru: 'Belirlenemeyen = Bulaştırmayan (B=B) ne anlama gelir?',
      senaryo_baglam: null,
      secenekler: {
        A: 'Düzenli ilaç alan ve virüs yükü saptanamayan bir kişi HIV bulaştıramaz.',
        B: 'Virüs tamamen vücuttan atılmıştır.',
        C: 'HIV sadece kan yoluyla bulaşır.',
        D: 'Test yaptırmayan kişilerde bulaşma görünmeyebilir.'
      },
      dogru: 'A',
      aciklama: 'Uygun tedaviyle viral yükü belirlenemeyen seviyeye inen bireyler, virüsü cinsel yolla başkalarına bulaştıramaz.',
      kaynak_etiket: 'tedavi_b_esittir_b',
      xp: 20
    },
    {
      format: 'senaryo',
      zorluk: 'orta',
      seviye: 1,
      soru: 'Ahmet test sonucunu seninle paylaştı: "Knk pozitif çıktım, çok korkuyorum herkes benden iğrenecek."',
      senaryo_baglam: 'WhatsApp',
      secenekler: {
        A: 'Geçmiş olsun, uzak dur benden.',
        B: 'Bunu hemen ailemize haber vermeliyiz.',
        C: 'Korkma, modern tedaviyle hayatına sağlıklı ve normal devam etmen mümkün. İstersen detayları birlikte araştıralım.',
        D: 'Kiminle olduysan hemen onu bul ve şikayet et.'
      },
      dogru: 'C',
      aciklama: 'Pozitif tanı alan birine doğru bilgi vererek ve yanında olduğunu hissettirerek destek olmak stigma ile mücadelenin en iyi yoludur.',
      kaynak_etiket: 'stigma',
      xp: 20
    }
  ],
  cinsel_saglik: [
    {
      format: 'coktan_secmeli',
      zorluk: 'kolay',
      seviye: 1,
      soru: 'Cinsel yolla aktarılan enfeksiyonlardan (CYAE) korunmanın en etkili yolu nedir?',
      senaryo_baglam: null,
      secenekler: {
        A: 'Doğum kontrol hapı kullanmak',
        B: 'Prezervatif (kondom) kullanmak',
        C: 'Geri çekilme yöntemi',
        D: 'Sadece tanıdık kişilerle birlikte olmak'
      },
      dogru: 'B',
      aciklama: 'Kondom kullanımı hem istenmeyen gebeliklere hem de CYAE\'lere karşı en etkili bariyer yöntemidir.',
      kaynak_etiket: 'korunma',
      xp: 10
    },
    {
      format: 'senaryo',
      zorluk: 'orta',
      seviye: 1,
      soru: '"Birlikte olmadan önce partnerime test durumunu sormalı mıyım? Nasıl tepki verir bilmiyorum." diyen birine ne önerirsin?',
      senaryo_baglam: 'Forum',
      secenekler: {
        A: 'Risk oluşturmamak için bu konuyu açmamak daha iyidir.',
        B: 'Test durumunu sormak senin en doğal hakkındır, iletişim sağlıklı cinselliğin bir parçasıdır.',
        C: 'Karşı tarafı incitmemek için senin test yaptırman yeterli.',
        D: 'Eğer bir belirtisi yoksa sormaya gerek yoktur.'
      },
      dogru: 'B',
      aciklama: 'Partnerlerle cinsel sağlık hakkında açık iletişim kurmak güvenliğin ilk kuralıdır.',
      kaynak_etiket: 'iletisim',
      xp: 20
    }
  ],
  karma: [
    {
      format: 'senaryo',
      zorluk: 'zor',
      seviye: 1,
      soru: 'Bir arkadaşın sosyal medyada "Sivrisinekler HIV taşıyor ve bulaştırıyor!" yazılı bir gönderi paylaştı.',
      senaryo_baglam: 'Twitter / X',
      secenekler: {
        A: 'Hemen Retweetle ve herkesi uyar.',
        B: 'Yorum yaz: Bu bilgi yanlış, virüs sivrisinek veya böcek ısırığıyla bulaşmaz.',
        C: 'Arkadaşını blokla.',
        D: 'Beğenmekle yetin ama içeriğe inanma.'
      },
      dogru: 'B',
      aciklama: 'HIV, böcek veya sivrisinek ısırığıyla bulaşmaz. Yanlış bilginin önüne geçmek doğru farkındalık yaratır.',
      kaynak_etiket: 'dezenformasyon',
      xp: 30
    }
  ]
};

export const mockBossQuestions: Partial<Record<ModulType, Omit<Soru, 'id' | 'modul'>[]>> = {
  hiv: [
    {
      format: 'boss',
      zorluk: 'zor',
      seviye: 3,
      soru: 'HIV tedavisi (ART) ve "Pencere Dönemi" hakkında karşındaki rakip sana şu argümanla saldırıyor: "Eğer temas yaşandıktan hemen 1 gün sonra test negatif çıkarsa kişi kesinlikle HIV-negatiftir. Ayrıca ART tedavisini sadece hastalık ilerleyip AIDS evresine gelindiğinde almak gerekir!" Nasıl karşılık verirsin?',
      senaryo_baglam: null,
      secenekler: {
        A: 'Doğru, ertesi gün yapılan test kesindir ve ilaçlar sadece ağır hastalara verilir.',
        B: 'Evet ertesi gün test yeterlidir ama tedavi hemen başlanmalı.',
        C: 'Yanlış. HIV teşhisi için pencere dönemi geçmeli (testin türüne göre değişir). Ayrıca tanı alınır alınmaz tedaviye başlanmalıdır.',
        D: 'Yanlış. Test anında sonuç verir ancak virüs sadece vitamin takviyesi ile iyileşir.',
        E: 'Hiçbir fikrim yok.'
      },
      dogru: 'C',
      aciklama: 'Temas sonrası antikor veya antijenin saptanabilmesi için bir \'Pencere Dönemi\' geçmelidir. Ayrıca, HIV tanısı alan herkesin CD4 sayısına bakılmaksızın tedaviye hemen başlaması (ART) önerilir.',
      kaynak_etiket: 'boss_hiv',
      xp: 50
    }
  ],
  cinsel_saglik: [
    {
      format: 'boss',
      zorluk: 'zor',
      seviye: 3,
      soru: 'Zararlı bir önyargı olan "HPV sadece kadınları etkiler ve onay bir kere verildiğinde geri alınamaz" mitine karşı ne savunursun?',
      senaryo_baglam: null,
      secenekler: {
        A: 'Sadece kadınları etkiler, doğru. Onay da bir kere alınca geçerlidir.',
        B: 'HPV erkekleri de etkiler ve her iki cinsiyet de aşılanmalıdır. Ayrıca cinsel eylemin her aşamasında sınır ve onay tekrar sorgulanabilir ve geri çekilebilir.',
        C: 'HPV aşıları gereksizdir. Onay tamamen evlenince verilmiş sayılır.',
        D: 'Testlerle belli olmadığı sürece sorun yoktur. Onay ise yazılı olmalıdır.',
        E: 'HPV kadınlarda olur ama onay her zaman geri alınabilir.'
      },
      dogru: 'B',
      aciklama: 'HPV herkesi etkileyebilir, rahim ağzı dışında çeşitli kanserlere ve siğillere neden olur. Onay dinamik bir kavramdır, sadece evet dendiğinde başlar ve istenildiği an iptal edilebilir.',
      kaynak_etiket: 'boss_cs',
      xp: 50
    }
  ],
  karma: [
    {
      format: 'boss',
      zorluk: 'zor',
      seviye: 3,
      soru: 'Toplumda çok yayılan üçlü efsane kombosunu bozman gerekiyor: "CYAE\'ler tuvalet oturağından bulaşır, kondom kullanmak zevki yarıya indirir, hapishane veya hastanede çalışmak HIV açısından garanti ölüm demektir." Bunlara karşı bir savunma paketi oluştur!',
      senaryo_baglam: null,
      secenekler: {
        A: 'Bunlar toplumun ürettiği kesin doğrulardır.',
        B: 'Tuvaletten bulaşığı doğrudur ama kondom meselesi yalandır.',
        C: 'Bu virüs ve bakteriler vücut dışında ölecek kadar zayıftır (tuvaletten bulaşmaz). Uygun kondom boyutu/tipiyle zevkte azalma asgaridir. Belirlenen prosedürlere uygun çalışılan ortamlarda HIV geçiş riski yönetilebilir.',
        D: 'Kondom kesinlikle hissi sıfırlar, tuvalet oturağından bulaşma ise çok olağan bir durumdur.',
        E: 'Hastane ve sağlık çalışanları için hiçbir risk yoktur ama tuvaletler çok tehlikelidir.'
      },
      dogru: 'C',
      aciklama: 'HIV ve çoğu CYAE patojenleri vücut dışarısında hızla etkisizleşir ve tuvaletten geçmez. Doğru ebatta ve yeterli kayganlaştırıcılı kondomlar his kaybını azaltır. Sağlık alanlarında standart koruma tedbirleriyle risk minimize edilir.',
      kaynak_etiket: 'boss_karma',
      xp: 50
    }
  ]
};

export function getRandomQuestion(modul: ModulType, isBoss: boolean = false, hedefEtiket?: string | null): Soru {
  const pool = isBoss ? mockBossQuestions[modul] : mockQuestions[modul];
  const list = pool && pool.length > 0 ? pool : mockQuestions['hiv']!;
  
  let validQuestions = list;
  if (hedefEtiket) {
     const matching = list.filter(q => q.kaynak_etiket === hedefEtiket);
     if (matching.length > 0) {
        validQuestions = matching;
     }
  }

  const q = validQuestions[Math.floor(Math.random() * validQuestions.length)];
  return {
    ...q,
    id: guidGenerator(),
    modul: modul,
  } as Soru;
}
