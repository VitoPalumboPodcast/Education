(function() {
    function safeStringify(data) {
        return JSON.stringify(data).replace(/<\/script/gi, '<\\/script');
    }

    function generateFilename() {
        const date = new Date();
        const stamp = date.toISOString().replace(/[:]/g, '-');
        return `mappa-mentale-${stamp}.html`;
    }

    function saveFullPageSnapshot() {
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
            const htmlSnapshot = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
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
        btn.addEventListener('click', saveFullPageSnapshot);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
