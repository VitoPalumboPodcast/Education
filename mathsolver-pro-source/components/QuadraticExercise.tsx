import React, { useMemo, useState } from 'react';
import { Difficulty } from '../types';

type Example = { a: number; b: number; c: number; note: string };
const EXAMPLES: Record<Difficulty, Example[]> = {
  [Difficulty.EASY]: [
    { a: 1, b: -5, c: 6, note: 'Due radici intere' },
    { a: 1, b: 7, c: 10, note: 'Attenzione ai segni' },
    { a: 1, b: -8, c: 15, note: 'Controlla somma e prodotto' },
  ],
  [Difficulty.MEDIUM]: [
    { a: 2, b: -5, c: 3, note: 'Coefficiente a diverso da 1' },
    { a: 2, b: -8, c: -10, note: 'Termine noto negativo' },
    { a: 4, b: 17, c: 4, note: 'Una radice frazionaria' },
  ],
  [Difficulty.HARD]: [
    { a: 1, b: 2, c: 5, note: 'Un caso senza soluzioni reali' },
    { a: 1, b: -6, c: 9, note: 'Una radice doppia' },
    { a: -3, b: 2, c: 0, note: 'Un’equazione spuria' },
  ],
};

const clean = (text: string): number | null => {
  const value = text.trim().replace(',', '.').replace(/\s/g, '').replace(/[−–]/g, '-');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\/[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(value)) return null;
  const [num, den = 1] = value.split('/').map(Number);
  return den === 0 ? null : num / den;
};
const equal = (text: string, expected: number) => {
  const n = clean(text);
  return n !== null && Math.abs(n - expected) < 0.0001;
};
const fmt = (n: number) => Number.isInteger(n) ? String(n) : String(Number(n.toFixed(4)));
const fraction = (n: number) => {
  if (Number.isInteger(n)) return String(n);
  for (let den = 2; den <= 24; den++) {
    const num = Math.round(n * den);
    if (Math.abs(n - num / den) < 0.000001) return `${num}/${den}`;
  }
  return fmt(n);
};
const options = (correct: number, distractors: number[]) =>
  [...new Set([correct, ...distractors])].filter(Number.isFinite).sort((a, b) => a - b);
const signed = (n: number, suffix = '') => n < 0 ? ` − ${Math.abs(n)}${suffix}` : ` + ${n}${suffix}`;
const polynomial = ({ a, b, c }: Example) => `${a === 1 ? '' : a === -1 ? '−' : a}x²${b === 0 ? '' : signed(b, 'x')}${c === 0 ? '' : signed(c)} = 0`;

/** Keep the same Lora-style math lettering used by the other exercises. */
const MathFraction: React.FC<{ top: React.ReactNode; bottom: React.ReactNode; label?: string }> = ({ top, bottom, label }) =>
  <span className="inline-flex flex-col items-stretch align-middle text-center font-serif italic font-semibold leading-none" aria-label={label}>
    <span className="border-b-2 border-current px-1.5 pb-1">{top}</span>
    <span className="px-1.5 pt-1">{bottom}</span>
  </span>;

const MathValue: React.FC<{ value: string }> = ({ value }) => {
  const match = value.match(/^(-?)(\d+)\/(\d+)$/);
  if (!match) return <span className="font-serif italic">{value.replace(/-/g, '−')}</span>;
  return <span className="inline-flex items-center font-serif italic">{match[1] && <span>−</span>}<MathFraction top={match[2]} bottom={match[3]} label={`${match[1] ? 'meno ' : ''}${match[2]} su ${match[3]}`} /></span>;
};

type GuidedKind = 'pura' | 'spuria' | 'monomia' | 'nota';
const GUIDED: Record<GuidedKind, { title: string; equation: string; a: number; b: number; c: number; steps: { prompt: string; formula: React.ReactNode; answer: number; choices: number[] }[] }> = {
  pura: { title: 'Equazione pura', equation: '3x² − 12 = 0', a: 3, b: 0, c: -12, steps: [
    { prompt: 'Porta il termine noto a destra', formula: <>3x² = ?</>, answer: 12, choices: [-12, 3, 12, 36] },
    { prompt: 'Dividi per il coefficiente di x²', formula: <>x² = <MathFraction top={12} bottom={3} /> = ?</>, answer: 4, choices: [3, 4, 9, 12] },
    { prompt: 'Estrai la radice: le soluzioni sono + e −', formula: <>x = ±√4 = ± ?</>, answer: 2, choices: [-2, 2, 4, 16] },
  ] },
  spuria: { title: 'Equazione spuria', equation: 'x² − 5x = 0', a: 1, b: -5, c: 0, steps: [
    { prompt: 'Raccogli x a fattor comune', formula: <>x(x − ?) = 0</>, answer: 5, choices: [-5, 0, 1, 5] },
    { prompt: 'Il primo fattore è zero: x = ?', formula: <>x(x − 5) = 0 → x = ? oppure x − 5 = 0</>, answer: 0, choices: [-5, 0, 1, 5] },
    { prompt: 'Risolvi il secondo fattore', formula: <>x − 5 = 0 → x = ?</>, answer: 5, choices: [-5, 0, 1, 5] },
  ] },
  monomia: { title: 'Equazione monomia', equation: '4x² = 0', a: 4, b: 0, c: 0, steps: [
    { prompt: 'Dividi per 4', formula: <>x² = ?</>, answer: 0, choices: [-4, 0, 1, 4] },
    { prompt: 'Trova la radice doppia', formula: <>x = ?</>, answer: 0, choices: [-2, 0, 2, 4] },
  ] },
  nota: { title: 'Una radice è già nota', equation: 'x² − 8x + 15 = 0; x₁ = 3', a: 1, b: -8, c: 15, steps: [
    { prompt: 'Calcola la somma delle radici', formula: <>x₁ + x₂ = <MathFraction top={<>−b</>} bottom={<>a</>} /> = ?</>, answer: 8, choices: [-8, 3, 8, 15] },
    { prompt: 'Sostituisci la radice nota', formula: <>3 + x₂ = 8 → x₂ = ?</>, answer: 5, choices: [3, 5, 8, 11] },
    { prompt: 'Controlla con il prodotto', formula: <>x₁ · x₂ = <MathFraction top={<>c</>} bottom={<>a</>} /> = ?</>, answer: 15, choices: [5, 8, 12, 15] },
  ] },
};

const GuidedQuadratic: React.FC<{ kind: GuidedKind; mode: 'click' | 'write'; onComplete: () => void }> = ({ kind, mode, onComplete }) => {
  const exercise = GUIDED[kind];
  const [typeDone, setTypeDone] = useState(false);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const complete = step >= exercise.steps.length;
  const checkType = (selected: string) => {
    if (selected === (kind === 'nota' ? 'completa' : kind)) { setTypeDone(true); setMessage('Tipo corretto. Ora svolgi un passaggio alla volta.'); }
    else setMessage('Osserva i termini presenti: b è davanti a x, c è il termine senza x.');
  };
  const checkStep = () => {
    if (!equal(answer, exercise.steps[step].answer)) { setMessage('Controlla il calcolo e il segno, poi riprova.'); return; }
    setAnswer(''); setMessage('Passaggio corretto.');
    if (step === exercise.steps.length - 1) onComplete();
    setStep(old => old + 1);
  };
  return <div className="space-y-5">
    <div className="sticky top-0 z-10 rounded-xl border border-indigo-200 bg-white/95 p-3 shadow-sm backdrop-blur"><p className="text-sm font-bold text-indigo-600">{exercise.title} · Equazione da risolvere</p><p className="mt-1 font-serif italic text-2xl font-bold">{exercise.equation}</p></div>
    {!typeDone ? <div className="space-y-3"><h3 className="text-lg font-black">1. Riconosci il tipo di equazione</h3><p className="font-serif italic">a = {exercise.a}, b = {exercise.b}, c = {exercise.c}</p><div className="flex flex-wrap gap-2">{(['completa', 'pura', 'spuria', 'monomia'] as const).map(type => <button type="button" key={type} onClick={() => checkType(type)} className="rounded-xl border-2 border-slate-200 px-4 py-2 font-bold capitalize hover:border-indigo-400">{type}</button>)}</div></div> : complete ? <div className="rounded-xl bg-emerald-50 p-5"><strong>Esercizio completato!</strong><p className="mt-2 font-serif italic text-lg">{kind === 'pura' ? 'x₁ = 2, x₂ = −2' : kind === 'spuria' ? 'x₁ = 0, x₂ = 5' : kind === 'monomia' ? 'x₁ = x₂ = 0' : 'x₁ = 3, x₂ = 5'}</p></div> : <div className="space-y-4"><p className="text-sm font-bold text-indigo-700">Calcolo {step + 1} di {exercise.steps.length}</p><h3 className="text-lg font-black">{exercise.steps[step].prompt}</h3><p className="flex flex-wrap items-center gap-2 font-serif italic text-xl">{exercise.steps[step].formula}</p>{mode === 'click' ? <div className="flex flex-wrap gap-2">{exercise.steps[step].choices.map(value => <button type="button" key={value} onClick={() => setAnswer(String(value))} aria-pressed={equal(answer, value)} className={`min-w-16 rounded-xl border-2 px-4 py-3 text-xl font-serif italic font-bold ${equal(answer, value) ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}>{value}</button>)}</div> : <input inputMode="decimal" aria-label="Risposta del passaggio" value={answer} onChange={event => setAnswer(event.target.value)} className="w-40 rounded-xl border-2 border-slate-200 px-3 py-2 text-xl font-serif italic" placeholder="Risposta" />}<button type="button" onClick={checkStep} className="rounded-xl bg-indigo-600 px-6 py-3 font-black text-white">Verifica passaggio</button></div>}
    {message && !complete && <p role="status" className="rounded-xl bg-slate-50 p-3 font-semibold">{message}</p>}
  </div>;
};

const QuadraticExercise: React.FC<{ difficulty: Difficulty; onComplete: () => void }> = ({ difficulty, onComplete }) => {
  const [tab, setTab] = useState<'study' | 'practice'>('study');
  const [activity, setActivity] = useState<'completa' | GuidedKind>('completa');
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [mode, setMode] = useState<'click' | 'write'>('click');
  const [selectedCoefficient, setSelectedCoefficient] = useState<number | null>(null);
  const [matchedCoefficients, setMatchedCoefficients] = useState<boolean[]>([false, false, false]);
  const [deltaStep, setDeltaStep] = useState(0);
  const [values, setValues] = useState<string[]>(Array(11).fill(''));
  const [message, setMessage] = useState('');
  const example = EXAMPLES[difficulty][index % EXAMPLES[difficulty].length];
  const delta = example.b ** 2 - 4 * example.a * example.c;
  const square = example.b ** 2;
  const product = 4 * example.a * example.c;
  const currentCoefficient = matchedCoefficients.findIndex(done => !done);
  const deltaPositions = [9, 10, 3];
  const deltaResults = [square, product, delta];
  const deltaChoices = [
    options(square, [example.b, -example.b, square - 1, square + 1]),
    options(product, [product - 4, product + 4, 4 * example.a, 4 * example.c, example.a * example.c]),
    options(delta, [square + product, square, product, delta - 1, delta + 1]),
  ];
  const roots = useMemo(() => delta < 0 ? [] : [(-example.b - Math.sqrt(delta)) / (2 * example.a), (-example.b + Math.sqrt(delta)) / (2 * example.a)].sort((x, y) => x - y), [example, delta]);

  const reset = () => { setStage(0); setDeltaStep(0); setValues(Array(11).fill('')); setSelectedCoefficient(null); setMatchedCoefficients([false, false, false]); setMessage(''); };
  const next = () => { setIndex(i => i + 1); reset(); };
  const changeMode = (chosen: 'click' | 'write') => { setMode(chosen); reset(); };
  const changeActivity = (chosen: 'completa' | GuidedKind) => { setActivity(chosen); reset(); };
  const update = (position: number, value: string) => setValues(old => old.map((v, i) => i === position ? value : v));
  const advance = () => { setMessage('Corretto! Prosegui con il passaggio successivo.'); setStage(s => s + 1); };
  const matchCoefficient = (target: number) => {
    if (selectedCoefficient === null) { setMessage('Seleziona prima un coefficiente numerico nell’equazione.'); return; }
    if (target !== currentCoefficient) { setMessage(`Procedi nell’ordine: ora abbina ${['a', 'b', 'c'][currentCoefficient]}.`); return; }
    if (selectedCoefficient !== target) { setMessage(`Non è la lettera giusta. Riprova: il numero selezionato è il coefficiente di ${['x²', 'x', 'termine noto'][selectedCoefficient]}.`); return; }
    const matched = matchedCoefficients.map((done, i) => i === target ? true : done);
    setMatchedCoefficients(matched);
    update(target, String([example.a, example.b, example.c][target]));
    setSelectedCoefficient(null);
    if (matched.every(Boolean)) advance();
    else setMessage(`Abbinamento corretto. Ora passa al coefficiente ${['a', 'b', 'c'][target + 1]}.`);
  };
  const check = () => {
    if (stage === 0) {
      if ([example.a, example.b, example.c].every((n, i) => equal(values[i], n))) advance();
      else setMessage('Rileggi i coefficienti e controlla i segni: a è davanti a x², b davanti a x, c è il termine noto.');
    } else if (stage === 1) {
      if (equal(values[deltaPositions[deltaStep]], deltaResults[deltaStep])) {
        if (deltaStep === 2) advance();
        else { setDeltaStep(step => step + 1); setMessage('Calcolo corretto. Prosegui con il passaggio successivo del delta.'); }
      } else setMessage([
        `Calcola prima b². Se b è negativo, mettilo tra parentesi: (${example.b})².`,
        'Calcola il prodotto 4 · a · c, facendo attenzione ai segni.',
        'Sottrai il prodotto 4ac dal valore di b².',
      ][deltaStep]);
    } else if (stage === 2) {
      const sign = delta > 0 ? 'positive' : delta === 0 ? 'zero' : 'negative';
      if (values[4] === sign) advance();
      else setMessage('Il segno di Δ determina quante soluzioni reali ci sono.');
    } else if (stage === 3 && delta >= 0) {
      const ok = delta === 0 ? equal(values[5], roots[0]) :
        (equal(values[5], roots[0]) && equal(values[6], roots[1])) ||
        (equal(values[5], roots[1]) && equal(values[6], roots[0]));
      if (ok) advance();
      else setMessage('Usa la formula risolutiva: il numeratore è meno b più o meno la radice di delta; il denominatore è due volte a. Accetto frazioni e le radici in qualsiasi ordine.');
    } else if ((stage === 3 && delta < 0) || (stage === 4 && delta >= 0)) {
      if (delta < 0 || (equal(values[7], -example.b / example.a) && equal(values[8], example.c / example.a))) {
        setStage(5); setMessage('Esercizio completato!'); onComplete();
      } else setMessage('Usa le formule di Viète: per la somma dividi l’opposto di b per a; per il prodotto dividi c per a.');
    }
  };
  const input = (position: number, label: string) => <label className="flex flex-col gap-2 text-sm font-bold text-slate-700" key={position}>{label}<input inputMode="decimal" aria-label={label} value={values[position] || ''} onChange={e => update(position, e.target.value)} className="w-32 max-w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-lg font-serif italic focus:border-indigo-500 outline-none" placeholder="numero o frazione" />{values[position]?.includes('/') && clean(values[position]) !== null && <span className="text-lg"><MathValue value={values[position].replace(/\s/g, '')} /></span>}</label>;
  const choose = (position: number, label: string, choices: number[]) => <fieldset className="space-y-2" key={position}><legend className="font-bold">{label}</legend><div className="flex flex-wrap gap-2">{choices.map(value => <button type="button" key={value} onClick={() => update(position, fraction(value))} aria-pressed={equal(values[position] || '', value)} className={`min-w-16 min-h-14 rounded-xl border-2 px-4 py-2 text-xl font-serif italic font-bold ${equal(values[position] || '', value) ? 'border-indigo-600 bg-indigo-50 text-indigo-800' : 'border-slate-200 hover:border-indigo-300'}`}><MathValue value={fraction(value)} /></button>)}</div></fieldset>;
  const coefficient = (position: number, label: string) => <button type="button" key={position} onClick={() => { setSelectedCoefficient(position); setMessage(`Hai scelto ${label.replace('−', '-')} come coefficiente. Ora scegli la lettera ${['a', 'b', 'c'][position]} nella formula.`); }} disabled={position !== currentCoefficient || selectedCoefficient !== null} aria-pressed={selectedCoefficient === position} className={`rounded-xl border-2 px-3 py-2 font-serif italic font-bold ${matchedCoefficients[position] ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : selectedCoefficient === position ? 'border-indigo-600 bg-indigo-50' : position === currentCoefficient ? 'border-slate-300 hover:border-indigo-400' : 'border-slate-200 text-slate-400'}`}>{label}</button>;
  const symbol = (position: number) => <button type="button" onClick={() => matchCoefficient(position)} disabled={position !== currentCoefficient || selectedCoefficient === null} aria-label={`Abbina al coefficiente ${['a', 'b', 'c'][position]}`} className={`mx-0.5 rounded-md border-b-2 px-1 font-serif italic font-bold ${matchedCoefficients[position] ? 'border-emerald-500 text-emerald-700' : position === currentCoefficient && selectedCoefficient !== null ? 'border-indigo-500 text-indigo-700 hover:bg-indigo-50' : 'border-slate-300 text-slate-500'}`}>{matchedCoefficients[position] ? `(${[example.a, example.b, example.c][position]})` : ['a', 'b', 'c'][position]}</button>;

  return <div className="max-w-5xl mx-auto space-y-7 text-slate-800">
    <div><p className="text-xs font-black uppercase tracking-widest text-indigo-600">Nuovo capitolo · Matematica 3G</p><h2 className="text-3xl md:text-4xl font-black mt-2">Equazioni di secondo grado</h2><p className="text-slate-600 mt-2">Dalla forma <span className="font-serif italic text-lg">ax² + bx + c = 0</span> alle radici, con esercizi guidati passo per passo.</p></div>
    <div className="flex gap-2" role="tablist" aria-label="Sezioni del capitolo"><button role="tab" aria-selected={tab === 'study'} onClick={() => setTab('study')} className={`rounded-xl px-5 py-3 font-bold ${tab === 'study' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Studia</button><button role="tab" aria-selected={tab === 'practice'} onClick={() => setTab('practice')} className={`rounded-xl px-5 py-3 font-bold ${tab === 'practice' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Allenati</button></div>
    {tab === 'study' ? <div className="grid gap-5 md:grid-cols-2">
      <section className="rounded-2xl bg-indigo-50 p-6"><h3 className="text-xl font-black">1. Riconosci i coefficienti</h3><p className="mt-3">Porta l’equazione nella forma <strong className="font-serif italic text-lg">ax² + bx + c = 0</strong>, con <span className="font-serif italic">a ≠ 0</span>. a moltiplica x², b moltiplica x, c è il termine noto. Se un termine manca, il suo coefficiente è zero.</p><p className="mt-3 font-serif italic text-lg font-bold">2x² − 5x + 3 = 0 → a = 2, b = −5, c = 3</p></section>
      <section className="rounded-2xl bg-amber-50 p-6"><h3 className="text-xl font-black">2. Calcola il discriminante</h3><p className="mt-3 text-2xl font-serif italic font-bold">Δ = b² − 4ac</p><p className="mt-2"><span className="font-serif italic">Δ &gt; 0</span>: due radici reali distinte. <span className="font-serif italic">Δ = 0</span>: una radice doppia. <span className="font-serif italic">Δ &lt; 0</span>: nessuna radice reale.</p><p className="mt-3">Se b è negativo, usa le parentesi: <span className="font-serif italic text-lg">(−5)² = 25</span>.</p></section>
      <section className="rounded-2xl bg-emerald-50 p-6"><h3 className="text-xl font-black">3. Trova le radici</h3><p className="mt-3 flex flex-wrap items-center gap-2 text-2xl font-serif italic font-bold">x = <MathFraction top={<>−b ± √Δ</>} bottom={<>2a</>} label="meno b più o meno radice di delta, tutto diviso due a" /></p><p className="mt-2">Quando <span className="font-serif italic">Δ ≥ 0</span>, fai due calcoli separati, uno con + e uno con −. Se <span className="font-serif italic">Δ = 0</span> coincidono. Se <span className="font-serif italic">Δ &lt; 0</span> fermati: non ci sono soluzioni in ℝ.</p><p className="mt-3">Per <span className="font-serif italic text-lg">x² − 5x + 6 = 0</span>: <span className="font-serif italic">Δ = 1</span>, quindi <span className="inline-flex items-center gap-1 font-serif italic text-lg">x = <MathFraction top={<>5 ± 1</>} bottom={<>2</>} /></span> → 2 e 3.</p></section>
      <section className="rounded-2xl bg-violet-50 p-6"><h3 className="text-xl font-black">4. Controlla con Viète</h3><div className="mt-3 space-y-2 text-xl font-serif italic font-bold"><p className="flex items-center gap-2">x₁ + x₂ = <MathFraction top={<>−b</>} bottom={<>a</>} /></p><p className="flex items-center gap-2">x₁ · x₂ = <MathFraction top={<>c</>} bottom={<>a</>} /></p></div><p className="mt-2">Per <span className="font-serif italic text-lg">6x² − 10x + 3 = 0</span>: somma = <MathFraction top={<>5</>} bottom={<>3</>} /> e prodotto = <MathFraction top={<>1</>} bottom={<>2</>} />. Le formule valgono anche se la radice è doppia; per radici reali richiedi <span className="font-serif italic">Δ ≥ 0</span>.</p></section>
      <section className="rounded-2xl bg-rose-50 p-6 md:col-span-2"><h3 className="text-xl font-black">5. Riconosci il tipo di equazione</h3><p className="mt-3">Prima porta l’equazione in forma ordinata <span className="font-serif italic">ax² + bx + c = 0</span>. Se ci sono parentesi, svolgile. Il segno meno fa parte del coefficiente.</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['Completa', 'a, b, c ≠ 0', '2x² − 5x + 3 = 0'], ['Pura', 'b = 0', '3x² − 12 = 0'], ['Spuria', 'c = 0', 'x² − 5x = 0'], ['Monomia', 'b = c = 0', '4x² = 0']].map(([title, condition, equation]) => <div key={title} className="rounded-xl bg-white p-4"><strong>{title}</strong><p className="font-serif italic">{condition}</p><p className="mt-2 font-serif italic text-lg">{equation}</p></div>)}</div></section>
      <section className="rounded-2xl bg-amber-50 p-6"><h3 className="text-xl font-black">6. Risolvi un’equazione pura</h3><p className="mt-3 font-serif italic text-lg">ax² + c = 0 → ax² = −c → x² = <MathFraction top={<>−c</>} bottom={<>a</>} /></p><p className="mt-3">Se <span className="font-serif italic">−c/a &gt; 0</span>, le radici sono opposte: <span className="font-serif italic">x = ±√(−c/a)</span>. Se vale zero, la radice è doppia; se è negativo, non ci sono radici reali.</p><p className="mt-3 font-serif italic text-lg">3x² − 12 = 0 → x² = <MathFraction top={12} bottom={3} /> = 4 → x = ±2</p></section>
      <section className="rounded-2xl bg-emerald-50 p-6"><h3 className="text-xl font-black">7. Risolvi un’equazione spuria o monomia</h3><p className="mt-3 font-serif italic text-lg">ax² + bx = 0 → x(ax + b) = 0</p><p className="mt-2">Un prodotto è zero se almeno un fattore è zero: <span className="font-serif italic">x₁ = 0</span>, <span className="font-serif italic">x₂ = <MathFraction top={<>−b</>} bottom={<>a</>} /></span>.</p><p className="mt-3 font-serif italic text-lg">x² − 5x = 0 → x(x − 5) = 0 → x = 0 oppure x = 5</p><p className="mt-2">Se anche <span className="font-serif italic">b = 0</span>, l’equazione è monomia e <span className="font-serif italic">x = 0</span> è radice doppia.</p></section>
      <section className="rounded-2xl bg-sky-50 p-6 md:col-span-2"><h3 className="text-xl font-black">8. Se conosci già una radice</h3><p className="mt-3">Usa la somma <span className="font-serif italic">x₁ + x₂ = <MathFraction top={<>−b</>} bottom={<>a</>} /></span>, poi sottrai la radice nota. Verifica il risultato con il prodotto <span className="font-serif italic">x₁ · x₂ = <MathFraction top={<>c</>} bottom={<>a</>} /></span>.</p><p className="mt-3 font-serif italic text-lg">x² − 8x + 15 = 0, x₁ = 3 → 3 + x₂ = 8 → x₂ = 5; controllo: 3 · 5 = 15.</p></section>
      <section className="rounded-2xl bg-slate-50 p-6 md:col-span-2"><h3 className="text-xl font-black">Perché funziona la formula?</h3><p className="mt-3">Dividi <span className="font-serif italic">ax² + bx + c = 0</span> per a, poi aggiungi <span className="inline-flex items-center font-serif italic">(<MathFraction top={<>b</>} bottom={<>2a</>} />)²</span> a entrambi i membri.</p><p className="mt-3 flex flex-wrap items-center gap-2 font-serif italic text-xl font-bold">(<span>x + <MathFraction top={<>b</>} bottom={<>2a</>} /></span>)² = <MathFraction top={<>b² − 4ac</>} bottom={<>4a²</>} /></p><p className="mt-3">Estraendo la radice con entrambi i segni e isolando x si ottiene la formula generale.</p><p className="mt-2 text-sm text-slate-600">Controllo finale: segni dei coefficienti, parentesi attorno a b negativo, Δ, denominatore 2a, due radici separate.</p></section>
    </div> : <div className="rounded-2xl border border-slate-200 p-5 md:p-8 space-y-5">
      <div className="flex flex-wrap gap-2" aria-label="Scegli il percorso">{([['completa', 'Formula completa'], ['pura', 'Pura'], ['spuria', 'Spuria'], ['monomia', 'Monomia'], ['nota', 'Radice nota']] as const).map(([value, label]) => <button type="button" key={value} onClick={() => changeActivity(value)} aria-pressed={activity === value} className={`rounded-xl px-4 py-2 font-bold ${activity === value ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>{label}</button>)}</div>
      {activity !== 'completa' ? <><div className="flex flex-wrap items-center gap-2"><span className="mr-2 text-sm font-bold">Come vuoi risolvere?</span><button type="button" onClick={() => changeMode('click')} aria-pressed={mode === 'click'} className={`rounded-xl px-4 py-2 font-bold ${mode === 'click' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Con i clic</button><button type="button" onClick={() => changeMode('write')} aria-pressed={mode === 'write'} className={`rounded-xl px-4 py-2 font-bold ${mode === 'write' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Scrivendo</button></div><GuidedQuadratic key={`${activity}-${mode}`} kind={activity} mode={mode} onComplete={onComplete} /></> : <>
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-white/95 p-3 shadow-sm backdrop-blur"><div><p className="text-sm font-bold text-indigo-600">{example.note} · Equazione da risolvere</p><p className="text-2xl md:text-3xl font-serif italic font-bold mt-1">{polynomial(example)}</p></div><button onClick={next} className="rounded-xl border border-indigo-300 px-4 py-2 font-bold text-indigo-700">Nuovo esercizio</button></div>
      <div className="flex flex-wrap items-center gap-2"><span className="mr-2 text-sm font-bold">Come vuoi risolvere?</span><button type="button" onClick={() => changeMode('click')} aria-pressed={mode === 'click'} className={`rounded-xl px-4 py-2 font-bold ${mode === 'click' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Con i clic</button><button type="button" onClick={() => changeMode('write')} aria-pressed={mode === 'write'} className={`rounded-xl px-4 py-2 font-bold ${mode === 'write' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Scrivendo</button></div>
      <p className="text-sm font-semibold text-slate-500">Passaggio {Math.min(stage + 1, 5)} di 5</p>
      {stage === 0 && (mode === 'click' ? <div className="space-y-5"><h3 className="text-lg font-black">1. Abbina i numeri alle lettere della formula</h3><p className="text-slate-600">Procedi un coefficiente alla volta, nell’ordine <span className="font-serif italic">a → b → c</span>: tocca il numero nell’equazione e poi la lettera nella formula. I coefficienti 1 e 0 sono mostrati anche quando normalmente si sottintendono.</p><p role="status" className="rounded-xl bg-indigo-50 px-4 py-2 font-bold text-indigo-800">Ora trova il coefficiente {['a', 'b', 'c'][currentCoefficient]}.</p><div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 p-4 text-2xl font-serif italic" aria-label="Equazione con coefficienti selezionabili">{coefficient(0, String(example.a))}<span>x²</span>{coefficient(1, example.b < 0 ? `− ${Math.abs(example.b)}` : `+ ${example.b}`)}<span>x</span>{coefficient(2, example.c < 0 ? `− ${Math.abs(example.c)}` : `+ ${example.c}`)}<span>= 0</span></div><div className="rounded-2xl bg-indigo-50 p-4"><p className="mb-2 text-sm font-bold">Formula risolutiva · abbina il coefficiente indicato</p><div className="flex flex-wrap items-center gap-2 text-xl md:text-2xl font-serif italic font-bold">x = <MathFraction top={<span className="inline-flex items-center whitespace-nowrap">−{symbol(1)} ± √(<span className="inline-flex items-center">{symbol(1)}² − 4 · {symbol(0)} · {symbol(2)}</span>)</span>} bottom={<span className="inline-flex items-center">2 · {symbol(0)}</span>} /></div></div><p className="text-sm text-slate-600">Abbinamenti: {matchedCoefficients.filter(Boolean).length} di 3</p></div> : <div><h3 className="text-lg font-black mb-4">1. Individua a, b e c</h3><div className="flex flex-wrap gap-4">{input(0, 'a')}{input(1, 'b')}{input(2, 'c')}</div></div>)}
      {stage === 1 && <div className="space-y-4"><h3 className="text-lg font-black">2. Calcola <span className="font-serif italic">Δ = b² − 4ac</span></h3><p className="text-sm font-bold text-indigo-700">Calcolo {deltaStep + 1} di 3</p>{deltaStep > 0 && <p className="font-serif italic text-lg text-emerald-800">b² = <MathValue value={fraction(square)} /></p>}{deltaStep > 1 && <p className="font-serif italic text-lg text-emerald-800">4ac = <MathValue value={fraction(product)} /></p>}{deltaStep === 0 && <p className="text-xl font-serif italic">b² = ({example.b})² = ?</p>}{deltaStep === 1 && <p className="text-xl font-serif italic">4ac = 4 · ({example.a}) · ({example.c}) = ?</p>}{deltaStep === 2 && <p className="text-xl font-serif italic">Δ = b² − 4ac = {square} − ({product}) = ?</p>}{mode === 'click' ? choose(deltaPositions[deltaStep], ['Scegli b²', 'Scegli 4ac', 'Scegli Δ'][deltaStep], deltaChoices[deltaStep]) : input(deltaPositions[deltaStep], ['Valore di b²', 'Valore di 4ac', 'Valore di Δ'][deltaStep])}</div>}
      {stage === 2 && <div><h3 className="text-lg font-black mb-4">3. Qual è il segno di Δ?</h3><div className="flex flex-wrap gap-3">{[['positive','Δ > 0 · due radici'],['zero','Δ = 0 · radice doppia'],['negative','Δ < 0 · nessuna radice reale']].map(([value,label]) => <button key={value} onClick={() => update(4,value)} aria-pressed={values[4] === value} className={`rounded-xl border-2 px-4 py-2 font-bold ${values[4] === value ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}>{label}</button>)}</div></div>}
      {stage === 3 && delta >= 0 && <div><h3 className="text-lg font-black mb-4">4. Applica la formula risolutiva</h3><p className="mb-4 flex flex-wrap items-center gap-2 text-xl font-serif italic text-slate-700">x = <MathFraction top={<>−({example.b}) ± √{delta}</>} bottom={<>2 · ({example.a})</>} /></p><div className="flex flex-wrap gap-6">{mode === 'click' ? choose(5, 'Prima radice', options(roots[0], [roots[1], roots[0] - 1, roots[0] + 1, -example.b / example.a])) : input(5, 'Prima radice')}{delta > 0 && (mode === 'click' ? choose(6, 'Seconda radice', options(roots[1], [roots[0], roots[1] - 1, roots[1] + 1, -example.b / example.a])) : input(6, 'Seconda radice'))}</div></div>}
      {stage === 3 && delta < 0 && <div><h3 className="text-lg font-black">4. Concludi</h3><p>Poiché Δ &lt; 0, la radice quadrata non è reale. L’equazione non ha soluzioni in ℝ.</p></div>}
      {stage === 4 && <div><h3 className="text-lg font-black mb-4">5. Verifica somma e prodotto</h3><div className="mb-4 flex flex-wrap items-center gap-5 text-xl font-serif italic text-slate-700"><span className="inline-flex items-center gap-1">Somma = <MathFraction top={<>−b</>} bottom={<>a</>} /></span><span className="inline-flex items-center gap-1">Prodotto = <MathFraction top={<>c</>} bottom={<>a</>} /></span></div><div className="flex flex-wrap gap-6">{mode === 'click' ? choose(7, 'Somma x₁ + x₂', options(-example.b / example.a, [example.b / example.a, -example.b, -example.b / example.a + 1])) : input(7, 'Somma x₁ + x₂')}{mode === 'click' ? choose(8, 'Prodotto x₁ · x₂', options(example.c / example.a, [-example.c / example.a, example.c, example.c / example.a + 1])) : input(8, 'Prodotto x₁ · x₂')}</div></div>}
      {stage < 5 ? (stage === 0 && mode === 'click' ? null : <button onClick={check} className="rounded-xl bg-indigo-600 px-6 py-3 font-black text-white hover:bg-indigo-700">Verifica passaggio</button>) : <div className="rounded-xl bg-emerald-50 p-5"><strong>Ottimo lavoro!</strong> {delta < 0 ? 'Nessuna soluzione reale.' : <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 font-serif italic text-lg"><span>Radici: {roots.map((root, i) => <span key={i} className="mr-3 inline-flex items-center gap-1">x<sub>{i + 1}</sub> = <MathValue value={fraction(root)} /></span>)}</span><span className="inline-flex items-center gap-1">Somma = <MathValue value={fraction(-example.b / example.a)} /></span><span className="inline-flex items-center gap-1">Prodotto = <MathValue value={fraction(example.c / example.a)} /></span></div>} <button onClick={next} className="mt-2 font-bold text-indigo-700 underline">Prossimo esercizio</button></div>}
      {message && stage < 5 && <p role="status" className="rounded-xl bg-slate-50 p-3 font-semibold">{message}</p>}
    </>}
    </div>}
  </div>;
};

export default QuadraticExercise;

