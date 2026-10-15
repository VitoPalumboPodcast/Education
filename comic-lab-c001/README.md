# Comic Lab · C001

[Apri l’app](https://vitopalumbopodcast.github.io/Education/comic-lab-c001/) · [Scarica la copia locale](https://vitopalumbopodcast.github.io/Education/comic-lab-c001/?download=1)

Applicazione per esercitarsi con dialoghi a due personaggi, pensata per adolescenti di 15–16 anni. Non richiede account, backend o installazione.

- 28 scene: quattro dialoghi inglesi iniziali e otto situazioni in inglese, italiano e francese.
- Dodici illustrazioni originali generate con ImageGen: cinema, bar, videogiochi, aula, centro sportivo, progetto di gruppo, negozio, condivisione di una foto, richiesta della penna prima del prestito, presentazioni in corridoio, penna e libro posseduti dai rispettivi studenti, valore del tempo con orologio e monete. Le immagini rappresentano una situazione di partenza coerente: non cambiano a ogni battuta e non anticipano una consegna di oggetti.
- Ascolto, interpretazione di un personaggio e modalità con meno aiuti. Traduzione italiana su richiesta.
- Impostazioni aperte a studenti e docenti per modificare, aggiungere, duplicare e importare/esportare scene, scegliere immagini e voci, annotare osservazioni nella sessione corrente.
- Il download produce un unico HTML con i dialoghi correnti e tutte le illustrazioni incluse. Tutte le immagini caricate dagli utenti sono escluse, anche quando salvate nel browser. Il JSON della singola scena può invece includere la sua immagine caricata.
- QR generato nel dispositivo, già collegato alla pagina di download pubblica. Nessun servizio QR esterno.

Le modifiche restano nel dispositivo: usare “Salva nel browser” oppure scaricare/esportare per conservarle. Nessuna registrazione o valutazione automatica della voce.

## Voci e funzionamento offline

Le voci disponibili dipendono da sistema e browser. Per ciascun personaggio ci sono filtri Maschile, Femminile, Non classificata e Tutte le voci, un elenco con etichette e un pulsante Prova voce. Il browser non espone un genere standard: alcune voci sono riconosciute dal nome, le altre si possono etichettare dopo l’ascolto. Le etichette confermate si salvano sul dispositivo. Se nessuna voce corrisponde al filtro, la riproduzione si ferma e lo segnala, senza sostituirla con una voce dell’altro tipo. Il tono non viene modificato per simulare un genere.

Durante i cambi di turno, automatici o manuali, si vede solo il fumetto corrente. Il fumetto precedente viene nascosto e svuotato.

Per parlare offline servono voci locali installate. Alcune voci richiedono Internet. Il testo e le illustrazioni del file scaricato restano disponibili offline.

## Immagini e dipendenze

Le dodici immagini di progetto sono in assets/ e sono anche incorporate in index.html per permettere il download in un solo file. Ogni famiglia di dialoghi ha una propria illustrazione. Le assegnazioni standard delle quattro vecchie scene vengono aggiornate anche se salvate nel browser. Le immagini scelte diversamente o caricate dagli utenti restano disponibili nelle loro scene. Scene e prompt sono documentati in ASSETS.md. Le immagini caricate dagli utenti non vengono pubblicate su GitHub.

QRCode.js 1.0.0 di David Shim, licenza MIT: libreria inclusa nell’HTML con intestazione conservata.

Verifiche automatiche: sintassi JavaScript, 28 scene, filtri per lingua, lingua della sintesi vocale, modalità di pratica e impostazioni, esportazione e riapertura autonoma, mantenimento delle illustrazioni e delle scelte, esclusione delle immagini degli utenti, escaping dei testi e validazione degli URL QR.
