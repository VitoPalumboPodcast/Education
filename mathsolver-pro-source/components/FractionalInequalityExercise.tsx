
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MathRenderer from './MathRenderer';
import DraggableSolver from './DraggableSolver';
import MiniNumberLine from './MiniNumberLine';
import { formatPoly, formatFraction } from '../services/mathService';

interface FractionalInequalityExerciseProps {
  metadata: {
    a1: number;
    b1: number;
    a2: number;
    b2: number;
    op: string;
    root1: number;
    root2: number;
  };
  onComplete: () => void;
  setVoiceMessage: (msg: string) => void;
}

enum Step {
  DENOMINATOR_ZERO,
  DENOMINATOR_VISUAL,
  NUMERATOR_ZERO,
  NUMERATOR_VISUAL,
  SIGN_TABLE,
  ENDPOINTS,
  FINAL_SOLUTION
}

const FractionalInequalityExercise: React.FC<FractionalInequalityExerciseProps> = ({ metadata, onComplete, setVoiceMessage }) => {
  const { a1, b1, a2, b2, op, root1, root2 } = metadata;
  const [currentStep, setCurrentStep] = useState<Step>(Step.DENOMINATOR_ZERO);
  const [showAlgebra, setShowAlgebra] = useState(false);
  const [selectedIntervals, setSelectedIntervals] = useState<number[]>([]);
  const [endpointDecisions, setEndpointDecisions] = useState<{ [key: number]: boolean | null }>({});
  const [tempRootInput, setTempRootInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const sortedRoots = useMemo(() => {
    const roots = [
      { val: root1, type: 'N' as const, label: formatFraction(-b1, a1), poly: formatPoly(a1, b1) },
      { val: root2, type: 'D' as const, label: formatFraction(-b2, a2), poly: formatPoly(a2, b2) }
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

  const checkRootInput = (expected: number, nextStep: Step) => {
    const val = parseFloat(tempRootInput.replace(',', '.'));
    if (Math.abs(val - expected) < 0.01) {
      setCurrentStep(nextStep);
      setTempRootInput('');
      setShowAlgebra(false);
      setFeedback(null);
      if (nextStep === Step.DENOMINATOR_VISUAL) {
        setVoiceMessage(`Esatto! ${expected} annulla il denominatore. Guarda la mappa dei segni: a sinistra è negativo, a destra positivo, e il punto è VIETATO.`);
      } else if (nextStep === Step.NUMERATOR_VISUAL) {
        setVoiceMessage(`Ottimo! ${expected} annulla il numeratore. Qui la frazione varrebbe zero.`);
      }
    } else {
      setFeedback({ type: 'error', msg: "Non è il numero corretto. Prova a risolvere l'equazione." });
      setVoiceMessage("Non è proprio quello. Prova a risolvere l'equazione o guarda i passaggi.");
    }
  };

  const toggleInterval = (index: number) => {
    if (selectedIntervals.includes(index)) {
      setSelectedIntervals(selectedIntervals.filter(i => i !== index));
    } else {
      setSelectedIntervals([...selectedIntervals, index]);
    }
  };

  const handleEndpointDecision = (rootIndex: number, include: boolean) => {
    setEndpointDecisions({ ...endpointDecisions, [rootIndex]: include });
  };

  const checkFinalSolution = () => {
    // Check intervals
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

    const intervalsCorrect = selectedIntervals.length === correctIndices.length && 
                             selectedIntervals.every(i => correctIndices.includes(i));

    // Logic for endpoints:
    // Denominator root is ALWAYS excluded (false)
    // Numerator root is included (true) ONLY if op is >= or <=
    // Since op is > or <, both should be excluded (false)
    
    const expected0 = false; 
    const expected1 = false; 

    if (intervalsCorrect && endpointDecisions[0] === expected0 && endpointDecisions[1] === expected1) {
      onComplete();
    } else {
      if (!intervalsCorrect) {
        setVoiceMessage("Controlla i tratti selezionati. Guarda la riga FRAZIONE: devi selezionare dove il segno corrisponde alla richiesta.");
      } else {
        const root0 = sortedRoots[0];
        const root1 = sortedRoots[1];
        let errorMsg = "";
        
        if (endpointDecisions[0] !== expected0) {
          errorMsg = root0.type === 'D' ? 
            `${root0.label} annulla il denominatore: è VIETATO, quindi va escluso.` : 
            `${root0.label} annulla il numeratore, ma la richiesta è strettamente ${op} 0, quindi va escluso.`;
        } else if (endpointDecisions[1] !== expected1) {
          errorMsg = root1.type === 'D' ? 
            `${root1.label} annulla il denominatore: è VIETATO, quindi va escluso.` : 
            `${root1.label} annulla il numeratore, ma la richiesta è strettamente ${op} 0, quindi va escluso.`;
        }
        
        setVoiceMessage(errorMsg || "Attenzione agli estremi! Ricorda le regole di inclusione.");
      }
    }
  };

  const getSign = (a: number, b: number, x: number) => {
    return (a * x + b) > 0 ? '+' : '-';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Disequazione Fratta</h2>
        <MathRenderer latex={`\\frac{${formatPoly(a1, b1)}}{${formatPoly(a2, b2)}} ${op} 0`} />
      </div>

      <AnimatePresence mode="wait">
        {currentStep === Step.DENOMINATOR_ZERO && (
          <motion.div 
            key="den-zero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-rose-50 p-8 rounded-[2rem] border-2 border-rose-100 space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">1</div>
              <h3 className="text-xl font-bold text-red-900">Il Denominatore</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-rose-700 font-medium text-lg">Quale numero fa diventare zero il denominatore <span className="font-serif italic font-bold">{formatPoly(a2, b2)}</span>?</p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <input 
                  type="text"
                  value={tempRootInput}
                  onChange={(e) => setTempRootInput(e.target.value)}
                  placeholder="Numero..."
                  className="bg-white border-2 border-rose-200 rounded-2xl px-6 py-4 text-2xl font-black text-red-600 w-40 focus:outline-none focus:border-red-400 transition-all"
                />
                <button 
                  onClick={() => checkRootInput(root2, Step.DENOMINATOR_VISUAL)}
                  className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95"
                >
                  Verifica
                </button>
              </div>

              {feedback?.type === 'error' && <p className="text-red-600 font-bold text-sm">{feedback.msg}</p>}

              <div className="pt-4">
                <button 
                  onClick={() => setShowAlgebra(!showAlgebra)}
                  className="text-red-600 text-sm font-bold underline decoration-red-200 underline-offset-4"
                >
                  {showAlgebra ? "Nascondi passaggi" : "Vuoi vedere i passaggi di calcolo?"}
                </button>
                
                <AnimatePresence>
                  {showAlgebra && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-4 bg-white p-6 rounded-2xl border border-rose-100 shadow-inner"
                    >
                      <DraggableSolver 
                        initialEquation={{ a: a2, b: b2, c: 0 }}
                        initialOperator="="
                        onComplete={() => {}}
                        compact
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === Step.DENOMINATOR_VISUAL && (
          <motion.div 
            key="den-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[3rem] border-2 border-red-100 shadow-xl space-y-8 flex flex-col items-center"
          >
            <MiniNumberLine 
              root={root2} 
              rootLabel={formatFraction(-b2, a2)} 
              type="D" 
              isPositiveRight={a2 > 0} 
              pointStatus="vietato" 
            />
            <button 
              onClick={() => {
                setCurrentStep(Step.NUMERATOR_ZERO);
                setVoiceMessage("Molto bene. Ora passiamo al numeratore.");
              }}
              className="bg-red-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-lg"
            >
              Continua al Numeratore
            </button>
          </motion.div>
        )}

        {currentStep === Step.NUMERATOR_ZERO && (
          <motion.div 
            key="num-zero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 p-8 rounded-[2rem] border-2 border-blue-100 space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">2</div>
              <h3 className="text-xl font-bold text-blue-900">Il Numeratore</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-blue-700 font-medium text-lg">Quale numero fa diventare zero il numeratore <span className="font-serif italic font-bold">{formatPoly(a1, b1)}</span>?</p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <input 
                  type="text"
                  value={tempRootInput}
                  onChange={(e) => setTempRootInput(e.target.value)}
                  placeholder="Numero..."
                  className="bg-white border-2 border-blue-200 rounded-2xl px-6 py-4 text-2xl font-black text-blue-600 w-40 focus:outline-none focus:border-blue-400 transition-all"
                />
                <button 
                  onClick={() => checkRootInput(root1, Step.NUMERATOR_VISUAL)}
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95"
                >
                  Verifica
                </button>
              </div>

              {feedback?.type === 'error' && <p className="text-red-600 font-bold text-sm">{feedback.msg}</p>}

              <div className="pt-4">
                <button 
                  onClick={() => setShowAlgebra(!showAlgebra)}
                  className="text-blue-600 text-sm font-bold underline decoration-blue-200 underline-offset-4"
                >
                  {showAlgebra ? "Nascondi passaggi" : "Vuoi vedere i passaggi di calcolo?"}
                </button>
                
                <AnimatePresence>
                  {showAlgebra && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-4 bg-white p-6 rounded-2xl border border-blue-100 shadow-inner"
                    >
                      <DraggableSolver 
                        initialEquation={{ a: a1, b: b1, c: 0 }}
                        initialOperator="="
                        onComplete={() => {}}
                        compact
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === Step.NUMERATOR_VISUAL && (
          <motion.div 
            key="num-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[3rem] border-2 border-blue-100 shadow-xl space-y-8 flex flex-col items-center"
          >
            <MiniNumberLine 
              root={root1} 
              rootLabel={formatFraction(-b1, a1)} 
              type="N" 
              isPositiveRight={a1 > 0} 
              pointStatus="zero" 
            />
            <button 
              onClick={() => {
                setCurrentStep(Step.SIGN_TABLE);
                setVoiceMessage("Ottimo. Ora uniamo tutto nella tabella dei segni.");
              }}
              className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg"
            >
              Vai alla Tabella dei Segni
            </button>
          </motion.div>
        )}

        {(currentStep === Step.SIGN_TABLE || currentStep === Step.ENDPOINTS || currentStep === Step.FINAL_SOLUTION) && (
          <motion.div 
            key="table"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Visual Number Line above table */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-inner flex flex-col items-center">
              <div className="relative w-full h-1.5 bg-slate-200 rounded-full flex items-center my-10">
                {sortedRoots.map((root, i) => (
                  <div key={i} className="absolute -translate-x-1/2 flex flex-col items-center" style={{ left: `${25 + i * 50}%` }}>
                    <div className={`w-6 h-6 rounded-full border-4 ${root.type === 'N' ? 'bg-blue-600 border-blue-200' : 'bg-red-600 border-red-200'} z-10 shadow-md`}></div>
                    <div className="mt-3 font-serif italic text-slate-900 font-black text-lg">{root.label}</div>
                    <div className={`text-[9px] font-black uppercase tracking-widest ${root.type === 'N' ? 'text-blue-600' : 'text-red-600'}`}>
                      {root.type === 'N' ? 'Numeratore' : 'Denominatore'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl overflow-x-auto">
              <h3 className="text-center text-slate-400 font-black text-xs uppercase tracking-widest mb-6">Tabella dei Segni</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 border-b-2 border-slate-100"></th>
                    {intervals.map((interval, i) => (
                      <th key={i} className="p-4 border-b-2 border-slate-100 text-slate-600 font-serif italic text-lg">
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
                        <td key={i} className={`p-6 text-4xl font-black text-center ${sign === '+' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {sign}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="group hover:bg-rose-50/30 transition-colors">
                    <td className="p-4 font-bold text-red-600 border-r-2 border-slate-100">D: {formatPoly(a2, b2)}</td>
                    {intervals.map((interval, i) => {
                      const testPoint = interval.start === -Infinity ? interval.end - 1 : 
                                        interval.end === Infinity ? interval.start + 1 : 
                                        (interval.start + interval.end) / 2;
                      const sign = getSign(a2, b2, testPoint);
                      return (
                        <td key={i} className={`p-6 text-4xl font-black text-center ${sign === '+' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {sign}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-4 font-black text-slate-900 border-r-2 border-slate-100 uppercase tracking-tighter">FRAZIONE</td>
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
                          className={`p-6 text-5xl font-black text-center cursor-pointer transition-all ${
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

            {/* Endpoint Selection */}
            <div className="bg-indigo-50 p-8 rounded-[2rem] border-2 border-indigo-100 space-y-6">
              <h4 className="text-indigo-900 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                <span>📍</span> Decisione sugli estremi
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedRoots.map((root, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif italic text-2xl font-black text-slate-800">{root.label}</span>
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${root.type === 'N' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                        {root.type === 'N' ? 'Annulla Numeratore' : 'Annulla Denominatore'}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium">Il punto <span className="font-bold text-slate-900">{root.label}</span> si prende nella soluzione?</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEndpointDecision(i, true)}
                        className={`flex-1 py-3 rounded-xl font-black transition-all shadow-sm ${endpointDecisions[i] === true ? 'bg-emerald-500 text-white scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        SÌ [ • ]
                      </button>
                      <button 
                        onClick={() => handleEndpointDecision(i, false)}
                        className={`flex-1 py-3 rounded-xl font-black transition-all shadow-sm ${endpointDecisions[i] === false ? 'bg-rose-500 text-white scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        NO [ ◦ ]
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center max-w-2xl">
                <p className="text-slate-600 font-medium leading-relaxed">
                  Guarda la riga <span className="font-black text-indigo-600">FRAZIONE</span>: devi selezionare i tratti dove il segno è uguale alla richiesta iniziale (<span className="font-black text-slate-900">{op} 0</span>).
                </p>
              </div>
              <button 
                onClick={checkFinalSolution}
                disabled={selectedIntervals.length === 0 || endpointDecisions[0] === undefined || endpointDecisions[1] === undefined}
                className={`px-16 py-6 rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 ${
                  (selectedIntervals.length > 0 && endpointDecisions[0] !== undefined && endpointDecisions[1] !== undefined) ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Conferma Soluzione Finale
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 shadow-sm">
        <h4 className="text-amber-900 font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
          <span>💡</span> Domande Guida
        </h4>
        <ul className="space-y-4 text-amber-800 font-medium">
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-xs font-black">1</span>
            Quale numero fa diventare zero il numeratore?
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-xs font-black">2</span>
            Quale numero fa diventare zero il denominatore? Questo numero si può usare oppure no?
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-xs font-black">3</span>
            Guarda la riga FRAZIONE: devi selezionare i tratti dove il segno è uguale alla richiesta iniziale.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FractionalInequalityExercise;

