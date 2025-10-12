(function() {
    const FALLBACK_CLASS_MAP = {
        'fa-unlink': ['fa-chain-broken'],
        'fa-sun': ['fa-sun-o'],
        'fa-moon': ['fa-moon-o'],
        'fa-expand-arrows-alt': ['fa-arrows-alt'],
        'fa-save': ['fa-floppy-o'],
        'fa-image': ['fa-picture-o'],
        'fa-file-pdf': ['fa-file-pdf-o'],
        'fa-redo': ['fa-repeat'],
        'fa-edit': ['fa-pencil'],
        'fa-icons': ['fa-th-large'],
        'fa-trash': ['fa-trash-o'],
        'fa-file-import': ['fa-upload'],
        'fa-file-export': ['fa-download'],
        'fa-search': ['fa-search'],
        'fa-ellipsis-h': ['fa-ellipsis-h'],
        'fa-download': ['fa-download'],
        'fa-upload': ['fa-upload']
    };

    const BASE_FA_CLASSES = new Set(['fa', 'fa-fw', 'fa-lg', 'fa-2x', 'fa-3x', 'fa-4x', 'fa-5x']);
    const STYLE_SNIPPET = `
        .fas, .far, .fab, .fal, .fad {
            font-family: "FontAwesome" !important;
            font-style: normal;
            font-weight: normal;
        }
    `;

    function injectStyle() {
        if (typeof document === 'undefined') return;
        if (document.getElementById('fa-compat-style')) return;
        const style = document.createElement('style');
        style.id = 'fa-compat-style';
        style.textContent = STYLE_SNIPPET;
        document.head.appendChild(style);
    }

    function applyFallbacks(icon) {
        if (!icon || !icon.classList) return;
        if (icon.dataset.faCompatProcessing === 'true') return;
        icon.dataset.faCompatProcessing = 'true';

        try {
            const classes = Array.from(icon.classList);
            const hasBase = classes.some(cls => BASE_FA_CLASSES.has(cls) || cls === 'fa');
            if (!hasBase) {
                icon.classList.add('fa');
            }

            classes.forEach(cls => {
                const normalized = cls.trim();
                const fallbacks = FALLBACK_CLASS_MAP[normalized];
                if (fallbacks) {
                    fallbacks.forEach(fallback => {
                        if (fallback && !icon.classList.contains(fallback)) {
                            icon.classList.add(fallback);
                        }
                    });
                }
            });
        } finally {
            requestAnimationFrame(() => {
                delete icon.dataset.faCompatProcessing;
            });
        }
    }

    function processNode(node) {
        if (!node || node.nodeType !== 1) return;
        if (node.tagName.toLowerCase() === 'i' && node.className.includes('fa')) {
            applyFallbacks(node);
        }
        node.querySelectorAll('i[class*="fa"]').forEach(applyFallbacks);
    }

    function initObserver() {
        if (typeof MutationObserver === 'undefined') return;
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(processNode);
                } else if (mutation.type === 'attributes' && mutation.target.tagName && mutation.target.tagName.toLowerCase() === 'i') {
                    applyFallbacks(mutation.target);
                }
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, { once: true });
        } else {
            fn();
        }
    }

    onReady(() => {
        injectStyle();
        processNode(document.documentElement);
        initObserver();
    });
})();
