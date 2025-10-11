# Offline Mode Documentation

## Overview

Taslim now supports **full offline access** to the Quran and Daily Duas! Users can download all content once and access it anytime, even without an internet connection.

## Features

- ✅ **Complete Quran** - All 114 surahs with Arabic text, transliteration, and Indonesian translation
- ✅ **Daily Duas** - All Islamic prayers and supplications with categories
- ✅ **Offline-First Architecture** - Content loads from local storage first, then updates from network
- ✅ **Progressive Download** - Download progress indicator with real-time updates
- ✅ **Storage Management** - View usage and manage downloaded content
- ✅ **Auto-Sync** - Automatically updates content when online
- ✅ **Zero Config** - Works automatically with the PWA service worker

## How It Works

### 1. Data Storage (IndexedDB)

Content is stored in the browser's IndexedDB database with the following structure:

```
TaslimDB
├── surahs           (List of all surahs)
├── surah_details    (Full surah content with verses)
├── duas             (All duas with translations)
├── dua_categories   (Dua categories)
└── metadata         (Download status and timestamps)
```

### 2. Offline-First Strategy

```
User Request → Check IndexedDB → Serve Cached Data → Update from Network in Background
               ↓ (if empty)
               Fetch from API → Save to IndexedDB → Serve to User
```

### 3. Download Process

**Quran Download:**
1. Fetches list of 114 surahs
2. Downloads each surah with all verses sequentially
3. Shows progress (1/114, 2/114, etc.)
4. Saves to IndexedDB immediately after each surah
5. Marks as complete when done

**Duas Download:**
1. Fetches all dua categories
2. Fetches all duas with translations
3. Saves to IndexedDB
4. Marks as complete

## Usage

### For Users

1. **Access Offline Manager**
   - Navigate to `/offline` in the app
   - Or use the menu/settings

2. **Download Content**
   - Click "Download Quran" to download all surahs (~5-10 MB)
   - Click "Download Duas" to download all duas (~1-2 MB)
   - Monitor progress in real-time

3. **Use Offline**
   - Once downloaded, content works without internet
   - Offline indicator badge shows when using cached data
   - Auto-updates when you go online

4. **Manage Storage**
   - View storage usage
   - Delete individual content (Quran or Duas)
   - Delete all offline content to free space

### For Developers

#### 1. Using Offline Hooks

**Quran:**
```tsx
import { useOfflineQuran, useOfflineSurahDetail } from '@/hooks/useOfflineQuran'

function QuranList() {
  const { surahs, loading, isOffline } = useOfflineQuran()

  return (
    <div>
      {isOffline && <OfflineIndicator isOffline={isOffline} />}
      {surahs.map(surah => <SurahCard key={surah.id} surah={surah} />)}
    </div>
  )
}

function SurahPage({ surahNumber }: { surahNumber: number }) {
  const { surahDetail, loading, isOffline } = useOfflineSurahDetail(surahNumber)

  return (
    <div>
      {isOffline && <Badge>Offline Mode</Badge>}
      {/* Render surah verses */}
    </div>
  )
}
```

**Duas:**
```tsx
import { useOfflineDuas, useOfflineDuaCategories } from '@/hooks/useOfflineDuas'

function DuasList() {
  const { duas, loading, isOffline } = useOfflineDuas()
  const { categories } = useOfflineDuaCategories()

  return (
    <div>
      {isOffline && <OfflineIndicator isOffline={isOffline} />}
      {duas.map(dua => <DuaCard key={dua.id} dua={dua} />)}
    </div>
  )
}
```

#### 2. Direct Storage Access

```tsx
import { getOfflineStorage } from '@/lib/offline-storage'

// Get storage instance
const storage = await getOfflineStorage()

// Check status
const status = await storage.getOfflineStatus()
console.log(status.quranDownloaded) // true/false
console.log(status.duasDownloaded)  // true/false

// Get data
const surahs = await storage.getSurahs()
const surah = await storage.getSurahDetail(1) // Al-Fatihah
const duas = await storage.getDuas()

// Save data
await storage.saveSurahs(surahsArray)
await storage.saveSurahDetail(surahDetail)
await storage.saveDuas(duasArray)
```

#### 3. Download Functions

```tsx
import {
  downloadQuranForOffline,
  downloadDuasForOffline,
  deleteOfflineContent,
  checkOfflineAvailability
} from '@/lib/offline-download'

// Download with progress tracking
await downloadQuranForOffline((progress) => {
  console.log(`${progress.percentage}% - ${progress.current}/${progress.total}`)
})

await downloadDuasForOffline((progress) => {
  console.log(`${progress.percentage}%`)
})

// Check availability
const { quranAvailable, duasAvailable } = await checkOfflineAvailability()

// Delete content
await deleteOfflineContent('quran') // or 'duas' or 'all'
```

#### 4. Storage Utilities

```tsx
import { getStorageEstimate, formatBytes } from '@/lib/offline-download'

// Get storage info
const { usage, quota, percentage } = await getStorageEstimate()
console.log(`Using ${formatBytes(usage)} of ${formatBytes(quota)}`)
console.log(`${percentage.toFixed(1)}% used`)
```

## File Structure

```
src/
├── lib/
│   ├── offline-storage.ts      # IndexedDB wrapper
│   └── offline-download.ts     # Download & management functions
├── hooks/
│   ├── useOfflineQuran.ts      # Offline-first Quran hooks
│   └── useOfflineDuas.ts       # Offline-first Duas hooks
├── components/
│   ├── OfflineManager.tsx      # Main UI component
│   ├── OfflineIndicator.tsx    # Offline badge indicator
│   └── ui/
│       └── progress.tsx        # Progress bar component
└── app/
    └── offline/
        └── page.tsx            # Offline management page
```

## Technical Details

### Browser Support

- ✅ Chrome/Edge (Full support)
- ✅ Firefox (Full support)
- ✅ Safari/iOS (Full support)
- ✅ All modern browsers with IndexedDB

### Storage Requirements

- **Complete Quran**: ~5-10 MB
- **All Duas**: ~1-2 MB
- **Total**: ~6-12 MB

### Performance

- **Initial Load**: Instant from cache after download
- **Network Fallback**: Only when content not cached
- **Update Strategy**: Background updates when online
- **Download Time**:
  - Quran: ~1-3 minutes (depends on connection)
  - Duas: ~10-30 seconds

### Data Freshness

- Downloads are timestamped
- Cache never expires (user-controlled)
- Background updates recommended (future feature)

## Migration Guide

### Updating Existing Pages to Use Offline Hooks

**Before:**
```tsx
const [surahs, setSurahs] = useState([])

useEffect(() => {
  fetch('/api/quran/surah')
    .then(res => res.json())
    .then(data => setSurahs(data.data))
}, [])
```

**After:**
```tsx
import { useOfflineQuran } from '@/hooks/useOfflineQuran'

const { surahs, loading, isOffline } = useOfflineQuran()
```

## Future Enhancements

- [ ] Background sync when content updates
- [ ] Selective surah download
- [ ] Audio file caching for offline playback
- [ ] Export/Import offline database
- [ ] Offline search functionality
- [ ] Compression for smaller storage footprint

## Troubleshooting

### Content Not Loading Offline

1. Check if content was downloaded (visit `/offline`)
2. Clear browser cache and re-download
3. Check browser DevTools → Application → IndexedDB

### Download Fails

1. Ensure stable internet connection
2. Check browser storage quota
3. Try deleting and re-downloading
4. Check console for errors

### Storage Full

1. Visit `/offline` page
2. View storage usage
3. Delete unused content
4. Clear browser data if needed

## API Reference

See inline documentation in:
- `src/lib/offline-storage.ts`
- `src/lib/offline-download.ts`
- `src/hooks/useOfflineQuran.ts`
- `src/hooks/useOfflineDuas.ts`

## Contributing

When adding new content types:

1. Add store to `offline-storage.ts`
2. Create download function in `offline-download.ts`
3. Create offline-first hook in `hooks/`
4. Add UI in `OfflineManager.tsx`
5. Update this documentation

## License

Same as main project
