# Taslim - Quran & Daily Duas Web Application

A production-ready, mobile-first web application for reading the Qur'an and Daily Islamic Duas with bookmarking capabilities.

## 🚀 Features

- **Qur'an Reading**: Browse 114 surahs with Arabic text, Indonesian, and English translations
- **Daily Duas**: Curated collection of Islamic duas categorized by occasion
- **Bookmarking**: Save favorite ayahs and duas (works in guest mode)
- **Last Read**: Auto-track and resume reading progress
- **Guest Mode**: Full functionality without login using localStorage
- **Account Merge**: One-click migration from guest to authenticated user
- **Responsive Design**: Mobile-first, optimized for all devices
- **Dark Mode**: Comfortable reading in any lighting condition
- **Multi-language**: Indonesian & English support

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: MySQL 8.0
- **ORM**: Prisma
- **Auth**: NextAuth v4 (Email, Google, GitHub)
- **Containerization**: Docker + Docker Compose
- **Testing**: Vitest + Playwright

## 📋 Prerequisites

- Node.js 20+
- Docker & Docker Compose
- MySQL 8.0 (or use Docker)

## 🏗 Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo>
cd taslim
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
```env
DATABASE_URL="mysql://root:password@localhost:3306/taslim"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
```

Optional OAuth providers:
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-secret"
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start all services (database + web app)
docker compose up -d

# Access the app at http://localhost:3000
# Database admin at http://localhost:8080 (Adminer)
```

#### Option B: Local Development

```bash
# Start MySQL locally on port 3306
# Update DATABASE_URL in .env

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:push

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

### 4. Verify Installation

- Open http://localhost:3000
- You should see Al-Fatihah (7 ayahs) and first 10 ayahs of Al-Baqarah
- Try bookmarking an ayah or dua
- Check "Resume" functionality

## 📂 Project Structure

```
taslim/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Sample data seeding
├── src/
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── quran/
│   │   │   │   ├── surah/route.ts
│   │   │   │   ├── surah/[id]/route.ts
│   │   │   │   └── ayah/[id]/route.ts
│   │   │   ├── dua/
│   │   │   │   ├── categories/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── bookmarks/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── last-read/route.ts
│   │   │   └── guest/merge/route.ts
│   │   ├── quran/
│   │   │   ├── page.tsx                # Surah list
│   │   │   └── [surahId]/page.tsx      # Ayah list
│   │   ├── duas/
│   │   │   ├── page.tsx                # Category grid
│   │   │   └── [slug]/page.tsx         # Dua list
│   │   ├── bookmarks/page.tsx          # User bookmarks
│   │   ├── resume/page.tsx             # Last read
│   │   ├── layout.tsx                  # Root layout
│   │   └── page.tsx                    # Homepage
│   ├── components/
│   │   ├── ui/                         # shadcn components
│   │   ├── AppShell.tsx
│   │   ├── SurahCard.tsx
│   │   ├── AyahItem.tsx
│   │   ├── DuaCard.tsx
│   │   ├── BookmarkButton.tsx
│   │   ├── LastReadBanner.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── auth.ts         # NextAuth config
│   │   ├── db.ts           # Prisma client
│   │   ├── guest.ts        # Guest mode utilities
│   │   └── utils.ts        # Helper functions
│   └── types/
│       └── index.ts        # TypeScript types
├── tests/
│   ├── unit/
│   └── e2e/
├── docker-compose.yml
├── Dockerfile
├── tailwind.config.ts
└── package.json
```

## 🔌 API Endpoints

### Quran

```typescript
GET /api/quran/surah
// Response: Array<{id, surahNumber, latinName, arabicName, ayahCount, ...}>

GET /api/quran/surah/[id]?page=1&limit=20&translations=id-kemenag,en-sahih
// Response: {surah: {...}, ayahs: [...], pagination: {...}}

GET /api/quran/ayah/[globalAyahId]?translations=id-kemenag,en-sahih
// Response: {ayah: {...}, translations: {...}}
```

### Duas

```typescript
GET /api/dua/categories
// Response: Array<{id, nameEn, nameId, slug, order, duaCount}>

GET /api/dua?category=morning-evening
// Response: Array<{id, titleEn, titleId, arabicText, meaningEn, meaningId, ...}>
```

### Bookmarks

```typescript
POST /api/bookmarks
// Body: {type: "AYAH" | "DUA", refId: number}
// Response: {success: true, data: {...}}

DELETE /api/bookmarks/[id]
// Response: {success: true}

GET /api/bookmarks?type=AYAH|DUA
// Response: Array<{id, type, refId, createdAt}>
```

### Last Read

```typescript
PUT /api/last-read
// Body: {type: "QURAN", surahId: 1, ayahNumber: 5} | {type: "DUA", duaId: 3}
// Response: {success: true, data: {...}}

GET /api/last-read?type=QURAN|DUA
// Response: {type, surahId?, ayahNumber?, duaId?, updatedAt}
```

### Guest Merge

```typescript
POST /api/guest/merge
// Body: {bookmarks: [...], lastReads: [...]}
// Response: {success: true, merged: {bookmarks: 5, lastReads: 2}}
```

## 🎨 Component Patterns

### SurahCard Component

```tsx
import { SurahListItem } from '@/types'

interface SurahCardProps {
  surah: SurahListItem
  onResume?: () => void
}

export function SurahCard({ surah, onResume }: SurahCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-arabic text-2xl" dir="rtl">
            {surah.arabicName}
          </h3>
          <p className="text-sm text-muted-foreground">{surah.latinName}</p>
        </div>
        <div className="text-right text-sm">
          <span>{surah.ayahCount} ayahs</span>
          <span className="block text-muted-foreground">
            {surah.revelationPlace}
          </span>
        </div>
      </div>
      {onResume && (
        <button onClick={onResume} className="mt-2 text-primary text-sm">
          Continue Reading →
        </button>
      )}
    </div>
  )
}
```

### AyahItem Component

```tsx
'use client'

import { AyahResponse } from '@/types'
import { BookmarkButton } from './BookmarkButton'
import { useState } from 'react'

interface AyahItemProps {
  ayah: AyahResponse
  showTranslations: { id: boolean; en: boolean }
}

export function AyahItem({ ayah, showTranslations }: AyahItemProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <div className="border-b py-4">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-muted-foreground">
          {ayah.numberInSurah}
        </span>
        <BookmarkButton
          type="AYAH"
          refId={ayah.id}
          isBookmarked={isBookmarked}
          onToggle={setIsBookmarked}
        />
      </div>

      <p className="font-arabic text-3xl leading-loose mb-4" dir="rtl" lang="ar">
        {ayah.arabicText}
      </p>

      {showTranslations.id && ayah.translations['id-kemenag'] && (
        <p className="text-base mb-2 text-gray-700 dark:text-gray-300">
          {ayah.translations['id-kemenag']}
        </p>
      )}

      {showTranslations.en && ayah.translations['en-sahih'] && (
        <p className="text-base text-gray-600 dark:text-gray-400">
          {ayah.translations['en-sahih']}
        </p>
      )}
    </div>
  )
}
```

### BookmarkButton Component

```tsx
'use client'

import { Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { addGuestBookmark, removeGuestBookmark } from '@/lib/guest'

interface BookmarkButtonProps {
  type: 'AYAH' | 'DUA'
  refId: number
  isBookmarked: boolean
  onToggle: (bookmarked: boolean) => void
}

export function BookmarkButton({ type, refId, isBookmarked, onToggle }: BookmarkButtonProps) {
  const { data: session } = useSession()

  const handleToggle = async () => {
    if (session?.user) {
      // Call API
      if (isBookmarked) {
        await fetch(`/api/bookmarks/${refId}`, { method: 'DELETE' })
      } else {
        await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, refId }),
        })
      }
    } else {
      // Guest mode
      if (isBookmarked) {
        removeGuestBookmark(type, refId)
      } else {
        addGuestBookmark({ type, refId })
      }
    }
    onToggle(!isBookmarked)
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Heart
        className={isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
        size={20}
      />
    </button>
  )
}
```

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Watch mode
npm test -- --watch
```

### Example Test (Vitest)

```typescript
// tests/unit/guest.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { addGuestBookmark, getGuestBookmarks, clearGuestBookmarks } from '@/lib/guest'

describe('Guest Bookmarks', () => {
  beforeEach(() => {
    clearGuestBookmarks()
  })

  it('should add and retrieve bookmarks', () => {
    addGuestBookmark({ type: 'AYAH', refId: 1 })
    const bookmarks = getGuestBookmarks()
    expect(bookmarks).toHaveLength(1)
    expect(bookmarks[0].refId).toBe(1)
  })
})
```

### Example E2E Test (Playwright)

```typescript
// tests/e2e/quran.spec.ts
import { test, expect } from '@playwright/test'

test('browse surah and bookmark ayah', async ({ page }) => {
  await page.goto('http://localhost:3000/quran')

  // Click on Al-Fatihah
  await page.click('text=Al-Fatihah')

  // Wait for ayahs to load
  await expect(page.locator('text=بِسۡمِ ٱللَّهِ')).toBeVisible()

  // Bookmark first ayah
  await page.click('[aria-label="Add bookmark"]').first()

  // Navigate to bookmarks
  await page.goto('http://localhost:3000/bookmarks')

  // Verify bookmark exists
  await expect(page.locator('text=Al-Fatihah')).toBeVisible()
})
```

## 🚢 Deployment

### Docker Production Build

```bash
# Build image
docker build -t taslim:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="mysql://..." \
  -e NEXTAUTH_SECRET="..." \
  taslim:latest
```

### Vercel/Netlify

1. Connect your Git repository
2. Set environment variables
3. Configure build command: `npm run build`
4. Set output directory: `.next`

## 📊 Database Schema

See `prisma/schema.prisma` for the complete schema.

**Key Tables:**
- `Surah` - 114 Quranic chapters
- `Ayah` - Individual verses
- `AyahTranslation` - Multi-language translations
- `DuaCategory` - Dua groupings
- `Dua` - Individual supplications
- `User` - User accounts (NextAuth)
- `Bookmark` - Saved ayahs/duas
- `LastRead` - Reading progress

## 🔐 Security

- CSRF protection via NextAuth
- Rate limiting on write endpoints (implement with `next-rate-limit` or similar)
- Zod validation on all API inputs
- Ownership checks on user data
- Secure session management with httpOnly cookies

## 📝 Adding Full Quran Data

The seed script includes Al-Fatihah (complete) and first 10 ayahs of Al-Baqarah. To add complete Quran data:

1. Download Quran JSON from:
   - https://github.com/risan/quran-json
   - https://github.com/fawazahmed0/quran-api

2. Create migration script:

```typescript
// scripts/import-quran.ts
import { prisma } from './src/lib/db'
import quranData from './data/quran.json'

async function importQuran() {
  for (const surah of quranData.surahs) {
    const createdSurah = await prisma.surah.create({
      data: {
        surahNumber: surah.number,
        latinName: surah.englishName,
        arabicName: surah.name,
        revelationPlace: surah.revelationType,
        ayahCount: surah.ayahs.length,
      },
    })

    for (const ayah of surah.ayahs) {
      await prisma.ayah.create({
        data: {
          surahId: createdSurah.id,
          numberInSurah: ayah.numberInSurah,
          arabicText: ayah.text,
          juz: ayah.juz,
          page: ayah.page,
          translations: {
            create: [
              {
                translationId: 'id-kemenag',
                text: ayah.translations.id,
              },
              {
                translationId: 'en-sahih',
                text: ayah.translations.en,
              },
            ],
          },
        },
      })
    }
  }
}
```

3. Run: `tsx scripts/import-quran.ts`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for your own Islamic apps!

## 🙏 Credits

- Quran data: Various open-source Quran APIs
- Duas: Compiled from authentic hadith sources
- UI Components: shadcn/ui
- Fonts: Amiri (Arabic), Inter (UI)

---

**Built with ❤️ for the Muslim Ummah**

For issues and questions: [GitHub Issues](https://github.com/your-repo/taslim/issues)
