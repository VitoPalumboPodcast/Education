<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Feelings Flashcards Lab — GitHub Pages

Versione indipendente da Google AI Studio, Firebase e account Google.

## Come funziona

- L'app è una SPA React/Vite statica, pubblicabile su GitHub Pages.
- Parole personalizzate, punteggi e immagini caricate sono salvati nel browser (`localStorage`).
- I pulsanti di download/upload nella barra superiore creano un backup JSON completo. Il JSON può essere salvato nel repository GitHub e reimportato su un altro dispositivo.
- Non sono presenti chiamate Firebase, Google AI o login Google.

## Sviluppo locale

```bash
pnpm install
pnpm dev
```

Build di produzione:

```bash
pnpm build
```

Per GitHub Pages, pubblicare la cartella `dist` tramite GitHub Actions o Pages da branch.

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/0f2ac31b-95a2-4997-8718-c3e040056259

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`