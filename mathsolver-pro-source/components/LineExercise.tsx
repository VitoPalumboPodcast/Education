
import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables, Plugin } from 'chart.js';
import MathRenderer from './MathRenderer';
import MathKeypad from './MathKeypad';
import { normalizeMathString } from '../services/mathService';

Chart.register(...registerables);

interface LineExerciseProps {
  m: number;
  q: number;
  onComplete: () => void;
  setVoiceMessage: (msg: string) => void;
}

enum CalcStep {
  IDLE,
  SUBSTITUTE, // y = m(x) + q
  MULTIPLY,   // y = product + q
  COMPLETED
}

const LineExercise: React.FC<LineExerciseProps> = ({ m, q, onComplete, setVoiceMessage }) => {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [currentX, setCurrentX] = useState<string>('');
  const [currentCalcStep, setCurrentCalcStep] = useState<CalcStep>(CalcStep.IDLE);
  const [calcInput, setCalcInput] = useState<string>('y=');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Custom Plugin for Axis References and Labels
  const axisReferencesPlugin: Plugin = {
    id: 'axisReferences',
    afterDatasetsDraw: (chart) => {
      const { ctx, scales: { x, y } } = chart;
      
      // 1. Draw User Points (A, B, C...)
      points.forEach((pt, index) => {
        const xPos = x.getPixelForValue(pt.x);
        const yPos = y.getPixelForValue(pt.y);
        const xZero = x.getPixelForValue(0);
        const yZero = y.getPixelForValue(0);

        const colors = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];
        const color = colors[index % colors.length];
        const label = String.fromCharCode(65 + index); // A, B, C...

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.moveTo(xPos, yPos);
        ctx.lineTo(xPos, yZero);
        ctx.moveTo(xPos, yPos);
        ctx.lineTo(xZero, yPos);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = 'bold 14px Inter, system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(label, xPos, yPos - 12);
        
        ctx.font = 'bold 10px Inter, system-ui';
        ctx.fillText(pt.x.toString(), xPos, yZero + 15);
        ctx.textAlign = 'right';
        ctx.fillText(pt.y.toString(), xZero - 8, yPos + 3);
        ctx.restore();
      });

      // 2. Highlight Y-Intercept (q) as a subtle guide
      const qXPos = x.getPixelForValue(0);
      const qYPos = y.getPixelForValue(q);
      ctx.save();
      ctx.fillStyle = '#6366f1'; 
      ctx.beginPath();
      ctx.arc(qXPos, qYPos, 4, 0, 2 * Math.PI);
      ctx.fill();
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
              { label: 'Asse X', data: [{ x: -10, y: 0 }, { x: 10, y: 0 }], borderColor: '#0f172a', borderWidth: 2, pointRadius: 0, showLine: true, fill: false },
              { label: 'Asse Y', data: [{ x: 0, y: -10 }, { x: 0, y: 10 }], borderColor: '#0f172a', borderWidth: 2, pointRadius: 0, showLine: true, fill: false },
              { label: 'Punti', data: [], backgroundColor: (context) => ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'][context.dataIndex % 5], borderColor: 'white', borderWidth: 2, pointRadius: 7, pointHoverRadius: 9, showLine: false },
              { label: 'Retta', data: [], borderColor: '#ef4444', borderWidth: 4, pointRadius: 0, showLine: true, fill: false }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { type: 'linear', min: -10, max: 10, ticks: { stepSize: 1, color: '#94a3b8', font: { weight: 'bold' } }, grid: { color: '#f1f5f9' } },
              y: { type: 'linear', min: -10, max: 10, ticks: { stepSize: 1, color: '#94a3b8', font: { weight: 'bold' } }, grid: { color: '#f1f5f9' } }
            },
            plugins: { legend: { display: false } }
          },
          plugins: [axisReferencesPlugin]
        });
      }
    }
    return () => { chartInstance.current?.destroy(); };
  }, [points]);

  useEffect(() => {
    if (!chartInstance.current) return;
    chartInstance.current.data.datasets[2].data = points.map(p => ({ x: p.x, y: p.y }));
    if (points.length >= 2) {
      const xMin = -10;
      const xMax = 10;
      chartInstance.current.data.datasets[3].data = [
        { x: xMin, y: m * xMin + q },
        { x: xMax, y: m * xMax + q }
      ];
      if (points.length === 2) onComplete();
    }
    chartInstance.current.update();
  }, [points, m, q, onComplete]);

  const startCalculation = () => {
    const x = parseFloat(currentX);
    if (isNaN(x)) {
      setFeedback({ type: 'error', message: 'Inserisci un valore per X.' });
      setVoiceMessage("Scegli un valore per x da inserire in tabella.");
      return;
    }
    if (points.some(p => p.x === x)) {
      setFeedback({ type: 'error', message: 'X già in tabella.' });
      setVoiceMessage("Hai già usato questa x.");
      return;
    }
    setCurrentCalcStep(CalcStep.SUBSTITUTE);
    setCalcInput('y=');
    setFeedback({ type: 'success', message: 'X impostata.' });
    setVoiceMessage(`Bene, calcoliamo la y per x uguale a ${x}.`);
  };

  const verifyStep = () => {
    const xVal = parseFloat(currentX);
    const product = m * xVal;
    const finalY = product + q;
    const normalizedInput = normalizeMathString(calcInput);

    if (currentCalcStep === CalcStep.SUBSTITUTE) {
      if (normalizedInput === normalizeMathString(`y=${finalY}`)) {
        setPoints([...points, { x: xVal, y: finalY }]);
        setVoiceMessage(`Bravo! Hai trovato il punto ${String.fromCharCode(65 + points.length)}.`);
        resetExerciseState();
        return;
      }
      if (normalizedInput === normalizeMathString(`y=${product}${q >= 0 ? '+' : ''}${q}`)) {
        setFeedback({ type: 'success', message: 'Moltiplicazione corretta!' });
        setVoiceMessage("Giusto, ora fai la somma.");
        setCurrentCalcStep(CalcStep.MULTIPLY);
        setCalcInput('y=');
      } else {
        setFeedback({ type: 'error', message: 'Riprova!' });
        setVoiceMessage("C'è un errore nella moltiplicazione, controlla bene i segni.");
      }
    } else if (currentCalcStep === CalcStep.MULTIPLY) {
      if (normalizedInput === normalizeMathString(`y=${finalY}`)) {
        setPoints([...points, { x: xVal, y: finalY }]);
        setVoiceMessage("Ottimo lavoro, punto aggiunto.");
        resetExerciseState();
      } else {
        setFeedback({ type: 'error', message: 'Errore!' });
        setVoiceMessage("Controlla la somma finale.");
      }
    }
  };

  const resetExerciseState = () => {
    setCurrentCalcStep(CalcStep.IDLE);
    setCalcInput('y=');
    setCurrentX('');
    setFeedback({ type: 'success', message: 'Punto trovato!' });
  };

  const mStr = m === 1 ? '' : (m === -1 ? '-' : m.toString());
  const qStr = q === 0 ? '' : (q > 0 ? `+ ${q}` : `- ${Math.abs(q)}`);
  const generalLatex = `y = ${mStr}x ${qStr}`;

  const getStepLatex = () => {
    const x = currentX || '?';
    if (currentCalcStep === CalcStep.IDLE) return generalLatex;
    if (currentCalcStep === CalcStep.SUBSTITUTE) return `y = \\color{#4f46e5}{${m} \\cdot (${x})} ${qStr}`;
    if (currentCalcStep === CalcStep.MULTIPLY) return `y = \\color{#10b981}{${m * parseFloat(x)} ${qStr}}`;
    return "";
  };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8 items-start h-full">
      <div className="w-full xl:w-[480px] flex flex-col gap-6 shrink-0">
        
        {/* Istruzioni Iniziali */}
        <div className="bg-indigo-50/50 p-6 rounded-[2.5rem] border border-indigo-100 text-center shadow-sm">
             <p className="text-slate-600 leading-relaxed font-medium italic">
               "Scegli un valore per <span className="font-serif italic font-bold text-indigo-600">x</span>, calcola la <span className="font-serif italic font-bold text-indigo-600">y</span> corrispondente e trova <b className="text-slate-800 not-italic">2 punti</b> per disegnare la retta."
             </p>
        </div>

        {/* General Equation Card - Always visible at top left */}
        <div className="bg-white p-6 rounded-[3rem] shadow-xl border border-indigo-50 animate-slide-in">
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3 block text-center">Equazione della Retta</span>
          <MathRenderer latex={generalLatex} noPadding />
        </div>

        <div className="bg-white p-6 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tabella Coordinate</h4>
          </div>
          
          <div className="max-h-[200px] overflow-y-auto rounded-2xl border border-slate-200 shadow-inner">
            <table className="w-full border-collapse bg-white">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-3 text-[9px] font-black text-slate-500 uppercase text-center border-r border-slate-200">X (Scelta)</th>
                  <th className="p-3 text-[9px] font-black text-slate-500 uppercase text-center">Y (Calcolata)</th>
                </tr>
              </thead>
              <tbody>
                {points.map((p, i) => (
                  <tr key={i} className="animate-slide-in">
                    <td className="p-4 text-center font-bold text-slate-800 text-lg border-r border-slate-100 border-b border-slate-50">{p.x}</td>
                    <td className="p-4 text-center font-bold text-slate-800 text-lg border-b border-slate-50">{p.y}</td>
                  </tr>
                ))}
                {currentCalcStep === CalcStep.IDLE && (
                  <tr>
                    <td className="p-3 border-r border-slate-100">
                      <input 
                        type="number" 
                        placeholder="x..." 
                        value={currentX} 
                        onChange={(e) => setCurrentX(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && startCalculation()} 
                        className={`w-full bg-white p-3 rounded-xl text-center font-black text-indigo-600 border-2 border-indigo-100 outline-none focus:border-indigo-600 text-xl transition-all shadow-sm ${currentX === '' ? 'animate-pulse-indigo' : ''}`}
                      />
                    </td>
                    <td className="p-3 text-center text-slate-300 font-black italic text-xl">?</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {currentCalcStep === CalcStep.IDLE && (
            <button 
              onClick={startCalculation} 
              disabled={!currentX} 
              className="mt-6 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-30 active:scale-95"
            >
              Conferma x per Punto {String.fromCharCode(65 + points.length)}
            </button>
          )}
        </div>

        <div className={`bg-slate-50 p-6 rounded-[3rem] border border-slate-200 shadow-inner flex flex-col gap-5 transition-all duration-500`}>
          <div className="text-center">
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3 block">Risoluzione Passaggio</span>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <MathRenderer latex={getStepLatex()} noPadding />
            </div>
          </div>
          <div className={`bg-slate-900 p-5 rounded-3xl shadow-2xl border-4 ${currentCalcStep !== CalcStep.IDLE ? 'border-indigo-600 animate-pulse-indigo' : 'border-slate-800 opacity-50'}`}>
            <input type="text" value={calcInput} readOnly className="w-full text-4xl font-mono bg-transparent text-white text-center font-black outline-none" />
          </div>
          <MathKeypad onInput={(c) => setCalcInput(prev => prev + c)} onDelete={() => setCalcInput(prev => (prev.length > 2 ? prev.slice(0, -1) : 'y='))} onClear={() => setCalcInput('y=')} />
          <button 
            onClick={verifyStep} 
            disabled={currentCalcStep === CalcStep.IDLE}
            className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
          >
            Verifica Calcolo
          </button>
        </div>
      </div>

      <div className="flex-grow bg-white p-10 rounded-[4rem] shadow-2xl border border-slate-50 flex flex-col h-[850px] w-full min-w-0">
        <div className="flex justify-between items-center mb-8 px-4">
          <div className="flex flex-col">
            <h3 className="text-2xl font-black text-slate-800 italic tracking-tighter">Piano Cartesiano</h3>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Rappresentazione Grafica</span>
          </div>
        </div>
        
        <div className="flex-grow relative w-full h-full bg-slate-50/50 rounded-[3rem] border border-slate-100 p-4 shadow-inner">
          <canvas ref={chartRef}></canvas>
        </div>

        <div className="mt-10 flex justify-center gap-20 border-t border-slate-100 pt-8">
            <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Pendenza (m)</span>
                <span className="text-4xl font-black text-indigo-950">{m}</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Ordinata Origine (q)</span>
                <span className="text-4xl font-black text-indigo-950">{q}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LineExercise;

