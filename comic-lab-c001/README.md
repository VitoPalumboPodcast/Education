# Comic Lab · C001

[Apri l’app](https://vitopalumbopodcast.github.io/Education/comic-lab-c001/) · [Scarica la copia locale](https://vitopalumbopodcast.github.io/Education/comic-lab-c001/?download=1)

Applicazione per esercitarsi con dialoghi a due personaggi, pensata per adolescenti di 15–16 anni. Non richiede account, backend o installazione.

- 28 scene: quattro dialoghi inglesi iniziali e otto situazioni in inglese, italiano e francese.
- Otto illustrazioni originali generate con ImageGen: cinema, bar, videogiochi, aula, centro sportivo, progetto di gruppo, negozio e condivisione di una foto.
- Ascolto, interpretazione di un personaggio e modalità con meno aiuti. Traduzione italiana su richiesta.
- Impostazioni aperte a studenti e docenti per modificare, aggiungere, duplicare e importare/esportare scene, scegliere immagini e voci, annotare osservazioni nella sessione corrente.
- Il download produce un unico HTML con i dialoghi correnti e tutte le illustrazioni incluse. Tutte le immagini caricate dagli utenti sono escluse, anche quando salvate nel browser. Il JSON della singola scena può invece includere la sua immagine caricata.
- QR generato nel dispositivo, già collegato alla pagina di download pubblica. Nessun servizio QR esterno.

Le modifiche restano nel dispositivo: usare “Salva nel browser” oppure scaricare/esportare per conservarle. Nessuna registrazione o valutazione automatica della voce.

## Voci e funzionamento offline

Le voci disponibili dipendono da sistema e browser. Le due voci si scelgono separatamente. Le preferenze maschile/femminile riconoscono alcune voci comuni dal nome; la Web Speech API non espone un genere standard. Per altre voci selezionarle per nome e ascoltarle. In assenza della preferenza viene usata una voce disponibile della lingua scelta.

Per parlare offline servono voci locali installate. Alcune voci richiedono Internet. Il testo e le illustrazioni del file scaricato restano disponibili offline.

## Immagini e dipendenze

Le otto immagini di progetto sono in assets/ e sono anche incorporate in index.html per permettere il download in un solo file. Scene e prompt sono documentati in ASSETS.md. Le immagini caricate dagli utenti non vengono pubblicate su GitHub.

QRCode.js 1.0.0 di David Shim, licenza MIT: libreria inclusa nell’HTML con intestazione conservata.

Verifiche automatiche: sintassi JavaScript, 28 scene, filtri per lingua, lingua della sintesi vocale, modalità di pratica e impostazioni, esportazione e riapertura autonoma, mantenimento delle illustrazioni e delle scelte, esclusione delle immagini degli utenti, escaping dei testi e validazione degli URL QR.
