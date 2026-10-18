
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Monomial } from '../types';

interface DraggableSolverProps {
  initialEquation?: { a: number, b: number, c: number, d?: number }; // ax + b = cx + d
  initialSideA?: Monomial[];
  initialSideB?: Monomial[];
  initialOperator?: string;
  onStepComplete: (latex: string, description: string, nextGuidance: string) => void;
  onComplete: () => void;
  compact?: boolean;
  variableLabel?: string;
}

const DraggableSolver: React.FC<DraggableSolverProps> = ({ 
  initialEquation, 
  initialSideA,
  initialSideB,
  initialOperator = "=", 
  onStepComplete, 
  onComplete,
  compact = false,
  variableLabel = 'x'
}) => {
  const [sideA, setSideA] = useState<Monomial[]>([]);
  const [sideB, setSideB] = useState<Monomial[]>([]);
  const [operator, setOperator] = useState(initialOperator);
  const [kValue, setKValue] = useState<number>(1);
  const [showKInput, setShowKInput] = useState<'mul' | 'div' | null>(null);
  const [isSimplified, setIsSimplified] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lastDroppedId, setLastDroppedId] = useState<string | null>(null);
  const [lastActionType, setLastActionType] = useState<'transport' | 'sum' | null>(null);
  const [targetSide, setTargetSide] = useState<'A' | 'B' | null>(null);
  
  const initializedRef = useRef<string | null>(null);

  const kOptions = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 10];

  useEffect(() => {
    const initStateKey = JSON.stringify({ initialEquation, initialSideA, initialSideB, initialOperator });
    
    if (initializedRef.current !== initStateKey) {
      if (initialSideA && initialSideB) {
        const sideAWithIds = initialSideA.map(m => ({ ...m, id: m.id || 'm-' + Math.random() }));
        const sideBWithIds = initialSideB.map(m => ({ ...m, id: m.id || 'm-' + Math.random() }));
        
        if (sideAWithIds.length === 0) sideAWithIds.push({ id: 'z-a-' + Math.random(), coeff: 0, den: 1, hasX: false });
        if (sideBWithIds.length === 0) sideBWithIds.push({ id: 'z-b-' + Math.random(), coeff: 0, den: 1, hasX: false });

        setSideA(sideAWithIds);
        setSideB(sideBWithIds);
      } else if (initialEquation) {
        const termsA: Monomial[] = [];
        const termsB: Monomial[] = [];

        if (initialEquation.a !== 0) {
          termsA.push({ id: 'mon-ax-' + Math.random(), coeff: initialEquation.a, den: 1, hasX: true });
        }
        if (initialEquation.b !== 0) {
          termsA.push({ id: 'mon-b-' + Math.random(), coeff: initialEquation.b, den: 1, hasX: false });
        }

        if (initialEquation.d !== undefined) {
          if ((initialEquation as any).c !== 0) {
            termsB.push({ id: 'mon-cx-' + Math.random(), coeff: (initialEquation as any).c, den: 1, hasX: true });
          }
          if (initialEquation.d !== 0) {
            termsB.push({ id: 'mon-d-' + Math.random(), coeff: initialEquation.d, den: 1, hasX: false });
          }
        } else {
          if ((initialEquation as any).c !== 0) {
            termsB.push({ id: 'mon-c-' + Math.random(), coeff: (initialEquation as any).c, den: 1, hasX: false });
          }
        }
        
        if (termsA.length === 0) termsA.push({ id: 'mon-zero-a-' + Math.random(), coeff: 0, den: 1, hasX: false });
        if (termsB.length === 0) termsB.push({ id: 'mon-zero-b-' + Math.random(), coeff: 0, den: 1, hasX: false });

        setSideA(termsA);
        setSideB(termsB);
      }
      setOperator(initialOperator);
      initializedRef.current = initStateKey;
    }
  }, [initialEquation, initialSideA, initialSideB, initialOperator]);

  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  const lcm = (a: number, b: number): number => Math.abs(a * b) / (gcd(Math.abs(a), Math.abs(b)) || 1);

  const checkIsSolved = useCallback((a: Monomial[], b: Monomial[]) => {
    const activeA = a.filter(m => m && m.coeff !== 0);
    const activeB = b.filter(m => m && m.coeff !== 0);
    
    const xOnLeft = activeA.length === 1 && activeA[0].hasX && activeA[0].coeff === 1 && activeA[0].den === 1 && activeB.length === 1 && !activeB[0].hasX;
    const xOnRight = activeB.length === 1 && activeB[0].hasX && activeB[0].coeff === 1 && activeB[0].den === 1 && activeA.length === 1 && !activeA[0].hasX;
    
    return xOnLeft || xOnRight;
  }, []);

  const isSolved = useMemo(() => checkIsSolved(sideA, sideB), [sideA, sideB, checkIsSolved]);

  const generateNextGuidance = useCallback((a: Monomial[], b: Monomial[], currentlySimplified: boolean) => {
    if (checkIsSolved(a, b)) return "Perfetto! Hai trovato il valore dell'incognita.";
    if (!currentlySimplified) return `Ottimo! Adesso clicca sul tasto verde 'Semplifica' per ridurre le frazioni ai minimi termini.`;
    
    const hasXOnRight = b.some(m => m.hasX && m.coeff !== 0);
    const hasConstOnLeft = a.some(m => !m.hasX && m.coeff !== 0);
    if (hasXOnRight) return `Sposta il termine con la ${variableLabel} a sinistra del simbolo di confronto.`;
    if (hasConstOnLeft) return "Sposta il termine noto a destra del simbolo di confronto.";
    
    const activeA = a.filter(m => m.coeff !== 0);
    const activeB = b.filter(m => m.coeff !== 0);
    
    if (activeA.length > 1) return `Somma i termini con la ${variableLabel} tra loro.`;
    if (activeB.length > 1) return "Somma i numeri tra loro.";
    if (activeA.length === 1 && activeA[0].hasX && (activeA[0].coeff !== 1 || activeA[0].den !== 1)) {
        return `Dividi entrambi i membri per ${activeA[0].coeff}.`;
    }
    return "L'espressione è quasi completata. Trova il valore finale.";
  }, [variableLabel, checkIsSolved]);

  useEffect(() => {
    if (isSolved) onComplete();
  }, [isSolved, onComplete]);

  const getEquationLatex = useCallback((a: Monomial[], b: Monomial[], opStr: string) => {
    const fmtSide = (list: Monomial[]) => {
      const visible = list.filter(m => m && m.coeff !== 0);
      if (visible.length === 0) return '0';
      return visible.map((m, i) => {
        const absCoeff = Math.abs(m.coeff);
        const sign = m.coeff < 0 ? '-' : (i > 0 ? '+' : '');
        let termStr = "";
        if (m.den === 1) {
          if (m.hasX) {
            if (absCoeff === 1) termStr = sign === '-' ? `-${variableLabel}` : (i > 0 ? `+${variableLabel}` : variableLabel);
            else termStr = (i > 0 && m.coeff > 0 ? '+' : '') + m.coeff + variableLabel;
          } else termStr = (i > 0 && m.coeff > 0 ? '+' : '') + m.coeff;
        } else {
          const fraction = `\\frac{${absCoeff}}{${m.den}}`;
          termStr = `${sign}${fraction}${m.hasX ? variableLabel : ''}`;
        }
        return termStr;
      }).join(' ').replace(/\+ -/g, '- ');
    };
    return `${fmtSide(a)} ${opStr} ${fmtSide(b)}`;
  }, [variableLabel]);

  const findCurrentSide = (id: string): 'A' | 'B' | null => {
    if (sideA.some(m => m.id === id)) return 'A';
    if (sideB.some(m => m.id === id)) return 'B';
    return null;
  };

  const performMove = (draggedId: string, toSide: 'A' | 'B', targetMonomialId: string | null = null) => {
    const fromSide = findCurrentSide(draggedId);
    if (!fromSide) return;

    const fromList = fromSide === 'A' ? sideA : sideB;
    const draggedItem = fromList.find(m => m.id === draggedId);
    if (!draggedItem || draggedItem.coeff === 0) return;

    if (fromSide !== toSide) {
      // TRASPORTO
      let newA = [...sideA];
      let newB = [...sideB];
      if (fromSide === 'A') {
        newA = newA.filter(m => m.id !== draggedId);
        const flipped = { ...draggedItem, coeff: -draggedItem.coeff, id: 'mon-' + Math.random() };
        if (newB.length === 1 && newB[0].coeff === 0) newB = [flipped]; else newB.push(flipped);
        setLastDroppedId(flipped.id);
      } else {
        newB = newB.filter(m => m.id !== draggedId);
        const flipped = { ...draggedItem, coeff: -draggedItem.coeff, id: 'mon-' + Math.random() };
        if (newA.length === 1 && newA[0].coeff === 0) newA = [flipped]; else newA.push(flipped);
        setLastDroppedId(flipped.id);
      }
      
      if (newA.length === 0) newA.push({ id: 'mon-z-a-' + Math.random(), coeff: 0, den: 1, hasX: false });
      if (newB.length === 0) newB.push({ id: 'mon-z-b-' + Math.random(), coeff: 0, den: 1, hasX: false });

      setSideA(newA);
      setSideB(newB);
      setLastActionType('transport');
      onStepComplete(getEquationLatex(newA, newB, operator), "Trasporto con cambio di segno.", generateNextGuidance(newA, newB, isSimplified));
    } else if (targetMonomialId && targetMonomialId !== draggedId) {
      // SOMMA
      const targetItem = fromList.find(m => m.id === targetMonomialId);
      if (targetItem && targetItem.hasX === draggedItem.hasX) {
        
        const commonDen = lcm(targetItem.den, draggedItem.den);
        const newCoeff = (targetItem.coeff * (commonDen / targetItem.den)) + (draggedItem.coeff * (commonDen / draggedItem.den));
        
        const updateList = (list: Monomial[]) => {
          let updated = list.filter(m => m.id !== draggedId);
          if (newCoeff === 0) {
              updated = updated.filter(m => m.id !== targetMonomialId);
              if (updated.length === 0) updated.push({ id: 'mon-z-' + Math.random(), coeff: 0, den: 1, hasX: false });
          } else {
              updated = updated.map(m => m.id === targetMonomialId ? { ...m, coeff: newCoeff, den: commonDen } : m);
          }
          return updated;
        };

        let newA = [...sideA], newB = [...sideB];
        if (toSide === 'A') newA = updateList(newA); else newB = updateList(newB);
        
        setSideA(newA); setSideB(newB);
        setLastDroppedId(newCoeff === 0 ? null : targetMonomialId);
        setLastActionType('sum');
        
        // Se il risultato è già un intero o ridotto all'osso, non forzare la semplificazione
        const isActuallySimplified = gcd(Math.abs(newCoeff), Math.abs(commonDen)) === 1;
        setIsSimplified(isActuallySimplified);
        
        onStepComplete(getEquationLatex(newA, newB, operator), "Somma algebrica eseguita.", generateNextGuidance(newA, newB, isActuallySimplified));
      }
    }
    setTimeout(() => { setLastDroppedId(null); setLastActionType(null); }, 1000);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggingId(id);
    setSelectedId(null);
  };

  const handleDrop = (e: React.DragEvent, toSide: 'A' | 'B') => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const targetElement = document.elementFromPoint(e.clientX, e.clientY)?.closest('.monomio-box');
    const targetId = targetElement?.getAttribute('data-id');
    setTargetSide(null);
    setDraggingId(null);
    performMove(draggedId, toSide, targetId);
  };

  const handleMonomialClick = (id: string, side: 'A' | 'B') => {
    if (selectedId === id) {
      setSelectedId(null);
    } else if (selectedId) {
      performMove(selectedId, side, id);
      setSelectedId(null);
    } else {
      setSelectedId(id);
    }
  };

  const handleSideClick = (side: 'A' | 'B') => {
    if (selectedId) {
      performMove(selectedId, side);
      setSelectedId(null);
    }
  };

  const renderTermContent = (m: Monomial) => {
    if (!m) return null;
    const absCoeff = Math.abs(m.coeff);
    if (m.coeff === 0) return <span className={`font-serif italic text-slate-500 ${compact ? 'text-4xl' : 'text-5xl'} pointer-events-none opacity-70`}>0</span>;
    if (m.den === 1) {
      const displayValue = m.hasX ? (absCoeff === 1 ? variableLabel : `${absCoeff}${variableLabel}`) : `${absCoeff}`;
      return <span className={`font-serif italic text-slate-900 ${compact ? 'text-4xl' : 'text-5xl'} pointer-events-none`}>{displayValue}</span>;
    }
    return (
      <span className="inline-flex items-center gap-1.5 pointer-events-none text-slate-900">
        <span className="inline-flex flex-col items-center leading-none">
          <span className={`border-b-2 border-slate-900 px-1 font-serif italic ${compact ? 'text-3xl' : 'text-4xl'} pb-0.5`}>{absCoeff}</span>
          <span className={`px-1 font-serif italic ${compact ? 'text-3xl' : 'text-4xl'} pt-0.5`}>{m.den}</span>
        </span>
        {m.hasX && <span className={`font-serif italic ${compact ? 'text-4xl' : 'text-5xl'} ml-0.5`}>{variableLabel}</span>}
      </span>
    );
  };

  const renderSide = (list: Monomial[], side: 'A' | 'B') => {
    const displayList = list.filter(m => m && m.coeff !== 0);
    const renderList = displayList.length > 0 ? displayList : (list.length > 0 ? [list[0]] : []);

    return (
      <div 
        className={`flex items-center gap-1 ${compact ? 'p-2 min-h-[80px]' : 'p-6 min-h-[160px]'} rounded-[1.5rem] transition-all duration-300 cursor-pointer ${
          targetSide === side || (selectedId && findCurrentSide(selectedId) !== side) ? 'bg-indigo-50/50 border-2 border-dashed border-indigo-200' : 'bg-transparent border-2 border-transparent'
        }`}
        onDragOver={(e) => { e.preventDefault(); if (targetSide !== side) setTargetSide(side); }}
        onDragEnter={(e) => { e.preventDefault(); setTargetSide(side); }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setTargetSide(null); }}
        onDrop={(e) => handleDrop(e, side)}
        onClick={() => handleSideClick(side)}
      >
        {renderList.map((m, i) => {
          if (!m) return null;
          return (
            <React.Fragment key={m.id}>
              {i > 0 && <span className={`${compact ? 'text-3xl' : 'text-4xl'} font-serif italic text-gray-400 mx-1 select-none`}>{m.coeff >= 0 ? '+' : '-'}</span>}
              {i === 0 && m.coeff < 0 && <span className={`${compact ? 'text-3xl' : 'text-4xl'} font-serif italic text-gray-400 mr-0.5 select-none`}>-</span>}
              <div
                draggable={m.coeff !== 0}
                data-id={m.id}
                onDragStart={(e) => handleDragStart(e, m.id)}
                onClick={(e) => { e.stopPropagation(); handleMonomialClick(m.id, side); }}
                className={`monomio-box touch-none relative group ${compact ? 'px-3 py-2 rounded-lg' : 'px-6 py-4 rounded-2xl'} ${m.coeff !== 0 ? 'cursor-grab active:cursor-grabbing hover:bg-slate-50' : 'cursor-default'} transition-all flex items-center justify-center border-2 ${
                    lastDroppedId === m.id 
                      ? (lastActionType === 'sum' ? 'bg-math-sum scale-105 shadow-md ring-2 ring-orange-200' : 'bg-math-transport scale-105 shadow-md ring-2 ring-yellow-200')
                      : selectedId === m.id ? 'bg-indigo-50 ring-4 ring-indigo-400 shadow-xl border-indigo-200 scale-105 animate-pulse' : 'bg-white border-slate-100'} ${draggingId === m.id ? 'opacity-50 ring-2 ring-indigo-400 border-dashed scale-95 shadow-none' : 'opacity-100 shadow-sm'}`}
              >
                {renderTermContent(m)}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${compact ? '' : 'mt-4'}`}>
      {!compact && !isSolved && (
         <div className="text-center">
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest animate-pulse">
                👆 Trascina i termini per spostarli o uniscili per sommarli
            </p>
         </div>
      )}
      <div className={`bg-slate-50/50 ${compact ? 'p-2 rounded-2xl' : 'p-8 rounded-[3rem]'} border-2 border-dashed border-slate-100 flex flex-col items-center justify-center`}>
        <div className="flex items-center justify-center gap-2 w-full overflow-x-auto no-scrollbar">
          {renderSide(sideA, 'A')}
          <span className={`${compact ? 'text-4xl' : 'text-7xl'} font-serif italic text-slate-500 px-2 select-none`}>{operator}</span>
          {renderSide(sideB, 'B')}
        </div>
      </div>
      
      {!isSolved && (
        <div className="flex justify-center gap-4">
          <button onClick={() => setShowKInput('mul')} className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black transition-all shadow-sm border active:scale-95 group ${showKInput === 'mul' ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100'}`}>
            <span className="text-2xl font-serif">×</span> 
            <span className="text-xl italic font-serif lowercase tracking-tighter">k</span>
          </button>
          <button onClick={() => setShowKInput('div')} className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black transition-all shadow-sm border active:scale-95 group ${showKInput === 'div' ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100'}`}>
            <span className="text-2xl font-serif">÷</span> 
            <span className="text-xl italic font-serif lowercase tracking-tighter">k</span>
          </button>
          {!isSimplified && <button onClick={() => { 
            const simplify = (list: Monomial[]) => list.map(m => {
              if (!m || m.coeff === 0) return m;
              const common = gcd(Math.abs(m.coeff), Math.abs(m.den));
              return { ...m, coeff: m.coeff / common, den: m.den / common };
            });
            const na = simplify(sideA), nb = simplify(sideB);
            setSideA(na); setSideB(nb); setIsSimplified(true);
            onStepComplete(getEquationLatex(na, nb, operator), "Semplificazione frazioni.", generateNextGuidance(na, nb, true));
          }} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg animate-pulse shadow-lg border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1">Semplifica</button>}
        </div>
      )}
      
      {showKInput && (
        <div className="flex flex-col items-center gap-8 p-8 bg-slate-900 rounded-[2.5rem] text-white animate-slide-in shadow-2xl border-t-4 border-indigo-500">
          <div className="flex flex-col items-center gap-4 w-full">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Seleziona il valore di k</span>
            <div className="flex flex-wrap justify-center gap-3">
               {kOptions.map(val => (
                 <button 
                  key={val} 
                  onClick={() => setKValue(val)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black font-serif italic transition-all border-2 ${
                    kValue === val 
                    ? 'bg-indigo-600 border-white scale-110 shadow-[0_0_15px_rgba(99,102,241,0.6)]' 
                    : 'bg-slate-800 border-slate-700 hover:border-indigo-400'
                  } ${val < 0 ? 'text-rose-400' : 'text-indigo-300'}`}
                 >
                   {val}
                 </button>
               ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6 w-full">
            <div className="flex-grow h-px bg-slate-800"></div>
            <button onClick={() => {
                const k = kValue; if (!k || k === 0) return;
                let newOp = operator; if (k < 0) {
                  if (operator === ">") newOp = "<"; else if (operator === "<") newOp = ">";
                  else if (operator === "≥") newOp = "≤"; else if (operator === "≤") newOp = "≥";
                }
                const transform = (list: Monomial[]) => list.map(m => (!m ? m : (showKInput === 'mul' ? { ...m, coeff: m.coeff * k } : { ...m, den: m.den * k })));
                const na = transform(sideA), nb = transform(sideB);
                setSideA(na); setSideB(nb); setOperator(newOp);
                const nextIsSimplified = showKInput === 'mul' ? isSimplified : false;
                if (showKInput === 'div') setIsSimplified(false);
                onStepComplete(getEquationLatex(na, nb, newOp), `Operazione di ${showKInput === 'mul' ? 'moltiplicazione' : 'divisione'} per ${k}${k < 0 ? '. Il verso cambia!' : ''}`, generateNextGuidance(na, nb, nextIsSimplified));
                setShowKInput(null);
              }} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all shadow-lg active:scale-95 flex items-center gap-3">
                ESEGUI {showKInput === 'mul' ? '×' : '÷'} {kValue}
              </button>
            <div className="flex-grow h-px bg-slate-800"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggableSolver;

