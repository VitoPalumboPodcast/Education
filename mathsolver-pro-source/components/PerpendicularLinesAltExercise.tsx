
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart, registerables, Plugin } from 'chart.js';
import MathRenderer from './MathRenderer';
import MathKeypad from './MathKeypad';
import { normalizeMathString, formatPoly, formatFraction, evaluateMathExpression } from '../services/mathService';
import { SolvingMode } from '../types';

Chart.register(...registerables);

interface TermState {
  id: string;
  label: string;
  num: number;
  den: number;
  hasX: boolean;
  hasY: boolean;
  side: 'L' | 'R';
}

interface PerpendicularLinesAltExerciseProps {
  metadata: { 
    A: number, B: number, C: number, 
    m_r: number, q_r: number, 
    x_p: number, y_p: number, 
    m_s_str: string, q_s_str: string, q_s_val: number,
    rawImplicit: string,
    A1: number, A2: number, B1: number, B2: number
  };
  onComplete: () => void;
  setVoiceMessage: (msg: string) => void;
  mode: SolvingMode;
}

enum AltStep {
  ESPLICITA_R, 
  IDENTIFICA_MR, 
  ANTIRECIPROCO_S,
  SOSTITUZIONE_FASCIO,
  CALCOLO_FINALE,
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

const PerpendicularLinesAltExercise: React.FC<PerpendicularLinesAltExerciseProps> = ({ metadata, onComplete, setVoiceMessage, mode }) => {
  const [currentStep, setCurrentStep] = useState<AltStep>(AltStep.ESPLICITA_R);
  const [userInput, setUserInput] = useState('');
  const [terms, setTerms] = useState<TermState[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [isHoveringSide, setIsHoveringSide] = useState<'L' | 'R' | null>(null);
  const [isHoveringTermId, setIsHoveringTermId] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [draggedTerm, setDraggedTerm] = useState<TermState | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isYIsolatedAndSimplified, setIsYIsolatedAndSimplified] = useState(false);

  const [formulaSlots, setFormulaSlots] = useState<{ y0: string, ms: string, x0: string }>({ y0: 'y₀', ms: "mₛ", x0: 'x₀' });
  const [selectedSource, setSelectedSource] = useState<'YP' | 'XP' | 'MS' | null>(null);

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  const lcm = (a: number, b: number): number => Math.abs(a * b) / (gcd(Math.abs(a), Math.abs(b)) || 1);

  // Fase 1: Inizializzazione per Retta r (ROSSO)
  useEffect(() => {
    if (currentStep === AltStep.ESPLICITA_R) {
        const initialTerms: TermState[] = [
          { id: 't-y', label: 'y', num: 1, den: 1, hasX: false, hasY: true, side: 'L' },
          { id: 't-a1x', label: `${metadata.A1}x`, num: metadata.A1, den: 1, hasX: true, hasY: false, side: 'L' },
          { id: 't-b1', label: `${metadata.B1}`, num: metadata.B1, den: 1, hasX: false, hasY: false, side: 'L' },
          { id: 't-a2x', label: `${metadata.A2}x`, num: metadata.A2, den: 1, hasX: true, hasY: false, side: 'R' },
          { id: 't-b2', label: `${metadata.B2}`, num: metadata.B2, den: 1, hasX: false, hasY: false, side: 'R' }
        ];
        setTerms(initialTerms.filter(t => t.num !== 0 || t.hasY));
    }
  }, [metadata, currentStep === AltStep.ESPLICITA_R]);

  // Gestione avanzamento Fase 1
  useEffect(() => {
    if (currentStep === AltStep.ESPLICITA_R && terms.length > 0) {
        const leftTerms = terms.filter(t => t.side === 'L');
        const rightTerms = terms.filter(t => t.side === 'R');
        const isolatedY = leftTerms.length === 1 && leftTerms[0].hasY;
        const xTermsOnRight = rightTerms.filter(t => t.hasX).length;
        const constTermsOnRight = rightTerms.filter(t => !t.hasX && !t.hasY).length;
        const simplified = xTermsOnRight <= 1 && constTermsOnRight <= 1;
        
        if (isolatedY && simplified && !isYIsolatedAndSimplified) {
            setIsYIsolatedAndSimplified(true);
            setVoiceMessage("Ottimo! Retta r esplicitata. Ora indica mr.");
            setTimeout(() => setCurrentStep(AltStep.IDENTIFICA_MR), 1000);
        }
    }
  }, [terms, currentStep, isYIsolatedAndSimplified]);

  // Fase 4: Inizializzazione per Retta s (VERDE)
  useEffect(() => {
    if (currentStep === AltStep.CALCOLO_FINALE) {
        let ms_num = 1, ms_den = 1;
        if (metadata.m_s_str.includes('/')) {
            const parts = metadata.m_s_str.split('/');
            ms_num = parseInt(parts[0]); ms_den = parseInt(parts[1]);
        } else {
            ms_num = parseInt(metadata.m_s_str);
        }

        let rhs_const_num = -(ms_num * metadata.x_p);
        let rhs_const_den = ms_den;

        const initialTerms4: TermState[] = [
            { id: 'f4-y', label: 'y', num: 1, den: 1, hasX: false, hasY: true, side: 'L' },
            { id: 'f4-yp', label: `${-metadata.y_p}`, num: -metadata.y_p, den: 1, hasX: false, hasY: false, side: 'L' },
            { id: 'f4-msx', label: `${metadata.m_s_str}x`, num: ms_num, den: ms_den, hasX: true, hasY: false, side: 'R' },
            { id: 'f4-rhs', label: formatFraction(rhs_const_num, rhs_const_den), num: rhs_const_num, den: rhs_const_den, hasX: false, hasY: false, side: 'R' }
        ];

        setTerms(initialTerms4.filter(t => t.num !== 0 || t.hasY));
        setVoiceMessage("Sposta il termine noto a destra e sommalo per trovare l'equazione finale di s.");
    }
  }, [currentStep, metadata]);

  // Completamento Esercizio
  useEffect(() => {
    if (currentStep === AltStep.CALCOLO_FINALE && terms.length > 0) {
        const leftTerms = terms.filter(t => t.side === 'L');
        const rightTerms = terms.filter(t => t.side === 'R');
        const isYSolo = leftTerms.length === 1 && leftTerms[0].hasY;
        const simplifiedR = rightTerms.length <= 2 && rightTerms.filter(t => t.hasX).length <= 1 && rightTerms.filter(t => !t.hasX).length <= 1;
        
        if (isYSolo && simplifiedR) {
            const mTerm = rightTerms.find(t => t.hasX);
            const qTerm = rightTerms.find(t => !t.hasX && !t.hasY);
            const mOk = mTerm && Math.abs((mTerm.num / mTerm.den) - (-1/metadata.m_r)) < 0.01;
            const qOk = qTerm ? Math.abs((qTerm.num / qTerm.den) - metadata.q_s_val) < 0.01 : (Math.abs(metadata.q_s_val) < 0.001);

            if (mOk && qOk) {
                setTimeout(() => { setCurrentStep(AltStep.COMPLETATO); onComplete(); }, 1000);
            }
        }
    }
  }, [terms, currentStep, metadata]);

  const cartesianPlugin: Plugin = {
    id: 'cartesianPluginAltExtended',
    afterDatasetsDraw: (chart) => {
      const { ctx, scales: { x, y } } = chart;
      const xZero = x.getPixelForValue(0);
      const yZero = y.getPixelForValue(0);
      const xP = x.getPixelForValue(metadata.x_p);
      const yP = y.getPixelForValue(metadata.y_p);

      ctx.save();
      
      // Assi principali
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x.left, yZero); ctx.lineTo(x.right, yZero); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xZero, y.bottom); ctx.lineTo(xZero, y.top); ctx.stroke();

      // Proiezioni per il Punto P (Sempre visibili essendo un dato)
      ctx.setLineDash([6, 4]); ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(xP, yP); ctx.lineTo(xP, yZero); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xP, yP); ctx.lineTo(xZero, yP); ctx.stroke();
      ctx.setLineDash([]);

      // Etichette numeriche sugli assi per P
      ctx.fillStyle = '#1d4ed8'; ctx.font = 'bold 12px Inter';
      ctx.textAlign = 'center'; ctx.fillText(metadata.x_p.toString(), xP, yZero + 18);
      ctx.textAlign = 'right'; ctx.fillText(metadata.y_p.toString(), xZero - 8, yP + 5);

      // Label "P(x,y)" vicino al punto
      ctx.textAlign = 'left'; ctx.font = 'italic bold 14px Lora';
      ctx.fillText(`P(${metadata.x_p}, ${metadata.y_p})`, xP + 10, yP - 10);

      // Label Retta r (se identificata)
      if (currentStep >= AltStep.IDENTIFICA_MR) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'italic bold 14px Lora';
        const yREnd = metadata.m_r * 8 + metadata.q_r;
        ctx.fillText(`r: y = ${formatPoly(metadata.m_r, metadata.q_r)}`, x.getPixelForValue(5.5), y.getPixelForValue(yREnd) - 10);
      }

      // Label Retta s (se completata)
      if (currentStep === AltStep.COMPLETATO) {
        ctx.fillStyle = '#10b981';
        ctx.font = 'italic bold 16px Lora';
        const ms = -1/metadata.m_r;
        const qs = metadata.y_p - (ms * metadata.x_p);
        const ySEnd = ms * -8 + qs;
        ctx.fillText(`s: y = ${metadata.m_s_str}x ${metadata.q_s_val >= 0 ? '+' : ''} ${metadata.q_s_str}`, x.getPixelForValue(-9), y.getPixelForValue(ySEnd) - 15);
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
              { label: 'r', data: [{ x: -10, y: metadata.m_r * -10 + metadata.q_r }, { x: 10, y: metadata.m_r * 10 + metadata.q_r }], borderColor: '#ef4444', borderWidth: 3, pointRadius: 0, fill: false },
              { label: 's', data: [], borderColor: '#10b981', borderWidth: 4, pointRadius: 0, fill: false },
              { label: 'P', data: [{ x: metadata.x_p, y: metadata.y_p }], backgroundColor: '#3b82f6', borderColor: 'white', borderWidth: 3, pointRadius: 8, showLine: false }
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
    if (currentStep === AltStep.COMPLETATO && chartInstance.current) {
        const m_s = -1/metadata.m_r;
        const q_s = metadata.y_p - (m_s * metadata.x_p);
        chartInstance.current.data.datasets[1].data = [{x: -10, y: m_s*-10 + q_s}, {x: 10, y: m_s*10 + q_s}];
        chartInstance.current.update();
    }
  }, [currentStep, metadata]);

  const handleInteraction = (draggedId: string, toSide: 'L' | 'R', targetTermId: string | null = null) => {
    const draggedTerm = terms.find(t => t.id === draggedId);
    if (!draggedTerm) return;
    const isTransport = draggedTerm.side !== toSide;

    if (targetTermId && targetTermId !== draggedId) {
      const targetTerm = terms.find(t => t.id === targetTermId);
      if (targetTerm && targetTerm.side === toSide) {
        const areSimilar = (draggedTerm.hasX && targetTerm.hasX) || (draggedTerm.hasY && targetTerm.hasY) || (!draggedTerm.hasX && !draggedTerm.hasY && !targetTerm.hasX && !targetTerm.hasY);
        if (areSimilar) {
          const d_num = isTransport ? -draggedTerm.num : draggedTerm.num;
          const d_den = draggedTerm.den;
          const t_num = targetTerm.num;
          const t_den = targetTerm.den;
          const commonDen = lcm(d_den, t_den);
          const newNum = (d_num * (commonDen / d_den)) + (t_num * (commonDen / t_den));
          setTerms(prev => {
            let next = prev.filter(t => t.id !== draggedId);
            if (newNum === 0 && !targetTerm.hasY) { next = next.filter(t => t.id !== targetTermId); } 
            else { next = next.map(t => t.id === targetTermId ? { ...t, num: newNum, den: commonDen, label: t.hasY ? 'y' : (t.hasX ? formatFraction(newNum, commonDen) + 'x' : formatFraction(newNum, commonDen)) } : t); }
            if (next.length === 0) next.push({ id: 'zero-' + Math.random(), num: 0, den: 1, label: '0', hasX: false, hasY: false, side: toSide });
            return next;
          });
          setIsVerifying(true); setTimeout(() => setIsVerifying(false), 1200);
        }
      }
    } else if (isTransport) {
      setTerms(prev => prev.map(t => t.id === draggedId ? { ...t, side: toSide, num: -t.num, label: t.hasY ? 'y' : (t.hasX ? formatFraction(-t.num, t.den) + 'x' : formatFraction(-t.num, t.den)) } : t));
      setIsVerifying(true); setTimeout(() => setIsVerifying(false), 1200);
    }
    setSelectedTermId(null); setIsHoveringSide(null); setIsHoveringTermId(null); setIsDragging(false); setDraggedTerm(null);
  };

  const handleVerify = () => {
    const userVal = evaluateMathExpression(userInput);
    const norm = normalizeMathString(userInput);
    if (currentStep === AltStep.IDENTIFICA_MR) { 
        if (userVal !== null && Math.abs(userVal - metadata.m_r) < 0.01) { 
            setCurrentStep(AltStep.ANTIRECIPROCO_S); 
            setUserInput('');
            setVoiceMessage("Corretto! Ora calcola ms, l'antireciproco di mr.");
        } 
    } 
    else if (currentStep === AltStep.ANTIRECIPROCO_S) { 
        if ((userVal !== null && Math.abs(userVal - (-1/metadata.m_r)) < 0.01) || (norm === normalizeMathString(`ms=${metadata.m_s_str}`))) { 
            setCurrentStep(AltStep.SOSTITUZIONE_FASCIO); 
            setUserInput('');
            setVoiceMessage("Bene! Ora sostituisci i valori nell'equazione del fascio.");
        } 
    } 
    else if (currentStep === AltStep.SOSTITUZIONE_FASCIO) { 
        if (formulaSlots.y0 === metadata.y_p.toString() && formulaSlots.ms === metadata.m_s_str && formulaSlots.x0 === metadata.x_p.toString()) { 
            setCurrentStep(AltStep.CALCOLO_FINALE); 
            setUserInput(''); 
        } 
    }
  };

  const handleSlotFill = (slot: 'y0' | 'ms' | 'x0') => {
    if (!selectedSource) return;
    let val = '';
    if (selectedSource === 'YP' && slot === 'y0') val = metadata.y_p.toString();
    else if (selectedSource === 'XP' && slot === 'x0') val = metadata.x_p.toString();
    else if (selectedSource === 'MS' && slot === 'ms') val = metadata.m_s_str;
    else return;
    setFormulaSlots(prev => ({ ...prev, [slot]: val }));
    setSelectedSource(null);
  };

  const renderTermContent = (num: number, den: number, hasX: boolean, hasY: boolean) => {
      if (hasY) return 'y';
      const absNum = Math.abs(num);
      const isOne = absNum === 1 && den === 1;
      if (den === 1) { return hasX ? (isOne ? 'x' : `${absNum}x`) : `${absNum}`; }
      return (
        <span className="inline-flex items-center gap-1 leading-none text-slate-900">
            <span className="flex flex-col items-center">
                <span className="border-b-2 border-slate-900 px-1 font-black">{absNum}</span>
                <span className="px-1 font-black">{den}</span>
            </span>
            {hasX && <span className="ml-1 font-black">x</span>}
        </span>
      );
  };

  const isStepR = currentStep === AltStep.ESPLICITA_R || currentStep === AltStep.IDENTIFICA_MR;
  const themeColor = isStepR ? 'red' : 'emerald';

  const renderSide = (side: 'L' | 'R') => {
    const sideTerms = terms.filter(t => t.side === side && (t.num !== 0 || t.hasY));
    const isTargetingTransport = draggedTerm && draggedTerm.side !== side && isHoveringSide === side;
    return (
      <div onDragOver={(e) => { e.preventDefault(); if (!isHoveringTermId) setIsHoveringSide(side); }}
        onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData('text/plain'); if (!isHoveringTermId) handleInteraction(id, side); }}
        onClick={() => { if (selectedTermId) handleInteraction(selectedTermId, side); }}
        className={`flex-nowrap min-h-[160px] flex items-center justify-center gap-3 p-6 rounded-[3rem] border-2 border-dashed transition-all shrink-0 ${isHoveringSide === side ? `bg-${themeColor}-50 border-${themeColor}-400` : 'bg-slate-50 border-slate-100'}`}
      >
        {sideTerms.length === 0 && !isTargetingTransport && <span className="text-slate-300 font-serif italic text-5xl opacity-30">0</span>}
        {sideTerms.map((t, i) => (
          <React.Fragment key={t.id}>
            {i > 0 && <span className={`text-2xl font-serif text-slate-400 mx-1 shrink-0 font-black`}>{t.num >= 0 ? '+' : '-'}</span>}
            {i === 0 && t.num < 0 && <span className={`text-2xl font-serif text-slate-400 mr-1 shrink-0 font-black`}>-</span>}
            <div key={t.id} draggable={mode === SolvingMode.INTERACTIVE && (currentStep === AltStep.ESPLICITA_R || currentStep === AltStep.CALCOLO_FINALE)}
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', t.id); setSelectedTermId(t.id); setIsDragging(true); setDraggedTerm(t); }}
                onDragOver={(e) => { e.preventDefault(); setIsHoveringTermId(t.id); }}
                onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData('text/plain'); handleInteraction(id, t.side, t.id); }}
                onClick={(e) => { e.stopPropagation(); if (currentStep === AltStep.ESPLICITA_R || currentStep === AltStep.CALCOLO_FINALE) { if (selectedTermId) handleInteraction(selectedTermId, t.side, t.id); else setSelectedTermId(t.id); } }}
                className={`monomio-box px-5 py-4 rounded-[1.2rem] font-serif italic text-3xl font-black transition-all shadow-md border-2 flex items-center justify-center min-w-[100px] shrink-0 ${selectedTermId === t.id ? `bg-${themeColor}-600 text-white border-white scale-110 shadow-lg ring-4 ring-${themeColor}-100` : (isHoveringTermId === t.id ? 'bg-amber-100 border-amber-400 text-slate-900' : 'bg-white border-slate-100 text-slate-900')}`}
            >
                {renderTermContent(t.num, t.den, t.hasX, t.hasY)}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-[52%_1fr] gap-12 animate-slide-in max-w-full overflow-x-hidden">
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 min-h-[700px] flex flex-col gap-6">
           
           <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 text-center mb-2">
             <p className="text-lg text-slate-700 leading-relaxed font-serif italic">
               "Trova l'equazione della retta <span className="text-emerald-600 font-black not-italic">s (verde)</span>, perpendicolare alla retta <span className="text-red-600 font-black not-italic">r (rossa)</span>, che passa per il punto <span className="text-blue-600 font-black not-italic">P (blu)</span>."
             </p>
           </div>

           {/* LEGENDA VARIABILI */}
           <div className="grid grid-cols-3 gap-2 mb-2 animate-slide-in">
             <div className="bg-red-50 p-3 rounded-2xl border border-red-100 text-center">
               <span className="text-[9px] font-black text-red-400 uppercase tracking-widest block mb-1">Retta <span className="lowercase">r</span> (Rossa)</span>
               <span className="font-serif italic text-red-800 text-2xl">y = <b className="font-black">mᵣ</b>x + qᵣ</span>
             </div>
             <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 text-center">
               <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Retta <span className="lowercase">s</span> (Verde)</span>
               <span className="font-serif italic text-emerald-800 text-2xl">y = <b className="font-black">mₛ</b>x + qₛ</span>
             </div>
             <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 text-center">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">Punto P (Blu)</span>
                <span className="font-serif italic text-blue-800 text-2xl">P(<b className="font-black">x₀</b>, <b className="font-black">y₀</b>)</span>
             </div>
           </div>
           
           <div className="text-center space-y-2">
             <h5 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Svolgimento Passo-Passo</h5>
             <div className="h-1 w-20 bg-indigo-100 mx-auto rounded-full"></div>
           </div>
           
           {(currentStep === AltStep.ESPLICITA_R || currentStep === AltStep.IDENTIFICA_MR) && (
             <div className="space-y-6 animate-slide-in relative">
                <div className={`p-8 rounded-3xl border-l-8 transition-all shadow-lg bg-red-600 border-red-400 text-white`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 text-red-100`}>FASE 1: ESPLICITARE <span className="lowercase">r</span> (ROSSA)</p>
                  <p className="text-lg font-medium leading-relaxed italic">Isola la y della retta r per trovarne la pendenza.</p>
                </div>
                <div className={`flex flex-row items-center justify-center gap-2 bg-white p-4 rounded-[2.5rem] border-2 shadow-inner overflow-x-auto no-scrollbar transition-all ${isYIsolatedAndSimplified ? 'border-red-200 ring-4 ring-red-50' : 'border-slate-100'}`}>
                    <div className="flex flex-row items-center gap-2 flex-nowrap shrink-0">{renderSide('L')}<span className="text-5xl font-serif italic text-slate-300 px-4 shrink-0 select-none">=</span>{renderSide('R')}</div>
                </div>
                {currentStep === AltStep.IDENTIFICA_MR && (
                    <div className="space-y-6 animate-slide-in py-4 bg-red-50/30 rounded-3xl border border-red-100 p-6 flex flex-col items-center">
                        <p className="text-sm font-bold text-red-800 italic uppercase tracking-tighter">Qual è <span className="inline-flex items-baseline lowercase text-2xl font-black"><span className="mr-0.5">m</span><sub className="text-xl lowercase">r</sub></span> nell'equazione?</p>
                        <div className="bg-white p-6 rounded-2xl border-4 border-red-400 shadow-xl inline-block min-w-[200px]"><input type="text" value={userInput} readOnly placeholder="mᵣ = ?" className="w-full text-center text-5xl font-serif italic text-red-900 bg-transparent outline-none font-black" /></div>
                        <MathKeypad onInput={(c) => setUserInput(p => p+c)} onDelete={() => setUserInput(p => p.slice(0, -1))} onClear={() => setUserInput('')} />
                        <button onClick={handleVerify} className="w-full py-6 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all">Verifica <span className="inline-flex items-baseline lowercase font-black"><span className="mr-0.5">m</span><sub className="text-lg lowercase">r</sub></span></button>
                    </div>
                )}
             </div>
           )}

           {currentStep === AltStep.ANTIRECIPROCO_S && (
             <div className="space-y-6 animate-slide-in">
                <div className="bg-emerald-50 p-8 rounded-3xl border-l-8 border-emerald-400 shadow-sm">
                  <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-1">FASE 2: PENDENZA DI <span className="lowercase">s</span> (VERDE)</p>
                  <p className="text-lg text-emerald-700 font-medium leading-relaxed italic">Trova <span className="inline-flex items-baseline lowercase font-black"><span className="mr-0.5">m</span><sub className="text-lg lowercase">s</sub></span> (antireciproco di <span className="inline-flex items-baseline lowercase font-black"><span className="mr-0.5">m</span><sub className="text-lg lowercase">r</sub></span>).</p>
                </div>
                <div className="flex justify-center items-center gap-8 p-12 bg-emerald-50/30 rounded-[2.5rem] border-2 border-emerald-100 shadow-inner">
                    <div className="text-center"><span className="inline-flex items-baseline font-black text-red-400 mb-1 text-2xl"><span className="mr-0.5 lowercase font-black">m</span><sub className="text-xl lowercase">r</sub></span><div className="text-6xl font-serif italic text-red-600 font-bold">{metadata.m_r}</div></div>
                    <div className="text-5xl text-slate-200">→</div>
                    <div className="bg-white px-10 py-6 rounded-2xl border-4 border-emerald-400 shadow-xl scale-110"><input type="text" value={userInput} readOnly placeholder="mₛ = ..." className="w-full text-center text-6xl font-serif italic text-emerald-600 bg-transparent outline-none font-black" /></div>
                </div>
                <MathKeypad onInput={(c) => setUserInput(p => p+c)} onDelete={() => setUserInput(p => p.slice(0, -1))} onClear={() => setUserInput('')} />
                <button onClick={handleVerify} className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all">Verifica <span className="inline-flex items-baseline lowercase font-black"><span className="mr-0.5">m</span><sub className="text-lg lowercase">s</sub></span></button>
             </div>
           )}

           {currentStep === AltStep.SOSTITUZIONE_FASCIO && (
             <div className="space-y-6 animate-slide-in">
                <div className="bg-emerald-50 p-8 rounded-3xl border-l-8 border-emerald-400 shadow-sm">
                  <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-1">FASE 3: COSTRUIRE LA RETTA <span className="lowercase">s</span></p>
                  <p className="text-lg text-emerald-700 font-medium leading-relaxed italic">Riempi la formula per la retta s selezionando i valori dal riepilogo a destra.</p>
                </div>
                <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100 text-center mx-2 shadow-sm">
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">💡 Perché questa formula?</p>
                    <p className="text-sm text-indigo-900 font-medium leading-relaxed font-serif">
                        Questa è l'equazione del <b className="text-indigo-700">fascio di rette</b> passante per un punto.
                        Poiché conosciamo sia il punto <b className="text-blue-600">P</b> che la pendenza <b className="text-emerald-600">mₛ</b>, possiamo usarla per scrivere direttamente l'equazione della retta.
                    </p>
                </div>
                <div className="p-10 bg-emerald-50/20 rounded-[2.5rem] border-4 border-dashed border-emerald-100 flex flex-col items-center shadow-inner">
                    <div className="flex items-baseline justify-center gap-1 text-5xl font-serif italic text-slate-800">
                        <span>y - </span>
                        <div onClick={() => handleSlotFill('y0')} className={`min-w-[100px] h-24 flex items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${formulaSlots.y0 !== 'y₀' ? 'bg-blue-600 text-white border-blue-400 font-black' : (selectedSource === 'YP' ? 'bg-blue-100 border-blue-400 animate-pulse scale-105 shadow-md text-blue-800' : 'bg-white border-slate-200 border-dashed text-slate-300')}`}>{formulaSlots.y0}</div>
                        <span className="mx-1">=</span>
                        <div onClick={() => handleSlotFill('ms')} className={`min-w-[100px] h-24 flex items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${formulaSlots.ms !== "mₛ" ? 'bg-emerald-600 text-white border-emerald-400 font-black' : (selectedSource === 'MS' ? 'bg-emerald-100 border-emerald-400 animate-pulse scale-105 shadow-md text-emerald-800' : 'bg-white border-slate-200 border-dashed text-slate-300')}`}>{formulaSlots.ms !== "mₛ" ? <Fraction val={formulaSlots.ms} className="text-inherit" /> : formulaSlots.ms}</div>
                        <span className="mx-1">·(x - </span>
                        <div onClick={() => handleSlotFill('x0')} className={`min-w-[100px] h-24 flex items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${formulaSlots.x0 !== 'x₀' ? 'bg-blue-600 text-white border-blue-400 font-black' : (selectedSource === 'XP' ? 'bg-blue-100 border-blue-400 animate-pulse scale-105 shadow-md text-blue-800' : 'bg-white border-slate-200 border-dashed text-slate-300')}`}>{formulaSlots.x0}</div>
                        <span>)</span>
                    </div>
                </div>
                <button onClick={handleVerify} className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all">Verifica Sostituzione</button>
             </div>
           )}

           {currentStep === AltStep.CALCOLO_FINALE && (
             <div className="space-y-6 animate-slide-in">
                <div className="p-8 rounded-3xl border-l-8 transition-all shadow-lg bg-emerald-600 border-emerald-400 text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-emerald-200">FASE 4: FORMA FINALE <span className="lowercase">s</span> (VERDE)</p>
                  <p className="text-lg font-medium leading-relaxed italic">Risolvi l'equazione finale di s trasportando e sommando.</p>
                </div>
                
                <div className="p-6 bg-slate-900 rounded-[2.5rem] border-4 border-indigo-500 text-center shadow-2xl">
                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2 block leading-none">Punto di Partenza:</span>
                    <div className="text-4xl font-serif italic text-white font-black opacity-90 flex justify-center items-center">
                        y {metadata.y_p >= 0 ? '-' : '+'} ({Math.abs(metadata.y_p)}) = <Fraction val={metadata.m_s_str} className="mx-2" /> · (x {metadata.x_p >= 0 ? '-' : '+'} ({Math.abs(metadata.x_p)}))
                    </div>
                </div>

                <div className="flex flex-row items-center justify-center gap-2 bg-white p-6 rounded-[3rem] border-4 shadow-2xl overflow-x-auto no-scrollbar transition-all border-emerald-200 ring-8 ring-emerald-50/50">
                    <div className="flex flex-row items-center gap-3 flex-nowrap shrink-0">
                        {renderSide('L')}
                        <span className="text-7xl font-serif italic text-slate-300 px-6 shrink-0 select-none">=</span>
                        {renderSide('R')}
                    </div>
                </div>
             </div>
           )}

           {currentStep === AltStep.COMPLETATO && (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-slide-in py-10">
                <div className="text-[12rem] animate-bounce">🎯</div>
                <h3 className="text-5xl font-black text-emerald-600 italic uppercase tracking-tighter">Retta s Individuata!</h3>
                <div className="p-16 bg-emerald-100 rounded-[4rem] border-8 border-emerald-500 shadow-2xl scale-110">
                    <p className="font-serif italic text-6xl text-emerald-900 font-black tracking-tight leading-tight flex items-center justify-center gap-2">s: y = <Fraction val={metadata.m_s_str} />x {metadata.q_s_val >= 0 ? '+' : ''} <Fraction val={metadata.q_s_str} /></p>
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
                        {(currentStep === AltStep.ESPLICITA_R || currentStep === AltStep.IDENTIFICA_MR) && <span>Analisi Retta <span className="lowercase">r</span></span>}
                        {currentStep === AltStep.ANTIRECIPROCO_S && <span>Pendenza <span className="inline-flex items-baseline lowercase font-black"><span className="mr-0.5">m</span><sub className="text-2xl lowercase">s</sub></span></span>}
                        {currentStep === AltStep.SOSTITUZIONE_FASCIO && <span>Costruzione <span className="lowercase">s</span></span>}
                        {currentStep === AltStep.CALCOLO_FINALE && <span>Calcolo Finale <span className="lowercase">s</span></span>}
                        {currentStep === AltStep.COMPLETATO && <span>Esercizio Finito</span>}
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`p-8 rounded-[2.5rem] border flex flex-col items-center justify-center text-center transition-all ${isStepR ? 'bg-red-50 border-red-200 ring-4 ring-red-50 shadow-md' : 'bg-red-50/30 border-red-100 opacity-60'}`}>
                        <span className="text-xs font-black text-red-400 uppercase tracking-widest mb-3 leading-none">DATO: retta <span className="lowercase">r</span> (ROSSA)</span>
                        <span className="font-serif italic text-4xl text-red-600 font-bold leading-tight">{metadata.rawImplicit}</span>
                    </div>
                    <div className={`p-8 rounded-[2.5rem] border flex flex-col items-center justify-center text-center shadow-sm relative transition-all ${!isStepR ? 'bg-blue-50 border-blue-200 ring-4 ring-blue-50 shadow-md' : 'bg-blue-50/50 border-blue-100'}`}>
                        <span className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4 leading-none">DATO: punto P</span>
                        <div className="flex gap-4 font-serif italic text-5xl text-blue-600 font-black items-center">
                           <span>P(</span>
                           <div onClick={() => (currentStep === AltStep.SOSTITUZIONE_FASCIO) && setSelectedSource('XP')}
                                className={`px-4 py-1 rounded-xl transition-all border-2 ${(currentStep === AltStep.SOSTITUZIONE_FASCIO) ? 'cursor-pointer hover:bg-blue-100 border-dashed border-blue-400 animate-pulse-indigo' : 'border-transparent'} ${selectedSource === 'XP' ? 'bg-blue-600 text-white shadow-lg scale-110 border-white' : ''}`}>
                             {metadata.x_p}
                           </div>
                           <span className="text-slate-300">,</span>
                           <div onClick={() => (currentStep === AltStep.SOSTITUZIONE_FASCIO) && setSelectedSource('YP')}
                                className={`px-4 py-1 rounded-xl transition-all border-2 ${(currentStep === AltStep.SOSTITUZIONE_FASCIO) ? 'cursor-pointer hover:bg-blue-100 border-dashed border-blue-400 animate-pulse-indigo' : 'border-transparent'} ${selectedSource === 'YP' ? 'bg-blue-600 text-white shadow-lg scale-110 border-white' : ''}`}>
                             {metadata.y_p}
                           </div>
                           <span>)</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {currentStep >= AltStep.ANTIRECIPROCO_S && (
                        <div className="grid grid-cols-1 gap-4 animate-slide-in">
                            <div className={`p-10 rounded-[3rem] border flex flex-col items-center transition-all ${currentStep === AltStep.SOSTITUZIONE_FASCIO ? 'bg-emerald-50 border-emerald-400 shadow-lg ring-4 ring-emerald-50' : 'bg-emerald-50/50 border-emerald-100 opacity-80'}`}>
                                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-8 leading-none">PERPENDICOLARITÀ DI <span className="lowercase">s</span> (VERDE)</p>
                                <div className="flex flex-col items-center gap-6">
                                    <div className="font-serif italic text-6xl text-emerald-600 font-black flex items-center gap-4">
                                        <div className="px-6 py-4 rounded-[1.5rem] border-2 border-dashed border-emerald-200 bg-white">
                                            <span className="inline-flex items-baseline lowercase font-black"><span className="mr-0.5">m</span><sub className="text-3xl lowercase">s</sub></span>
                                        </div>
                                        <span className="text-slate-300">=</span>
                                        <div className="flex flex-col items-center leading-none">
                                            <span className="border-b-4 border-emerald-600 px-6 pb-2">-1</span>
                                            <span className="px-6 pt-2 text-4xl lowercase inline-flex items-baseline font-black"><span className="mr-0.5">m</span><sub className="text-3xl lowercase">r</sub></span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-slate-400 font-black text-2xl tracking-tighter">→</span>
                                        <div onClick={() => (currentStep === AltStep.SOSTITUZIONE_FASCIO) && setSelectedSource('MS')}
                                            className={`px-10 py-5 rounded-2xl transition-all border-2 font-black text-6xl italic font-serif flex items-center justify-center ${(currentStep === AltStep.SOSTITUZIONE_FASCIO) ? 'cursor-pointer bg-white border-dashed border-emerald-400 animate-pulse text-emerald-700 shadow-md hover:scale-105' : 'bg-emerald-100 border-transparent text-emerald-800'} ${selectedSource === 'MS' ? 'bg-emerald-600 text-white shadow-xl scale-110 border-white animate-none' : (currentStep >= AltStep.SOSTITUZIONE_FASCIO ? 'bg-emerald-100 border-transparent text-emerald-800' : 'bg-slate-50 border-transparent text-slate-200 opacity-20')}`}>
                                            {currentStep >= AltStep.SOSTITUZIONE_FASCIO ? <Fraction val={metadata.m_s_str} className="text-inherit" /> : '?'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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

export default PerpendicularLinesAltExercise;

