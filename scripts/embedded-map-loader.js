(function() {
    const MAX_ATTEMPTS = 60;
    const RETRY_DELAY = 75;
    let hasApplied = false;

    function getEmbeddedMapData() {
        if (typeof window === 'undefined') return null;
        return window.__EMBEDDED_MAP_DATA__ || null;
    }

    function showLoaderToast(message, type = 'info') {
        if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
            window.showToast(message, type);
        }
    }

    function applyMapDirectly(data, attempt = 0) {
        if (hasApplied) return;
        if (typeof window.caricaMappa !== 'function') {
            if (attempt >= MAX_ATTEMPTS) {
                console.error('Impossibile applicare la mappa incorporata: funzione caricaMappa assente.');
                showLoaderToast('Impossibile caricare la mappa incorporata.', 'error');
                return;
            }
            window.setTimeout(() => applyMapDirectly(data, attempt + 1), RETRY_DELAY);
            return;
        }
        try {
            window.caricaMappa(data);
            hasApplied = true;
            showLoaderToast('Mappa caricata dal file salvato.', 'success');
        } catch (err) {
            console.error('Errore durante il caricamento della mappa incorporata:', err);
            showLoaderToast('Errore durante il caricamento della mappa incorporata.', 'error');
        }
    }

    function init() {
        const data = getEmbeddedMapData();
        if (!data) return;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => applyMapDirectly(data), { once: true });
        } else {
            applyMapDirectly(data);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
