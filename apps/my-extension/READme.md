# CV Match Extension

A Chrome extension that lets users save their CV and, with one click, checks how well their CV matches the job description on any website. Uses Tailwind CSS for styling.

---

## Features

- **Save your CV** in the popup for quick access.
- **Auto-scrape job description** from the current page when you click "Run Match Check".
- **Simple match score** based on word overlap (MVP logic).
- **Tailwind CSS** for a modern UI.

---

## File Overview
src/
- `popup.html` — The extension popup UI (uses Tailwind CSS)
- `popup.js` — Handles saving/loading CV and running the match
- `content.js` — Scrapes the job description from the current page
- `manifest.json` — Chrome extension manifest (declares popup, content script, permissions)
- `src/input.css` — Tailwind input file (for building your own CSS)
- `src/output.css` — Built Tailwind CSS (after running the build script)

---

## Getting Started

### 1. Install Tailwind CSS and CLI

```bash
npm install tailwindcss @tailwindcss/cli
```

### 2. Import Tailwind CSS

```css
@import "tailwindcss";
```

### 3. Run this command to build your CSS and watch for changes
```bash
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
```

### 4.For a one-time production build, you can use
```bash
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --minify
```

### 5. Update Your HTML to Use the Built CSS
```html
<link href="./src/output.css" rel="stylesheet">
```


## Load the Extension in Chrome
- Go to chrome://extensions/
- Enable Developer mode
- Click Load unpacked
- Select the apps/my-extension directory



Usage
- Go to any job listing website.
- Click the extension icon.
- Paste your CV and click Save CV.
- Click Run Match Check.
- See your match score!


Notes
- Whenever you change your Tailwind classes or input.css, - re-run the build command to update output.css.
- For production, use the --minify flag for a smaller CSS file.