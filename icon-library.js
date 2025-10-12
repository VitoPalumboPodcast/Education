(function(){
    function ensureFontAwesomeStylesheet() {
        if (typeof document === 'undefined') return;
        const existing = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
            .some(link => /font-awesome|fontawesome/i.test(link.href || ''));
        if (!existing) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
            link.crossOrigin = 'anonymous';
            link.referrerPolicy = 'no-referrer';
            link.dataset.autoFontawesome = 'true';
            document.head.appendChild(link);
        }
    }

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', ensureFontAwesomeStylesheet, { once: true });
        } else {
            ensureFontAwesomeStylesheet();
        }
    }

    const ICONS = [
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
        "far fa-smile","far fa-calendar-alt",
        "fab fa-github","fab fa-youtube","fab fa-figma"
    ];

    const SVG_MAP = {
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
  "fas fa-chart-line": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M32 448v32h448v-32H32zm64-96l96-96 64 64 160-160v96h32V128h-128v32h64L256 320l-64-64-128 128h32z"/></svg>`,
  "fas fa-bolt": `<svg viewBox="0 0 320 512"><path fill="currentColor" d="M296 160H180L220 32 24 288h116l-40 128z"/></svg>`,
  "fas fa-cloud": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M400 192a112 112 0 0 0-215.3-31.9A96 96 0 0 0 96 352h304a80 80 0 0 0 0-160z"/></svg>`,
  "fas fa-database": `<svg viewBox="0 0 448 512"><ellipse cx="224" cy="96" rx="192" ry="80" fill="currentColor"/><path fill="currentColor" d="M32 144v80c0 44.2 86 80 192 80s192-35.8 192-80v-80c-44.5 31.7-119 48-192 48s-147.5-16.3-192-48zm0 144v80c0 44.2 86 80 192 80s192-35.8 192-80v-80c-44.5 31.7-119 48-192 48s-147.5-16.3-192-48z"/></svg>`,
  "fas fa-microchip": `<svg viewBox="0 0 512 512"><rect x="96" y="96" width="320" height="320" rx="48" ry="48" fill="none" stroke="currentColor" stroke-width="32"/><rect x="176" y="176" width="160" height="160" fill="currentColor"/><g fill="currentColor"><rect x="64" y="48" width="32" height="96"/><rect x="64" y="368" width="32" height="96"/><rect x="416" y="48" width="32" height="96"/><rect x="416" y="368" width="32" height="96"/><rect x="208" y="32" width="32" height="64"/><rect x="272" y="32" width="32" height="64"/><rect x="208" y="416" width="32" height="64"/><rect x="272" y="416" width="32" height="64"/></g></svg>`,
  "fas fa-tree": `<svg viewBox="0 0 384 512"><polygon fill="currentColor" points="192 32 64 200 128 200 80 280 304 280 256 200 320 200"/><rect x="160" y="280" width="64" height="160" fill="currentColor"/><rect x="144" y="440" width="96" height="32" fill="currentColor"/></svg>`,
  "fas fa-recycle": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M208 64 120 216l56 32-32 56-112-64L128 64h80zm224 128-80-136h-80l48 80-40 24 96 56 56-24zm-24 144-56-32-32 56 56 32-48 80h80l80-136-80-48z"/></svg>`,
  "fas fa-calendar": `<svg viewBox="0 0 448 512"><rect x="64" y="80" width="320" height="368" rx="32" ry="32" fill="none" stroke="currentColor" stroke-width="32"/><rect x="112" y="32" width="32" height="64" fill="currentColor"/><rect x="304" y="32" width="32" height="64" fill="currentColor"/><line x1="64" y1="160" x2="384" y2="160" stroke="currentColor" stroke-width="24" stroke-linecap="round"/><rect x="112" y="208" width="64" height="48" fill="currentColor"/><rect x="208" y="208" width="64" height="48" fill="currentColor"/><rect x="304" y="208" width="64" height="48" fill="currentColor"/><rect x="112" y="288" width="64" height="48" fill="currentColor"/><rect x="208" y="288" width="64" height="48" fill="currentColor"/><rect x="304" y="288" width="64" height="48" fill="currentColor"/></svg>`,
  "fas fa-pen": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M400 32 176 256l-32 128 128-32 224-224-96-96zm-208 304 16 16-24 48-40 8 8-40 40-32z"/></svg>`,
  "fas fa-clipboard": `<svg viewBox="0 0 384 512"><rect x="64" y="96" width="256" height="384" rx="32" ry="32" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="24" stroke-linecap="round" stroke-opacity=".6" d="M96 128h192v80H96z"/><path fill="currentColor" d="M144 48h96a32 32 0 0 1 32 32v16H112V80a32 32 0 0 1 32-32z"/></svg>`,
  "fas fa-project-diagram": `<svg viewBox="0 0 512 512"><circle cx="128" cy="128" r="64" fill="currentColor"/><circle cx="384" cy="128" r="48" fill="currentColor"/><circle cx="256" cy="368" r="64" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="32" stroke-linecap="round" stroke-opacity=".7" d="M176 176 256 304 336 176"/><line x1="176" y1="176" x2="80" y2="256" stroke="currentColor" stroke-width="24" stroke-linecap="round" stroke-opacity=".7"/><line x1="336" y1="176" x2="432" y2="256" stroke="currentColor" stroke-width="24" stroke-linecap="round" stroke-opacity=".7"/></svg>`,
  "fas fa-chalkboard-teacher": `<svg viewBox="0 0 512 512"><rect x="64" y="96" width="320" height="208" rx="16" ry="16" fill="none" stroke="currentColor" stroke-width="28"/><rect x="64" y="320" width="320" height="32" fill="currentColor"/><circle cx="400" cy="176" r="40" fill="currentColor"/><path fill="currentColor" d="M400 224c-44 0-80 36-80 80v72h160v-72c0-44-36-80-80-80z"/></svg>`,
  "fas fa-stethoscope": `<svg viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" d="M144 64v112a80 80 0 0 0 160 0V64"/><path fill="none" stroke="currentColor" stroke-width="28" stroke-linecap="round" d="M304 176v96a112 112 0 0 1-224 0v-96"/><path fill="none" stroke="currentColor" stroke-width="28" stroke-linecap="round" d="M368 368v48a80 80 0 0 1-160 0"/><circle cx="368" cy="320" r="48" fill="currentColor"/></svg>`,
  "fas fa-palette": `<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 64C132.3 64 32 150.1 32 256s80.6 192 176 192h48a48 48 0 0 0 0-96h-32a48 48 0 0 1 0-96h96a112 112 0 0 0 0-224z"/><circle cx="176" cy="224" r="28" fill="currentColor" fill-opacity=".5"/><circle cx="256" cy="176" r="28" fill="currentColor" fill-opacity=".5"/><circle cx="208" cy="320" r="28" fill="currentColor" fill-opacity=".5"/><circle cx="320" cy="248" r="28" fill="currentColor" fill-opacity=".5"/></svg>`,
  "fas fa-dumbbell": `<svg viewBox="0 0 512 512"><rect x="96" y="208" width="320" height="96" fill="currentColor"/><rect x="32" y="176" width="48" height="160" fill="currentColor"/><rect x="432" y="176" width="48" height="160" fill="currentColor"/><rect x="80" y="192" width="16" height="128" fill="currentColor"/><rect x="416" y="192" width="16" height="128" fill="currentColor"/></svg>`,
  "fas fa-utensils": `<svg viewBox="0 0 384 512"><path fill="currentColor" d="M96 32c-26.5 0-48 37.3-48 96 0 45 14.3 83.2 32 94.4V480h32V222.4C129.7 211.2 144 173 144 128c0-58.7-21.5-96-48-96zm176 0v192h-48l16 256h64l16-256h-48V32z"/></svg>`,
  "fas fa-laptop-code": `<svg viewBox="0 0 512 512"><rect x="64" y="96" width="384" height="240" rx="24" ry="24" fill="none" stroke="currentColor" stroke-width="28"/><rect x="32" y="352" width="448" height="64" rx="16" ry="16" fill="currentColor"/><path fill="currentColor" d="M208 176 160 224l48 48 24-24-24-24 24-24-24-24zm96 0-24 24 24 24-24 24 24 24 48-48-48-48z"/></svg>`,
  "fas fa-chart-pie": `<svg viewBox="0 0 512 512"><path fill="currentColor" fill-opacity=".75" d="M272 32v208h208C480 141 371 32 272 32z"/><path fill="currentColor" d="M240 32C133 32 40 125 40 232s93 200 200 200 200-93 200-200H240V32z"/></svg>`,
  "fas fa-atom": `<svg viewBox="0 0 512 512"><circle cx="256" cy="256" r="40" fill="currentColor"/><ellipse cx="256" cy="256" rx="200" ry="96" fill="none" stroke="currentColor" stroke-width="24"/><ellipse cx="256" cy="256" rx="96" ry="200" fill="none" stroke="currentColor" stroke-width="24"/><path fill="none" stroke="currentColor" stroke-width="24" stroke-linecap="round" d="M96 96c80 80 240 80 320 0M96 416c80-80 240-80 320 0"/></svg>`,
  "fas fa-futbol": `<svg viewBox="0 0 512 512"><circle cx="256" cy="256" r="200" fill="none" stroke="currentColor" stroke-width="28"/><polygon fill="currentColor" points="256 168 200 216 224 296 288 296 312 216"/><path fill="currentColor" d="M144 344 88 272l72-24 32 88-48 8zm224 0-56-8 32-88 72 24-48 72z"/></svg>`,
  "fas fa-paw": `<svg viewBox="0 0 512 512"><ellipse cx="160" cy="192" rx="48" ry="64" fill="currentColor"/><ellipse cx="352" cy="192" rx="48" ry="64" fill="currentColor"/><ellipse cx="128" cy="320" rx="40" ry="52" fill="currentColor"/><ellipse cx="384" cy="320" rx="40" ry="52" fill="currentColor"/><circle cx="256" cy="320" r="88" fill="currentColor"/></svg>`,
  "far fa-smile": `<svg viewBox="0 0 512 512"><circle cx="256" cy="256" r="208" fill="none" stroke="currentColor" stroke-width="28"/><circle cx="192" cy="216" r="24" fill="currentColor"/><circle cx="320" cy="216" r="24" fill="currentColor"/><path d="M176 304c24 32 56 48 80 48s56-16 80-48" fill="none" stroke="currentColor" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "far fa-calendar-alt": `<svg viewBox="0 0 512 512"><rect x="80" y="96" width="352" height="320" rx="32" ry="32" fill="none" stroke="currentColor" stroke-width="28"/><rect x="80" y="136" width="352" height="64" fill="currentColor" opacity="0.85"/><rect x="144" y="232" width="80" height="72" rx="12" ry="12" fill="currentColor" opacity="0.85"/><rect x="288" y="232" width="80" height="72" rx="12" ry="12" fill="currentColor" opacity="0.65"/><rect x="144" y="328" width="80" height="72" rx="12" ry="12" fill="currentColor" opacity="0.65"/><rect x="288" y="328" width="80" height="72" rx="12" ry="12" fill="currentColor" opacity="0.85"/></svg>`,
  "fab fa-github": `<svg viewBox="0 0 512 512"><circle cx="256" cy="256" r="208" fill="currentColor" opacity="0.15"/><path d="M320 408c-16 8-32 12-64 12s-48-4-64-12v-56c0-24 16-48 40-48-56-4-104-28-104-112 0-24 8-44 20-60-2-8-6-36 2-52 0 0 26 0 56 24 14-4 30-6 46-6s32 2 46 6c30-24 56-24 56-24 8 16 4 44 2 52 12 16 20 36 20 60 0 84-48 108-104 112 24 0 40 24 40 48v56z" fill="currentColor"/></svg>`,
  "fab fa-youtube": `<svg viewBox="0 0 576 512"><rect x="64" y="128" width="448" height="256" rx="72" ry="72" fill="currentColor" opacity="0.85"/><polygon points="260 192 260 320 360 256" fill="#fff" opacity="0.95"/></svg>`,
  "fab fa-figma": `<svg viewBox="0 0 512 512"><circle cx="192" cy="160" r="88" fill="currentColor" opacity="0.85"/><circle cx="320" cy="160" r="88" fill="currentColor" opacity="0.55"/><circle cx="192" cy="288" r="88" fill="currentColor" opacity="0.55"/><circle cx="320" cy="288" r="88" fill="currentColor" opacity="0.35"/><rect x="224" y="288" width="96" height="160" rx="48" ry="48" fill="currentColor" opacity="0.85"/></svg>`
    };

    const LIBRARY_ALIASES = {
        fas: ["solid", "pieno", "riempita"],
        far: ["regular", "outline", "contorno"],
        fab: ["brand", "logo", "social"]
    };

    const ICON_KEYWORDS = {
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
        "fas fa-project-diagram": ["diagramma", "flusso", "processo", "rete", "organizzazione"],
        "fas fa-chalkboard-teacher": ["insegnante", "lezione", "classe", "presentazione", "training"],
        "fas fa-stethoscope": ["medico", "salute", "diagnosi", "ospedale", "cure"],
        "fas fa-palette": ["colore", "arte", "pittura", "design", "creatività"],
        "fas fa-dumbbell": ["palestra", "fitness", "allenamento", "forza", "sport"],
        "fas fa-utensils": ["cibo", "ristorante", "cucina", "alimentazione", "pasto"],
        "fas fa-laptop-code": ["computer", "sviluppo", "programmazione", "software", "coding"],
        "fas fa-chart-pie": ["grafico", "torta", "percentuali", "report", "statistiche"],
        "fas fa-atom": ["scienza", "fisica", "energia", "atomo", "ricerca"],
        "fas fa-futbol": ["calcio", "sport", "gioco", "pallone", "competizione"],
        "fas fa-paw": ["animali", "pet", "cane", "gatto", "zampa"],
        "far fa-smile": ["sorriso", "felice", "emoticon", "emoji", "positivo"],
        "far fa-calendar-alt": ["evento", "agenda", "appuntamento", "programma", "scadenza"],
        "fab fa-github": ["developer", "codice", "repository", "versionamento", "open source"],
        "fab fa-youtube": ["video", "streaming", "tutorial", "media", "canale"],
        "fab fa-figma": ["design", "ui", "ux", "mockup", "prototipo"]
    };

    window.ICON_LIBRARY = {
        icons: ICONS,
        svgMap: SVG_MAP,
        aliases: LIBRARY_ALIASES,
        keywords: ICON_KEYWORDS
    };
})();
