<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Feelings Flashcards Lab — GitHub Pages

Versione indipendente da Google AI Studio, Firebase e account Google.

La libreria recuperata il 14 ottobre 2026 contiene 102 file immagine originali, con 103 associazioni a 58 parole. I 78 termini includono anche parole rappresentate da icone. I file sono in `images/` e le associazioni fra parole e stili sono in `images.json`, ospitati su GitHub Pages.

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

Non occorrono chiavi API. Le varianti mancanti nella libreria originale usano un'immagine disponibile o un'icona.
