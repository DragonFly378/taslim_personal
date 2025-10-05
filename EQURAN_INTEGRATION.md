# EQuran.id API Integration

This project now uses the **EQuran.id public API** (https://equran.id/apidev) to fetch Quran data instead of storing it in the database.

## Features

✅ **114 Complete Surahs** - All Quran chapters with Indonesian translations
✅ **Arabic Text & Transliteration** - Full Arabic text with Latin transliteration
✅ **Indonesian Translation** - Complete Kementerian Agama RI translation
✅ **Audio Support** - Multiple reciters available through the API
✅ **24-Hour Caching** - Built-in caching for optimal performance
✅ **No API Key Required** - Completely free and open access

## API Client

The integration is handled by `/src/lib/equran-api.ts` which provides:

### Available Functions

```typescript
// Get all surahs
const surahs = await getAllSurahs()

// Get specific surah with all ayahs
const surah = await getSurahByNumber(1) // Al-Fatihah

// Get specific ayah
const ayah = await getAyah(1, 5) // Al-Fatihah, ayah 5

// Search surahs
const results = await searchSurahs('fatihah')

// Filter by revelation place
const makkahSurahs = await getSurahsByRevelation('Mekah')
```

## Data Structure

### Surah Object
```typescript
{
  nomor: number            // Surah number (1-114)
  nama: string            // Arabic name
  namaLatin: string       // Latin name
  jumlahAyat: number      // Number of verses
  tempatTurun: 'Mekah' | 'Madinah'
  arti: string            // Meaning/translation of name
  deskripsi: string       // Description
  audioFull: {}           // Full surah audio URLs
}
```

### Ayah Object
```typescript
{
  nomorAyat: number        // Verse number
  teksArab: string         // Arabic text
  teksLatin: string        // Transliteration
  teksIndonesia: string    // Indonesian translation
  audio: {}                // Audio URLs for this ayah
}
```

## Database Usage

The database is now **only used for**:
- User accounts and authentication
- Bookmarks
- Last read positions
- Duas (supplications)

Quran data is fetched directly from EQuran.id API.

## Benefits

1. **Always Up-to-Date** - No need to maintain Quran data
2. **Reduced Database Size** - No Quran storage needed
3. **Better Performance** - CDN-cached responses
4. **Easy Maintenance** - No data migration required
5. **Multiple Audio Sources** - Access to various reciters

## API Endpoints Updated

- `GET /api/quran/surah` - List all surahs
- `GET /api/quran/surah/[id]` - Get surah with ayahs
- `GET /api/quran/ayah/[surahNumber]-[ayahNumber]` - Get specific ayah

## Caching Strategy

- In-memory cache with 24-hour TTL
- Next.js ISR (Incremental Static Regeneration)
- Revalidation every 24 hours for static pages

## Future Enhancements

- [ ] Add English translation support
- [ ] Implement audio player for ayahs and full surahs
- [ ] Add tafsir (interpretation) feature
- [ ] Search within ayahs
- [ ] Juz and page-based navigation
