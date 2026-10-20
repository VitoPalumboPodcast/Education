import React, { useState } from 'react';
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

// Each letter in the formula is a separate click target, including repeated a and b.
const FORMULA_COEFFICIENTS = [1, 1, 0, 2, 0] as const;

type GuidedKind = 'pura' | 'spuria' | 'monomia' | 'nota';
type GuidedStep = { prompt: string; formula: React.ReactNode; completed: React.ReactNode; answer: number; choices: number[] };
type GuidedExercise = { title: string; equation: string; general: string; rule?: React.ReactNode; source: React.ReactNode; a: number; b: number; c: number; roots: [number, number]; steps: GuidedStep[] };
const GUIDED: Record<GuidedKind, GuidedExercise> = {
  pura: { title: 'Equazione pura', equation: '3x² − 12 = 0', general: 'ax² + c = 0', rule: <>ax² = −c</>, source: <>x = ±√4</>, a: 3, b: 0, c: -12, roots: [2, -2], steps: [
    { prompt: 'Porta −12 a destra', formula: <>3x² = ?</>, completed: <>3x² = 12</>, answer: 12, choices: [-12, 3, 12, 36] },
    { prompt: 'Dividi per 3', formula: <>x² = <MathFraction top={12} bottom={3} /> = ?</>, completed: <>x² = <MathFraction top={12} bottom={3} /> = 4</>, answer: 4, choices: [3, 4, 9, 12] },
    { prompt: 'Calcola √4', formula: <>√4 = ?</>, completed: <>√4 = 2 → x = ±2</>, answer: 2, choices: [-2, 2, 4, 16] },
  ] },
  spuria: { title: 'Equazione spuria', equation: 'x² − 5x = 0', general: 'ax² + bx = 0', rule: <>x(ax + b) = 0</>, source: <>x(x − 5) = 0</>, a: 1, b: -5, c: 0, roots: [0, 5], steps: [
    { prompt: 'Raccogli x', formula: <>x(x − ?) = 0</>, completed: <>x(x − 5) = 0</>, answer: 5, choices: [-5, 0, 1, 5] },
    { prompt: 'Il primo fattore è zero', formula: <>x = ?</>, completed: <>x = 0</>, answer: 0, choices: [-5, 0, 1, 5] },
    { prompt: 'Il secondo fattore è zero', formula: <>x − 5 = 0 → x = ?</>, completed: <>x − 5 = 0 → x = 5</>, answer: 5, choices: [-5, 0, 1, 5] },
  ] },
  monomia: { title: 'Equazione monomia', equation: '4x² = 0', general: 'ax² = 0', source: <>x² = 0</>, a: 4, b: 0, c: 0, roots: [0, 0], steps: [
    { prompt: 'Dividi per 4', formula: <>x² = <MathFraction top={0} bottom={4} /> = ?</>, completed: <>x² = <MathFraction top={0} bottom={4} /> = 0</>, answer: 0, choices: [-4, 0, 1, 4] },
    { prompt: 'Calcola √0', formula: <>√0 = ?</>, completed: <>√0 = 0 → radice doppia</>, answer: 0, choices: [-2, 0, 2, 4] },
  ] },
  nota: { title: 'Una radice è già nota', equation: 'x² − 8x + 15 = 0; x₁ = 3', general: 'ax² + bx + c = 0', rule: <>x₁ + x₂ = <MathFraction top={<>−b</>} bottom={<>a</>} /></>, source: <>x₁ + x₂ = 8</>, a: 1, b: -8, c: 15, roots: [3, 5], steps: [
    { prompt: 'Cambia il segno di −8', formula: <>−(−8) = ?</>, completed: <>−(−8) = 8</>, answer: 8, choices: [-8, 3, 8, 15] },
    { prompt: 'Calcola la somma delle radici', formula: <>x₁ + x₂ = <MathFraction top={8} bottom={1} /> = ?</>, completed: <>x₁ + x₂ = <MathFraction top={8} bottom={1} /> = 8</>, answer: 8, choices: [3, 5, 8, 15] },
    { prompt: 'Trova la seconda radice', formula: <>3 + x₂ = 8 → x₂ = ?</>, completed: <>3 + x₂ = 8 → x₂ = 5</>, answer: 5, choices: [3, 5, 8, 11] },
  ] },
};

const GuidedQuadratic: React.FC<{ kind: GuidedKind; mode: 'click' | 'write'; onComplete: () => void }> = ({ kind, mode, onComplete }) => {
  const exercise = GUIDED[kind];
  const [typeDone, setTypeDone] = useState(false);
  const [matchedCoefficients, setMatchedCoefficients] = useState<boolean[]>([false, false, false]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [writtenCoefficients, setWrittenCoefficients] = useState<string[]>(['', '', '']);
  const [moveSelected, setMoveSelected] = useState(false);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const complete = step >= exercise.steps.length;
  const coefficients = [exercise.a, exercise.b, exercise.c];
  const coefficientsDone = matchedCoefficients.every(Boolean);
  const matchCoefficient = (index: number) => {
    if (selectedNumber === null || matchedCoefficients[index]) return;
    if (selectedNumber !== coefficients[index]) { setMessage('Controlla il segno e riprova.'); return; }
    const next = [...matchedCoefficients]; next[index] = true;
    setMatchedCoefficients(next); setSelectedNumber(null);
    setMessage(next.every(Boolean) ? 'Coefficienti riconosciuti. Ora risolvi l’equazione.' : 'Corretto. Continua con gli altri coefficienti.');
  };
  const checkWrittenCoefficients = () => {
    if (!writtenCoefficients.every((value, index) => equal(value, coefficients[index]))) { setMessage('Controlla i coefficienti, compresi quelli assenti.'); return; }
    setMatchedCoefficients([true, true, true]); setMessage('Coefficienti riconosciuti. Ora risolvi l’equazione.');
  };
  const movePureTerm = () => {
    if (!moveSelected) { setMessage('Clicca prima su −12.'); return; }
    setMoveSelected(false); setMessage('−12 passa a destra e diventa +12.'); setStep(1);
  };
  const checkType = (selected: string) => {
    if (selected === (kind === 'nota' ? 'completa' : kind)) { setTypeDone(true); setMessage('Corretto. Ora riconosci i coefficienti.'); }
    else setMessage('Osserva quali termini con x sono presenti.');
  };
  const checkStep = () => {
    if (!equal(answer, exercise.steps[step].answer)) { setMessage('Controlla il calcolo e il segno, poi riprova.'); return; }
    setAnswer(''); setMessage('Corretto.');
    if (step === exercise.steps.length - 1) onComplete();
    setStep(old => old + 1);
  };
  const branchStart = kind === 'pura' || kind === 'nota' ? 2 : 1;
  const leftBranch = kind === 'pura' ? <>x₁ = +√4</> : kind === 'spuria' ? <>x = 0</> : kind === 'monomia' ? <>x₁ = +√0</> : <>x₁ = 3</>;
  const rightBranch = kind === 'pura' ? <>x₂ = −√4</> : kind === 'spuria' ? <>x − 5 = 0</> : kind === 'monomia' ? <>x₂ = −√0</> : <>x₂ = 8 − 3</>;
  const leftSolved = kind === 'nota' || (kind === 'spuria' ? step >= 2 : complete);
  const rightSolved = complete;
  return <div className="mx-auto max-w-3xl space-y-5 text-left">
    <div className="sticky top-0 z-10 rounded-xl border border-indigo-200 bg-white/95 p-4 shadow-sm backdrop-blur"><p className="text-sm font-bold text-indigo-600">{exercise.title} · Equazione da risolvere</p><p className="mt-1 font-serif italic text-4xl font-bold">{exercise.equation}</p></div>
    {!typeDone ? <div className="space-y-4"><h3 className="text-xl font-black">1. Riconosci il tipo di equazione</h3><p className="font-serif italic text-4xl">ax² + bx + c = 0</p><div className="flex flex-wrap gap-2">{(['completa', 'pura', 'spuria', 'monomia'] as const).map(type => <button type="button" key={type} onClick={() => checkType(type)} className="min-h-14 rounded-xl border-2 border-slate-200 px-4 py-2 text-lg font-bold capitalize hover:border-indigo-400">{type}</button>)}</div></div> : <>
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5" aria-label="Passaggi già svolti"><h3 className="mb-4 text-lg font-black">Passaggi già svolti</h3><div className="space-y-3 font-serif italic text-3xl leading-relaxed md:text-4xl"><p>{exercise.general}</p><p className="flex flex-wrap gap-x-5">{(['a', 'b', 'c'] as const).map((letter, index) => matchedCoefficients[index] && <span key={letter} className="text-emerald-800">{letter} = {coefficients[index]}</span>)}</p>{coefficientsDone && exercise.rule && <p className="flex flex-wrap items-center gap-2">{exercise.rule}</p>}{coefficientsDone && exercise.steps.slice(0, step).map((calculation, index) => <p key={index} className="flex flex-wrap items-center gap-2 text-emerald-800">{calculation.completed}</p>)}{coefficientsDone && step >= branchStart && <div className="border-t border-slate-200 pt-3"><p className="text-center">{exercise.source}</p><svg viewBox="0 0 100 32" preserveAspectRatio="none" className="mt-2 h-10 w-full text-emerald-700" aria-hidden="true"><path d="M50 0 L25 32 M50 0 L75 32" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg><div className="grid grid-cols-2 gap-2 md:gap-4"><div className="min-w-0 rounded-xl border-2 border-emerald-200 bg-white p-2 text-center md:p-4"><p className="text-2xl">{leftBranch}</p>{leftSolved && <p className="mt-2 font-bold text-emerald-800">x₁ = <MathValue value={fraction(exercise.roots[0])} /></p>}</div><div className="min-w-0 rounded-xl border-2 border-emerald-200 bg-white p-2 text-center md:p-4"><p className="text-2xl">{rightBranch}</p>{rightSolved && <p className="mt-2 font-bold text-emerald-800">x₂ = <MathValue value={fraction(exercise.roots[1])} /></p>}</div></div></div>}</div></section>
      {!coefficientsDone ? <section className="space-y-4" aria-label="Riconosci i coefficienti"><h3 className="text-xl font-black">2. Riconosci a, b e c</h3><p className="font-serif italic text-3xl md:text-4xl">{exercise.general}</p>{mode === 'click' ? <><p className="font-bold">Clicca un numero, poi la sua lettera.</p><div className="flex flex-wrap gap-3">{[...new Set(coefficients)].map(value => <button key={value} type="button" onClick={() => setSelectedNumber(value)} aria-pressed={selectedNumber === value} className={`min-h-20 min-w-20 rounded-xl border-2 px-4 font-serif italic text-4xl ${selectedNumber === value ? 'border-slate-500 bg-slate-100' : 'border-slate-200 bg-white'}`}>{String(value).replace('-', '−')}</button>)}</div><div className="flex flex-wrap gap-3">{(['a', 'b', 'c'] as const).map((letter, index) => <button key={letter} type="button" onClick={() => matchCoefficient(index)} disabled={matchedCoefficients[index]} aria-label={`Coefficiente ${letter}`} className={`min-h-20 min-w-20 rounded-xl border-2 px-4 font-serif italic text-4xl ${matchedCoefficients[index] ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white'}`}>{letter}{matchedCoefficients[index] && ` = ${coefficients[index]}`}</button>)}</div></> : <><div className="flex flex-wrap gap-3">{(['a', 'b', 'c'] as const).map((letter, index) => <label key={letter} className="font-serif italic text-3xl">{letter} = <input inputMode="numeric" value={writtenCoefficients[index]} onChange={event => setWrittenCoefficients(old => old.map((value, i) => i === index ? event.target.value : value))} className="w-24 rounded-xl border-2 border-slate-200 p-2" /></label>)}</div><button type="button" onClick={checkWrittenCoefficients} className="rounded-xl bg-indigo-600 px-6 py-3 font-black text-white">Verifica coefficienti</button></>}</section> : null}
      {!coefficientsDone ? null : complete ? <section className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-6" aria-label="Soluzioni dell'equazione"><h3 className="text-xl font-black text-emerald-900">Soluzioni dell’equazione</h3><p className="mt-4 text-center font-serif italic text-3xl">{exercise.source}</p><svg viewBox="0 0 100 32" preserveAspectRatio="none" className="mt-2 h-10 w-full text-emerald-700" aria-hidden="true"><path d="M50 0 L25 32 M50 0 L75 32" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white p-3 text-center shadow-sm"><p className="text-sm font-bold text-emerald-800">Prima soluzione</p><p className="mt-2 font-serif italic text-4xl font-bold md:text-5xl">x₁ = <MathValue value={fraction(exercise.roots[0])} /></p></div><div className="rounded-2xl bg-white p-3 text-center shadow-sm"><p className="text-sm font-bold text-emerald-800">Seconda soluzione</p><p className="mt-2 font-serif italic text-4xl font-bold md:text-5xl">x₂ = <MathValue value={fraction(exercise.roots[1])} /></p></div></div>{exercise.roots[0] === exercise.roots[1] && <p className="mt-3 font-bold text-emerald-900">Le due soluzioni coincidono: radice doppia.</p>}</section> : <div className="space-y-4"><p className="text-sm font-bold text-indigo-700">Calcolo {step + 1} di {exercise.steps.length}</p><h3 className="text-xl font-black">{exercise.steps[step].prompt}</h3>{!(mode === 'click' && kind === 'pura' && step === 0) && <p className="flex flex-wrap items-center gap-2 font-serif italic text-4xl md:text-5xl">{exercise.steps[step].formula}</p>}{mode === 'click' && kind === 'pura' && step === 0 ? <div className="space-y-3"><p className="font-bold">Clicca −12, poi clicca a destra dell’uguale.</p><div className="flex flex-wrap items-center gap-3 font-serif italic text-4xl md:text-5xl"><span>3x²</span><button type="button" onClick={() => setMoveSelected(value => !value)} aria-pressed={moveSelected} className={`min-h-20 rounded-xl border-2 px-3 font-serif italic ${moveSelected ? 'border-slate-500 bg-slate-100' : 'border-slate-200 bg-white'}`}>−12</button><span>=</span><button type="button" onClick={movePureTerm} className="min-h-20 min-w-24 rounded-xl border-2 border-dashed border-slate-300 bg-white px-3 font-serif italic" aria-label="Sposta −12 a destra">0 · qui</button></div></div> : mode === 'click' ? <div className="flex flex-wrap gap-2">{exercise.steps[step].choices.map(value => <button type="button" key={value} onClick={() => setAnswer(String(value))} aria-pressed={equal(answer, value)} className={`min-h-20 min-w-24 rounded-xl border-2 px-5 py-3 font-serif italic text-4xl font-bold ${equal(answer, value) ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}><MathValue value={fraction(value)} /></button>)}</div> : <input inputMode="decimal" aria-label="Risposta del passaggio" value={answer} onChange={event => setAnswer(event.target.value)} className="w-44 rounded-xl border-2 border-slate-200 px-3 py-3 font-serif italic text-3xl" placeholder="Risposta" />}{!(mode === 'click' && kind === 'pura' && step === 0) && <button type="button" onClick={checkStep} className="rounded-xl bg-indigo-600 px-6 py-3 font-black text-white">Verifica passaggio</button>}</div>}
    </>}
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
  const [matchedSymbols, setMatchedSymbols] = useState<boolean[]>(Array(FORMULA_COEFFICIENTS.length).fill(false));
  const [deltaStep, setDeltaStep] = useState(0);
  const [rootStep, setRootStep] = useState(0);
  const [values, setValues] = useState<string[]>(Array(18).fill(''));
  const [message, setMessage] = useState('');
  const example = EXAMPLES[difficulty][index % EXAMPLES[difficulty].length];
  const delta = example.b ** 2 - 4 * example.a * example.c;
  const square = example.b ** 2;
  const product = 4 * example.a * example.c;
  const deltaPositions = [9, 10, 3];
  const deltaResults = [square, product, delta];
  const deltaChoices = [
    options(square, [example.b, -example.b, square - 1, square + 1]),
    options(product, [product - 4, product + 4, 4 * example.a, 4 * example.c, example.a * example.c]),
    options(delta, [square + product, square, product, delta - 1, delta + 1]),
  ];
  const minusB = -example.b;
  const sqrtDelta = Math.sqrt(Math.max(0, delta));
  const denominator = 2 * example.a;
  const plusNumerator = minusB + sqrtDelta;
  const minusNumerator = minusB - sqrtDelta;
  const root1 = plusNumerator / denominator;
  const root2 = minusNumerator / denominator;
  const rootCalculations = [
    { label: 'Cambia il segno', formula: <>−({example.b}) = ?</>, completed: <>−({example.b}) = {minusB}</>, answer: minusB, position: 11, choices: options(minusB, [example.b, minusB - 1, minusB + 1]) },
    { label: 'Calcola la radice', formula: <>√{delta} = ?</>, completed: <>√{delta} = {sqrtDelta}</>, answer: sqrtDelta, position: 12, choices: options(sqrtDelta, [delta, -sqrtDelta, sqrtDelta + 1, sqrtDelta + 2]) },
    { label: 'Calcola il denominatore', formula: <>2 · ({example.a}) = ?</>, completed: <>2 · ({example.a}) = {denominator}</>, answer: denominator, position: 13, choices: options(denominator, [example.a, -denominator, denominator - 1, denominator + 1]) },
    { label: 'Numeratore con +', formula: <>{minusB} + {sqrtDelta} = ?</>, completed: <>{minusB} + {sqrtDelta} = {plusNumerator}</>, answer: plusNumerator, position: 14, choices: options(plusNumerator, [minusNumerator, minusB, plusNumerator - 1, plusNumerator + 1]) },
    { label: 'Trova x₁ con il segno +', formula: <>x₁ = <MathFraction top={plusNumerator} bottom={denominator} /> = ?</>, completed: <>x₁ = <MathFraction top={plusNumerator} bottom={denominator} /> = <MathValue value={fraction(root1)} /></>, answer: root1, position: 5, choices: options(root1, [root2, plusNumerator, (plusNumerator + 1) / denominator]) },
    { label: 'Numeratore con −', formula: <>{minusB} − {sqrtDelta} = ?</>, completed: <>{minusB} − {sqrtDelta} = {minusNumerator}</>, answer: minusNumerator, position: 15, choices: options(minusNumerator, [plusNumerator, minusB, minusNumerator - 1, minusNumerator + 1]) },
    { label: 'Trova x₂ con il segno −', formula: <>x₂ = <MathFraction top={minusNumerator} bottom={denominator} /> = ?</>, completed: <>x₂ = <MathFraction top={minusNumerator} bottom={denominator} /> = <MathValue value={fraction(root2)} /></>, answer: root2, position: 6, choices: options(root2, [root1, minusNumerator, (minusNumerator + 1) / denominator]) },
  ];

  const reset = () => { setStage(0); setDeltaStep(0); setRootStep(0); setValues(Array(18).fill('')); setSelectedCoefficient(null); setMatchedSymbols(Array(FORMULA_COEFFICIENTS.length).fill(false)); setMessage(''); };
  const next = () => { setIndex(i => i + 1); reset(); };
  const changeMode = (chosen: 'click' | 'write') => { setMode(chosen); reset(); };
  const changeActivity = (chosen: 'completa' | GuidedKind) => { setActivity(chosen); reset(); };
  const update = (position: number, value: string) => setValues(old => old.map((v, i) => i === position ? value : v));
  const advance = () => { setMessage('Corretto!'); setStage(s => s + 1); };
  const coefficientComplete = (coefficient: number, matched = matchedSymbols) =>
    FORMULA_COEFFICIENTS.every((value, index) => value !== coefficient || matched[index]);
  const matchCoefficient = (occurrence: number) => {
    if (selectedCoefficient === null) { setMessage('Tocca prima un numero.'); return; }
    const target = FORMULA_COEFFICIENTS[occurrence];
    if (selectedCoefficient !== target) { setMessage('Riprova.'); return; }
    const matched = matchedSymbols.map((done, index) => index === occurrence ? true : done);
    setMatchedSymbols(matched);
    update(target, String([example.a, example.b, example.c][target]));
    if (coefficientComplete(target, matched)) setSelectedCoefficient(null);
    if (matched.every(Boolean)) advance();
    else setMessage(coefficientComplete(target, matched) ? 'Corretto. Scegli un altro numero.' : 'Corretto. Cerca le altre occorrenze.');
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
      const current = rootCalculations[rootStep];
      if (equal(values[current.position], current.answer)) {
        if (rootStep === rootCalculations.length - 1) { setStage(4); setMessage('Soluzioni trovate!'); onComplete(); }
        else { setRootStep(step => step + 1); setMessage('Corretto. Continua con il calcolo successivo.'); }
      } else setMessage('Controlla il calcolo e il segno, poi riprova.');
    } else if (stage === 3 && delta < 0) {
      setStage(4); setMessage('Esercizio completato!'); onComplete();
    }
  };
  const input = (position: number, label: string) => <label className="flex flex-col gap-2 text-sm font-bold text-slate-700" key={position}>{label}<input inputMode="decimal" aria-label={label} value={values[position] || ''} onChange={e => update(position, e.target.value)} className="w-32 max-w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-lg font-serif italic focus:border-indigo-500 outline-none" placeholder="numero o frazione" />{values[position]?.includes('/') && clean(values[position]) !== null && <span className="text-lg"><MathValue value={values[position].replace(/\s/g, '')} /></span>}</label>;
  const choose = (position: number, label: string, choices: number[]) => <fieldset className="space-y-2" key={position}><legend className="text-lg font-bold">{label}</legend><div className="flex flex-wrap gap-2">{choices.map(value => <button type="button" key={value} onClick={() => update(position, fraction(value))} aria-pressed={equal(values[position] || '', value)} className={`min-w-24 min-h-20 rounded-xl border-2 px-5 py-3 text-4xl font-serif italic font-bold ${equal(values[position] || '', value) ? 'border-indigo-600 bg-indigo-50 text-indigo-800' : 'border-slate-200 hover:border-indigo-300'}`}><MathValue value={fraction(value)} /></button>)}</div></fieldset>;
  const coefficient = (position: number, label: string) => <button type="button" key={position} onClick={() => { setSelectedCoefficient(position); setMessage(`Selezionato: ${label.replace('−', '-')}`); }} disabled={coefficientComplete(position)} aria-pressed={selectedCoefficient === position} className={`min-h-24 rounded-xl border-2 px-5 py-3 text-6xl leading-none font-serif italic font-bold ${coefficientComplete(position) ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : selectedCoefficient === position ? 'border-slate-700 bg-slate-100 text-slate-900' : 'border-slate-300 hover:border-slate-600'}`}>{label}</button>;
  const symbol = (occurrence: number) => { const position = FORMULA_COEFFICIENTS[occurrence]; return <button type="button" onClick={() => matchCoefficient(occurrence)} disabled={matchedSymbols[occurrence]} aria-label={`Abbina la lettera ${['a', 'b', 'c'][position]}, occorrenza ${occurrence + 1}`} className={`mx-0.5 min-w-12 min-h-16 rounded-md border-b-2 px-2 font-serif italic font-bold ${matchedSymbols[occurrence] ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-400 text-slate-800 hover:border-slate-700'}`}>{matchedSymbols[occurrence] ? `(${[example.a, example.b, example.c][position]})` : ['a', 'b', 'c'][position]}</button>; };
  const coefficientBoard = <div className="space-y-4">
    <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="mb-2 text-sm font-bold text-slate-600">Forma generale</p><p className="font-serif italic text-4xl font-bold md:text-5xl">ax² + bx + c = 0 <span className="text-xl font-normal">(a ≠ 0)</span></p></div>
    <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 p-4 text-5xl font-serif italic md:text-6xl" aria-label="Equazione con coefficienti selezionabili">{coefficient(0, String(example.a))}<span>x²</span>{coefficient(1, example.b < 0 ? `− ${Math.abs(example.b)}` : `+ ${example.b}`)}<span>x</span>{coefficient(2, example.c < 0 ? `− ${Math.abs(example.c)}` : `+ ${example.c}`)}<span>= 0</span></div>
    <div className="rounded-2xl bg-slate-50 p-4"><p className="mb-2 text-sm font-bold">Formula risolutiva</p><div className="overflow-x-auto pb-2"><div className="flex w-max items-center gap-2 text-4xl font-serif italic font-bold md:text-5xl">x = <MathFraction top={<span className="inline-flex items-center whitespace-nowrap">−{symbol(0)} ± √(<span className="inline-flex items-center">{symbol(1)}² − 4 · {symbol(2)} · {symbol(3)}</span>)</span>} bottom={<span className="inline-flex items-center">2 · {symbol(4)}</span>} /></div></div></div>
  </div>;
  const deltaProgress = stage >= 2 ? 3 : deltaStep;
  const completedRootSteps = stage >= 4 ? rootCalculations.length : stage === 3 && delta >= 0 ? rootStep : 0;
  const notebook = mode === 'click' && stage >= 1 && <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left" aria-label="Passaggi già svolti">
    <h3 className="mb-4 text-lg font-black">Passaggi già svolti</h3>
    <div className="space-y-3 font-serif italic text-3xl leading-relaxed md:text-4xl">
      <p className="flex flex-wrap gap-x-5"><span>a = {example.a}</span><span>b = {example.b}</span><span>c = {example.c}</span></p>
      <p className="flex flex-wrap items-center gap-2">x = <MathFraction top={<>−b ± √(b² − 4ac)</>} bottom={<>2a</>} /></p>
      <p className="flex flex-wrap items-center gap-2">x = <MathFraction top={<>−({example.b}) ± √(({example.b})² − 4 · ({example.a}) · ({example.c}))</>} bottom={<>2 · ({example.a})</>} /></p>
      <div className="border-t border-slate-200 pt-3"><p>Δ = b² − 4ac</p><p>Δ = ({example.b})² − 4 · ({example.a}) · ({example.c})</p></div>
      {deltaProgress >= 1 && <p>({example.b})² = {square}</p>}
      {deltaProgress >= 2 && <p>4 · ({example.a}) · ({example.c}) = {product}</p>}
      {deltaProgress >= 3 && <p>Δ = {square} − ({product}) = {delta}</p>}
      {stage >= 3 && <p className="border-t border-slate-200 pt-3">Δ {delta > 0 ? '> 0 → due radici reali' : delta === 0 ? '= 0 → radice doppia' : '< 0 → nessuna radice reale'}</p>}
      {stage >= 3 && delta >= 0 && <div className="space-y-3 border-t border-slate-200 pt-3"><p className="flex flex-wrap items-center gap-2">x = <MathFraction top={<>−({example.b}) ± √{delta}</>} bottom={<>2 · ({example.a})</>} /></p>{rootCalculations.slice(0, Math.min(completedRootSteps, 3)).map(calculation => <p key={calculation.position} className="flex flex-wrap items-center gap-2 text-emerald-800">{calculation.completed}</p>)}{completedRootSteps >= 3 && <div className="pt-2"><p className="flex flex-wrap items-center gap-2">x = <MathFraction top={<>{minusB} ± {sqrtDelta}</>} bottom={denominator} /></p><div role="group" aria-label="Due rami della formula: più per x₁ e meno per x₂"><svg viewBox="0 0 100 32" preserveAspectRatio="none" className="mt-2 h-10 w-full text-emerald-700" aria-hidden="true"><path d="M50 0 L25 32 M50 0 L75 32" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg><div className="grid grid-cols-2 gap-2 md:gap-4"><div className="min-w-0 rounded-xl border-2 border-emerald-200 bg-white p-2 md:p-4"><p className="font-sans text-base font-black not-italic text-emerald-800 md:text-lg">Segno +</p><p className="font-serif italic text-3xl font-bold text-emerald-800">x₁</p><p className="mt-2 text-center text-2xl md:text-3xl"><MathFraction top={<>{minusB} + {sqrtDelta}</>} bottom={denominator} /></p>{completedRootSteps >= 4 && <p className="mt-2 text-center text-xl text-emerald-800 md:text-2xl">{minusB} + {sqrtDelta} = {plusNumerator}</p>}{completedRootSteps >= 5 && <p className="mt-2 flex flex-wrap items-center justify-center gap-1 text-2xl font-bold text-emerald-800"><MathFraction top={plusNumerator} bottom={denominator} /> = <MathValue value={fraction(root1)} /></p>}</div><div className="min-w-0 rounded-xl border-2 border-emerald-200 bg-white p-2 md:p-4"><p className="font-sans text-base font-black not-italic text-emerald-800 md:text-lg">Segno −</p><p className="font-serif italic text-3xl font-bold text-emerald-800">x₂</p><p className="mt-2 text-center text-2xl md:text-3xl"><MathFraction top={<>{minusB} − {sqrtDelta}</>} bottom={denominator} /></p>{completedRootSteps >= 6 && <p className="mt-2 text-center text-xl text-emerald-800 md:text-2xl">{minusB} − {sqrtDelta} = {minusNumerator}</p>}{completedRootSteps >= 7 && <p className="mt-2 flex flex-wrap items-center justify-center gap-1 text-2xl font-bold text-emerald-800"><MathFraction top={minusNumerator} bottom={denominator} /> = <MathValue value={fraction(root2)} /></p>}</div></div></div></div>}</div>}
    </div>
  </section>;

  return <div className="max-w-5xl mx-auto space-y-7 text-slate-800">
    <div><p className="text-xs font-black uppercase tracking-widest text-indigo-600">Matematica 3G</p><h2 className="text-3xl md:text-4xl font-black mt-2">Equazioni di secondo grado</h2></div>
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
    </div> : <div className="mx-auto max-w-4xl space-y-6 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm md:p-8">
      <div className="flex flex-wrap gap-2" aria-label="Scegli il percorso">{([['completa', 'Formula completa'], ['pura', 'Pura'], ['spuria', 'Spuria'], ['monomia', 'Monomia'], ['nota', 'Radice nota']] as const).map(([value, label]) => <button type="button" key={value} onClick={() => changeActivity(value)} aria-pressed={activity === value} className={`rounded-xl px-4 py-2 font-bold ${activity === value ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>{label}</button>)}</div>
      {activity !== 'completa' ? <><div className="flex flex-wrap items-center gap-2"><span className="mr-2 text-sm font-bold">Come vuoi risolvere?</span><button type="button" onClick={() => changeMode('click')} aria-pressed={mode === 'click'} className={`rounded-xl px-4 py-2 font-bold ${mode === 'click' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Con i clic</button><button type="button" onClick={() => changeMode('write')} aria-pressed={mode === 'write'} className={`rounded-xl px-4 py-2 font-bold ${mode === 'write' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Scrivendo</button></div><GuidedQuadratic key={`${activity}-${mode}`} kind={activity} mode={mode} onComplete={onComplete} /></> : <>
      <div className="sticky top-0 z-10 mx-auto max-w-3xl rounded-xl border border-indigo-200 bg-white/95 p-4 text-left shadow-sm backdrop-blur"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold text-indigo-600">{example.note} · Equazione da risolvere</p><p className="mt-1 text-5xl font-serif italic font-bold">{polynomial(example)}</p></div><button onClick={next} className="rounded-xl border border-indigo-300 px-4 py-2 font-bold text-indigo-700">Nuovo esercizio</button></div>{mode === 'write' && stage >= 2 && stage < 4 && <p className="mt-3 border-t border-indigo-100 pt-3 text-2xl font-serif italic font-bold text-indigo-800">Δ = {square} − ({product}) = {delta}</p>}</div>
      <div className="flex flex-wrap items-center gap-2"><span className="mr-2 text-sm font-bold">Come vuoi risolvere?</span><button type="button" onClick={() => changeMode('click')} aria-pressed={mode === 'click'} className={`rounded-xl px-4 py-2 font-bold ${mode === 'click' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Con i clic</button><button type="button" onClick={() => changeMode('write')} aria-pressed={mode === 'write'} className={`rounded-xl px-4 py-2 font-bold ${mode === 'write' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Scrivendo</button></div>
      {stage < 4 && <p className="text-sm font-semibold text-slate-500">Passaggio {stage + 1} di 4</p>}
      {notebook}
      {stage === 0 && (mode === 'click' ? <div className="mx-auto max-w-3xl space-y-5 text-left"><h3 className="text-xl font-black">1. Abbina i coefficienti</h3><p className="font-semibold text-slate-600">Numero → tutte le lettere corrispondenti.</p>{coefficientBoard}<p className="text-sm text-slate-600">{matchedSymbols.filter(Boolean).length}/{FORMULA_COEFFICIENTS.length} lettere</p></div> : <div><h3 className="text-lg font-black mb-4">1. Individua a, b e c</h3><div className="flex flex-wrap gap-4">{input(0, 'a')}{input(1, 'b')}{input(2, 'c')}</div></div>)}
      {stage === 1 && <div className="mx-auto max-w-3xl space-y-5 text-left"><h3 className="text-xl font-black">2. Calcola Δ</h3><p className="text-sm font-bold text-indigo-700">Calcolo {deltaStep + 1} di 3</p>{mode === 'write' && deltaStep > 0 && <p className="font-serif italic text-4xl text-emerald-800">b² = <MathValue value={fraction(square)} /></p>}{mode === 'write' && deltaStep > 1 && <p className="font-serif italic text-4xl text-emerald-800">4ac = <MathValue value={fraction(product)} /></p>}{deltaStep === 0 && <p className="text-5xl font-serif italic">({example.b})² = ?</p>}{deltaStep === 1 && <p className="text-5xl font-serif italic">4 · ({example.a}) · ({example.c}) = ?</p>}{deltaStep === 2 && <p className="text-5xl font-serif italic">Δ = {square} − ({product}) = ?</p>}{mode === 'click' ? choose(deltaPositions[deltaStep], ['Calcola il quadrato', 'Calcola il prodotto', 'Calcola Δ'][deltaStep], deltaChoices[deltaStep]) : input(deltaPositions[deltaStep], ['Valore di b²', 'Valore di 4ac', 'Valore di Δ'][deltaStep])}</div>}
      {stage === 2 && <div className="mx-auto max-w-3xl space-y-5 text-left"><h3 className="text-xl font-black">3. Qual è il segno di Δ?</h3>{mode === 'write' && <p className="font-serif italic text-4xl">Δ = {square} − ({product}) = {delta}</p>}<div className="flex flex-wrap gap-3">{[['positive','Δ > 0 · due radici'],['zero','Δ = 0 · radice doppia'],['negative','Δ < 0 · nessuna radice reale']].map(([value,label]) => <button key={value} onClick={() => update(4,value)} aria-pressed={values[4] === value} className={`rounded-xl border-2 px-4 py-3 text-lg font-bold ${values[4] === value ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}>{label}</button>)}</div></div>}
      {stage === 3 && delta >= 0 && <div className="mx-auto max-w-3xl space-y-5 text-left"><h3 className="text-xl font-black">4. Applica la formula risolutiva</h3>{mode === 'write' && <p className="flex flex-wrap items-center gap-2 text-4xl font-serif italic text-slate-700 md:text-5xl">x = <MathFraction top={<>−({example.b}) ± √{delta}</>} bottom={<>2 · ({example.a})</>} /></p>}<p className="text-sm font-bold text-indigo-700">Calcolo {rootStep + 1} di {rootCalculations.length}</p>{mode === 'write' && rootStep > 0 && <div className="space-y-2 rounded-2xl bg-emerald-50 p-4">{rootCalculations.slice(0, rootStep).map(calculation => <p key={calculation.position} className="flex flex-wrap items-center gap-2 font-serif italic text-3xl text-emerald-800 md:text-4xl">{calculation.completed}</p>)}</div>}<div className="space-y-4"><p className="font-serif italic text-4xl md:text-5xl">{rootCalculations[rootStep].formula}</p>{mode === 'click' ? choose(rootCalculations[rootStep].position, rootCalculations[rootStep].label, rootCalculations[rootStep].choices) : input(rootCalculations[rootStep].position, rootCalculations[rootStep].label)}</div></div>}
      {stage === 3 && delta < 0 && <div><h3 className="text-lg font-black">4. Concludi</h3><p>Poiché Δ &lt; 0, la radice quadrata non è reale. L’equazione non ha soluzioni in ℝ.</p></div>}
      {stage < 4 ? (stage === 0 && mode === 'click' ? null : <button onClick={check} className="rounded-xl bg-indigo-600 px-6 py-3 font-black text-white hover:bg-indigo-700">Verifica passaggio</button>) : <section className="mx-auto max-w-3xl space-y-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-6" aria-label="Soluzioni dell'equazione"><h3 className="text-xl font-black text-emerald-900">Soluzioni dell’equazione</h3>{delta < 0 ? <p className="font-serif italic text-3xl">Nessuna soluzione reale</p> : <><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-white p-5 text-center shadow-sm"><p className="text-lg font-bold text-emerald-800">Prima soluzione · segno +</p><p className="mt-2 font-serif italic text-5xl font-bold">x₁ = <MathValue value={fraction(root1)} /></p></div><div className="rounded-2xl bg-white p-5 text-center shadow-sm"><p className="text-lg font-bold text-emerald-800">Seconda soluzione · segno −</p><p className="mt-2 font-serif italic text-5xl font-bold">x₂ = <MathValue value={fraction(root2)} /></p></div></div>{delta === 0 && <p className="font-bold text-emerald-900">Le due soluzioni coincidono: radice doppia.</p>}</>}<button onClick={next} className="font-bold text-indigo-700 underline">Prossimo esercizio</button></section>}
      {message && stage < 4 && <p role="status" className="rounded-xl bg-slate-50 p-3 font-semibold">{message}</p>}
    </>}
    </div>}
  </div>;
};

export default QuadraticExercise;
