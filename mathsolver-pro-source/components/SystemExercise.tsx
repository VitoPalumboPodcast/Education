
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart, registerables, Plugin } from 'chart.js';
import MathRenderer from './MathRenderer';
import MathKeypad from './MathKeypad';
import DraggableSolver from './DraggableSolver';
import { normalizeMathString, evaluateMathExpression, formatPoly } from '../services/mathService';
import { Monomial } from '../types';

Chart.register(...registerables);

interface SystemExerciseProps {
  metadata: { m1: number, q1: number, m2: number, q2: number, x: number, y: number };
  onComplete: () => void;
  setVoiceMessage: (msg: string) => void;
}

enum SystemStep {
  CONFRONTO,
  SOLVE_X,
  DRAG_X_SUBSTITUTION,
  SUBSTITUTE_Y,
  FINISHED
}

const SystemExercise: React.FC<SystemExerciseProps> = ({ metadata, onComplete, setVoiceMessage }) => {
  const [currentStep, setCurrentStep] = useState<SystemStep>(SystemStep.CONFRONTO);
  const [slotL, setSlotL] = useState<string | null>(null);
  const [slotR, setSlotR] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<string | null>(null);
  const [isXDropped, setIsXDropped] = useState(false);
  const [calcInput, setCalcInput] = useState<string>('y=');
  const [currentFormulaY, setCurrentFormulaY] = useState<string>('');
  const [isHoveringDrop, setIsHoveringDrop] = useState(false);
  const [historyY, setHistoryY] = useState<string[]>([]);
  
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const exp1 = useMemo(() => formatPoly(metadata.m1, metadata.q1), [metadata.m1, metadata.q1]);
  const exp2 = useMemo(() => formatPoly(metadata.m2, metadata.q2), [metadata.m2, metadata.q2]);

  useEffect(() => {
    if (metadata) {
      let termX = '';
      if (metadata.m1 === 1) termX = '';
      else if (metadata.m1 === -1) termX = '-';
      else termX = metadata.m1.toString();
      
      const termQ = metadata.q1 === 0 ? '' : (metadata.q1 > 0 ? ` + ${metadata.q1}` : ` - ${Math.abs(metadata.q1)}`);
      setCurrentFormulaY(`y = ${termX}(${metadata.x})${termQ}`);
    }
  }, [metadata]);

  const initialSideA = useMemo<Monomial[]>(() => {
    const list: Monomial[] = [];
    if (metadata.m1 !== 0) list.push({ id: 'mon-s1-x', coeff: metadata.m1, den: 1, hasX: true });
    if (metadata.q1 !== 0) list.push({ id: 'mon-s1-q', coeff: metadata.q1, den: 1, hasX: false });
    if (list.length === 0) list.push({ id: 'mon-s1-z', coeff: 0, den: 1, hasX: false });
    return list;
  }, [metadata.m1, metadata.q1]);

  const initialSideB = useMemo<Monomial[]>(() => {
    const list: Monomial[] = [];
    if (metadata.m2 !== 0) list.push({ id: 'mon-s2-x', coeff: metadata.m2, den: 1, hasX: true });
    if (metadata.q2 !== 0) list.push({ id: 'mon-s2-q', coeff: metadata.q2, den: 1, hasX: false });
    if (list.length === 0) list.push({ id: 'mon-s2-z', coeff: 0, den: 1, hasX: false });
    return list;
  }, [metadata.m2, metadata.q2]);

  const cartesianPlugin: Plugin = {
    id: 'cartesianPlugin',
    afterDatasetsDraw: (chart) => {
      const { ctx, scales: { x, y } } = chart;
      const xZero = x.getPixelForValue(0);
      const yZero = y.getPixelForValue(0);

      ctx.save();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(x.left, yZero);
      ctx.lineTo(x.right, yZero);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(xZero, y.bottom);
      ctx.lineTo(xZero, y.top);
      ctx.stroke();

      const arrowSize = 8;
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(x.right, yZero);
      ctx.lineTo(x.right - arrowSize, yZero - arrowSize / 2);
      ctx.lineTo(x.right - arrowSize, yZero + arrowSize / 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(xZero, y.top);
      ctx.lineTo(xZero - arrowSize / 2, y.top + arrowSize);
      ctx.lineTo(xZero + arrowSize / 2, y.top + arrowSize);
      ctx.fill();

      ctx.font = 'bold 14px Inter';
      ctx.fillText('X', x.right - 20, yZero + 20);
      ctx.fillText('Y', xZero - 20, y.top + 15);

      if (currentStep === SystemStep.FINISHED) {
        const px = x.getPixelForValue(metadata.x);
        const py = y.getPixelForValue(metadata.y);
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1;
        ctx.moveTo(px, py); ctx.lineTo(px, yZero);
        ctx.moveTo(px, py); ctx.lineTo(xZero, py);
        ctx.stroke();
        
        ctx.setLineDash([]);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(metadata.x.toString(), px, yZero + 15);
        ctx.textAlign = 'right';
        ctx.fillText(metadata.y.toString(), xZero - 8, py + 4);
      }
      ctx.restore();
    }
  };

  useEffect(() => {
    if (currentStep === SystemStep.FINISHED && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [
              { label: 'retta 1', data: [{ x: -5, y: metadata.m1 * -5 + metadata.q1 }, { x: 5, y: metadata.m1 * 5 + metadata.q1 }], borderColor: '#4f46e5', borderWidth: 3, pointRadius: 0, showLine: true, fill: false },
              { label: 'retta 2', data: [{ x: -5, y: metadata.m2 * -5 + metadata.q2 }, { x: 5, y: metadata.m2 * 5 + metadata.q2 }], borderColor: '#ef4444', borderWidth: 3, pointRadius: 0, showLine: true, fill: false },
              { label: 'Incrocio', data: [{ x: metadata.x, y: metadata.y }], backgroundColor: '#10b981', borderColor: 'white', borderWidth: 3, pointRadius: 8, showLine: false }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { type: 'linear', min: -5, max: 5, grid: { color: '#f1f5f9' }, ticks: { stepSize: 1, color: '#94a3b8', font: { family: 'Inter', weight: 'bold' } } },
              y: { type: 'linear', min: -5, max: 5, grid: { color: '#f1f5f9' }, ticks: { stepSize: 1, color: '#94a3b8', font: { family: 'Inter', weight: 'bold' } } }
            },
            plugins: { legend: { display: false } }
          },
          plugins: [cartesianPlugin]
        });
      }
    }
    return () => chartInstance.current?.destroy();
  }, [currentStep, metadata]);

  const handleDragStart = (e: React.DragEvent, content: string) => {
    e.dataTransfer.setData('text/plain', content);
    setSelectedExp(null);
  };

  const handleSourceClick = (content: string) => {
    if (slotL === content || slotR === content) return;
    if (selectedExp === content) setSelectedExp(null);
    else setSelectedExp(content);
  };

  const updateSlots = (content: string, slot: 'L' | 'R') => {
    if (slot === 'L') {
        if (slotR === content) setSlotR(null);
        setSlotL(content);
    } else {
        if (slotL === content) setSlotL(null);
        setSlotR(content);
    }

    const otherVal = slot === 'L' ? slotR : slotL;
    if (otherVal && otherVal !== content) {
      setVoiceMessage("Ottimo setup. Risolvi ora l'equazione di confronto per trovare il valore di x.");
    }
  };

  const handleDropConfronto = (e: React.DragEvent, slot: 'L' | 'R') => {
    e.preventDefault();
    const content = e.dataTransfer.getData('text/plain');
    updateSlots(content, slot);
  };

  const handleSlotClick = (slot: 'L' | 'R') => {
    if (selectedExp) {
      updateSlots(selectedExp, slot);
      setSelectedExp(null);
    } else {
      if (slot === 'L') setSlotL(null);
      else setSlotR(null);
    }
  };

  const completeXSubstitution = () => {
    setIsXDropped(true);
    setIsHoveringDrop(false);
    setSelectedExp(null);
    setVoiceMessage("Ottimo, la x è stata sostituita correttamente. Ora calcola il valore di y.");
    setTimeout(() => setCurrentStep(SystemStep.SUBSTITUTE_Y), 1000);
  };

  const handleDropXSubstitution = (e: React.DragEvent) => {
    e.preventDefault();
    const content = e.dataTransfer.getData('text/plain');
    if (content === `x=${metadata.x}`) {
      completeXSubstitution();
    }
  };

  const handleXSourceClick = () => {
    const val = `x=${metadata.x}`;
    if (selectedExp === val) setSelectedExp(null);
    else setSelectedExp(val);
  };

  const handleXTargetClick = () => {
    if (selectedExp === `x=${metadata.x}`) {
      completeXSubstitution();
    }
  };

  const handleVerifyY = () => {
    const val = evaluateMathExpression(calcInput);
    if (val === metadata.y) {
      if (normalizeMathString(calcInput) === `y=${metadata.y}`) {
        setCurrentStep(SystemStep.FINISHED);
        setVoiceMessage("Perfetto! Hai risolto il sistema. Il punto trovato è l'intersezione delle due rette.");
        onComplete();
      } else {
        setHistoryY([...historyY, calcInput]);
        setCurrentFormulaY(calcInput.includes('=') ? calcInput : `y = ${calcInput}`);
        setCalcInput('y=');
        setVoiceMessage("Giusto! Ora esegui l'ultima somma per trovare il valore finale.");
      }
    } else {
      setVoiceMessage("Il calcolo non è corretto, controlla bene i segni e la moltiplicazione.");
    }
  };

  const termXSubstitution = useMemo(() => {
     if (metadata.m1 === 1) return '';
     if (metadata.m1 === -1) return '-';
     return metadata.m1.toString();
  }, [metadata.m1]);

  return (
    <div className="w-full flex flex-col gap-8 animate-slide-in">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          
          {/* Istruzioni Iniziali */}
          {currentStep === SystemStep.CONFRONTO && (
            <div className="bg-indigo-50/50 p-6 rounded-[2.5rem] border border-indigo-100 text-center shadow-sm mb-2">
                 <p className="text-slate-600 leading-relaxed font-medium italic">
                   "Obiettivo: trovare il punto di intersezione. Usa il <span className="font-serif italic font-bold text-indigo-600">Metodo del Confronto</span>: trascina le due espressioni (a destra dell'uguale) nei riquadri sottostanti per eguagliarle."
                 </p>
            </div>
          )}

          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 transition-all">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">
                {currentStep >= SystemStep.DRAG_X_SUBSTITUTION ? 'Procedimento X' : 'Sistema Iniziale'}
            </h4>
            
            {currentStep >= SystemStep.DRAG_X_SUBSTITUTION ? (
                <div className="flex flex-col items-center gap-4 py-4 animate-slide-in">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-indigo-100 w-full text-center shadow-inner">
                         <MathRenderer latex={`${slotL} = ${slotR}`} noPadding />
                         <div className="h-6 w-px bg-indigo-200 mx-auto my-2"></div>
                         <div className="font-serif italic text-4xl text-emerald-600 font-bold bg-white px-8 py-3 rounded-2xl shadow-sm inline-block border border-emerald-100">
                           x = {metadata.x}
                         </div>
                    </div>
                </div>
            ) : (
                <div className="flex gap-4 items-center justify-start p-10 bg-white rounded-[2.5rem] relative">
                   <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center justify-center">
                    <span className="text-[10rem] text-slate-900 font-serif font-extralight transform scale-y-[1.1] select-none leading-none">{"{"}</span>
                   </div>
                   
                   <div className="flex flex-col gap-8 w-full pl-20">
                      {[exp1, exp2].map((exp, idx) => (
                        <div key={idx} className="flex items-center gap-6">
                          <span className="text-4xl font-serif italic text-slate-500">y =</span>
                          <div 
                            draggable={currentStep === SystemStep.CONFRONTO && slotL !== exp && slotR !== exp}
                            onDragStart={(e) => handleDragStart(e, exp)} 
                            onClick={() => currentStep === SystemStep.CONFRONTO && handleSourceClick(exp)}
                            className={`flex-grow p-4 bg-transparent rounded-2xl transition-all flex items-center justify-start group touch-none border-2 ${
                              selectedExp === exp ? 'bg-indigo-50 border-indigo-400 ring-4 ring-indigo-100 scale-105 animate-pulse' : 'border-transparent'
                            } ${currentStep === SystemStep.CONFRONTO && (slotL === exp || slotR === exp) ? 'opacity-20 grayscale cursor-default' : 'cursor-grab hover:bg-slate-50'}`}
                          >
                            <div className="font-serif italic text-4xl text-slate-700 group-hover:text-indigo-600 transition-colors tracking-wide">{exp}</div>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
            )}
          </div>

          {currentStep === SystemStep.CONFRONTO && (
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 animate-slide-in">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center">Metodo del Confronto</h4>
              <div className="flex items-center justify-center gap-8">
                <div 
                  onDragOver={(e) => e.preventDefault()} 
                  onDrop={(e) => handleDropConfronto(e, 'L')}
                  onClick={() => handleSlotClick('L')}
                  className={`w-64 h-36 flex items-center justify-center rounded-3xl border-2 border-dashed transition-all cursor-pointer ${
                    slotL ? 'border-indigo-500 bg-indigo-50 shadow-inner' : (selectedExp && !selectedExp.includes('x=') ? 'border-indigo-300 bg-indigo-50/30 animate-pulse' : 'border-slate-200 bg-slate-50')
                  }`}
                >
                  {slotL ? (
                    <div className="font-serif italic text-4xl text-slate-700 animate-slide-in">{slotL}</div>
                  ) : (
                    <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest">
                      {selectedExp && !selectedExp.includes('x=') ? 'Clicca qui' : 'Trascina qui'}
                    </span>
                  )}
                </div>
                <span className="text-5xl font-serif italic text-slate-200">=</span>
                <div 
                  onDragOver={(e) => e.preventDefault()} 
                  onDrop={(e) => handleDropConfronto(e, 'R')}
                  onClick={() => handleSlotClick('R')}
                  className={`w-64 h-36 flex items-center justify-center rounded-3xl border-2 border-dashed transition-all cursor-pointer ${
                    slotR ? 'border-indigo-500 bg-indigo-50 shadow-inner' : (selectedExp && !selectedExp.includes('x=') ? 'border-indigo-300 bg-indigo-50/30 animate-pulse' : 'border-slate-200 bg-slate-50')
                  }`}
                >
                  {slotR ? (
                    <div className="font-serif italic text-4xl text-slate-700 animate-slide-in">{slotR}</div>
                  ) : (
                    <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest">
                      {selectedExp && !selectedExp.includes('x=') ? 'Clicca qui' : 'Trascina qui'}
                    </span>
                  )}
                </div>
              </div>
              {slotL && slotR && (
                <button onClick={() => setCurrentStep(SystemStep.SOLVE_X)} className="mt-8 w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all">Risolvi Equazione per X</button>
              )}
            </div>
          )}

          {currentStep === SystemStep.SOLVE_X && (
             <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 animate-slide-in">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Trova il valore di X</h4>
                <DraggableSolver 
                    initialSideA={initialSideA}
                    initialSideB={initialSideB}
                    onStepComplete={() => {}}
                    onComplete={() => {
                        setVoiceMessage(`Bene, abbiamo trovato x=${metadata.x}. Ora trascinala o clicca su di essa per inserirla nell'equazione di y.`);
                        setCurrentStep(SystemStep.DRAG_X_SUBSTITUTION);
                    }}
                    compact
                />
             </div>
          )}

          {(currentStep >= SystemStep.DRAG_X_SUBSTITUTION) && (
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 animate-slide-in space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                {currentStep === SystemStep.FINISHED ? 'Procedimento Y' : 'Sostituzione Interattiva'}
              </h4>
              
              <div className="p-10 bg-slate-50 rounded-[2.5rem] flex flex-col items-center gap-10 border-4 border-indigo-100 shadow-inner overflow-hidden">
                 {currentStep !== SystemStep.FINISHED && (
                   <div 
                     draggable={!isXDropped}
                     onDragStart={(e) => handleDragStart(e, `x=${metadata.x}`)}
                     onClick={handleXSourceClick}
                     className={`px-10 py-5 rounded-3xl font-serif italic text-4xl shadow-xl transition-all border-b-4 touch-none ${
                       selectedExp === `x=${metadata.x}` ? 'bg-indigo-500 border-indigo-800 ring-8 ring-indigo-100 scale-105 animate-pulse text-white' : 'bg-indigo-600 text-white border-indigo-900 cursor-grab active:cursor-grabbing hover:scale-105'
                     } ${isXDropped ? 'opacity-20 grayscale pointer-events-none' : ''}`}
                   >
                     x = {metadata.x}
                   </div>
                 )}

                 <div className="w-full flex items-center justify-center gap-4 text-5xl font-serif italic text-slate-800">
                    <span>y = {termXSubstitution}</span>
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsHoveringDrop(true); }}
                      onDragLeave={() => setIsHoveringDrop(false)}
                      onDrop={handleDropXSubstitution}
                      onClick={handleXTargetClick}
                      className={`min-w-[140px] h-24 flex items-center justify-center rounded-2xl border-4 border-dashed transition-all cursor-pointer ${
                        isXDropped ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-md' : 
                        (selectedExp === `x=${metadata.x}` ? 'bg-indigo-50 border-indigo-400 scale-110 shadow-lg animate-pulse' : 
                        (isHoveringDrop ? 'bg-indigo-50 border-indigo-400 scale-110' : 'bg-white border-slate-200 text-slate-300'))
                      }`}
                    >
                      {isXDropped ? `(${metadata.x})` : '( ? )'}
                    </div>
                    <span>{metadata.q1 !== 0 ? (metadata.q1 > 0 ? ' + ' : ' - ') : ''} {metadata.q1 !== 0 ? Math.abs(metadata.q1) : ''}</span>
                 </div>
              </div>
              
              {currentStep === SystemStep.SUBSTITUTE_Y && (
                <div className="animate-slide-in pt-4 border-t border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-6">Calcolo Finale Y</h4>
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex bg-white p-6 rounded-[2rem] w-full max-w-md border-2 border-emerald-200 shadow-sm items-center justify-center">
                           <input 
                              type="text" 
                              value={calcInput} 
                              readOnly 
                              className="w-full text-5xl font-serif italic bg-transparent text-center font-black outline-none text-emerald-600 tracking-wider" 
                           />
                        </div>
                        <MathKeypad onInput={(c) => setCalcInput(prev => prev + c)} onDelete={() => setCalcInput(prev => prev.length > 2 ? prev.slice(0, -1) : prev)} onClear={() => setCalcInput('y=')} />
                        <button 
                            onClick={handleVerifyY} 
                            className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black text-xl shadow-xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest"
                        >
                            Verifica Risultato
                        </button>
                    </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-10 rounded-[4rem] shadow-2xl border border-slate-50 flex flex-col h-[750px] w-full min-w-0 transition-all overflow-hidden">
           {currentStep === SystemStep.FINISHED ? (
             <div className="h-full flex flex-col animate-slide-in">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <h3 className="text-4xl font-black text-slate-800 italic tracking-tighter mb-1">Intersezione Trovata!</h3>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                       <span className="text-[11px] font-black text-[#10b981] uppercase tracking-[0.4em]">Coordinate della soluzione</span>
                    </div>
                  </div>
                  <div className="bg-[#e6fcf5] text-[#0ca678] px-10 py-5 rounded-[2rem] font-serif italic text-5xl border-2 border-[#c3fae8] shadow-sm transform rotate-1 hover:rotate-0 transition-transform">
                    P({metadata.x}, {metadata.y})
                  </div>
                </div>

                <div className="flex-grow bg-slate-50/50 rounded-[4rem] border border-slate-100 p-6 shadow-inner relative overflow-hidden mb-6">
                  <canvas ref={chartRef}></canvas>
                </div>

                <div className="bg-indigo-50/50 p-6 rounded-[2.5rem] border border-indigo-100 mb-6">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Significato del Sistema</p>
                   <p className="text-indigo-900 font-bold italic leading-relaxed text-sm">
                      "Risolvere un sistema significa trovare il punto esatto in cui le due rette si incontrano. 
                      I valori <b>x={metadata.x}</b> e <b>y={metadata.y}</b> sono le uniche coordinate che soddisfano contemporaneamente entrambe le equazioni."
                   </p>
                </div>

                <div className="flex justify-center gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-[#4f46e5]"></div> retta 1</div>
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-[#ef4444]"></div> retta 2</div>
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-[#10b981]"></div> punto intersezione</div>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-10 p-12">
                <div className="relative">
                    <div className="text-9xl animate-bounce">📈</div>
                    <div className="absolute -top-6 -right-6 text-7xl opacity-40">✨</div>
                </div>
                <div className="space-y-4">
                    <p className="font-black text-slate-300 uppercase tracking-[0.5em] leading-tight">Analisi Grafica</p>
                    <p className="text-slate-400 italic text-lg max-w-xs mx-auto">Completa i passaggi algebrici per visualizzare il punto di intersezione delle due rette.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SystemExercise;

