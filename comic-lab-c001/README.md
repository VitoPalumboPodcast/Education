# Comic Lab · C001

[Apri l’app](https://vitopalumbopodcast.github.io/Education/comic-lab-c001/) · [Scarica la copia locale](https://vitopalumbopodcast.github.io/Education/comic-lab-c001/?download=1)

Applicazione per esercitarsi con dialoghi a due personaggi, pensata per adolescenti di 15–16 anni. Non richiede account, backend o installazione.

- 31 scene: quattro dialoghi inglesi iniziali e nove situazioni in inglese, italiano e francese. Il nuovo dialogo «Playing the game» si svolge durante una partita, mentre «Gaming together» resta quello in cui i ragazzi organizzano il gioco dopo scuola.
- Tredici illustrazioni originali generate con ImageGen, comprese due immagini distinte per i due momenti del gioco: a scuola e davanti allo schermo. Le immagini rappresentano una situazione coerente e non cambiano a ogni battuta.
- Ascolto, interpretazione di un personaggio e modalità con meno aiuti. Traduzione italiana su richiesta.
- Impostazioni aperte a studenti e docenti per modificare, aggiungere, duplicare e importare/esportare scene, scegliere immagini e voci, annotare osservazioni nella sessione corrente. Nell’editor «Dialogo da modificare» cambia l’intera scena; «Solo immagine di sfondo» cambia soltanto l’illustrazione.
- Il download produce un unico HTML con i dialoghi correnti e tutte le illustrazioni incluse. Tutte le immagini caricate dagli utenti sono escluse, anche quando salvate nel browser. Il JSON della singola scena può invece includere la sua immagine caricata.
- QR generato nel dispositivo, già collegato alla pagina di download pubblica. Nessun servizio QR esterno.

Le modifiche restano nel dispositivo: usare «Salva modifiche» oppure scaricare/esportare per conservarle. Un MP3 personale può essere associato a una battuta modificata quando il dispositivo non offre la voce desiderata. Nessuna registrazione o valutazione automatica della voce.

## Voci e funzionamento offline

Le voci disponibili dipendono da sistema e browser. Per ciascun personaggio ci sono filtri Maschile, Femminile, Non classificata e Tutte le voci, un elenco con etichette e un pulsante Prova voce. Il browser non espone un genere standard: alcune voci sono riconosciute dal nome, le altre si possono etichettare dopo l’ascolto. Le etichette confermate si salvano sul dispositivo. Se nessuna voce corrisponde al filtro, la riproduzione si ferma e lo segnala, senza sostituirla con una voce dell’altro tipo. Il tono non viene modificato per simulare un genere.

Durante i cambi di turno, automatici o manuali, si vede solo il fumetto corrente. Il fumetto precedente viene nascosto e svuotato.

Le battute originali disponibili nell’app hanno 176 audio distinti, maschili e femminili, inclusi. Per leggere battute nuove o riscritte senza un MP3 associato servono invece voci del dispositivo; alcune richiedono Internet. Il testo, gli audio inclusi e le illustrazioni del file scaricato restano disponibili offline.

## Immagini e dipendenze

Le tredici immagini di progetto sono in assets/ e sono anche incorporate in index.html per permettere il download in un solo file. Le assegnazioni standard delle quattro vecchie scene vengono aggiornate anche se salvate nel browser. Le immagini scelte diversamente o caricate dagli utenti restano disponibili nelle loro scene. Scene e prompt sono documentati in ASSETS.md. Le immagini caricate dagli utenti non vengono pubblicate su GitHub.

QRCode.js 1.0.0 di David Shim, licenza MIT: libreria inclusa nell’HTML con intestazione conservata.

Verifiche automatiche: sintassi JavaScript, 31 scene, filtri per lingua, riproduzione degli audio, modalità di pratica e impostazioni, esportazione e riapertura autonoma, mantenimento delle illustrazioni e delle scelte, esclusione delle immagini degli utenti, escaping dei testi e validazione degli URL QR.
