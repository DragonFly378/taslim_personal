# Troubleshooting Guide

## CSS Not Appearing

If the CSS styles are not showing up, follow these steps:

### 1. Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### 2. Reinstall Dependencies (if SWC error appears)
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 3. Verify Tailwind is Working

Check if these files exist and are correct:
- `tailwind.config.ts` ✓
- `src/app/globals.css` ✓
- `src/app/layout.tsx` (imports globals.css)

### 4. Hard Refresh Browser
- **Chrome/Edge**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- **Firefox**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- **Safari**: Cmd+Option+R (Mac)

### 5. Check Browser Console
Open Developer Tools (F12) and check for:
- CSS loading errors
- Network tab shows `globals.css` loaded
- Any JavaScript errors

### 6. Verify Port
The dev server is running on: **http://localhost:3001**
(Port 3000 was in use, so it switched to 3001)

## Common Issues

### Issue: Colors not showing
**Solution**: The color palette uses CSS custom properties (HSL values). Make sure:
1. `globals.css` is imported in `layout.tsx`
2. Browser supports CSS custom properties (all modern browsers do)
3. Hard refresh the browser

### Issue: Gradient text not visible
**Solution**: The `.gradient-text` utility uses `bg-clip-text`. Check:
1. Browser support (works in all modern browsers)
2. Text has content (can't be empty)
3. Fallback text color is visible

### Issue: Arabic font not loading
**Solution**:
1. The Arabic font uses local system fonts
2. Fallback chain: Traditional Arabic → Amiri → Scheherazade
3. All modern browsers support these fonts

## Quick Test

Visit these URLs to test:
1. **Homepage**: http://localhost:3001/
   - Should see gradient "Welcome to Taslim" title
   - Feature cards with colored top bars
   - Mint/green color theme

2. **Quran List**: http://localhost:3001/quran
   - Stats cards with gradients
   - Surah cards with number badges
   - Color indicators for Makkah/Madinah

3. **Surah Detail**: http://localhost:3001/quran/1
   - Gradient header
   - Large Arabic text in colored box
   - Transliteration and translation sections

## Still Not Working?

1. Check this file exists: `src/app/globals.css`
2. Check layout.tsx imports it:
   ```typescript
   import './globals.css'
   ```

3. Run build to check for errors:
   ```bash
   npm run build
   ```

4. If all else fails, restart everything:
   ```bash
   # Kill all Node processes
   pkill -f node

   # Clean everything
   rm -rf .next node_modules package-lock.json

   # Reinstall
   npm install

   # Start fresh
   npm run dev
   ```

## Checking Styles in Browser

1. Open DevTools (F12)
2. Inspect any element
3. Look for:
   - `--primary` CSS variable (should be green hsl value)
   - `--background` CSS variable (should be mint hsl value)
   - Tailwind utility classes applied

If CSS variables are missing, the `globals.css` file isn't loading properly.
