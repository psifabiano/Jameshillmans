# Evidence - Vanilla JavaScript Edition

A pure vanilla JavaScript implementation of the Evidence psychological archetype discovery webapp. No frameworks, no build tools, no dependencies—just clean, editable code.

## Project Overview

Evidence is an interactive psychological assessment tool based on James Hillman's archetypal psychology. Users answer 10 scenario-based questions and receive a personalized archetype result (Ares, Athena, Aphrodite, Apollo, Hades, or Hermes) with shadow side insights.

**Key Features:**
- 🎯 10 scenario-based psychological questions
- 🎭 6 Jungian archetypes with shadow sides
- 🌍 Bilingual support (Portuguese & English)
- 💾 localStorage persistence (user data & history)
- 🎨 Glassmorphism design with responsive layout
- 📱 Mobile-first, works offline
- 🔧 Fully editable—no build process required

## Project Structure

```
evidence-vanilla/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styles with CSS variables
├── js/
│   ├── app.js             # Main application logic
│   ├── i18n.js            # Language switching & text retrieval
│   └── storage.js         # Data persistence abstraction
├── locales/
│   ├── pt.json            # Portuguese text & scenarios
│   └── en.json            # English text & scenarios
├── assets/
│   └── README.md          # Asset documentation
├── README.md              # This file
└── .gitignore             # Git ignore rules
```

## Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- A text editor (VS Code, Sublime Text, Notepad++)
- Optional: Git for version control

### Running Locally

1. **Clone or download the repository:**
   ```bash
   git clone https://github.com/psifabiano/Jameshillmans.git
   cd evidence-vanilla
   ```

2. **Open in browser:**
   - Double-click `index.html`, or
   - Use a local server (recommended for development):
     ```bash
     # Python 3
     python3 -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js (if installed)
     npx http-server
     ```
   - Visit `http://localhost:8000`

3. **Test language toggle:**
   - Click the language button (top-right) to switch between PT/EN
   - Preference persists in browser localStorage

## Editing Guide

### 1. Editing Text & Scenarios

All user-facing text is in `/locales/` JSON files. **Edit these files to change any text without touching code.**

#### Portuguese (`locales/pt.json`)

```json
{
  "app": {
    "title": "Evidence",
    "subtitle": "Descubra a arquitetura oculta da sua psique."
  },
  "buttons": {
    "startJourney": "Iniciar Jornada"
  },
  "scenarios": [
    {
      "question": "Você encontra uma porta trancada...",
      "left": "Arromba a porta imediatamente.",
      "right": "Procura pela chave escondida."
    }
  ],
  "archetypes": [
    {
      "title": "Ares",
      "description": "O Guerreiro...",
      "shadow": "Sua agressividade pode se tornar destrutiva...",
      "traits": ["Coragem", "Ação", "Determinação"]
    }
  ]
}
```

**To edit:**
1. Open `locales/pt.json` in your text editor
2. Find the text you want to change
3. Edit the value (keep the JSON structure intact)
4. Save the file
5. Refresh your browser to see changes

#### English (`locales/en.json`)

Same structure as Portuguese. Edit for English translations.

### 2. Editing Scenarios

Each scenario has a question and two choices:

```json
{
  "question": "The question presented to the user",
  "left": "Choice if swiping/clicking left",
  "right": "Choice if swiping/clicking right"
}
```

**To add a new scenario:**
1. Open `locales/pt.json`
2. Find the `"scenarios"` array
3. Add a new object before the closing bracket:
   ```json
   {
     "question": "Your new question?",
     "left": "Left choice",
     "right": "Right choice"
   }
   ```
4. Repeat in `locales/en.json`
5. Save and refresh

**Important:** The scoring system in `js/app.js` needs to be updated if you change the number of scenarios. Currently optimized for 10 questions.

### 3. Editing Archetypes

Each archetype has a title, description, shadow side, and traits:

```json
{
  "title": "Archetype Name",
  "description": "Main description shown to user",
  "shadow": "Shadow side description",
  "traits": ["Trait 1", "Trait 2", "Trait 3", "Trait 4"]
}
```

**To edit an archetype:**
1. Open `locales/pt.json`
2. Find the `"archetypes"` array
3. Edit the archetype object
4. Repeat in `locales/en.json`
5. Save and refresh

**To add a new archetype:**
1. Add a new object to the `"archetypes"` array in both locale files
2. Update the scoring logic in `js/app.js` (see "Editing Scoring Logic" below)

### 4. Editing Styles

All styles are in `css/styles.css` with CSS variables at the top for easy customization.

#### Change Colors

```css
:root {
  /* Light theme colors */
  --color-bg-primary: #F0E5FD;      /* Background */
  --color-text-primary: #1a1a2e;    /* Text */
  --color-accent: #A7C7E7;          /* Accent color */
  --color-brisa-neon: #D4E7FF;      /* Gradient 1 */
  --color-por-do-sol: #F0E5FD;      /* Gradient 2 */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #0f0f1a;    /* Dark background */
    --color-text-primary: #e0e0e0;  /* Light text */
  }
}
```

**To customize:**
1. Open `css/styles.css`
2. Find the `:root` section
3. Change hex color values
4. Save and refresh

#### Change Fonts

```css
:root {
  --font-sans: 'Inter', sans-serif;           /* Body text */
  --font-serif: 'Playfair Display', serif;    /* Headings */
}
```

Fonts are loaded from Google Fonts in `index.html`. To use different fonts:
1. Visit [Google Fonts](https://fonts.google.com)
2. Select fonts and copy the import link
3. Update the `<link>` tag in `index.html`
4. Update font names in `css/styles.css`

#### Change Spacing & Sizing

```css
:root {
  --spacing-md: 1rem;        /* Padding/margin */
  --font-size-lg: 1.125rem;  /* Font size */
  --radius-lg: 1.5rem;       /* Border radius */
}
```

### 5. Editing JavaScript Logic

Core logic is in `js/app.js`. Main functions:

| Function | Purpose |
|----------|---------|
| `startGame()` | Initialize game flow |
| `handleChoice(direction)` | Process user choice & update scores |
| `calculateArchetype()` | Map scores to archetype |
| `finishGame()` | Show result & save to history |
| `render()` | Update UI based on state |

**To modify scoring:**

Find the `calculateArchetype()` function in `js/app.js`:

```javascript
calculateArchetype() {
  const scores = this.state.scores;
  const chaosVsOrder = scores.chaos - scores.order;
  const emotionVsLogic = scores.emotion - scores.logic;

  // Adjust logic here to change archetype mapping
  if (chaosVsOrder > 0 && emotionVsLogic > 0) {
    archetypeIndex = 0; // Ares
  }
  // ... more conditions
}
```

**To modify impact values:**

In `locales/pt.json`, each scenario choice has an `impact` object (not visible in UI, but used in scoring):

```json
{
  "question": "...",
  "left": "...",
  "leftImpact": { "chaos": 2, "emotion": 1 },  // Not in JSON—edit in app.js
  "right": "..."
}
```

Currently, impact is hardcoded in `js/app.js` in the `handleChoice()` function. To change scoring:
1. Open `js/app.js`
2. Find `handleChoice()` method
3. Modify the score updates based on scenario index

### 6. Adding Images

Place images in `/assets/` directory and reference them in locale files:

```json
{
  "title": "Ares",
  "imagePath": "./assets/ares.jpg",
  "description": "..."
}
```

Then in `js/app.js`, update the `renderResult()` function to display the image:

```javascript
<img src="${result.imagePath}" alt="${result.title}" class="archetype-image">
```

See `/assets/README.md` for image specifications and optimization tips.

### 7. Data & Storage

User data is stored in browser localStorage with prefix `evidence_`:

- `evidence_user` - Registration data (name, email, location)
- `evidence_history` - Array of past archetype results
- `language` - Current language preference (pt or en)

**To export user data programmatically:**

```javascript
const data = storage.exportData();
console.log(data); // { version, exportedAt, user, history }
```

**To clear all data:**

```javascript
storage.clearAllData();
```

## Customization Examples

### Example 1: Change Primary Button Color

In `css/styles.css`:

```css
.btn-primary {
  background-color: #2c2c44;  /* Change this hex value */
}
```

### Example 2: Add a New Scenario

In `locales/pt.json`:

```json
{
  "question": "Você vê um espelho mágico. O que você faz?",
  "left": "Olha para seu reflexo verdadeiro.",
  "right": "Fecha os olhos e segue em frente."
}
```

Then in `locales/en.json`:

```json
{
  "question": "You see a magical mirror. What do you do?",
  "left": "Look at your true reflection.",
  "right": "Close your eyes and move on."
}
```

### Example 3: Change Archetype Names

In both `locales/pt.json` and `locales/en.json`, update the `archetypes` array:

```json
{
  "title": "Your Custom Archetype Name",
  "description": "...",
  "shadow": "...",
  "traits": [...]
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Text not updating | Clear browser cache (Ctrl+Shift+Del) and refresh |
| Language toggle not working | Check browser console for JSON parsing errors |
| Styles not applying | Ensure `css/styles.css` is in the correct path |
| localStorage not persisting | Check if browser allows localStorage (not in private mode) |
| Images not loading | Verify image paths are correct and files exist in `/assets/` |

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 13+)
- IE 11: ❌ Not supported (uses ES6 features)

## Performance Tips

1. **Optimize images:** Use WebP format with JPG fallback
2. **Minimize JSON:** Remove unnecessary whitespace in locale files
3. **Cache busting:** Add version hash to CSS/JS links if deploying to CDN
4. **Lazy loading:** Implement image lazy loading for large asset libraries

## Deployment

### Deploy to GitHub Pages

1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch"
4. Choose `main` branch and `/root` folder
5. Your site will be live at `https://username.github.io/repo-name`

### Deploy to Other Hosts

Since this is a static site, it works on any web host:
- **Netlify:** Drag & drop folder
- **Vercel:** Connect GitHub repository
- **AWS S3 + CloudFront:** Upload files to S3 bucket
- **Traditional hosting:** FTP upload to web root

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-03 | Initial vanilla JS rebuild |

## Contributing

To contribute improvements:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and test thoroughly
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

## License

This project is open source. Please check the LICENSE file for details.

## Credits

**Original Concept:** Fabiano Saft  
**Vanilla JS Rebuild:** Manus AI  
**Psychological Framework:** Based on James Hillman's archetypal psychology

## Support & Questions

For issues, feature requests, or questions:
1. Check this README first
2. Review code comments in `js/` files
3. Open an issue on GitHub
4. Contact: [your contact info]

---

**Happy editing!** This codebase is designed to be maintained and modified independently. All text is externalized, styles are tokenized, and logic is modular. Enjoy building with Evidence.
