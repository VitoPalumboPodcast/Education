
import React, { useState, useEffect } from 'react';
import MathRenderer from './MathRenderer';
import MathKeypad from './MathKeypad';
import DraggableSolver from './DraggableSolver';
import InequalityGraph from './InequalityGraph';
import { SolvingMode, InequalitySolution } from '../types';
import { normalizeMathString, validateIneqStep, formatPoly } from '../services/mathService';

interface InequalitySystemExerciseProps {
  metadata: { 
    a1: number, b1: number, c1: number, op1: string,
    a2: number, b2: number, c2: number, op2: string,
    sol1: InequalitySolution, sol2: InequalitySolution,
    solutions: InequalitySolution[]
  };
  mode: SolvingMode;
  onComplete: () => void;
  setVoiceMessage: (msg: string) => void;
}

enum IneqStep {
  SOLVE_FIRST,
  SOLVE_SECOND,
  INTERSECTION,
  FINISHED
}

const InequalitySystemExercise: React.FC<InequalitySystemExerciseProps> = ({ metadata, mode, onComplete, setVoiceMessage }) => {
  const [currentStep, setCurrentStep] = useState<IneqStep>(IneqStep.SOLVE_FIRST);
  const [userInput, setUserInput] = useState('');
  const [visibleSolutions, setVisibleSolutions] = useState<InequalitySolution[]>([]);
  const [stepHistory, setStepHistory] = useState<string[]>([]);
  const [errorFeedback, setErrorFeedback] = useState(false);

  const currentParams = currentStep === IneqStep.SOLVE_FIRST 
    ? { a: metadata.a1, b: metadata.b1, c: metadata.c1, op: metadata.op1 }
    : { a: metadata.a2, b: metadata.b2, c: metadata.c2, op: metadata.op2 };

  const finalExpectedResult = `${metadata.sol1.val}<x<${metadata.sol2.val}`;

  const handleVerifyKeyboard = () => {
    if (currentStep === IneqStep.INTERSECTION) {
      if (normalizeMathString(userInput) === normalizeMathString(finalExpectedResult)) {
        setCurrentStep(IneqStep.FINISHED);
        onComplete();
      } else {
        setVoiceMessage(`Controlla bene l'intervallo comune. Dovrebbe essere della forma ${finalExpectedResult}`);
        triggerError();
      }
      return;
    }

    const validation = validateIneqStep(userInput, currentParams);

    if (validation.isValid) {
      if (validation.isFinal) {
        const targetSol = currentStep === IneqStep.SOLVE_FIRST ? metadata.sol1 : metadata.sol2;
        const newSols = [...visibleSolutions, targetSol];
        setVisibleSolutions(newSols);
        setStepHistory([]);
        setUserInput('');
        const next = currentStep === IneqStep.SOLVE_FIRST ? IneqStep.SOLVE_SECOND : IneqStep.INTERSECTION;
        setCurrentStep(next);
        setVoiceMessage(next === IneqStep.SOLVE_SECOND ? "Ottimo! Risolviamo la seconda disequazione." : "Perfetto, ora scrivi l'intervallo finale basandoti sul grafico.");
      } else {
        setStepHistory(prev => [...prev, userInput]);
        setUserInput('');
        setVoiceMessage("Passaggio corretto, continua così!");
      }
    } else {
      setVoiceMessage("Passaggio non corretto. Ricorda di cambiare segno se sposti un termine.");
      triggerError();
    }
  };

  const triggerError = () => {
    setErrorFeedback(true);
    setTimeout(() => setErrorFeedback(false), 500);
  };

  const handleInteractiveComplete = () => {
    const targetSol = currentStep === IneqStep.SOLVE_FIRST ? metadata.sol1 : metadata.sol2;
    const newSols = [...visibleSolutions, targetSol];
    setVisibleSolutions(newSols);
    const next = currentStep === IneqStep.SOLVE_FIRST ? IneqStep.SOLVE_SECOND : IneqStep.INTERSECTION;
    setCurrentStep(next);
    setVoiceMessage(next === IneqStep.SOLVE_SECOND ? "Ben fatto! Passiamo alla seconda." : "Eccellente. Adesso trova la sovrapposizione.");
  };

  // Formattazione pulita delle disequazioni utilizzando formatPoly
  const ineq1Latex = `${formatPoly(metadata.a1, metadata.b1)} ${metadata.op1} ${metadata.c1}`;
  const ineq2Latex = `${formatPoly(metadata.a2, metadata.b2)} ${metadata.op2} ${metadata.c2}`;

  return (
    <div className="w-full flex flex-col gap-8 animate-slide-in">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Sistema di Disequazioni</h4>
        <div className="flex justify-center p-6 bg-white rounded-3xl relative">
           <div className="absolute left-[30%] sm:left-[35%] top-1/2 -translate-y-1/2">
             <span className="text-8xl font-serif font-extralight text-slate-900 leading-none">{"{"}</span>
           </div>
           <div className="flex flex-col gap-4 pl-12">
             <div className={`${currentStep === IneqStep.SOLVE_FIRST ? 'text-indigo-600 scale-105 font-bold' : 'text-slate-300'} transition-all text-3xl font-serif italic`}>{ineq1Latex}</div>
             <div className={`${currentStep === IneqStep.SOLVE_SECOND ? 'text-indigo-600 scale-105 font-bold' : 'text-slate-300'} transition-all text-3xl font-serif italic`}>{ineq2Latex}</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 min-h-[500px] flex flex-col">
            {currentStep === IneqStep.FINISHED ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 flex-grow">
                <div className="text-6xl animate-bounce">🎯</div>
                <h3 className="text-2xl font-black italic text-emerald-600 uppercase tracking-tighter">Sistema Completato!</h3>
                <div className="p-6 bg-emerald-50 rounded-3xl border-2 border-emerald-100">
                  <p className="text-emerald-900 font-serif italic text-3xl">{finalExpectedResult}</p>
                </div>
              </div>
            ) : mode === SolvingMode.INTERACTIVE && currentStep !== IneqStep.INTERSECTION ? (
              <div className="animate-slide-in flex-grow">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Risoluzione Trascina termini</h5>
                <DraggableSolver 
                  key={currentStep}
                  initialEquation={currentStep === IneqStep.SOLVE_FIRST ? { a: metadata.a1, b: metadata.b1, c: metadata.c1 } : { a: metadata.a2, b: metadata.b2, c: metadata.c2 }}
                  initialOperator={currentStep === IneqStep.SOLVE_FIRST ? metadata.op1 : metadata.op2}
                  onStepComplete={() => {}}
                  onComplete={handleInteractiveComplete}
                  compact
                />
              </div>
            ) : (
              <div className="animate-slide-in space-y-6 flex-grow flex flex-col">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">
                   {currentStep === IneqStep.INTERSECTION ? 'Intervallo Finale' : 'Calcolo Algebrico'}
                 </h5>
                 
                 <div className="flex-grow space-y-4 mb-4 overflow-y-auto max-h-[120px] p-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                    <div className="text-center text-slate-400 font-serif italic opacity-50">
                       {currentStep === IneqStep.INTERSECTION ? 'Trova la soluzione comune' : 'Passaggi:'}
                    </div>
                    {stepHistory.map((step, idx) => (
                      <div key={idx} className="text-center text-indigo-400 font-serif italic text-xl animate-slide-in">
                        {step}
                      </div>
                    ))}
                 </div>

                 <div className={`p-6 bg-slate-50 border-2 transition-all ${errorFeedback ? 'border-red-500 animate-shake bg-red-50' : 'border-indigo-100'} rounded-[2rem] shadow-inner`}>
                    <input 
                      type="text" 
                      value={userInput} 
                      readOnly 
                      placeholder="..." 
                      className="w-full bg-transparent text-center text-4xl font-serif italic text-indigo-900 outline-none" 
                    />
                 </div>

                 <MathKeypad 
                   onInput={(c) => setUserInput(p => p + c)} 
                   onDelete={() => setUserInput(p => p.slice(0, -1))} 
                   onClear={() => setUserInput('')} 
                 />

                 <button 
                   onClick={handleVerifyKeyboard} 
                   disabled={!userInput}
                   className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:brightness-110 active:scale-95 shadow-xl transition-all disabled:opacity-20"
                 >
                   Conferma Passaggio
                 </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 flex flex-col items-center justify-between min-h-[500px]">
          <InequalityGraph solutions={visibleSolutions} />
          
          <div className="w-full mt-6 space-y-4">
            <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Riepilogo Risultati</h6>
            <div className="grid grid-cols-1 gap-3">
              <div className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all ${visibleSolutions.length >= 1 ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
                <span className="text-[10px] font-black text-slate-500">DISEQ. 1</span>
                <span className="font-serif italic text-2xl text-slate-800">
                  {visibleSolutions.length >= 1 ? `x ${metadata.sol1.op} ${metadata.sol1.val}` : '...'}
                </span>
              </div>
              <div className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all ${visibleSolutions.length >= 2 ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
                <span className="text-[10px] font-black text-slate-500">DISEQ. 2</span>
                <span className="font-serif italic text-2xl text-slate-800">
                  {visibleSolutions.length >= 2 ? `x ${metadata.sol2.op} ${metadata.sol2.val}` : '...'}
                </span>
              </div>
            </div>
          </div>
          
          {currentStep === IneqStep.INTERSECTION && (
             <div className="mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-center animate-pulse">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Suggerimento Grafico</p>
                <p className="text-indigo-900 font-serif italic text-sm">Guarda dove la linea è verde in entrambi i livelli.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InequalitySystemExercise;

