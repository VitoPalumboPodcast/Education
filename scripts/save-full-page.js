(function() {
    function safeStringify(data) {
        return JSON.stringify(data).replace(/<\/script/gi, '<\\/script');
    }

    function notify(message, type = 'info') {
        if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
            window.showToast(message, type);
            return;
        }
        if (type === 'error') {
            console.error(message);
        } else {
            console.log(message);
        }
        if (type === 'error' && typeof window !== 'undefined' && typeof window.alert === 'function') {
            window.alert(message);
        }
    }

    const EMBED_MAX_ATTEMPTS = 60;
    const EMBED_RETRY_DELAY = 75;
    let embeddedMapApplied = false;

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

    async function inlineStyles(tempDoc, warnings) {
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
                const message = `Impossibile incorporare lo stylesheet ${href}: ${err.message}`;
                console.error(message, err);
                warnings.push(message);
            }
        }
    }

    async function inlineScripts(tempDoc, warnings) {
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
                const message = `Impossibile incorporare lo script ${src}: ${err.message}`;
                console.error(message, err);
                warnings.push(message);
            }
        }
    }

    function ensureEmbeddedDataSlot(tempDoc) {
        let placeholder = tempDoc.getElementById('embedded-map-data');
        if (placeholder) {
            return placeholder;
        }
        placeholder = tempDoc.createElement('script');
        placeholder.id = 'embedded-map-data';
        placeholder.type = 'application/json';
        const firstScript = tempDoc.querySelector('script');
        if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(placeholder, firstScript);
        } else if (tempDoc.body) {
            tempDoc.body.appendChild(placeholder);
        } else {
            tempDoc.documentElement.appendChild(placeholder);
        }
        return placeholder;
    }

    async function buildSnapshotDocument(mapData) {
        const tempDoc = document.implementation.createHTMLDocument(document.title || 'Mappa Mentale');
        const clonedHtml = document.documentElement.cloneNode(true);
        tempDoc.replaceChild(clonedHtml, tempDoc.documentElement);
        const placeholder = ensureEmbeddedDataSlot(tempDoc);
        placeholder.textContent = safeStringify(mapData);
        return tempDoc;
    }

    async function serializeDocumentWithAssets(tempDoc) {
        const warnings = [];
        await inlineStyles(tempDoc, warnings);
        await inlineScripts(tempDoc, warnings);
        return {
            html: '<!DOCTYPE html>\n' + tempDoc.documentElement.outerHTML,
            warnings
        };
    }

    function fallbackDownload(content, filename, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }

    function runDownload(content, filename, mime) {
        if (typeof window !== 'undefined' && typeof window.downloadFile === 'function') {
            window.downloadFile(content, filename, mime);
        } else {
            fallbackDownload(content, filename, mime);
        }
    }

    function setButtonBusy(btn, busy) {
        if (!btn) return;
        btn.disabled = busy;
        if (busy) {
            btn.setAttribute('aria-busy', 'true');
        } else {
            btn.removeAttribute('aria-busy');
        }
    }

    function getEmbeddedMapData() {
        if (typeof window === 'undefined') return null;
        return window.__EMBEDDED_MAP_DATA__ || null;
    }

    function tryApplyEmbeddedMap(data, attempt = 0) {
        if (embeddedMapApplied || !data) return;
        if (typeof window === 'undefined') return;
        if (typeof window.caricaMappa !== 'function') {
            if (attempt >= EMBED_MAX_ATTEMPTS) {
                console.error('Impossibile applicare la mappa incorporata: funzione caricaMappa assente.');
                notify('Impossibile caricare la mappa incorporata.', 'error');
                return;
            }
            window.setTimeout(() => tryApplyEmbeddedMap(data, attempt + 1), EMBED_RETRY_DELAY);
            return;
        }
        try {
            window.caricaMappa(data);
            embeddedMapApplied = true;
            notify('Mappa caricata dal file salvato.', 'success');
        } catch (err) {
            console.error('Errore durante il caricamento della mappa incorporata:', err);
            notify('Errore durante il caricamento della mappa incorporata.', 'error');
        }
    }

    function bootstrapEmbeddedMap() {
        const data = getEmbeddedMapData();
        if (!data) return;
        const start = () => tryApplyEmbeddedMap(data);
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', start, { once: true });
        } else {
            start();
        }
    }

    async function saveFullPageSnapshot() {
        if (typeof salvaMappaFormat !== 'function') {
            console.error('salvaMappaFormat non disponibile.');
            return;
        }
        try {
            const mapData = salvaMappaFormat();
            const tempDoc = await buildSnapshotDocument(mapData);
            const { html, warnings } = await serializeDocumentWithAssets(tempDoc);
            runDownload(html, generateFilename(), 'text/html;charset=utf-8');
            if (warnings.length) {
                notify('Pagina scaricata ma alcune risorse non sono state incorporate. Controlla la console per i dettagli.', 'warning');
            } else {
                notify('Pagina completa scaricata!', 'success');
            }
        } catch (err) {
            console.error('Errore durante il salvataggio della pagina completa:', err);
            notify('Errore durante il salvataggio della pagina completa. Controlla la console per i dettagli.', 'error');
        }
    }

    function init() {
        const btn = document.getElementById('save-full-page');
        if (btn) {
            btn.addEventListener('click', () => {
                setButtonBusy(btn, true);
                saveFullPageSnapshot().finally(() => {
                    setButtonBusy(btn, false);
                });
            });
        }
        bootstrapEmbeddedMap();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
