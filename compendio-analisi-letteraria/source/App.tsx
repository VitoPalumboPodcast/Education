
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PoemData, VerseAnalysis, SyllableType } from './types';
import { METRIC_REGISTRY, STATIC_ANALYSIS } from './data/metricRegistry';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const PRESET_POEMS: PoemData[] = [
  {
    title: "Veglia",
    author: "Giuseppe Ungaretti",
    year: "1915",
    text: `Un'intera nottata
buttato vicino
a un compagno
massacrato
con la sua bocca
digrignata
volta al plenilunio
con la congestione
delle sue mani
penetrata
nel mio silenzio
ho scritto
lettere piene d'amore

Non sono mai stato
tanto
attaccato alla vita.

Cima Quattro il 23 dicembre 1915`,
    rhymeScheme: [],
    rhymeType: "Versi liberi",
    stanzaType: "Strofe libere",
    quiz: [
      {
        question: "Cosa rappresenta l'espressione 'Cima Quattro il 23 dicembre 1915'?",
        options: [
          "Un luogo di villeggiatura visitato dal poeta",
          "Il datario tipico de L'Allegria, che àncora la poesia a una precisa esperienza di trincea",
          "Il titolo originale dell'opera",
          "Un riferimento a un fatto storico a cui il poeta non ha preso parte"
        ],
        correctAnswerIndex: 1,
        explanation: "Ungaretti usa la formula del 'diario' per fissare un'esperienza viscerale e inimmaginabile come quella della guerra di trincea."
      },
      {
        question: "Quale sentimento paradosso chiude la poesia?",
        options: [
          "Un forte desiderio di vendetta",
          "Una totale rassegnazione",
          "Un intenso attaccamento alla vita",
          "Una profonda nostalgia di casa"
        ],
        correctAnswerIndex: 2,
        explanation: "Proprio nel contatto diretto con la morte e col macabro, il poeta ritrova l'istinto primordiale della vita e dell'amore."
      },
      {
        question: "Quale figura stilistica è predominante nella prima strofa per enfatizzare la frammentazione del discorso?",
        options: [
          "L'endecasillabo sciolto",
          "Il verso libero e frantumato",
          "La rima baciata",
          "L'assonanza continua"
        ],
        correctAnswerIndex: 1,
        explanation: "Il verso libero e spezzato (versicoli) è tipico dell'esordio ungarettiano per rendere l'idea della precarietà e dell'essenzialità dell'esperienza."
      },
      {
        question: "Quali elementi anatomici del compagno caduto vengono messi in risalto?",
        options: [
          "Gli occhi chiusi e il respiro fievole",
          "La bocca digrignata e la congestione delle mani",
          "Il volto sereno e pallido",
          "Il petto ferito e le braccia aperte"
        ],
        correctAnswerIndex: 1,
        explanation: "Il poeta descrive la 'bocca digrignata' e la 'congestione delle sue mani', elementi di un espressionismo crudo che mostrano l'orrore fisico della morte."
      }
    ]
  },
  {
    title: "Perché tardi",
    author: "Eugenio Montale",
    year: "1936",
    text: `Perché tardi? Nel pino lo scoiattolo
batte la coda a torcia sulla scorza.
La mezzaluna scende col suo picco
nel sole che la smorza. È giorno fatto.

A un soffio il pigro fumo trasalisce,
si difende nel punto che ti chiude.
Nulla finisce, o tutto, se tu fólgore
lasci la nube.`,
    rhymeScheme: [],
    rhymeType: "Versi liberi",
    stanzaType: "Strofe libere",
    quiz: [
      {
        question: "Con quale figura l'avvento della donna (Clizia) viene descritto nel finale?",
        options: [
          "Come una dolce brezza",
          "Come una folgore che lascia la nube",
          "Come la mezzaluna che scende",
          "Come un pigro fumo"
        ],
        correctAnswerIndex: 1,
        explanation: "La donna salvifica irrompe come una folgore mistica, lacerando il tempo ordinario e rivelando in un altrove salvifico."
      },
      {
        question: "Che valore assume lo scoiattolo in questi versi?",
        options: [
          "È un simbolo di placidità e lentezza",
          "È l'incarnazione di un demone",
          "Un correlativo oggettivo dell'energia vibrante e dell'attesa",
          "Una semplice presenza decorativa"
        ],
        correctAnswerIndex: 2,
        explanation: "Attraverso il battito della coda a 'torcia' sulla scorza, lo scoiattolo oggettiva la tensione dell'attesa vitale."
      },
      {
        question: "Qual è la funzione del 'pigro fumo' nella seconda strofa?",
        options: [
          "Indica lo spegnimento della passione amorosa",
          "Rappresenta la fine della giornata campestre",
          "È l'elemento di grigiore e di inerzia della quotidianità turbato dal soffio del vento/evento",
          "Segnala la presenza di una casa abitata nei dintorni"
        ],
        correctAnswerIndex: 2,
        explanation: "Il 'pigro fumo' rappresenta la staticità e la normalità rassegnata della vita terrena che 'trasalisce' (si turba) all'apparire del 'soffio' dell'epifania."
      },
      {
        question: "In che modo si chiude dal punto di vista semantico la poesia?",
        options: [
          "Con una serena accettazione del tramonto",
          "Con un interrogativo aperto e angoscioso sul futuro",
          "Con un'affermazione categorica di immobilità: nulla cambia",
          "Con l'alternativa assoluta tra il 'nulla' e il 'tutto' determinata dalla venuta della donna"
        ],
        correctAnswerIndex: 3,
        explanation: "La lirica si chiude sull'alternativa radicale offerta da Clizia: o tutto finisce nel nulla della storia o tutto si riaccende 'se tu folgore lasci la nube'."
      }
    ]
  },
  {
    title: "Sera di Liguria",
    author: "Vincenzo Cardarelli",
    year: "1928",
    text: `Lenta e rosata sale su dal mare
la sera di Liguria, perdizione
di cuori amanti e di cose lontane.

Indugiano le coppie nei giardini,
s'accendon le finestre ad una ad una
come tanti teatri.

Sepolto nella bruma il mare odora.
Le chiese sulla riva paion navi
che stanno per salpare.`,
    rhymeScheme: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    rhymeType: "Versi sciolti",
    stanzaType: "Strofe libere"
  },
  {
    title: "San Martino",
    author: "Giosuè Carducci",
    year: "1883",
    text: `La nebbia a gl’irti colli
Piovigginando sale,
E sotto il maestrale
Urla e biancheggia il mar;

Ma per le vie del borgo
Dal ribollir de’ tini
Va l’aspro odor de i vini
L’anime a rallegrar.

Gira su’ ceppi accesi
Lo spiedo scoppiettando:
Sta il cacciator fischiando
Su l’uscio a rimirar

Tra le rossastre nubi
Stormi d’uccelli neri,
Com’esuli pensieri,
Nel vespere migrar.`,
    rhymeScheme: [
      "A", "B", "B", "C", 
      "D", "E", "E", "C", 
      "F", "G", "G", "C", 
      "H", "I", "I", "C"
    ],
    rhymeType: "Rima mista (alternata e baciata, schema anacreontico)",
    stanzaType: "Quartine"
  },
  {
    title: "L'infinito",
    author: "Giacomo Leopardi",
    year: "1819",
    text: `Sempre caro mi fu quest'ermo colle,
e questa siepe, che da tanta parte
dell'ultimo orizzonte il guardo esclude.
Ma sedendo e mirando, interminati
spazi di là da quella, e sovrumani
silenzi, e profondissima quiete
io nel pensier mi fingo; ove per poco
il cor non si spaura. E come il vento
odo stormir tra queste piante, io quello
infinito silenzio a questa voce
vo comparando: e mi sovvien l'eterno,
e le morte stagioni, e la presente
e viva, e il suon di lei. Così tra questa
immensità s'annega il pensier mio:
e il naufragar m'è dolce in questo mare.`,
    rhymeScheme: [],
    rhymeType: "Endecasillabi sciolti",
    stanzaType: "Strofa unica (15 versi)"
  },
  {
    title: "Solo e pensoso",
    author: "Francesco Petrarca",
    year: "1350",
    text: `Solo e pensoso i più deserti campi
vo mesurando a passi tardi e lenti,
e gli occhi porto per fuggire intenti
ove vestigio uman l’arena stampi.

Altro schermo non trovo che mi scampi
dal manifesto accorger de le genti,
perché nel sembiante d’allegrezza spenti
di fuor si legge com’io dentro vampi:

sì ch’io mi credo omai che monti e piagge
e fiumi e selve sappian di che tempre
sia la mia vita, ch’è celata ad altrui.

Ma pur sì aspre vie né sì selvagge
cercar non so ch’Amor non venga sempre
ragionando con meco, ed io con lui.`,
    rhymeScheme: [
      "A", "B", "B", "A",
      "A", "B", "B", "A",
      "C", "D", "E",
      "C", "D", "E"
    ],
    rhymeType: "Rima incrociata (quartine) e replicata (terzine)",
    stanzaType: "Sonetto (2 quartine, 2 terzine)"
  },
  {
    title: "Traversando la Maremma toscana",
    author: "Giosuè Carducci",
    year: "1887",
    text: `Dolce paese, onde portai conforme
l’abito fiero e lo sdegnoso canto
e il petto ov’odio e amor mai non s’addorme,
pur ti riveggo, e il cuor mi balza in tanto.

Ben riconosco in te le usate forme
con gli occhi incerti tra ’l sorriso e il pianto,
e in quelle seguo de’ miei sogni l’orme
erranti dietro il giovenile incanto.

Oh, quel che amai, quel che sognai, fu in vano;
e sempre corsi, e mai non giunsi il fine;
e dimani cadrò. Ma di lontano

pace dicono al cuor le tue colline
con le nebbie sfumanti e il verde piano
ridente ne le pioggie mattutine.`,
    rhymeScheme: [
      "A", "B", "A", "B",
      "A", "B", "A", "B",
      "C", "D", "E",
      "C", "D", "E"
    ],
    rhymeType: "Rima alternata (quartine) e replicata (terzine)",
    stanzaType: "Sonetto (2 quartine, 2 terzine)"
  },
  {
    title: "Eneide (Proemio)",
    author: "Virgilio",
    year: "19 a.C.",
    text: `Le armi e l'uomo canto che per primo dai lidi di Troia
per volere del fato venne fuggiasco in Italia e ai litorali
di Lavinio, lui (che fu) molto costretto a vagare sia nelle terre che in alto mare,
dalla prepotenza dei celesti, per l'ira irriducibile della spietata Giunone,
e che anche molti mali soffrì in guerra, pur di fondare la città
e portare i suoi dei nel Lazio, donde la stirpe Latina
e i padri Albani e le mura dell'alta Roma.
Musa, ricordami le cause, per l'offesa di quale volere divino
o rammaricandosi di che cosa la regina degli dei spinse
un uomo noto per devozione ad aggirarsi tra tanti eventi,
ad affrontare tanti affanni. Così profonda (è) forse l'ira negli animi celesti?`,
    rhymeScheme: [],
    rhymeType: "Versi liberi (traduzione)",
    stanzaType: "Strofa unica"
  },
  {
    title: "Il tuono",
    author: "Giovanni Pascoli",
    year: "1903",
    text: `E nella notte nera come il nulla,
a un tratto, col fragor d’arduo dirupo
che frana, il tuono rimbombò di schianto:
rimbombò, rimbalzò, rotolò cupo,
e tacque, e poi rimareggiò rinfranto,
e poi vanì. Soave allora un canto
s’udì di madre, e il moto di una culla.`,
    rhymeScheme: ['A', 'B', 'C', 'B', 'C', 'C', 'A'],
    rhymeType: "Ballata grande",
    stanzaType: "Strofa unica"
  }
];

const SyllableBox: React.FC<{ syllable: { text: string; type: SyllableType; index: number } }> = ({ syllable }) => {
  const styles = {
    normal: 'bg-stone-50 border-stone-200 text-stone-700',
    accented: 'bg-amber-100 border-amber-300 text-amber-900 font-bold',
    sinalefe: 'bg-sky-50 border-sky-200 text-sky-700 italic',
    dialefe: 'bg-red-50 border-red-200 text-red-700',
    dieresi: 'bg-purple-50 border-purple-200 text-purple-700',
    sineresi: 'bg-green-50 border-green-200 text-green-700',
  }[syllable.type] || 'bg-stone-50 border-stone-200 text-stone-700';

  return (
    <div className={`flex flex-col items-center min-w-[2.5rem] p-1 border rounded-lg shadow-sm ${styles}`}>
      <span className="text-lg font-serif">{syllable.text}</span>
      <span className="text-[9px] font-mono opacity-50">{syllable.index}</span>
    </div>
  );
};

const QuizSection: React.FC<{ poem: PoemData }> = ({ poem }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (!poem.quiz || poem.quiz.length === 0) {
    return (
      <div className="bg-white border text-center border-stone-200 p-12 rounded-[40px] shadow-sm max-w-2xl mx-auto">
        <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">Nessun quiz disponibile</h3>
        <p className="text-stone-500">Non ci sono domande disponibili per questa poesia al momento.</p>
      </div>
    );
  }

  const question = poem.quiz[currentQuestionIdx];
  const isCorrect = selectedOption === question.correctAnswerIndex;

  const handleNext = () => {
    setCurrentQuestionIdx((prev) => (prev + 1) % poem.quiz!.length);
    setSelectedOption(null);
    setHasSubmitted(false);
  };

  return (
    <div className="bg-white border border-stone-200 p-8 md:p-12 rounded-[40px] shadow-lg max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">Quiz di Comprensione</span>
        <h3 className="text-2xl font-serif font-bold text-stone-900">{poem.title}</h3>
        <p className="text-stone-500 text-sm">Domanda {currentQuestionIdx + 1} di {poem.quiz.length}</p>
      </div>
      
      <div className="mb-8">
        <h4 className="text-xl font-bold text-stone-800 leading-snug">{question.question}</h4>
      </div>

      <div className="space-y-3 mb-8">
        {question.options.map((option, idx) => {
          let styles = "border-stone-200 text-stone-700 hover:border-amber-400 hover:bg-amber-50 cursor-pointer";
          if (hasSubmitted) {
            if (idx === question.correctAnswerIndex) {
              styles = "border-green-500 bg-green-50 text-green-800 font-bold";
            } else if (idx === selectedOption) {
              styles = "border-red-500 bg-red-50 text-red-800";
            } else {
              styles = "border-stone-200 text-stone-400 opacity-50 cursor-not-allowed";
            }
          } else if (selectedOption === idx) {
            styles = "border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-sm";
          }

          return (
            <button
              key={idx}
              disabled={hasSubmitted}
              onClick={() => setSelectedOption(idx)}
              className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all ${styles}`}
            >
              <div className="flex gap-4 items-center">
                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold border transition-colors ${selectedOption === idx || (hasSubmitted && idx === question.correctAnswerIndex) ? 'border-transparent bg-white shadow-sm' : 'border-stone-300'}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {hasSubmitted && (
        <div className={`p-6 rounded-2xl mb-8 animate-in slide-in-from-bottom-4 duration-300 ${isCorrect ? 'bg-green-100/50 border border-green-200 text-green-900' : 'bg-red-100/50 border border-red-200 text-red-900'}`}>
          <h5 className="font-bold mb-2 text-lg">
            {isCorrect ? 'Corretto! 🎉' : 'Non esattamente.'}
          </h5>
          <p className="text-sm opacity-90 leading-relaxed">{question.explanation}</p>
        </div>
      )}

      <div className="flex justify-end pt-6 border-t border-stone-100">
        {!hasSubmitted ? (
          <button
            onClick={() => setHasSubmitted(true)}
            disabled={selectedOption === null}
            className={`px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${selectedOption !== null ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
          >
            Conferma
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-sm bg-stone-900 hover:bg-stone-800 text-white shadow-md hover:shadow-lg transition-all"
          >
            {currentQuestionIdx < poem.quiz.length - 1 ? 'Prossima Domanda' : 'Ricomincia'}
          </button>
        )}
      </div>
    </div>
  );
};

const useTTS = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const play = (id: string, text: string, rate = 0.85, pitch = 1) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    setPlayingId(id);
    window.speechSynthesis.speak(utterance);
  };
  const stop = () => {
    window.speechSynthesis.cancel();
    setPlayingId(null);
  };
  useEffect(() => () => window.speechSynthesis.cancel(), []);
  return { play, stop, playingId };
};
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'theory' | 'analysis' | 'quiz'>('analysis');
  const [currentPoem, setCurrentPoem] = useState<PoemData>(PRESET_POEMS[0]);
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
  const { play: playTTS, stop: stopTTS, playingId } = useTTS();

  const lines = useMemo(() => currentPoem.text.split('\n'), [currentPoem.text]);
  const verseAnalysis = useMemo(() => {
    if (!selectedVerse) return null;
    return METRIC_REGISTRY[currentPoem.title]?.find(v => v.verse === selectedVerse.trim()) || null;
  }, [selectedVerse, currentPoem.title]);

  const chartData = useMemo(() => {
    return lines.filter(l => l.trim() !== "").map((line, idx) => {
      const cleanLine = line.trim();
      const regMatch = METRIC_REGISTRY[currentPoem.title]?.find(v => v.verse === cleanLine);
      return {
        name: `V. ${idx + 1}`,
        len: regMatch ? (regMatch.syllables || (regMatch.scansion?.length || 0)) : 11,
        text: cleanLine
      };
    });
  }, [lines, currentPoem.title]);

  let verseCounter = 0;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-100 font-sans">
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-serif font-bold text-amber-900">Compendio di Analisi Letteraria</h1>
            <div className="flex bg-stone-100 p-1 rounded-xl">
              <button onClick={() => setActiveTab('analysis')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'analysis' ? 'bg-white text-amber-900 shadow-sm' : 'text-stone-400'}`}>Analisi</button>
              <button onClick={() => setActiveTab('theory')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'theory' ? 'bg-white text-amber-900 shadow-sm' : 'text-stone-400'}`}>Teoria</button>
              <button onClick={() => setActiveTab('quiz')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'quiz' ? 'bg-white text-amber-900 shadow-sm' : 'text-stone-400'}`}>Quiz</button>
            </div>
          </div>
          {(activeTab === 'analysis' || activeTab === 'quiz') && (
            <select 
              className="bg-stone-100 border-none rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-amber-500"
              value={PRESET_POEMS.findIndex(p => p.title === currentPoem.title)}
              onChange={(e) => {
                const p = PRESET_POEMS[parseInt(e.target.value)];
                if (p) {
                  setCurrentPoem(p);
                  setSelectedVerse(null);
                }
              }}
            >
              {PRESET_POEMS.map((p, i) => <option key={i} value={i}>{p.author} - {p.title}</option>)}
            </select>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {activeTab === 'theory' && (
          <div className="space-y-16 animate-in fade-in duration-700 pb-16">
            
            {/* 1. Definizione ed etimologia */}
            <section className="space-y-6">
              <div className="max-w-3xl">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2 block">1. I Fondamenti</span>
                <h2 className="text-4xl font-serif font-bold mb-4 text-stone-900">Verso contro Prosa</h2>
                <p className="text-stone-600 text-lg leading-relaxed mb-6">
                  La <span className="font-bold text-amber-700">metrica</span> (dal greco <em>métron</em>, "misura") studia le regole strutturali del testo poetico. 
                  Il concetto chiave risiede nell'etimologia:
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 text-9xl text-stone-50 font-serif font-bold group-hover:text-amber-50 transition-colors">V</div>
                  <h3 className="text-2xl font-serif font-bold text-amber-800 mb-2 relative z-10">Verso</h3>
                  <p className="text-sm text-amber-600 font-mono mb-4 relative z-10">lat. <em>vertere</em> ("voltare")</p>
                  <p className="text-stone-700 relative z-10 mb-6">L'unità minima della poesia. Graficamente non occupa tutta la pagina ma "va a capo" (volta) per scelta dell'autore, creando ritmo e pause.</p>
                  
                  <div className="relative z-10 bg-amber-50 p-6 rounded-xl border border-amber-100">
                    <p className="font-serif text-amber-900 text-lg leading-relaxed italic">
                      Lenta e rosata sale su dal mare<br/>
                      la sera di Liguria, perdizione<br/>
                      di cuori amanti e di cose lontane.<br/>
                      Indugiano le coppie nei giardini,<br/>
                      s'accendon le finestre ad una ad una<br/>
                      come tanti teatri.
                    </p>
                    <p className="text-[10px] text-amber-600 mt-3 text-right uppercase font-bold tracking-widest">— V. Cardarelli, Sera di Liguria</p>
                  </div>
                </div>

                <div className="bg-stone-100 p-8 rounded-3xl border border-stone-200 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 text-9xl text-stone-200 font-serif font-bold">P</div>
                  <h3 className="text-2xl font-serif font-bold text-stone-800 mb-2 relative z-10">Prosa</h3>
                  <p className="text-sm text-stone-500 font-mono mb-4 relative z-10">lat. <em>prorsum</em> ("diretto")</p>
                  <p className="text-stone-600 relative z-10 mb-6">Il discorso procede "in linea retta" fino alla fine del foglio. Equazione fondamentale: <em>La poesia sta al verso come il romanzo sta alla riga.</em></p>
                  
                  <div className="relative z-10 bg-white p-6 rounded-xl border border-stone-200">
                    <p className="font-serif text-stone-800 text-xs leading-relaxed text-justify">
                      "Quel ramo del lago di Como, che volge a mezzogiorno, tra due catene non interrotte di monti, tutto a seni e a golfi, a seconda dello sporgere e del rientrare di quelli, vien, quasi a un tratto, a ristringersi, e a prender corso e figura di fiume, tra un promontorio a destra, e un’ampia costiera dall’altra parte; e il ponte, che ivi congiunge le due rive, par che renda ancor più sensibile all’occhio questa trasformazione, e segni il punto in cui il lago cessa, e l’Adda ricomincia, per ripigliar poi nome di lago dove le rive, allontanandosi di nuovo, lascian l’acqua distendersi e rallentarsi in nuovi golfi e in nuovi seni."
                    </p>
                    <p className="text-[10px] text-stone-500 mt-3 text-right uppercase font-bold tracking-widest">— A. Manzoni, I Promessi Sposi</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Sillabazione e Figure Metriche */}
            <section className="space-y-8">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">2. Regole di Conteggio</span>
              <h2 className="text-3xl font-serif font-bold text-stone-900">Sillabe e Figure Metriche</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { t: "Sinalefe", icon: "🔗", d: "Fusione tra vocale finale e iniziale successiva.", ex: "Lenta_e rosata", src: "Cardarelli" },
                  { t: "Dialefe", icon: "✂️", d: "Le vocali adiacenti restano separate.", ex: "silenzi, | e", src: "Leopardi" },
                  { t: "Sineresi", icon: "🧲", d: "Due/tre vocali interne contate come una sola.", ex: "quie-te", src: "Leopardi" },
                  { t: "Dieresi", icon: "🫧", d: "Separazione di un dittongo (o iato metrica).", ex: "mio (fine verso)", src: "Leopardi" }
                ].map((r, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-amber-200 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="text-2xl mb-2">{r.icon}</div>
                      <h5 className="font-bold mb-1 text-stone-800">{r.t}</h5>
                      <p className="text-xs text-stone-500 leading-snug mb-3">{r.d}</p>
                    </div>
                    <div className="p-2 bg-stone-50 rounded text-center border border-stone-100 mt-auto">
                      <span className="block font-serif italic text-amber-800 text-sm">{r.ex}</span>
                      <span className="text-[9px] text-stone-400 uppercase tracking-widest">{r.src}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-stone-900 text-stone-300 p-8 rounded-3xl">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Regola dell'Accento (Ultima Parola)
                </h4>
                <div className="grid md:grid-cols-3 gap-8 text-sm">
                  <div>
                    <strong className="text-white block mb-1">Verso Piano</strong>
                    <p className="mb-2 opacity-80">Accento sulla penultima. Le sillabe metriche coincidono con quelle reali.</p>
                    <div className="bg-stone-800 px-3 py-2 rounded border border-stone-700">
                      <span className="text-amber-400 font-serif italic">ma-re</span>
                      <span className="text-[9px] block text-stone-500 uppercase mt-1">Cardarelli</span>
                    </div>
                  </div>
                  <div>
                    <strong className="text-white block mb-1">Verso Tronco</strong>
                    <p className="mb-2 opacity-80">Accento sull'ultima. Si conta <span className="text-amber-400 font-bold">+1 sillaba</span>.</p>
                    <div className="bg-stone-800 px-3 py-2 rounded border border-stone-700">
                      <span className="text-amber-400 font-serif italic">mi-grar (+1)</span>
                      <span className="text-[9px] block text-stone-500 uppercase mt-1">Carducci</span>
                    </div>
                  </div>
                  <div>
                    <strong className="text-white block mb-1">Verso Sdrucciolo</strong>
                    <p className="mb-2 opacity-80">Accento sulla terzultima. Si conta <span className="text-amber-400 font-bold">-1 sillaba</span>.</p>
                    <div className="bg-stone-800 px-3 py-2 rounded border border-stone-700">
                      <span className="text-amber-400 font-serif italic">tà-vo-lo (-1)</span>
                      <span className="text-[9px] block text-stone-500 uppercase mt-1">Esempio</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Ritmo e Tipologie */}
            <section className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">3. Tipologie</span>
                  <h2 className="text-3xl font-serif font-bold text-stone-900">Versi e Ritmo</h2>
                  <p className="text-stone-600 leading-relaxed">
                    Dai versi brevi (binario) all'<strong>endecasillabo</strong> (11 sillabe), il verso "principe" della tradizione italiana.
                    Il ritmo è la cadenza musicale data dagli <em>ictus</em> (accenti ritmici).
                  </p>
                  <div className="bg-white p-4 rounded-xl border border-stone-200">
                    <p className="text-xs uppercase text-stone-400 font-bold mb-1">Esempio: Endecasillabo sciolto</p>
                    <p className="font-serif italic text-stone-800">"Sempre caro mi fu quest'ermo colle"</p>
                    <p className="text-[9px] text-right mt-1 text-amber-600 font-bold">LEOPARDI</p>
                  </div>
                </div>
                <div className="flex-1 bg-stone-100 p-6 rounded-3xl border border-stone-200">
                  <h4 className="font-bold text-stone-800 mb-4 text-sm uppercase tracking-widest">Le Strofe</h4>
                  <ul className="space-y-3 text-sm text-stone-600">
                    <li><strong className="text-stone-900">Distico:</strong> 2 versi</li>
                    <li><strong className="text-stone-900">Terzina:</strong> 3 versi (es. Dante)</li>
                    <li className="bg-white p-2 rounded border border-stone-200"><strong className="text-amber-700">Quartina:</strong> 4 versi <br/><span className="text-xs italic opacity-70">Vedi "San Martino" di Carducci</span></li>
                    <li><strong className="text-stone-900">Sestina:</strong> 6 versi</li>
                    <li><strong className="text-stone-900">Ottava:</strong> 8 versi</li>
                    <li className="pt-2 border-t border-stone-200 mt-2"><strong className="text-stone-900">Sonetto:</strong> 14 versi (2 quartine + 2 terzine).</li>
                  </ul>

                  {/* Sonnet Example Box */}
                  <div className="mt-6 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                    <div className="flex justify-between items-end mb-3 border-b border-stone-100 pb-2">
                      <span className="text-xs font-bold text-amber-800 uppercase">Esempio: F. Petrarca</span>
                      <span className="text-[10px] font-mono text-stone-400">Solo e pensoso</span>
                    </div>
                    <div className="grid grid-cols-[1fr_20px] gap-2 text-xs">
                      {/* Quartina 1 */}
                      <p className="font-serif italic text-stone-700">Solo e pensoso i più deserti campi</p><span className="font-bold text-amber-600 text-center">A</span>
                      <p className="font-serif italic text-stone-700">vo mesurando a passi tardi e lenti,</p><span className="font-bold text-amber-600 text-center">B</span>
                      <p className="font-serif italic text-stone-700">e gli occhi porto per fuggire intenti,</p><span className="font-bold text-amber-600 text-center">B</span>
                      <p className="font-serif italic text-stone-700 mb-2">ove vestigio uman l’arena stampi.</p><span className="font-bold text-amber-600 text-center mb-2">A</span>
                      
                      {/* Quartina 2 */}
                      <p className="font-serif italic text-stone-700">Altro schermo non trovo che mi scampi</p><span className="font-bold text-amber-600 text-center">A</span>
                      <p className="font-serif italic text-stone-700">dal manifesto accorger de le genti,</p><span className="font-bold text-amber-600 text-center">B</span>
                      <p className="font-serif italic text-stone-700">perché nel sembiante d’allegrezza spenti</p><span className="font-bold text-amber-600 text-center">B</span>
                      <p className="font-serif italic text-stone-700 mb-2">di fuor si legge com’io dentro vampi:</p><span className="font-bold text-amber-600 text-center mb-2">A</span>

                      {/* Terzina 1 */}
                      <p className="font-serif italic text-stone-700">sì ch’io mi credo omai che monti e piagge</p><span className="font-bold text-amber-600 text-center">C</span>
                      <p className="font-serif italic text-stone-700">e fiumi e selve sappian di che tempre</p><span className="font-bold text-amber-600 text-center">D</span>
                      <p className="font-serif italic text-stone-700 mb-2">sia la mia vita, ch’è celata ad altrui.</p><span className="font-bold text-amber-600 text-center mb-2">E</span>

                      {/* Terzina 2 */}
                      <p className="font-serif italic text-stone-700">Ma pur sì aspre vie né sì selvagge</p><span className="font-bold text-amber-600 text-center">C</span>
                      <p className="font-serif italic text-stone-700">cercar non so ch’Amor non venga sempre</p><span className="font-bold text-amber-600 text-center">D</span>
                      <p className="font-serif italic text-stone-700">ragionando con meco, ed io con lui.</p><span className="font-bold text-amber-600 text-center">E</span>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* 4. Rime */}
            <section className="space-y-6">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">4. Suoni</span>
              <h2 className="text-3xl font-serif font-bold text-stone-900">La Rima</h2>
              <div className="bg-white p-6 rounded-2xl border border-stone-200 mb-6">
                <h3 className="text-lg font-bold text-stone-800 mb-2">Rima Perfetta e Imperfetta</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  La rima è l'identità di suono tra due o più parole a partire dall'accento tonico. Si distingue in:
                  <br/>
                  <strong className="text-amber-700">Perfetta:</strong> identità totale di vocali e consonanti (es. am<strong>ore</strong> / fur<strong>ore</strong>).
                  <br/>
                  <strong className="text-amber-700">Imperfetta:</strong> identità parziale. Può essere <em>assonanza</em> (stesse vocali: c<strong>a</strong>nt<strong>o</strong> / b<strong>a</strong>ll<strong>o</strong>) o <em>consonanza</em> (stesse consonanti: ve<strong>nt</strong>o / ca<strong>nt</strong>o).
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { name: "Baciata", schema: "AA BB", ex: "sale / maestrale", src: "Carducci" },
                  { name: "Alternata", schema: "AB AB", ex: "cuore / amore", src: "(Esempio)" },
                  { name: "Incrociata", schema: "AB BA", ex: "terra / guerra", src: "(Esempio)" },
                  { name: "Invertita", schema: "ABC CBA", ex: "sole / luna / stelle", src: "(Esempio)" },
                  { name: "Incatenata", schema: "ABA BCB", ex: "vita / smarrita", src: "Dante" },
                ].map((r, i) => (
                  <div key={i} className="text-center p-4 border border-stone-200 rounded-xl bg-white flex flex-col h-full">
                    <div className="text-xs text-stone-400 font-bold uppercase mb-1">{r.name}</div>
                    <div className="font-mono text-xl text-amber-600 font-bold mb-2">{r.schema}</div>
                    <div className="mt-auto pt-2 border-t border-stone-100">
                       <p className="font-serif italic text-xs text-stone-600">{r.ex}</p>
                       <p className="text-[9px] text-stone-400 uppercase mt-1">{r.src}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Strumenti Espressivi (Enjambement/Cesura) */}
            <section className="space-y-8">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">5. Espressività</span>
              <h2 className="text-3xl font-serif font-bold text-stone-900">Strumenti Retorici</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-stone-800 text-amber-50 p-8 rounded-3xl shadow-lg relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 font-serif text-8xl italic transition-transform group-hover:scale-110">E</div>
                   <h3 className="text-xl font-bold text-amber-400 mb-3">Enjambement</h3>
                   <p className="text-stone-300 text-sm leading-relaxed mb-6">
                     O "spezzatura". Il senso logico della frase scavalca la fine del verso e continua nel successivo.
                   </p>
                   <div className="bg-stone-900 p-4 rounded-xl border border-stone-700">
                     <p className="font-serif italic text-amber-100">"interminati<br/>spazi"</p>
                     <p className="text-[9px] text-stone-500 uppercase mt-2 text-right">Leopardi</p>
                   </div>
                </div>
                <div className="bg-white border-2 border-stone-100 p-8 rounded-3xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 font-serif text-8xl text-stone-900 transition-transform group-hover:scale-110">||</div>
                   <h3 className="text-xl font-bold text-stone-900 mb-3">Cesura</h3>
                   <p className="text-stone-600 text-sm leading-relaxed mb-6">
                     Una pausa interna al verso che ne rallenta il ritmo. Divide il verso in due parti (emistichi).
                   </p>
                   <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                     <p className="font-serif italic text-stone-800">"Lenta e rosata || sale su dal mare"</p>
                     <p className="text-[9px] text-stone-400 uppercase mt-2 text-right">Cardarelli</p>
                   </div>
                </div>
              </div>
            </section>

            {/* 6. Storia */}
            <section className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
               <h2 className="text-xl font-serif font-bold text-amber-900 mb-2">Dal Classicismo al Verso Libero</h2>
               <p className="text-amber-900/80 text-sm leading-relaxed">
                 Fino all'Ottocento le regole erano rigide. Nel Novecento si afferma il <strong>verso libero</strong> (es. Ungaretti), che abbandona schemi fissi di sillabe e rime per seguire il ritmo interiore. Tuttavia, non è caos: come diceva Montale, <em>«non si dà poesia senza artifizio»</em>.
               </p>
            </section>

          </div>
        )}
        {activeTab === 'analysis' && (
          <div className="grid lg:grid-cols-12 gap-8 xl:gap-12 animate-in fade-in duration-500">
            <div className="lg:col-span-8 space-y-12">
              <section className="space-y-6">
                <header className="flex justify-between items-end gap-4">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">{currentPoem.author} — {currentPoem.year}</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">{currentPoem.title}</h2>
                  </div>
                  <button 
                    onClick={() => playingId === 'full-poem' ? stopTTS() : playTTS('full-poem', currentPoem.text, 0.85)}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors shrink-0 shadow-sm"
                    title={playingId === 'full-poem' ? "Ferma lettura" : "Leggi poesia"}
                  >
                    {playingId === 'full-poem' ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                      <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </button>
                </header>
                <div className="bg-white p-4 md:p-8 lg:p-10 rounded-[40px] shadow-sm border border-stone-200">
                  <div className="space-y-3">
                    {lines.map((line, idx) => {
                      if (line.trim() === "") return <div key={idx} className="h-6" />;
                      const currentVerseIndex = verseCounter++;
                      const rhyme = currentPoem.rhymeScheme?.[currentVerseIndex];
                      const cleanLine = line.trim().replace(/^\d+\.\s*/, '').replace(/^\d+\s*/, '');
                      const displayLine = line.replace(/^(\s*)\d+\.?\s*/, '$1');
                      const verseData = METRIC_REGISTRY[currentPoem.title]?.find(v => v.verse === cleanLine);
                      const isEnjambement = verseData?.figuresOfSpeech?.includes("Enjambement");
                      return (
                        <div key={idx} onClick={() => setSelectedVerse(cleanLine)} className={`group flex items-center gap-3 md:gap-6 cursor-pointer transition-all ${selectedVerse === cleanLine ? 'translate-x-4' : 'hover:translate-x-2'}`}>
                          <span className="text-xs font-mono text-stone-400 font-semibold w-6 text-right tabular-nums shrink-0 select-none">{currentVerseIndex + 1}</span>
                          <div className="flex-grow flex items-center gap-2 overflow-hidden">
                            <p className={`text-sm sm:text-base md:text-lg xl:text-xl font-serif whitespace-pre ${selectedVerse === cleanLine ? 'text-amber-700 font-bold underline decoration-amber-200' : 'text-stone-700'}`}>{displayLine}</p>
                            {isEnjambement && (
                              <span title="Enjambement" className="text-amber-400 opacity-50 group-hover:opacity-100 transition-opacity shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                              </span>
                            )}
                          </div>
                          {rhyme && <span className="text-sm font-bold text-amber-400 font-mono w-6 text-right shrink-0">{rhyme}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="grid md:grid-cols-2 gap-6">
                <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl">
                  <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-4">Analisi Letteraria</h4>
                  <p className="text-amber-900 text-sm italic whitespace-pre-wrap">{STATIC_ANALYSIS[currentPoem.title]?.explanation}</p>
                </div>
                <div className="bg-stone-100 border border-stone-200 p-8 rounded-3xl">
                  <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-4">Metrica e Stile</h4>
                  <div className="space-y-4">
                    {currentPoem.stanzaType && (
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Strofa</span>
                        <span className="text-sm font-bold text-stone-800">{currentPoem.stanzaType}</span>
                      </div>
                    )}
                    {currentPoem.rhymeType && (
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Rima</span>
                        <span className="text-sm font-bold text-stone-800">{currentPoem.rhymeType}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Stile</span>
                      <p className="text-stone-700 text-sm">{STATIC_ANALYSIS[currentPoem.title]?.style}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="lg:col-span-4 space-y-8">
              <div className={`sticky top-24 transition-all ${selectedVerse ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="bg-white border-2 border-amber-500 rounded-[40px] p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xs font-bold uppercase text-amber-600">Dettaglio Verso</h3>
                      {verseAnalysis && verseAnalysis.scansion && (
                        <button
                          onClick={() => {
                            if (playingId === 'syllable') {
                              stopTTS();
                            } else {
                              // Rimuoviamo punteggiatura e underscore in modo che 'si,_e' diventi 'sie'
                              const text = verseAnalysis.scansion?.map(s => s.text.replace(/[_,\.\?!;:"']/g, '')).join(', ') || '';
                              playTTS('syllable', text, 1.25, 1.2); // Faster speech for dictation
                            }
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                          title={playingId === 'syllable' ? "Ferma" : "Ascolta sillabazione"}
                        >
                          {playingId === 'syllable' ? (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                          ) : (
                            <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          )}
                        </button>
                      )}
                    </div>
                    <button onClick={() => setSelectedVerse(null)} className="text-stone-300 hover:text-stone-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                  
                  {verseAnalysis ? (
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-2 items-end">
                        {verseAnalysis.scansion?.map((s, i) => (
                          <React.Fragment key={i}>
                            <SyllableBox syllable={s} />
                            {verseAnalysis.caesuraIndex === s.index && (
                              <div className="h-10 w-0.5 bg-red-400 mx-1 relative">
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-red-500 uppercase">Cesura</span>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      
                      <div className="flex gap-4 items-center pt-4 border-t border-stone-100">
                        <span className="px-3 py-1 bg-amber-600 text-white text-[10px] font-bold rounded-full uppercase">{verseAnalysis.meter}</span>
                        <span className="text-stone-400 text-xs">{verseAnalysis.scansion?.length} sillabe</span>
                      </div>
                      
                      <p className="text-stone-700 text-sm leading-relaxed italic bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                        {verseAnalysis.meaning}
                      </p>

                      {verseAnalysis.figuresOfSpeech && verseAnalysis.figuresOfSpeech.length > 0 && (
                        <div>
                          <h5 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Figure Retoriche</h5>
                          <div className="flex flex-wrap gap-1.5">
                            {verseAnalysis.figuresOfSpeech.map((f, i) => (
                              <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-1 rounded-lg border border-stone-200">{f}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-stone-400 text-sm text-center py-8">Seleziona un verso per visualizzare l'analisi.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}
        {activeTab === 'quiz' && (
          <div className="animate-in fade-in duration-500 py-12">
            <QuizSection poem={currentPoem} />
          </div>
        )}
      </main>

      <footer className="bg-stone-100 border-t border-stone-200 py-12 mt-24">
        <div className="max-w-6xl mx-auto text-center px-6">
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">&copy; 2024 Compendio di Analisi Letteraria - AI per la Creatività</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
