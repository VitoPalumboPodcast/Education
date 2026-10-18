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
const signed = (n: number, suffix = '') => n < 0 ? ` − ${Math.abs(n)}${suffix}` : ` + ${n}${suffix}`;
const polynomial = ({ a, b, c }: Example) => `${a === 1 ? '' : a === -1 ? '−' : a}x²${b === 0 ? '' : signed(b, 'x')}${c === 0 ? '' : signed(c)} = 0`;

const QuadraticExercise: React.FC<{ difficulty: Difficulty; onComplete: () => void }> = ({ difficulty, onComplete }) => {
  const [tab, setTab] = useState<'study' | 'practice'>('study');
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [values, setValues] = useState<string[]>(Array(9).fill(''));
  const [message, setMessage] = useState('');
  const example = EXAMPLES[difficulty][index % EXAMPLES[difficulty].length];
  const delta = example.b ** 2 - 4 * example.a * example.c;
  const roots = useMemo(() => delta < 0 ? [] : [(-example.b - Math.sqrt(delta)) / (2 * example.a), (-example.b + Math.sqrt(delta)) / (2 * example.a)].sort((x, y) => x - y), [example, delta]);

  const next = () => { setIndex(i => i + 1); setStage(0); setValues(Array(9).fill('')); setMessage(''); };
  const update = (position: number, value: string) => setValues(old => old.map((v, i) => i === position ? value : v));
  const advance = () => { setMessage('Corretto! Prosegui con il passaggio successivo.'); setStage(s => s + 1); };
  const check = () => {
    if (stage === 0) {
      if ([example.a, example.b, example.c].every((n, i) => equal(values[i], n))) advance();
      else setMessage('Rileggi i coefficienti e controlla i segni: a è davanti a x², b davanti a x, c è il termine noto.');
    } else if (stage === 1) {
      if (equal(values[3], delta)) advance();
      else setMessage(`Calcola b² − 4ac. Se b è negativo, mettilo tra parentesi: (${example.b})².`);
    } else if (stage === 2) {
      const sign = delta > 0 ? 'positive' : delta === 0 ? 'zero' : 'negative';
      if (values[4] === sign) advance();
      else setMessage('Il segno di Δ determina quante soluzioni reali ci sono.');
    } else if (stage === 3 && delta >= 0) {
      const ok = delta === 0 ? equal(values[5], roots[0]) :
        (equal(values[5], roots[0]) && equal(values[6], roots[1])) ||
        (equal(values[5], roots[1]) && equal(values[6], roots[0]));
      if (ok) advance();
      else setMessage('Usa x = (−b ± √Δ)/(2a). Accetto frazioni come 3/2 e le due radici in qualsiasi ordine.');
    } else if ((stage === 3 && delta < 0) || (stage === 4 && delta >= 0)) {
      if (delta < 0 || (equal(values[7], -example.b / example.a) && equal(values[8], example.c / example.a))) {
        setStage(5); setMessage('Esercizio completato!'); onComplete();
      } else setMessage('Usa le formule di Viète: somma = −b/a, prodotto = c/a.');
    }
  };
  const input = (position: number, label: string) => <label className="flex flex-col gap-2 text-sm font-bold text-slate-700" key={position}>{label}<input inputMode="decimal" aria-label={label} value={values[position] || ''} onChange={e => update(position, e.target.value)} className="w-32 max-w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-lg focus:border-indigo-500 outline-none" placeholder="numero o frazione" /></label>;

  return <div className="max-w-5xl mx-auto space-y-7 text-slate-800">
    <div><p className="text-xs font-black uppercase tracking-widest text-indigo-600">Nuovo capitolo · Matematica 3G</p><h2 className="text-3xl md:text-4xl font-black mt-2">Equazioni di secondo grado</h2><p className="text-slate-600 mt-2">Dalla forma ax² + bx + c = 0 alle radici, con esercizi guidati passo per passo.</p></div>
    <div className="flex gap-2" role="tablist" aria-label="Sezioni del capitolo"><button role="tab" aria-selected={tab === 'study'} onClick={() => setTab('study')} className={`rounded-xl px-5 py-3 font-bold ${tab === 'study' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Studia</button><button role="tab" aria-selected={tab === 'practice'} onClick={() => setTab('practice')} className={`rounded-xl px-5 py-3 font-bold ${tab === 'practice' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Allenati</button></div>
    {tab === 'study' ? <div className="grid gap-5 md:grid-cols-2">
      <section className="rounded-2xl bg-indigo-50 p-6"><h3 className="text-xl font-black">1. Riconosci i coefficienti</h3><p className="mt-3">Porta l’equazione nella forma <strong>ax² + bx + c = 0</strong>, con a ≠ 0. a moltiplica x², b moltiplica x, c è il termine noto. Se un termine manca, il suo coefficiente è zero.</p><p className="mt-3 font-bold">2x² − 5x + 3 = 0 → a = 2, b = −5, c = 3</p></section>
      <section className="rounded-2xl bg-amber-50 p-6"><h3 className="text-xl font-black">2. Calcola il discriminante</h3><p className="mt-3 text-xl font-bold">Δ = b² − 4ac</p><p className="mt-2">Δ &gt; 0: due radici reali distinte. Δ = 0: una radice doppia. Δ &lt; 0: nessuna radice reale.</p><p className="mt-3">Se b è negativo, usa le parentesi: (−5)² = 25.</p></section>
      <section className="rounded-2xl bg-emerald-50 p-6"><h3 className="text-xl font-black">3. Trova le radici</h3><p className="mt-3 text-xl font-bold">x = (−b ± √Δ) / (2a)</p><p className="mt-2">Quando Δ ≥ 0, fai due calcoli separati, uno con + e uno con −. Se Δ = 0 coincidono. Se Δ &lt; 0 fermati: non ci sono soluzioni in ℝ.</p><p className="mt-3">Per x² − 5x + 6 = 0: Δ = 1, quindi x = (5 ± 1)/2 → 2 e 3.</p></section>
      <section className="rounded-2xl bg-violet-50 p-6"><h3 className="text-xl font-black">4. Controlla con Viète</h3><p className="mt-3 text-xl font-bold">x₁ + x₂ = −b/a<br />x₁ · x₂ = c/a</p><p className="mt-2">Per 6x² − 10x + 3 = 0: somma = 5/3 e prodotto = 1/2. Le formule valgono anche se la radice è doppia; per radici reali richiedi Δ ≥ 0.</p></section>
      <section className="rounded-2xl bg-slate-50 p-6 md:col-span-2"><h3 className="text-xl font-black">Perché funziona la formula?</h3><p className="mt-3">Dividi ax² + bx + c = 0 per a, poi aggiungi (b/2a)² a entrambi i membri. Ottieni <strong>(x + b/2a)² = (b² − 4ac)/(4a²)</strong>. Estraendo la radice con entrambi i segni e isolando x si ottiene la formula generale.</p><p className="mt-2 text-sm text-slate-600">Controllo finale: segni dei coefficienti, parentesi attorno a b negativo, Δ, denominatore 2a, due radici separate.</p></section>
    </div> : <div className="rounded-2xl border border-slate-200 p-5 md:p-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold text-indigo-600">{example.note}</p><p className="text-2xl md:text-3xl font-black mt-1">{polynomial(example)}</p></div><button onClick={next} className="rounded-xl border border-indigo-300 px-4 py-2 font-bold text-indigo-700">Nuovo esercizio</button></div>
      <p className="text-sm font-semibold text-slate-500">Passaggio {Math.min(stage + 1, 5)} di 5</p>
      {stage === 0 && <div><h3 className="text-lg font-black mb-4">1. Individua a, b e c</h3><div className="flex flex-wrap gap-4">{input(0, 'a')}{input(1, 'b')}{input(2, 'c')}</div></div>}
      {stage === 1 && <div><h3 className="text-lg font-black mb-4">2. Calcola Δ = b² − 4ac</h3>{input(3, 'Valore di Δ')}</div>}
      {stage === 2 && <div><h3 className="text-lg font-black mb-4">3. Qual è il segno di Δ?</h3><div className="flex flex-wrap gap-3">{[['positive','Δ > 0 · due radici'],['zero','Δ = 0 · radice doppia'],['negative','Δ < 0 · nessuna radice reale']].map(([value,label]) => <button key={value} onClick={() => update(4,value)} aria-pressed={values[4] === value} className={`rounded-xl border-2 px-4 py-2 font-bold ${values[4] === value ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}>{label}</button>)}</div></div>}
      {stage === 3 && delta >= 0 && <div><h3 className="text-lg font-black mb-4">4. Applica x = (−b ± √Δ)/(2a)</h3><div className="flex flex-wrap gap-4">{input(5, 'Prima radice')}{delta > 0 && input(6, 'Seconda radice')}</div></div>}
      {stage === 3 && delta < 0 && <div><h3 className="text-lg font-black">4. Concludi</h3><p>Poiché Δ &lt; 0, la radice quadrata non è reale. L’equazione non ha soluzioni in ℝ.</p></div>}
      {stage === 4 && <div><h3 className="text-lg font-black mb-4">5. Verifica somma e prodotto</h3><div className="flex flex-wrap gap-4">{input(7, 'Somma x₁ + x₂')}{input(8, 'Prodotto x₁ · x₂')}</div></div>}
      {stage < 5 ? <button onClick={check} className="rounded-xl bg-indigo-600 px-6 py-3 font-black text-white hover:bg-indigo-700">Verifica passaggio</button> : <div className="rounded-xl bg-emerald-50 p-5"><strong>Ottimo lavoro!</strong> {delta < 0 ? 'Nessuna soluzione reale.' : `Radici: ${roots.map(fmt).join(' e ')}. Somma: ${fmt(-example.b / example.a)}. Prodotto: ${fmt(example.c / example.a)}.`} <button onClick={next} className="ml-3 font-bold text-indigo-700 underline">Prossimo esercizio</button></div>}
      {message && stage < 5 && <p role="status" className="rounded-xl bg-slate-50 p-3 font-semibold">{message}</p>}
    </div>}
  </div>;
};

export default QuadraticExercise;

