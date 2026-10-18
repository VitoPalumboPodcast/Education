import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MathRenderer from './MathRenderer';
import DraggableSolver from './DraggableSolver';
import { formatPoly, formatFraction } from '../services/mathService';

interface FractionalEquationExerciseProps {
  metadata: any;
  onComplete: () => void;
  setVoiceMessage: (msg: string) => void;
}

enum Step {
  CONDITIONS,
  NUMERATOR,
  ACCEPTABILITY,
  FINAL
}

const FractionalEquationExercise: React.FC<FractionalEquationExerciseProps> = ({ metadata, onComplete, setVoiceMessage }) => {
  const { a1, b1, a2, b2, root1, root2 } = metadata;
  const [currentStep, setCurrentStep] = useState<Step>(Step.CONDITIONS);
  const [ceRoot, setCeRoot] = useState<number | null>(null);
  const [numRoot, setNumRoot] = useState<number | null>(null);
  const [isAcceptable, setIsAcceptable] = useState<boolean | null>(null);

  const handleCeComplete = () => {
    setCeRoot(root2);
    setCurrentStep(Step.NUMERATOR);
    setVoiceMessage(`Bene! Il denominatore si annulla per x = ${formatFraction(-b2, a2)}. Questa è la nostra condizione di esistenza: x deve essere diverso da questo valore.`);
  };

  const handleNumComplete = () => {
    setNumRoot(root1);
    setCurrentStep(Step.ACCEPTABILITY);
    setVoiceMessage(`Ottimo! Il numeratore si annulla per x = ${formatFraction(-b1, a1)}. Ora dobbiamo controllare se questa soluzione è accettabile confrontandola con le C.E.`);
  };

  const checkAcceptability = (choice: boolean) => {
    const correct = root1 !== root2;
    if (choice === correct) {
      setIsAcceptable(choice);
      setCurrentStep(Step.FINAL);
      if (correct) {
        setVoiceMessage(`Esatto! La soluzione x = ${formatFraction(-b1, a1)} è diversa dal valore vietato ${formatFraction(-b2, a2)}, quindi è accettabile.`);
      } else {
        setVoiceMessage(`Esatto! La soluzione x = ${formatFraction(-b1, a1)} coincide con il valore vietato, quindi l'equazione è impossibile.`);
      }
    } else {
      setVoiceMessage("Rifletti bene: la soluzione del numeratore è uguale o diversa dal valore vietato dal denominatore?");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Equazione Fratta</h2>
        <MathRenderer latex={`\\frac{${formatPoly(a1, b1)}}{${formatPoly(a2, b2)}} = 0`} />
      </div>

      <AnimatePresence mode="wait">
        {currentStep === Step.CONDITIONS && (
          <motion.div 
            key="ce"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-rose-50 p-8 rounded-[2rem] border-2 border-rose-100 space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">1</div>
              <h3 className="text-xl font-bold text-rose-900">Condizioni di Esistenza (C.E.)</h3>
            </div>
            <p className="text-rose-700 font-medium">Il denominatore deve essere diverso da zero. Risolvi <span className="font-bold">{formatPoly(a2, b2)} = 0</span> per trovare il valore vietato.</p>
            <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-inner">
              <DraggableSolver 
                initialEquation={{ a: a2, b: b2, c: 0 }}
                initialOperator="="
                onComplete={handleCeComplete}
                compact
              />
            </div>
          </motion.div>
        )}

        {currentStep === Step.NUMERATOR && (
          <motion.div 
            key="num"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 p-8 rounded-[2rem] border-2 border-blue-100 space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">2</div>
              <h3 className="text-xl font-bold text-blue-900">Risoluzione Numeratore</h3>
            </div>
            <p className="text-blue-700 font-medium">Una frazione è zero quando il suo numeratore è zero. Risolvi <span className="font-bold">{formatPoly(a1, b1)} = 0</span>.</p>
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-inner">
              <DraggableSolver 
                initialEquation={{ a: a1, b: b1, c: 0 }}
                initialOperator="="
                onComplete={handleNumComplete}
                compact
              />
            </div>
          </motion.div>
        )}

        {currentStep === Step.ACCEPTABILITY && (
          <motion.div 
            key="accept"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-indigo-50 p-8 rounded-[2rem] border-2 border-indigo-100 space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">3</div>
              <h3 className="text-xl font-bold text-indigo-900">Verifica Accettabilità</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-rose-200 text-center">
                <p className="text-xs font-black text-rose-400 uppercase tracking-widest mb-2">Valore Vietato (C.E.)</p>
                <p className="text-3xl font-black text-rose-600">x ≠ {formatFraction(-b2, a2)}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-blue-200 text-center">
                <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Soluzione Trovata</p>
                <p className="text-3xl font-black text-blue-600">x = {formatFraction(-b1, a1)}</p>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <p className="text-indigo-900 font-bold text-lg">La soluzione trovata è accettabile?</p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => checkAcceptability(true)}
                  className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg"
                >
                  SÌ, Accettabile
                </button>
                <button 
                  onClick={() => checkAcceptability(false)}
                  className="bg-rose-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-700 transition-all active:scale-95 shadow-lg"
                >
                  NO, Impossibile
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === Step.FINAL && (
          <motion.div 
            key="final"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 p-10 rounded-[3rem] border-2 border-emerald-100 shadow-xl text-center space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center text-4xl mx-auto shadow-lg">✓</div>
            <h3 className="text-3xl font-black text-emerald-900 uppercase tracking-tight">Esercizio Completato!</h3>
            <p className="text-emerald-700 font-medium text-lg">
              {isAcceptable 
                ? `L'equazione è determinata e la soluzione è x = ${formatFraction(-b1, a1)}.`
                : `L'equazione è impossibile perché l'unica soluzione annullerebbe anche il denominatore.`}
            </p>
            <button 
              onClick={onComplete}
              className="bg-emerald-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg"
            >
              Ottimo!
            </button>
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
            Per quali valori di x il denominatore è zero? (Questi valori vanno esclusi!)
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-xs font-black">2</span>
            Quando una frazione è uguale a zero? (Solo quando il suo numeratore è zero!)
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-xs font-black">3</span>
            La soluzione trovata "sopravvive" alle condizioni di esistenza?
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FractionalEquationExercise;

