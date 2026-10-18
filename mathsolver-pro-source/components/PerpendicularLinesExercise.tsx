
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart, registerables, Plugin } from 'chart.js';
import MathRenderer from './MathRenderer';
import MathKeypad from './MathKeypad';
import DraggableSolver from './DraggableSolver';
import { normalizeMathString, formatPoly, evaluateMathExpression } from '../services/mathService';
import { Monomial } from '../types';

Chart.register(...registerables);

interface PerpendicularLinesExerciseProps {
  metadata: { m_r: number, q_r: number, x_p: number, y_p: number, m_s: number, q_s: number };
  onComplete: () => void;
  setVoiceMessage: (msg: string) => void;
}

enum PerpStep {
  FIND_M_PRIME,
  SUBSTITUTE_FOR_Q,
  PERFORM_MULTIPLICATION,
  CALC_Q_PRIME,
  FINAL_EQUATION,
  FINISHED
}

const PerpendicularLinesExercise: React.FC<PerpendicularLinesExerciseProps> = ({ metadata, onComplete, setVoiceMessage }) => {
  const [currentStep, setCurrentStep] = useState<PerpStep>(PerpStep.FIND_M_PRIME);
  const [userInput, setUserInput] = useState('');
  const [isMDropped, setIsMDropped] = useState(false);
  const [isHoveringDrop, setIsHoveringDrop] = useState(false);
  const [isSelectedM, setIsSelectedM] = useState(false);
  
  const [subY, setSubY] = useState<number | null>(null);
  const [subM, setSubM] = useState<string | null>(null);
  const [subX, setSubX] = useState<number | null>(null);
  const [draggingSource, setDraggingSource] = useState<'YP' | 'XP' | 'MP' | null>(null);

  const [isProductDone, setIsProductDone] = useState(false);
  const [mXProduct, setMXProduct] = useState<{ n: number, d: number } | null>(null);
  const [isSelectedMForProduct, setIsSelectedMForProduct] = useState(false);

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;

  // Rappresentazione frazionaria di m'
  const mPrimeFrac = useMemo(() => {
    let n = -1;
    let d = metadata.m_r;
    if (d < 0) { n = 1; d = Math.abs(d); }
    const common = gcd(Math.abs(n), Math.abs(d));
    return { n: n / common, d: d / common };
  }, [metadata.m_r]);

  const mPrimeStr = useMemo(() => {
    if (mPrimeFrac.d === 1) return mPrimeFrac.n.toString();
    return `${mPrimeFrac.n}/${mPrimeFrac.d}`;
  }, [mPrimeFrac]);

  // Calcolo esatto di q' come frazione: q' = y_p - (m' * x_p)
  const qPrimeFrac = useMemo(() => {
    let num = (metadata.y_p * mPrimeFrac.d) - (mPrimeFrac.n * metadata.x_p);
    let den = mPrimeFrac.d;
    const common = gcd(Math.abs(num), Math.abs(den));
    return { n: num / common, d: den / common };
  }, [metadata.y_p, mPrimeFrac, metadata.x_p]);

  const qPrimeStr = useMemo(() => {
    if (qPrimeFrac.d === 1) return qPrimeFrac.n.toString();
    return `${qPrimeFrac.n}/${qPrimeFrac.d}`;
  }, [qPrimeFrac]);

  // Setup per DraggableSolver (calcolo di q')
  const qEquationSideA = useMemo<Monomial[]>(() => [
    { id: 'q-side-a-yp', coeff: metadata.y_p, den: 1, hasX: false }
  ], [metadata.y_p]);

  const qEquationSideB = useMemo<Monomial[]>(() => {
    if (!mXProduct) return [];
    return [
      { id: 'q-side-b-product', coeff: mXProduct.n, den: mXProduct.d, hasX: false },
      { id: 'q-side-b-qs', coeff: 1, den: 1, hasX: true } // 'x' qui rappresenta q'
    ];
  }, [mXProduct]);

  const cartesianPlugin: Plugin = {
    id: 'cartesianPluginPerp',
    afterDatasetsDraw: (chart) => {
      const { ctx, scales: { x, y } } = chart;
      const xZero = x.getPixelForValue(0);
      const yZero = y.getPixelForValue(0);
      ctx.save();
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x.left, yZero); ctx.lineTo(x.right, yZero); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xZero, y.bottom); ctx.lineTo(xZero, y.top); ctx.stroke();
      const arrowSize = 8; ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.moveTo(x.right, yZero); ctx.lineTo(x.right - arrowSize, yZero - arrowSize / 2); ctx.lineTo(x.right - arrowSize, yZero + arrowSize / 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(xZero, y.top); ctx.lineTo(xZero - arrowSize / 2, y.top + arrowSize); ctx.lineTo(xZero + arrowSize / 2, y.top + arrowSize); ctx.fill();
      ctx.font = 'bold 12px Inter'; ctx.fillText('X', x.right - 15, yZero + 15); ctx.fillText('Y', xZero - 15, y.top + 15);
      ctx.restore();
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [
              { label: 'r', data: [{ x: -10, y: metadata.m_r * -10 + metadata.q_r }, { x: 10, y: metadata.m_r * 10 + metadata.q_r }], borderColor: '#ef4444', borderWidth: 3, pointRadius: 0, fill: false },
              { label: 's', data: [], borderColor: '#10b981', borderWidth: 4, pointRadius: 0, fill: false },
              { label: 'Punto P', data: [{ x: metadata.x_p, y: metadata.y_p }], backgroundColor: '#3b82f6', borderColor: 'white', borderWidth: 3, pointRadius: 8, showLine: false }
            ]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
              x: { type: 'linear', min: -10, max: 10, grid: { color: '#f1f5f9' }, ticks: { stepSize: 1, color: '#94a3b8' } },
              y: { type: 'linear', min: -10, max: 10, grid: { color: '#f1f5f9' }, ticks: { stepSize: 1, color: '#94a3b8' } }
            },
            plugins: { legend: { display: false } }
          },
          plugins: [cartesianPlugin]
        });
      }
    }
    return () => chartInstance.current?.destroy();
  }, [metadata]);

  useEffect(() => {
    if (currentStep === PerpStep.FINISHED && chartInstance.current) {
        chartInstance.current.data.datasets[1].data = [
            { x: -10, y: metadata.m_s * -10 + metadata.q_s },
            { x: 10, y: metadata.m_s * 10 + metadata.q_s }
        ];
        chartInstance.current.update();
    }
  }, [currentStep, metadata]);

  const handleDragStartM = (e: React.DragEvent) => { e.dataTransfer.setData('text/plain', 'm_value'); setIsSelectedM(true); };
  const handleDropM = (e: React.DragEvent) => { e.preventDefault(); if (e.dataTransfer.getData('text/plain') === 'm_value') executeMSubstitution(); };

  const executeMSubstitution = () => {
    setIsMDropped(true); setIsHoveringDrop(false); setIsSelectedM(false);
    setVoiceMessage(`Perfetto! m' vale ${mPrimeStr}. Ora sostituiamo i dati nell'equazione.`);
    setTimeout(() => setCurrentStep(PerpStep.SUBSTITUTE_FOR_Q), 1500);
  };

  const verifyStep = () => {
    const norm = normalizeMathString(userInput);
    const expected = normalizeMathString(`y=${mPrimeStr}x${qPrimeFrac.n >= 0 ? '+' : ''}${qPrimeStr}`);
    const expectedDecimal = normalizeMathString(`y=${metadata.m_s}x${metadata.q_s >= 0 ? '+' : ''}${metadata.q_s}`);
    
    if (norm === expected || norm === expectedDecimal) {
      setCurrentStep(PerpStep.FINISHED);
      onComplete();
      setVoiceMessage("Ottimo lavoro! Hai trovato la retta s perpendicolare a r.");
    } else {
      setVoiceMessage(`Usa la forma y = m'x + q'. Ricorda i valori trovati.`);
    }
  };

  const handleQIsolateComplete = () => {
    setVoiceMessage(`Perfetto, q' è isolato ed è pari a ${qPrimeStr}. Ora scrivi l'equazione finale.`);
    setCurrentStep(PerpStep.FINAL_EQUATION);
    setUserInput('');
  };

  const handleSubstitutionDrop = (zone: 'Y' | 'M' | 'X') => {
    if (!draggingSource) return;
    if (zone === 'Y' && draggingSource === 'YP') { setSubY(metadata.y_p); setVoiceMessage("Sostituita y."); }
    else if (zone === 'M' && draggingSource === 'MP') { setSubM(mPrimeStr); setVoiceMessage("Sostituita m'."); }
    else if (zone === 'X' && draggingSource === 'XP') { setSubX(metadata.x_p); setVoiceMessage("Sostituita x."); }
    setDraggingSource(null);
  };

  useEffect(() => {
    if (subY !== null && subM !== null && subX !== null && currentStep === PerpStep.SUBSTITUTE_FOR_Q) {
      setVoiceMessage("Dati inseriti! Ora calcola il prodotto m' per x.");
      setTimeout(() => setCurrentStep(PerpStep.PERFORM_MULTIPLICATION), 1500);
    }
  }, [subY, subM, subX, currentStep]);

  const executeProductCalculation = () => {
    const num = mPrimeFrac.n * metadata.x_p;
    const den = mPrimeFrac.d;
    const common = gcd(Math.abs(num), Math.abs(den));
    const finalProd = { n: num / common, d: den / common };
    setMXProduct(finalProd);
    setIsProductDone(true);
    setIsSelectedMForProduct(false);
    const prodStr = finalProd.d === 1 ? finalProd.n.toString() : `${finalProd.n}/${finalProd.d}`;
    setVoiceMessage(`Molto bene! Il prodotto fa ${prodStr}. Ora isoliamo q'.`);
    setTimeout(() => setCurrentStep(PerpStep.CALC_Q_PRIME), 2000);
  };

  const handleDropMX = (e: React.DragEvent) => { e.preventDefault(); if (e.dataTransfer.getData('text/plain') === 'multiply_mx') executeProductCalculation(); };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8 animate-slide-in">
      <div className="w-full xl:w-[500px] shrink-0 space-y-6">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50">
          <div className="flex flex-col items-center mb-6 text-center">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Richiesta Esercizio</h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic">
              <p className="text-xs text-slate-600 font-medium">
                Trova la retta <span className="text-emerald-600 font-black">s (incognita)</span> passante per P e perpendicolare alla retta <span className="text-red-600 font-black">r (nota)</span>.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 flex flex-col items-center shadow-sm">
                <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-3">retta r (Nota)</p>
                <div className="font-serif italic text-4xl text-red-600 font-bold flex items-center gap-3">
                    y = 
                    <div 
                      draggable={currentStep === PerpStep.FIND_M_PRIME && !isMDropped}
                      onDragStart={handleDragStartM}
                      onClick={() => currentStep === PerpStep.FIND_M_PRIME && !isMDropped && setIsSelectedM(!isSelectedM)}
                      className={`px-3 py-1 rounded-xl transition-all touch-none select-none ${
                        currentStep === PerpStep.FIND_M_PRIME && !isMDropped 
                          ? 'cursor-grab hover:bg-red-100 hover:scale-110 shadow-sm border-2 border-dashed border-red-300' 
                          : 'opacity-50'
                      } ${isSelectedM ? 'bg-red-500 text-white scale-110 shadow-lg border-white ring-4 ring-red-100 animate-pulse' : ''}`}
                    >
                        {metadata.m_r}
                    </div>
                    x {metadata.q_r >= 0 ? '+' : ''} {metadata.q_r}
                </div>
            </div>
            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex flex-col items-center">
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2">Punto P</p>
                <div className="font-serif italic text-3xl text-blue-700 font-bold flex gap-4">
                  <span>P (</span>
                  <div 
                    draggable={currentStep === PerpStep.SUBSTITUTE_FOR_Q && subX === null}
                    onDragStart={() => setDraggingSource('XP')}
                    onClick={() => currentStep === PerpStep.SUBSTITUTE_FOR_Q && setDraggingSource('XP')}
                    className={`px-2 rounded-lg transition-all ${currentStep === PerpStep.SUBSTITUTE_FOR_Q && subX === null ? 'cursor-grab hover:bg-blue-200 border-2 border-dashed border-blue-300' : ''} ${draggingSource === 'XP' ? 'bg-blue-600 text-white animate-pulse shadow-lg scale-110' : ''}`}
                  >
                    {metadata.x_p}
                  </div>
                  <span>,</span>
                  <div 
                    draggable={currentStep === PerpStep.SUBSTITUTE_FOR_Q && subY === null}
                    onDragStart={() => setDraggingSource('YP')}
                    onClick={() => currentStep === PerpStep.SUBSTITUTE_FOR_Q && setDraggingSource('YP')}
                    className={`px-2 rounded-lg transition-all ${currentStep === PerpStep.SUBSTITUTE_FOR_Q && subY === null ? 'cursor-grab hover:bg-blue-200 border-2 border-dashed border-blue-300' : ''} ${draggingSource === 'YP' ? 'bg-blue-600 text-white animate-pulse shadow-lg scale-110' : ''}`}
                  >
                    {metadata.y_p}
                  </div>
                  <span>)</span>
                </div>
            </div>
            <div className="p-8 bg-emerald-50/30 rounded-[2.5rem] border-2 border-emerald-100 animate-slide-in flex flex-col items-center justify-center gap-4">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest text-center">
                    {isMDropped ? <span className="lowercase">m</span> : <span className="lowercase">m</span>}' calcolata
                </p>
                <div className="flex items-center justify-center gap-6 text-4xl font-serif italic">
                    <span className="text-emerald-700 font-bold lowercase">m'</span>
                    <span className="text-slate-300">=</span>
                    {isMDropped ? (
                      <div 
                        draggable={currentStep === PerpStep.SUBSTITUTE_FOR_Q && subM === null}
                        onDragStart={() => setDraggingSource('MP')}
                        onClick={() => currentStep === PerpStep.SUBSTITUTE_FOR_Q && setDraggingSource('MP')}
                        className={`px-4 py-1 rounded-2xl font-black text-emerald-600 transition-all ${currentStep === PerpStep.SUBSTITUTE_FOR_Q && subM === null ? 'cursor-grab hover:bg-emerald-100 border-2 border-dashed border-emerald-300' : ''} ${draggingSource === 'MP' ? 'bg-emerald-600 text-white shadow-xl animate-pulse scale-110' : ''}`}
                      >
                        {mPrimeStr}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center leading-none">
                        <span className="border-b-4 border-slate-800 px-4 pb-2">-1</span>
                        <div onDragOver={(e) => { e.preventDefault(); setIsHoveringDrop(true); }} onDragLeave={() => setIsHoveringDrop(false)} onDrop={handleDropM} onClick={() => isSelectedM && executeMSubstitution()}
                          className={`min-w-[70px] h-14 mt-2 rounded-2xl border-4 border-dashed transition-all flex items-center justify-center ${isSelectedM || isHoveringDrop ? 'bg-red-50 border-red-400 scale-110 shadow-lg animate-pulse' : 'bg-white border-slate-200 text-slate-300'}`}
                        >?</div>
                      </div>
                    )}
                </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 flex flex-col gap-6 min-h-[400px]">
           <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Svolgimento per Retta s</h5>
           {currentStep === PerpStep.SUBSTITUTE_FOR_Q && (
             <div className="space-y-6 animate-slide-in">
               <p className="text-xs font-black text-emerald-600 uppercase tracking-widest text-center font-black">Sostituzione dati in s</p>
               <div className="p-8 bg-emerald-50/30 rounded-[2.5rem] border-4 border-dashed border-emerald-200 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  <div className="flex items-baseline justify-center gap-1 sm:gap-2 text-4xl sm:text-5xl font-serif italic text-slate-800">
                    <div onDragOver={(e) => e.preventDefault()} onDrop={() => handleSubstitutionDrop('Y')} onClick={() => handleSubstitutionDrop('Y')} className={`min-w-[80px] h-20 flex items-center justify-center rounded-2xl border-2 transition-all shadow-sm ${subY !== null ? 'bg-blue-100 border-blue-400 text-blue-600 font-bold scale-105' : 'bg-white border-slate-200 border-dashed text-slate-200'}`}>{subY !== null ? subY : 'y'}</div>
                    <span className="mx-1 text-slate-400 font-serif text-4xl">=</span>
                    <div onDragOver={(e) => e.preventDefault()} onDrop={() => handleSubstitutionDrop('M')} onClick={() => handleSubstitutionDrop('M')} className={`min-w-[80px] h-20 flex items-center justify-center rounded-xl border-2 transition-all shadow-sm ${subM !== null ? 'bg-emerald-100 border-emerald-400 text-emerald-600 font-bold scale-105' : 'bg-white border-slate-200 border-dashed text-slate-200'}`}>{subM !== null ? subM : <span className="lowercase">m'</span>}</div>
                    <span className="mx-1 text-slate-400 font-serif text-3xl">·</span>
                    <span className="text-slate-400 font-serif text-5xl">(</span>
                    <div onDragOver={(e) => e.preventDefault()} onDrop={() => handleSubstitutionDrop('X')} onClick={() => handleSubstitutionDrop('X')} className={`min-w-[80px] h-20 flex items-center justify-center rounded-2xl border-2 transition-all shadow-sm ${subX !== null ? 'bg-blue-100 border-blue-400 text-blue-600 font-bold scale-105' : 'bg-white border-slate-200 border-dashed text-slate-200'}`}>{subX !== null ? subX : 'x'}</div>
                    <span className="text-slate-400 font-serif text-5xl">)</span>
                    <span className="mx-1 text-slate-400 font-serif text-4xl">+</span>
                    <span className="font-serif italic text-emerald-700 font-bold text-5xl">q'</span>
                  </div>
               </div>
             </div>
           )}

           {currentStep === PerpStep.PERFORM_MULTIPLICATION && (
             <div className="space-y-6 animate-slide-in">
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest text-center">Calcola il prodotto</p>
               <div className="p-8 bg-emerald-50/20 rounded-[2.5rem] border-2 border-emerald-200 flex flex-col items-center justify-center shadow-inner overflow-hidden relative">
                  <div className="flex items-baseline justify-center gap-1 sm:gap-2 text-4xl sm:text-5xl font-serif italic text-slate-800">
                    <div className="min-w-[80px] h-20 flex items-center justify-center rounded-2xl border-2 bg-blue-50 border-blue-200 text-blue-600 font-bold">{metadata.y_p}</div>
                    <span className="mx-1 text-slate-400 font-serif text-4xl">=</span>
                    {isProductDone ? (
                      <div className="min-w-[120px] h-20 flex items-center justify-center rounded-2xl border-2 bg-emerald-100 border-emerald-400 text-emerald-700 font-black animate-slide-in shadow-md">
                        {mXProduct ? (mXProduct.d === 1 ? mXProduct.n : (
                          <span className="inline-flex flex-col items-center leading-none text-2xl">
                             <span className="border-b border-emerald-700 px-1">{Math.abs(mXProduct.n)}</span>
                             <span className="px-1">{mXProduct.d}</span>
                          </span>
                        )) : ''}
                      </div>
                    ) : (
                      <><div draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', 'multiply_mx')} onClick={() => setIsSelectedMForProduct(!isSelectedMForProduct)}
                          className={`min-w-[80px] h-20 flex items-center justify-center rounded-2xl border-2 transition-all shadow-sm ring-2 ${isSelectedMForProduct ? 'bg-emerald-600 text-white shadow-xl animate-pulse scale-110 ring-emerald-200' : 'bg-emerald-50 border-emerald-400 text-emerald-600 ring-emerald-100 cursor-grab active:cursor-grabbing hover:scale-110'}`}>{mPrimeStr}</div>
                        <span className="mx-1 text-slate-400 font-serif text-3xl">·</span>
                        <div onDragOver={(e) => e.preventDefault()} onDrop={handleDropMX} onClick={() => isSelectedMForProduct && executeProductCalculation()}
                          className={`min-w-[80px] h-20 flex items-center justify-center rounded-2xl border-2 transition-all ${isSelectedMForProduct ? 'bg-indigo-100 border-indigo-400 scale-110 shadow-lg animate-pulse' : 'bg-white border-slate-200 border-dashed text-slate-400'}`}>({metadata.x_p})</div>
                      </>
                    )}
                    <span className="mx-1 text-slate-400 font-serif text-4xl">+</span>
                    <span className="font-serif italic text-emerald-700 font-bold text-5xl">q'</span>
                  </div>
               </div>
             </div>
           )}

           {currentStep === PerpStep.CALC_Q_PRIME && (
             <div className="space-y-6 animate-slide-in border-t border-slate-100 pt-6">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest text-center">Isolamento q'</p>
                <div className="p-2 bg-emerald-50/30 rounded-[2.5rem] border-2 border-emerald-100 shadow-inner">
                  <DraggableSolver initialSideA={qEquationSideA} initialSideB={qEquationSideB} variableLabel="q'" onStepComplete={() => {}} onComplete={handleQIsolateComplete} compact />
                </div>
             </div>
           )}

           {currentStep === PerpStep.FINAL_EQUATION && (
             <div className="space-y-6 animate-slide-in border-t border-slate-100 pt-6">
                <div className="p-6 bg-emerald-50/30 border-2 border-emerald-200 rounded-[2.5rem] shadow-inner flex flex-col items-center">
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-6">Equazione finale retta s</p>
                    <div className="w-full flex gap-4 mb-6">
                      <div className="flex-1 p-4 bg-white rounded-2xl border border-emerald-100 text-center shadow-sm">
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1"><span className="lowercase">m</span>' trovata</p>
                        <p className="font-serif italic text-xl text-emerald-700 font-bold">{mPrimeStr}</p>
                      </div>
                      <div className="flex-1 p-4 bg-white rounded-2xl border border-emerald-100 text-center shadow-sm">
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">q' trovata</p>
                        <p className="font-serif italic text-xl text-emerald-700 font-bold">{qPrimeStr}</p>
                      </div>
                    </div>
                    <div className="w-full bg-white p-6 rounded-2xl border-4 border-emerald-400 shadow-xl scale-105 transition-transform">
                      <input type="text" value={userInput} readOnly placeholder="y = m'x + q'" className="w-full text-center text-4xl font-serif italic text-emerald-900 bg-transparent outline-none font-black" />
                    </div>
                </div>
                <MathKeypad onInput={(c) => setUserInput(p => p + c)} onDelete={() => setUserInput(p => p.slice(0, -1))} onClear={() => setUserInput('')} />
                <button onClick={verifyStep} className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Verifica Equazione s</button>
             </div>
           )}

           {currentStep === PerpStep.FINISHED && (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-slide-in py-10">
                <div className="text-8xl">📐</div>
                <h3 className="text-2xl font-black text-emerald-600 italic uppercase tracking-tighter">Retta S Trovata con Successo!</h3>
                <div className="p-8 bg-emerald-100 rounded-[2.5rem] border-4 border-emerald-500 shadow-2xl scale-110">
                    <p className="font-serif italic text-3xl text-emerald-900 font-black">s: y = {mPrimeStr}x {qPrimeFrac.n >= 0 ? '+' : ''} {qPrimeStr}</p>
                </div>
             </div>
           )}
        </div>
      </div>
      <div className="flex-grow bg-white p-10 rounded-[4rem] shadow-2xl border border-slate-50 flex flex-col h-[750px] w-full min-w-0 transition-all">
          <div className="flex flex-col gap-8 mb-8 px-4">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <h3 className="text-4xl font-black text-slate-800 italic tracking-tighter mb-1">Analisi Grafica</h3>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Perpendicolarità e Passaggio per P</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="bg-white px-8 py-5 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex flex-col items-center">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Pendenza retta s</p>
                  <div className="font-serif italic text-4xl text-indigo-600 font-bold flex items-center gap-2">
                      <span className="lowercase">m'</span>
                      <span>=</span>
                      <div className="flex flex-col items-center leading-none">
                          <span className="border-b-2 border-indigo-600 px-2 pb-1">-1</span>
                          <span className="px-2 pt-1 text-2xl lowercase">m</span>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-grow bg-[#f8fafc] rounded-[3rem] border border-slate-100 p-8 shadow-inner relative overflow-hidden">
            <canvas ref={chartRef}></canvas>
          </div>
      </div>
    </div>
  );
};

export default PerpendicularLinesExercise;

