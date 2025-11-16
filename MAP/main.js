// === CONFIGURAZIONE MIGLIORATA ===
const ICON_LIBRARY = window.ICON_LIBRARY || {};

const CONFIG = {
    colors: {
        nodes: ["#3498db","#e67e22","#2ecc71","#e74c3c","#9b59b6","#f1c40f","#34495e","#8e44ad","#16a085","#d35400"],
        text: ["#ffffff","#2c3e50","#34495e","#7f8c8d"],
        icons: ["#ffffff","#2c3e50","#34495e","#f1c40f","#e74c3c","#3498db"],
        connections: ["#34495e","#9b59b6","#e67e22","#2ecc71","#e74c3c","#c0392b","#3498db","#f39c12"],
        categories: {
            idea: "#f1c40f", // Giallo
            task: "#2ecc71", // Verde
            person: "#9b59b6", // Viola
            resource: "#3498db", // Blu
            location: "#e74c3c", // Rosso
            date: "#1abc9c", // Turchese
            default: "#bdc3c7" // Grigio
        },
        priority: {
            low: "#27ae60", // Verde
            medium: "#f39c12", // Giallo
            high: "#e74c3c"  // Rosso
        }
    },
    icons: (ICON_LIBRARY.icons && ICON_LIBRARY.icons.length ? ICON_LIBRARY.icons : [
        "fas fa-lightbulb","fas fa-star","fas fa-brain","fas fa-book","fas fa-heart",
        "fas fa-users","fas fa-globe","fas fa-comments","fas fa-graduation-cap",
        "fas fa-cube","fas fa-leaf","fas fa-music","fas fa-flask","fas fa-rocket",
        "fas fa-home","fas fa-car","fas fa-phone","fas fa-envelope","fas fa-camera",
        "fas fa-gamepad","fas fa-gift","fas fa-key","fas fa-lock","fas fa-magic",
        "fas fa-flag","fas fa-cog","fas fa-briefcase","fas fa-chart-line",
        "fas fa-bolt","fas fa-cloud","fas fa-database","fas fa-microchip","fas fa-tree",
        "fas fa-recycle","fas fa-calendar","fas fa-pen","fas fa-clipboard",
        "fas fa-project-diagram","fas fa-chalkboard-teacher","fas fa-stethoscope",
        "fas fa-palette","fas fa-dumbbell","fas fa-utensils","fas fa-laptop-code",
        "fas fa-chart-pie","fas fa-atom","fas fa-futbol","fas fa-paw",
        // Icone aggiuntive dalle librerie compatibili
        "far fa-smile","far fa-calendar-alt",
        "fab fa-github","fab fa-youtube","fab fa-figma"
    ]),
    defaultViewBox: "0 0 1200 800",
    localStorageKey: "mindMapAdvancedData",
    shortcuts: {
        'KeyN': () => document.getElementById("add-node").click(),
        'KeyC': () => document.getElementById("add-connection").click(),
        'Delete': () => document.getElementById("remove-node").click(),
        'Backspace': () => document.getElementById("remove-node").click(),
        'KeyF': () => document.getElementById("fit-screen").click(),
        'KeyE': () => document.getElementById("open-sidebar").click(),
        'KeyP': () => document.getElementById("layout-physics").click(),
        'KeyH': () => document.getElementById("layout-hierarchy").click(),
        'KeyT': () => document.getElementById("theme-toggle").click(),
        'Equal': {ctrl:false, action: () => document.getElementById("zoom-in").click()},
        'Minus': {ctrl:false, action: () => document.getElementById("zoom-out").click()},
        'KeyS': {ctrl:true, action: () => document.getElementById("save-map").click()},
        'KeyZ': {ctrl:true, action: () => document.getElementById("undo").click()},
        'KeyY': {ctrl:true, action: () => document.getElementById("redo").click()},
    }
};

const ICON_SVGS = (ICON_LIBRARY.svgMap && Object.keys(ICON_LIBRARY.svgMap).length ? ICON_LIBRARY.svgMap : {
  "fas fa-lightbulb": `<svg viewBox="0 0 384 512"><path fill="currentColor" d="M96 464a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-16H96zm96-464C112.9 0 48 64.6 48 144c0 61.9 37.2 114.6 89.7 135.2C149.6 297.8 176 336 176 384v8a24 24 0 0 0 24 24h16a24 24 0 0 0 24-24v-8c0-48 26.4-86.2 56.3-104.8C314.8 258.6 352 205.9 352 144c0-79.4-64.9-144-144-144z"/></svg>`,
  "fas fa-star": `<svg viewBox="0 0 576 512"><path fill="currentColor" d="M287.9 17.8L354 150.2 490.5 171.5c26.2 3.8 36.7 36 17.7 54.6L402.3 312l23.7 138.4c4.5 26.3-23.2 46-46.4 33.7L288 439.6l-91.6 48.1c-23.2 12.2-50.9-7.4-46.4-33.7L173.7 312 67.8 226.1c-19-18.6-8.5-50.8 17.7-54.6L222 150.2 288.1 17.8c11.7-23.6 45.6-23.9 57.8 0z"/></svg>`,
  "fas fa-brain": `<svg viewBox="0 0 576 512"><path fill="currentColor" d="M288 0C196.5 0 128 32.7 128 96c0 28.7 16.2 56.5 30.3 76.9C111.8 199.6 64 258.7 64 320c0 79.5 100.5 144 224 144s224-64.5 224-144c0-61.3-47.8-120.4-102.3-147.1C331.8 152.5 348 124.7 348 96c0-63.3-68.5-96-160-96zm160 336c0 17.7-14.3 32-32 32H256c-17.7 0-32-14.3-32-32V272h160v64zm48-160c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64s28.7-64 64-64h128c35.3 0 64 28.7 64 64z"/></svg>`,
  "fas fa-book": `<svg viewBox="0 0 448 512"><path fill="currentColor" d="M448 32H0v448h448V32zM192 416H64V128h128v288zm192 0H256V128h128v288z"/></svg>`,
  "fas fa-users": `<svg viewBox="0 0 640 512"><path fill="currentColor" d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-38.5 5.9-53.7 15.6C364 325.2 352 349.1 352 374.4V432c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-57.6c0-35.7-20.8-67.3-51.1-82.9-.1-.1-.2-.1-.2-.2z"/></svg>`,
  "fas fa-heart": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 464l-60-56C84 320 16 248 16 168 16 96 80 32 152 32c38 0 74 18 104 47 30-29 66-47 104-47 72 0 136 64 136 136 0 80-68 152-180 240l-60 56z"/></svg>`,
  "fas fa-globe": `<svg viewBox="0 0 512 512"><circle cx="256" cy="256" r="208" fill="currentColor"/></svg>`,
  "fas fa-comments": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M32 224h160v80H96L32 384zM480 96H192v160h160l96 80V96z"/></svg>`,
  "fas fa-graduation-cap": `<svg viewBox="0 0 640 512"><path fill="currentColor" d="M320 32L0 160l320 128 320-128L320 32zm0 192l-192-76v92c0 62 86 112 192 112s192-50 192-112v-92l-192 76z"/></svg>`,
  "fas fa-cube": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 32L32 128v256l224 96 224-96V128L256 32zm0 64l160 64v160L256 384 96 320V160l160-64z"/></svg>`,
  "fas fa-leaf": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M448 64C256 64 64 256 64 256s96 160 256 160c96 0 160-64 160-160V64z"/></svg>`,
  "fas fa-music": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M448 32L176 96v256a64 64 0 1 0 32 55V180l208-52v170a64 64 0 1 0 32 55V32z"/></svg>`,
  "fas fa-flask": `<svg viewBox="0 0 448 512"><path fill="currentColor" d="M144 32h160v32l-48 96v160a80 80 0 1 1-64 0V160l-48-96V32z"/></svg>`,
  "fas fa-rocket": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M240 0L96 96v128L0 288l96 32 32 96 64-96h128l96-144L240 0z"/></svg>`,
  "fas fa-home": `<svg viewBox="0 0 576 512"><path fill="currentColor" d="M288 32L32 256h96v192h128V320h64v128h128V256h96L288 32z"/></svg>`,
  "fas fa-car": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M64 256l48-96h288l48 96v128H64V256zm48 128a32 32 0 1 0 0-64 32 32 0 0 0 0 64zm288 0a32 32 0 1 0 0-64 32 32 0 0 0 0 64z"/></svg>`,
  "fas fa-phone": `<svg viewBox="0 0 384 512"><path fill="currentColor" d="M320 0H64a32 32 0 0 0-32 32v448a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32V32a32 32 0 0 0-32-32zM192 472a24 24 0 1 1 0-48 24 24 0 0 1 0 48z"/></svg>`,
  "fas fa-envelope": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M32 96h448v320H32V96zm224 160L64 128h384L256 256z"/></svg>`,
  "fas fa-camera": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M96 128l48-48h224l48 48h48v256H48V128h48zm160 64a96 96 0 1 0 0 192 96 96 0 0 0 0-192z"/></svg>`,
  "fas fa-gamepad": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M96 192l-64 96v64h64l64-64h192l64 64h64v-64l-64-96H96zm64 32h64v64h-64v-64zm192 0h32v32h-32v-32z"/></svg>`,
  "fas fa-gift": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M32 160h192V96h-48a48 48 0 0 1 0-96 48 48 0 0 1 48 48h64a48 48 0 0 1 48-48 48 48 0 0 1 0 96h-48v64h192v320H32V160zm96 96v64h256v-64H128z"/></svg>`,
  "fas fa-key": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M336 0a144 144 0 1 0 96 248h48v64h-64v64h-64v64h-96v-64H96V256a144 144 0 0 0 240-256z"/></svg>`,
  "fas fa-lock": `<svg viewBox="0 0 448 512"><path fill="currentColor" d="M352 192h-32v-56a96 96 0 0 0-192 0v56h-32a32 32 0 0 0-32 32v224a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32V224a32 32 0 0 0-32-32zM224 336a32 32 0 1 1 0-64 32 32 0 0 1 0 64z"/></svg>`,
  "fas fa-magic": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M96 416l320-320-32-32-320 320v32h32zm256-96l64 64-32 32-64-64 32-32z"/></svg>`,
  "fas fa-flag": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M64 32v448h64V320h320L416 32H64z"/></svg>`,
  "fas fa-cog": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 176a80 80 0 1 0 0 160 80 80 0 0 0 0-160zm224 48h-48a176 176 0 0 0-20-80l34-34-34-34-34 34a176 176 0 0 0-80-20v-48h-64v48a176 176 0 0 0-80 20l-34-34-34 34 34 34a176 176 0 0 0-20 80h-48v64h48a176 176 0 0 0 20 80l-34 34 34 34 34-34a176 176 0 0 0 80 20v48h64v-48a176 176 0 0 0 80-20l34 34 34-34-34-34a176 176 0 0 0 20-80h48z"/></svg>`,
  "fas fa-briefcase": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M128 128V96a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64v32h96v256H32V128h96zm64 0h128V96H192v32z"/></svg>`,
  "fas fa-chart-line": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M32 448v32h448v-32H32zm64-96l96-96 64 64 160-160v96h32V128h-128v32h64L256 320l-64-64-128 128h32z"/></svg>`
  // Additional icons ensure canvas exports always use SVG
  ,"fas fa-bolt": `<svg viewBox="0 0 320 512"><path fill="currentColor" d="M208 0 16 304h128l-32 208 192-320H176L208 0z"/></svg>`
  ,"fas fa-cloud": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M144 400h224a96 96 0 0 0 0-192 128 128 0 0 0-250.1-37.2A80 80 0 0 0 144 400z"/></svg>`
  ,"fas fa-database": `<svg viewBox="0 0 448 512"><ellipse fill="currentColor" cx="224" cy="80" rx="160" ry="64"/><path fill="currentColor" d="M64 144v80c0 35.3 71.6 64 160 64s160-28.7 160-64v-80c-34.4 22.3-92.5 36-160 36s-125.6-13.7-160-36zm0 128v80c0 35.3 71.6 64 160 64s160-28.7 160-64v-80c-34.4 22.3-92.5 36-160 36s-125.6-13.7-160-36zm0 128v48c0 35.3 71.6 64 160 64s160-28.7 160-64v-48c-34.4 22.3-92.5 36-160 36s-125.6-13.7-160-36z"/></svg>`
  ,"fas fa-microchip": `<svg viewBox="0 0 448 512"><path fill="currentColor" d="M160 96h128a64 64 0 0 1 64 64v192a64 64 0 0 1-64 64H160a64 64 0 0 1-64-64V160a64 64 0 0 1 64-64z"/><rect x="200" y="208" width="48" height="96" fill="none" stroke="currentColor" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".6"/><rect x="112" y="48" width="32" height="48" fill="currentColor"/><rect x="176" y="48" width="32" height="48" fill="currentColor"/><rect x="240" y="48" width="32" height="48" fill="currentColor"/><rect x="304" y="48" width="32" height="48" fill="currentColor"/><rect x="112" y="416" width="32" height="48" fill="currentColor"/><rect x="176" y="416" width="32" height="48" fill="currentColor"/><rect x="240" y="416" width="32" height="48" fill="currentColor"/><rect x="304" y="416" width="32" height="48" fill="currentColor"/><rect x="48" y="176" width="48" height="32" fill="currentColor"/><rect x="48" y="240" width="48" height="32" fill="currentColor"/><rect x="48" y="304" width="48" height="32" fill="currentColor"/><rect x="352" y="176" width="48" height="32" fill="currentColor"/><rect x="352" y="240" width="48" height="32" fill="currentColor"/><rect x="352" y="304" width="48" height="32" fill="currentColor"/></svg>`
  ,"fas fa-tree": `<svg viewBox="0 0 384 512"><polygon fill="currentColor" points="192 32 64 200 128 200 80 280 304 280 256 200 320 200"/><rect x="160" y="280" width="64" height="160" fill="currentColor"/><rect x="144" y="440" width="96" height="32" fill="currentColor"/></svg>`
  ,"fas fa-recycle": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M208 64 120 216l56 32-32 56-112-64L128 64h80zm224 128-80-136h-80l48 80-40 24 96 56 56-24zm-24 144-56-32-32 56 56 32-48 80h80l80-136-80-48z"/></svg>`
  ,"fas fa-calendar": `<svg viewBox="0 0 448 512"><rect x="64" y="80" width="320" height="368" rx="32" ry="32" fill="none" stroke="currentColor" stroke-width="32"/><rect x="112" y="32" width="32" height="64" fill="currentColor"/><rect x="304" y="32" width="32" height="64" fill="currentColor"/><line x1="64" y1="160" x2="384" y2="160" stroke="currentColor" stroke-width="24" stroke-linecap="round"/><rect x="112" y="208" width="64" height="48" fill="currentColor"/><rect x="208" y="208" width="64" height="48" fill="currentColor"/><rect x="304" y="208" width="64" height="48" fill="currentColor"/><rect x="112" y="288" width="64" height="48" fill="currentColor"/><rect x="208" y="288" width="64" height="48" fill="currentColor"/><rect x="304" y="288" width="64" height="48" fill="currentColor"/></svg>`
  ,"fas fa-pen": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M400 32 176 256l-32 128 128-32 224-224-96-96zm-208 304 16 16-24 48-40 8 8-40 40-32z"/></svg>`
  ,"fas fa-clipboard": `<svg viewBox="0 0 384 512"><rect x="64" y="96" width="256" height="384" rx="32" ry="32" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="24" stroke-linecap="round" stroke-opacity=".6" d="M96 128h192v80H96z"/><path fill="currentColor" d="M144 48h96a32 32 0 0 1 32 32v16H112V80a32 32 0 0 1 32-32z"/></svg>`
  ,"fas fa-project-diagram": `<svg viewBox="0 0 512 512"><circle cx="128" cy="128" r="64" fill="currentColor"/><circle cx="384" cy="128" r="48" fill="currentColor"/><circle cx="256" cy="368" r="64" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="32" stroke-linecap="round" stroke-opacity=".7" d="M176 176 256 304 336 176"/><line x1="176" y1="176" x2="80" y2="256" stroke="currentColor" stroke-width="24" stroke-linecap="round" stroke-opacity=".7"/><line x1="336" y1="176" x2="432" y2="256" stroke="currentColor" stroke-width="24" stroke-linecap="round" stroke-opacity=".7"/></svg>`
  ,"fas fa-chalkboard-teacher": `<svg viewBox="0 0 512 512"><rect x="64" y="96" width="320" height="208" rx="16" ry="16" fill="none" stroke="currentColor" stroke-width="28"/><rect x="64" y="320" width="320" height="32" fill="currentColor"/><circle cx="400" cy="176" r="40" fill="currentColor"/><path fill="currentColor" d="M400 224c-44 0-80 36-80 80v72h160v-72c0-44-36-80-80-80z"/></svg>`
  ,"fas fa-stethoscope": `<svg viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" d="M144 64v112a80 80 0 0 0 160 0V64"/><path fill="none" stroke="currentColor" stroke-width="28" stroke-linecap="round" d="M304 176v96a112 112 0 0 1-224 0v-96"/><path fill="none" stroke="currentColor" stroke-width="28" stroke-linecap="round" d="M368 368v48a80 80 0 0 1-160 0"/><circle cx="368" cy="320" r="48" fill="currentColor"/></svg>`
  ,"fas fa-palette": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 64C132.3 64 32 150.1 32 256s80.6 192 176 192h48a48 48 0 0 0 0-96h-32a48 48 0 0 1 0-96h96a112 112 0 0 0 0-224z"/><circle cx="176" cy="224" r="28" fill="currentColor" fill-opacity=".5"/><circle cx="256" cy="176" r="28" fill="currentColor" fill-opacity=".5"/><circle cx="208" cy="320" r="28" fill="currentColor" fill-opacity=".5"/><circle cx="320" cy="248" r="28" fill="currentColor" fill-opacity=".5"/></svg>`
  ,"fas fa-dumbbell": `<svg viewBox="0 0 512 512"><rect x="96" y="208" width="320" height="96" fill="currentColor"/><rect x="32" y="176" width="48" height="160" fill="currentColor"/><rect x="432" y="176" width="48" height="160" fill="currentColor"/><rect x="80" y="192" width="16" height="128" fill="currentColor"/><rect x="416" y="192" width="16" height="128" fill="currentColor"/></svg>`
  ,"fas fa-utensils": `<svg viewBox="0 0 384 512"><path fill="currentColor" d="M96 32c-26.5 0-48 37.3-48 96 0 45 14.3 83.2 32 94.4V480h32V222.4C129.7 211.2 144 173 144 128c0-58.7-21.5-96-48-96zm176 0v192h-48l16 256h64l16-256h-48V32z"/></svg>`
  ,"fas fa-laptop-code": `<svg viewBox="0 0 512 512"><rect x="64" y="96" width="384" height="240" rx="24" ry="24" fill="none" stroke="currentColor" stroke-width="28"/><rect x="32" y="352" width="448" height="64" rx="16" ry="16" fill="currentColor"/><path fill="currentColor" d="M208 176 160 224l48 48 24-24-24-24 24-24-24-24zm96 0-24 24 24 24-24 24 24 24 48-48-48-48z"/></svg>`
  ,"fas fa-chart-pie": `<svg viewBox="0 0 512 512"><path fill="currentColor" fill-opacity=".75" d="M272 32v208h208C480 141 371 32 272 32z"/><path fill="currentColor" d="M240 32C133 32 40 125 40 232s93 200 200 200 200-93 200-200H240V32z"/></svg>`
  ,"fas fa-atom": `<svg viewBox="0 0 512 512"><circle cx="256" cy="256" r="40" fill="currentColor"/><ellipse cx="256" cy="256" rx="200" ry="96" fill="none" stroke="currentColor" stroke-width="24"/><ellipse cx="256" cy="256" rx="96" ry="200" fill="none" stroke="currentColor" stroke-width="24"/><path fill="none" stroke="currentColor" stroke-width="24" stroke-linecap="round" d="M96 96c80 80 240 80 320 0M96 416c80-80 240-80 320 0"/></svg>`
  ,"fas fa-futbol": `<svg viewBox="0 0 512 512"><circle cx="256" cy="256" r="200" fill="none" stroke="currentColor" stroke-width="28"/><polygon fill="currentColor" points="256 168 200 216 224 296 288 296 312 216"/><path fill="currentColor" d="M144 344 88 272l72-24 32 88-48 8zm224 0-56-8 32-88 72 24-48 72z"/></svg>`
  ,"fas fa-paw": `<svg viewBox="0 0 512 512"><ellipse cx="160" cy="192" rx="48" ry="64" fill="currentColor"/><ellipse cx="352" cy="192" rx="48" ry="64" fill="currentColor"/><ellipse cx="128" cy="320" rx="40" ry="52" fill="currentColor"/><ellipse cx="384" cy="320" rx="40" ry="52" fill="currentColor"/><circle cx="256" cy="320" r="88" fill="currentColor"/></svg>`
  ,"far fa-smile": `<svg viewBox="0 0 512 512"><circle cx="256" cy="256" r="208" fill="none" stroke="currentColor" stroke-width="28"/><circle cx="192" cy="216" r="24" fill="currentColor"/><circle cx="320" cy="216" r="24" fill="currentColor"/><path d="M176 304c24 32 56 48 80 48s56-16 80-48" fill="none" stroke="currentColor" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  ,"far fa-calendar-alt": `<svg viewBox="0 0 512 512"><rect x="80" y="96" width="352" height="320" rx="32" ry="32" fill="none" stroke="currentColor" stroke-width="28"/><rect x="80" y="136" width="352" height="64" fill="currentColor" opacity="0.85"/><rect x="144" y="232" width="80" height="72" rx="12" ry="12" fill="currentColor" opacity="0.85"/><rect x="288" y="232" width="80" height="72" rx="12" ry="12" fill="currentColor" opacity="0.65"/><rect x="144" y="328" width="80" height="72" rx="12" ry="12" fill="currentColor" opacity="0.65"/><rect x="288" y="328" width="80" height="72" rx="12" ry="12" fill="currentColor" opacity="0.85"/></svg>`
  ,"fab fa-github": `<svg viewBox="0 0 512 512"><circle cx="256" cy="256" r="208" fill="currentColor" opacity="0.15"/><path d="M320 408c-16 8-32 12-64 12s-48-4-64-12v-56c0-24 16-48 40-48-56-4-104-28-104-112 0-24 8-44 20-60-2-8-6-36 2-52 0 0 26 0 56 24 14-4 30-6 46-6s32 2 46 6c30-24 56-24 56-24 8 16 4 44 2 52 12 16 20 36 20 60 0 84-48 108-104 112 24 0 40 24 40 48v56z" fill="currentColor"/></svg>`
  ,"fab fa-youtube": `<svg viewBox="0 0 576 512"><rect x="64" y="128" width="448" height="256" rx="72" ry="72" fill="currentColor" opacity="0.85"/><polygon points="260 192 260 320 360 256" fill="#fff" opacity="0.95"/></svg>`
  ,"fab fa-figma": `<svg viewBox="0 0 512 512"><circle cx="192" cy="160" r="88" fill="currentColor" opacity="0.85"/><circle cx="320" cy="160" r="88" fill="currentColor" opacity="0.55"/><circle cx="192" cy="288" r="88" fill="currentColor" opacity="0.55"/><circle cx="320" cy="288" r="88" fill="currentColor" opacity="0.35"/><rect x="224" y="288" width="96" height="160" rx="48" ry="48" fill="currentColor" opacity="0.85"/></svg>`
});

const ICON_LIBRARY_ALIASES = (ICON_LIBRARY.aliases && Object.keys(ICON_LIBRARY.aliases).length ? ICON_LIBRARY.aliases : {
    fas: ["solid", "pieno", "riempita"],
    far: ["regular", "outline", "contorno"],
    fab: ["brand", "logo", "social"]
});

const CURATED_ICON_SET = new Set(Object.keys(ICON_SVGS));
function getBundledIconMetadata() {
    if (typeof window === "undefined") return null;
    const metadata = window.FONT_AWESOME_ICON_METADATA;
    return (metadata && typeof metadata === "object") ? metadata : null;
}
const FONT_AWESOME_STYLE_PREFIXES = {
    solid: "fas",
    regular: "far",
    brands: "fab",
    light: "fal",
    thin: "fat",
    duotone: "fad"
};

const CONNECTION_LABEL_DEFAULT_SIZE = 20;
const CONNECTION_LABEL_WRAP_LIMIT = 14;
const REMOTE_ICON_CATALOG_URLS = [
    "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/metadata/icons.json",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/metadata/icons.json"
];

function createOfflineCatalogEntry(className, label, terms = []) {
    const normalized = normalizeIconClass(className);
    if (!normalized) return null;
    const safeLabel = (label || normalized).trim();
    return {
        className: normalized,
        classNameLower: normalized.toLowerCase(),
        label: safeLabel,
        labelLower: safeLabel.toLowerCase(),
        terms: terms.filter(Boolean).map(term => String(term).toLowerCase())
    };
}

const OFFLINE_ICON_CATALOG = [
    createOfflineCatalogEntry("fab fa-twitter", "Twitter", ["social", "brand", "tweet", "bird"]),
    createOfflineCatalogEntry("fab fa-facebook", "Facebook", ["social", "brand", "meta"]),
    createOfflineCatalogEntry("fab fa-linkedin", "LinkedIn", ["social", "brand", "lavoro", "professionale"]),
    createOfflineCatalogEntry("fab fa-instagram", "Instagram", ["social", "brand", "foto", "media"]),
    createOfflineCatalogEntry("fas fa-user", "Utente", ["persona", "profilo", "account"]),
    createOfflineCatalogEntry("fas fa-chart-bar", "Grafico a barre", ["analytics", "statistiche", "report"]),
    createOfflineCatalogEntry("fas fa-comments", "Commenti", ["chat", "messaggi", "comunicazione"]),
    createOfflineCatalogEntry("fas fa-bell", "Campanella", ["notifiche", "avviso", "alert"]),
    createOfflineCatalogEntry("fas fa-share-alt", "Condividi", ["share", "social", "diffondi"]),
    createOfflineCatalogEntry("fas fa-plane", "Aereo", ["volo", "viaggio", "trasporto", "aeroporto"]),
    createOfflineCatalogEntry("fas fa-child", "Bambino", ["persona", "infanzia", "giovane", "famiglia"])
].filter(Boolean);

let fullIconCatalog = [];
let fullIconCatalogPromise = null;
let fullIconCatalogError = null;
let preferredItalianVoice = null;
let availableSpeechVoices = [];
let currentSpeechUtterance = null;
const speechOverlay = document.getElementById("speech-overlay");
const speechOverlayText = document.getElementById("speech-overlay-text");

// Parole chiave aggiuntive per facilitare la ricerca delle icone nel modal
const ICON_KEYWORDS = (ICON_LIBRARY.keywords && Object.keys(ICON_LIBRARY.keywords).length ? ICON_LIBRARY.keywords : {
    "fas fa-lightbulb": ["idea", "lampadina", "ispirazione", "intuizione", "creatività"],
    "fas fa-star": ["stella", "preferito", "valutazione", "qualità", "premio"],
    "fas fa-brain": ["cervello", "pensiero", "mente", "apprendimento", "conoscenza"],
    "fas fa-book": ["libro", "lettura", "studio", "manuale", "testo"],
    "fas fa-users": ["utenti", "gruppo", "team", "persone", "community"],
    "fas fa-heart": ["cuore", "amore", "passione", "preferito", "salute"],
    "fas fa-globe": ["mondo", "globale", "pianeta", "internazionale", "terra"],
    "fas fa-comments": ["chat", "messaggi", "conversazione", "comunicazione", "discussione"],
    "fas fa-graduation-cap": ["laurea", "diploma", "formazione", "università", "scuola"],
    "fas fa-cube": ["cubo", "blocco", "3d", "struttura", "modulo"],
    "fas fa-leaf": ["foglia", "natura", "ecologia", "verde", "ambiente"],
    "fas fa-music": ["musica", "nota", "suono", "canzone", "melodia"],
    "fas fa-flask": ["laboratorio", "chimica", "scienza", "esperimento", "ricerca"],
    "fas fa-rocket": ["razzo", "lancio", "startup", "crescita", "innovazione"],
    "fas fa-home": ["casa", "abitazione", "domestico", "base", "residenza"],
    "fas fa-car": ["auto", "macchina", "veicolo", "trasporto", "mobilità"],
    "fas fa-phone": ["telefono", "cellulare", "contatto", "chiamata", "smartphone"],
    "fas fa-envelope": ["lettera", "email", "messaggio", "posta", "comunicazione"],
    "fas fa-camera": ["fotocamera", "foto", "immagine", "scatto", "ripresa"],
    "fas fa-gamepad": ["videogiochi", "controller", "gioco", "gaming", "console"],
    "fas fa-gift": ["regalo", "dono", "sorpresa", "premio", "festività"],
    "fas fa-key": ["chiave", "accesso", "sicurezza", "password", "sblocco"],
    "fas fa-lock": ["lucchetto", "sicurezza", "protezione", "blocco", "privacy"],
    "fas fa-magic": ["magia", "bacchetta", "speciale", "trucco", "fantasia"],
    "fas fa-flag": ["bandiera", "obiettivo", "traguardo", "segnalibro", "paese"],
    "fas fa-cog": ["ingranaggio", "impostazioni", "configurazione", "meccanismo", "sistema"],
    "fas fa-briefcase": ["valigetta", "lavoro", "business", "professione", "carriera"],
    "fas fa-chart-line": ["grafico", "andamento", "crescita", "statistiche", "performance"],
    "fas fa-bolt": ["fulmine", "energia", "potenza", "elettrico", "velocità"],
    "fas fa-cloud": ["nuvola", "online", "cloud", "meteo", "internet"],
    "fas fa-database": ["database", "dati", "archivio", "tabella", "records"],
    "fas fa-microchip": ["chip", "tecnologia", "hardware", "circuito", "processore"],
    "fas fa-tree": ["albero", "natura", "crescita", "bosco", "ambiente"],
    "fas fa-recycle": ["riciclo", "sostenibilità", "riuso", "ambiente", "ecologia"],
    "fas fa-calendar": ["calendario", "data", "agenda", "pianificazione", "evento"],
    "fas fa-pen": ["penna", "scrittura", "modifica", "firma", "editor"],
    "fas fa-clipboard": ["appunti", "note", "checklist", "elenco", "task"],
    "fas fa-project-diagram": ["diagramma", "progetto", "flusso", "processo", "workflow"],
    "fas fa-chalkboard-teacher": ["insegnante", "lezione", "classe", "docente", "formazione"],
    "fas fa-stethoscope": ["stetoscopio", "medico", "salute", "dottore", "sanità"],
    "fas fa-palette": ["tavolozza", "arte", "colori", "design", "creatività"],
    "fas fa-dumbbell": ["manubrio", "fitness", "palestra", "allenamento", "sport"],
    "fas fa-utensils": ["posate", "cucina", "cibo", "ristorante", "pasto"],
    "fas fa-laptop-code": ["laptop", "codice", "programmazione", "computer", "sviluppo"],
    "fas fa-chart-pie": ["grafico", "torta", "percentuale", "analisi", "statistiche"],
    "fas fa-atom": ["atomo", "scienza", "fisica", "molecola", "energia"],
    "fas fa-futbol": ["calcio", "sport", "pallone", "partita", "squadra"],
    "fas fa-paw": ["zampa", "animale", "pet", "mascotte", "fauna"],
    "far fa-smile": ["sorriso", "felice", "emoji", "umore", "positivo"],
    "far fa-calendar-alt": ["calendario", "evento", "agenda", "pianifica", "scadenza"],
    "fab fa-github": ["github", "repository", "sviluppo", "versionamento", "git"],
    "fab fa-youtube": ["youtube", "video", "tutorial", "lezione", "streaming"],
    "fab fa-figma": ["figma", "design", "ux", "ui", "prototipo"]
});

function getIconLibraries(iconClass) {
    if (!iconClass) return [];
    return iconClass.split(/\s+/).filter(cls => cls.startsWith("fa") && !cls.startsWith("fa-"));
}

function getIconLabel(iconClass) {
    if (!iconClass) return "";
    const parts = iconClass.split(/\s+/);
    const baseClass = [...parts].reverse().find(cls => cls.startsWith("fa-"));
    const label = baseClass ? baseClass.replace(/^fa-/, "") : parts[parts.length - 1] || iconClass;
    return label.replace(/[-_]/g, " ");
}

function getIconSVG(iconClass, size, color) {
    const svgHtml = getIconSVGInline(iconClass, size, color);
    if (!svgHtml) return "";
    return `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">${svgHtml}</div>`;
}


// === STATO DELL'APPLICAZIONE ===
let appState = {
    nodes: [],
    connections: [],
    connectionLabelCounts: {},
    selectedNode: null,
    selectedConnection: null,
    isConnecting: false,
    connectingFrom: null,
    layout: "normal",
    physics: false,
    simulation: null,
    isDarkTheme: false,
    searchTerm: "",
    history: [],
    historyIndex: -1,
    autoSave: true, // Potentially use this for periodic auto-save
    currentViewBox: CONFIG.defaultViewBox.split(" ").map(Number)
};

let addChildArrow = null;
let addChildArrowNodeId = null;
let iconModalOnSelect = null;
let iconModalCurrentIcon = null;
let iconModalCurrentRenderMode = "svg";
let iconModalRenderToken = 0;
let iconAutocompleteEntries = [];
let iconAutocompleteIndex = -1;
let iconAutocompleteRequestToken = 0;

// === ELEMENTI DOM ===
const svgElem = document.getElementById("mindmap-svg");
const svg = d3.select(svgElem);
const nodesGroup = svg.select("#nodes-group");
const connectionsGroup = svg.select("#connections-group");
const defs = svg.select('defs');
const sidebar = document.getElementById("sidebar");
const nodeEditor = document.getElementById("node-editor");
const connEditor = document.getElementById("connection-editor");
const minimapContainer = document.getElementById("minimap");
const minimapSvg = d3.select("#minimap-svg");
const minimapNodesGroup = minimapSvg.select("#minimap-nodes-group");
const minimapConnectionsGroup = minimapSvg.select("#minimap-connections-group");
const minimapViewportRect = minimapSvg.select("#minimap-viewport-rect");
const loadingIndicator = document.getElementById("loading");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");
const iconModal = document.getElementById("icon-modal");
const iconModalList = document.getElementById("icon-modal-list");
const iconModalSearch = document.getElementById("icon-modal-search");
const iconModalAutocomplete = document.getElementById("icon-modal-autocomplete");
const iconModalCloseBtn = document.getElementById("icon-modal-close");
const sidebarIconSearchInput = document.getElementById("sidebar-icon-search");
const sidebarIconSearchButton = document.getElementById("sidebar-icon-search-btn");


// === UTILITY FUNCTIONS ===
function uniqueId(prefix = "n") {
    return prefix + "_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char] || char));
}

function sanitizeIconClass(value) {
    if (!value) return "";
    return value
        .split(/\s+/)
        .map(cls => cls.replace(/[^a-z0-9-]/gi, ""))
        .filter(Boolean)
        .join(" ")
        .trim();
}

const ICON_SUGGESTION_CLASSES = (() => {
    const sources = [
        Object.keys(ICON_SVGS || {}),
        CONFIG.icons || [],
        (ICON_LIBRARY && ICON_LIBRARY.icons) || [],
        (ICON_LIBRARY && ICON_LIBRARY.keywords ? Object.keys(ICON_LIBRARY.keywords) : [])
    ];

    const unique = new Set();
    sources.forEach(list => {
        (list || []).forEach(icon => {
            const sanitized = sanitizeIconClass(icon);
            if (sanitized) unique.add(sanitized);
        });
    });

    return Array.from(unique).sort();
})();

function getIconSuggestions(query) {
    const rawQuery = (query || "").trim().toLowerCase();
    if (!rawQuery) {
        return ICON_SUGGESTION_CLASSES.slice(0, 50);
    }

    const normalizedQuery = sanitizeIconClass(query).toLowerCase();
    const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

    return ICON_SUGGESTION_CLASSES.filter(iconClass => {
        const lowerClass = iconClass.toLowerCase();
        if (!tokens.length) return true;

        if (tokens.length > 1) {
            return lowerClass.startsWith(normalizedQuery);
        }

        const baseClass = lowerClass.split(/\s+/).pop();
        return lowerClass.startsWith(normalizedQuery) || (baseClass && baseClass.startsWith(tokens[0]));
    }).slice(0, 50);
}

function populateIconSuggestionDatalist(datalist, query) {
    if (!datalist) return;
    const suggestions = getIconSuggestions(query);
    datalist.innerHTML = "";
    suggestions.forEach(iconClass => {
        const option = document.createElement("option");
        option.value = iconClass;
        const label = getIconLabel(iconClass);
        if (label) option.label = label;
        datalist.appendChild(option);
    });
}

function isSafeExternalUrl(url) {
    if (!url) return false;
    try {
        const parsed = new URL(url.trim());
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (e) {
        return false;
    }
}

function getIconSVGInline(iconClass, size, color) {
    const svgData = ICON_SVGS[iconClass];
    if (!svgData) return "";
    let svgHtml = svgData.replace(/currentColor/g, color);
    svgHtml = svgHtml.replace(/<svg /, `<svg width="${size}" height="${size}" `);
    return svgHtml;
}

function getIconMarkupForSource(iconClass, size, color) {
    const sanitized = sanitizeIconClass(iconClass);
    if (sanitized && ICON_SVGS[sanitized]) {
        return getIconSVGInline(sanitized, size, color);
    }
    const fallbackClass = sanitized || "fas fa-link";
    return `<i class="${fallbackClass}" style="font-size:${size}px;color:${color};"></i>`;
}

function normalizeIconClass(iconClass) {
    return sanitizeIconClass(iconClass);
}

function isCuratedIconClass(iconClass) {
    if (!iconClass) return false;
    return CURATED_ICON_SET.has(normalizeIconClass(iconClass));
}

function resolveRenderModeForClass(iconClass, preferredMode) {
    const normalized = normalizeIconClass(iconClass);
    if (!normalized) return "svg";
    if (preferredMode === "webfont") return "webfont";
    if (preferredMode === "svg" && isCuratedIconClass(normalized)) return "svg";
    return isCuratedIconClass(normalized) ? "svg" : "webfont";
}

function getIconPreviewMarkup(iconClass, size, color, renderMode) {
    const normalized = normalizeIconClass(iconClass);
    const effectiveMode = resolveRenderModeForClass(normalized, renderMode);
    if (effectiveMode === "svg" && normalized && ICON_SVGS[normalized]) {
        return getIconSVG(normalized, size, color);
    }
    const fallback = normalized || "fas fa-circle";
    const fontSize = Math.max(12, Math.round(size * 0.85));
    return `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;"><i class="${fallback}" style="font-size:${fontSize}px;color:${color};line-height:1;"></i></div>`;
}

function getNodeIconClass(nodo) {
    if (!nodo) return "";
    return normalizeIconClass(nodo.iconClass || nodo.icon || "");
}

function getNodeIconRenderMode(nodo) {
    if (!nodo) return "svg";
    const preferred = nodo.iconRenderMode === "webfont" ? "webfont" : "svg";
    return resolveRenderModeForClass(getNodeIconClass(nodo), preferred);
}

function getNodeIconSelection(nodo) {
    return {
        className: getNodeIconClass(nodo),
        renderMode: getNodeIconRenderMode(nodo)
    };
}

function ensureNodeIconData(nodo) {
    if (!nodo) return;
    const normalized = getNodeIconClass(nodo);
    nodo.iconClass = normalized;
    nodo.icon = normalized;
    nodo.iconRenderMode = getNodeIconRenderMode(nodo);
}

function applyNodeIconSelection(nodo, selection) {
    if (!nodo) return;
    const className = normalizeIconClass(selection && selection.className ? selection.className : selection || "");
    const preferred = selection && selection.renderMode ? selection.renderMode : undefined;
    nodo.iconClass = className;
    nodo.icon = className;
    nodo.iconRenderMode = resolveRenderModeForClass(className, preferred);
    nodo.updatedAt = new Date().toISOString();
}

function getNodeIconHTML(nodo) {
    const selection = getNodeIconSelection(nodo);
    const color = nodo.iconColor || nodo.textColor || CONFIG.colors.icons[0];
    return getIconPreviewMarkup(selection.className, nodo.iconSize, color, selection.renderMode);
}

function buildFullIconCatalogEntries(metadata) {
    const entries = [];
    const seen = new Set();
    if (!metadata || typeof metadata !== "object") return entries;
    Object.entries(metadata).forEach(([name, data]) => {
        if (!data || !Array.isArray(data.styles)) return;
        const label = (data.label || name || "").trim() || name;
        const baseTerms = new Set();
        baseTerms.add(name);
        if (label) baseTerms.add(label);
        (data.search && Array.isArray(data.search.terms) ? data.search.terms : []).forEach(term => {
            if (term) baseTerms.add(term);
        });
        (data.aliases && Array.isArray(data.aliases.names) ? data.aliases.names : []).forEach(alias => {
            if (alias) baseTerms.add(alias);
        });
        data.styles.forEach(style => {
            const prefix = FONT_AWESOME_STYLE_PREFIXES[style];
            if (!prefix || !["fas", "far", "fab"].includes(prefix)) return;
            const className = normalizeIconClass(`${prefix} fa-${name}`);
            if (!className || CURATED_ICON_SET.has(className) || seen.has(className)) return;
            seen.add(className);
            entries.push({
                className,
                classNameLower: className.toLowerCase(),
                label,
                labelLower: label.toLowerCase(),
                terms: Array.from(baseTerms).map(term => String(term).toLowerCase())
            });
        });
    });
    return entries;
}

async function loadFullIconCatalog() {
    if (fullIconCatalog.length > 0) return fullIconCatalog;
    if (fullIconCatalogPromise) return fullIconCatalogPromise;
    fullIconCatalogPromise = (async () => {
        const bundledMetadata = getBundledIconMetadata();
        if (bundledMetadata && Object.keys(bundledMetadata).length) {
            try {
                fullIconCatalog = buildFullIconCatalogEntries(bundledMetadata);
                if (fullIconCatalog.length > 0) {
                    fullIconCatalogError = null;
                    if (typeof window !== "undefined") {
                        try {
                            delete window.FONT_AWESOME_ICON_METADATA;
                        } catch (cleanupError) {
                            // Ignora eventuali errori di cleanup, l'oggetto è già stato letto.
                        }
                    }
                    return fullIconCatalog;
                }
            } catch (err) {
                console.warn("Impossibile utilizzare il catalogo icone locale precompilato:", err);
            }
        }

        for (const url of REMOTE_ICON_CATALOG_URLS) {
            try {
                const response = await fetch(url, { cache: "force-cache" });
                if (!response.ok) continue;
                const metadata = await response.json();
                fullIconCatalog = buildFullIconCatalogEntries(metadata);
                fullIconCatalogError = null;
                return fullIconCatalog;
            } catch (err) {
                fullIconCatalogError = err;
            }
        }
        if (OFFLINE_ICON_CATALOG.length > 0) {
            console.warn("Catalogo completo non disponibile, utilizzo fallback offline di base.");
            fullIconCatalog = OFFLINE_ICON_CATALOG.slice();
            fullIconCatalogError = null;
            return fullIconCatalog;
        }
        throw fullIconCatalogError || new Error("Impossibile caricare il catalogo completo delle icone.");
    })();
    try {
        return await fullIconCatalogPromise;
    } catch (err) {
        fullIconCatalogPromise = null;
        throw err;
    }
}

function iconMatchesTokens(icon, tokens) {
    if (!tokens || tokens.length === 0) return true;
    const iconLower = icon.toLowerCase();
    const parts = iconLower.split(/\s+/);
    const baseClass = parts.find(cls => cls.startsWith("fa-"));
    const normalized = baseClass ? baseClass.replace(/^fa-/, "").replace(/-/g, " ") : iconLower.replace(/-/g, " ");
    const label = getIconLabel(icon).toLowerCase();
    const keywords = (ICON_KEYWORDS[icon] || []).map(keyword => keyword.toLowerCase());
    const libraryClasses = getIconLibraries(icon).map(cls => cls.toLowerCase());
    const libraryAliases = libraryClasses.flatMap(cls => (ICON_LIBRARY_ALIASES[cls] || [])).map(alias => alias.toLowerCase());
    return tokens.every(token =>
        iconLower.includes(token) ||
        normalized.includes(token) ||
        label.includes(token) ||
        libraryClasses.some(library => library.includes(token)) ||
        libraryAliases.some(alias => alias.includes(token)) ||
        keywords.some(keyword => keyword.includes(token))
    );
}

function getCuratedIconMatches(tokens) {
    return Object.keys(ICON_SVGS).filter(icon => iconMatchesTokens(icon, tokens)).sort();
}

function filterFullCatalogMatches(tokens) {
    if (!Array.isArray(tokens) || tokens.length === 0) return fullIconCatalog;
    return fullIconCatalog.filter(entry => tokens.every(token =>
        entry.labelLower.includes(token) ||
        entry.classNameLower.includes(token) ||
        entry.terms.some(term => term.includes(token))
    ));
}

function createCuratedAutocompleteEntry(icon) {
    const className = normalizeIconClass(icon);
    const label = getIconLabel(icon);
    const libraries = getIconLibraries(icon);
    const subtitleParts = [];
    if (libraries.length > 0) subtitleParts.push(libraries.join('/'));
    subtitleParts.push(className);
    return {
        className,
        label,
        subtitle: subtitleParts.join(' • '),
        renderMode: "svg"
    };
}

function createFullCatalogAutocompleteEntry(entry) {
    const className = normalizeIconClass(entry.className);
    return {
        className,
        label: entry.label,
        subtitle: className,
        renderMode: "webfont"
    };
}

function renderIconAutocompleteEntries(entries, { pending = false, emptyMessage = "" } = {}) {
    if (!iconModalAutocomplete) return;
    iconModalAutocomplete.innerHTML = "";
    iconAutocompleteEntries = entries;
    iconAutocompleteIndex = -1;
    if (!entries.length) {
        if (pending) {
            const loading = document.createElement("div");
            loading.className = "icon-autocomplete-empty";
            loading.textContent = "Ricerca icone...";
            iconModalAutocomplete.appendChild(loading);
            iconModalAutocomplete.classList.add("show");
        } else if (emptyMessage) {
            const empty = document.createElement("div");
            empty.className = "icon-autocomplete-empty";
            empty.textContent = emptyMessage;
            iconModalAutocomplete.appendChild(empty);
            iconModalAutocomplete.classList.add("show");
        } else {
            iconModalAutocomplete.classList.remove("show");
        }
        return;
    }

    const previewColor = appState.isDarkTheme ? "#dfe6f0" : "#4a5b6b";
    iconModalAutocomplete.classList.add("show");
    entries.forEach((entry, index) => {
        const option = document.createElement("div");
        option.className = "icon-autocomplete-option" + (index === iconAutocompleteIndex ? " active" : "");
        option.dataset.index = String(index);

        const preview = document.createElement("div");
        preview.className = "icon-autocomplete-preview";
        preview.innerHTML = getIconPreviewMarkup(entry.className, 28, previewColor, entry.renderMode);

        const text = document.createElement("div");
        text.className = "icon-autocomplete-text";
        const label = document.createElement("span");
        label.textContent = entry.label;
        const subtitle = document.createElement("small");
        subtitle.textContent = entry.subtitle;
        text.appendChild(label);
        text.appendChild(subtitle);

        option.appendChild(preview);
        option.appendChild(text);
        option.addEventListener("mouseenter", () => setIconAutocompleteActiveIndex(index, false));
        option.addEventListener("mousedown", event => event.preventDefault());
        option.addEventListener("click", () => selectIconFromAutocomplete(index));
        iconModalAutocomplete.appendChild(option);
    });
}

function hideIconAutocomplete() {
    if (!iconModalAutocomplete) return;
    iconModalAutocomplete.innerHTML = "";
    iconModalAutocomplete.classList.remove("show");
    iconAutocompleteEntries = [];
    iconAutocompleteIndex = -1;
    iconAutocompleteRequestToken++;
}

function ensureAutocompleteOptionVisible(index) {
    if (!iconModalAutocomplete) return;
    const option = iconModalAutocomplete.querySelector(`.icon-autocomplete-option[data-index="${index}"]`);
    if (!option) return;
    const optionTop = option.offsetTop;
    const optionBottom = optionTop + option.offsetHeight;
    const visibleTop = iconModalAutocomplete.scrollTop;
    const visibleBottom = visibleTop + iconModalAutocomplete.clientHeight;
    if (optionTop < visibleTop) {
        iconModalAutocomplete.scrollTop = optionTop;
    } else if (optionBottom > visibleBottom) {
        iconModalAutocomplete.scrollTop = optionBottom - iconModalAutocomplete.clientHeight;
    }
}

function setIconAutocompleteActiveIndex(index, ensureVisible = true) {
    if (!iconModalAutocomplete) return;
    const options = iconModalAutocomplete.querySelectorAll(".icon-autocomplete-option");
    if (!options.length) {
        iconAutocompleteIndex = -1;
        return;
    }
    if (index < 0 || index >= iconAutocompleteEntries.length) {
        options.forEach(option => option.classList.remove("active"));
        iconAutocompleteIndex = -1;
        return;
    }
    iconAutocompleteIndex = index;
    options.forEach((option, idx) => {
        if (idx === index) option.classList.add("active");
        else option.classList.remove("active");
    });
    if (ensureVisible) ensureAutocompleteOptionVisible(index);
}

function selectIconFromAutocomplete(selection) {
    const entry = typeof selection === "number" ? iconAutocompleteEntries[selection] : selection;
    if (!entry) return;
    iconModalCurrentIcon = entry.className;
    iconModalCurrentRenderMode = entry.renderMode;
    if (iconModalOnSelect) iconModalOnSelect({ className: entry.className, renderMode: entry.renderMode });
    chiudiIconModal();
}

async function updateIconAutocomplete() {
    if (!iconModalSearch || !iconModalAutocomplete) return;
    const filtro = (iconModalSearch.value || "").toLowerCase();
    const tokens = filtro.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) {
        hideIconAutocomplete();
        return;
    }

    const requestToken = ++iconAutocompleteRequestToken;
    const curatedMatches = getCuratedIconMatches(tokens);
    const curatedEntries = curatedMatches.slice(0, 8).map(createCuratedAutocompleteEntry);
    renderIconAutocompleteEntries(curatedEntries, {
        pending: true,
        emptyMessage: "Nessuna icona corrispondente."
    });

    try {
        await loadFullIconCatalog();
        if (requestToken !== iconAutocompleteRequestToken) return;
        const curatedSet = new Set(curatedMatches.map(icon => normalizeIconClass(icon)));
        const extraEntries = filterFullCatalogMatches(tokens)
            .filter(entry => !curatedSet.has(entry.className))
            .slice(0, 20)
            .map(createFullCatalogAutocompleteEntry);
        const combined = [...curatedEntries, ...extraEntries].slice(0, 20);
        renderIconAutocompleteEntries(combined, {
            pending: false,
            emptyMessage: "Nessuna icona corrispondente."
        });
    } catch (error) {
        if (requestToken !== iconAutocompleteRequestToken) return;
        console.warn("Impossibile aggiornare l'autocompletamento icone:", error);
        renderIconAutocompleteEntries(curatedEntries, {
            pending: false,
            emptyMessage: "Nessuna icona corrispondente."
        });
    }
}

function handleIconAutocompleteKeydown(event) {
    if (!iconModalAutocomplete || !iconModalAutocomplete.classList.contains("show") || iconAutocompleteEntries.length === 0) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            updateIconAutocomplete();
        }
        return;
    }

    if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = (iconAutocompleteIndex + 1) % iconAutocompleteEntries.length;
        setIconAutocompleteActiveIndex(nextIndex);
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const nextIndex = iconAutocompleteIndex <= 0 ? iconAutocompleteEntries.length - 1 : iconAutocompleteIndex - 1;
        setIconAutocompleteActiveIndex(nextIndex);
    } else if (event.key === "Enter") {
        if (iconAutocompleteIndex >= 0) {
            event.preventDefault();
            selectIconFromAutocomplete(iconAutocompleteIndex);
        }
    } else if (event.key === "Escape") {
        hideIconAutocomplete();
    }
}

function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`; // Ensure previous types are cleared
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

function showLoading(message = "Elaborazione...") {
    loadingIndicator.querySelector("span").textContent = message;
    loadingIndicator.classList.add("show");
}
function hideLoading() {
    loadingIndicator.classList.remove("show");
}

function calcolaLineeTesto(nodo) {
    const charWidth = nodo.textSize * 0.6;
    while (true) {
        const maxCharsPerLine = Math.floor((nodo.size * 1.4 * 0.8) / charWidth);
        const words = (nodo.text || "").split(/\s+/);
        let line = "";
        const lines = [];
        for (let word of words) {
            if ((line + word).length > maxCharsPerLine && line) {
                lines.push(line.trim());
                line = word + " ";
            } else {
                line += word + " ";
            }
        }
        if (line.trim()) lines.push(line.trim());

        const lineHeight = nodo.textSize + 2;
        const gapCalc = Math.max(8, nodo.iconSize * 0.2);
        const textHeight = lineHeight * lines.length;
        const halfHeightNeeded = Math.max(nodo.iconSize, gapCalc + textHeight);
        const maxLineLength = Math.max(...lines.map(l => l.length), 0);
        const requiredWidth = (maxLineLength * charWidth) / 0.8;
        const requiredSize = Math.max(nodo.size, 2 * halfHeightNeeded + 10, requiredWidth / 1.4);

        if (requiredSize > nodo.size + 1) {
            nodo.size = requiredSize;
        } else {
            return { lines, lineHeight };
        }
    }
}

function saveToHistory() {
    const state = {
        nodes: JSON.parse(JSON.stringify(appState.nodes)), // Deep clone
        connections: JSON.parse(JSON.stringify(appState.connections.map(c => ({
            ...c,
            source: c.source.id, // Store only IDs for connections
            target: c.target.id
        })))),
        selectedNodeId: appState.selectedNode ? appState.selectedNode.id : null,
        selectedConnectionId: appState.selectedConnection ? appState.selectedConnection.id : null,
    };
    appState.history = appState.history.slice(0, appState.historyIndex + 1);
    appState.history.push(state);
    appState.historyIndex++;
    if (appState.history.length > 30) { // Limit history size
        appState.history.shift();
        appState.historyIndex--;
    }
    updateUndoRedoButtons();
}

function loadStateFromHistory(state) {
    appState.nodes = [];
    appState.connections = [];
    appState.connectionLabelCounts = {};
    nodesGroup.selectAll("*").remove();
    connectionsGroup.selectAll("*").remove();

    state.nodes.forEach(nodeData => {
        // Create node without adding to history or redrawing yet
        const nodo = { ...nodeData }; // Create a copy
        ensureNodeIconData(nodo);
        appState.nodes.push(nodo);
    });
    
    // Connections need to reference the newly created node objects
    state.connections.forEach(connData => {
        const sourceNode = appState.nodes.find(n => n.id === connData.source);
        const targetNode = appState.nodes.find(n => n.id === connData.target);
        if (sourceNode && targetNode) {
            const conn = { ...connData, source: sourceNode, target: targetNode };
            conn.labelSize = conn.labelSize || CONNECTION_LABEL_DEFAULT_SIZE;
            appState.connections.push(conn);
        }
    });
    
    // Restore selections
    appState.selectedNode = state.selectedNodeId ? appState.nodes.find(n => n.id === state.selectedNodeId) : null;
    appState.selectedConnection = state.selectedConnectionId ? appState.connections.find(c => c.id === state.selectedConnectionId) : null;

    redrawAll();
    if (appState.selectedNode) apriSidebarNodo();
    else if (appState.selectedConnection) apriSidebarConnessione();
    else chiudiSidebar();
    evidenziaSelezione();
    updateUndoRedoButtons();
}

function undo() {
    if (appState.historyIndex > 0) {
        appState.historyIndex--;
        loadStateFromHistory(appState.history[appState.historyIndex]);
        showToast("Annullato", "success", 1500);
    }
}

function redo() {
    if (appState.historyIndex < appState.history.length - 1) {
        appState.historyIndex++;
        loadStateFromHistory(appState.history[appState.historyIndex]);
        showToast("Ripristinato", "success", 1500);
    }
}

function updateUndoRedoButtons() {
    undoButton.disabled = appState.historyIndex <= 0;
    redoButton.disabled = appState.historyIndex >= appState.history.length - 1;
}


// === GESTIONE NODI ===
function creaNodo(x, y, testo = "Nuovo nodo", descr = "", parentId = null) {
    const now = new Date().toISOString();
    const defaultIcon = normalizeIconClass(CONFIG.icons[Math.floor(Math.random() * CONFIG.icons.length)] || "");
    const nodo = {
        id: uniqueId("node"),
        x, y,
        text: testo,
        description: descr,
        tags: [],
        category: "default",
        backgroundColor: CONFIG.colors.nodes[Math.floor(Math.random() * CONFIG.colors.nodes.length)],
        textColor: CONFIG.colors.text[0], // Default white
        iconColor: CONFIG.colors.icons[0],
        icon: defaultIcon,
        iconClass: defaultIcon,
        iconRenderMode: resolveRenderModeForClass(defaultIcon, "svg"),
        size: 90,
        textSize: 16,
        iconSize: 26, // Default icon size from old code
        shape: "rect",
        priority: "medium",
        sources: [],
        parentId,
        createdAt: now,
        updatedAt: now
    };
    
    ensureNodeIconData(nodo);
    appState.nodes.push(nodo);
    disegnaNodo(nodo);
    if (appState.autoSave !== false) saveToHistory(); // Allow disabling for batch ops
    updateMinimap();
    return nodo;
}

function rimuoviNodo(nodo) {
    if (!nodo) return;

    if (addChildArrowNodeId === nodo.id) {
        hideAddChildArrow();
    }

    const connectionsToRemove = appState.connections.filter(c => c.source.id === nodo.id || c.target.id === nodo.id);
    connectionsToRemove.forEach(conn => {
        d3.select("#" + conn.id).remove();
        defs.select(`#arrowhead-${conn.id}`).remove();
        defs.select(`#arrowhead-reverse-${conn.id}`).remove();
    });

    appState.connections = appState.connections.filter(c => c.source.id !== nodo.id && c.target.id !== nodo.id);
    updateConnectionLabelCounts();
    appState.nodes = appState.nodes.filter(n => n.id !== nodo.id);

    d3.select("#" + nodo.id).remove();
    
    if(appState.selectedNode && appState.selectedNode.id === nodo.id) {
        appState.selectedNode = null;
        chiudiSidebar();
    }
    
    aggiornaConnessioni(); // Redraw remaining connections
    saveToHistory();
    updateMinimap();
    showToast("Nodo eliminato", "success");
}

function disegnaNodo(nodo) {
    let g = nodesGroup.select("#" + nodo.id);
    if (!g.empty()) g.remove();

    g = nodesGroup.append("g")
        .attr("class", "node")
        .attr("id", nodo.id)
        .attr("transform", `translate(${nodo.x},${nodo.y})`)
        .style("cursor", "pointer")
        .on("dblclick", (event) => {
            event.stopPropagation();
            selezionaNodo(nodo);
            apriSidebarNodo();
            speakNode(nodo);
        })
        .on("click", (event) => {
            event.stopPropagation();
            if (appState.isConnecting && appState.connectingFrom && appState.connectingFrom.id !== nodo.id) {
                creaConnessione(appState.connectingFrom, nodo);
                appState.isConnecting = false;
                appState.connectingFrom = null;
                svgElem.style.cursor = "default";
                showToast("Connessione creata!", "success");
            } else {
                selezionaNodo(nodo);
                speakNode(nodo);
            }
        });

    ensureNodeIconData(nodo);

    // Apply dimming if search is active and node doesn't match
    if (appState.searchTerm && !nodoMatchesSearch(nodo, appState.searchTerm)) {
        g.classed("dimmed", true);
    } else {
        g.classed("dimmed", false);
    }
    
    // Drag behavior
    g.call(d3.drag()
        .on("start", function(event) {
            d3.select(this).raise(); // Bring to front
            if (appState.physics && appState.simulation) { 
                nodo.fx = nodo.x; nodo.fy = nodo.y; 
                appState.simulation.alphaTarget(0.2).restart(); 
            }
        })
        .on("drag", function(event) {
            nodo.x = event.x; nodo.y = event.y;
            nodo.updatedAt = new Date().toISOString();
            if (appState.physics && appState.simulation) { 
                nodo.fx = event.x; nodo.fy = event.y; 
            }
            d3.select(this).attr("transform", `translate(${nodo.x},${nodo.y})`);
            aggiornaConnessioni();
            updateMinimap(); // Update minimap during drag
        })
        .on("end", function(event) {
            if (appState.physics && appState.simulation) { 
                nodo.fx = null; nodo.fy = null; 
                appState.simulation.alphaTarget(0); 
            }
            saveToHistory(); // Save state after drag
        })
    );
    
    const { lines, lineHeight } = calcolaLineeTesto(nodo);

    // Baseline between icon and text
    const gap = Math.max(8, nodo.iconSize * 0.2);
    const baseline = 0;

    // SHAPE
    let shapeElement;
    const strokeColor = CONFIG.colors.priority[nodo.priority] || "#2c3e50";
    const strokeWidth = nodo.priority === "high" ? 3 : (nodo.priority === "medium" ? 2 : 1.5);

    if (nodo.shape === "circle") {
        shapeElement = g.append("circle").attr("r", nodo.size / 2);
    } else if (nodo.shape === "ellipse") {
        shapeElement = g.append("ellipse")
            .attr("rx", nodo.size * 0.75 / 2 * 1.2) // Wider ellipse
            .attr("ry", nodo.size / 2);
    } else if (nodo.shape === "hex") {
        let r = nodo.size / 2;
        let h = r * Math.sqrt(3) / 2;
        let points = [[-r,0], [-r/2,-h], [r/2,-h], [r,0], [r/2,h], [-r/2,h]]
            .map(p => [Math.round(p[0]), Math.round(p[1])]).map(p => p.join(",")).join(" ");
        shapeElement = g.append("polygon").attr("points", points);
    } else if (nodo.shape === "diamond") {
        let s = nodo.size / 2;
        let points = [[0, -s], [s*0.8, 0], [0, s], [-s*0.8, 0]] // Adjusted for a more standard diamond
             .map(p => [Math.round(p[0]), Math.round(p[1])]).map(p => p.join(",")).join(" ");
        shapeElement = g.append("polygon").attr("points", points);
    } else { // rect (default)
        shapeElement = g.append("rect")
            .attr("x", -nodo.size * 0.7)
            .attr("y", -nodo.size / 2)
            .attr("rx", 12) // More rounded
            .attr("ry", 12)
            .attr("width", nodo.size * 1.4)
            .attr("height", nodo.size);
    }
    shapeElement.attr("fill", nodo.backgroundColor)
                .attr("stroke", strokeColor)
                .attr("stroke-width", strokeWidth);

    // ICONA
    const shapeOffset = nodo.shape === 'circle' || nodo.shape === 'hex' ? 5 : 0;
    const iconBottom = baseline - shapeOffset;
    const iconMarkup = getNodeIconHTML(nodo);
    g.append("foreignObject")
        .attr("x", -nodo.iconSize / 2)
        .attr("y", iconBottom - nodo.iconSize)
        .attr("width", nodo.iconSize)
        .attr("height", nodo.iconSize)
        .style("pointer-events", "none")
        // SVG export remains vector-only for curated icons; webfont markup is ideal for PNG/PDF exports.
        .html(iconMarkup);

    // TESTO con wrapping automatico
    const textYOffset = baseline + gap + shapeOffset;
    const textElement = g.append("text")
        .attr("class", "node-text")
        .attr("font-size", nodo.textSize)
        .attr("text-anchor", "middle")
        .attr("fill", nodo.textColor)
        .style("pointer-events", "none");

    lines.forEach((ln, idx) => {
        textElement.append("tspan")
            .attr("x", 0)
            .attr("dy", idx === 0 ? textYOffset : lineHeight)
            .text(ln);
    });


    // CATEGORY INDICATOR (small dot)
    const categoryColor = CONFIG.colors.categories[nodo.category] || CONFIG.colors.categories.default;
    g.append("circle")
        .attr("class", "node-category-indicator-shape")
        .attr("cx", nodo.size * (nodo.shape === 'rect' ? 0.7 : 0.5) - 10) // Position based on shape
        .attr("cy", -nodo.size / 2 + 10)
        .attr("r", 6)
        .attr("fill", categoryColor)
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .style("pointer-events", "none");


    if (appState.selectedNode && appState.selectedNode.id === nodo.id) {
        g.classed("selected", true);
    }
}

function hideAddChildArrow() {
    if (addChildArrow) {
        addChildArrow.remove();
        addChildArrow = null;
        addChildArrowNodeId = null;
    }
}

function showAddChildArrow(nodo) {
    if (!nodo) return;

    const nodeGroup = nodesGroup.select("#" + nodo.id);
    if (nodeGroup.empty()) return;

    hideAddChildArrow();

    const baseOffset = nodo.shape === "rect" ? nodo.size * 0.7 : nodo.size / 2;
    const arrowDistance = Math.max(40, nodo.size * 0.6);
    const arrowRadius = Math.max(16, nodo.size * 0.25);
    const triangleWidth = arrowRadius * 1.1;
    const triangleHeight = arrowRadius * 0.9;

    addChildArrow = nodeGroup.append("g")
        .attr("class", "add-child-arrow")
        .attr("transform", `translate(${baseOffset + arrowDistance}, 0)`)
        .style("opacity", 0.75)
        .style("cursor", "pointer")
        .on("mousedown", (event) => {
            event.stopPropagation();
        })
        .on("click", (event) => {
            event.stopPropagation();
            event.preventDefault();

            const childDistance = Math.max(160, nodo.size * 1.8);
            const angleOffset = (Math.random() - 0.5) * Math.PI / 6;
            const childX = nodo.x + childDistance;
            const childY = nodo.y + Math.sin(angleOffset) * childDistance * 0.3;

            const nuovo = creaNodo(childX, childY, "Nuovo Figlio", "", nodo.id);
            creaConnessione(nodo, nuovo, "");
            selezionaNodo(nuovo);
            showToast("Nodo figlio aggiunto", "success");
        });

    addChildArrow.append("circle")
        .attr("r", arrowRadius)
        .attr("fill", "#3498db")
        .attr("fill-opacity", 0.25)
        .attr("stroke", "#3498db")
        .attr("stroke-width", 2);

    addChildArrow.append("path")
        .attr("d", `M${-triangleWidth / 2} ${-triangleHeight} L${triangleWidth / 2} 0 L${-triangleWidth / 2} ${triangleHeight} Z`)
        .attr("fill", "#3498db")
        .attr("fill-opacity", 0.85);

    addChildArrowNodeId = nodo.id;
}

function aggiornaNodo(nodo) {
    nodo.updatedAt = new Date().toISOString();
    disegnaNodo(nodo);
    aggiornaConnessioni(); // Connections might need to adjust if node size/shape changes
    updateMinimap();
    if (appState.selectedNode && appState.selectedNode.id === nodo.id) {
        showAddChildArrow(nodo);
    }
}

function selezionaNodo(nodo) {
    if (appState.isConnecting) return; // Don't select if in connection mode
    appState.selectedNode = nodo;
    appState.selectedConnection = null;
    evidenziaSelezione();
}


// === GESTIONE CONNESSIONI ===
function normalizeConnectionLabel(label) {
    return (label || "").trim().toLowerCase();
}

function updateConnectionLabelCounts() {
    const counts = {};
    appState.connections.forEach(conn => {
        if (!conn.label) return;
        const key = normalizeConnectionLabel(conn.label);
        if (!key) return;
        counts[key] = (counts[key] || 0) + 1;
    });
    appState.connectionLabelCounts = counts;
}

function formatConnectionLabel(conn) {
    if (!conn.label) return "";
    const key = normalizeConnectionLabel(conn.label);
    const duplicates = appState.connectionLabelCounts[key] || 0;
    if (duplicates <= 1) return conn.label;
    const source = conn.source && conn.source.text ? conn.source.text : "Nodo";
    const target = conn.target && conn.target.text ? conn.target.text : "Nodo";
    return `${conn.label} (tra ${source} e ${target})`;
}

function wrapConnectionLabel(textElement, labelText) {
    const maxChars = CONNECTION_LABEL_WRAP_LIMIT;
    const words = (labelText || "").trim().split(/\s+/);
    const lines = [];
    let currentLine = "";

    for (const word of words) {
        if (word.length > maxChars) {
            if (currentLine.trim()) {
                lines.push(currentLine.trim());
                currentLine = "";
            }
            word.match(new RegExp(`.{1,${maxChars}}`, "g")).forEach(chunk => lines.push(chunk));
            continue;
        }

        const prospective = currentLine ? `${currentLine.trim()} ${word}` : word;
        if (prospective.length > maxChars && currentLine.trim()) {
            lines.push(currentLine.trim());
            currentLine = `${word} `;
        } else {
            currentLine += `${word} `;
        }
    }

    if (currentLine.trim()) lines.push(currentLine.trim());
    if (!lines.length) lines.push(labelText || "");

    const x = textElement.attr("x");
    const y = textElement.attr("y");
    textElement.text("");

    lines.forEach((line, index) => {
        const tspan = textElement.append("tspan")
            .attr("x", x)
            .text(line);

        if (index === 0) {
            tspan.attr("y", y);
        } else {
            tspan.attr("dy", "1.2em");
        }
    });
}

function creaConnessione(sourceNode, targetNode, label = "") {
    if (!sourceNode || !targetNode || sourceNode.id === targetNode.id) {
      showToast("Impossibile connettere il nodo a se stesso o a un nodo non valido.", "error");
      return null;
    }
    // Check for existing connection (either direction)
    const existing = appState.connections.find(c =>
        (c.source.id === sourceNode.id && c.target.id === targetNode.id) ||
        (c.source.id === targetNode.id && c.target.id === sourceNode.id)
    );
    if (existing) {
        showToast("Connessione già esistente.", "error");
        return existing;
    }

    const conn = {
        id: uniqueId("conn"),
        source: sourceNode,
        target: targetNode,
        label,
        labelSize: CONNECTION_LABEL_DEFAULT_SIZE,
        color: CONFIG.colors.connections[Math.floor(Math.random() * CONFIG.colors.connections.length)],
        arrow: "forward",
        style: "solid" // solid, dashed, dotted
    };
    appState.connections.push(conn);
    updateConnectionLabelCounts();
    disegnaConnessione(conn);
    saveToHistory();
    updateMinimap();
    return conn;
}

function rimuoviConnessione(conn) {
    if (!conn) return;
    appState.connections = appState.connections.filter(c => c.id !== conn.id);
    d3.select("#" + conn.id).remove();
    defs.select(`#arrowhead-${conn.id}`).remove();
    defs.select(`#arrowhead-reverse-${conn.id}`).remove();
    if(appState.selectedConnection && appState.selectedConnection.id === conn.id) {
        appState.selectedConnection = null;
        chiudiSidebar();
    }
    updateConnectionLabelCounts();
    saveToHistory();
    updateMinimap();
    showToast("Connessione eliminata", "success");
}

function disegnaConnessione(conn) {
    if (typeof conn.source === "string") conn.source = appState.nodes.find(n => n.id === conn.source);
    if (typeof conn.target === "string") conn.target = appState.nodes.find(n => n.id === conn.target);
    if (!conn.source || !conn.target) return; // Nodes might have been deleted

    let g = connectionsGroup.select("#" + conn.id);
    if (!g.empty()) g.remove();

    // Remove existing markers for this connection if redrawing
    defs.select(`#arrowhead-${conn.id}`).remove();
    defs.select(`#arrowhead-reverse-${conn.id}`).remove();

    // Create dedicated arrow markers for this connection
    const markerForward = defs.append('marker')
        .attr('id', `arrowhead-${conn.id}`)
        .attr('markerWidth', 10)
        .attr('markerHeight', 7)
        .attr('refX', 9)
        .attr('refY', 3.5)
        .attr('orient', 'auto');
    markerForward.append('polygon')
        .attr('points', '0 0, 10 3.5, 0 7')
        .attr('fill', conn.color);

    const markerBackward = defs.append('marker')
        .attr('id', `arrowhead-reverse-${conn.id}`)
        .attr('markerWidth', 10)
        .attr('markerHeight', 7)
        .attr('refX', 1)
        .attr('refY', 3.5)
        .attr('orient', 'auto');
    markerBackward.append('polygon')
        .attr('points', '10 0, 0 3.5, 10 7')
        .attr('fill', conn.color);

    g = connectionsGroup.append("g")
        .attr("class", "connection-group")
        .attr("id", conn.id)
        .style("cursor", "pointer")
        .on("click", event => {
            event.stopPropagation();
            selezionaConnessione(conn);
        });

    const s = conn.source, t = conn.target;
    let sx = s.x, sy = s.y, tx = t.x, ty = t.y;
    
    // Calculate intersection points with node boundaries
    // This is a simplified approach; more accurate calculations depend heavily on exact shape geometry
    const dx = tx - sx, dy = ty - sy;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return; // Avoid division by zero if nodes are at the same spot

    // Approximate radius based on size and shape for arrow positioning
    const getEffectiveRadius = (node) => {
        if (node.shape === 'circle') return node.size / 2;
        if (node.shape === 'ellipse') return Math.min(node.size * 0.75 / 2 * 1.2, node.size / 2); // approx
        if (node.shape === 'hex' || node.shape === 'diamond') return node.size / 2 * 0.8; // approx
        return Math.min(node.size * 0.7, node.size / 2); // For rect
    };

    const r1 = getEffectiveRadius(s);
    const r2 = getEffectiveRadius(t);

    const p1x = sx + dx * r1 / len;
    const p1y = sy + dy * r1 / len;
    const p2x = tx - dx * r2 / len;
    const p2y = ty - dy * r2 / len;
    
    let markerEnd = "", markerStart = "";
    if (conn.arrow === "forward") markerEnd = `url(#arrowhead-${conn.id})`;
    if (conn.arrow === "backward") markerStart = `url(#arrowhead-reverse-${conn.id})`;
    if (conn.arrow === "both") {
        markerEnd = `url(#arrowhead-${conn.id})`;
        markerStart = `url(#arrowhead-reverse-${conn.id})`;
    }

    const line = g.append("line")
        .attr("class", "connection")
        .attr("x1", p1x).attr("y1", p1y)
        .attr("x2", p2x).attr("y2", p2y)
        .attr("stroke", conn.color)
        .attr("marker-end", markerEnd)
        .attr("marker-start", markerStart);
    
    // Style for dashed/dotted lines
    if (conn.style === "dashed") line.attr("stroke-dasharray", "8,4");
    else if (conn.style === "dotted") line.attr("stroke-dasharray", "2,3");

    if (conn.label) {
        const labelText = formatConnectionLabel(conn);
        if (labelText) {
            const mx = (p1x + p2x) / 2, my = (p1y + p2y) / 2;
            const labelElement = g.append("text")
                .attr("class", "connection-label")
                .attr("x", mx)
                .attr("y", my - 7)
                .attr("text-anchor", "middle")
                .style("font-size", (conn.labelSize || CONNECTION_LABEL_DEFAULT_SIZE) + "px");
            wrapConnectionLabel(labelElement, labelText);
        }
    }
    if (appState.selectedConnection && appState.selectedConnection.id === conn.id) {
        line.classed("selected", true);
    }
}

function aggiornaConnessioni() {
    updateConnectionLabelCounts();
    appState.connections.forEach(disegnaConnessione);
}

function selezionaConnessione(conn) {
    appState.selectedConnection = conn;
    appState.selectedNode = null;
    evidenziaSelezione();
    apriSidebarConnessione();
}

// === SELEZIONE GLOBALE ===
function evidenziaSelezione() {
    hideAddChildArrow();
    nodesGroup.selectAll(".node").classed("selected", false);
    connectionsGroup.selectAll(".connection").classed("selected", false); // Target line directly

    if (appState.selectedNode) {
        nodesGroup.select("#" + appState.selectedNode.id).classed("selected", true);
        showAddChildArrow(appState.selectedNode);
    }
    if (appState.selectedConnection) {
        const connGroup = connectionsGroup.select("#" + appState.selectedConnection.id);
        if (!connGroup.empty()) {
            connGroup.select(".connection").classed("selected", true);
        }
    }
}

function deselezionaTutto() {
    appState.selectedNode = null;
    appState.selectedConnection = null;
    evidenziaSelezione();
    chiudiSidebar();
}

// === PAN ZOOM SVG (mouse + touch) ===
let isPanning = false, panStart = [0, 0];
function updateViewBox(newViewBox) {
    appState.currentViewBox = newViewBox;
    svgElem.setAttribute("viewBox", newViewBox.join(" "));
    updateMinimapViewport();
}

svgElem.addEventListener("mousedown", function(event) {
    if (event.target === svgElem || event.target.closest("#connections-group") || event.target.closest("#nodes-group")) { // Allow pan on empty space or elements
        if (event.button === 0) { // Left mouse button
            isPanning = true;
            panStart = [event.clientX, event.clientY];
        }
    }
});
svgElem.addEventListener("mousemove", function(event) {
    if (isPanning) {
        const [currentX, currentY, currentW, currentH] = appState.currentViewBox;
        const dx = event.clientX - panStart[0];
        const dy = event.clientY - panStart[1];
        const newX = currentX - dx * (currentW / svgElem.clientWidth);
        const newY = currentY - dy * (currentH / svgElem.clientHeight);
        updateViewBox([newX, newY, currentW, currentH]);
        panStart = [event.clientX, event.clientY]; // Update panStart for continuous panning
    }
});
svgElem.addEventListener("mouseup", function() { if (isPanning) isPanning = false; });
svgElem.addEventListener("mouseleave", function() { if (isPanning) isPanning = false; });

svgElem.addEventListener("wheel", function(event) {
    event.preventDefault();
    let [x, y, w, h] = appState.currentViewBox;
    const zoomFactor = (event.deltaY < 0) ? 0.85 : 1.15; // Smoother zoom
    
    const mouseX = event.offsetX; // Mouse position relative to SVG element
    const mouseY = event.offsetY;

    // Convert mouse position to SVG coordinates
    const svgMouseX = x + mouseX * (w / svgElem.clientWidth);
    const svgMouseY = y + mouseY * (h / svgElem.clientHeight);

    // New width and height
    const newW = w * zoomFactor;
    const newH = h * zoomFactor;

    // Adjust x and y to zoom towards mouse pointer
    const newX = svgMouseX - (mouseX * (newW / svgElem.clientWidth));
    const newY = svgMouseY - (mouseY * (newH / svgElem.clientHeight));
    
    updateViewBox([newX, newY, newW, newH]);
});

// Touch pan/zoom (simplified - 1 finger pan, 2 finger zoom)
let lastTouch1 = null, lastTouch2 = null, initialPinchDistance = null;

svgElem.addEventListener("touchstart", function(event) {
    if (event.target === svgElem || event.target.closest("#connections-group") || event.target.closest("#nodes-group")) {
        if (event.touches.length === 1) {
            isPanning = true;
            lastTouch1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        } else if (event.touches.length === 2) {
            isPanning = false; // Stop panning if two fingers are down
            lastTouch1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            lastTouch2 = { x: event.touches[1].clientX, y: event.touches[1].clientY };
            initialPinchDistance = Math.hypot(lastTouch1.x - lastTouch2.x, lastTouch1.y - lastTouch2.y);
        }
    }
});

svgElem.addEventListener("touchmove", function(event) {
    event.preventDefault();
    if (isPanning && event.touches.length === 1 && lastTouch1) {
        const [currentX, currentY, currentW, currentH] = appState.currentViewBox;
        const dx = event.touches[0].clientX - lastTouch1.x;
        const dy = event.touches[0].clientY - lastTouch1.y;
        const newX = currentX - dx * (currentW / svgElem.clientWidth);
        const newY = currentY - dy * (currentH / svgElem.clientHeight);
        updateViewBox([newX, newY, currentW, currentH]);
        lastTouch1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    } else if (event.touches.length === 2 && lastTouch1 && lastTouch2 && initialPinchDistance) {
        const t1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        const t2 = { x: event.touches[1].clientX, y: event.touches[1].clientY };
        const currentPinchDistance = Math.hypot(t1.x - t2.x, t1.y - t2.y);
        const zoomFactor = initialPinchDistance / currentPinchDistance; // Inverse: smaller distance means zoom in
        
        let [x, y, w, h] = appState.currentViewBox;

        // Midpoint of pinch
        const midX = (t1.x + t2.x) / 2;
        const midY = (t1.y + t2.y) / 2;
        
        const svgMidX = x + midX * (w / svgElem.clientWidth);
        const svgMidY = y + midY * (h / svgElem.clientHeight);

        const newW = w * zoomFactor;
        const newH = h * zoomFactor;
        
        const newX = svgMidX - (midX * (newW / svgElem.clientWidth));
        const newY = svgMidY - (midY * (newH / svgElem.clientHeight));

        updateViewBox([newX, newY, newW, newH]);

        initialPinchDistance = currentPinchDistance; // Update for continuous zoom
        lastTouch1 = t1;
        lastTouch2 = t2;
    }
});

svgElem.addEventListener("touchend", function(event) {
    if (event.touches.length < 2) {
        initialPinchDistance = null;
        lastTouch2 = null;
    }
    if (event.touches.length < 1) {
        isPanning = false;
        lastTouch1 = null;
    }
});


// === TOOLBAR ACTIONS ===
document.getElementById("add-node").onclick = () => {
    const [vx, vy, vw, vh] = appState.currentViewBox;
    let x = vx + vw / 2, y = vy + vh / 2; // Center of current view
    let nuovo;
    if (appState.selectedNode) {
        x = appState.selectedNode.x + 120 * (Math.random() - 0.5) * 2; // Spread around selected
        y = appState.selectedNode.y + 100 * (Math.random() - 0.5) * 2;
        nuovo = creaNodo(x, y, "Nuovo Figlio", "", appState.selectedNode.id);
        creaConnessione(appState.selectedNode, nuovo, "");
    } else {
        nuovo = creaNodo(x, y);
    }
    selezionaNodo(nuovo);
};

document.getElementById("remove-node").onclick = () => {
    if (appState.selectedNode) {
        rimuoviNodo(appState.selectedNode);
        // selectedNode is cleared within rimuoviNodo if it was the one removed
    } else {
        showToast("Seleziona un nodo da eliminare.", "error");
    }
};

document.getElementById("add-connection").onclick = () => {
    if (appState.selectedNode) {
        appState.isConnecting = true;
        appState.connectingFrom = appState.selectedNode;
        svgElem.style.cursor = "crosshair";
        showToast("Seleziona il nodo di destinazione...", "success", 5000);
    } else {
        showToast("Seleziona un nodo di partenza per la connessione.", "error");
    }
};

// Click on SVG background to deselect or cancel connection
svgElem.addEventListener("click", function(event) {
    if (event.target === svgElem) { // Click on empty SVG area
        if (appState.isConnecting) {
            appState.isConnecting = false;
            appState.connectingFrom = null;
            svgElem.style.cursor = "default";
            showToast("Creazione connessione annullata.", "error");
        } else {
            deselezionaTutto();
        }
    }
});


document.getElementById("remove-connection").onclick = () => {
    if (appState.selectedConnection) {
        rimuoviConnessione(appState.selectedConnection);
    } else {
        showToast("Seleziona una connessione da eliminare.", "error");
    }
};

document.getElementById("layout-radial").onclick = () => { layoutRadialeMulti(); showToast("Layout Radiale Applicato"); };
document.getElementById("layout-grid").onclick = () => { layoutGriglia(); showToast("Layout Griglia Applicato"); };
document.getElementById("layout-physics").onclick = () => toggleFisica(); // Toast shown in function
document.getElementById("layout-hierarchy").onclick = () => { layoutGerarchico(); showToast("Layout Gerarchico Applicato"); };


document.getElementById("zoom-in").onclick = () => zoomSvg(0.8); // smaller factor for zoom in
document.getElementById("zoom-out").onclick = () => zoomSvg(1.2); // larger factor for zoom out

function zoomSvg(factor) {
    let [x, y, w, h] = appState.currentViewBox;
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    const newW = w * factor;
    const newH = h * factor;
    const newX = centerX - newW / 2;
    const newY = centerY - newH / 2;
    updateViewBox([newX, newY, newW, newH]);
}

document.getElementById("fit-screen").onclick = () => {
    if (appState.nodes.length === 0) {
        updateViewBox(CONFIG.defaultViewBox.split(" ").map(Number));
        return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    appState.nodes.forEach(n => {
        const nodeHalfWidth = (n.shape === 'rect' ? n.size * 0.7 : n.size / 2);
        const nodeHalfHeight = n.size / 2;
        minX = Math.min(minX, n.x - nodeHalfWidth);
        minY = Math.min(minY, n.y - nodeHalfHeight);
        maxX = Math.max(maxX, n.x + nodeHalfWidth);
        maxY = Math.max(maxY, n.y + nodeHalfHeight);
    });

    const padding = 100; // Add some padding around the content
    const contentWidth = maxX - minX + 2 * padding;
    const contentHeight = maxY - minY + 2 * padding;

    if (contentWidth <= 0 || contentHeight <= 0) { // No nodes or single point
        updateViewBox(CONFIG.defaultViewBox.split(" ").map(Number));
        return;
    }
    
    updateViewBox([minX - padding, minY - padding, contentWidth, contentHeight]);
};

document.getElementById("toggle-toolbar").onclick = () => {
    const bar = document.getElementById("toolbar");
    const icon = bar.querySelector("i");
    bar.classList.toggle("hide");
    if (bar.classList.contains("hide")) {
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
    } else {
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-up");
    }
};

// === SIDEBAR E FORM ===
document.getElementById("open-sidebar").onclick = () => {
    if (appState.selectedNode) apriSidebarNodo();
    else if (appState.selectedConnection) apriSidebarConnessione();
    else showToast("Seleziona un nodo o una connessione per modificarla.", "error");
};
// Ensure the close button reliably triggers the handler
document.getElementById("close-sidebar").addEventListener("click", () => chiudiSidebar(true));

function apriSidebarNodo() {
    sidebar.classList.add("open");
    nodeEditor.style.display = "";
    connEditor.style.display = "none";
    aggiornaEditorNodo();
}
function apriSidebarConnessione() {
    sidebar.classList.add("open");
    nodeEditor.style.display = "none";
    connEditor.style.display = "";
    aggiornaEditorConn();
}
function chiudiSidebar(clearSelection = false) {
    sidebar.classList.remove("open");
    nodeEditor.style.display = "none";
    connEditor.style.display = "none";

    if (clearSelection) {
        appState.selectedNode = null;
        appState.selectedConnection = null;
        evidenziaSelezione();
    }
}

function pickPreferredItalianVoice(voices) {
    if (!voices || !voices.length) return null;
    const italianVoices = voices.filter(v => (v.lang || "").toLowerCase().startsWith("it"));
    if (!italianVoices.length) return null;
    const onlineVoice = italianVoices.find(v => v.localService === false || /google|online|natural/i.test(`${v.name} ${v.voiceURI}`));
    return onlineVoice || italianVoices[0];
}

function refreshSpeechVoices() {
    if (!window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length) {
        availableSpeechVoices = voices;
        preferredItalianVoice = pickPreferredItalianVoice(voices);
    }
}

if (typeof window !== "undefined" && window.speechSynthesis) {
    refreshSpeechVoices();
    const synth = window.speechSynthesis;
    if (typeof synth.addEventListener === "function") {
        synth.addEventListener("voiceschanged", refreshSpeechVoices);
    } else {
        synth.onvoiceschanged = refreshSpeechVoices;
    }
}

function showSpeechOverlay(text) {
    if (!speechOverlay || !speechOverlayText) return;
    if (!text) {
        hideSpeechOverlay();
        return;
    }
    speechOverlayText.textContent = text;
    speechOverlay.classList.add("visible");
}

function hideSpeechOverlay() {
    if (!speechOverlay) return;
    speechOverlay.classList.remove("visible");
    if (speechOverlayText) speechOverlayText.textContent = "";
}

function cancelSpeechPlayback() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
        try {
            window.speechSynthesis.cancel();
        } catch (err) {
            console.warn("speechSynthesis cancel error", err);
        }
    }
    currentSpeechUtterance = null;
    hideSpeechOverlay();
}

function speakNode(nodo) {
    if (!window.speechSynthesis) return;
    if (!availableSpeechVoices.length || !preferredItalianVoice) {
        refreshSpeechVoices();
    }
    const pieces = [];
    if (nodo.text) pieces.push(nodo.text);
    if (nodo.description) pieces.push(nodo.description);
    const textToSpeak = pieces.join(". ").trim();
    if (!textToSpeak) {
        hideSpeechOverlay();
        return;
    }
    const utter = new SpeechSynthesisUtterance(textToSpeak);
    utter.lang = (preferredItalianVoice && preferredItalianVoice.lang) || "it-IT";
    if (preferredItalianVoice) {
        utter.voice = preferredItalianVoice;
    }
    utter.rate = 0.95;
    utter.pitch = 1;
    cancelSpeechPlayback();
    const descriptionText = (nodo.description || "").trim();
    if (descriptionText) {
        showSpeechOverlay(descriptionText);
    } else {
        hideSpeechOverlay();
    }
    currentSpeechUtterance = utter;
    utter.onend = () => {
        if (currentSpeechUtterance === utter) {
            currentSpeechUtterance = null;
            hideSpeechOverlay();
        }
    };
    utter.onerror = utter.onend;
    window.speechSynthesis.speak(utter);
}

function aggiornaEditorNodo() {
    const n = appState.selectedNode; if (!n) return;
    document.getElementById("node-text").value = n.text;
    document.getElementById("node-description").value = n.description;
    document.getElementById("node-tags").value = n.tags ? n.tags.join(", ") : "";
    document.getElementById("node-category").value = n.category || "default";
    document.getElementById("node-priority").value = n.priority || "medium";
    document.getElementById("node-size").value = n.size;
    document.getElementById("node-size-value").textContent = n.size + "px";
    document.getElementById("node-text-size").value = n.textSize;
    document.getElementById("node-text-size-value").textContent = n.textSize + "px";
    document.getElementById("node-icon-size").value = n.iconSize || 26;
    document.getElementById("node-icon-size-value").textContent = (n.iconSize || 26) + "px";
    document.getElementById("node-shape").value = n.shape || "rect";
    
    popolaColorPicker("node-bg-colors", CONFIG.colors.nodes, n.backgroundColor, (c) => { n.backgroundColor = c; aggiornaNodo(n); saveToHistory(); });
    popolaColorPicker("node-text-colors", CONFIG.colors.text, n.textColor, (c) => { n.textColor = c; aggiornaNodo(n); saveToHistory(); });
    popolaIconPicker("node-icon-picker", CONFIG.icons, getNodeIconSelection(n), (selection) => {
        applyNodeIconSelection(n, selection);
        aggiornaNodo(n);
        saveToHistory();
    });
    popolaColorPicker("node-icon-colors", CONFIG.colors.icons, n.iconColor || n.textColor, (c) => { n.iconColor = c; aggiornaNodo(n); saveToHistory(); });
    renderNodeSourcesList(n);
}

function aggiornaEditorConn() {
    const c = appState.selectedConnection; if (!c) return;
    document.getElementById("connection-label").value = c.label || "";
    document.getElementById("connection-arrow").value = c.arrow || "forward";
    document.getElementById("connection-style").value = c.style || "solid";
    document.getElementById("connection-label-size").value = c.labelSize || CONNECTION_LABEL_DEFAULT_SIZE;
    document.getElementById("connection-label-size-value").textContent = (c.labelSize || CONNECTION_LABEL_DEFAULT_SIZE) + "px";
    popolaColorPicker("connection-colors", CONFIG.colors.connections, c.color, (col) => { c.color = col; aggiornaConnessioni(); saveToHistory(); });
}

// Generic input handler for sidebar
function handleSidebarInput(elementId, nodeOrConnProperty, isNumeric = false, isArray = false, updateFunc, history = true) {
    document.getElementById(elementId).oninput = e => {
        const targetObject = appState.selectedNode || appState.selectedConnection;
        if (targetObject) {
            let value = e.target.value;
            if (isNumeric) value = Number(value);
            if (isArray) value = value.split(",").map(s => s.trim()).filter(s => s);
            
            targetObject[nodeOrConnProperty] = value;
            targetObject.updatedAt = new Date().toISOString();
            
            updateFunc(targetObject); // e.g., aggiornaNodo or aggiornaConnessioni
            if (history) saveToHistory();

            // For range sliders, update their display value
            const valueDisplayId = elementId + "-value";
            const valueDisplayElem = document.getElementById(valueDisplayId);
            if (valueDisplayElem) valueDisplayElem.textContent = value + "px";
        }
    };
}
// Node editor inputs
handleSidebarInput("node-text", "text", false, false, aggiornaNodo);
handleSidebarInput("node-description", "description", false, false, (n) => {}); // No visual update, just save state
handleSidebarInput("node-tags", "tags", false, true, aggiornaNodo);
handleSidebarInput("node-size", "size", true, false, aggiornaNodo);
handleSidebarInput("node-text-size", "textSize", true, false, aggiornaNodo);
handleSidebarInput("node-icon-size", "iconSize", true, false, aggiornaNodo);

// Special handling for selects as 'oninput' might not be ideal, 'onchange' is better.
document.getElementById("node-category").onchange = e => { if(appState.selectedNode) { appState.selectedNode.category = e.target.value; aggiornaNodo(appState.selectedNode); saveToHistory(); }};
document.getElementById("node-priority").onchange = e => { if(appState.selectedNode) { appState.selectedNode.priority = e.target.value; aggiornaNodo(appState.selectedNode); saveToHistory(); }};
document.getElementById("node-shape").onchange = e => { if(appState.selectedNode) { appState.selectedNode.shape = e.target.value; aggiornaNodo(appState.selectedNode); saveToHistory(); }};
document.getElementById("add-node-source").onclick = () => {
    if (!appState.selectedNode) return;
    const nodo = appState.selectedNode;
    if (!Array.isArray(nodo.sources)) nodo.sources = [];
    nodo.sources.push({ id: uniqueId("source"), label: "", url: "", icon: "" });
    nodo.updatedAt = new Date().toISOString();
    renderNodeSourcesList(nodo);
    saveToHistory();
};

// Connection editor inputs
handleSidebarInput("connection-label", "label", false, false, aggiornaConnessioni);
handleSidebarInput("connection-label-size", "labelSize", true, false, aggiornaConnessioni);
document.getElementById("connection-arrow").onchange = e => { if(appState.selectedConnection) { appState.selectedConnection.arrow = e.target.value; aggiornaConnessioni(); saveToHistory(); }};
document.getElementById("connection-style").onchange = e => { if(appState.selectedConnection) { appState.selectedConnection.style = e.target.value; aggiornaConnessioni(); saveToHistory(); }};


function popolaColorPicker(containerId, colors, selectedColor, callback) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    colors.forEach(color => {
        const option = document.createElement("div");
        option.className = "color-option";
        option.style.background = color;
        if (color === selectedColor) option.classList.add("selected");
        option.onclick = () => {
            callback(color);
            // Update selection state in picker
            Array.from(container.children).forEach(child => child.classList.remove("selected"));
            option.classList.add("selected");
        };
        container.appendChild(option);
    });
}

function popolaIconPicker(containerId, icons, selectedIconSelection, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    const previewColor = appState.isDarkTheme ? "#dfe6f0" : "#4a5b6b";
    const selectedClass = normalizeIconClass(selectedIconSelection && selectedIconSelection.className);
    let selectedMode = selectedIconSelection && selectedIconSelection.renderMode === "webfont" ? "webfont" : "svg";
    if (selectedMode === "svg" && selectedClass && !isCuratedIconClass(selectedClass)) {
        selectedMode = "webfont";
    }
    let hasSelectedIcon = false;

    icons.forEach(icon => {
        const normalizedIcon = normalizeIconClass(icon);
        const option = document.createElement("div");
        option.className = "icon-option";
        option.title = normalizedIcon;
        option.innerHTML = getIconSVG(normalizedIcon, 22, previewColor);
        if (normalizedIcon === selectedClass && selectedMode === "svg") {
            option.classList.add("selected");
            hasSelectedIcon = true;
        }
        option.onclick = () => {
            const selection = { className: normalizedIcon, renderMode: "svg" };
            callback(selection);
            popolaIconPicker(containerId, icons, selection, callback);
        };
        container.appendChild(option);
    });

    if (selectedClass && selectedMode === "svg" && !hasSelectedIcon && isCuratedIconClass(selectedClass)) {
        const customOption = document.createElement("div");
        customOption.className = "icon-option icon-option-custom selected";
        customOption.title = selectedClass;
        customOption.innerHTML = getIconSVG(selectedClass, 22, previewColor);
        customOption.onclick = () => {
            const selection = { className: selectedClass, renderMode: "svg" };
            callback(selection);
            popolaIconPicker(containerId, icons, selection, callback);
        };
        container.appendChild(customOption);
        hasSelectedIcon = true;
    }

    if (selectedClass && selectedMode === "webfont") {
        const customOption = document.createElement("div");
        customOption.className = "icon-option icon-option-custom selected";
        customOption.title = selectedClass;
        customOption.innerHTML = getIconPreviewMarkup(selectedClass, 22, previewColor, "webfont");
        customOption.onclick = () => {
            const selection = { className: selectedClass, renderMode: "webfont" };
            callback(selection);
            popolaIconPicker(containerId, icons, selection, callback);
        };
        container.appendChild(customOption);
        hasSelectedIcon = true;
    }

    const moreOption = document.createElement("div");
    moreOption.className = "icon-option icon-option-more";
    moreOption.innerHTML = `<i class="fas fa-ellipsis-h"></i><span>Altre icone</span>`;
    moreOption.onclick = () => {
        const currentSelection = { className: selectedClass, renderMode: selectedMode };
        apriIconModal(currentSelection, (iconSelezionata) => {
            const selection = iconSelezionata && iconSelezionata.className ? iconSelezionata : (() => {
                const normalizedSelection = normalizeIconClass(iconSelezionata);
                return {
                    className: normalizedSelection,
                    renderMode: resolveRenderModeForClass(normalizedSelection, selectedMode)
                };
            })();
            callback(selection);
            popolaIconPicker(containerId, icons, selection, callback);
        });
    };
    container.appendChild(moreOption);
}

function renderNodeSourcesList(nodo) {
    const container = document.getElementById("node-sources-list");
    if (!container || !nodo) return;

    if (!Array.isArray(nodo.sources)) nodo.sources = [];
    container.innerHTML = "";

    if (nodo.sources.length === 0) {
        const empty = document.createElement("div");
        empty.className = "source-empty";
        empty.textContent = "Nessuna fonte aggiunta.";
        container.appendChild(empty);
        return;
    }

    const commitChanges = () => {
        nodo.updatedAt = new Date().toISOString();
        saveToHistory();
    };

    const previewColor = appState.isDarkTheme ? "#dfe6f0" : "#3498db";

    nodo.sources.forEach(source => {
        if (!source.id) source.id = uniqueId("source");
        source.icon = sanitizeIconClass(source.icon);

        const item = document.createElement("div");
        item.className = "source-item";
        item.dataset.id = source.id;

        const preview = document.createElement("div");
        preview.className = "source-icon-preview";
        preview.innerHTML = getIconMarkupForSource(source.icon, 24, previewColor);
        item.appendChild(preview);

        const fields = document.createElement("div");
        fields.className = "source-fields";

        const labelInput = document.createElement("input");
        labelInput.type = "text";
        labelInput.placeholder = "Titolo o descrizione";
        labelInput.value = source.label || "";
        labelInput.addEventListener("input", () => {
            source.label = labelInput.value;
        });
        labelInput.addEventListener("change", () => {
            source.label = labelInput.value.trim();
            labelInput.value = source.label;
            commitChanges();
        });
        fields.appendChild(labelInput);

        const urlInput = document.createElement("input");
        urlInput.type = "text";
        urlInput.placeholder = "URL completo (https://...)";
        urlInput.value = source.url || "";
        urlInput.addEventListener("input", () => {
            source.url = urlInput.value.trim();
        });
        urlInput.addEventListener("change", () => {
            source.url = urlInput.value.trim();
            urlInput.value = source.url;
            commitChanges();
        });
        fields.appendChild(urlInput);

        const iconInput = document.createElement("input");
        iconInput.type = "text";
        iconInput.placeholder = "Classe Font Awesome (es. fas fa-book)";
        iconInput.value = source.icon || "";
        const iconDatalist = document.createElement("datalist");
        const datalistId = `icon-suggestions-${source.id}`;
        iconDatalist.id = datalistId;
        iconInput.setAttribute("list", datalistId);
        populateIconSuggestionDatalist(iconDatalist, iconInput.value);
        iconInput.addEventListener("input", () => {
            populateIconSuggestionDatalist(iconDatalist, iconInput.value);
            source.icon = sanitizeIconClass(iconInput.value);
            iconInput.value = source.icon;
            preview.innerHTML = getIconMarkupForSource(source.icon, 24, previewColor);
        });
        iconInput.addEventListener("change", () => {
            populateIconSuggestionDatalist(iconDatalist, iconInput.value);
            source.icon = sanitizeIconClass(iconInput.value);
            iconInput.value = source.icon;
            preview.innerHTML = getIconMarkupForSource(source.icon, 24, previewColor);
            commitChanges();
        });
        iconInput.addEventListener("focus", () => {
            populateIconSuggestionDatalist(iconDatalist, iconInput.value);
        });
        fields.appendChild(iconInput);
        fields.appendChild(iconDatalist);

        item.appendChild(fields);

        const actions = document.createElement("div");
        actions.className = "source-actions";

        const iconBtn = document.createElement("button");
        iconBtn.type = "button";
        iconBtn.className = "btn secondary small";
        iconBtn.title = "Scegli icona";
        iconBtn.innerHTML = "<i class=\"fas fa-icons\"></i>";
        iconBtn.onclick = () => {
            const currentSelection = { className: source.icon, renderMode: isCuratedIconClass(source.icon) ? "svg" : "webfont" };
            apriIconModal(currentSelection, (iconSelezionata) => {
                const className = iconSelezionata && iconSelezionata.className ? iconSelezionata.className : iconSelezionata;
                source.icon = sanitizeIconClass(className);
                iconInput.value = source.icon;
                populateIconSuggestionDatalist(iconDatalist, iconInput.value);
                preview.innerHTML = getIconMarkupForSource(source.icon, 24, previewColor);
                commitChanges();
            });
        };
        actions.appendChild(iconBtn);

        const applyNodeIconBtn = document.createElement("button");
        applyNodeIconBtn.type = "button";
        applyNodeIconBtn.className = "btn success small";
        applyNodeIconBtn.title = "Usa come icona del nodo";
        applyNodeIconBtn.innerHTML = "<i class=\"fas fa-check-circle\"></i>";
        applyNodeIconBtn.onclick = () => {
            const iconClass = sanitizeIconClass(iconInput.value || source.icon);
            if (!iconClass) {
                showToast("Inserisci una classe icona valida prima di assegnarla.", "error");
                return;
            }

            source.icon = iconClass;
            iconInput.value = source.icon;
            populateIconSuggestionDatalist(iconDatalist, iconInput.value);
            preview.innerHTML = getIconMarkupForSource(source.icon, 24, previewColor);

            applyNodeIconSelection(nodo, {
                className: iconClass,
                renderMode: isCuratedIconClass(iconClass) ? "svg" : "webfont"
            });
            aggiornaNodo(nodo);
            saveToHistory();
            aggiornaEditorNodo();
            showToast("Icona del nodo aggiornata dalla fonte.");
        };
        actions.appendChild(applyNodeIconBtn);

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "btn danger small";
        removeBtn.title = "Rimuovi fonte";
        removeBtn.innerHTML = "<i class=\"fas fa-trash\"></i>";
        removeBtn.onclick = () => {
            nodo.sources = nodo.sources.filter(s => s.id !== source.id);
            commitChanges();
            renderNodeSourcesList(nodo);
        };
        actions.appendChild(removeBtn);

        item.appendChild(actions);
        container.appendChild(item);
    });
}

function apriIconModal(selectedIcon, callback) {
    if (!iconModal || !iconModalList) return;
    iconModalOnSelect = callback;
    if (selectedIcon && typeof selectedIcon === "object") {
        iconModalCurrentIcon = normalizeIconClass(selectedIcon.className);
        iconModalCurrentRenderMode = resolveRenderModeForClass(iconModalCurrentIcon, selectedIcon.renderMode);
    } else {
        iconModalCurrentIcon = normalizeIconClass(selectedIcon);
        const fallbackMode = iconModalCurrentIcon && isCuratedIconClass(iconModalCurrentIcon) ? "svg" : "webfont";
        iconModalCurrentRenderMode = resolveRenderModeForClass(iconModalCurrentIcon, fallbackMode);
    }
    if (iconModalSearch) {
        iconModalSearch.value = "";
    }
    iconModal.style.display = "flex";
    iconModalList.scrollTop = 0;
    hideIconAutocomplete();
    renderIconModalList();
    if (iconModalSearch) {
        setTimeout(() => iconModalSearch.focus(), 50);
    }
}

function chiudiIconModal() {
    if (!iconModal) return;
    iconModal.style.display = "none";
    iconModalOnSelect = null;
    iconModalCurrentIcon = null;
    iconModalCurrentRenderMode = "svg";
    if (iconModalSearch) iconModalSearch.value = "";
    if (iconModalList) iconModalList.scrollTop = 0;
    hideIconAutocomplete();
    iconModalRenderToken++;
}

function isIconModalVisible() {
    if (!iconModal) return false;
    if (iconModal.style.display) {
        return iconModal.style.display !== "none";
    }
    if (typeof window !== "undefined" && window.getComputedStyle) {
        return window.getComputedStyle(iconModal).display !== "none";
    }
    return false;
}

function syncIconModalSearchValue(value) {
    if (!iconModalSearch) return;
    if (iconModalSearch.value === value) {
        return;
    }
    iconModalSearch.value = value;
    iconModalSearch.dispatchEvent(new Event("input", { bubbles: true }));
}

async function renderIconModalList() {
    if (!iconModalList) return;
    const requestToken = ++iconModalRenderToken;
    iconModalList.innerHTML = "";
    const filtro = (iconModalSearch && iconModalSearch.value ? iconModalSearch.value : "").toLowerCase();
    const filtroTrimmed = filtro.trim();
    const tokens = filtroTrimmed.split(/\s+/).filter(Boolean);

    const curatedMatches = getCuratedIconMatches(tokens);

    const previewColor = appState.isDarkTheme ? "#dfe6f0" : "#4a5b6b";
    const curatedFragment = document.createDocumentFragment();
    curatedMatches.forEach(icon => {
        const option = document.createElement("div");
        option.className = "icon-option";
        option.title = icon;
        option.innerHTML = getIconSVG(icon, 32, previewColor);
        const label = document.createElement("span");
        const libraries = getIconLibraries(icon);
        const librarySuffix = libraries.length > 0 ? ` (${libraries.join('/')})` : "";
        label.textContent = `${getIconLabel(icon)}${librarySuffix}`;
        option.appendChild(label);
        if (iconModalCurrentIcon === icon && iconModalCurrentRenderMode === "svg") {
            option.classList.add("selected");
        }
        option.onclick = () => {
            iconModalCurrentIcon = icon;
            iconModalCurrentRenderMode = "svg";
            if (iconModalOnSelect) iconModalOnSelect({ className: icon, renderMode: "svg" });
            chiudiIconModal();
        };
        curatedFragment.appendChild(option);
    });

    if (curatedMatches.length > 0) {
        iconModalList.appendChild(curatedFragment);
    }

    if (tokens.length === 0) {
        if (curatedMatches.length === 0) {
            const empty = document.createElement("div");
            empty.className = "icon-modal-empty";
            empty.textContent = "Nessuna icona trovata.";
            iconModalList.appendChild(empty);
        }
        return;
    }

    const loading = document.createElement("div");
    loading.className = "icon-modal-loading";
    loading.textContent = "Caricamento catalogo completo...";
    iconModalList.appendChild(loading);

    try {
        const catalog = await loadFullIconCatalog();
        if (requestToken !== iconModalRenderToken) return;
        const curatedSet = new Set(curatedMatches.map(icon => normalizeIconClass(icon)));
        const extraMatches = filterFullCatalogMatches(tokens).filter(entry => !curatedSet.has(entry.className));
        loading.remove();
        if (extraMatches.length > 0) {
            const fragment = document.createDocumentFragment();
            extraMatches.slice(0, 200).forEach(entry => {
                const option = document.createElement("div");
                option.className = "icon-option icon-option-webfont";
                option.title = entry.className;
                option.innerHTML = getIconPreviewMarkup(entry.className, 32, previewColor, "webfont");
                const label = document.createElement("span");
                label.textContent = entry.label;
                option.appendChild(label);
                if (iconModalCurrentIcon === entry.className && iconModalCurrentRenderMode === "webfont") {
                    option.classList.add("selected");
                }
                option.onclick = () => {
                    iconModalCurrentIcon = entry.className;
                    iconModalCurrentRenderMode = "webfont";
                    if (iconModalOnSelect) iconModalOnSelect({ className: entry.className, renderMode: "webfont" });
                    chiudiIconModal();
                };
                fragment.appendChild(option);
            });
            iconModalList.appendChild(fragment);
        }

        if (curatedMatches.length === 0 && extraMatches.length === 0) {
            const empty = document.createElement("div");
            empty.className = "icon-modal-empty";
            empty.textContent = "Nessuna icona trovata.";
            iconModalList.appendChild(empty);
        }
    } catch (error) {
        if (requestToken !== iconModalRenderToken) return;
        console.warn("Impossibile caricare il catalogo Font Awesome completo:", error);
        loading.textContent = "Impossibile caricare il catalogo completo delle icone.";
        if (curatedMatches.length === 0) {
            const empty = document.createElement("div");
            empty.className = "icon-modal-empty";
            empty.textContent = "Nessuna icona trovata nel set curato.";
            iconModalList.appendChild(empty);
        }
    }
}

if (iconModalCloseBtn) iconModalCloseBtn.addEventListener("click", chiudiIconModal);
if (iconModal) {
    iconModal.addEventListener("click", (event) => {
        if (event.target === iconModal) chiudiIconModal();
    });
}
if (iconModalSearch) {
    const handleIconModalInput = () => {
        renderIconModalList();
        updateIconAutocomplete();
    };
    iconModalSearch.addEventListener("input", handleIconModalInput);
    iconModalSearch.addEventListener("focus", () => updateIconAutocomplete());
    iconModalSearch.addEventListener("keydown", handleIconAutocompleteKeydown);
    iconModalSearch.addEventListener("blur", () => {
        setTimeout(() => {
            if (!iconModalAutocomplete) return;
            if (!iconModalAutocomplete.classList.contains("show")) return;
            if (iconModalAutocomplete.matches(":hover")) return;
            hideIconAutocomplete();
        }, 120);
    });
}

if (iconModalAutocomplete) {
    iconModalAutocomplete.addEventListener("mouseleave", () => {
        setIconAutocompleteActiveIndex(-1, false);
        if (!iconModalSearch || document.activeElement === iconModalSearch) return;
        hideIconAutocomplete();
    });
}

function openSidebarIconSearch(initialTerm = "") {
    if (!appState.selectedNode) {
        showToast("Seleziona un nodo per applicare un'icona.", "error");
        return;
    }

    const currentSelection = getNodeIconSelection(appState.selectedNode);
    apriIconModal(currentSelection, (selection) => {
        const targetNode = appState.selectedNode;
        if (!targetNode) return;
        applyNodeIconSelection(targetNode, selection);
        aggiornaNodo(targetNode);
        saveToHistory();
        aggiornaEditorNodo();
    });

    const searchTerm = (initialTerm || "").trim();
    if (iconModalSearch && searchTerm) {
        iconModalSearch.value = searchTerm;
        iconModalSearch.dispatchEvent(new Event("input", { bubbles: true }));
    }
}

if (sidebarIconSearchButton) {
    sidebarIconSearchButton.addEventListener("click", () => {
        const term = sidebarIconSearchInput ? sidebarIconSearchInput.value : "";
        openSidebarIconSearch(term);
    });
}

if (sidebarIconSearchInput) {
    sidebarIconSearchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            openSidebarIconSearch(sidebarIconSearchInput.value);
        }
    });

    sidebarIconSearchInput.addEventListener("input", () => {
        const rawValue = sidebarIconSearchInput.value || "";
        const hasSearchTerm = rawValue.trim().length > 0;

        if (!hasSearchTerm) {
            if (isIconModalVisible()) {
                syncIconModalSearchValue("");
            }
            return;
        }

        if (!appState.selectedNode) {
            return;
        }

        if (isIconModalVisible()) {
            syncIconModalSearchValue(rawValue);
        } else {
            openSidebarIconSearch(rawValue);
        }
    });
}

// === DESCRIZIONE NODO (overlay) ===
function apriDescrizioneNodo(nodo) {
    const overlay = document.getElementById("overlay-desc");
    const box = document.getElementById("overlay-desc-box");
    const iconColor = appState.isDarkTheme ? "#dfe6f0" : "#3498db";
    let sourcesHtml = "";
    if (Array.isArray(nodo.sources) && nodo.sources.length > 0) {
        const items = nodo.sources.map(src => {
            const iconMarkup = getIconMarkupForSource(src.icon, 18, iconColor);
            const label = escapeHtml(src.label || src.url || "Fonte");
            const url = src.url && isSafeExternalUrl(src.url) ? src.url.trim() : "";
            const link = url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${label}</a>` : `<span>${label}</span>`;
            return `<li><span class="overlay-source-icon">${iconMarkup}</span><span class="overlay-source-text">${link}</span></li>`;
        }).join("");
        sourcesHtml = `<div class="overlay-sources"><h4>Fonti</h4><ul class="overlay-source-list">${items}</ul></div>`;
    }
    box.innerHTML = `<h3>${nodo.text || "Nodo"}</h3>
                     <div style="font-size:1.0em;white-space:pre-line;color:${appState.isDarkTheme ? '#ddd' : '#333'};margin-top:10px;">
                         ${nodo.description || "<i>Nessuna descrizione.</i>"}
                     </div>
                     ${sourcesHtml}
                     <hr style="border:0; border-top:1px solid ${appState.isDarkTheme ? '#555' : '#ddd'}; margin: 15px 0;">
                     <small style="color:${appState.isDarkTheme ? '#aaa' : '#777'};">
                        Tags: ${nodo.tags && nodo.tags.length > 0 ? nodo.tags.join(', ') : 'N/A'}<br>
                        Categoria: ${nodo.category || 'N/A'}<br>
                        Priorità: ${nodo.priority || 'N/A'}<br>
                        Creato: ${new Date(nodo.createdAt).toLocaleString()}<br>
                        Aggiornato: ${new Date(nodo.updatedAt).toLocaleString()}
                     </small>`;
    overlay.style.display = "flex";
    overlay.focus(); // For Esc key
    speakNode(nodo);
    
    // No auto-close. User closes with Esc or click.
    // if (nodo.description && window.speechSynthesis) {
    //     const utter = new SpeechSynthesisUtterance(nodo.description);
    //     utter.lang = "it-IT";
    //     window.speechSynthesis.cancel();
    //     window.speechSynthesis.speak(utter);
    // }
}
document.getElementById("overlay-desc").onclick = function(e) {
    if (e.target === this) { // Only close if background is clicked
        this.style.display = "none";
        cancelSpeechPlayback();
    }
};
document.getElementById("overlay-desc").onkeydown = function(e) {
    if (e.key === "Escape") {
        this.style.display = "none";
        cancelSpeechPlayback();
    }
};


// === EXPORT / IMPORT ===
document.getElementById("export-png").onclick = exportPNG;
document.getElementById("export-pdf").onclick = exportPDF;

function exportPNG() {
    showLoading("Esportazione PNG...");
    // Temporarily ensure all nodes are visible for export
    const currentSearchTerm = appState.searchTerm;
    appState.searchTerm = "";
    redrawAllNodes(); // Redraw without dimming

    html2canvas(document.getElementById("mindmap-container"), { 
        backgroundColor: appState.isDarkTheme ? "#2c3e50" : "#f6f6fa", // Match theme
        useCORS: true,
        logging: false,
        onclone: (doc) => { // Ensure SVGs are properly rendered in the clone
            const svgElements = doc.querySelectorAll('#mindmap-svg svg');
            svgElements.forEach(s => {
                s.setAttribute('width', s.getBBox().width);
                s.setAttribute('height', s.getBBox().height);
            });
        }
    }).then(canvas => {
        const dataUrl = canvas.toDataURL("image/png");
        document.getElementById("preview-img").src = dataUrl;
        const preview = document.getElementById("print-preview");
        preview.style.display = "flex";
        hideLoading();
        appState.searchTerm = currentSearchTerm; // Restore search
        redrawAllNodes();
        if (confirm("Scaricare l'immagine PNG?")) {
            canvas.toBlob(blob => downloadFile(blob, "mappa-mentale.png", "image/png"));
        }
        preview.style.display = "none";
    }).catch(err => {
        console.error("Errore esportazione PNG:", err);
        showToast("Errore esportazione PNG.", "error");
        hideLoading();
        appState.searchTerm = currentSearchTerm; // Restore search
        redrawAllNodes(); // Redraw with search term
    });
}

function exportPDF() {
    showLoading("Esportazione PDF...");
    const currentSearchTerm = appState.searchTerm;
    appState.searchTerm = "";
    redrawAllNodes();

    html2canvas(document.getElementById("mindmap-container"), { 
        backgroundColor: appState.isDarkTheme ? "#2c3e50" : "#f6f6fa",
        useCORS: true,
        logging: false,
         onclone: (doc) => {
            const svgElements = doc.querySelectorAll('#mindmap-svg svg');
            svgElements.forEach(s => {
                s.setAttribute('width', s.getBBox().width);
                s.setAttribute('height', s.getBBox().height);
            });
        }
    }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        document.getElementById("preview-img").src = imgData;
        const preview = document.getElementById("print-preview");
        preview.style.display = "flex";
        hideLoading();
        appState.searchTerm = currentSearchTerm;
        redrawAllNodes();
        if (confirm("Scaricare il PDF?")) {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? "landscape" : "portrait",
                unit: "px",
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
            pdf.save("mappa-mentale.pdf");
        }
        preview.style.display = "none";
    }).catch(err => {
        console.error("Errore esportazione PDF:", err);
        showToast("Errore esportazione PDF.", "error");
        hideLoading();
        appState.searchTerm = currentSearchTerm;
        redrawAllNodes();
    });
}

document.getElementById("open-json-modal").onclick = () => {
    document.getElementById("json-modal").style.display = "flex";
    document.getElementById("json-area").value = JSON.stringify(salvaMappaFormat(), null, 2);
};
document.getElementById("btn-export-json").onclick = () => {
    const jsonData = JSON.stringify(salvaMappaFormat(), null, 2);
    document.getElementById("json-area").value = jsonData;
    downloadFile(jsonData, "mappa-mentale.json", "application/json");
    showToast("JSON esportato e scaricato!");
};
document.getElementById("btn-import-json").onclick = () => {
    let val = document.getElementById("json-area").value;
    try {
        let data = JSON.parse(val);
        caricaMappa(data);
        showToast("Mappa importata con successo!");
        document.getElementById("json-modal").style.display = "none";
        saveToHistory(); // Initial state for imported map
    } catch (e) {
        console.error("JSON Import Error:", e);
        showToast("Errore: JSON non valido o formato mappa non corretto.", "error");
    }
};
document.getElementById("btn-close-json").onclick = () => {
    document.getElementById("json-modal").style.display = "none";
};
document.getElementById("close-preview").onclick = () => {
    document.getElementById("print-preview").style.display = "none";
    cancelSpeechPlayback();
};

function salvaMappaFormat() {
    return {
        nodes: appState.nodes.map(n => ({ ...n })), // Clone node objects
        connections: appState.connections.map(c => ({
            ...c,
            source: c.source.id, // Store only IDs
            target: c.target.id
        })),
        viewBox: appState.currentViewBox.join(" "),
        theme: appState.isDarkTheme ? 'dark' : 'light'
    };
}

function downloadFile(data, filename, mime) {
    const blob = new Blob([data], { type: mime });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function esportaPaginaHtmlConMappa() {
    try {
        const mapData = salvaMappaFormat();
        const htmlContent = generaPaginaHtmlConMappa(mapData);
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        downloadFile(htmlContent, `MAP-GENERATOR-${timestamp}.html`, "text/html");
        showToast("Pagina HTML esportata con successo!", "success");
    } catch (error) {
        console.error("Errore durante l'esportazione della pagina HTML:", error);
        showToast("Errore durante l'esportazione della pagina HTML.", "error");
    }
}

function generaPaginaHtmlConMappa(mapData) {
    if (!mapData) throw new Error("Dati mappa non disponibili");
    const parser = new DOMParser();
    const serializedDom = document.documentElement.outerHTML;
    const tempDoc = parser.parseFromString(serializedDom, "text/html");
    if (!tempDoc || !tempDoc.documentElement || !tempDoc.body) {
        throw new Error("Impossibile creare un documento HTML temporaneo");
    }

    const existingScript = tempDoc.getElementById("embedded-map-data");
    if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
    }

    const scriptEl = tempDoc.createElement("script");
    scriptEl.id = "embedded-map-data";
    scriptEl.setAttribute("data-embedded-map", "true");
    const safeData = JSON.stringify(mapData).replace(/</g, "\\u003C");
    const timestamp = new Date().toISOString();
    scriptEl.textContent = `window.__EMBEDDED_MAP_DATA__ = ${safeData};\nwindow.__EMBEDDED_MAP_EXPORT_TIME__ = "${timestamp}";`;
    tempDoc.body.appendChild(scriptEl);

    const serializer = new XMLSerializer();
    return "<!DOCTYPE html>\n" + serializer.serializeToString(tempDoc.documentElement);
}

function caricaMappa(data) {
    // Clear existing map
    appState.nodes = [];
    appState.connections = [];
    appState.connectionLabelCounts = {};
    nodesGroup.selectAll("*").remove();
    connectionsGroup.selectAll("*").remove();
    appState.selectedNode = null;
    appState.selectedConnection = null;
    chiudiSidebar();

    // Load nodes
    data.nodes.forEach(nodeData => {
        const newNode = { ...nodeData }; // Create new object from data
        // Ensure defaults for any missing properties from older formats
        newNode.tags = newNode.tags || [];
        newNode.category = newNode.category || "default";
        newNode.priority = newNode.priority || "medium";
        newNode.iconSize = newNode.iconSize || 26;
        newNode.iconColor = newNode.iconColor || newNode.textColor || CONFIG.colors.icons[0];
        newNode.createdAt = newNode.createdAt || new Date().toISOString();
        newNode.updatedAt = newNode.updatedAt || new Date().toISOString();
        newNode.sources = Array.isArray(newNode.sources) ? newNode.sources.map(src => ({
            id: src.id || uniqueId("source"),
            label: src.label ? String(src.label) : "",
            url: src.url ? String(src.url).trim() : "",
            icon: sanitizeIconClass(src.icon)
        })) : [];
        ensureNodeIconData(newNode);
        appState.nodes.push(newNode);
    });

    // Load connections (must be done after all nodes are in appState.nodes)
    if (data.connections) {
        data.connections.forEach(connData => {
            const sourceNode = appState.nodes.find(n => n.id === connData.source);
            const targetNode = appState.nodes.find(n => n.id === connData.target);
            if (sourceNode && targetNode) {
                const newConn = { ...connData, source: sourceNode, target: targetNode };
                newConn.style = newConn.style || "solid";
                newConn.labelSize = newConn.labelSize || CONNECTION_LABEL_DEFAULT_SIZE;
                appState.connections.push(newConn);
            } else {
                console.warn("Impossibile trovare nodi per la connessione:", connData);
            }
        });
    }

    updateConnectionLabelCounts();
    
    if (data.viewBox) {
        updateViewBox(data.viewBox.split(" ").map(Number));
    } else {
        document.getElementById("fit-screen").click(); // Fit to content if no viewBox
    }

    if (data.theme === 'dark' && !appState.isDarkTheme) {
        toggleTheme();
    } else if (data.theme === 'light' && appState.isDarkTheme) {
        toggleTheme();
    }

    redrawAll();
    appState.history = []; // Clear history for new map
    appState.historyIndex = -1;
    saveToHistory(); // Save initial state of loaded map
}

function redrawAll() {
    nodesGroup.selectAll("*").remove();
    connectionsGroup.selectAll("*").remove();
    appState.nodes.forEach(disegnaNodo);
    updateConnectionLabelCounts();
    appState.connections.forEach(disegnaConnessione);
    updateMinimap();
}
function redrawAllNodes() {
    nodesGroup.selectAll("*").remove();
    appState.nodes.forEach(disegnaNodo);
    updateMinimapNodes(); // Only update nodes in minimap
}


// === LOCAL STORAGE ===
const saveMapBtn = document.getElementById("save-map");
if (saveMapBtn) {
    saveMapBtn.onclick = () => {
        salvaMappaLocale();
        showToast("Mappa salvata localmente!", "success");
    };
}

const saveHtmlBtn = document.getElementById("save-html");
if (saveHtmlBtn) {
    saveHtmlBtn.onclick = () => {
        esportaPaginaHtmlConMappa();
    };
}

function salvaMappaLocale() {
    try {
        const mapData = salvaMappaFormat();
        localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(mapData));
    } catch (e) {
        console.error("Errore salvataggio locale:", e);
        showToast("Errore durante il salvataggio locale. Spazio esaurito?", "error");
    }
}

function caricaMappaLocale() {
    const savedData = localStorage.getItem(CONFIG.localStorageKey);
    if (savedData) {
        try {
            const mapData = JSON.parse(savedData);
            caricaMappa(mapData);
            showToast("Mappa caricata dal salvataggio locale.", "success");
        } catch (e) {
            console.error("Errore caricamento mappa locale:", e);
            showToast("Errore nel caricare la mappa salvata.", "error");
            localStorage.removeItem(CONFIG.localStorageKey); // Remove corrupted data
            initDefaultMap(); // Load default if corrupted
        }
    } else {
        initDefaultMap(); // Load default if no saved data
    }
}

// === LAYOUTS ===
function layoutRadialeMulti() {
    if (appState.nodes.length === 0) return;
    appState.autoSave = false; // Disable history saving for batch updates

    const roots = appState.nodes.filter(n => !n.parentId || !appState.nodes.find(p => p.id === n.parentId));
    const childrenMap = new Map();
    appState.nodes.forEach(n => {
        if (n.parentId) {
            if (!childrenMap.has(n.parentId)) childrenMap.set(n.parentId, []);
            childrenMap.get(n.parentId).push(n);
        }
    });

    const [ centerX, centerY ] = [appState.currentViewBox[0] + appState.currentViewBox[2]/2, appState.currentViewBox[1] + appState.currentViewBox[3]/2];
    
    // Position roots in a circle
    const numRoots = roots.length;
    const rootRadius = numRoots > 1 ? Math.min(appState.currentViewBox[2], appState.currentViewBox[3]) / 4 : 0;
    roots.forEach((root, i) => {
        root.x = centerX + rootRadius * Math.cos(2 * Math.PI * i / numRoots);
        root.y = centerY + rootRadius * Math.sin(2 * Math.PI * i / numRoots);
    });

    function arrangeChildren(parent, level = 1) {
        const children = childrenMap.get(parent.id) || [];
        if (children.length === 0) return;

        const radius = Math.max(100, parent.size * 1.2) + level * 30; // Dynamic radius
        const angleStep = (2 * Math.PI) / children.length;
        let startAngle = -Math.PI / 2; // Start at the top

        // Avoid overlap with parent's parent if possible
        if (parent.parentId) {
            const grandparent = appState.nodes.find(n => n.id === parent.parentId);
            if (grandparent) {
                const angleToGrandparent = Math.atan2(grandparent.y - parent.y, grandparent.x - parent.x);
                startAngle = angleToGrandparent + Math.PI/2 + angleStep/2; // Try to place first child away from grandparent
            }
        }

        children.forEach((child, i) => {
            const angle = startAngle + i * angleStep;
            child.x = parent.x + radius * Math.cos(angle);
            child.y = parent.y + radius * Math.sin(angle);
            arrangeChildren(child, level + 1);
        });
    }

    roots.forEach(root => arrangeChildren(root));
    
    appState.nodes.forEach(n => aggiornaNodo(n)); // This calls redrawAll many times, not ideal
    redrawAll(); // Single redraw after all positions are set
    saveToHistory();
    appState.autoSave = true;
}

function layoutGriglia() {
    if (appState.nodes.length === 0) return;
    appState.autoSave = false;
    const padding = 30;
    const nodeWidthEstimate = 150 + padding; 
    const nodeHeightEstimate = 100 + padding;
    const cols = Math.max(1, Math.floor(appState.currentViewBox[2] / nodeWidthEstimate));
    
    const startX = appState.currentViewBox[0] + nodeWidthEstimate / 2;
    const startY = appState.currentViewBox[1] + nodeHeightEstimate / 2;

    appState.nodes.forEach((node, i) => {
        node.x = startX + (i % cols) * nodeWidthEstimate;
        node.y = startY + Math.floor(i / cols) * nodeHeightEstimate;
    });
    redrawAll();
    saveToHistory();
    appState.autoSave = true;
}

function layoutGerarchico() {
    if (appState.nodes.length === 0) return;
    appState.autoSave = false;

    const roots = appState.nodes.filter(n => !n.parentId || !appState.nodes.find(p => p.id === n.parentId));
    if (roots.length === 0 && appState.nodes.length > 0) { // No explicit roots, pick one
      roots.push(appState.nodes[0]); 
    }
    if (roots.length === 0) {
      showToast("Nessun nodo radice per il layout gerarchico.", "error");
      appState.autoSave = true;
      return;
    }

    // Build a hierarchical structure for D3
    const buildHierarchy = (nodeId) => {
        const node = appState.nodes.find(n => n.id === nodeId);
        if (!node) return null;
        const children = appState.nodes.filter(n => n.parentId === nodeId).map(child => buildHierarchy(child.id));
        return { ...node, children: children.filter(c => c !== null) }; // Pass actual node data
    };
    
    const hierarchicalDataRoots = roots.map(r => buildHierarchy(r.id)).filter(hr => hr);
    if(hierarchicalDataRoots.length === 0) {
        showToast("Errore nella costruzione della gerarchia.", "error");
        appState.autoSave = true;
        return;
    }

    const treeLayout = d3.tree()
        .nodeSize([150, 250]) // [height between levels, width between siblings]
        .separation((a, b) => a.parent === b.parent ? 1.2 : 1.5); // More separation for non-siblings

    let totalMaxY = 0; // Keep track of overall Y to offset multiple trees

    hierarchicalDataRoots.forEach(dataRoot => {
        const rootD3 = d3.hierarchy(dataRoot, d => d.children);
        treeLayout(rootD3);
        
        // Center the tree layout relative to viewport or previous tree
        const nodesD3 = rootD3.descendants();
        if (nodesD3.length === 0) return;

        let minX = Infinity, maxX = -Infinity;
        nodesD3.forEach(d => {
            minX = Math.min(minX, d.x);
            maxX = Math.max(maxX, d.x);
        });
        
        const treeWidth = maxX - minX;
        const offsetX = appState.currentViewBox[0] + appState.currentViewBox[2]/2 - (minX + treeWidth / 2);
        const offsetY = totalMaxY + appState.currentViewBox[1] + 100; // Start below previous tree
        
        let currentTreeMaxY = 0;
        nodesD3.forEach(d => {
            const appNode = appState.nodes.find(n => n.id === d.data.id);
            if (appNode) {
                appNode.x = d.x + offsetX; // d.x is vertical in D3 tree, d.y is horizontal
                appNode.y = d.y + offsetY;
                currentTreeMaxY = Math.max(currentTreeMaxY, appNode.y + appNode.size);
            }
        });
        totalMaxY = currentTreeMaxY + 100; // Add padding for next tree
    });

    redrawAll();
    document.getElementById("fit-screen").click(); // Fit screen after layout
    saveToHistory();
    appState.autoSave = true;
}


function toggleFisica() {
    let btn = document.getElementById("layout-physics");
    if (!appState.physics) {
        appState.physics = true;
        btn.classList.add("active");
        btn.innerHTML = '<i class="fas fa-globe"></i> Fisica (On)';
        
        const links = appState.connections.map(c => ({ source: c.source.id, target: c.target.id, strength: 0.05 + Math.random()*0.1 })); // Add some variability
        
        appState.simulation = d3.forceSimulation(appState.nodes)
            .force("charge", d3.forceManyBody().strength(-500 - Math.random()*200)) // Stronger, varied repulsion
            .force("center", d3.forceCenter(appState.currentViewBox[0] + appState.currentViewBox[2]/2, appState.currentViewBox[1] + appState.currentViewBox[3]/2).strength(0.1))
            .force("collision", d3.forceCollide().radius(d => d.size * 0.8).strength(0.7)) // Adjusted collision
            .force("link", d3.forceLink(links).id(d => d.id).distance(d => (d.source.size + d.target.size) * 0.8 + 50).strength(link => link.strength) )
            .on("tick", () => {
                // Bound nodes to viewport (optional, can be jittery)
                /*
                const [vx, vy, vw, vh] = appState.currentViewBox;
                appState.nodes.forEach(n => {
                    n.x = Math.max(n.size/2 + vx, Math.min(vx + vw - n.size/2, n.x));
                    n.y = Math.max(n.size/2 + vy, Math.min(vy + vh - n.size/2, n.y));
                });
                */
                appState.nodes.forEach(n => disegnaNodo(n)); // More efficient to update transform directly
                aggiornaConnessioni();
                updateMinimap();
            })
            .on("end", () => {
                if (appState.physics) { // Only save if physics is still on (not stopped manually)
                    saveToHistory(); // Save final positions
                }
            });
        showToast("Simulazione Fisica Attivata!", "success");
    } else {
        appState.physics = false;
        btn.classList.remove("active");
        btn.innerHTML = '<i class="fas fa-globe"></i> Fisica';
        if (appState.simulation) {
            appState.simulation.stop();
            appState.simulation = null;
            // Ensure fx and fy are cleared so nodes are not fixed
            appState.nodes.forEach(n => { n.fx = null; n.fy = null; });
            saveToHistory(); // Save current positions after stopping
        }
        showToast("Simulazione Fisica Disattivata.", "success");
    }
}

// === THEME TOGGLE ===
document.getElementById("theme-toggle").onclick = toggleTheme;

function toggleTheme() {
    appState.isDarkTheme = !appState.isDarkTheme;
    document.body.classList.toggle("dark-theme", appState.isDarkTheme);
    localStorage.setItem("mindMapTheme", appState.isDarkTheme ? "dark" : "light");
    
    // Update pickers with theme-dependent previews
    if (appState.selectedNode) { // If sidebar is open and showing icons
        popolaIconPicker("node-icon-picker", CONFIG.icons, getNodeIconSelection(appState.selectedNode), (selection) => {
            applyNodeIconSelection(appState.selectedNode, selection);
            aggiornaNodo(appState.selectedNode);
            saveToHistory();
        });
        popolaColorPicker("node-icon-colors", CONFIG.colors.icons, appState.selectedNode.iconColor || appState.selectedNode.textColor, (c) => { appState.selectedNode.iconColor = c; aggiornaNodo(appState.selectedNode); saveToHistory(); });
        renderNodeSourcesList(appState.selectedNode);
    }
    if (iconModal && iconModal.style.display === "flex") {
        renderIconModalList();
    }
    redrawAll(); // Redraw for theme-dependent colors in nodes/connections
    showToast(`Tema ${appState.isDarkTheme ? "Scuro" : "Chiaro"} attivato`, "success");
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem("mindMapTheme");
    if (savedTheme === "dark") {
        appState.isDarkTheme = true;
        document.body.classList.add("dark-theme");
    } else {
        appState.isDarkTheme = false;
        document.body.classList.remove("dark-theme");
    }
}

// === KEYBOARD SHORTCUTS ===
document.addEventListener("keydown", (event) => {
    if (event.target === iconModalSearch) {
        if (event.key === "Escape") {
            event.preventDefault();
            chiudiIconModal();
        }
        return;
    }
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        if (event.key === "Escape") event.target.blur(); // Allow Esc to unfocus inputs
        return; // Don't trigger shortcuts if typing in input/textarea
    }

    const iconModalVisible = iconModal && iconModal.style.display === "flex";
    if (iconModalVisible) {
        if (event.key === "Escape") chiudiIconModal();
        return;
    }

    if (document.getElementById("json-modal").style.display === "flex" && event.key !== "Escape") return; // Only Esc if JSON modal is open
    if (document.getElementById("overlay-desc").style.display === "flex" && event.key !== "Escape") return; // Only Esc if overlay is open
    
    const shortcut = CONFIG.shortcuts[event.code] || CONFIG.shortcuts[event.key]; // event.key for +/-

    if (shortcut) {
        const ctrlNeeded = typeof shortcut.ctrl !== 'undefined' ? shortcut.ctrl : false;
        const action = typeof shortcut.action !== 'undefined' ? shortcut.action : shortcut;

        if (ctrlNeeded && !event.ctrlKey && !event.metaKey) return; // Need Ctrl/Cmd but not pressed
        if (!ctrlNeeded && (event.ctrlKey || event.metaKey)) return; // Don't need Ctrl/Cmd but pressed
        
        event.preventDefault();
        action();
    }
});

// === NODE SEARCH ===
document.getElementById("node-search").addEventListener("input", (e) => {
    appState.searchTerm = e.target.value.toLowerCase();
    redrawAllNodes(); // Redraw nodes to apply dimming
});

function nodoMatchesSearch(nodo, searchTerm) {
    if (!searchTerm) return true;
    return (
        nodo.text.toLowerCase().includes(searchTerm) ||
        nodo.description.toLowerCase().includes(searchTerm) ||
        (nodo.tags && nodo.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
}

// === MINIMAP ===
let minimapScale = 0.1;
const minimapPadding = 5;
let minimapDragging = false;
let minimapDragStart = null;

function updateMinimap() {
    if (!minimapContainer || minimapContainer.offsetParent === null) return; // Hidden

    minimapNodesGroup.selectAll("*").remove();
    minimapConnectionsGroup.selectAll("*").remove();

    if (appState.nodes.length === 0) {
        updateMinimapViewport(); // Still show viewport even if no nodes
        return;
    }

    // Calculate bounds of all nodes to determine minimap scale
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    appState.nodes.forEach(n => {
        const nodeHalfWidth = (n.shape === 'rect' ? n.size * 0.7 : n.size / 2);
        const nodeHalfHeight = n.size / 2;
        minX = Math.min(minX, n.x - nodeHalfWidth);
        minY = Math.min(minY, n.y - nodeHalfHeight);
        maxX = Math.max(maxX, n.x + nodeHalfWidth);
        maxY = Math.max(maxY, n.y + nodeHalfHeight);
    });
    
    const contentWidth = Math.max(1, maxX - minX); // Ensure not zero
    const contentHeight = Math.max(1, maxY - minY);

    const minimapWidth = minimapContainer.clientWidth - 2 * minimapPadding;
    const minimapHeight = minimapContainer.clientHeight - 2 * minimapPadding;

    minimapScale = Math.min(minimapWidth / contentWidth, minimapHeight / contentHeight);
    if (!isFinite(minimapScale) || minimapScale <=0) minimapScale = 0.05; // Fallback scale


    // Center content in minimap
    const scaledContentWidth = contentWidth * minimapScale;
    const scaledContentHeight = contentHeight * minimapScale;
    const translateX = minimapPadding + (minimapWidth - scaledContentWidth) / 2 - minX * minimapScale;
    const translateY = minimapPadding + (minimapHeight - scaledContentHeight) / 2 - minY * minimapScale;
    
    minimapNodesGroup.attr("transform", `translate(${translateX}, ${translateY}) scale(${minimapScale})`);
    minimapConnectionsGroup.attr("transform", `translate(${translateX}, ${translateY}) scale(${minimapScale})`);

    appState.nodes.forEach(n => {
        let shapeMini;
        const miniSize = n.size * 0.8; // Slightly smaller for clarity
        if (n.shape === "circle") {
            shapeMini = minimapNodesGroup.append("circle").attr("cx", n.x).attr("cy", n.y).attr("r", miniSize / 2);
        } else if (n.shape === "ellipse") {
            shapeMini = minimapNodesGroup.append("ellipse").attr("cx", n.x).attr("cy", n.y)
                .attr("rx", miniSize * 0.75 / 2 * 1.2).attr("ry", miniSize / 2);
        } else { // Default to rect for hex, diamond, rect for simplicity
            shapeMini = minimapNodesGroup.append("rect").attr("x", n.x - miniSize * 0.7 / 2).attr("y", n.y - miniSize / 2)
                .attr("width", miniSize * 0.7).attr("height", miniSize);
        }
        shapeMini.attr("fill", n.backgroundColor).attr("class", "node-shape-mini");
        if (appState.selectedNode && n.id === appState.selectedNode.id) {
            shapeMini.attr("stroke", CONFIG.colors.priority.high).attr("stroke-width", 3 / minimapScale); // Thicker border for selected
        }
    });

    appState.connections.forEach(c => {
        if (c.source && c.target) {
            minimapConnectionsGroup.append("line")
                .attr("x1", c.source.x).attr("y1", c.source.y)
                .attr("x2", c.target.x).attr("y2", c.target.y)
                .attr("class", "connection-mini")
                .attr("stroke", c.color);
        }
    });
    updateMinimapViewport();
}

function updateMinimapNodes() { // Lighter update, only for nodes
    minimapNodesGroup.selectAll("*").remove();
     // Calculate bounds of all nodes to determine minimap scale (same as full updateMinimap)
    if (appState.nodes.length === 0) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    appState.nodes.forEach(n => {
        const nodeHalfWidth = (n.shape === 'rect' ? n.size * 0.7 : n.size / 2);
        const nodeHalfHeight = n.size / 2;
        minX = Math.min(minX, n.x - nodeHalfWidth);
        minY = Math.min(minY, n.y - nodeHalfHeight);
        maxX = Math.max(maxX, n.x + nodeHalfWidth);
        maxY = Math.max(maxY, n.y + nodeHalfHeight);
    });
    const contentWidth = Math.max(1, maxX - minX);
    const contentHeight = Math.max(1, maxY - minY);
    const minimapWidth = minimapContainer.clientWidth - 2 * minimapPadding;
    const minimapHeight = minimapContainer.clientHeight - 2 * minimapPadding;
    minimapScale = Math.min(minimapWidth / contentWidth, minimapHeight / contentHeight);
    if (!isFinite(minimapScale) || minimapScale <=0) minimapScale = 0.05;
    const scaledContentWidth = contentWidth * minimapScale;
    const scaledContentHeight = contentHeight * minimapScale;
    const translateX = minimapPadding + (minimapWidth - scaledContentWidth) / 2 - minX * minimapScale;
    const translateY = minimapPadding + (minimapHeight - scaledContentHeight) / 2 - minY * minimapScale;
    
    minimapNodesGroup.attr("transform", `translate(${translateX}, ${translateY}) scale(${minimapScale})`);
    // Connections transform remains same unless full updateMinimap is called

    appState.nodes.forEach(n => { // Simplified drawing as in updateMinimap
        let shapeMini;
        const miniSize = n.size * 0.8;
        if (n.shape === "circle") {
            shapeMini = minimapNodesGroup.append("circle").attr("cx", n.x).attr("cy", n.y).attr("r", miniSize / 2);
        } else if (n.shape === "ellipse") {
            shapeMini = minimapNodesGroup.append("ellipse").attr("cx", n.x).attr("cy", n.y)
                .attr("rx", miniSize * 0.75 / 2 * 1.2).attr("ry", miniSize / 2);
        } else {
            shapeMini = minimapNodesGroup.append("rect").attr("x", n.x - miniSize * 0.7 / 2).attr("y", n.y - miniSize / 2)
                .attr("width", miniSize * 0.7).attr("height", miniSize);
        }
        shapeMini.attr("fill", n.backgroundColor).attr("class", "node-shape-mini");
         if (appState.selectedNode && n.id === appState.selectedNode.id) {
            shapeMini.attr("stroke", CONFIG.colors.priority.high).attr("stroke-width", 3 / minimapScale);
        }
    });
    updateMinimapViewport();
}


function updateMinimapViewport() {
    if (!minimapContainer || minimapContainer.offsetParent === null) return; // Hidden
    if (minimapScale <= 0) return; // Not initialized or invalid scale

    const [mainX, mainY, mainW, mainH] = appState.currentViewBox;
    
    // Transform of the content group in minimap
    const transform = d3.zoomTransform(minimapNodesGroup.node()); // Not zoom, but need transform attributes
    const groupTransformMatch = minimapNodesGroup.attr('transform');
    let groupTranslateX = 0, groupTranslateY = 0, groupScale = minimapScale;
    if (groupTransformMatch) {
        const translateMatch = /translate\(([^,]+),([^)]+)\)/.exec(groupTransformMatch);
        const scaleMatch = /scale\(([^)]+)\)/.exec(groupTransformMatch);
        if (translateMatch) {
            groupTranslateX = parseFloat(translateMatch[1]);
            groupTranslateY = parseFloat(translateMatch[2]);
        }
        if (scaleMatch) {
            groupScale = parseFloat(scaleMatch[1]);
        }
    }
    
    minimapViewportRect
        .attr("x", mainX * groupScale + groupTranslateX)
        .attr("y", mainY * groupScale + groupTranslateY)
        .attr("width", mainW * groupScale)
        .attr("height", mainH * groupScale);
}

minimapViewportRect.call(d3.drag()
    .on("start", function(event) {
        minimapDragging = true;
        minimapDragStart = { x: event.x, y: event.y }; // Mouse position relative to viewport rect
    })
    .on("drag", function(event) {
        if (!minimapDragging || minimapScale <= 0) return;
        
        const dx = event.x - minimapDragStart.x;
        const dy = event.y - minimapDragStart.y;

        // Convert minimap drag to main SVG viewbox change
        const mainDx = dx / minimapScale;
        const mainDy = dy / minimapScale;

        let [vx, vy, vw, vh] = appState.currentViewBox;
        updateViewBox([vx + mainDx, vy + mainDy, vw, vh]);
        
        // minimapDragStart is implicitly updated by the viewport moving with the mouse
        // No, we need to update it based on the SVG coordinate system of the minimap
        // For simplicity: the current approach makes the viewport follow the mouse.
        // A better way: calculate start SVG point, then calc new SVG point, then diff.
        // However, since the viewport rect itself is moving, event.x/y are relative to it.
        // The current behavior should be: viewport rect moves, main view changes, then viewport rect redraws.
        // No, `event.x` `event.y` are in the coordinate system of the parent of the dragged element (`minimap-svg`).
        // So, `minimapDragStart` should be updated relative to the new main view.
        // This is complex. Simpler: recalculate what minimapDragStart *would be* for the new main view.
        // Or, just use the delta and don't update minimapDragStart.
        // The issue is the viewport rect is redrawn by updateMinimapViewport.
        // Let's set new main view, then the minimapDragStart will be relative to the *new* position of the rect.
        // Actually, it's simpler: event.dx, event.dy are the change in screen pixels
        const mainScreenDx = event.dx; 
        const mainScreenDy = event.dy;
        
        // We need to scale these screen pixel changes to main SVG coordinate changes
        // This is not what d3.event.dx/dy means.
        // Correct approach:
        // map event.x, event.y to main SVG coordinate for new center of viewport
        // This is done when the drag starts for the initial position.
        // During drag, event.x, event.y are current mouse in minimap parent's coords
        // So, the change (event.x - rect.attr('x')) / minimapScale is the delta for mainX
        // This is too complex for now with the current structure. The basic drag works somewhat.
    })
    .on("end", function() {
        minimapDragging = false;
        minimapDragStart = null;
    })
);
// Also allow click on minimap to center view
minimapSvg.on("click", function(event) {
    if (event.target === minimapSvg.node() || event.target.classList.contains("node-shape-mini") || event.target.classList.contains("connection-mini")) { // Click on minimap background or elements
        if (minimapScale <= 0) return;

        const [mouseX, mouseY] = d3.pointer(event, minimapSvg.node());

        // Transform of the content group in minimap
        const groupTransformMatch = minimapNodesGroup.attr('transform');
        let groupTranslateX = 0, groupTranslateY = 0, groupScale = minimapScale;
         if (groupTransformMatch) {
            const translateMatch = /translate\(([^,]+),([^)]+)\)/.exec(groupTransformMatch);
            const scaleMatch = /scale\(([^)]+)\)/.exec(groupTransformMatch);
            if (translateMatch) {
                groupTranslateX = parseFloat(translateMatch[1]);
                groupTranslateY = parseFloat(translateMatch[2]);
            }
            if (scaleMatch) {
                groupScale = parseFloat(scaleMatch[1]);
            }
        }

        // Convert click in minimap to world coordinates
        const worldX = (mouseX - groupTranslateX) / groupScale;
        const worldY = (mouseY - groupTranslateY) / groupScale;

        // Center main view on this world coordinate
        let [, , vw, vh] = appState.currentViewBox;
        updateViewBox([worldX - vw / 2, worldY - vh / 2, vw, vh]);
    }
});


// === INIT ===
function initDefaultMap(){
    appState.autoSave = false; // Disable history during init
    const [vx, vy, vw, vh] = CONFIG.defaultViewBox.split(" ").map(Number);
    const nodoC = creaNodo(vx + vw/2, vy + vh/2, "Idea Centrale", "Questa è la tua mappa mentale di partenza.");
    const nodoA = creaNodo(nodoC.x + 200, nodoC.y, "Concetto A", "Spiegazione nodo A", nodoC.id);
    const nodoB = creaNodo(nodoC.x, nodoC.y + 150, "Concetto B", "Secondo nodo", nodoC.id);
    const nodoA1 = creaNodo(nodoA.x + 150, nodoA.y - 50, "Dettaglio A1", "", nodoA.id);
    nodoC.sources.push({ id: uniqueId("source"), label: "Wikipedia - Mappe mentali", url: "https://it.wikipedia.org/wiki/Mappa_mentale", icon: "fas fa-book" });
    nodoB.sources.push({ id: uniqueId("source"), label: "Video introduttivo", url: "https://www.youtube.com/watch?v=KcQ5CH1yXRA", icon: "fab fa-youtube" });
    nodoC.updatedAt = new Date().toISOString();
    nodoB.updatedAt = new Date().toISOString();
    creaConnessione(nodoC, nodoA, "Relazione 1");
    creaConnessione(nodoC, nodoB, "Relazione 2");
    creaConnessione(nodoA, nodoA1, "Approfondisce");
    redrawAll(); // Single redraw after all setup
    appState.autoSave = true;
    saveToHistory(); // Save this initial state
}

(function init() {
    updateViewBox(CONFIG.defaultViewBox.split(" ").map(Number));
    applySavedTheme(); // Apply theme before loading map, as map loading might toggle theme
    const embeddedData = (typeof window !== 'undefined') ? window.__EMBEDDED_MAP_DATA__ : null;
    if (embeddedData) {
        try {
            caricaMappa(embeddedData);
            showToast("Mappa caricata dal file salvato.", "success");
        } catch (err) {
            console.error("Impossibile caricare la mappa incorporata:", err);
            caricaMappaLocale();
        }
    } else {
        caricaMappaLocale(); // This will call initDefaultMap if nothing is saved
    }
    updateMinimap();
    updateUndoRedoButtons();

    // Initial population of icon pickers if sidebar is pre-rendered with a selection
    // This is typically handled when a node is selected and sidebar opens.
    // But if you wanted to pre-populate:
    // if (appState.selectedNode) {
    //     popolaIconPicker("node-icon-picker", CONFIG.icons, appState.selectedNode.icon, () => {});
    // }
    
    // Adjust toolbar visibility based on window size (for mobile)
    const toolbar = document.getElementById("toolbar");
    if (window.innerWidth <= 768 && !toolbar.classList.contains('hide')) {
        // If mobile and toolbar is not explicitly hidden by user, ensure it's visible
        // This might be more complex if 'hide' class is persistent
    } else if (window.innerWidth > 768 && toolbar.classList.contains('hide')) {
        // If desktop and toolbar is hidden (e.g. from previous mobile session), show it
        // This logic might need refinement based on how 'hide' persistence is handled
    }

    // Resize observer for minimap updates
    new ResizeObserver(() => {
        updateMinimap();
        // Also update main SVG viewBox if its aspect ratio needs to be maintained (not typical for this app)
    }).observe(minimapContainer);
    new ResizeObserver(() => {
         let [x,y,w,h] = appState.currentViewBox;
         const newClientWidth = svgElem.clientWidth;
         const newClientHeight = svgElem.clientHeight;
         // If you want to maintain aspect ratio of viewBox based on client rect:
         // w = newClientWidth * (h / oldClientHeight); // Assuming oldClientHeight was stored
         // Or simply redraw minimap viewport which depends on clientWidth/Height
         updateMinimapViewport();
    }).observe(svgElem);


})();

