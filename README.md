# Education Mind Map

A lightweight web-based mind map editor for visually organizing your ideas.

## Introduction

This single page application runs entirely in the browser and lets you create nodes, connect them and rearrange the map with different layouts. Data is stored locally so you can pick up your work later without any server.

## Features

- Add, remove and edit nodes with titles, descriptions, tags and icons
- Choose icon color independently from text color
- Connect nodes with directional arrows
- Radial, grid, physics and hierarchical layouts
- Zoom, pan and fit to screen
- Light and dark themes
- Undo/redo history
- Import/export JSON
- Export map as PNG or PDF
- Save to local storage
- Icon/text spacing now scales with icon size to avoid overlap

## Icone e personalizzazione

- L'editor include ora un set ampliato di icone tematiche (tecnologia, educazione, salute, creatività, sport, ecc.) selezionabili dal pannello laterale.
- Se hai bisogno di ulteriori icone, apri `main.js` e aggiungi la classe Font Awesome desiderata all'array `CONFIG.icons`, quindi definisci l'SVG corrispondente all'interno dell'oggetto `ICON_SVGS` per garantirne il corretto rendering ed export.
- I nuovi esempi nel file mostrano come creare icone personalizzate combinando forme SVG di base (`path`, `rect`, `circle`, `ellipse`).

## Keyboard Shortcuts

- **N** – Add node
- **C** – Connect nodes
- **Delete/Backspace** – Remove selected element
- **F** – Fit map to screen
- **E** – Open properties editor
- **P** – Toggle physics layout
- **H** – Hierarchy layout
- **T** – Toggle theme
- **Ctrl+S** – Save locally
- **Ctrl+Z** – Undo
- **Ctrl+Y** – Redo
- **+/-** – Zoom in/out

## Getting Started

1. Clone this repository or download the files.
2. Open `index.html` in your browser – no additional setup is required.
3. Use **Ctrl+S** or the **Salva** button to store the current map in your browser's local storage. When you reopen the page, your last saved map will automatically load.
