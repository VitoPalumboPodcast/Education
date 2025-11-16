(function() {
    function safeStringify(data) {
        return JSON.stringify(data).replace(/<\/script/gi, '<\\/script');
    }

    function generateFilename() {
        const date = new Date();
        const stamp = date.toISOString().replace(/[:]/g, '-');
        return `mappa-mentale-${stamp}.html`;
    }

    async function fetchText(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Impossibile scaricare ${url}: ${response.status}`);
        }
        return await response.text();
    }

    async function inlineStyles(tempDoc) {
        const links = Array.from(tempDoc.querySelectorAll('link[rel="stylesheet"]'));
        for (const link of links) {
            const href = link.getAttribute('href');
            if (!href) continue;
            try {
                const absoluteUrl = new URL(href, document.baseURI).href;
                const cssText = await fetchText(absoluteUrl);
                const styleEl = tempDoc.createElement('style');
                styleEl.setAttribute('data-inline-source', href);
                styleEl.textContent = cssText;
                link.parentNode.replaceChild(styleEl, link);
            } catch (error) {
                console.warn('Impossibile incorporare il foglio di stile:', href, error);
            }
        }
    }

    async function inlineScripts(tempDoc) {
        const scripts = Array.from(tempDoc.querySelectorAll('script[src]'));
        for (const script of scripts) {
            const src = script.getAttribute('src');
            if (!src) continue;
            try {
                const absoluteUrl = new URL(src, document.baseURI).href;
                const jsText = await fetchText(absoluteUrl);
                script.removeAttribute('src');
                script.removeAttribute('integrity');
                script.removeAttribute('crossorigin');
                script.removeAttribute('referrerpolicy');
                script.removeAttribute('defer');
                script.setAttribute('data-inline-source', src);
                script.textContent = jsText;
            } catch (error) {
                console.warn('Impossibile incorporare lo script:', src, error);
            }
        }
    }

    async function buildStandaloneHtml() {
        const parser = new DOMParser();
        const serializedDom = document.documentElement.outerHTML;
        const tempDoc = parser.parseFromString(serializedDom, 'text/html');
        await inlineStyles(tempDoc);
        await inlineScripts(tempDoc);
        return '<!DOCTYPE html>\n' + tempDoc.documentElement.outerHTML;
    }

    async function saveFullPageSnapshot() {
        if (typeof salvaMappaFormat !== 'function') {
            console.error('salvaMappaFormat non disponibile.');
            return;
        }
        const placeholder = document.getElementById('embedded-map-data');
        if (!placeholder) {
            showToast('Impossibile trovare il contenitore per i dati incorporati.', 'error');
            return;
        }

        const previousContent = placeholder.textContent;
        try {
            const mapData = salvaMappaFormat();
            placeholder.textContent = safeStringify(mapData);
            const htmlSnapshot = await buildStandaloneHtml();
            downloadFile(htmlSnapshot, generateFilename(), 'text/html;charset=utf-8');
            showToast('Pagina completa scaricata!', 'success');
        } catch (err) {
            console.error('Errore durante il salvataggio della pagina completa:', err);
            showToast('Errore durante il salvataggio della pagina completa.', 'error');
        } finally {
            placeholder.textContent = previousContent;
        }
    }

    function init() {
        const btn = document.getElementById('save-full-page');
        if (!btn) return;
        btn.addEventListener('click', () => {
            saveFullPageSnapshot();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
