
import { VerseAnalysis } from '../types';

export const STATIC_ANALYSIS: Record<string, { explanation: string; style: string }> = {
  "Veglia": {
    explanation: "Scritta in trincea durante la Prima Guerra Mondiale, la poesia esprime un attaccamento disperato alla vita che scaturisce dall'esperienza diretta, brutale e prolungata con la morte del compagno.\n\nIN PAROLE SEMPLICI: Il poeta sta prestando servizio in guerra. Passa una notte intera vicino a un suo compagno, colpito e ucciso in modo terribile. Vedere tutto questo orrore non gli toglie la speranza, ma gli fa capire ancora di più quanto è bella la vita, tanto da spingerlo a scrivere lettere d'amore proprio in quel momento doloroso.",
    style: "Versi liberi, brevissimi (spesso singole parole), privi di punteggiatura. L'uso dei participi passati e la frantumazione del verso isolano le parole, caricandole di un peso drammatico ed essenziale."
  },
  "Sera di Liguria": {
    explanation: "La poesia cattura l'atmosfera sospesa e magica del crepuscolo ligure. Cardarelli usa immagini pittoriche (lenta e rosata) per descrivere un momento di 'perdizione', dove il paesaggio si fonde con lo stato d'animo di nostalgia e attesa.",
    style: "Alternanza di endecasillabi e settenari sciolti. Il ritmo è piano, caratterizzato da frequenti sinalefi che rendono il verso fluido come l'avanzare della sera stessa."
  },
  "San Martino": {
    explanation: "Un classico della letteratura italiana che contrappone il paesaggio esterno (nebbia, mare in tempesta) all'intimità del borgo in festa per il vino nuovo. La chiusura malinconica degli uccelli neri richiama i pensieri esuli del poeta.",
    style: "Quartine di settenari. Schema di rime anacreontico (ABBC, DEEC...) con l'ultimo verso di ogni quartina tronco in -ar."
  },
  "L'infinito": {
    explanation: "L'idillio per eccellenza. Leopardi esplora il limite fisico (la siepe) come motore dell'immaginazione infinita, arrivando a un naufragio mistico nel mare dell'essere.",
    style: "Endecasillabi sciolti. Uso magistrale degli enjambement per dilatare il tempo e lo spazio del verso."
  },
  "Solo e pensoso": {
    explanation: "Uno dei sonetti più celebri del Canzoniere. Petrarca esprime il desiderio di solitudine per fuggire allo sguardo altrui che potrebbe rivelare il suo tormento interiore, ma riconosce l'impossibilità di sfuggire all'Amore, che lo accompagna ovunque.",
    style: "Sonetto classico (due quartine e due terzine). Endecasillabi con schema ritmico ABBA ABBA CDE CDE. Stile elevato, ricco di antitesi tra paesaggio deserto e interiorità tormentata."
  },
  "Traversando la Maremma toscana": {
    explanation: "Il poeta, attraversando in treno la Maremma, rivede i luoghi della sua giovinezza. Il paesaggio suscita in lui un misto di gioia e malinconia, portandolo a riflettere sui sogni giovanili svaniti e sull'avvicinarsi della morte, trovando infine una pacata consolazione nella dolcezza delle colline.",
    style: "Sonetto con rime alternate nelle quartine (ABAB ABAB) e replicate nelle terzine (CDC DCD). Il ritmo è solenne e malinconico, tipico dell'endecasillabo carducciano."
  },
  "Eneide (Proemio)": {
    explanation: "Il proemio dell'Eneide si divide in protasi (esposizione dell'argomento: il viaggio di Enea, la guerra, la fondazione della stirpe romana) e invocazione alla Musa. Enea è presentato come esule per volere del Fato, perseguitato dall'ira di Giunone ma guidato dalla sua 'pietas'.",
    style: "Traduzione italiana dell'esametro dattilico latino. Il testo si presenta in versi liberi che cercano di restituire la solennità e l'ampiezza del respiro epico originale."
  },
  "Perché tardi": {
    explanation: "Una poesia densa e sospesa di Eugenio Montale (da 'Le occasioni'). L'attesa ('Perché tardi?') innesta una tensione vibrante nel paesaggio: dall'accensione vitale dello scoiattolo al dileguarsi della luna. Il finale evoca la donna salvifica (Clizia) come un bagliore accecante e rivelatore che stravolge la temporalità terrena.",
    style: "Linguaggio ardito e oggettivo (correlativo oggettivo montaliano). Si compone quasi interamente di endecasillabi, segnati da forti enjambement e rime o assonanze interne, con una chiusa epigrammatica e folgorante in un verso breve (quinario)."
  },
  "Il tuono": {
    explanation: "Questa ballata di Pascoli cattura con estrema precisione e potenza l'esplosione di un tuono nella notte. La prima parte del testo è dominata dal fragore e dalla violenza della natura, ma nel finale c'è un improvviso rovesciamento emotivo: la quiete ritorna grazie alla presenza materna e alla dolcezza del canto, che protegge dalla furia esterna.\n\nIN PAROLE SEMPLICI: Durante una notte completamente buia, all'improvviso si sente il fortissimo rumore di un tuono, simile a una montagna che frana. Il rimbombo rotola minaccioso, poi sembra spegnersi, per poi riprendere come il fragore delle onde, svanendo infine del tutto. A quel punto, nel silenzio, si sente il canto dolce di una madre e il dondolio di una culla che riportano la serenità.",
    style: "Endecasillabi, rime ABCBCCA. Fortissimo uso del fonosimbolismo: l'allitterazione della 'r' e il gioco vocalico (rimbombò, rimbalzò, rotolò) imitano fisicamente lo scoppio e l'eco del tuono. Sintassi paratattica dominata dalle 'e' polisindetiche."
  }
};

export const METRIC_REGISTRY: Record<string, VerseAnalysis[]> = {
  "Veglia": [
    {
      verse: "Un'intera nottata",
      meter: "Senario",
      scansion: [
        { text: "Un'in", type: "normal", index: 1 }, { text: "te", type: "accented", index: 2 }, { text: "ra", type: "normal", index: 3 }, { text: "not", type: "normal", index: 4 }, { text: "ta", type: "accented", index: 5 }, { text: "ta", type: "normal", index: 6 }
      ],
      accents: [2, 5],
      figuresOfSpeech: ["Allitterazione (t)"],
      meaning: "In questo verso il poeta ci dice quanto è durato questo momento terribile. Ha passato tutto il tempo al buio, una notte lunghissima in cui non si poteva chiudere occhio."
    },
    {
      verse: "buttato vicino",
      meter: "Senario",
      scansion: [
        { text: "but", type: "normal", index: 1 }, { text: "ta", type: "accented", index: 2 }, { text: "to", type: "normal", index: 3 }, { text: "vi", type: "normal", index: 4 }, { text: "ci", type: "accented", index: 5 }, { text: "no", type: "normal", index: 6 }
      ],
      accents: [2, 5],
      figuresOfSpeech: ["Participio passato"],
      meaning: "La parola 'buttato' ci fa capire che il poeta si sente trattato come un oggetto senza valore o come uno straccio, sdraiato per terra nel fango e nella sporcizia della trincea."
    },
    {
      verse: "a un compagno",
      meter: "Quinario",
      scansion: [
        { text: "a_un", type: "sinalefe", index: 1 }, { text: "com", type: "normal", index: 2 }, { text: "pa", type: "accented", index: 3 }, { text: "gno", type: "normal", index: 4 }
      ],
      accents: [3],
      figuresOfSpeech: ["Sinalefe"],
      meaning: "Accanto a lui c'è un altro soldato, un amico che condivide la sua stessa sfortuna. In guerra si diventa come fratelli, uniti dalla stessa paura e dallo stesso destino."
    },
    {
      verse: "massacrato",
      meter: "Quadrisillabo",
      scansion: [
        { text: "mas", type: "normal", index: 1 }, { text: "sa", type: "normal", index: 2 }, { text: "cra", type: "accented", index: 3 }, { text: "to", type: "normal", index: 4 }
      ],
      accents: [3],
      figuresOfSpeech: ["Participio passato", "Parola-verso"],
      meaning: "Questa parola è molto dura e spaventosa. Ci fa capire che il suo amico è stato colpito a morte in modo crudele, violento e senza pietà durante la battaglia."
    },
    {
      verse: "con la sua bocca",
      meter: "Senario",
      scansion: [
        { text: "con", type: "normal", index: 1 }, { text: "la", type: "normal", index: 2 }, { text: "sua", type: "normal", index: 3 }, { text: "boc", type: "accented", index: 4 }, { text: "ca", type: "normal", index: 5 }
      ],
      accents: [4],
      figuresOfSpeech: ["Sineddoche"],
      meaning: "Il poeta è costretto a guardare il viso del suo compagno che non c'è più. Inizia a descrivere i dettagli più tristi e dolenti che vede nel buio."
    },
    {
      verse: "digrignata",
      meter: "Quadrisillabo",
      scansion: [
        { text: "di", type: "normal", index: 1 }, { text: "gri", type: "normal", index: 2 }, { text: "gna", type: "accented", index: 3 }, { text: "ta", type: "normal", index: 4 }
      ],
      accents: [3],
      figuresOfSpeech: ["Participio passato"],
      meaning: "La bocca del suo amico è rimasta bloccata in una smorfia, con i denti stretti. È il segno visibile del grande dolore che ha sofferto prima di morire."
    },
    {
      verse: "volta al plenilunio",
      meter: "Settenario",
      scansion: [
        { text: "vol", type: "accented", index: 1 }, { text: "ta_al", type: "sinalefe", index: 2 }, { text: "ple", type: "normal", index: 3 }, { text: "ni", type: "normal", index: 4 }, { text: "lu", type: "accented", index: 5 }, { text: "nio", type: "normal", index: 6 }
      ],
      accents: [1, 5],
      figuresOfSpeech: ["Sinalefe", "Immagine evocativa"],
      meaning: "Il viso pallido del soldato morto è girato verso l'alto, illuminato dalla luce bianca e fredda della luna piena, che rende tutta la scena ancora più spettrale."
    },
    {
      verse: "con la congestione",
      meter: "Senario",
      scansion: [
        { text: "con", type: "normal", index: 1 }, { text: "la", type: "normal", index: 2 }, { text: "con", type: "normal", index: 3 }, { text: "ge", type: "normal", index: 4 }, { text: "stio", type: "accented", index: 5 }, { text: "ne", type: "normal", index: 6 }
      ],
      accents: [5],
      figuresOfSpeech: ["Metafora medica"],
      meaning: "Il poeta nota i segni che la morte lascia sul corpo. Questa parola medica fa capire che il sangue si è fermato, rendendo la pelle gonfia e di colore scuro, come un livido."
    },
    {
      verse: "delle sue mani",
      meter: "Senario",
      scansion: [
        { text: "del", type: "normal", index: 1 }, { text: "le", type: "normal", index: 2 }, { text: "sue", type: "normal", index: 3 }, { text: "ma", type: "accented", index: 4 }, { text: "ni", type: "normal", index: 5 }
      ],
      accents: [4],
      figuresOfSpeech: ["Sineddoche"],
      meaning: "Il corpo non si muove più. Quelle mani che prima servivano per prendere le cose, per scrivere o abbracciare, ora sono gonfie, rigide e senza vita."
    },
    {
      verse: "penetrata",
      meter: "Quadrisillabo",
      scansion: [
        { text: "pe", type: "normal", index: 1 }, { text: "ne", type: "normal", index: 2 }, { text: "tra", type: "accented", index: 3 }, { text: "ta", type: "normal", index: 4 }
      ],
      accents: [3],
      figuresOfSpeech: ["Participio passato", "Metafora"],
      meaning: "Tutta questa scena di morte e tutto questo orrore non restano solo fuori, ma entrano con forza dentro il cuore e la mente del poeta, facendogli un male profondo."
    },
    {
      verse: "nel mio silenzio",
      meter: "Senario",
      scansion: [
        { text: "nel", type: "normal", index: 1 }, { text: "mio", type: "normal", index: 2 }, { text: "si", type: "normal", index: 3 }, { text: "len", type: "accented", index: 4 }, { text: "zio", type: "normal", index: 5 }
      ],
      accents: [4],
      figuresOfSpeech: ["Chiasmo emotivo"],
      meaning: "Il poeta non parla, non urla. Il dolore è così grande che gli toglie la voce e lo chiude in un dolore silenzioso mentre osserva il corpo quasi abbracciato al suo amico."
    },
    {
      verse: "ho scritto",
      meter: "Ternario",
      scansion: [
        { text: "ho", type: "normal", index: 1 }, { text: "scrit", type: "accented", index: 2 }, { text: "to", type: "normal", index: 3 }
      ],
      accents: [2],
      figuresOfSpeech: ["Brevitas"],
      meaning: "Proprio in mezzo a tutta questa morte e tristezza, il poeta fa una cosa inaspettata. Prende un foglio e trova la forza di compiere un'azione bella e viva."
    },
    {
      verse: "lettere piene d'amore",
      meter: "Novenario",
      scansion: [
        { text: "let", type: "normal", index: 1 }, { text: "te", type: "normal", index: 2 }, { text: "re", type: "normal", index: 3 }, { text: "pie", type: "accented", index: 4 }, { text: "ne", type: "normal", index: 5 }, { text: "d'a", type: "normal", index: 6 }, { text: "mo", type: "accented", index: 7 }, { text: "re", type: "normal", index: 8 }
      ],
      accents: [4, 7],
      figuresOfSpeech: ["Antitesi (rispetto alla morte)"],
      meaning: "Decide di scrivere messaggi per i suoi cari, concentrandosi sull'affetto e sui sentimenti belli. Sceglie l'amore come medicina per rispondere alla morte e alla paura."
    },
    {
      verse: "Non sono mai stato",
      meter: "Senario",
      scansion: [
        { text: "Non", type: "normal", index: 1 }, { text: "so", type: "normal", index: 2 }, { text: "no", type: "normal", index: 3 }, { text: "mai", type: "accented", index: 4 }, { text: "sta", type: "normal", index: 5 }, { text: "to", type: "normal", index: 6 }
      ],
      accents: [4],
      figuresOfSpeech: ["Affermazione"],
      meaning: "Siamo alla fine della poesia. Il poeta si rende conto di un pensiero fortissimo, una cosa vera e profonda che non aveva mai capito così bene nella sua vita."
    },
    {
      verse: "tanto",
      meter: "Bisillabo",
      scansion: [
        { text: "tan", type: "accented", index: 1 }, { text: "to", type: "normal", index: 2 }
      ],
      accents: [1],
      figuresOfSpeech: ["Parola-verso"],
      meaning: "Questa parola, formata da poche lettere e messa da sola sulla riga, serve a farci sentire quanto è grande, immenso e forte il sentimento che sta provando."
    },
    {
      verse: "attaccato alla vita.",
      meter: "Ottonario",
      scansion: [
        { text: "at", type: "normal", index: 1 }, { text: "tac", type: "normal", index: 2 }, { text: "ca", type: "accented", index: 3 }, { text: "to_al", type: "sinalefe", index: 4 }, { text: "la", type: "normal", index: 5 }, { text: "vi", type: "accented", index: 6 }, { text: "ta", type: "normal", index: 7 }
      ],
      accents: [3, 6],
      figuresOfSpeech: ["Sinalefe"],
      meaning: "È il miracolo di questa poesia: proprio perché ha visto la morte in faccia in modo così brutto, il poeta scopre quanto è prezioso e meraviglioso il solo fatto di essere vivi."
    },
    {
      verse: "Cima Quattro il 23 dicembre 1915",
      meter: "Datario (Verso libero)",
      scansion: [
        { text: "Ci", type: "normal", index: 1 }, { text: "ma", type: "normal", index: 2 }, { text: "Quat", type: "accented", index: 3 }, { text: "tro_il", type: "sinalefe", index: 4 }, { text: "ven", type: "normal", index: 5 }, { text: "ti", type: "normal", index: 6 }, { text: "tré", type: "accented", index: 7 }, { text: "di", type: "normal", index: 8 }, { text: "cem", type: "accented", index: 9 }, { text: "bre", type: "normal", index: 10 }, { text: "1915", type: "normal", index: 11 }
      ],
      accents: [3, 7, 9],
      figuresOfSpeech: ["Epitaffio narrativo"],
      meaning: "L'indicazione spaziotemporale tipica delle poesie de L'Allegria: àncora l'evento a un istante preciso, dandogli il valore di una pagina di diario di guerra incancellabile."
    }
  ],
  "Sera di Liguria": [
    {
      verse: "Lenta e rosata sale su dal mare",
      meter: "Endecasillabo",
      scansion: [
        { text: "Len", type: "normal", index: 1 }, { text: "ta_e", type: "sinalefe", index: 2 }, { text: "ro", type: "normal", index: 3 }, { text: "sa", type: "accented", index: 4 }, { text: "ta", type: "normal", index: 5 }, { text: "sa", type: "accented", index: 6 }, { text: "le", type: "normal", index: 7 }, { text: "su", type: "normal", index: 8 }, { text: "dal", type: "normal", index: 9 }, { text: "ma", type: "accented", index: 10 }, { text: "re", type: "normal", index: 11 }
      ],
      accents: [4, 6, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Sinalefe", "Allitterazione (s)", "Anastrofe"],
      meaning: "L'aggettivo 'rosata' definisce cromaticamente l'inizio del crepuscolo ligure."
    },
    {
      verse: "la sera di Liguria, perdizione",
      meter: "Endecasillabo",
      scansion: [
        { text: "la", type: "normal", index: 1 }, { text: "se", type: "accented", index: 2 }, { text: "ra", type: "normal", index: 3 }, { text: "di", type: "normal", index: 4 }, { text: "Li", type: "normal", index: 5 }, { text: "gu", type: "accented", index: 6 }, { text: "ria", type: "normal", index: 7 }, { text: "per", type: "normal", index: 8 }, { text: "di", type: "normal", index: 9 }, { text: "zio", type: "accented", index: 10 }, { text: "ne", type: "normal", index: 11 }
      ],
      accents: [2, 6, 10],
      caesuraIndex: 7,
      figuresOfSpeech: ["Metafora (perdizione)", "Enjambement"],
      meaning: "La 'perdizione' indica l'incanto quasi ipnotico del paesaggio serale."
    },
    {
      verse: "di cuori amanti e di cose lontane.",
      meter: "Endecasillabo",
      scansion: [
        { text: "di", type: "normal", index: 1 }, { text: "cuo", type: "accented", index: 2 }, { text: "ri_a", type: "sinalefe", index: 3 }, { text: "man", type: "accented", index: 4 }, { text: "ti_e", type: "sinalefe", index: 5 }, { text: "di", type: "normal", index: 6 }, { text: "co", type: "accented", index: 7 }, { text: "se", type: "normal", index: 8 }, { text: "lon", type: "normal", index: 9 }, { text: "ta", type: "accented", index: 10 }, { text: "ne", type: "normal", index: 11 }
      ],
      accents: [2, 4, 7, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Sinalefe (doppia)", "Parallelismo"],
      meaning: "Soggettività (cuori) e oggettività (cose) si fondono nel sentimento della nostalgia."
    },
    {
      verse: "Indugiano le coppie nei giardini,",
      meter: "Endecasillabo",
      scansion: [
        { text: "In", type: "normal", index: 1 }, { text: "du", type: "accented", index: 2 }, { text: "gia", type: "normal", index: 3 }, { text: "no", type: "normal", index: 4 }, { text: "le", type: "normal", index: 5 }, { text: "cop", type: "accented", index: 6 }, { text: "pie", type: "normal", index: 7 }, { text: "nei", type: "normal", index: 8 }, { text: "giar", type: "accented", index: 9 }, { text: "di", type: "accented", index: 10 }, { text: "ni", type: "normal", index: 11 }
      ],
      accents: [2, 6, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Inversione"],
      meaning: "La lentezza del crepuscolo si riflette nel movimento delle figure umane."
    },
    {
      verse: "s'accendon le finestre ad una ad una",
      meter: "Endecasillabo",
      scansion: [
        { text: "s'ac", type: "normal", index: 1 }, { text: "cen", type: "accented", index: 2 }, { text: "don", type: "normal", index: 3 }, { text: "le", type: "normal", index: 4 }, { text: "fi", type: "normal", index: 5 }, { text: "ne", type: "accented", index: 6 }, { text: "stre_ad", type: "sinalefe", index: 7 }, { text: "u", type: "accented", index: 8 }, { text: "na_ad", type: "sinalefe", index: 9 }, { text: "u", type: "accented", index: 10 }, { text: "na", type: "normal", index: 11 }
      ],
      accents: [2, 6, 8, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Sinalefe (doppia)", "Ripetizione"],
      meaning: "Dinamismo visivo dato dalle luci che si accendono in successione."
    },
    {
      verse: "come tanti teatri.",
      meter: "Settenario",
      scansion: [
        { text: "co", type: "accented", index: 1 }, { text: "me", type: "normal", index: 2 }, { text: "tan", type: "accented", index: 3 }, { text: "ti", type: "normal", index: 4 }, { text: "te", type: "accented", index: 5 }, { text: "a", type: "normal", index: 6 }, { text: "tri", type: "normal", index: 7 }
      ],
      accents: [1, 3, 5],
      figuresOfSpeech: ["Similitudine", "Allitterazione (t)"],
      meaning: "Metafora della vita privata vista dall'esterno come una rappresentazione scenica."
    },
    {
      verse: "Sepolto nella bruma il mare odora.",
      meter: "Endecasillabo",
      scansion: [
        { text: "Se", type: "normal", index: 1 }, { text: "pol", type: "accented", index: 2 }, { text: "to", type: "normal", index: 3 }, { text: "nel", type: "normal", index: 4 }, { text: "la", type: "normal", index: 5 }, { text: "bru", type: "accented", index: 6 }, { text: "ma_il", type: "sinalefe", index: 7 }, { text: "ma", type: "accented", index: 8 }, { text: "re_o", type: "sinalefe", index: 9 }, { text: "do", type: "accented", index: 10 }, { text: "ra", type: "normal", index: 11 }
      ],
      accents: [2, 6, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Sinestesia (bruma/odora)", "Sinalefe"],
      meaning: "Sinestesia che unisce la vista (bruma) all'olfatto (odora)."
    },
    {
      verse: "Le chiese sulla riva paion navi",
      meter: "Endecasillabo",
      scansion: [
        { text: "Le", type: "normal", index: 1 }, { text: "chie", type: "accented", index: 2 }, { text: "se", type: "normal", index: 3 }, { text: "sul", type: "normal", index: 4 }, { text: "la", type: "normal", index: 5 }, { text: "ri", type: "accented", index: 6 }, { text: "va", type: "normal", index: 7 }, { text: "pa", type: "accented", index: 8 }, { text: "ion", type: "normal", index: 9 }, { text: "na", type: "accented", index: 10 }, { text: "vi", type: "normal", index: 11 }
      ],
      accents: [2, 6, 8, 10],
      caesuraIndex: 7,
      figuresOfSpeech: ["Similitudine", "Enjambement"],
      meaning: "Similitudine architettonica tipica del paesaggio ligure costiero."
    },
    {
      verse: "che stanno per salpare.",
      meter: "Settenario",
      scansion: [
        { text: "che", type: "normal", index: 1 }, { text: "stan", type: "accented", index: 2 }, { text: "no", type: "normal", index: 3 }, { text: "per", type: "normal", index: 4 }, { text: "sal", type: "accented", index: 5 }, { text: "pa", type: "accented", index: 6 }, { text: "re", type: "normal", index: 7 }
      ],
      accents: [2, 6],
      figuresOfSpeech: ["Metafora"],
      meaning: "Conclusione che evoca il viaggio e l'evasione spirituale."
    }
  ],
  "San Martino": [
    {
      verse: "La nebbia a gl’irti colli",
      meter: "Settenario",
      scansion: [{ text: "La", type: "normal", index: 1 }, { text: "neb", type: "normal", index: 2 }, { text: "bia_a", type: "sinalefe", index: 3 }, { text: "gl’ir", type: "normal", index: 4 }, { text: "ti", type: "normal", index: 5 }, { text: "col", type: "accented", index: 6 }, { text: "li", type: "normal", index: 7 }],
      accents: [6],
      figuresOfSpeech: ["Sinalefe", "Inversione"],
      meaning: "Il contrasto visivo tra la nebbia e la durezza ('irti') dei colli."
    },
    {
      verse: "Piovigginando sale,",
      meter: "Settenario",
      scansion: [{ text: "Pio", type: "normal", index: 1 }, { text: "vig", type: "normal", index: 2 }, { text: "gi", type: "normal", index: 3 }, { text: "nan", type: "normal", index: 4 }, { text: "do", type: "normal", index: 5 }, { text: "sa", type: "accented", index: 6 }, { text: "le", type: "normal", index: 7 }],
      accents: [6],
      figuresOfSpeech: ["Gerundio", "Enjambement"],
      meaning: "L'umidità autunnale personificata nel suo salire verso l'alto."
    },
    {
      verse: "E sotto il maestrale",
      meter: "Settenario",
      scansion: [{ text: "E", type: "normal", index: 1 }, { text: "sot", type: "normal", index: 2 }, { text: "to_il", type: "sinalefe", index: 3 }, { text: "ma", type: "normal", index: 4 }, { text: "e", type: "normal", index: 5 }, { text: "stra", type: "accented", index: 6 }, { text: "le", type: "normal", index: 7 }],
      accents: [6],
      figuresOfSpeech: ["Sinalefe", "Enjambement"],
      meaning: "Il vento impetuoso che agita la scena naturale."
    },
    {
      verse: "Urla e biancheggia il mar;",
      meter: "Settenario tronco",
      scansion: [{ text: "Ur", type: "accented", index: 1 }, { text: "la_e", type: "sinalefe", index: 2 }, { text: "bian", type: "normal", index: 3 }, { text: "cheg", type: "normal", index: 4 }, { text: "gia_il", type: "sinalefe", index: 5 }, { text: "mar", type: "accented", index: 6 }],
      accents: [1, 6],
      figuresOfSpeech: ["Sinestesia (Urla/biancheggia)", "Personificazione", "Sinalefe"],
      meaning: "Sinestesia uditiva (urla) e visiva (biancheggia) della tempesta."
    },
    {
      verse: "Ma per le vie del borgo",
      meter: "Settenario",
      scansion: [{ text: "Ma", type: "normal", index: 1 }, { text: "per", type: "normal", index: 2 }, { text: "le", type: "normal", index: 3 }, { text: "vie", type: "normal", index: 4 }, { text: "del", type: "normal", index: 5 }, { text: "bor", type: "accented", index: 6 }, { text: "go", type: "normal", index: 7 }],
      accents: [6],
      figuresOfSpeech: ["Enjambement"],
      meaning: "Passaggio dal paesaggio naturale esterno a quello umano del borgo."
    },
    {
      verse: "Dal ribollir de’ tini",
      meter: "Settenario",
      scansion: [{ text: "Dal", type: "normal", index: 1 }, { text: "ri", type: "normal", index: 2 }, { text: "bol", type: "normal", index: 3 }, { text: "lir", type: "normal", index: 4 }, { text: "de’", type: "normal", index: 5 }, { text: "ti", type: "accented", index: 6 }, { text: "ni", type: "normal", index: 7 }],
      accents: [6],
      figuresOfSpeech: ["Onomatopea (ribollir)"],
      meaning: "L'atmosfera del lavoro agricolo e della vendemmia."
    },
    {
      verse: "Va l’aspro odor de i vini",
      meter: "Settenario",
      scansion: [{ text: "Va", type: "normal", index: 1 }, { text: "l’as", type: "normal", index: 2 }, { text: "pro_o", type: "sinalefe", index: 3 }, { text: "dor", type: "normal", index: 4 }, { text: "de_i", type: "sinalefe", index: 5 }, { text: "vi", type: "accented", index: 6 }, { text: "ni", type: "normal", index: 7 }],
      accents: [6],
      figuresOfSpeech: ["Sinestesia (aspro odor)", "Sinalefe"],
      meaning: "Sensazione olfattiva forte e caratteristica."
    },
    {
      verse: "L’anime a rallegrar.",
      meter: "Settenario tronco",
      scansion: [{ text: "L’a", type: "normal", index: 1 }, { text: "ni", type: "normal", index: 2 }, { text: "me_a", type: "sinalefe", index: 3 }, { text: "ral", type: "normal", index: 4 }, { text: "le", type: "normal", index: 5 }, { text: "grar", type: "accented", index: 6 }],
      accents: [6],
      figuresOfSpeech: ["Sinalefe", "Apocope (grar)"],
      meaning: "L'effetto rasserenante della festa popolare."
    },
    {
      verse: "Gira su’ ceppi accesi",
      meter: "Settenario",
      scansion: [{ text: "Gi", type: "accented", index: 1 }, { text: "ra", type: "normal", index: 2 }, { text: "su’", type: "normal", index: 3 }, { text: "cep", type: "normal", index: 4 }, { text: "pi_ac", type: "sinalefe", index: 5 }, { text: "ce", type: "accented", index: 6 }, { text: "si", type: "normal", index: 7 }],
      accents: [1, 6],
      figuresOfSpeech: ["Sinalefe"],
      meaning: "L'interno domestico accogliente del focolare."
    },
    {
      verse: "Lo spiedo scoppiettando:",
      meter: "Settenario",
      scansion: [{ text: "Lo", type: "normal", index: 1 }, { text: "spie", type: "normal", index: 2 }, { text: "do", type: "normal", index: 3 }, { text: "scop", type: "normal", index: 4 }, { text: "piet", type: "normal", index: 5 }, { text: "tan", type: "accented", index: 6 }, { text: "do", type: "normal", index: 7 }],
      accents: [6],
      figuresOfSpeech: ["Onomatopea (scoppiettando)", "Allitterazione (s, p)"],
      meaning: "Onomatopea visiva e uditiva della cottura."
    },
    {
      verse: "Sta il cacciator fischiando",
      meter: "Settenario",
      scansion: [{ text: "Sta_il", type: "sinalefe", index: 1 }, { text: "cac", type: "normal", index: 2 }, { text: "cia", type: "normal", index: 3 }, { text: "tor", type: "normal", index: 4 }, { text: "fi", type: "normal", index: 5 }, { text: "schian", type: "accented", index: 6 }, { text: "do", type: "normal", index: 7 }],
      accents: [6],
      figuresOfSpeech: ["Sinalefe"],
      meaning: "Il realismo della vita quotidiana rurale."
    },
    {
      verse: "Su l’uscio a rimirar",
      meter: "Settenario tronco",
      scansion: [{ text: "Su", type: "normal", index: 1 }, { text: "l’u", type: "normal", index: 2 }, { text: "scio_a", type: "sinalefe", index: 3 }, { text: "ri", type: "normal", index: 4 }, { text: "mi", type: "normal", index: 5 }, { text: "rar", type: "accented", index: 6 }],
      accents: [6],
      figuresOfSpeech: ["Sinalefe", "Troncamento"],
      meaning: "Atto di contemplazione serena del mondo esterno."
    },
    {
      verse: "Tra le rossastre nubi",
      meter: "Settenario",
      scansion: [{ text: "Tra", type: "normal", index: 1 }, { text: "le", type: "normal", index: 2 }, { text: "ros", type: "normal", index: 3 }, { text: "sa", type: "normal", index: 4 }, { text: "stre", type: "normal", index: 5 }, { text: "nu", type: "accented", index: 6 }, { text: "bi", type: "normal", index: 7 }],
      accents: [6],
      figuresOfSpeech: ["Enjambement"],
      meaning: "Colorismo pittorico del tramonto autunnale."
    },
    {
      verse: "Stormi d’uccelli neri,",
      meter: "Settenario",
      scansion: [{ text: "Stor", type: "normal", index: 1 }, { text: "mi", type: "normal", index: 2 }, { text: "d’uc", type: "normal", index: 3 }, { text: "cel", type: "normal", index: 4 }, { text: "li", type: "normal", index: 5 }, { text: "ne", type: "accented", index: 6 }, { text: "ri", type: "normal", index: 7 }],
      accents: [6],
      figuresOfSpeech: ["Simbolismo"],
      meaning: "Immagine malinconica e visiva in movimento."
    },
    {
      verse: "Com’esuli pensieri,",
      meter: "Settenario",
      scansion: [{ text: "Com’", type: "normal", index: 1 }, { text: "e", type: "accented", index: 2 }, { text: "su", type: "normal", index: 3 }, { text: "li", type: "normal", index: 4 }, { text: "pen", type: "normal", index: 5 }, { text: "sie", type: "accented", index: 6 }, { text: "ri", type: "normal", index: 7 }],
      accents: [2, 6],
      figuresOfSpeech: ["Similitudine", "Personificazione"],
      meaning: "Similitudine tra la natura e la condizione psicologica dell'esilio interiore."
    },
    {
      verse: "Nel vespere migrar.",
      meter: "Settenario tronco",
      scansion: [{ text: "Nel", type: "normal", index: 1 }, { text: "ve", type: "accented", index: 2 }, { text: "spe", type: "normal", index: 3 }, { text: "re", type: "normal", index: 4 }, { text: "mi", type: "normal", index: 5 }, { text: "grar", type: "accented", index: 6 }],
      accents: [2, 6],
      figuresOfSpeech: ["Troncamento", "Latinismo (vespere)"],
      meaning: "Conclusione ciclica che rimanda al tema del tempo che passa."
    }
  ],
  "L'infinito": [
    {
      verse: "Sempre caro mi fu quest'ermo colle,",
      meter: "Endecasillabo",
      scansion: [{ text: "Sem", type: "accented", index: 1 }, { text: "pre", type: "normal", index: 2 }, { text: "ca", type: "accented", index: 3 }, { text: "ro", type: "normal", index: 4 }, { text: "mi", type: "normal", index: 5 }, { text: "fu", type: "normal", index: 6 }, { text: "quest'", type: "sinalefe", index: 7 }, { text: "er", type: "accented", index: 8 }, { text: "mo", type: "normal", index: 9 }, { text: "col", type: "accented", index: 10 }, { text: "le", type: "normal", index: 11 }],
      accents: [1, 3, 8, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Inversione", "Aferesi (quest'ermo)", "Sinalefe"],
      meaning: "L'attaccamento affettivo del poeta ai luoghi della sua giovinezza."
    },
    {
      verse: "e questa siepe, che da tanta parte",
      meter: "Endecasillabo",
      scansion: [{ text: "e", type: "normal", index: 1 }, { text: "que", type: "accented", index: 2 }, { text: "sta", type: "normal", index: 3 }, { text: "sie", type: "accented", index: 4 }, { text: "pe,", type: "normal", index: 5 }, { text: "che", type: "normal", index: 6 }, { text: "da", type: "normal", index: 7 }, { text: "tan", type: "accented", index: 8 }, { text: "ta", type: "normal", index: 9 }, { text: "par", type: "accented", index: 10 }, { text: "te", type: "normal", index: 11 }],
      accents: [2, 4, 8, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Enjambement"],
      meaning: "La siepe come limite fisico che stimola la capacità immaginativa."
    },
    {
      verse: "dell'ultimo orizzonte il guardo esclude.",
      meter: "Endecasillabo",
      scansion: [{ text: "del", type: "normal", index: 1 }, { text: "l'ul", type: "accented", index: 2 }, { text: "ti", type: "normal", index: 3 }, { text: "mo_o", type: "sinalefe", index: 4 }, { text: "riz", type: "normal", index: 5 }, { text: "zon", type: "accented", index: 6 }, { text: "te_il", type: "sinalefe", index: 7 }, { text: "guar", type: "accented", index: 8 }, { text: "do_e", type: "sinalefe", index: 9 }, { text: "sclu", type: "accented", index: 10 }, { text: "de", type: "normal", index: 11 }],
      accents: [2, 6, 8, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Enjambement", "Sinalefe (tripla)"],
      meaning: "L'impedimento visivo che permette la visione interiore."
    },
    {
      verse: "Ma sedendo e mirando, interminati",
      meter: "Endecasillabo",
      scansion: [
        { text: "Ma", type: "normal", index: 1 }, { text: "se", type: "accented", index: 2 }, { text: "den", type: "normal", index: 3 }, { text: "do_e", type: "sinalefe", index: 4 }, { text: "mi", type: "normal", index: 5 }, { text: "ran", type: "accented", index: 6 }, { text: "do,", type: "normal", index: 7 }, { text: "in", type: "normal", index: 8 }, { text: "ter", type: "normal", index: 9 }, { text: "mi", type: "normal", index: 10 }, { text: "na", type: "accented", index: 11 }, { text: "ti", type: "normal", index: 12 }
      ],
      accents: [2, 6, 11],
      caesuraIndex: 7,
      figuresOfSpeech: ["Enjambement", "Sinalefe", "Cesura"],
      meaning: "Regola Aurea dell'endecasillabo: l'ultimo accento tonico deve cadere sulla 10ª sillaba. Qui, pur contando 12 sillabe fisiche (se 'do, in' non fanno sinalefe), l'accento tonico principale cade sulla sillaba 'na' (11ª fisica, ma 10ª metrica se consideriamo una dialefe alla cesura). Il ritmo regolare (2ª, 6ª, 10ª) e l'enjambement dilatano fisicamente il verso verso l'infinito."
    },
    {
      verse: "spazi di là da quella, e sovrumani",
      meter: "Endecasillabo",
      scansion: [{ text: "spa", type: "accented", index: 1 }, { text: "zi", type: "normal", index: 2 }, { text: "di", type: "normal", index: 3 }, { text: "là", type: "accented", index: 4 }, { text: "da", type: "normal", index: 5 }, { text: "quel", type: "accented", index: 6 }, { text: "la_e", type: "sinalefe", index: 7 }, { text: "sov", type: "normal", index: 8 }, { text: "ru", type: "accented", index: 9 }, { text: "ma", type: "accented", index: 10 }, { text: "ni", type: "normal", index: 11 }],
      accents: [1, 4, 6, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Enjambement", "Iperbole", "Tripla Sinalefe (possibile)"],
      meaning: "L'enjambement si chiude su 'spazi'. Attenzione alla metrica: qui c'è una complessità notevole (sinalefe tra 'quella' ed 'e', o potenzialmente 'tripla sinalefe' se collegata al verso precedente) che sfida il lettore a mantenere l'unità del verso."
    },
    {
      verse: "silenzi, e profondissima quiete",
      meter: "Endecasillabo",
      scansion: [{ text: "si", type: "normal", index: 1 }, { text: "len", type: "accented", index: 2 }, { text: "zi,", type: "normal", index: 3 }, { text: "e", type: "normal", index: 4 }, { text: "pro", type: "normal", index: 5 }, { text: "fon", type: "normal", index: 6 }, { text: "dis", type: "accented", index: 7 }, { text: "si", type: "normal", index: 8 }, { text: "ma", type: "normal", index: 9 }, { text: "quie", type: "accented", index: 10 }, { text: "te", type: "normal", index: 11 }],
      accents: [2, 7, 10],
      caesuraIndex: 3,
      figuresOfSpeech: ["Dialefe", "Sineresi", "Climax"],
      meaning: "Endecasillabo apparentemente irregolare ma perfetto. La virgola impone una dialefe (separazione) tra 'silenzi' ed 'e'. 'Quiete' conta come 2 sillabe (quie-te) per sineresi, portando l'accento sulla 10ª ('quie'). La lunghezza della parola 'profondissima' (5 sillabe) occupa gran parte del verso, suggerendo la vastità del silenzio."
    },
    {
      verse: "io nel pensier mi fingo; ove per poco",
      meter: "Endecasillabo",
      scansion: [{ text: "io", type: "normal", index: 1 }, { text: "nel", type: "normal", index: 2 }, { text: "pen", type: "accented", index: 3 }, { text: "sier", type: "accented", index: 4 }, { text: "mi", type: "normal", index: 5 }, { text: "fin", type: "accented", index: 6 }, { text: "go_o", type: "sinalefe", index: 7 }, { text: "ve", type: "accented", index: 8 }, { text: "per", type: "normal", index: 9 }, { text: "po", type: "accented", index: 10 }, { text: "co", type: "normal", index: 11 }],
      accents: [4, 6, 8, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Enjambement", "Sinalefe"],
      meaning: "L'attività creativa e volontaria dell'immaginazione ('fingo')."
    },
    {
      verse: "il cor non si spaura. E come il vento",
      meter: "Endecasillabo",
      scansion: [{ text: "il", type: "normal", index: 1 }, { text: "cor", type: "accented", index: 2 }, { text: "non", type: "normal", index: 3 }, { text: "si", type: "normal", index: 4 }, { text: "spa", type: "accented", index: 5 }, { text: "u", type: "accented", index: 6 }, { text: "ra", type: "normal", index: 7 }, { text: "E", type: "normal", index: 8 }, { text: "co", type: "accented", index: 9 }, { text: "me_il", type: "sinalefe", index: 10 }, { text: "ven", type: "accented", index: 11 }],
      accents: [2, 6, 10],
      caesuraIndex: 7,
      figuresOfSpeech: ["Enjambement", "Similitudine"],
      meaning: "Il brivido del sublime davanti all'immensità."
    },
    {
      verse: "odo stormir tra queste piante, io quello",
      meter: "Endecasillabo",
      scansion: [{ text: "o", type: "accented", index: 1 }, { text: "do", type: "normal", index: 2 }, { text: "stor", type: "accented", index: 3 }, { text: "mir", type: "accented", index: 4 }, { text: "tra", type: "normal", index: 5 }, { text: "que", type: "accented", index: 6 }, { text: "ste", type: "normal", index: 7 }, { text: "pian", type: "accented", index: 8 }, { text: "te_io", type: "sinalefe", index: 9 }, { text: "quel", type: "accented", index: 10 }, { text: "lo", type: "normal", index: 11 }],
      accents: [1, 4, 6, 8, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Onomatopea (stormir)", "Enjambement"],
      meaning: "Il richiamo della realtà fisica che irrompe nell'astrazione."
    },
    {
      verse: "infinito silenzio a questa voce",
      meter: "Endecasillabo",
      scansion: [{ text: "in", type: "normal", index: 1 }, { text: "fi", type: "accented", index: 2 }, { text: "ni", type: "normal", index: 3 }, { text: "to", type: "normal", index: 4 }, { text: "si", type: "accented", index: 5 }, { text: "len", type: "accented", index: 6 }, { text: "zio_a", type: "sinalefe", index: 7 }, { text: "que", type: "accented", index: 8 }, { text: "sta", type: "normal", index: 9 }, { text: "vo", type: "accented", index: 10 }, { text: "ce", type: "normal", index: 11 }],
      accents: [2, 6, 8, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Antitesi (silenzio/voce)", "Enjambement"],
      meaning: "Contrasto tra il silenzio eterno e il suono passeggero della natura."
    },
    {
      verse: "vo comparando: e mi sovvien l'eterno,",
      meter: "Endecasillabo",
      scansion: [{ text: "vo", type: "normal", index: 1 }, { text: "com", type: "normal", index: 2 }, { text: "pa", type: "accented", index: 3 }, { text: "ran", type: "accented", index: 4 }, { text: "do_e", type: "sinalefe", index: 5 }, { text: "mi", type: "normal", index: 6 }, { text: "sov", type: "normal", index: 7 }, { text: "vien", type: "accented", index: 8 }, { text: "l'e", type: "normal", index: 9 }, { text: "ter", type: "accented", index: 10 }, { text: "no", type: "normal", index: 11 }],
      accents: [4, 8, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Enjambement", "Sinalefe"],
      meaning: "Passaggio logico dal concetto di spazio a quello di tempo infinito."
    },
    {
      verse: "e le morte stagioni, e la presente",
      meter: "Endecasillabo",
      scansion: [{ text: "e", type: "normal", index: 1 }, { text: "le", type: "normal", index: 2 }, { text: "mor", type: "accented", index: 3 }, { text: "te", type: "normal", index: 4 }, { text: "sta", type: "normal", index: 5 }, { text: "gio", type: "accented", index: 6 }, { text: "ni_e", type: "sinalefe", index: 7 }, { text: "la", type: "normal", index: 8 }, { text: "pre", type: "accented", index: 9 }, { text: "sen", type: "accented", index: 10 }, { text: "te", type: "normal", index: 11 }],
      accents: [3, 6, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Poliptoto (morte/presente)", "Enjambement"],
      meaning: "Riflessione sulla storia passata e sulla vitalità dell'istante attuale."
    },
    {
      verse: "e viva, e il suon di lei. Così tra questa",
      meter: "Endecasillabo",
      scansion: [
        { text: "e", type: "normal", index: 1 },
        { text: "vi", type: "accented", index: 2 },
        { text: "va,", type: "normal", index: 3 },
        { text: "e_il", type: "sinalefe", index: 4 },
        { text: "suon", type: "accented", index: 5 },
        { text: "di", type: "normal", index: 6 },
        { text: "lei.", type: "accented", index: 7 },
        { text: "Co", type: "normal", index: 8 },
        { text: "sì", type: "accented", index: 9 },
        { text: "tra", type: "normal", index: 10 },
        { text: "que", type: "accented", index: 11 },
        { text: "sta", type: "normal", index: 12 }
      ],
      accents: [2, 5, 7, 9, 11],
      caesuraIndex: 7,
      figuresOfSpeech: ["Enjambement", "Sinalefe"],
      meaning: "Sfida metrica: la sequenza di congiunzioni e accenti forti su 'lei' e 'Così' dà ritmo, ma il conteggio prosegue fino alla decima sillaba accentata ('que'), nonostante il verso conti fisicamente 12 sillabe."
    },
    {
      verse: "immensità s'annega il pensier mio:",
      meter: "Endecasillabo",
      scansion: [
        { text: "im", type: "normal", index: 1 },
        { text: "men", type: "normal", index: 2 },
        { text: "si", type: "normal", index: 3 },
        { text: "tà", type: "accented", index: 4 },
        { text: "s'an", type: "normal", index: 5 },
        { text: "ne", type: "normal", index: 6 },
        { text: "ga_il", type: "sinalefe", index: 7 },
        { text: "pen", type: "normal", index: 8 },
        { text: "sier", type: "normal", index: 9 },
        { text: "mi", type: "accented", index: 10 },
        { text: "o", type: "normal", index: 11 }
      ],
      accents: [4, 10],
      caesuraIndex: 4,
      figuresOfSpeech: ["Metafora", "Sinalefe", "Dieresi"],
      meaning: "Parola tronca interna ('immensità') e 'mio' finale che vale due sillabe (dieresi/iato). L'accento cade sulla 'i' di 'mio' (10ª sillaba), confermando l'endecasillabo perfetto. La lunghezza delle parole dilata la percezione del verso."
    },
    {
      verse: "e il naufragar m'è dolce in questo mare.",
      meter: "Endecasillabo",
      scansion: [{ text: "e_il", type: "sinalefe", index: 1 }, { text: "nau", type: "accented", index: 2 }, { text: "fra", type: "normal", index: 3 }, { text: "gar", type: "accented", index: 4 }, { text: "m'è", type: "accented", index: 5 }, { text: "dol", type: "accented", index: 6 }, { text: "ce_in", type: "sinalefe", index: 7 }, { text: "que", type: "accented", index: 8 }, { text: "sto", type: "normal", index: 9 }, { text: "ma", type: "accented", index: 10 }, { text: "re", type: "normal", index: 11 }],
      accents: [2, 4, 6, 8, 10],
      caesuraIndex: 4,
      figuresOfSpeech: ["Ossimoro (naufragar/dolce)", "Metafora (mare)"],
      meaning: "Conclusione paradossale: l'annullamento di sé è fonte di piacere spirituale."
    }
  ],
  "Solo e pensoso": [
    {
      verse: "Solo e pensoso i più deserti campi",
      meter: "Endecasillabo",
      scansion: [
        { text: "So", type: "accented", index: 1 }, { text: "lo_e", type: "sinalefe", index: 2 }, { text: "pen", type: "normal", index: 3 }, { text: "so", type: "accented", index: 4 }, { text: "so_i", type: "sinalefe", index: 5 }, { text: "più", type: "normal", index: 6 }, { text: "de", type: "normal", index: 7 }, { text: "ser", type: "accented", index: 8 }, { text: "ti", type: "normal", index: 9 }, { text: "cam", type: "accented", index: 10 }, { text: "pi", type: "normal", index: 11 }
      ],
      accents: [1, 4, 8, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Doppia Sinalefe", "Antitesi (Solo/deserti)", "Allitterazione (s, p)"],
      meaning: "L'incipit sottolinea la solitudine voluta (solo) e riflessiva (pensoso) del poeta."
    },
    {
      verse: "vo mesurando a passi tardi e lenti,",
      meter: "Endecasillabo",
      scansion: [
        { text: "vo", type: "normal", index: 1 }, { text: "me", type: "normal", index: 2 }, { text: "su", type: "normal", index: 3 }, { text: "ran", type: "accented", index: 4 }, { text: "do_a", type: "sinalefe", index: 5 }, { text: "pas", type: "normal", index: 6 }, { text: "si", type: "normal", index: 7 }, { text: "tar", type: "accented", index: 8 }, { text: "di_e", type: "sinalefe", index: 9 }, { text: "len", type: "accented", index: 10 }, { text: "ti", type: "normal", index: 11 }
      ],
      accents: [4, 8, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Dittologia sinonimica (tardi e lenti)", "Metafora (mesurando)"],
      meaning: "Camminare lento e misurato, indice di pesantezza d'animo e meditazione."
    },
    {
      verse: "e gli occhi porto per fuggire intenti",
      meter: "Endecasillabo",
      scansion: [
        { text: "e", type: "normal", index: 1 }, { text: "gli_oc", type: "sinalefe", index: 2 }, { text: "chi", type: "normal", index: 3 }, { text: "por", type: "accented", index: 4 }, { text: "to", type: "normal", index: 5 }, { text: "per", type: "normal", index: 6 }, { text: "fug", type: "normal", index: 7 }, { text: "gi", type: "accented", index: 8 }, { text: "re_in", type: "sinalefe", index: 9 }, { text: "ten", type: "accented", index: 10 }, { text: "ti", type: "normal", index: 11 }
      ],
      accents: [4, 8, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Anastrofe", "Iperbato"],
      meaning: "Lo sguardo è vigile non per vedere, ma per evitare incontri indesiderati."
    },
    {
      verse: "ove vestigio uman l’arena stampi.",
      meter: "Endecasillabo",
      scansion: [
        { text: "o", type: "normal", index: 1 }, { text: "ve", type: "normal", index: 2 }, { text: "ve", type: "normal", index: 3 }, { text: "sti", type: "accented", index: 4 }, { text: "gio_u", type: "sinalefe", index: 5 }, { text: "man", type: "accented", index: 6 }, { text: "l’a", type: "normal", index: 7 }, { text: "re", type: "accented", index: 8 }, { text: "na", type: "normal", index: 9 }, { text: "stam", type: "accented", index: 10 }, { text: "pi", type: "normal", index: 11 }
      ],
      accents: [4, 6, 8, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Metafora (arena)", "Sinalefe"],
      meaning: "Evita qualsiasi luogo dove vi sia traccia di presenza umana."
    },
    {
      verse: "Altro schermo non trovo che mi scampi",
      meter: "Endecasillabo",
      scansion: [
        { text: "Al", type: "accented", index: 1 }, { text: "tro", type: "normal", index: 2 }, { text: "scher", type: "accented", index: 3 }, { text: "mo", type: "normal", index: 4 }, { text: "non", type: "normal", index: 5 }, { text: "tro", type: "accented", index: 6 }, { text: "vo", type: "normal", index: 7 }, { text: "che", type: "normal", index: 8 }, { text: "mi", type: "normal", index: 9 }, { text: "scam", type: "accented", index: 10 }, { text: "pi", type: "normal", index: 11 }
      ],
      accents: [1, 3, 6, 10],
      caesuraIndex: 4,
      figuresOfSpeech: ["Metafora (schermo)"],
      meaning: "La solitudine fisica è l'unica difesa (schermo) possibile."
    },
    {
      verse: "dal manifesto accorger de le genti,",
      meter: "Endecasillabo",
      scansion: [
        { text: "dal", type: "normal", index: 1 }, { text: "ma", type: "normal", index: 2 }, { text: "ni", type: "normal", index: 3 }, { text: "fe", type: "accented", index: 4 }, { text: "sto_ac", type: "sinalefe", index: 5 }, { text: "cor", type: "accented", index: 6 }, { text: "ger", type: "normal", index: 7 }, { text: "de", type: "normal", index: 8 }, { text: "le", type: "normal", index: 9 }, { text: "gen", type: "accented", index: 10 }, { text: "ti", type: "normal", index: 11 }
      ],
      accents: [4, 6, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Sinalefe"],
      meaning: "Teme che la gente si accorga chiaramente ('manifesto accorger') del suo stato."
    },
    {
      verse: "perché nel sembiante d’allegrezza spenti",
      meter: "Endecasillabo (Ipermetro)",
      scansion: [
        { text: "per", type: "normal", index: 1 }, { text: "ché", type: "accented", index: 2 }, { text: "nel", type: "normal", index: 3 }, { text: "sem", type: "normal", index: 4 }, { text: "bian", type: "accented", index: 5 }, { text: "te", type: "normal", index: 6 }, { text: "d’al", type: "normal", index: 7 }, { text: "le", type: "normal", index: 8 }, { text: "grez", type: "accented", index: 9 }, { text: "za", type: "normal", index: 10 }, { text: "spen", type: "accented", index: 11 }, { text: "ti", type: "normal", index: 12 }
      ],
      accents: [2, 5, 9, 11],
      caesuraIndex: 6,
      figuresOfSpeech: ["Antitesi (allegrezza/spenti)", "Ipermetria (versione testuale)"],
      meaning: "Il volto privo di gioia rivela il fuoco interiore. (Nota: la variante testuale qui riportata genera un verso di 12 sillabe)."
    },
    {
      verse: "di fuor si legge com’io dentro vampi:",
      meter: "Endecasillabo",
      scansion: [
        { text: "di", type: "normal", index: 1 }, { text: "fuor", type: "accented", index: 2 }, { text: "si", type: "normal", index: 3 }, { text: "leg", type: "accented", index: 4 }, { text: "ge", type: "normal", index: 5 }, { text: "co", type: "normal", index: 6 }, { text: "m’io", type: "accented", index: 7 }, { text: "den", type: "accented", index: 8 }, { text: "tro", type: "normal", index: 9 }, { text: "vam", type: "accented", index: 10 }, { text: "pi", type: "normal", index: 11 }
      ],
      accents: [2, 4, 7, 8, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Antitesi (fuor/dentro)", "Metafora (vampi)"],
      meaning: "Metafora del fuoco d'amore che brucia interiormente."
    },
    {
      verse: "sì ch’io mi credo omai che monti e piagge",
      meter: "Endecasillabo",
      scansion: [
        { text: "sì", type: "accented", index: 1 }, { text: "ch’io", type: "normal", index: 2 }, { text: "mi", type: "normal", index: 3 }, { text: "cre", type: "accented", index: 4 }, { text: "do_o", type: "sinalefe", index: 5 }, { text: "mai", type: "accented", index: 6 }, { text: "che", type: "normal", index: 7 }, { text: "mon", type: "accented", index: 8 }, { text: "ti_e", type: "sinalefe", index: 9 }, { text: "piag", type: "accented", index: 10 }, { text: "ge", type: "normal", index: 11 }
      ],
      accents: [1, 4, 6, 8, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Personificazione (monti e piagge)", "Polisindeto"],
      meaning: "La natura diventa testimone e confidente, umanizzandosi."
    },
    {
      verse: "e fiumi e selve sappian di che tempre",
      meter: "Endecasillabo",
      scansion: [
        { text: "e", type: "normal", index: 1 }, { text: "fiu", type: "accented", index: 2 }, { text: "mi_e", type: "sinalefe", index: 3 }, { text: "sel", type: "accented", index: 4 }, { text: "ve", type: "normal", index: 5 }, { text: "sap", type: "accented", index: 6 }, { text: "pian", type: "normal", index: 7 }, { text: "di", type: "normal", index: 8 }, { text: "che", type: "normal", index: 9 }, { text: "tem", type: "accented", index: 10 }, { text: "pre", type: "normal", index: 11 }
      ],
      accents: [2, 4, 6, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Polisindeto", "Metafora (tempre)"],
      meaning: "Tutti gli elementi naturali conoscono la qualità (tempra) della sua vita."
    },
    {
      verse: "sia la mia vita, ch’è celata ad altrui.",
      meter: "Endecasillabo",
      scansion: [
        { text: "sia", type: "normal", index: 1 }, { text: "la", type: "normal", index: 2 }, { text: "mia", type: "normal", index: 3 }, { text: "vi", type: "accented", index: 4 }, { text: "ta", type: "normal", index: 5 }, { text: "ch’è", type: "normal", index: 6 }, { text: "ce", type: "accented", index: 7 }, { text: "la", type: "normal", index: 8 }, { text: "ta_ad", type: "sinalefe", index: 9 }, { text: "al", type: "normal", index: 10 }, { text: "trui", type: "accented", index: 11 }
      ],
      accents: [4, 7, 11],
      caesuraIndex: 5,
      figuresOfSpeech: ["Antitesi (sapere/celata)"],
      meaning: "Contrapposizione tra la conoscenza della natura e l'ignoranza degli uomini."
    },
    {
      verse: "Ma pur sì aspre vie né sì selvagge",
      meter: "Endecasillabo",
      scansion: [
        { text: "Ma", type: "normal", index: 1 }, { text: "pur", type: "accented", index: 2 }, { text: "sì_a", type: "sinalefe", index: 3 }, { text: "spre", type: "accented", index: 4 }, { text: "vie", type: "accented", index: 5 }, { text: "né", type: "normal", index: 6 }, { text: "sì", type: "accented", index: 7 }, { text: "sel", type: "normal", index: 8 }, { text: "vag", type: "accented", index: 9 }, { text: "ge", type: "normal", index: 10 }
      ],
      accents: [2, 4, 5, 7, 9],
      caesuraIndex: 5,
      figuresOfSpeech: ["Anafora (sì... sì...)", "Climax"],
      meaning: "Tentativo disperato di trovare luoghi inaccessibili."
    },
    {
      verse: "cercar non so ch’Amor non venga sempre",
      meter: "Endecasillabo",
      scansion: [
        { text: "cer", type: "normal", index: 1 }, { text: "car", type: "accented", index: 2 }, { text: "non", type: "normal", index: 3 }, { text: "so", type: "accented", index: 4 }, { text: "ch’A", type: "sinalefe", index: 5 }, { text: "mor", type: "accented", index: 6 }, { text: "non", type: "normal", index: 7 }, { text: "ven", type: "accented", index: 8 }, { text: "ga", type: "normal", index: 9 }, { text: "sem", type: "accented", index: 10 }, { text: "pre", type: "normal", index: 11 }
      ],
      accents: [2, 4, 6, 8, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Personificazione (Amore)", "Ripetizione"],
      meaning: "L'Amore è personificato come un compagno di viaggio inevitabile."
    },
    {
      verse: "ragionando con meco, ed io con lui.",
      meter: "Endecasillabo",
      scansion: [
        { text: "ra", type: "normal", index: 1 }, { text: "gio", type: "normal", index: 2 }, { text: "nan", type: "accented", index: 3 }, { text: "do", type: "normal", index: 4 }, { text: "con", type: "normal", index: 5 }, { text: "me", type: "accented", index: 6 }, { text: "co", type: "normal", index: 7 }, { text: "ed_io", type: "sinalefe", index: 8 }, { text: "con", type: "normal", index: 9 }, { text: "lu", type: "accented", index: 10 }, { text: "i", type: "normal", index: 11 }
      ],
      accents: [3, 6, 10],
      caesuraIndex: 7,
      figuresOfSpeech: ["Chiasmo implicito", "Dieresi (lui)", "Dialogo interiore"],
      meaning: "La solitudine è impossibile: il dialogo interiore con l'Amore (e il pensiero dell'amata) è perpetuo."
    }
  ],
  "Traversando la Maremma toscana": [
    {
      verse: "Dolce paese, onde portai conforme",
      meter: "Endecasillabo",
      scansion: [
        { text: "Dol", type: "accented", index: 1 }, { text: "ce", type: "normal", index: 2 }, { text: "pa", type: "normal", index: 3 }, { text: "e", type: "accented", index: 4 }, { text: "se,_on", type: "sinalefe", index: 5 }, { text: "de", type: "normal", index: 6 }, { text: "por", type: "normal", index: 7 }, { text: "tai", type: "accented", index: 8 }, { text: "con", type: "normal", index: 9 }, { text: "for", type: "accented", index: 10 }, { text: "me", type: "normal", index: 11 }
      ],
      accents: [1, 4, 8, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Apostrofe", "Enjambement"],
      meaning: "Il poeta si rivolge direttamente alla Maremma, riconoscendo l'affinità tra il proprio carattere e il paesaggio."
    },
    {
      verse: "l’abito fiero e lo sdegnoso canto",
      meter: "Endecasillabo",
      scansion: [
        { text: "l’a", type: "accented", index: 1 }, { text: "bi", type: "normal", index: 2 }, { text: "to", type: "normal", index: 3 }, { text: "fie", type: "accented", index: 4 }, { text: "ro_e", type: "sinalefe", index: 5 }, { text: "lo", type: "normal", index: 6 }, { text: "sde", type: "normal", index: 7 }, { text: "gno", type: "accented", index: 8 }, { text: "so", type: "normal", index: 9 }, { text: "can", type: "accented", index: 10 }, { text: "to", type: "normal", index: 11 }
      ],
      accents: [1, 4, 8, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Dittologia", "Enjambement"],
      meaning: "L'orgoglio e l'indignazione morale che caratterizzano la poesia carducciana."
    },
    {
      verse: "e il petto ov’odio e amor mai non s’addorme,",
      meter: "Endecasillabo",
      scansion: [
        { text: "e_il", type: "sinalefe", index: 1 }, { text: "pet", type: "accented", index: 2 }, { text: "to_ov’", type: "sinalefe", index: 3 }, { text: "o", type: "accented", index: 4 }, { text: "dio_e_a", type: "sinalefe", index: 5 }, { text: "mor", type: "accented", index: 6 }, { text: "mai", type: "accented", index: 7 }, { text: "non", type: "normal", index: 8 }, { text: "s’ad", type: "normal", index: 9 }, { text: "dor", type: "accented", index: 10 }, { text: "me,", type: "normal", index: 11 }
      ],
      accents: [2, 4, 6, 7, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Antitesi (odio/amor)", "Sinalefe multipla"],
      meaning: "La passionalità estrema e vitale del poeta, che non trova mai requie."
    },
    {
      verse: "pur ti riveggo, e il cuor mi balza in tanto.",
      meter: "Endecasillabo",
      scansion: [
        { text: "pur", type: "accented", index: 1 }, { text: "ti", type: "normal", index: 2 }, { text: "ri", type: "normal", index: 3 }, { text: "veg", type: "accented", index: 4 }, { text: "go,_e_il", type: "sinalefe", index: 5 }, { text: "cuor", type: "accented", index: 6 }, { text: "mi", type: "normal", index: 7 }, { text: "bal", type: "accented", index: 8 }, { text: "za_in", type: "sinalefe", index: 9 }, { text: "tan", type: "accented", index: 10 }, { text: "to.", type: "normal", index: 11 }
      ],
      accents: [1, 4, 6, 8, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Sinalefe"],
      meaning: "L'emozione improvvisa e fisica (il cuore che balza) nel rivedere i luoghi familiari."
    },
    {
      verse: "Ben riconosco in te le usate forme",
      meter: "Endecasillabo",
      scansion: [
        { text: "Ben", type: "normal", index: 1 }, { text: "ri", type: "normal", index: 2 }, { text: "co", type: "normal", index: 3 }, { text: "no", type: "accented", index: 4 }, { text: "sco_in", type: "sinalefe", index: 5 }, { text: "te", type: "accented", index: 6 }, { text: "le_u", type: "sinalefe", index: 7 }, { text: "sa", type: "accented", index: 8 }, { text: "te", type: "normal", index: 9 }, { text: "for", type: "accented", index: 10 }, { text: "me", type: "normal", index: 11 }
      ],
      accents: [4, 6, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Sinalefe", "Parallelismo"],
      meaning: "Il poeta riconosce i tratti familiari del paesaggio maremmano, che non sono cambiati nel tempo."
    },
    {
      verse: "con gli occhi incerti tra ’l sorriso e il pianto,",
      meter: "Endecasillabo",
      scansion: [
        { text: "con", type: "normal", index: 1 }, { text: "gli_oc", type: "sinalefe", index: 2 }, { text: "chi_in", type: "sinalefe", index: 3 }, { text: "cer", type: "accented", index: 4 }, { text: "ti", type: "normal", index: 5 }, { text: "tra_’l", type: "sinalefe", index: 6 }, { text: "sor", type: "accented", index: 7 }, { text: "ri", type: "normal", index: 8 }, { text: "so_e_il", type: "sinalefe", index: 9 }, { text: "pian", type: "accented", index: 10 }, { text: "to,", type: "normal", index: 11 }
      ],
      accents: [4, 7, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Antitesi (sorriso/pianto)", "Sinalefe multipla"],
      meaning: "L'ambivalenza emotiva del ricordo: la gioia del rivedere e il dolore del tempo perduto."
    },
    {
      verse: "e in quelle seguo de’ miei sogni l’orme",
      meter: "Endecasillabo",
      scansion: [
        { text: "e_in", type: "sinalefe", index: 1 }, { text: "quel", type: "accented", index: 2 }, { text: "le", type: "normal", index: 3 }, { text: "se", type: "accented", index: 4 }, { text: "guo", type: "normal", index: 5 }, { text: "de’", type: "normal", index: 6 }, { text: "miei", type: "accented", index: 7 }, { text: "so", type: "normal", index: 8 }, { text: "gni", type: "normal", index: 9 }, { text: "l’or", type: "accented", index: 10 }, { text: "me", type: "normal", index: 11 }
      ],
      accents: [2, 4, 7, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Metafora (orme dei sogni)", "Sinalefe"],
      meaning: "Il paesaggio diventa lo specchio in cui il poeta cerca le tracce delle sue antiche speranze."
    },
    {
      verse: "erranti dietro il giovenile incanto.",
      meter: "Endecasillabo",
      scansion: [
        { text: "er", type: "accented", index: 1 }, { text: "ran", type: "normal", index: 2 }, { text: "ti", type: "normal", index: 3 }, { text: "die", type: "accented", index: 4 }, { text: "tro_il", type: "sinalefe", index: 5 }, { text: "gio", type: "normal", index: 6 }, { text: "ve", type: "normal", index: 7 }, { text: "ni", type: "normal", index: 8 }, { text: "le_in", type: "sinalefe", index: 9 }, { text: "can", type: "accented", index: 10 }, { text: "to.", type: "normal", index: 11 }
      ],
      accents: [1, 4, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Sinalefe", "Personificazione"],
      meaning: "L'incanto della giovinezza è visto come qualcosa di sfuggente e ormai lontano."
    },
    {
      verse: "Oh, quel che amai, quel che sognai, fu in vano;",
      meter: "Endecasillabo",
      scansion: [
        { text: "Oh,", type: "accented", index: 1 }, { text: "quel", type: "normal", index: 2 }, { text: "che_a", type: "sinalefe", index: 3 }, { text: "mai,", type: "accented", index: 4 }, { text: "quel", type: "normal", index: 5 }, { text: "che", type: "normal", index: 6 }, { text: "so", type: "normal", index: 7 }, { text: "gnai,", type: "accented", index: 8 }, { text: "fu_in", type: "sinalefe", index: 9 }, { text: "va", type: "accented", index: 10 }, { text: "no;", type: "normal", index: 11 }
      ],
      accents: [1, 4, 8, 10],
      caesuraIndex: 4,
      figuresOfSpeech: ["Anafora (quel che... quel che)", "Esclamazione"],
      meaning: "Il bilancio amaro della vita: la disillusione e la consapevolezza del fallimento degli ideali giovanili."
    },
    {
      verse: "e sempre corsi, e mai non giunsi il fine;",
      meter: "Endecasillabo",
      scansion: [
        { text: "e", type: "normal", index: 1 }, { text: "sem", type: "accented", index: 2 }, { text: "pre", type: "normal", index: 3 }, { text: "cor", type: "accented", index: 4 }, { text: "si,_e", type: "sinalefe", index: 5 }, { text: "mai", type: "accented", index: 6 }, { text: "non", type: "normal", index: 7 }, { text: "giun", type: "accented", index: 8 }, { text: "si_il", type: "sinalefe", index: 9 }, { text: "fi", type: "accented", index: 10 }, { text: "ne;", type: "normal", index: 11 }
      ],
      accents: [2, 4, 6, 8, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Metafora (corsa/vita)", "Sinalefe"],
      meaning: "La vita come una corsa affannosa verso un traguardo che non è mai stato raggiunto."
    },
    {
      verse: "e dimani cadrò. Ma di lontano",
      meter: "Endecasillabo",
      scansion: [
        { text: "e", type: "normal", index: 1 }, { text: "di", type: "normal", index: 2 }, { text: "ma", type: "normal", index: 3 }, { text: "ni", type: "normal", index: 4 }, { text: "ca", type: "normal", index: 5 }, { text: "drò.", type: "accented", index: 6 }, { text: "Ma", type: "accented", index: 7 }, { text: "di", type: "normal", index: 8 }, { text: "lon", type: "normal", index: 9 }, { text: "ta", type: "accented", index: 10 }, { text: "no", type: "normal", index: 11 }
      ],
      accents: [6, 7, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Metafora (cadere/morire)", "Enjambement"],
      meaning: "La premonizione della morte vicina, accettata con rassegnazione stoica."
    },
    {
      verse: "pace dicono al cuor le tue colline",
      meter: "Endecasillabo",
      scansion: [
        { text: "pa", type: "accented", index: 1 }, { text: "ce", type: "normal", index: 2 }, { text: "di", type: "accented", index: 3 }, { text: "co", type: "normal", index: 4 }, { text: "no_al", type: "sinalefe", index: 5 }, { text: "cuor", type: "accented", index: 6 }, { text: "le", type: "normal", index: 7 }, { text: "tue", type: "normal", index: 8 }, { text: "col", type: "normal", index: 9 }, { text: "li", type: "accented", index: 10 }, { text: "ne", type: "normal", index: 11 }
      ],
      accents: [1, 3, 6, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Personificazione (colline che dicono)", "Enjambement"],
      meaning: "La natura offre un messaggio di serenità e consolazione di fronte all'angoscia della morte."
    },
    {
      verse: "con le nebbie sfumanti e il verde piano",
      meter: "Endecasillabo",
      scansion: [
        { text: "con", type: "normal", index: 1 }, { text: "le", type: "normal", index: 2 }, { text: "neb", type: "accented", index: 3 }, { text: "bie", type: "normal", index: 4 }, { text: "sfu", type: "normal", index: 5 }, { text: "man", type: "accented", index: 6 }, { text: "ti_e_il", type: "sinalefe", index: 7 }, { text: "ver", type: "accented", index: 8 }, { text: "de", type: "normal", index: 9 }, { text: "pia", type: "accented", index: 10 }, { text: "no", type: "normal", index: 11 }
      ],
      accents: [3, 6, 8, 10],
      caesuraIndex: 6,
      figuresOfSpeech: ["Colorismo", "Sinalefe"],
      meaning: "La descrizione visiva del paesaggio maremmano, caratterizzato da colori sfumati e vitali."
    },
    {
      verse: "ridente ne le pioggie mattutine.",
      meter: "Endecasillabo",
      scansion: [
        { text: "ri", type: "normal", index: 1 }, { text: "den", type: "accented", index: 2 }, { text: "te", type: "normal", index: 3 }, { text: "ne", type: "normal", index: 4 }, { text: "le", type: "normal", index: 5 }, { text: "piog", type: "accented", index: 6 }, { text: "gie", type: "normal", index: 7 }, { text: "mat", type: "normal", index: 8 }, { text: "tu", type: "normal", index: 9 }, { text: "ti", type: "accented", index: 10 }, { text: "ne.", type: "normal", index: 11 }
      ],
      accents: [2, 6, 10],
      caesuraIndex: 5,
      figuresOfSpeech: ["Personificazione (ridente)", "Allitterazione (t)"],
      meaning: "L'immagine finale di una natura che sorride, portando una pace definitiva all'animo tormentato."
    }
  ],
  "Eneide (Proemio)": [
    {
      verse: "Le armi e l'uomo canto che per primo dai lidi di Troia",
      meter: "Verso libero",
      scansion: [
        { text: "Le_ar", type: "sinalefe", index: 1 }, { text: "mi_e", type: "sinalefe", index: 2 }, { text: "l'uo", type: "accented", index: 3 }, { text: "mo", type: "normal", index: 4 }, { text: "can", type: "accented", index: 5 }, { text: "to", type: "normal", index: 6 }, { text: "che", type: "normal", index: 7 }, { text: "per", type: "normal", index: 8 }, { text: "pri", type: "accented", index: 9 }, { text: "mo", type: "normal", index: 10 }, { text: "dai", type: "normal", index: 11 }, { text: "li", type: "accented", index: 12 }, { text: "di", type: "normal", index: 13 }, { text: "di", type: "normal", index: 14 }, { text: "Tro", type: "accented", index: 15 }, { text: "ia", type: "normal", index: 16 }
      ],
      accents: [3, 5, 9, 12, 15],
      figuresOfSpeech: ["Sineddoche (armi per guerra)", "Enjambement"],
      meaning: "L'esposizione del tema (protasi): la guerra (armi) e l'eroe (l'uomo, Enea) in fuga da Troia."
    },
    {
      verse: "Musa, ricordami le cause, per l'offesa di quale volere divino",
      meter: "Verso libero",
      scansion: [
        { text: "Mu", type: "accented", index: 1 }, { text: "sa,", type: "normal", index: 2 }, { text: "ri", type: "normal", index: 3 }, { text: "cor", type: "accented", index: 4 }, { text: "da", type: "normal", index: 5 }, { text: "mi", type: "normal", index: 6 }, { text: "le", type: "normal", index: 7 }, { text: "cau", type: "accented", index: 8 }, { text: "se,", type: "normal", index: 9 }, { text: "per", type: "normal", index: 10 }, { text: "l'of", type: "normal", index: 11 }, { text: "fe", type: "accented", index: 12 }, { text: "sa", type: "normal", index: 13 }, { text: "di", type: "normal", index: 14 }, { text: "qua", type: "accented", index: 15 }, { text: "le", type: "normal", index: 16 }, { text: "vo", type: "normal", index: 17 }, { text: "le", type: "accented", index: 18 }, { text: "re", type: "normal", index: 19 }, { text: "di", type: "normal", index: 20 }, { text: "vi", type: "accented", index: 21 }, { text: "no", type: "normal", index: 22 }
      ],
      accents: [1, 4, 8, 12, 15, 18, 21],
      figuresOfSpeech: ["Invocazione", "Enjambement"],
      meaning: "L'invocazione alla Musa (Calliope) affinché spieghi le ragioni dell'ira divina."
    }
  ],
  "Perché tardi": [
    {
      verse: "Perché tardi? Nel pino lo scoiattolo",
      meter: "Endecasillabo (sdrucciolo)",
      scansion: [
        { text: "Per", type: "normal", index: 1 }, { text: "ché", type: "accented", index: 2 }, { text: "tar", type: "accented", index: 3 }, { text: "di?", type: "normal", index: 4 }, { text: "Nel", type: "normal", index: 5 }, { text: "pi", type: "accented", index: 6 }, { text: "no", type: "normal", index: 7 }, { text: "lo", type: "normal", index: 8 }, { text: "scoiat", type: "accented", index: 9 }, { text: "to", type: "normal", index: 10 }, { text: "lo", type: "normal", index: 11 }
      ],
      accents: [2, 3, 6, 9],
      figuresOfSpeech: ["Domanda retorica", "Enjambement"],
      meaning: "La domanda iniziale introduce il tema dell'attesa affannosa. La natura (lo scoiattolo) partecipa a questa sospensione carica di energia, anticipando lo scatto improvviso."
    },
    {
      verse: "batte la coda a torcia sulla scorza.",
      meter: "Endecasillabo",
      scansion: [
        { text: "bat", type: "accented", index: 1 }, { text: "te", type: "normal", index: 2 }, { text: "la", type: "normal", index: 3 }, { text: "co", type: "accented", index: 4 }, { text: "da a", type: "normal", index: 5 }, { text: "tor", type: "accented", index: 6 }, { text: "cia", type: "normal", index: 7 }, { text: "sul", type: "normal", index: 8 }, { text: "la", type: "normal", index: 9 }, { text: "scor", type: "accented", index: 10 }, { text: "za.", type: "normal", index: 11 }
      ],
      accents: [1, 4, 6, 10],
      figuresOfSpeech: ["Metafora"],
      meaning: "Un'immagine intensamente visiva e vitale. La coda fulva ed eretta dello scoiattolo è paragonata a una fiammata (torcia), un guizzo di energia in un paesaggio altrimenti inanimato."
    },
    {
      verse: "La mezzaluna scende col suo picco",
      meter: "Endecasillabo",
      scansion: [
        { text: "La", type: "normal", index: 1 }, { text: "mez", type: "normal", index: 2 }, { text: "za", type: "normal", index: 3 }, { text: "lu", type: "accented", index: 4 }, { text: "na", type: "normal", index: 5 }, { text: "scen", type: "accented", index: 6 }, { text: "de", type: "normal", index: 7 }, { text: "col", type: "normal", index: 8 }, { text: "suo", type: "normal", index: 9 }, { text: "pic", type: "accented", index: 10 }, { text: "co", type: "normal", index: 11 }
      ],
      accents: [4, 6, 10],
      figuresOfSpeech: ["Enjambement"],
      meaning: "Il frammento che descrive lo scorrere silente del tempo: l'estremità della falce lunare scende all'orizzonte verso l'alba."
    },
    {
      verse: "nel sole che la smorza. È giorno fatto.",
      meter: "Endecasillabo",
      scansion: [
        { text: "nel", type: "normal", index: 1 }, { text: "so", type: "accented", index: 2 }, { text: "le", type: "normal", index: 3 }, { text: "che", type: "normal", index: 4 }, { text: "la", type: "normal", index: 5 }, { text: "smor", type: "accented", index: 6 }, { text: "za. È", type: "normal", index: 7 }, { text: "gior", type: "accented", index: 8 }, { text: "no", type: "normal", index: 9 }, { text: "fat", type: "accented", index: 10 }, { text: "to.", type: "normal", index: 11 }
      ],
      accents: [2, 6, 8, 10],
      figuresOfSpeech: ["Sinalefe", "Rima"],
      meaning: "La luce nascente del sole annulla quella del satellite materno: si è compiutamente fatto giorno. C'è un senso di rassegnazione nella definitività del giorno."
    },
    {
      verse: "A un soffio il pigro fumo trasalisce,",
      meter: "Endecasillabo",
      scansion: [
        { text: "A un", type: "normal", index: 1 }, { text: "sof", type: "accented", index: 2 }, { text: "fio il", type: "normal", index: 3 }, { text: "pi", type: "accented", index: 4 }, { text: "gro", type: "normal", index: 5 }, { text: "fu", type: "accented", index: 6 }, { text: "mo", type: "normal", index: 7 }, { text: "tra", type: "normal", index: 8 }, { text: "sa", type: "normal", index: 9 }, { text: "li", type: "accented", index: 10 }, { text: "sce,", type: "normal", index: 11 }
      ],
      accents: [2, 4, 6, 10],
      figuresOfSpeech: ["Personificazione", "Sinalefe"],
      meaning: "Una minima brezza di vento muove il fumo e, in senso figurato, tutto l'universo montaliano è pervaso da un segreto tremore."
    },
    {
      verse: "si difende nel punto che ti chiude.",
      meter: "Endecasillabo",
      scansion: [
        { text: "si", type: "normal", index: 1 }, { text: "di", type: "normal", index: 2 }, { text: "fen", type: "accented", index: 3 }, { text: "de", type: "normal", index: 4 }, { text: "nel", type: "normal", index: 5 }, { text: "pun", type: "accented", index: 6 }, { text: "to", type: "normal", index: 7 }, { text: "che", type: "normal", index: 8 }, { text: "ti", type: "normal", index: 9 }, { text: "chiu", type: "accented", index: 10 }, { text: "de.", type: "normal", index: 11 }
      ],
      accents: [3, 6, 10],
      figuresOfSpeech: ["Metafora"],
      meaning: "Il fumo si addensa come per proteggersi. Quello stesso luogo diviene un punto che serra il destinatario, isolandolo dal tempo distruttivo."
    },
    {
      verse: "Nulla finisce, o tutto, se tu fólgore",
      meter: "Endecasillabo (sdrucciolo)",
      scansion: [
        { text: "Nul", type: "accented", index: 1 }, { text: "la", type: "normal", index: 2 }, { text: "fi", type: "normal", index: 3 }, { text: "ni", type: "accented", index: 4 }, { text: "sce, o", type: "normal", index: 5 }, { text: "tut", type: "accented", index: 6 }, { text: "to,", type: "normal", index: 7 }, { text: "se", type: "normal", index: 8 }, { text: "tu", type: "normal", index: 9 }, { text: "fól", type: "accented", index: 10 }, { text: "go", type: "normal", index: 11 }, { text: "re", type: "normal", index: 12 }
      ],
      accents: [1, 4, 6, 10],
      figuresOfSpeech: ["Antitesi", "Metafora", "Enjambement"],
      meaning: "Di fronte all'apparizione della donna angelo, le logiche di fine e inizio vengono stravolte o perdono di senso. È lei la folgore che irrompe."
    },
    {
      verse: "lasci la nube.",
      meter: "Quinario",
      scansion: [
        { text: "la", type: "accented", index: 1 }, { text: "sci", type: "normal", index: 2 }, { text: "la", type: "normal", index: 3 }, { text: "nu", type: "accented", index: 4 }, { text: "be.", type: "normal", index: 5 }
      ],
      accents: [1, 4],
      figuresOfSpeech: ["Metafora", "Epifonema"],
      meaning: "Chiusa lapidaria. L'epifania divina si compie con uno strappo: se il tu lascia la nube portando la luce e il miracolo salvifico."
    }
  ],
  "Il tuono": [
    {
      verse: "E nella notte nera come il nulla,",
      meter: "Endecasillabo",
      scansion: [
        { text: "E", type: "normal", index: 1 }, { text: "nel", type: "normal", index: 2 }, { text: "la", type: "normal", index: 3 }, { text: "not", type: "accented", index: 4 }, { text: "te", type: "normal", index: 5 }, { text: "ne", type: "accented", index: 6 }, { text: "ra", type: "normal", index: 7 }, { text: "co", type: "normal", index: 8 }, { text: "me_il", type: "sinalefe", index: 9 }, { text: "nul", type: "accented", index: 10 }, { text: "la,", type: "normal", index: 11 }
      ],
      accents: [4, 6, 10],
      figuresOfSpeech: ["Allitterazione (n)", "Similitudine"],
      meaning: "Il paesaggio è immerso in una oscurità assoluta e angosciante, paragonata al vuoto inesistente del 'nulla'."
    },
    {
      verse: "a un tratto, col fragor d’arduo dirupo",
      meter: "Endecasillabo",
      scansion: [
        { text: "a_un", type: "sinalefe", index: 1 }, { text: "trat", type: "accented", index: 2 }, { text: "to,", type: "normal", index: 3 }, { text: "col", type: "normal", index: 4 }, { text: "fra", type: "normal", index: 5 }, { text: "gor", type: "accented", index: 6 }, { text: "d’ar", type: "normal", index: 7 }, { text: "duo", type: "normal", index: 8 }, { text: "di", type: "normal", index: 9 }, { text: "ru", type: "accented", index: 10 }, { text: "po", type: "normal", index: 11 }
      ],
      accents: [2, 6, 10],
      figuresOfSpeech: ["Enjambement", "Allitterazione (r)"],
      meaning: "All'improvviso il silenzio viene squarciato da un rumore assordante, paragonato al frastuono di una montagna che frana improvvisamente."
    },
    {
      verse: "che frana, il tuono rimbombò di schianto:",
      meter: "Endecasillabo",
      scansion: [
        { text: "che", type: "normal", index: 1 }, { text: "fra", type: "accented", index: 2 }, { text: "na,_il", type: "sinalefe", index: 3 }, { text: "tuo", type: "normal", index: 4 }, { text: "no", type: "normal", index: 5 }, { text: "rim", type: "normal", index: 6 }, { text: "bom", type: "normal", index: 7 }, { text: "bò", type: "accented", index: 8 }, { text: "di", type: "normal", index: 9 }, { text: "schian", type: "accented", index: 10 }, { text: "to:", type: "normal", index: 11 }
      ],
      accents: [2, 8, 10],
      figuresOfSpeech: ["Ipallage", "Onomatopea"],
      meaning: "Il tuono esplode all'improvviso manifestando tutta la sua forza distruttiva e la natura minacciosa."
    },
    {
      verse: "rimbombò, rimbalzò, rotolò cupo,",
      meter: "Endecasillabo",
      scansion: [
        { text: "rim", type: "normal", index: 1 }, { text: "bom", type: "normal", index: 2 }, { text: "bò,", type: "accented", index: 3 }, { text: "rim", type: "normal", index: 4 }, { text: "bal", type: "normal", index: 5 }, { text: "zò,", type: "accented", index: 6 }, { text: "ro", type: "normal", index: 7 }, { text: "to", type: "normal", index: 8 }, { text: "lò", type: "accented", index: 9 }, { text: "cu", type: "accented", index: 10 }, { text: "po,", type: "normal", index: 11 }
      ],
      accents: [3, 6, 9, 10],
      figuresOfSpeech: ["Climax", "Onomatopea", "Allitterazione (r)", "Asindeto"],
      meaning: "Attraverso verbi onomatopeici, Pascoli descrive l'eco del tuono che si allunga e si propaga minacciosamente nel cielo buio."
    },
    {
      verse: "e tacque, e poi rimareggiò rinfranto,",
      meter: "Endecasillabo",
      scansion: [
        { text: "e", type: "normal", index: 1 }, { text: "tac", type: "accented", index: 2 }, { text: "que,_e", type: "sinalefe", index: 3 }, { text: "poi", type: "normal", index: 4 }, { text: "ri", type: "normal", index: 5 }, { text: "ma", type: "normal", index: 6 }, { text: "reg", type: "normal", index: 7 }, { text: "giò", type: "accented", index: 8 }, { text: "rin", type: "normal", index: 9 }, { text: "fran", type: "accented", index: 10 }, { text: "to,", type: "normal", index: 11 }
      ],
      accents: [2, 8, 10],
      figuresOfSpeech: ["Metadico", "Metafora", "Sinalefe"],
      meaning: "Il suono sembra svanire per un attimo, per poi riprendere come il fragore cupo delle onde del mare che si infrangono con violenza."
    },
    {
      verse: "e poi vanì. Soave allora un canto",
      meter: "Endecasillabo",
      scansion: [
        { text: "e", type: "normal", index: 1 }, { text: "poi", type: "normal", index: 2 }, { text: "va", type: "normal", index: 3 }, { text: "nì.", type: "accented", index: 4 }, { text: "So", type: "normal", index: 5 }, { text: "a", type: "normal", index: 6 }, { text: "ve_al", type: "sinalefe", index: 7 }, { text: "lo", type: "accented", index: 8 }, { text: "ra_un", type: "sinalefe", index: 9 }, { text: "can", type: "accented", index: 10 }, { text: "to", type: "normal", index: 11 }
      ],
      accents: [4, 8, 10],
      figuresOfSpeech: ["Enjambement", "Sinestesia"],
      meaning: "Finalmente il boato si spegne nel nulla e lascia spazio all'assoluto contrasto col suono melodioso del canto interno."
    },
    {
      verse: "s’udì di madre, e il moto di una culla.",
      meter: "Endecasillabo",
      scansion: [
        { text: "s’u", type: "normal", index: 1 }, { text: "dì", type: "accented", index: 2 }, { text: "di", type: "normal", index: 3 }, { text: "ma", type: "accented", index: 4 }, { text: "dre,_e_il", type: "sinalefe", index: 5 }, { text: "mo", type: "accented", index: 6 }, { text: "to", type: "normal", index: 7 }, { text: "di_u", type: "sinalefe", index: 8 }, { text: "na", type: "normal", index: 9 }, { text: "cul", type: "accented", index: 10 }, { text: "la.", type: "normal", index: 11 }
      ],
      accents: [2, 4, 6, 10],
      figuresOfSpeech: ["Sineddoche", "Analogia"],
      meaning: "Il rassicurante affetto materno ripristina la pace dopo lo spaventoso scoppio del tuono, introducendo il tema del fanciullino che si sente al sicuro solo all'interno del Nido."
    }
  ]
};
