# Comic Lab · Dialoghi

[Apri l’app](https://vitopalumbopodcast.github.io/Education/comic-lab-c001/) · [Scarica la copia locale](https://vitopalumbopodcast.github.io/Education/comic-lab-c001/?download=1)

Applicazione per esercitarsi con dialoghi a due personaggi, pensata per adolescenti di 15–16 anni. Non richiede account, backend o installazione.

- 48 scene: “A pen, please” in inglese, italiano e francese; tre scene introduttive in inglese; otto situazioni, una partita ai videogiochi e un acquisto con la commessa in tutte e tre le lingue. La scelta della felpa con un’amica è un dialogo distinto dall’acquisto in negozio. Due situazioni scolastiche esercitano to be e to have alla terza persona e con we e they. Una nuova scena al bar usa be e have al presente per confrontare il prezzo di due pacchetti di patatine (3 €) con i 2 € che Jack ha: ne compra uno da 1,50 €. Una scena scolastica successiva mostra Jack che conserva un panino e una banana nel contenitore e decide di mangiarli rispettivamente alle 10:00 e alle 12:00. Tutte e quattro sono in inglese, italiano e francese. Ogni scena ha quattro dialoghi modificabili separatamente: Livello 0 con parole comuni e battute brevi, Base, Intermedio e Avanzato con battute e lessico progressivamente più ricchi. Anche le battute iniziali cambiano nei livelli superiori: per esempio la richiesta della penna diventa più completa e adeguata al contesto.
- “Time is money” chiude l’elenco delle scene in inglese. Jack ed Emma preparano una vendita di libri a scuola per raccogliere fondi per la biblioteca: arrivare in ritardo ridurrebbe il tempo per vendere e quindi il denaro raccolto. Il dialogo contestualizza il proverbio invece di ripeterlo senza spiegazione.
- Diciotto illustrazioni originali generate con ImageGen: cinema, bar, videogiochi, aula, centro sportivo, progetto di gruppo, due situazioni in negozio, condivisione di una foto, richiesta della penna prima del prestito, presentazioni in corridoio, penna e libro posseduti dai rispettivi studenti, valore del tempo con orologio e monete, partita in corso, due gruppi di compagni per to be e to have, due pacchetti di patatine sul bancone del bar e un contenitore con due merende ancora da mangiare. Nelle due immagini di gruppo Jack ed Emma parlano in primo piano, mentre Leo e Maya sono visibili più indietro: he e she indicano i singoli compagni, we i due interlocutori e they il gruppo sullo sfondo. Le immagini rappresentano una situazione coerente e non anticipano una consegna di oggetti.
- Ascolto, interpretazione di un personaggio e modalità con meno aiuti. In “Tocca a me” e “Meno aiuti”, dopo il permesso del microfono, l’app rileva la voce e avanza quando lo studente fa una breve pausa. Il microfono non registra né valuta le parole; se non è disponibile resta il pulsante “Ho parlato”. Traduzione italiana su richiesta.
- La navigazione ha solo due pulsanti, Studente e Impostazioni. Lingua, scena e livello sono visibili nella pagina; Studente mostra prima la scena, poi i comandi e la scelta del dialogo. I fumetti adattano il testo allo spazio disponibile senza barre di scorrimento interne. Impostazioni, con colori distinti, apre l’editor prima dell’anteprima e raccoglie voci, audio, importazione/esportazione e altre opzioni tecniche. Entrambe le aree sono accessibili a tutti. Il pulsante di ripristino cancella solo i dati di Comic Lab salvati in questo browser; nella copia locale torna ai contenuti incorporati in quel file.
- I dialoghi originali dei quattro livelli hanno voci maschili e femminili incluse, disponibili anche offline. L’app può esportare il livello scelto come audio WAV o video WebM/MP4 secondo il browser. Per esportare fedelmente battute modificate, occorre associare un MP3 a quelle battute.
- Il download produce un unico HTML con i dialoghi correnti e tutte le illustrazioni incluse. Tutte le immagini caricate dagli utenti sono escluse, anche quando salvate nel browser. Il JSON della singola scena può invece includere la sua immagine caricata.
- QR generato nel dispositivo, già collegato alla pagina di download pubblica. Nessun servizio QR esterno.

Le modifiche restano nel dispositivo: usare “Salva modifiche” oppure scaricare/esportare per conservarle. Nessuna registrazione o valutazione automatica della voce dello studente.

## Voci e funzionamento offline

Le voci disponibili dipendono da sistema e browser. Per ciascun personaggio ci sono filtri Maschile, Femminile, Non classificata e Tutte le voci, un elenco con etichette e un pulsante Prova voce. Il browser non espone un genere standard: alcune voci sono riconosciute dal nome, le altre si possono etichettare dopo l’ascolto. Le etichette confermate si salvano sul dispositivo. Se nessuna voce corrisponde al filtro, la riproduzione si ferma e lo segnala, senza sostituirla con una voce dell’altro tipo. Il tono non viene modificato per simulare un genere.

Durante i cambi di turno, automatici o manuali, si vede solo il fumetto corrente. Il fumetto precedente viene nascosto e svuotato.

Le battute originali usano audio incluso anche offline. Le battute personalizzate usano le voci del dispositivo quando disponibili; per ascoltarle offline serve una voce locale oppure un MP3 associato. Testo e illustrazioni del file scaricato restano disponibili offline.

## Immagini e dipendenze

Le diciotto immagini di progetto sono in assets/ e sono anche incorporate in index.html per permettere il download in un solo file. Le quattro nuove situazioni hanno immagini dedicate. Nelle due scene di gruppo, i compagni citati sono sullo sfondo; nelle altre due, gli oggetti del dialogo sono visibili ma non ancora consumati o consegnati. Le scene grammaticali salvate con le vecchie immagini vengono aggiornate soltanto se l’immagine non è stata personalizzata. Le immagini scelte diversamente o caricate dagli utenti restano disponibili nelle loro scene. Scene e prompt sono documentati in ASSETS.md. Le immagini caricate dagli utenti non vengono pubblicate su GitHub.

QRCode.js 1.0.0 di David Shim, licenza MIT: libreria inclusa nell’HTML con intestazione conservata.

Verifiche automatiche: sintassi JavaScript, 48 scene e livelli, filtri per lingua, modalità di pratica, esportazione audio/video, riapertura autonoma, mantenimento delle illustrazioni e delle scelte, esclusione delle immagini degli utenti, escaping dei testi e validazione degli URL QR.
