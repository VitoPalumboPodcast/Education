import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MathRenderer from './MathRenderer';
import DraggableSolver from './DraggableSolver';
import { formatPoly, formatFraction } from '../services/mathService';

interface FractionalInequalityClassicExerciseProps {
  metadata: any;
  onComplete: () => void;
  setVoiceMessage: (msg: string) => void;
}

enum Step {
  NUMERATOR,
  DENOMINATOR,
  SIGN_TABLE
}

const FractionalInequalityClassicExercise: React.FC<FractionalInequalityClassicExerciseProps> = ({ metadata, onComplete, setVoiceMessage }) => {
  const { a1, b1, a2, b2, op, root1, root2 } = metadata;
  const [currentStep, setCurrentStep] = useState<Step>(Step.NUMERATOR);
  const [selectedIntervals, setSelectedIntervals] = useState<number[]>([]);

  const sortedRoots = useMemo(() => {
    const roots = [
      { val: root1, type: 'N', label: formatFraction(-b1, a1) },
      { val: root2, type: 'D', label: formatFraction(-b2, a2) }
    ].sort((a, b) => a.val - b.val);
    return roots;
  }, [root1, root2, a1, b1, a2, b2]);

  const intervals = useMemo(() => {
    return [
      { start: -Infinity, end: sortedRoots[0].val, label: `x < ${sortedRoots[0].label}` },
      { start: sortedRoots[0].val, end: sortedRoots[1].val, label: `${sortedRoots[0].label} < x < ${sortedRoots[1].label}` },
      { start: sortedRoots[1].val, end: Infinity, label: `x > ${sortedRoots[1].label}` }
    ];
  }, [sortedRoots]);

  const handleNumComplete = () => {
    setCurrentStep(Step.DENOMINATOR);
    setVoiceMessage("Ottimo! Hai trovato dove il numeratore è positivo. Ora facciamo lo stesso per il denominatore.");
  };

  const handleDenComplete = () => {
    setCurrentStep(Step.SIGN_TABLE);
    setVoiceMessage("Perfetto. Ora uniamo i risultati nella tabella dei segni per trovare la soluzione finale.");
  };

  const toggleInterval = (index: number) => {
    if (selectedIntervals.includes(index)) {
      setSelectedIntervals(selectedIntervals.filter(i => i !== index));
    } else {
      setSelectedIntervals([...selectedIntervals, index]);
    }
  };

  const checkFinalSolution = () => {
    const correctIndices: number[] = [];
    intervals.forEach((interval, idx) => {
      const testPoint = interval.start === -Infinity ? interval.end - 1 : 
                        interval.end === Infinity ? interval.start + 1 : 
                        (interval.start + interval.end) / 2;
      const nVal = a1 * testPoint + b1;
      const dVal = a2 * testPoint + b2;
      const fractionVal = nVal / dVal;
      const isCorrect = op === '>' ? fractionVal > 0 : fractionVal < 0;
      if (isCorrect) correctIndices.push(idx);
    });

    if (selectedIntervals.length === correctIndices.length && 
        selectedIntervals.every(i => correctIndices.includes(i))) {
      onComplete();
    } else {
      setVoiceMessage("Controlla i tratti selezionati. Ricorda la regola dei segni: + per + fa +, + per - fa -, ecc.");
    }
  };

  const getSign = (a: number, b: number, x: number) => {
    return (a * x + b) > 0 ? '+' : '-';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Disequazione Fratta (Classic)</h2>
        <MathRenderer latex={`\\frac{${formatPoly(a1, b1)}}{${formatPoly(a2, b2)}} ${op} 0`} />
      </div>

      <AnimatePresence mode="wait">
        {currentStep === Step.NUMERATOR && (
          <motion.div 
            key="num"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-blue-50 p-8 rounded-[2rem] border-2 border-blue-100 space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">1</div>
              <h3 className="text-xl font-bold text-blue-900">Studio del Numeratore</h3>
            </div>
            <p className="text-blue-700 font-medium">Studiamo dove il numeratore è positivo: <span className="font-bold">{formatPoly(a1, b1)} &gt; 0</span></p>
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-inner">
              <DraggableSolver 
                initialEquation={{ a: a1, b: b1, c: 0 }}
                initialOperator=">"
                onComplete={handleNumComplete}
                compact
              />
            </div>
          </motion.div>
        )}

        {currentStep === Step.DENOMINATOR && (
          <motion.div 
            key="den"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-rose-50 p-8 rounded-[2rem] border-2 border-rose-100 space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">2</div>
              <h3 className="text-xl font-bold text-rose-900">Studio del Denominatore</h3>
            </div>
            <p className="text-rose-700 font-medium">Studiamo dove il denominatore è positivo: <span className="font-bold">{formatPoly(a2, b2)} &gt; 0</span></p>
            <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-inner">
              <DraggableSolver 
                initialEquation={{ a: a2, b: b2, c: 0 }}
                initialOperator=">"
                onComplete={handleDenComplete}
                compact
              />
            </div>
          </motion.div>
        )}

        {currentStep === Step.SIGN_TABLE && (
          <motion.div 
            key="table"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl overflow-x-auto">
              <h3 className="text-center text-slate-400 font-black text-xs uppercase tracking-widest mb-6">Tabella dei Segni</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 border-b-2 border-slate-100"></th>
                    {intervals.map((interval, i) => (
                      <th key={i} className="p-4 border-b-2 border-slate-100 text-slate-600 font-serif italic">
                        {interval.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="group hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 font-bold text-blue-600 border-r-2 border-slate-100">N: {formatPoly(a1, b1)}</td>
                    {intervals.map((interval, i) => {
                      const testPoint = interval.start === -Infinity ? interval.end - 1 : 
                                        interval.end === Infinity ? interval.start + 1 : 
                                        (interval.start + interval.end) / 2;
                      const sign = getSign(a1, b1, testPoint);
                      return (
                        <td key={i} className={`p-6 text-3xl font-black text-center ${sign === '+' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {sign}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="group hover:bg-rose-50/30 transition-colors">
                    <td className="p-4 font-bold text-rose-600 border-r-2 border-slate-100">D: {formatPoly(a2, b2)}</td>
                    {intervals.map((interval, i) => {
                      const testPoint = interval.start === -Infinity ? interval.end - 1 : 
                                        interval.end === Infinity ? interval.start + 1 : 
                                        (interval.start + interval.end) / 2;
                      const sign = getSign(a2, b2, testPoint);
                      return (
                        <td key={i} className={`p-6 text-3xl font-black text-center ${sign === '+' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {sign}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-4 font-black text-slate-900 border-r-2 border-slate-100">FRAZIONE</td>
                    {intervals.map((interval, i) => {
                      const testPoint = interval.start === -Infinity ? interval.end - 1 : 
                                        interval.end === Infinity ? interval.start + 1 : 
                                        (interval.start + interval.end) / 2;
                      const nSign = getSign(a1, b1, testPoint);
                      const dSign = getSign(a2, b2, testPoint);
                      const finalSign = nSign === dSign ? '+' : '-';
                      const isSelected = selectedIntervals.includes(i);
                      
                      return (
                        <td 
                          key={i} 
                          onClick={() => toggleInterval(i)}
                          className={`p-6 text-4xl font-black text-center cursor-pointer transition-all ${
                            isSelected ? 'bg-indigo-600 text-white scale-105 shadow-lg rounded-xl' : 
                            finalSign === '+' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-rose-600 hover:bg-rose-50'
                          }`}
                        >
                          {finalSign}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                <p className="text-slate-500 font-medium">
                  Seleziona i tratti che soddisfano la richiesta iniziale (<span className="font-black text-slate-900">{op} 0</span>).
                </p>
              </div>
              <button 
                onClick={checkFinalSolution}
                disabled={selectedIntervals.length === 0}
                className={`px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                  selectedIntervals.length > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Verifica Soluzione
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 bg-amber-50 p-6 rounded-3xl border border-amber-100">
        <h4 className="text-amber-900 font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
          <span>💡</span> Domande Guida
        </h4>
        <ul className="space-y-2 text-amber-800 font-medium">
          <li className="flex gap-2"><span>1.</span> Risolvi N(x) &gt; 0 e D(x) &gt; 0 per trovare i segni.</li>
          <li className="flex gap-2"><span>2.</span> Riporta i segni nella tabella e calcola il segno della frazione.</li>
          <li className="flex gap-2"><span>3.</span> Scegli i tratti giusti in base al verso della disequazione iniziale.</li>
        </ul>
      </div>
    </div>
  );
};

export default FractionalInequalityClassicExercise;

