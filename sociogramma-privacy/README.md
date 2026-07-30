# Sociogramma riservato

Versione privacy-first del sociogramma scolastico.

## Garanzie incorporate

- Nessun account, backend, database remoto, API, cookie o servizio di analisi.
- Nessun nome: l'app accetta e mostra soltanto codici pseudonimi.
- I dati rimangono nella memoria della pagina e non sono salvati automaticamente.
- La chiusura o il caricamento della pagina elimina il progetto non esportato.
- Il backup volontario e cifrato nel browser con AES-GCM; la chiave deriva dalla
  password mediante PBKDF2-SHA256 con 250.000 iterazioni.
- Il file importato e decifrato soltanto in memoria.
- Le domande predefinite sono positive e non chiedono esclusioni o giudizi.
- L'analisi usa conteggi descrittivi e non assegna etichette, diagnosi o decisioni.
- La stampa contiene soltanto codici pseudonimi.
- Il comando di cancellazione svuota stato e contenuti gia renderizzati.

## Limiti e responsabilita

La pseudonimizzazione riduce i rischi ma non rende automaticamente anonimi i
dati. Se una chiave separata permette di ricondurre i codici alle persone, il
progetto resta soggetto alla disciplina sulla protezione dei dati.

Prima dell'uso l'istituzione deve definire almeno:

- finalita e base giuridica;
- soggetti autorizzati ad accedere;
- informativa per studenti e famiglie;
- durata della conservazione e procedura di cancellazione;
- custodia separata dell'eventuale chiave codice-persona;
- necessita di consultare RPD/DPO e svolgere una valutazione d'impatto.

## Fonti di riferimento

- GDPR, principi dell'articolo 5 e protezione dei dati fin dalla progettazione
  dell'articolo 25:
  https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32016R0679
- Garante per la protezione dei dati personali, sezione Scuola:
  https://www.garanteprivacy.it/it/temi/scuola
- EDPB, anonimizzazione e pseudonimizzazione:
  https://www.edpb.europa.eu/topics/ai-and-technology/anonymisationpseudonymisation_en
