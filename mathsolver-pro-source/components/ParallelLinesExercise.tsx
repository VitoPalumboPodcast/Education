
import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import MathRenderer from './MathRenderer';
import MathKeypad from './MathKeypad';
import { normalizeMathString } from '../services/mathService';

Chart.register(...registerables);

interface ParallelLinesExerciseProps {
  metadata: { m1: number, q1: number, m2: number, q2: number, isParallel: boolean, line2Raw: string };
  onComplete: () => void;
  setVoiceMessage: (msg: string) => void;
}

enum ParallelStep {
  EXPLICIT_FORM,
  COMPARE_M,
  CALC_POINTS,
  FINISHED
}

enum CalcSubStep {
  IDLE,
  SUBSTITUTE,
  RESULT
}

// Interfaccia per i termini del mini-solver
interface SolverTerm {
  id: string;
  type: 'x' | 'y' | 'n';
  val: number;
  side: 'left' | 'right';
}

const ParallelLinesExercise: React.FC<ParallelLinesExerciseProps> = ({ metadata, onComplete, setVoiceMessage }) => {
  const [step, setStep] = useState<ParallelStep>(ParallelStep.EXPLICIT_FORM);
  const [userInput, setUserInput] = useState('');
  const [points2, setPoints2] = useState<{ x: number, y: number }[]>([]);
  
  // Stati per il solver interattivo (Step 1)
  const [solverTerms, setSolverTerms] = useState<SolverTerm[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Stati per la calcolatrice interattiva dei punti
  const [currentX, setCurrentX] = useState<string>('');
  const [calcSubStep, setCalcSubStep] = useState<CalcSubStep>(CalcSubStep.IDLE);
  const [calcInput, setCalcInput] = useState<string>('y=');

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Inizializzazione termini per l'esplicitazione
  useEffect(() => {
    if (step === ParallelStep.EXPLICIT_FORM) {
      // Costruiamo l'equazione implicita iniziale: -m2*x + y - q2 = 0
      setSolverTerms([
        { id: 't-x', type: 'x', val: -metadata.m2, side: 'left' },
        { id: 't-y', type: 'y', val: 1, side: 'left' },
        { id: 't-n', type: 'n', val: -metadata.q2, side: 'left' }
      ]);
      setVoiceMessage("Trasforma l'equazione in forma esplicita: clicca su un termine per selezionarlo, poi clicca nella zona di destinazione per spostarlo.");
    }
  }, [step, metadata]);

  // Gestione click su un termine (Selezione)
  const handleTermClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Evita propagazione al contenitore
    if (isAnimating) return;
    
    if (selectedTermId === id) {
      setSelectedTermId(null); // Deseleziona
    } else {
      setSelectedTermId(id);
    }
  };

  // Gestione click su una zona (Spostamento)
  const handleSideClick = (targetSide: 'left' | 'right') => {
    if (!selectedTermId || isAnimating) return;

    const term = solverTerms.find(t => t.id === selectedTermId);
    if (!term) return;

    // Se clicco sullo stesso lato dove è già il termine, deseleziono
    if (term.side === targetSide) {
      setSelectedTermId(null);
      return;
    }

    // Blocca lo spostamento della y (deve restare a sinistra per convenzione in questo esercizio)
    if (term.type === 'y' && term.side === 'left') {
      setVoiceMessage("La y deve rimanere a sinistra per esplicitare l'equazione.");
      setSelectedTermId(null);
      return;
    }

    setIsAnimating(true);
    
    setSolverTerms(prev => prev.map(t => {
      if (t.id !== selectedTermId) return t;
      return {
        ...t,
        side: targetSide,
        val: -t.val // Cambio segno
      };
    }));

    setSelectedTermId(null);

    setTimeout(() => {
      setIsAnimating(false);
      checkSolverCompletion();
    }, 500);
  };

  const checkSolverCompletion = () => {
    setSolverTerms(current => {
      const left = current.filter(t => t.side === 'left');
      const right = current.filter(t => t.side === 'right');
      
      // Condizione di vittoria: Solo Y a sinistra, X e N a destra
      const isYLeft = left.length === 1 && left[0].type === 'y';
      const isOthersRight = right.length === 2 && right.some(t => t.type === 'x') && right.some(t => t.type === 'n');
      
      if (isYLeft && isOthersRight) {
        setTimeout(() => {
          setStep(ParallelStep.COMPARE_M);
          setVoiceMessage("Ottimo! Hai isolato la y. Ora confronta i coefficienti angolari.");
        }, 800);
      }
      return current;
    });
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [
              { label: 'Retta 1 (r1)', data: [{ x: -10, y: metadata.m1 * -10 + metadata.q1 }, { x: 10, y: metadata.m1 * 10 + metadata.q1 }], borderColor: '#4f46e5', borderWidth: 2, pointRadius: 0, borderDash: [5, 5], fill: false },
              { label: 'Retta 2 (r2)', data: [], borderColor: '#f59e0b', borderWidth: 4, pointRadius: 0, fill: false },
              { label: 'Punti r2', data: [], backgroundColor: '#f59e0b', borderColor: 'white', borderWidth: 2, pointRadius: 6, showLine: false }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { type: 'linear', min: -10, max: 10, grid: { color: '#f1f5f9' }, ticks: { stepSize: 1, color: '#64748b', font: { weight: 'bold', size: 12 } } },
              y: { type: 'linear', min: -10, max: 10, grid: { color: '#f1f5f9' }, ticks: { stepSize: 1, color: '#64748b', font: { weight: 'bold', size: 12 } } }
            },
            plugins: { legend: { display: true, position: 'top', labels: { font: { weight: 'bold', size: 14 } } } }
          }
        });
      }
    }
    return () => chartInstance.current?.destroy();
  }, [metadata]);

  // Aggiorna il grafico quando cambiano i punti della seconda retta
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.data.datasets[2].data = points2.map(p => ({ x: p.x, y: p.y }));
      if (points2.length >= 2) {
        chartInstance.current.data.datasets[1].data = [
          { x: -10, y: metadata.m2 * -10 + metadata.q2 },
          { x: 10, y: metadata.m2 * 10 + metadata.q2 }
        ];
      }
      chartInstance.current.update();
    }
  }, [points2, metadata]);

  const verifyAlgebraicStep = () => {
    const norm = normalizeMathString(userInput);
     if (step === ParallelStep.COMPARE_M) {
      // Fix: gestiamo anche 'sì' con l'accento
      const isYes = norm.includes('si') || norm.includes('sì') || norm.includes('yes');
      const isNo = norm.includes('no');
      
      if ((isYes && metadata.isParallel) || (isNo && !metadata.isParallel)) {
        setStep(ParallelStep.CALC_POINTS);
        setUserInput('');
        setVoiceMessage(`Esatto! Ora verifichiamo graficamente calcolando due punti per r₂ usando la sua forma canonica.`);
      } else {
        setVoiceMessage("Controlla bene m₁ e m₂. Due rette sono parallele solo se hanno lo stesso coefficiente angolare.");
      }
    }
  };

  const startCalculation = () => {
    const x = parseFloat(currentX);
    if (isNaN(x)) {
      setVoiceMessage("Inserisci un numero intero per la x.");
      return;
    }
    if (points2.some(p => p.x === x)) {
      setVoiceMessage("Hai già usato questo valore di x.");
      return;
    }
    setCalcSubStep(CalcSubStep.SUBSTITUTE);
    setCalcInput('y=');
    setVoiceMessage(`Sostituiamo x=${x} nella forma canonica di r₂: y = ${metadata.m2}(${x}) ${metadata.q2 >= 0 ? '+' : ''} ${metadata.q2}`);
  };

  const verifyPointCalculation = () => {
    const xVal = parseFloat(currentX);
    const expectedY = metadata.m2 * xVal + metadata.q2;
    const normalized = normalizeMathString(calcInput);

    if (normalized === normalizeMathString(`y=${expectedY}`)) {
      const newPoints = [...points2, { x: xVal, y: expectedY }];
      setPoints2(newPoints);
      setCurrentX('');
      setCalcSubStep(CalcSubStep.IDLE);
      setCalcInput('y=');
      setVoiceMessage(`Punto trovato: (${xVal}, ${expectedY}).`);
      
      if (newPoints.length >= 2) {
        setStep(ParallelStep.FINISHED);
        setVoiceMessage("Perfetto! Ora le due rette sono visibili sul piano cartesiano.");
        onComplete();
      }
    } else {
      setVoiceMessage("Il calcolo non è corretto. Moltiplica la pendenza per la x e poi aggiungi l'intercetta q.");
    }
  };

  // Helper per renderizzare i termini del solver
  const renderTerm = (t: SolverTerm, index: number, total: number) => {
    const absVal = Math.abs(t.val);
    let label = '';
    
    if (t.type === 'y') label = 'y';
    else if (t.type === 'x') label = absVal === 1 ? 'x' : `${absVal}x`;
    else label = `${absVal}`;

    const sign = t.val < 0 ? '-' : '+';
    // Mostra il segno se negativo, oppure se positivo e non è il primo elemento
    const showSign = t.val < 0 || index > 0;
    const signChar = t.val < 0 ? '-' : '+';
    
    const isSelected = selectedTermId === t.id;

    return (
      <div 
        key={t.id}
        onClick={(e) => handleTermClick(e, t.id)}
        className={`flex items-center gap-1 group cursor-pointer transition-all duration-300 ${isAnimating ? 'pointer-events-none' : ''}`}
      >
        {showSign && (
          <span className="text-3xl font-serif text-slate-400 font-bold mx-1">{signChar}</span>
        )}
        <div className={`
          px-5 py-3 rounded-2xl font-serif italic text-3xl font-black shadow-md border-2 
          flex items-center justify-center min-w-[70px] transition-all
          ${isSelected 
             ? 'scale-110 ring-4 ring-indigo-300 z-10' 
             : 'hover:scale-105 active:scale-95'}
          ${t.type === 'y' 
            ? (isSelected ? 'bg-indigo-600 border-indigo-800 text-white' : 'bg-indigo-100 border-indigo-300 text-indigo-800')
            : (isSelected ? 'bg-indigo-600 border-indigo-800 text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300')}
        `}>
          {label}
        </div>
      </div>
    );
  };

  const line1Latex = `y = ${metadata.m1}x ${metadata.q1 >= 0 ? '+' : ''} ${metadata.q1}`;
  const line2ExplicitLatex = `y = ${metadata.m2}x ${metadata.q2 >= 0 ? '+' : ''} ${metadata.q2}`;

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8 animate-slide-in">
      {/* Colonna Sinistra: Algebra e Calcolo */}
      <div className="w-full xl:w-[600px] shrink-0 space-y-6">
        
        {/* Istruzioni Iniziali */}
        {step === ParallelStep.EXPLICIT_FORM && (
          <div className="bg-indigo-50/50 p-6 rounded-[2.5rem] border border-indigo-100 text-center shadow-sm">
               <p className="text-slate-600 leading-relaxed font-medium italic">
                 "Obiettivo: capire se le rette sono parallele. Trasforma la seconda equazione in <span className="font-serif italic font-bold text-indigo-600">forma esplicita</span> (isolando la y) per confrontare la pendenza con la prima retta."
               </p>
          </div>
        )}

        {/* Card Dati Iniziali */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50">
          <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Analisi Parallelismo</h4>
          <div className="space-y-4">
            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
               <div className="flex justify-between items-baseline mb-2 px-1">
                   <p className="text-xs font-black text-indigo-500">RETTA <span className="font-serif italic">r</span><sub>1</sub></p>
                   <p className="text-lg font-serif italic text-indigo-400">y = m₁x + q₁</p>
               </div>
               <MathRenderer latex={line1Latex} noPadding />
            </div>
            <div className={`p-5 rounded-2xl border transition-all duration-500 ${step >= ParallelStep.COMPARE_M ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
               <div className="flex justify-between items-baseline mb-2 px-1">
                   <p className={`text-xs font-black ${step >= ParallelStep.COMPARE_M ? 'text-amber-600' : 'text-slate-500'}`}>
                     RETTA <span className="font-serif italic">r</span><sub>2</sub> {step >= ParallelStep.COMPARE_M ? '(ESPLICITA)' : '(IMPLICITA)'}
                   </p>
                   <p className="text-lg font-serif italic text-slate-400">y = m₂x + q₂</p>
               </div>
               {step >= ParallelStep.COMPARE_M ? (
                 <MathRenderer latex={line2ExplicitLatex} noPadding />
               ) : (
                 <div className="text-3xl font-serif italic text-center py-4 text-slate-700">{metadata.line2Raw}</div>
               )}
            </div>
          </div>
        </div>

        {/* Card Azione Corrente */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 min-h-[500px] flex flex-col">
          {step === ParallelStep.FINISHED ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 flex-grow animate-slide-in">
               <div className="text-7xl">✨</div>
               <h3 className="text-3xl font-black italic text-emerald-600 uppercase tracking-tighter">Analisi Completata</h3>
               <div className="p-8 bg-emerald-50 rounded-[2rem] border-2 border-emerald-100 shadow-sm">
                 <p className="text-emerald-900 font-serif italic text-2xl leading-relaxed">
                    {metadata.isParallel 
                      ? <>Le rette sono <b className="text-emerald-700">parallele</b>: hanno la stessa pendenza <span className="whitespace-nowrap">(m₁ = m₂)</span>.</>
                      : <>Le rette sono <b className="text-emerald-700">incidenti</b> (non parallele): hanno pendenze diverse <span className="whitespace-nowrap">(m₁ ≠ m₂)</span>.</>
                    }
                 </p>
               </div>
            </div>
          ) : step === ParallelStep.CALC_POINTS ? (
            <div className="space-y-6 animate-slide-in">
               <h5 className="text-sm font-black text-slate-500 uppercase tracking-widest text-center">Tabella Punti per r₂</h5>
               
               <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden mb-6 shadow-inner">
                  <table className="w-full text-center">
                    <thead className="bg-slate-100 text-xs font-black text-slate-600 uppercase">
                      <tr><th className="p-4 border-r border-slate-200">X</th><th className="p-4">Y</th></tr>
                    </thead>
                    <tbody>
                      {points2.map((p, i) => (
                        <tr key={i} className="border-t border-slate-100 text-3xl font-serif italic text-slate-800">
                          <td className="p-4 border-r border-slate-100">{p.x}</td><td className="p-4">{p.y}</td>
                        </tr>
                      ))}
                      {calcSubStep === CalcSubStep.SUBSTITUTE && (
                         <tr className="border-t border-slate-100 text-3xl font-serif italic text-slate-800 bg-indigo-50/30">
                           <td className="p-4 border-r border-slate-100 font-black text-indigo-600">{currentX}</td>
                           <td className="p-4 animate-pulse text-indigo-400">?</td>
                         </tr>
                      )}
                      {calcSubStep === CalcSubStep.IDLE && (
                        <tr className="border-t border-slate-100">
                          <td className="p-4 border-r border-slate-100">
                             <input type="number" value={currentX} onChange={(e) => setCurrentX(e.target.value)} placeholder="X..." className="w-full bg-white p-4 rounded-xl text-center font-black text-indigo-600 border-2 border-indigo-200 outline-none focus:border-indigo-600 text-2xl shadow-sm" />
                          </td>
                          <td className="p-4 text-slate-400 font-serif italic text-3xl">?</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
               </div>

               {calcSubStep === CalcSubStep.IDLE ? (
                 <button onClick={startCalculation} disabled={!currentX} className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-lg disabled:opacity-30 hover:bg-indigo-700 transition-all active:scale-95">Imposta X</button>
               ) : (
                 <div className="space-y-4 animate-slide-in">
                    <div className="bg-slate-900 p-8 rounded-[2rem] border-4 border-indigo-600 shadow-2xl">
                       <input type="text" value={calcInput} readOnly className="w-full text-5xl font-mono bg-transparent text-white text-center font-black outline-none" />
                    </div>
                    <MathKeypad onInput={(c) => setCalcInput(p => p + c)} onDelete={() => setCalcInput(p => p.length > 2 ? p.slice(0, -1) : 'y=')} onClear={() => setCalcInput('y=')} />
                    <button onClick={verifyPointCalculation} className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-lg hover:bg-emerald-700 transition-all active:scale-95">Verifica Calcolo</button>
                 </div>
               )}
            </div>
          ) : (
            <div className="space-y-6 flex-grow flex flex-col">
               <h5 className="text-sm font-black text-slate-500 uppercase tracking-widest text-center">
                 {step === ParallelStep.EXPLICIT_FORM ? "Passaggio 1: Esplicita r₂" : "Passaggio 2: Confronto m"}
               </h5>
               
               {step === ParallelStep.EXPLICIT_FORM ? (
                 <div className="flex-grow flex flex-col items-center justify-center py-6">
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6 animate-pulse">
                      {selectedTermId ? "🎯 Ora clicca sulla destinazione" : "👆 Clicca su un termine per spostarlo"}
                    </p>
                    
                    <div className="flex items-center gap-2 w-full justify-center">
                        {/* Area Cliccabile Sinistra */}
                        <div 
                          onClick={() => handleSideClick('left')}
                          className={`flex items-center gap-1 p-4 rounded-[2rem] border-2 transition-all cursor-pointer min-w-[120px] justify-center ${selectedTermId ? 'hover:bg-indigo-50 border-dashed border-indigo-200 hover:border-indigo-400' : 'border-transparent'}`}
                        >
                          {solverTerms.filter(t => t.side === 'left').length === 0 && <span className="text-4xl text-slate-200 font-serif">0</span>}
                          {solverTerms.filter(t => t.side === 'left').map((t, i, arr) => renderTerm(t, i, arr.length))}
                        </div>

                        <span className="text-5xl font-serif italic text-slate-300 mx-1">=</span>

                        {/* Area Cliccabile Destra */}
                        <div 
                          onClick={() => handleSideClick('right')}
                          className={`flex items-center gap-1 p-4 rounded-[2rem] border-2 transition-all cursor-pointer min-w-[120px] justify-center ${selectedTermId ? 'hover:bg-indigo-50 border-dashed border-indigo-200 hover:border-indigo-400' : 'border-transparent'}`}
                        >
                          {solverTerms.filter(t => t.side === 'right').length === 0 && <span className="text-4xl text-slate-200 font-serif">0</span>}
                          {solverTerms.filter(t => t.side === 'right').map((t, i, arr) => renderTerm(t, i, arr.length))}
                        </div>
                    </div>
                 </div>
               ) : (
                 <>
                   <div className="p-10 bg-slate-50 border-2 border-indigo-100 rounded-[3rem] shadow-inner mb-4 flex items-center justify-center">
                      <input 
                        type="text" 
                        value={userInput} 
                        readOnly 
                        placeholder="Sono parallele? (Sì/No)" 
                        className="w-full bg-transparent text-center text-4xl font-serif italic text-indigo-900 outline-none placeholder:text-slate-300" 
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4 mt-6">
                     <button onClick={() => setUserInput('Sì')} className="py-6 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-lg border border-emerald-100 shadow-md active:scale-95 hover:bg-emerald-100 transition-all">SÌ</button>
                     <button onClick={() => setUserInput('No')} className="py-6 bg-red-50 text-red-600 rounded-2xl font-black text-lg border border-red-100 shadow-md active:scale-95 hover:bg-red-100 transition-all">NO</button>
                   </div>
                   <button 
                     onClick={verifyAlgebraicStep} 
                     disabled={!userInput}
                     className="w-full py-7 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-sm tracking-widest hover:brightness-110 active:scale-95 shadow-xl transition-all disabled:opacity-20 mt-auto"
                   >
                     Verifica Risposta
                   </button>
                 </>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Colonna Destra: Piano Cartesiano */}
      <div className="flex-grow bg-white p-10 rounded-[4rem] shadow-2xl border border-slate-50 flex flex-col h-[850px] w-full min-w-0">
          <div className="flex justify-between items-center mb-8 px-4">
            <div className="flex flex-col">
              <h3 className="text-4xl font-black text-slate-800 italic tracking-tighter">Piano Cartesiano</h3>
              <span className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Visualizzazione Dinamica</span>
            </div>
            {step === ParallelStep.FINISHED && (
              <div className="px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase shadow-md animate-slide-in">
                Grafico Completo
              </div>
            )}
          </div>
          
          <div className="flex-grow relative w-full h-full bg-[#f8fafc] rounded-[3rem] border border-slate-100 p-8 shadow-inner">
            <canvas ref={chartRef}></canvas>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-10 border-t border-slate-100 pt-10">
              <div className="flex flex-col items-center p-8 bg-indigo-50/30 rounded-[2.5rem] border border-indigo-100 shadow-sm transition-all duration-500">
                  <span className="text-xs font-black text-indigo-500 mb-4 tracking-widest">Pendenza m<sub>1</sub></span>
                  <span className="text-6xl font-black text-slate-900 italic font-serif">{metadata.m1}</span>
              </div>
              <div className={`flex flex-col items-center p-8 rounded-[2.5rem] border shadow-sm transition-all duration-500 ${step >= ParallelStep.COMPARE_M ? 'bg-amber-50/30 border-amber-100' : 'bg-slate-50/30 border-slate-100 opacity-30'}`}>
                  <span className={`text-xs font-black mb-4 tracking-widest ${step >= ParallelStep.COMPARE_M ? 'text-amber-500' : 'text-slate-400'}`}>Pendenza m<sub>2</sub></span>
                  <span className="text-6xl font-black text-slate-900 italic font-serif">
                    {step >= ParallelStep.COMPARE_M ? metadata.m2 : '?'}
                  </span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ParallelLinesExercise;

