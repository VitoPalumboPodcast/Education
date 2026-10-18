
import React from 'react';
import { ProblemType } from '../types';

interface ProblemSelectorProps {
  onSelect: (type: ProblemType) => void;
  currentType: ProblemType;
}

const ProblemSelector: React.FC<ProblemSelectorProps> = ({ onSelect, currentType }) => {
  const types = [
    { id: ProblemType.EQUATION, label: 'Equazioni', icon: '∑' },
    { id: ProblemType.QUADRATIC_EQUATION, label: 'Equazioni 2° grado', icon: 'x²' },
    { id: ProblemType.INEQUALITY, label: 'Disequazioni', icon: '≶' },
    { id: ProblemType.FRACTIONAL_INEQUALITY, label: 'Diseq. Fratte (Visual)', icon: '👁️' },
    { id: ProblemType.FRACTIONAL_INEQUALITY_CLASSIC, label: 'Diseq. Fratte (Classic)', icon: '📝' },
    { id: ProblemType.FRACTIONAL_EQUATION, label: 'Eq. Fratte', icon: 'f(x)=0' },
    { id: ProblemType.INEQUALITY_SYSTEM, label: 'Sistemi Diseq.', icon: '⎧≶' },
    { id: ProblemType.LINE_EQUATION, label: 'Punti Retta', icon: '📈' },
    { id: ProblemType.LINE_TWO_POINTS, label: 'Retta 2 Punti', icon: 'A-B' },
    { id: ProblemType.SYSTEM, label: 'Sistemi Eq.', icon: '⎧=' },
    { id: ProblemType.PARALLEL_LINES, label: 'Parallele', icon: '||' },
    { id: ProblemType.PERPENDICULAR_LINES, label: 'Perpendicolari', icon: '⊥' },
    { id: ProblemType.PERP_POINT_SLOPE, label: 'Punto-Fascio', icon: 'y-y₀' },
    { id: ProblemType.LINE_EXPLORER, label: 'Retta Interattiva', icon: '📏' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {types.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-tight transition-all ${
            currentType === t.id
              ? 'bg-indigo-600 text-white shadow-md transform scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-slate-200'
          }`}
        >
          <span className="text-lg">{t.icon}</span>
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ProblemSelector;

