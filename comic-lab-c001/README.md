# Comic Lab · Dialoghi

[Apri l’app](https://vitopalumbopodcast.github.io/Education/comic-lab-c001/) · [Scarica la copia locale](https://vitopalumbopodcast.github.io/Education/comic-lab-c001/?download=1)

Applicazione per esercitarsi con dialoghi a due personaggi, pensata per adolescenti di 15–16 anni. Non richiede account, backend o installazione.

- 33 scene: “A pen, please” in inglese, italiano e francese; tre scene introduttive in inglese; otto situazioni e una partita ai videogiochi in tutte e tre le lingue. Ogni scena ha dialoghi Base, Intermedio e Avanzato modificabili separatamente.
- Tredici illustrazioni originali generate con ImageGen: cinema, bar, videogiochi, aula, centro sportivo, progetto di gruppo, negozio, condivisione di una foto, richiesta della penna prima del prestito, presentazioni in corridoio, penna e libro posseduti dai rispettivi studenti, valore del tempo con orologio e monete, e partita in corso. Le immagini rappresentano una situazione di partenza coerente: non cambiano a ogni battuta e non anticipano una consegna di oggetti.
- Ascolto, interpretazione di un personaggio e modalità con meno aiuti. In “Tocca a me” e “Meno aiuti”, dopo il permesso del microfono, l’app rileva la voce e avanza quando lo studente fa una breve pausa. Il microfono non registra né valuta le parole; se non è disponibile resta il pulsante “Ho parlato”. Traduzione italiana su richiesta.
- Impostazioni aperte a studenti e docenti per modificare, aggiungere, duplicare e importare/esportare scene, scegliere immagini e voci, annotare osservazioni nella sessione corrente. Il pulsante di ripristino cancella solo i dati di Comic Lab salvati in questo browser; nella copia locale torna ai contenuti incorporati in quel file.
- I dialoghi originali dei tre livelli hanno voci maschili e femminili incluse, disponibili anche offline. L’app può esportare il livello scelto come audio WAV o video WebM/MP4 secondo il browser. Per esportare fedelmente battute modificate, occorre associare un MP3 a quelle battute.
- Il download produce un unico HTML con i dialoghi correnti e tutte le illustrazioni incluse. Tutte le immagini caricate dagli utenti sono escluse, anche quando salvate nel browser. Il JSON della singola scena può invece includere la sua immagine caricata.
- QR generato nel dispositivo, già collegato alla pagina di download pubblica. Nessun servizio QR esterno.

Le modifiche restano nel dispositivo: usare “Salva modifiche” oppure scaricare/esportare per conservarle. Nessuna registrazione o valutazione automatica della voce dello studente.

## Voci e funzionamento offline

Le voci disponibili dipendono da sistema e browser. Per ciascun personaggio ci sono filtri Maschile, Femminile, Non classificata e Tutte le voci, un elenco con etichette e un pulsante Prova voce. Il browser non espone un genere standard: alcune voci sono riconosciute dal nome, le altre si possono etichettare dopo l’ascolto. Le etichette confermate si salvano sul dispositivo. Se nessuna voce corrisponde al filtro, la riproduzione si ferma e lo segnala, senza sostituirla con una voce dell’altro tipo. Il tono non viene modificato per simulare un genere.

Durante i cambi di turno, automatici o manuali, si vede solo il fumetto corrente. Il fumetto precedente viene nascosto e svuotato.

Le battute originali usano audio incluso anche offline. Le battute personalizzate usano le voci del dispositivo quando disponibili; per ascoltarle offline serve una voce locale oppure un MP3 associato. Testo e illustrazioni del file scaricato restano disponibili offline.

## Immagini e dipendenze

Le tredici immagini di progetto sono in assets/ e sono anche incorporate in index.html per permettere il download in un solo file. Ogni famiglia di dialoghi ha una propria illustrazione. Le assegnazioni standard delle quattro vecchie scene vengono aggiornate anche se salvate nel browser. Le immagini scelte diversamente o caricate dagli utenti restano disponibili nelle loro scene. Scene e prompt sono documentati in ASSETS.md. Le immagini caricate dagli utenti non vengono pubblicate su GitHub.

QRCode.js 1.0.0 di David Shim, licenza MIT: libreria inclusa nell’HTML con intestazione conservata.

Verifiche automatiche: sintassi JavaScript, 33 scene e livelli, filtri per lingua, modalità di pratica, esportazione audio/video, riapertura autonoma, mantenimento delle illustrazioni e delle scelte, esclusione delle immagini degli utenti, escaping dei testi e validazione degli URL QR.
