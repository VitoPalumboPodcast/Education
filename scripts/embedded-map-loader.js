(function() {
    const STORAGE_KEY = 'mindMapAdvancedData';
    const MAX_ATTEMPTS = 40;
    const RETRY_DELAY = 50;

    function getEmbeddedMapData() {
        if (typeof window === 'undefined') return null;
        return window.__EMBEDDED_MAP_DATA__ || null;
    }

    function stringifyData(data) {
        try {
            return JSON.stringify(data);
        } catch (err) {
            console.error('Impossibile serializzare la mappa incorporata:', err);
            return null;
        }
    }

    function tryPersistToLocalStorage(data) {
        if (!window || !window.localStorage) {
            return false;
        }
        const serialized = stringifyData(data);
        if (!serialized) return false;
        try {
            window.localStorage.setItem(STORAGE_KEY, serialized);
            return true;
        } catch (err) {
            console.warn('LocalStorage non disponibile per la mappa incorporata:', err);
            return false;
        }
    }

    function showLoaderToast(message, type = 'info') {
        if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
            window.showToast(message, type);
        }
    }

    function applyMapDirectly(data, attempt = 0) {
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
            showLoaderToast('Mappa caricata dal file salvato.', 'success');
        } catch (err) {
            console.error('Errore durante il caricamento della mappa incorporata:', err);
            showLoaderToast('Errore durante il caricamento della mappa incorporata.', 'error');
        }
    }

    function init() {
        const data = getEmbeddedMapData();
        if (!data) return;
        const stored = tryPersistToLocalStorage(data);
        if (stored) {
            if (document.readyState === 'complete') {
                showLoaderToast('Mappa caricata dal file salvato.', 'success');
            } else {
                window.addEventListener('load', () => showLoaderToast('Mappa caricata dal file salvato.', 'success'), { once: true });
            }
            return;
        }
        if (document.readyState === 'complete') {
            applyMapDirectly(data);
        } else {
            window.addEventListener('load', () => applyMapDirectly(data), { once: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
