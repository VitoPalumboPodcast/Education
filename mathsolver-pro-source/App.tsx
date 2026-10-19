
import React, { useState, useEffect } from 'react';
import { ProblemType, Difficulty, SolvingMode, MathProblem } from './types';
import { generateProblem } from './services/mathService';
import ProblemSelector from './components/ProblemSelector';
import DraggableSolver from './components/DraggableSolver';
import LineExercise from './components/LineExercise';
import SystemExercise from './components/SystemExercise';
import InteractiveLine from './components/InteractiveLine';
import InequalitySystemExercise from './components/InequalitySystemExercise';
import ParallelLinesExercise from './components/ParallelLinesExercise';
import PerpendicularLinesExercise from './components/PerpendicularLinesExercise';
import PerpendicularLinesAltExercise from './components/PerpendicularLinesAltExercise';
import TwoPointsLineExercise from './components/TwoPointsLineExercise';
import FractionalInequalityExercise from './components/FractionalInequalityExercise';
import FractionalInequalityClassicExercise from './components/FractionalInequalityClassicExercise';
import FractionalEquationExercise from './components/FractionalEquationExercise';
import TutorVoice from './components/TutorVoice';
import QuadraticExercise from './components/QuadraticExercise';

/**
 * Main Application Component
 * Manages the state of the current math problem and coordinates the various exercise components.
 */
const App: React.FC = () => {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [problemType, setProblemType] = useState<ProblemType>(ProblemType.QUADRATIC_EQUATION);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [solvingMode] = useState<SolvingMode>(SolvingMode.INTERACTIVE);
  const [voiceMessage, setVoiceMessage] = useState<string>('');

  // Initialize and update problem when type or difficulty changes
  useEffect(() => {
    handleNewProblem();
  }, [problemType, difficulty]);

  const handleNewProblem = () => {
    const newProb = generateProblem(problemType, difficulty);
    setProblem(newProb);
    setVoiceMessage(`Ecco un nuovo problema di ${newProb.title}. Risolviamolo insieme!`);
  };

  const onComplete = () => {
    setVoiceMessage("Ottimo lavoro! Hai completato l'esercizio correttamente.");
  };

  /**
   * Renders the appropriate exercise component based on the current problem type.
   */
  const renderExercise = () => {
    if (!problem) return null;

    switch (problem.type) {
      case ProblemType.QUADRATIC_EQUATION:
        return <QuadraticExercise key={problem.id} difficulty={difficulty} onComplete={onComplete} />;
      case ProblemType.EQUATION:
      case ProblemType.INEQUALITY:
        return (
          <DraggableSolver
            key={problem.id}
            initialEquation={problem.metadata}
            initialOperator={problem.operator}
            onStepComplete={(_latex, desc, _guidance) => setVoiceMessage(desc)}
            onComplete={onComplete}
          />
        );
      case ProblemType.SYSTEM:
        return (
          <SystemExercise
            key={problem.id}
            metadata={problem.metadata}
            onComplete={onComplete}
            setVoiceMessage={setVoiceMessage}
          />
        );
      case ProblemType.LINE_EQUATION:
        return (
          <LineExercise
            key={problem.id}
            m={problem.metadata.m}
            q={problem.metadata.q}
            onComplete={onComplete}
            setVoiceMessage={setVoiceMessage}
          />
        );
      case ProblemType.LINE_EXPLORER:
        return <InteractiveLine key={problem.id} />;
      case ProblemType.INEQUALITY_SYSTEM:
        return (
          <InequalitySystemExercise
            key={problem.id}
            metadata={problem.metadata}
            mode={solvingMode}
            onComplete={onComplete}
            setVoiceMessage={setVoiceMessage}
          />
        );
      case ProblemType.PARALLEL_LINES:
        return (
          <ParallelLinesExercise
            key={problem.id}
            metadata={problem.metadata}
            onComplete={onComplete}
            setVoiceMessage={setVoiceMessage}
          />
        );
      case ProblemType.PERPENDICULAR_LINES:
        return (
          <PerpendicularLinesExercise
            key={problem.id}
            metadata={problem.metadata}
            onComplete={onComplete}
            setVoiceMessage={setVoiceMessage}
          />
        );
      case ProblemType.PERP_POINT_SLOPE:
        return (
          <PerpendicularLinesAltExercise
            key={problem.id}
            metadata={problem.metadata}
            mode={solvingMode}
            onComplete={onComplete}
            setVoiceMessage={setVoiceMessage}
          />
        );
      case ProblemType.LINE_TWO_POINTS:
        return (
          <TwoPointsLineExercise
            key={problem.id}
            metadata={problem.metadata}
            onComplete={onComplete}
            setVoiceMessage={setVoiceMessage}
          />
        );
      case ProblemType.FRACTIONAL_INEQUALITY:
        return (
          <FractionalInequalityExercise
            key={problem.id}
            metadata={problem.metadata}
            onComplete={onComplete}
            setVoiceMessage={setVoiceMessage}
          />
        );
      case ProblemType.FRACTIONAL_INEQUALITY_CLASSIC:
        return (
          <FractionalInequalityClassicExercise
            key={problem.id}
            metadata={problem.metadata}
            onComplete={onComplete}
            setVoiceMessage={setVoiceMessage}
          />
        );
      case ProblemType.FRACTIONAL_EQUATION:
        return (
          <FractionalEquationExercise
            key={problem.id}
            metadata={problem.metadata}
            onComplete={onComplete}
            setVoiceMessage={setVoiceMessage}
          />
        );
      default:
        return <div className="p-10 text-center text-slate-400">Tipo di problema non supportato.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-[1920px] mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
              MATH<span className="text-indigo-600">LAB</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Interactive Math Tutor</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-200">
              {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                    difficulty === d ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {d === 1 ? 'Facile' : d === 2 ? 'Medio' : 'Difficile'}
                </button>
              ))}
            </div>

            <button
              onClick={handleNewProblem}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
            >
              Nuovo Problema
            </button>
          </div>
        </header>

        <ProblemSelector onSelect={setProblemType} currentType={problemType} />

        <main className="min-h-[600px] bg-white rounded-[3rem] p-6 md:p-10 shadow-sm border border-slate-100">
          {renderExercise()}
        </main>

        <TutorVoice message={voiceMessage} isAiEnabled={false} />
      </div>
    </div>
  );
};

export default App;

