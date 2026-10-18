import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables, Plugin } from 'chart.js';
import MathRenderer from './MathRenderer';
import MathKeypad from './MathKeypad';
import { normalizeMathString, evaluateMathExpression } from '../services/mathService';

Chart.register(...registerables);

interface TwoPointsLineExerciseProps {
  metadata: { xa: number, ya: number, xb: number, yb: number, m_str: string, q_str: string, m_val: number, q_val: number };
  onComplete: () => void;
  setVoiceMessage: (msg: string) => void;
}

enum Step {
  CALCOLA_M,
  CALCOLA_Q,
  COMPLETATO
}

const Fraction = ({ val, className = "" }: { val: string | number, className?: string }) => {
  const str = val.toString();
  if (!str.includes('/')) return <span className={className}>{str}</span>;
  
  const isNegative = str.startsWith('-');
  const [num, den] = str.replace('-', '').split('/');
  
  return (
    <span className={`inline-flex items-center gap-0.5 align-middle ${className}`}>
      {isNegative && <span className="font-black mr-0.5 leading-none">-</span>}
      <span className="inline-flex flex-col items-center leading-none">
        <span className="border-b-2 border-current px-1 pb-0.5 mb-0.5 font-black">{num}</span>
        <span className="px-1 font-black">{den}</span>
      </span>
    </span>
  );
};

const FormulaVar = ({ name, label, value, selectedSource, onClick }: { name: 'xa'|'ya'|'xb'|'yb', label: React.ReactNode, value: number | null, selectedSource: string | null, onClick: () => void }) => {
  const hasValue = value !== null;
  const displayValue = hasValue ? (value < 0 ? `(${value})` : value) : label;

  return (
    <span 
      className={`cursor-pointer px-3 py-1 mx-0.5 rounded-lg transition-all font-serif italic font-bold inline-block text-xl
        ${hasValue ? 'bg-white text-indigo-900 border-2 border-indigo-200 shadow-sm' : 'bg-indigo-100 text-indigo-700 border-2 border-dashed border-indigo-300 hover:bg-indigo-200'}
        ${selectedSource && !hasValue ? 'ring-4 ring-indigo-300 ring-offset-2 ring-offset-white animate-pulse' : ''}
      `}
      onClick={onClick}
    >
      {displayValue}
    </span>
  );
};

const TwoPointsLineExercise: React.FC<TwoPointsLineExerciseProps> = ({ metadata, onComplete, setVoiceMessage }) => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.CALCOLA_M);
  const [userInput, setUserInput] = useState('');
  const [selectedSource, setSelectedSource] = useState<'xa' | 'ya' | 'xb' | 'yb' | 'm' | null>(null);
  const [formulaVars, setFormulaVars] = useState<{xa: number | null, ya: number | null, xb: number | null, yb: number | null}>({xa: null, ya: null, xb: null, yb: null});
  const [formulaVarsQ, setFormulaVarsQ] = useState<{xa: number | null, ya: number | null, m: string | null}>({xa: null, ya: null, m: null});

  const handleFormulaClick = (targetVar: 'xa' | 'ya' | 'xb' | 'yb') => {
    if (!selectedSource) return;
    if (selectedSource === targetVar) {
      setFormulaVars(prev => ({ ...prev, [targetVar]: metadata[targetVar] }));
      setSelectedSource(null);
    } else {
      const varNames = { xa: 'xA', ya: 'yA', xb: 'xB', yb: 'yB', m: 'm' };
      setVoiceMessage(`Attenzione, hai selezionato ${varNames[selectedSource as keyof typeof varNames]}, ma stai cercando di sostituire ${varNames[targetVar]}.`);
    }
  };
  
  const handleFormulaClickQ = (targetVar: 'xa' | 'ya' | 'm') => {
    if (!selectedSource) return;
    if (selectedSource === targetVar) {
      if (targetVar === 'm') {
        setFormulaVarsQ(prev => ({ ...prev, m: metadata.m_str }));
      } else {
        setFormulaVarsQ(prev => ({ ...prev, [targetVar]: metadata[targetVar] }));
      }
      setSelectedSource(null);
    } else {
      const varNames = { xa: 'xA', ya: 'yA', xb: 'xB', yb: 'yB', m: 'm' };
      setVoiceMessage(`Attenzione, hai selezionato ${varNames[selectedSource as keyof typeof varNames]}, ma stai cercando di sostituire ${varNames[targetVar]}.`);
    }
  };

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const cartesianPlugin: Plugin = {
    id: 'cartesianPluginTwoPoints',
    afterDatasetsDraw: (chart) => {
      const { ctx, scales: { x, y } } = chart;
      const xZero = x.getPixelForValue(0);
      const yZero = y.getPixelForValue(0);
      const xA = x.getPixelForValue(metadata.xa);
      const yA = y.getPixelForValue(metadata.ya);
      const xB = x.getPixelForValue(metadata.xb);
      const yB = y.getPixelForValue(metadata.yb);

      ctx.save();
      
      // Assi
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x.left, yZero); ctx.lineTo(x.right, yZero); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xZero, y.bottom); ctx.lineTo(xZero, y.top); ctx.stroke();

      // Proiezioni A
      ctx.setLineDash([6, 4]); ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(xA, yA); ctx.lineTo(xA, yZero); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xA, yA); ctx.lineTo(xZero, yA); ctx.stroke();

      // Proiezioni B
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.beginPath(); ctx.moveTo(xB, yB); ctx.lineTo(xB, yZero); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xB, yB); ctx.lineTo(xZero, yB); ctx.stroke();
      ctx.setLineDash([]);

      // Etichette A
      ctx.fillStyle = '#ef4444'; ctx.font = 'bold 12px Inter';
      ctx.textAlign = 'center'; ctx.fillText(metadata.xa.toString(), xA, yZero + 18);
      ctx.textAlign = 'right'; ctx.fillText(metadata.ya.toString(), xZero - 8, yA + 5);
      ctx.textAlign = 'left'; ctx.font = 'italic bold 14px Lora';
      ctx.fillText(`A(${metadata.xa}, ${metadata.ya})`, xA + 10, yA - 10);

      // Etichette B
      ctx.fillStyle = '#3b82f6'; ctx.font = 'bold 12px Inter';
      ctx.textAlign = 'center'; ctx.fillText(metadata.xb.toString(), xB, yZero + 18);
      ctx.textAlign = 'right'; ctx.fillText(metadata.yb.toString(), xZero - 8, yB + 5);
      ctx.textAlign = 'left'; ctx.font = 'italic bold 14px Lora';
      ctx.fillText(`B(${metadata.xb}, ${metadata.yb})`, xB + 10, yB - 10);

      if (currentStep === Step.COMPLETATO) {
        ctx.fillStyle = '#10b981';
        ctx.font = 'italic bold 16px Lora';
        const yEnd = metadata.m_val * -8 + metadata.q_val;
        ctx.fillText(`y = ${metadata.m_str}x ${metadata.q_val >= 0 ? '+' : ''} ${metadata.q_str}`, x.getPixelForValue(-9), y.getPixelForValue(yEnd) - 15);
      }

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
              { label: 'Retta', data: [], borderColor: '#10b981', borderWidth: 4, pointRadius: 0, fill: false },
              { label: 'A', data: [{ x: metadata.xa, y: metadata.ya }], backgroundColor: '#ef4444', borderColor: 'white', borderWidth: 3, pointRadius: 8, showLine: false },
              { label: 'B', data: [{ x: metadata.xb, y: metadata.yb }], backgroundColor: '#3b82f6', borderColor: 'white', borderWidth: 3, pointRadius: 8, showLine: false }
            ]
          },
          options: {
            responsive: true, maintainAspectRatio: true, aspectRatio: 1,
            scales: {
              x: { type: 'linear', min: -10, max: 10, grid: { color: '#e2e8f0' }, ticks: { stepSize: 2, color: '#94a3b8' } },
              y: { type: 'linear', min: -10, max: 10, grid: { color: '#e2e8f0' }, ticks: { stepSize: 2, color: '#94a3b8' } }
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
    if (currentStep === Step.COMPLETATO && chartInstance.current) {
        chartInstance.current.data.datasets[0].data = [{x: -10, y: metadata.m_val*-10 + metadata.q_val}, {x: 10, y: metadata.m_val*10 + metadata.q_val}];
        chartInstance.current.update();
    }
  }, [currentStep, metadata]);

  const handleVerify = () => {
    const userVal = evaluateMathExpression(userInput);
    const norm = normalizeMathString(userInput);
    
    if (currentStep === Step.CALCOLA_M) {
        if ((userVal !== null && Math.abs(userVal - metadata.m_val) < 0.01) || (norm === normalizeMathString(`m=${metadata.m_str}`))) {
            setCurrentStep(Step.CALCOLA_Q);
            setUserInput('');
            setVoiceMessage("Corretto! Ora calcola l'ordinata all'origine q.");
        } else {
            setVoiceMessage("Il coefficiente angolare non è corretto. Ricorda: m = (yB - yA) / (xB - xA).");
        }
    } else if (currentStep === Step.CALCOLA_Q) {
        if ((userVal !== null && Math.abs(userVal - metadata.q_val) < 0.01) || (norm === normalizeMathString(`q=${metadata.q_str}`))) {
            setCurrentStep(Step.COMPLETATO);
            setUserInput('');
            setVoiceMessage("Perfetto! Hai trovato l'equazione della retta.");
            onComplete();
        } else {
            setVoiceMessage("L'ordinata all'origine non è corretta. Usa l'equazione y - yA = m(x - xA) oppure q = yA - m*xA.");
        }
    }
  };

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-[52%_1fr] gap-12 animate-slide-in max-w-full overflow-x-hidden">
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 min-h-[700px] flex flex-col gap-6">
           
           <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 text-center mb-2">
             <p className="text-lg text-slate-700 leading-relaxed font-serif italic">
               "Trova l'equazione della retta passante per i punti <span className="text-red-600 font-black not-italic">A</span> e <span className="text-blue-600 font-black not-italic">B</span>."
             </p>
           </div>

           <div className="grid grid-cols-2 gap-4 mb-2 animate-slide-in">
             <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-center">
               <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block mb-1">Punto A</span>
               <span className="font-serif italic text-red-800 text-3xl">A(<b className="font-black">{metadata.xa}</b>, <b className="font-black">{metadata.ya}</b>)</span>
             </div>
             <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Punto B</span>
                <span className="font-serif italic text-blue-800 text-3xl">B(<b className="font-black">{metadata.xb}</b>, <b className="font-black">{metadata.yb}</b>)</span>
             </div>
           </div>

           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4 animate-slide-in">
             <table className="w-full text-center">
               <thead>
                 <tr className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100">
                   <th className="pb-3 font-black">x<sub>A</sub></th>
                   <th className="pb-3 font-black">y<sub>A</sub></th>
                   <th className="pb-3 font-black">x<sub>B</sub></th>
                   <th className="pb-3 font-black">y<sub>B</sub></th>
                 </tr>
               </thead>
               <tbody>
                 <tr className="font-black text-xl font-serif italic">
                   <td className="pt-3">
                     <span 
                       className={`inline-block px-4 py-1 cursor-pointer transition-colors rounded-lg text-red-500 ${selectedSource === 'xa' ? 'bg-red-100 ring-2 ring-red-400' : 'hover:bg-slate-100'}`}
                       onClick={() => setSelectedSource(selectedSource === 'xa' ? null : 'xa')}
                     >
                       {metadata.xa}
                     </span>
                   </td>
                   <td className="pt-3">
                     <span 
                       className={`inline-block px-4 py-1 cursor-pointer transition-colors rounded-lg text-red-500 ${selectedSource === 'ya' ? 'bg-red-100 ring-2 ring-red-400' : 'hover:bg-slate-100'}`}
                       onClick={() => setSelectedSource(selectedSource === 'ya' ? null : 'ya')}
                     >
                       {metadata.ya}
                     </span>
                   </td>
                   <td className="pt-3">
                     <span 
                       className={`inline-block px-4 py-1 cursor-pointer transition-colors rounded-lg text-blue-500 ${selectedSource === 'xb' ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-slate-100'}`}
                       onClick={() => setSelectedSource(selectedSource === 'xb' ? null : 'xb')}
                     >
                       {metadata.xb}
                     </span>
                   </td>
                   <td className="pt-3">
                     <span 
                       className={`inline-block px-4 py-1 cursor-pointer transition-colors rounded-lg text-blue-500 ${selectedSource === 'yb' ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-slate-100'}`}
                       onClick={() => setSelectedSource(selectedSource === 'yb' ? null : 'yb')}
                     >
                       {metadata.yb}
                     </span>
                   </td>
                 </tr>
               </tbody>
             </table>
           </div>
           
           <div className="text-center space-y-2">
             <h5 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Svolgimento Passo-Passo</h5>
             <div className="h-1 w-20 bg-indigo-100 mx-auto rounded-full"></div>
           </div>
           
           {currentStep === Step.CALCOLA_M && (
             <div className="space-y-6 animate-slide-in relative">
                 <div className="bg-indigo-50 p-8 rounded-3xl border-l-8 border-indigo-400 shadow-sm">
                  <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-4">FASE 1: CALCOLA LA PENDENZA m</p>
                  <div className="text-lg text-indigo-800 font-medium leading-relaxed flex flex-col sm:flex-row items-center gap-6">
                    <span>Sostituisci i valori nella formula:</span>
                    <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-3xl border-2 border-indigo-100 shadow-sm">
                      <span className="text-3xl font-serif italic font-bold text-indigo-900">m =</span>
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <FormulaVar name="yb" label={<>y<sub>B</sub></>} value={formulaVars.yb} selectedSource={selectedSource} onClick={() => handleFormulaClick('yb')} />
                          <span className="text-2xl font-bold mx-1 text-indigo-900">-</span>
                          <FormulaVar name="ya" label={<>y<sub>A</sub></>} value={formulaVars.ya} selectedSource={selectedSource} onClick={() => handleFormulaClick('ya')} />
                        </div>
                        <div className="w-full h-1 bg-indigo-900 rounded-full"></div>
                        <div className="flex items-center gap-2">
                          <FormulaVar name="xb" label={<>x<sub>B</sub></>} value={formulaVars.xb} selectedSource={selectedSource} onClick={() => handleFormulaClick('xb')} />
                          <span className="text-2xl font-bold mx-1 text-indigo-900">-</span>
                          <FormulaVar name="xa" label={<>x<sub>A</sub></>} value={formulaVars.xa} selectedSource={selectedSource} onClick={() => handleFormulaClick('xa')} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {!Object.values(formulaVars).every(v => v !== null) && (
                    <p className="text-sm text-indigo-600 mt-6 italic">
                      Clicca su un valore nella tabella sopra, poi clicca sulla variabile corrispondente qui per sostituirlo.
                    </p>
                  )}
                </div>
                <div className="space-y-6 animate-slide-in py-4 bg-indigo-50/30 rounded-3xl border border-indigo-100 p-6 flex flex-col items-center">
                    <div className="bg-white p-6 rounded-2xl border-4 border-indigo-400 shadow-xl inline-block min-w-[200px]"><input type="text" value={userInput} readOnly placeholder="m = ?" className="w-full text-center text-5xl font-serif italic text-indigo-900 bg-transparent outline-none font-black" /></div>
                    <MathKeypad onInput={(c) => setUserInput(p => p+c)} onDelete={() => setUserInput(p => p.slice(0, -1))} onClear={() => setUserInput('')} />
                    <button onClick={handleVerify} className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all">Verifica m</button>
                </div>
             </div>
           )}
           
           {currentStep === Step.CALCOLA_Q && (
             <div className="space-y-6 animate-slide-in relative">
                 <div className="bg-emerald-50 p-8 rounded-3xl border-l-8 border-emerald-400 shadow-sm">
                  <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-4">FASE 2: CALCOLA L'INTERCETTA q</p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 bg-white/60 p-4 rounded-2xl border border-emerald-100">
                    <span className="text-sm font-black text-emerald-800 uppercase tracking-widest">Valore calcolato:</span>
                    <span 
                      className={`cursor-pointer px-6 py-2 rounded-xl transition-all font-serif italic font-bold text-2xl inline-flex items-center justify-center shadow-sm
                        ${selectedSource === 'm' ? 'bg-emerald-200 ring-4 ring-emerald-400 text-emerald-900' : 'bg-white border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50'}
                      `}
                      onClick={() => setSelectedSource(selectedSource === 'm' ? null : 'm')}
                    >
                      <span className="mr-2">m =</span> <Fraction val={metadata.m_str} />
                    </span>
                  </div>

                  <div className="text-lg text-emerald-800 font-medium leading-relaxed flex flex-col sm:flex-row items-center gap-6">
                    <span>Sostituisci i valori nella formula:</span>
                    <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-3xl border-2 border-emerald-100 shadow-sm">
                      <div className="flex items-center gap-2 text-3xl font-serif italic font-bold text-emerald-900">
                        <FormulaVar name="ya" label={<>y<sub>A</sub></>} value={formulaVarsQ.ya} selectedSource={selectedSource} onClick={() => handleFormulaClickQ('ya')} />
                        <span className="mx-2">=</span>
                        <span 
                          className={`cursor-pointer px-3 py-1 mx-0.5 rounded-lg transition-all font-serif italic font-bold inline-block text-xl
                            ${formulaVarsQ.m !== null ? 'bg-white text-emerald-900 border-2 border-emerald-200 shadow-sm' : 'bg-emerald-100 text-emerald-700 border-2 border-dashed border-emerald-300 hover:bg-emerald-200'}
                            ${selectedSource === 'm' && formulaVarsQ.m === null ? 'ring-4 ring-emerald-300 ring-offset-2 ring-offset-white animate-pulse' : ''}
                          `}
                          onClick={() => handleFormulaClickQ('m')}
                        >
                          {formulaVarsQ.m !== null ? <Fraction val={formulaVarsQ.m} /> : 'm'}
                        </span>
                        <span className="mx-1">·</span>
                        <FormulaVar name="xa" label={<>x<sub>A</sub></>} value={formulaVarsQ.xa} selectedSource={selectedSource} onClick={() => handleFormulaClickQ('xa')} />
                        <span className="mx-2">+</span>
                        <span>q</span>
                      </div>
                    </div>
                  </div>
                  {!Object.values(formulaVarsQ).every(v => v !== null) && (
                    <p className="text-sm text-emerald-600 mt-6 italic">
                      Clicca su un valore nella tabella sopra o sul valore di m, poi clicca sulla variabile corrispondente qui per sostituirlo.
                    </p>
                  )}
                </div>
                
                {Object.values(formulaVarsQ).every(v => v !== null) && (
                  <div className="space-y-6 animate-slide-in py-4 bg-emerald-50/30 rounded-3xl border border-emerald-100 p-6 flex flex-col items-center">
                      <div className="bg-white p-6 rounded-2xl border-4 border-emerald-400 shadow-xl inline-block min-w-[200px]"><input type="text" value={userInput} readOnly placeholder="q = ?" className="w-full text-center text-5xl font-serif italic text-emerald-900 bg-transparent outline-none font-black" /></div>
                      <MathKeypad onInput={(c) => setUserInput(p => p+c)} onDelete={() => setUserInput(p => p.slice(0, -1))} onClear={() => setUserInput('')} />
                      <button onClick={handleVerify} className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all">Verifica q</button>
                  </div>
                )}
             </div>
           )}

           {currentStep === Step.COMPLETATO && (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-slide-in py-10">
                <div className="text-[12rem] animate-bounce">🎯</div>
                <h3 className="text-5xl font-black text-emerald-600 italic uppercase tracking-tighter">Retta Individuata!</h3>
                <div className="p-16 bg-emerald-100 rounded-[4rem] border-8 border-emerald-500 shadow-2xl scale-110">
                    <p className="font-serif italic text-6xl text-emerald-900 font-black tracking-tight leading-tight flex items-center justify-center gap-2">y = <Fraction val={metadata.m_str} />x {metadata.q_val >= 0 ? '+' : ''} <Fraction val={metadata.q_str} /></p>
                </div>
             </div>
           )}
        </div>
      </div>

      <div className="flex flex-col h-full space-y-8">
        <div className="bg-white p-10 rounded-[4rem] shadow-2xl border border-slate-50 flex flex-col h-full w-full min-h-[950px] transition-all overflow-hidden">
            <div className="flex flex-col gap-8 mb-8">
                <div className="bg-indigo-600 text-white p-8 rounded-[3rem] shadow-xl border-[6px] border-indigo-100 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100 mb-2 opacity-80">Obiettivo attuale</p>
                    <h3 className="text-5xl font-black italic tracking-tighter leading-tight transition-all">
                        {currentStep === Step.CALCOLA_M && <span>Calcolo Pendenza</span>}
                        {currentStep === Step.CALCOLA_Q && <span>Calcolo Intercetta</span>}
                        {currentStep === Step.COMPLETATO && <span>Esercizio Finito</span>}
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className={`p-8 rounded-[2.5rem] border flex flex-col items-center justify-center text-center transition-all bg-slate-50 border-slate-200 shadow-md`}>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 leading-none">Formula della retta</span>
                        <span className="font-serif italic text-4xl text-slate-600 font-bold leading-tight">y = mx + q</span>
                    </div>
                </div>
            </div>
            
            <div className={`flex-grow bg-[#f8fafc] rounded-[4rem] border border-slate-100 p-8 shadow-inner relative overflow-hidden flex items-center justify-center transition-all duration-700`}>
                <div className="w-full h-full flex items-center justify-center">
                  <canvas ref={chartRef}></canvas>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TwoPointsLineExercise;

