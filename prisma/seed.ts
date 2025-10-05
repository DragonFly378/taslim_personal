import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed Translations
  const translations = await Promise.all([
    prisma.translation.upsert({
      where: { id: 'id-kemenag' },
      update: {},
      create: {
        id: 'id-kemenag',
        language: 'id',
        sourceName: 'Kementerian Agama RI',
        sourceUrl: 'https://quran.kemenag.go.id',
        copyright: 'Public Domain',
      },
    }),
    prisma.translation.upsert({
      where: { id: 'en-sahih' },
      update: {},
      create: {
        id: 'en-sahih',
        language: 'en',
        sourceName: 'Sahih International',
        sourceUrl: 'https://quran.com',
        copyright: 'CC BY-ND 4.0',
      },
    }),
  ])

  console.log('✅ Translations seeded')

  // Seed Surah Al-Fatihah (Complete)
  const alFatihah = await prisma.surah.upsert({
    where: { surahNumber: 1 },
    update: {},
    create: {
      surahNumber: 1,
      latinName: 'Al-Fatihah',
      arabicName: 'الفاتحة',
      translationId: 'Pembuka',
      translationEn: 'The Opener',
      revelationPlace: 'Makkah',
      ayahCount: 7,
    },
  })

  const fatihahAyahs = [
    { number: 1, arabic: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ', id: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.', en: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
    { number: 2, arabic: 'ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَـٰلَمِینَ', id: 'Segala puji bagi Allah, Tuhan seluruh alam,', en: 'All praise is due to Allah, Lord of the worlds -' },
    { number: 3, arabic: 'ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ', id: 'Yang Maha Pengasih, Maha Penyayang,', en: 'The Entirely Merciful, the Especially Merciful,' },
    { number: 4, arabic: 'مَـٰلِكِ یَوۡمِ ٱلدِّینِ', id: 'Pemilik hari pembalasan.', en: 'Sovereign of the Day of Recompense.' },
    { number: 5, arabic: 'إِیَّاكَ نَعۡبُدُ وَإِیَّاكَ نَسۡتَعِینُ', id: 'Hanya kepada Engkau kami menyembah dan hanya kepada Engkau kami mohon pertolongan.', en: 'It is You we worship and You we ask for help.' },
    { number: 6, arabic: 'ٱهۡدِنَا ٱلصِّرَ ٰ⁠طَ ٱلۡمُسۡتَقِیمَ', id: 'Tunjukilah kami jalan yang lurus,', en: 'Guide us to the straight path -' },
    { number: 7, arabic: 'صِرَ ٰ⁠طَ ٱلَّذِینَ أَنۡعَمۡتَ عَلَیۡهِمۡ غَیۡرِ ٱلۡمَغۡضُوبِ عَلَیۡهِمۡ وَلَا ٱلضَّاۤلِّینَ', id: '(yaitu) jalan orang-orang yang telah Engkau beri nikmat; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.', en: 'The path of those upon whom You have bestowed favor, not of those who have earned Your anger or of those who are astray.' },
  ]

  for (const ayah of fatihahAyahs) {
    const createdAyah = await prisma.ayah.upsert({
      where: { surahId_numberInSurah: { surahId: alFatihah.id, numberInSurah: ayah.number } },
      update: {},
      create: {
        surahId: alFatihah.id,
        numberInSurah: ayah.number,
        arabicText: ayah.arabic,
        juz: 1,
        page: 1,
      },
    })

    await prisma.ayahTranslation.upsert({
      where: { ayahId_translationId: { ayahId: createdAyah.id, translationId: 'id-kemenag' } },
      update: {},
      create: {
        ayahId: createdAyah.id,
        translationId: 'id-kemenag',
        text: ayah.id,
      },
    })

    await prisma.ayahTranslation.upsert({
      where: { ayahId_translationId: { ayahId: createdAyah.id, translationId: 'en-sahih' } },
      update: {},
      create: {
        ayahId: createdAyah.id,
        translationId: 'en-sahih',
        text: ayah.en,
      },
    })
  }

  console.log('✅ Al-Fatihah seeded (7 ayahs)')

  // Seed first 10 ayahs of Al-Baqarah
  const alBaqarah = await prisma.surah.upsert({
    where: { surahNumber: 2 },
    update: {},
    create: {
      surahNumber: 2,
      latinName: 'Al-Baqarah',
      arabicName: 'البقرة',
      translationId: 'Sapi Betina',
      translationEn: 'The Cow',
      revelationPlace: 'Madinah',
      ayahCount: 286,
    },
  })

  const baqarahAyahs = [
    { number: 1, arabic: 'الۤمّۤ', id: 'Alif Lam Mim.', en: 'Alif, Lam, Meem.' },
    { number: 2, arabic: 'ذَ ٰ⁠لِكَ ٱلۡكِتَـٰبُ لَا رَیۡبَ ۛ فِیهِ ۛ هُدࣰى لِّلۡمُتَّقِینَ', id: 'Kitab (Al-Qur\'an) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertakwa,', en: 'This is the Book about which there is no doubt, a guidance for those conscious of Allah -' },
    { number: 3, arabic: 'ٱلَّذِینَ یُؤۡمِنُونَ بِٱلۡغَیۡبِ وَیُقِیمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقۡنَـٰهُمۡ یُنفِقُونَ', id: '(yaitu) mereka yang beriman kepada yang gaib, melaksanakan salat, dan menginfakkan sebagian rezeki yang Kami berikan kepada mereka,', en: 'Who believe in the unseen, establish prayer, and spend out of what We have provided for them,' },
    { number: 4, arabic: 'وَٱلَّذِینَ یُؤۡمِنُونَ بِمَاۤ أُنزِلَ إِلَیۡكَ وَمَاۤ أُنزِلَ مِن قَبۡلِكَ وَبِٱلۡـَٔاخِرَةِ هُمۡ یُوقِنُونَ', id: 'dan mereka yang beriman kepada (Al-Qur\'an) yang diturunkan kepadamu (Muhammad) dan (kitab-kitab) yang telah diturunkan sebelum engkau, dan mereka yakin akan adanya akhirat.', en: 'And who believe in what has been revealed to you, and what was revealed before you, and of the Hereafter they are certain.' },
    { number: 5, arabic: 'أُو۟لَـٰۤىِٕكَ عَلَىٰ هُدࣰى مِّن رَّبِّهِمۡ ۖ وَأُو۟لَـٰۤىِٕكَ هُمُ ٱلۡمُفۡلِحُونَ', id: 'Merekalah yang mendapat petunjuk dari Tuhannya, dan mereka itulah orang-orang yang beruntung.', en: 'Those are upon guidance from their Lord, and it is those who are the successful.' },
    { number: 6, arabic: 'إِنَّ ٱلَّذِینَ كَفَرُوا۟ سَوَاۤءٌ عَلَیۡهِمۡ ءَأَنذَرۡتَهُمۡ أَمۡ لَمۡ تُنذِرۡهُمۡ لَا یُؤۡمِنُونَ', id: 'Sesungguhnya orang-orang kafir, sama saja bagi mereka, apakah engkau (Muhammad) memberi peringatan atau tidak memberi peringatan kepada mereka, mereka tidak akan beriman.', en: 'Indeed, those who disbelieve - it is all the same for them whether you warn them or do not warn them - they will not believe.' },
    { number: 7, arabic: 'خَتَمَ ٱللَّهُ عَلَىٰ قُلُوبِهِمۡ وَعَلَىٰ سَمۡعِهِمۡ ۖ وَعَلَىٰۤ أَبۡصَـٰرِهِمۡ غِشَـٰوَةࣱ ۖ وَلَهُمۡ عَذَابٌ عَظِیمࣱ', id: 'Allah telah mengunci hati dan pendengaran mereka, dan penglihatan mereka ditutup. Mereka mendapat azab yang sangat berat.', en: 'Allah has set a seal upon their hearts and upon their hearing, and over their vision is a veil. And for them is a great punishment.' },
    { number: 8, arabic: 'وَمِنَ ٱلنَّاسِ مَن یَقُولُ ءَامَنَّا بِٱللَّهِ وَبِٱلۡیَوۡمِ ٱلۡـَٔاخِرِ وَمَا هُم بِمُؤۡمِنِینَ', id: 'Di antara manusia ada yang berkata, "Kami beriman kepada Allah dan hari akhir," padahal sesungguhnya mereka bukan orang-orang yang beriman.', en: 'And of the people are some who say, "We believe in Allah and the Last Day," but they are not believers.' },
    { number: 9, arabic: 'یُخَـٰدِعُونَ ٱللَّهَ وَٱلَّذِینَ ءَامَنُوا۟ وَمَا یَخۡدَعُونَ إِلَّاۤ أَنفُسَهُمۡ وَمَا یَشۡعُرُونَ', id: 'Mereka hendak menipu Allah dan orang-orang yang beriman, padahal mereka hanya menipu diri sendiri tanpa mereka sadari.', en: 'They [think to] deceive Allah and those who believe, but they deceive not except themselves and perceive [it] not.' },
    { number: 10, arabic: 'فِی قُلُوبِهِم مَّرَضࣱ فَزَادَهُمُ ٱللَّهُ مَرَضࣰا ۖ وَلَهُمۡ عَذَابٌ أَلِیمُۢ بِمَا كَانُوا۟ یَكۡذِبُونَ', id: 'Dalam hati mereka ada penyakit, lalu Allah menambah penyakitnya itu; dan mereka mendapat azab yang sangat pedih, disebabkan mereka berdusta.', en: 'In their hearts is disease, so Allah has increased their disease; and for them is a painful punishment because they [habitually] used to lie.' },
  ]

  for (const ayah of baqarahAyahs) {
    const createdAyah = await prisma.ayah.upsert({
      where: { surahId_numberInSurah: { surahId: alBaqarah.id, numberInSurah: ayah.number } },
      update: {},
      create: {
        surahId: alBaqarah.id,
        numberInSurah: ayah.number,
        arabicText: ayah.arabic,
        juz: 1,
        page: ayah.number === 1 ? 2 : 2,
      },
    })

    await prisma.ayahTranslation.upsert({
      where: { ayahId_translationId: { ayahId: createdAyah.id, translationId: 'id-kemenag' } },
      update: {},
      create: {
        ayahId: createdAyah.id,
        translationId: 'id-kemenag',
        text: ayah.id,
      },
    })

    await prisma.ayahTranslation.upsert({
      where: { ayahId_translationId: { ayahId: createdAyah.id, translationId: 'en-sahih' } },
      update: {},
      create: {
        ayahId: createdAyah.id,
        translationId: 'en-sahih',
        text: ayah.en,
      },
    })
  }

  console.log('✅ Al-Baqarah seeded (first 10 ayahs)')

  // Seed Dua Categories
  const morningCategory = await prisma.duaCategory.upsert({
    where: { slug: 'morning-evening' },
    update: {},
    create: {
      nameEn: 'Morning & Evening Duas',
      nameId: 'Doa Pagi & Petang',
      slug: 'morning-evening',
      order: 1,
    },
  })

  const mealCategory = await prisma.duaCategory.upsert({
    where: { slug: 'meals' },
    update: {},
    create: {
      nameEn: 'Meal Duas',
      nameId: 'Doa Makan',
      slug: 'meals',
      order: 2,
    },
  })

  const travelCategory = await prisma.duaCategory.upsert({
    where: { slug: 'travel' },
    update: {},
    create: {
      nameEn: 'Travel Duas',
      nameId: 'Doa Perjalanan',
      slug: 'travel',
      order: 3,
    },
  })

  console.log('✅ Dua categories seeded')

  // Seed Duas
  await prisma.dua.upsert({
    where: { id: 1 },
    update: {},
    create: {
      categoryId: morningCategory.id,
      titleEn: 'Morning Remembrance - Ayatul Kursi',
      titleId: 'Dzikir Pagi - Ayatul Kursi',
      arabicText: 'اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
      transliteration: 'Allahu laa ilaaha illaa huwal hayyul qayyuum, laa ta\'khuzuhu sinatuw walaa nawm, lahu maa fis samaawaati wa maa fil ard, man zal lazii yashfa\'u \'indahu illaa bi iznih, ya\'lamu maa bayna aydiihim wa maa khalfahum, wa laa yuhiituna bi shay\'im min \'ilmihi illaa bimaa shaa\'a, wasi\'a kursiyyuhus samaawaati wal ard, wa laa ya\'ooduhu hifzuhumaa, wa huwal \'aliyyul \'azeem',
      meaningEn: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
      meaningId: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi. Tidak ada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang di hadapan mereka dan apa yang di belakang mereka, dan mereka tidak mengetahui sesuatu apa pun tentang ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dia Mahatinggi, Mahabesar.',
      reference: 'Al-Baqarah 2:255',
      order: 1,
    },
  })

  await prisma.dua.upsert({
    where: { id: 2 },
    update: {},
    create: {
      categoryId: mealCategory.id,
      titleEn: 'Dua Before Eating',
      titleId: 'Doa Sebelum Makan',
      arabicText: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
      transliteration: 'Bismillahi wa \'alaa barakatillah',
      meaningEn: 'In the name of Allah and with the blessings of Allah',
      meaningId: 'Dengan menyebut nama Allah dan atas berkah Allah',
      reference: 'Hadith',
      order: 1,
    },
  })

  await prisma.dua.upsert({
    where: { id: 3 },
    update: {},
    create: {
      categoryId: mealCategory.id,
      titleEn: 'Dua After Eating',
      titleId: 'Doa Sesudah Makan',
      arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
      transliteration: 'Alhamdulillahil-ladzii ath\'amanaa wa saqoonaa wa ja\'alanaa musli-miin',
      meaningEn: 'All praise is due to Allah who has given us food and drink and made us Muslims',
      meaningId: 'Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami muslim',
      reference: 'Abu Dawud 3850',
      order: 2,
    },
  })

  await prisma.dua.upsert({
    where: { id: 4 },
    update: {},
    create: {
      categoryId: travelCategory.id,
      titleEn: 'Dua for Traveling',
      titleId: 'Doa Safar (Perjalanan)',
      arabicText: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
      transliteration: 'Subhaanalladhii sakhkhara lanaa haadzaa wa maa kunnaa lahu muqriniin. Wa innaa ilaa rabbinaa lamunqalibuun',
      meaningEn: 'Glory be to Him who has subjected this to us, and we could never have it by our efforts. Surely, to our Lord we are to return.',
      meaningId: 'Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.',
      reference: 'Az-Zukhruf 43:13-14',
      order: 1,
    },
  })

  console.log('✅ Duas seeded (4 duas across 3 categories)')
  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
