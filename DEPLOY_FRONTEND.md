# Frontend-Only Deployment Guide

This guide explains how to deploy Taslim as a frontend-only app (without authentication and bookmarks).

## What's Hidden

For tonight's frontend-only deployment, the following features have been hidden:

### 1. **Authentication UI**
- Sign In button (desktop & mobile)
- Sign Out button
- User profile dropdown
- Guest mode indicator

### 2. **Bookmark Functionality**
- Bookmark buttons on Ayahs
- Bookmark buttons on Duas
- Bookmarks navigation link

## Files Modified

The following files contain commented-out code that can be re-enabled later:

- `src/components/AppShell.tsx` - Auth buttons and bookmarks nav
- `src/components/AyahItem.tsx` - Bookmark button on Ayahs
- `src/components/DuaCard.tsx` - Bookmark button on Duas

## Deployment Options

### Option 1: Vercel (Recommended for Frontend-Only)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Build the app:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set environment variables** (if needed):
   - No auth variables needed for frontend-only
   - Just set `NEXT_PUBLIC_APP_URL` to your production URL

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

### Option 3: Static Export (for any host)

1. **Update `next.config.js`:**
   ```js
   const nextConfig = {
     output: 'export', // Change from 'standalone' to 'export'
     // ... rest of config
   }
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy the `out` folder** to any static host:
   - GitHub Pages
   - Cloudflare Pages
   - AWS S3 + CloudFront
   - Any CDN

## Environment Variables

For frontend-only deployment, you only need:

```env
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

No database, auth, or OAuth variables are required since those features are hidden.

## Re-enabling Auth & Bookmarks Later

When you're ready to add backend features:

1. **Uncomment code in these files:**
   - `src/components/AppShell.tsx`
   - `src/components/AyahItem.tsx`
   - `src/components/DuaCard.tsx`

2. **Set up environment variables:**
   ```env
   DATABASE_URL="your-database-url"
   NEXTAUTH_URL="your-app-url"
   NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
   ```

3. **Deploy with database:**
   - Use Docker Compose (already configured)
   - Or deploy database separately (PlanetScale, Railway, etc.)

## Current App Features (Frontend-Only)

✅ **Available:**
- Browse 114 Surahs
- Read Quranic verses with translations
- Browse Daily Duas by category
- View Arabic text, transliteration, and meanings
- Multi-language support (English/Indonesian)
- Fully responsive mobile-first design
- Dark mode support

❌ **Hidden (for tonight):**
- User authentication
- Bookmarking Ayahs/Duas
- Reading progress tracking
- Account sync across devices

## Testing Locally

```bash
# Development mode
npm run dev

# Production build test
npm run build
npm start
```

Access at: http://localhost:3000

## Quick Deploy Commands

```bash
# Option 1: Vercel
vercel

# Option 2: Netlify
netlify deploy --prod

# Option 3: Build for static hosting
npm run build
# Upload 'out' folder to your host
```

---

**Ready for frontend-only deployment! 🚀**

For full-stack deployment with auth & bookmarks, see `README.md` for Docker setup.
