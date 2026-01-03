# Assets Directory

This directory contains all static assets (images, icons, etc.) for the Evidence webapp.

## Image Placeholders

Replace these placeholder descriptions with actual images:

### Hero/Background Images
- **archetype-hero.jpg** (1920x1080px)
  - Purpose: Background for intro screen
  - Style: Mystical, ethereal, glassmorphism-compatible
  - Recommended: Soft gradients, abstract patterns, or nature imagery

- **shadow-bg.jpg** (1920x1080px)
  - Purpose: Background for shadow side reveal
  - Style: Dark, mysterious, with depth
  - Recommended: Night sky, deep water, or dark abstract

### Archetype Images
Each archetype should have a visual representation:

- **ares.jpg** (400x400px)
  - Archetype: The Warrior
  - Style: Bold, energetic, red/orange tones
  
- **athena.jpg** (400x400px)
  - Archetype: The Strategist
  - Style: Wise, calculated, blue/silver tones
  
- **aphrodite.jpg** (400x400px)
  - Archetype: The Seductress
  - Style: Beautiful, sensual, pink/rose tones
  
- **apollo.jpg** (400x400px)
  - Archetype: The Illuminated
  - Style: Creative, bright, gold/yellow tones
  
- **hades.jpg** (400x400px)
  - Archetype: The Transformer
  - Style: Mysterious, deep, purple/dark tones
  
- **hermes.jpg** (400x400px)
  - Archetype: The Communicator
  - Style: Dynamic, versatile, multi-colored tones

## Icons

- **favicon.svg** (any size)
  - App icon/favicon
  - Recommended: Simple, recognizable symbol (e.g., sparkle, eye, or archetype symbol)

## Usage in Code

Images are referenced in `js/app.js` and can be added to archetype objects:

```javascript
// In locales/pt.json archetypes array:
{
  "title": "Ares",
  "description": "...",
  "imagePath": "./assets/ares.jpg",
  "traits": [...]
}
```

## Optimization Tips

1. **Format**: Use WebP for modern browsers, JPG as fallback
2. **Size**: Optimize images to <200KB each
3. **Responsive**: Provide @2x versions for high-DPI displays
4. **Lazy Loading**: Images load on demand (implemented in future versions)

## Adding New Assets

1. Place files in this directory
2. Update references in `js/app.js` or locale files
3. Commit to Git: `git add assets/` and `git commit -m "Add new assets"`

## License

Ensure all images have proper licensing for use in this project.
