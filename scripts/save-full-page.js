(function() {
    function safeStringify(data) {
        return JSON.stringify(data).replace(/<\/script/gi, '<\\/script');
    }

    function generateFilename() {
        const date = new Date();
        const stamp = date.toISOString().replace(/[:]/g, '-');
        return `mappa-mentale-${stamp}.html`;
    }

    function absoluteUrl(url) {
        try {
            return new URL(url, document.baseURI).href;
        } catch (err) {
            console.warn('URL non valido per l\'inlining:', url, err);
            return url;
        }
    }

    async function fetchTextOrThrow(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Risposta non valida (${response.status}) per ${url}`);
        }
        return await response.text();
    }

    async function inlineStyles(tempDoc) {
        const links = Array.from(tempDoc.querySelectorAll('link[rel="stylesheet"][href]'));
        for (const link of links) {
            const href = link.getAttribute('href');
            if (!href) continue;
            try {
                const cssText = await fetchTextOrThrow(absoluteUrl(href));
                const styleEl = tempDoc.createElement('style');
                styleEl.setAttribute('data-inline-original-href', href);
                styleEl.textContent = cssText;
                link.replaceWith(styleEl);
            } catch (err) {
                console.error('Impossibile incorporare lo stylesheet:', href, err);
                throw err;
            }
        }
    }

    async function inlineScripts(tempDoc) {
        const scripts = Array.from(tempDoc.querySelectorAll('script[src]'));
        for (const script of scripts) {
            const src = script.getAttribute('src');
            if (!src) continue;
            try {
                const jsText = await fetchTextOrThrow(absoluteUrl(src));
                const inlineScript = tempDoc.createElement('script');
                inlineScript.type = script.type || 'text/javascript';
                if (script.defer) inlineScript.defer = script.defer;
                if (script.async) inlineScript.async = script.async;
                inlineScript.setAttribute('data-inline-original-src', src);
                inlineScript.textContent = jsText;
                script.replaceWith(inlineScript);
            } catch (err) {
                console.error('Impossibile incorporare lo script:', src, err);
                throw err;
            }
        }
    }

    async function buildSnapshotDocument(mapData) {
        const tempDoc = document.implementation.createHTMLDocument(document.title || 'Mappa Mentale');
        const clonedHtml = document.documentElement.cloneNode(true);
        tempDoc.replaceChild(clonedHtml, tempDoc.documentElement);
        const placeholder = tempDoc.getElementById('embedded-map-data');
        if (placeholder) {
            placeholder.textContent = safeStringify(mapData);
        }
        return tempDoc;
    }

    async function serializeDocumentWithAssets(tempDoc) {
        await inlineStyles(tempDoc);
        await inlineScripts(tempDoc);
        return '<!DOCTYPE html>\n' + tempDoc.documentElement.outerHTML;
    }

    async function saveFullPageSnapshot() {
        if (typeof salvaMappaFormat !== 'function') {
            console.error('salvaMappaFormat non disponibile.');
            return;
        }
        try {
            const mapData = salvaMappaFormat();
            const tempDoc = await buildSnapshotDocument(mapData);
            const htmlSnapshot = await serializeDocumentWithAssets(tempDoc);
            downloadFile(htmlSnapshot, generateFilename(), 'text/html;charset=utf-8');
            showToast('Pagina completa scaricata!', 'success');
        } catch (err) {
            console.error('Errore durante il salvataggio della pagina completa:', err);
            showToast('Errore durante il salvataggio della pagina completa. Controlla la console per i dettagli.', 'error');
        }
    }

    function init() {
        const btn = document.getElementById('save-full-page');
        if (!btn) return;
        btn.addEventListener('click', () => {
            btn.disabled = true;
            saveFullPageSnapshot().finally(() => {
                btn.disabled = false;
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
