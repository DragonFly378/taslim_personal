# Taslim Color Palette & Design System

## 🎨 Color Palette

### Primary Colors
```
#DDF4E7 - Light Mint (Backgrounds, subtle highlights)
#67C090 - Emerald Green (Primary actions, active states)
#26667F - Ocean Teal (Secondary elements, links)
#124170 - Deep Ocean (Text, headings, dark elements)
```

### Color Usage

#### Light Mode
- **Background**: `#DDF4E7` - Soft mint background for a calm reading experience
- **Cards**: `#FFFFFF` - White cards for content contrast
- **Primary**: `#67C090` - Emerald for buttons, links, highlights
- **Secondary**: `#26667F` - Ocean teal for supporting elements
- **Text**: `#124170` - Deep ocean for headings and primary text

#### Dark Mode
- **Background**: Deep navy (`hsl(200 60% 8%)`)
- **Cards**: Darker navy (`hsl(200 55% 12%)`)
- **Primary**: `#67C090` - Emerald (stays vibrant)
- **Text**: Light mint tones for readability

## 🌈 Extended Color Scales

### Primary (Emerald/Mint)
```
50:  #f0fdf7  - Lightest
100: #DDF4E7  - Your light mint
200: #b8ebd0
300: #8bdfb5
400: #67C090  - Your emerald green ⭐
500: #4db37d
600: #3a9968
700: #2d7a54
800: #236144
900: #1d5038
950: #0d2b1e  - Darkest
```

### Secondary (Ocean/Teal)
```
50:  #f0f9ff
100: #e0f2fe
200: #bae6fd
300: #7dd3fc
400: #38bdf8
500: #26667F  - Your ocean teal ⭐
600: #1e5266
700: #164252
800: #124170  - Your deep ocean ⭐
900: #0f3659
950: #0a2440
```

## 🎯 Design Tokens

### Spacing
- **Radius**: `0.75rem` (12px) - Rounded, friendly feel
- **Card Padding**: `1.5rem` (24px)
- **Section Spacing**: `2rem` - `4rem`

### Typography
- **Sans**: Inter, system-ui
- **Arabic**: Amiri, Traditional Arabic, Scheherazade
- **Arabic Line Height**: 2 (generous spacing for readability)

### Shadows
```css
card-glow: shadow-lg shadow-primary/5
hover: shadow-xl shadow-primary/10
button: shadow-lg shadow-primary/20
```

## 🎨 Gradients

### Primary Gradient
```css
from-primary to-secondary
/* Emerald to Ocean */
```

### Background Gradient
```css
from-primary/10 via-background to-secondary/10
/* Subtle wash */
```

### Card Header
```css
from-primary/5 to-secondary/5
/* Very subtle */
```

## 📐 Component Patterns

### Cards
- Border: `2px` solid with `border-primary/20`
- Shadow: `card-glow` utility
- Hover: Scale icon `110%`, border `border-primary/30`

### Buttons
- Primary: Gradient from emerald to teal
- Outline: `border-2` with hover effects
- Ghost: Transparent with `hover:bg-primary/10`

### Ayah Container
- Background: Gradient box `from-primary/5 to-secondary/5`
- Border: `border-primary/10`
- Arabic text: Larger, with generous line-height

### Navigation
- Active indicator: Colored dot (Makkah = amber, Madinah = emerald)
- Stats cards: Gradient backgrounds matching theme

## 🌙 Islamic Design Elements

### Pattern
```css
.islamic-pattern {
  /* Subtle geometric pattern */
  repeating-linear-gradient(45deg, ...)
}
```

### Arabic Typography
- Font size: `text-4xl` to `text-6xl`
- Direction: RTL
- Color: `text-secondary-800 dark:text-primary-100`

### Bismillah Card
- Large centered Arabic text
- Gradient background
- Subtle border with theme colors

## 💡 Usage Guidelines

### Do's ✅
- Use emerald (#67C090) for primary actions
- Use ocean teal (#26667F) for links and supporting UI
- Use gradients for visual interest
- Maintain generous spacing for Arabic text
- Use card-glow on interactive elements

### Don'ts ❌
- Don't use pure black text (use deep ocean #124170)
- Don't mix too many gradient directions
- Don't reduce Arabic text line-height below 1.8
- Don't use harsh shadows

## 🔄 Theme Toggle

Both light and dark modes use the same color palette:
- Light mode: Mint background, white cards
- Dark mode: Navy background, darker cards
- Both: Emerald and teal remain vibrant

## 📱 Accessibility

- **Contrast Ratios**: All text meets WCAG AA standards
- **Focus States**: 2px ring with primary color
- **Hover States**: Clear visual feedback
- **Touch Targets**: Minimum 44x44px

---

**Built with Islamic aesthetics in mind** 🕌
