
import { ProblemType, MathProblem, Step, Difficulty, InequalitySolution, Monomial } from '../types';

/**
 * Calcola il massimo comun divisore
 */
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;

/**
 * Formatta un numero come frazione semplificata (stringa)
 */
export const formatFraction = (num: number, den: number): string => {
  if (den === 0) return "NaN";
  if (num === 0) return "0";
  const common = Math.abs(gcd(num, den));
  let n = num / common;
  let d = den / common;
  
  // Normalizza il segno sul numeratore
  if (d < 0) {
    n = -n;
    d = -d;
  }
  
  return d === 1 ? n.toString() : `${n}/${d}`;
};

/**
 * Formatta un'espressione algebrica in modo naturale (es: 1x + 0 -> x, 0x - 5 -> -5, -1x + 2 -> -x + 2)
 */
export const formatPoly = (coeffX: number, constant: number): string => {
  if (coeffX === 0 && constant === 0) return '0';
  
  // Gestione termine x
  let xPart = '';
  if (coeffX !== 0) {
    if (coeffX === 1) xPart = 'x';
    else if (coeffX === -1) xPart = '-x';
    else xPart = `${coeffX}x`;
  }

  // Se non c'è x, restituisci solo la costante
  if (coeffX === 0) return constant.toString();
  
  // Se c'è x ma la costante è 0, restituisci solo xPart
  if (constant === 0) return xPart;
  
  // Se ci sono entrambi
  const sign = constant > 0 ? ' + ' : ' - ';
  const constPart = Math.abs(constant);
  
  return `${xPart}${sign}${constPart}`;
};

/**
 * Valuta un'espressione matematica (es. "ms = -1/2") e ne restituisce il valore numerico.
 * Gestisce prefissi comuni come y=, m=, ms=, m_s=, ecc.
 */
export const evaluateMathExpression = (expr: string): number | null => {
  try {
    const clean = expr
      .replace(/^[a-z_0-9]*\s*[=<>≤≥]\s*/i, '') // Rimuove prefissi come "y =", "m_s =", "ms =", ecc.
      .replace(/\s+/g, '')
      .replace(/−/g, '-')
      .replace(/×/g, '*')
      .replace(/:/g, '/')
      .replace(/\[/g, '(')
      .replace(/\]/g, ')');
    
    // Controlla se contiene solo caratteri validi per una valutazione numerica
    if (!/^[0-9+\-*/().]+$/.test(clean)) return null;
    
    // Sicurezza: limitiamo la valutazione a espressioni matematiche semplici
    const result = new Function(`return ${clean}`)();
    return typeof result === 'number' && !isNaN(result) ? result : null;
  } catch {
    return null;
  }
};

export const generateProblem = (type: ProblemType, difficulty: Difficulty = Difficulty.EASY): MathProblem => {
  const id = Math.random().toString(36).substr(2, 9);
  
  switch (type) {
    case ProblemType.QUADRATIC_EQUATION:
      return { id, type, difficulty, title: 'Equazioni di secondo grado', operator: '=', steps: [], finalResult: '', metadata: {} };
    case ProblemType.EQUATION: {
      let a, b, c, d, xSol;
      if (difficulty === Difficulty.EASY) {
        a = 1; c = 0;
        xSol = Math.floor(Math.random() * 8) + 1;
        b = Math.floor(Math.random() * 8) + 1;
        d = xSol + b;
      } else if (difficulty === Difficulty.MEDIUM) {
        a = Math.floor(Math.random() * 4) + 2; 
        c = 1;
        xSol = Math.floor(Math.random() * 6) + 1;
        b = Math.floor(Math.random() * 10) + 2;
        d = (a - c) * xSol + b;
      } else {
        a = Math.floor(Math.random() * 5) + 5; 
        c = Math.floor(Math.random() * 3) + 2; 
        xSol = Math.floor(Math.random() * 10) - 5; 
        if (xSol === 0) xSol = 3;
        b = Math.floor(Math.random() * 15) + 5;
        d = (a - c) * xSol + b;
      }
      return {
        id, type, difficulty,
        title: difficulty === Difficulty.EASY ? "Equazione Semplice" : difficulty === Difficulty.MEDIUM ? "Equazione Standard" : "Equazione Complessa",
        operator: "=",
        finalResult: `x = ${xSol}`,
        metadata: { a, b, c, d, xSol },
        steps: [
          { id: 0, latex: `${formatPoly(a, b)} = ${formatPoly(c, d)}`, description: "Sposta i termini per isolare la x.", expectedInput: `${formatPoly(a - c, 0)} = ${d - b}`, hint: "Porta le x a sinistra e i numeri a destra." },
          { id: 1, latex: `${formatPoly(a - c, 0)} = ${d - b}`, description: "Calcola il valore finale di x.", expectedInput: `x = ${xSol}`, hint: "Dividi per il numero davanti alla x." }
        ]
      };
    }

    case ProblemType.INEQUALITY: {
      let iA = difficulty === Difficulty.EASY ? 1 : Math.floor(Math.random() * 3) + 2;
      let iB = Math.floor(Math.random() * 8) + 2;
      let iXSolNum = Math.floor(Math.random() * 10) + 1;
      let iXSolDen = iA; 
      
      // Semplifichiamo per iC intero
      let iC = iXSolNum + iB;
      const op = Math.random() > 0.5 ? ">" : "<";
      
      const finalValNum = iC - iB;
      const finalValDen = iA;
      const finalValStr = formatFraction(finalValNum, finalValDen);
      
      return {
        id, type, difficulty,
        title: "Disequazione",
        operator: op,
        finalResult: `x ${op} ${finalValStr}`,
        metadata: { a: iA, b: iB, c: iC, op, solutions: [{ val: finalValNum / finalValDen, op }] },
        steps: [
          { id: 0, latex: `${formatPoly(iA, iB)} ${op} ${iC}`, description: "Isola il termine con la x spostando il numero a destra.", expectedInput: `${formatPoly(iA, 0)} ${op} ${iC - iB}`, hint: `Sposta ${iB} a destra e cambia il suo segno.` },
          { id: 1, latex: `${formatPoly(iA, 0)} ${op} ${iC - iB}`, description: "Risolvi dividendo per il coefficiente di x.", expectedInput: `x ${op} ${finalValStr}`, hint: `Dividi entrambi i membri per ${iA}.` }
        ]
      };
    }

    case ProblemType.SYSTEM: {
      const x = Math.floor(Math.random() * 5) - 2;
      const y = Math.floor(Math.random() * 5) - 2;
      const m1 = Math.floor(Math.random() * 3) + 1;
      let m2 = m1 + (Math.random() > 0.5 ? 1 : -1);
      if (m2 === 0) m2 = m1 + 2;
      const q1 = y - m1 * x;
      const q2 = y - m2 * x;
      return {
        id, type, difficulty,
        title: "Sistema di Equazioni",
        operator: "{",
        finalResult: `x=${x}, y=${y}`,
        metadata: { m1, q1, m2, q2, x, y },
        steps: [{ id: 0, latex: `\\begin{cases} y = ${formatPoly(m1, q1)} \\\\ y = ${formatPoly(m2, q2)} \\end{cases}`, description: "Usa il metodo del confronto: eguaglia le due espressioni.", expectedInput: `${formatPoly(m1, q1)} = ${formatPoly(m2, q2)}`, hint: "Eguaglia ciò a cui y è uguale in entrambe le equazioni." }]
      };
    }

    case ProblemType.PERPENDICULAR_LINES: {
      const m_r = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
      const q_r = Math.floor(Math.random() * 5) - 2;
      const x_p = Math.floor(Math.random() * 4) - 2;
      const y_p = Math.floor(Math.random() * 5) - 2;
      
      const m_s_num = -1;
      const m_s_den = m_r;
      const m_s_str = formatFraction(m_s_num, m_s_den);
      
      const q_s_num = y_p * m_r + x_p;
      const q_s_den = m_r;
      const q_s_str = formatFraction(q_s_num, q_s_den);
      
      const q_s_val = q_s_num / q_s_den;
      const sign = q_s_val >= 0 ? '+' : '';
      const m_part = m_s_str === '1' ? '' : (m_s_str === '-1' ? '-' : m_s_str);
      
      const finalResultStr = `y = ${m_part}x ${sign} ${q_s_str}`.replace(/\s+/g, ' ').replace(/\s([+-])\s0$/, '');

      return {
        id, type, difficulty,
        title: "Rette Perpendicolari",
        operator: "⊥",
        finalResult: finalResultStr,
        metadata: { m_r, q_r, x_p, y_p, m_s: -1 / m_r, q_s: q_s_val },
        steps: [
            { id: 0, latex: `r: y = ${formatPoly(m_r, q_r)}`, description: "Trova il coefficiente angolare m' della retta s perpendicolare a r.", expectedInput: `m=${m_s_str}`, hint: "Il coefficiente di una perpendicolare è l'antireciproco: -1/m." }
        ]
      };
    }

    case ProblemType.PERP_POINT_SLOPE: {
        // Vogliamo y = m_r x + q_r
        const m_r = Math.floor(Math.random() * 3) + 1;
        const q_r = Math.floor(Math.random() * 4) - 2;
        const x_p = Math.floor(Math.random() * 4) - 2;
        const y_p = Math.floor(Math.random() * 4) - 2;

        // Generiamo un'equazione "più lunga" che semplifica a y = m_r x + q_r
        // y + A1x + B1 = A2x + B2
        // y = (A2 - A1)x + (B2 - B1)
        const A1 = Math.floor(Math.random() * 3) + 1;
        const A2 = m_r + A1;
        const B1 = Math.floor(Math.random() * 3) + 1;
        const B2 = q_r + B1;

        const sideA: Monomial[] = [
            { id: 'mon-y', coeff: 1, den: 1, hasX: true }, 
            { id: 'mon-a1x', coeff: A1, den: 1, hasX: true }, 
            { id: 'mon-b1', coeff: B1, den: 1, hasX: false }
        ];
        const sideB: Monomial[] = [
            { id: 'mon-a2x', coeff: A2, den: 1, hasX: true },
            { id: 'mon-b2', coeff: B2, den: 1, hasX: false }
        ];

        // Stringa per visualizzazione statica
        const rawImplicit = `${formatPoly(A1, B1).replace(/^/, 'y + ')} = ${formatPoly(A2, B2)}`;
        
        const m_s_num = -1;
        const m_s_den = m_r;
        const m_s_str = formatFraction(m_s_num, m_s_den);
        
        const q_s_num = y_p * m_r + x_p;
        const q_s_den = m_r;
        const q_s_str = formatFraction(q_s_num, q_s_den);
        const q_s_val = q_s_num / q_s_den;

        return {
            id, type, difficulty,
            title: "Retta Perpendicolare per un Punto",
            operator: "y-y₀",
            finalResult: `y = ${m_s_str}x ${q_s_val >= 0 ? '+' : ''} ${q_s_str}`,
            metadata: { 
                m_r, q_r, x_p, y_p, m_s_str, q_s_str, q_s_val, rawImplicit,
                sideA, sideB, A1, A2, B1, B2
            },
            steps: [{ id: 0, latex: rawImplicit, description: "Esplicita la retta r per trovare m.", expectedInput: `y=${formatPoly(m_r, q_r)}`, hint: "Isola la y portando gli altri termini a destra e sommandoli." }]
        };
    }

    case ProblemType.INEQUALITY_SYSTEM: {
      // Disequazione 1: a1*x + b1 > c1
      // Assicuriamo a > 1 o b != 0 per non renderla banale
      const v1 = Math.floor(Math.random() * 4) + 1; // Soluzione ~ [1..4]
      const a1 = Math.floor(Math.random() * 3) + 2; // Coeff x in [2..4]
      const b1 = Math.floor(Math.random() * 6) + 1; // Costante in [1..6]
      const c1 = a1 * v1 + b1;
      
      const v2 = v1 + Math.floor(Math.random() * 3) + 2; // v2 > v1
      const a2 = Math.floor(Math.random() * 3) + 2;
      const b2 = Math.floor(Math.random() * 6) + 1;
      const c2 = a2 * v2 + b2;

      return {
        id, type, difficulty,
        title: "Sistema di Disequazioni",
        operator: "{",
        finalResult: `${v1} < x < ${v2}`,
        metadata: { 
            a1, b1, c1, op1: ">", 
            a2, b2, c2, op2: "<", 
            sol1: { val: v1, op: ">" }, 
            sol2: { val: v2, op: "<" }, 
            solutions: [{ val: v1, op: ">" }, { val: v2, op: "<" }] 
        },
        steps: [{ id: 0, latex: `\\begin{cases} ${formatPoly(a1, b1)} > ${c1} \\\\ ${formatPoly(a2, b2)} < ${c2} \\end{cases}`, description: "Risolvi le due disequazioni separatamente.", expectedInput: `${v1}<x<${v2}`, hint: "Trova x per entrambe." }]
      };
    }

    case ProblemType.LINE_EQUATION: {
      const m = Math.floor(Math.random() * 3) + 1;
      const q = Math.floor(Math.random() * 4) + 1;
      return {
        id, type, difficulty,
        title: "Punti della Retta",
        operator: "=",
        finalResult: `y = ${formatPoly(m, q)}`,
        metadata: { m, q },
        steps: [{ id: 0, latex: `y = ${formatPoly(m, q)}`, description: "Scegli un valore per x e calcola la corrispondente y.", expectedInput: "y=mx+q", hint: "Sostituisci il numero scelto al posto della x nell'equazione." }]
      };
    }

    case ProblemType.PARALLEL_LINES: {
      const m1 = Math.floor(Math.random() * 3) + 1;
      const q1 = Math.floor(Math.random() * 5) + 1;
      const isParallel = Math.random() > 0.5;
      const m2 = isParallel ? m1 : m1 + 1;
      const q2 = q1 + 2;
      return {
        id, type, difficulty,
        title: "Rette Parallele",
        operator: "||",
        finalResult: isParallel ? "Sì" : "No",
        metadata: { m1, q1, m2, q2, isParallel, line2Raw: `${-m2}x + y - ${q2} = 0` },
        steps: [{ id: 0, latex: `r_1: y = ${formatPoly(m1, q1)}`, description: "Controlla se i coefficienti angolari sono uguali.", expectedInput: isParallel ? "Sì" : "No", hint: "Due rette sono parallele se hanno lo stesso valore di 'm'." }]
      };
    }

    case ProblemType.LINE_TWO_POINTS: {
      let xa, ya, xb, yb, m_num, m_den, m_val, q_val;
      
      do {
        xa = Math.floor(Math.random() * 9) - 4;
        xb = Math.floor(Math.random() * 9) - 4;
      } while (xa === xb);

      ya = Math.floor(Math.random() * 9) - 4;
      yb = Math.floor(Math.random() * 9) - 4;

      m_num = yb - ya;
      m_den = xb - xa;
      
      const m_gcd = Math.abs(gcd(m_num, m_den));
      m_num /= m_gcd;
      m_den /= m_gcd;
      if (m_den < 0) {
        m_num = -m_num;
        m_den = -m_den;
      }
      
      const m_str = formatFraction(m_num, m_den);
      m_val = m_num / m_den;
      
      let q_num = ya * m_den - m_num * xa;
      let q_den = m_den;
      const q_gcd = Math.abs(gcd(q_num, q_den));
      q_num /= q_gcd;
      q_den /= q_gcd;
      if (q_den < 0) {
        q_num = -q_num;
        q_den = -q_den;
      }
      
      const q_str = formatFraction(q_num, q_den);
      q_val = q_num / q_den;
      
      const sign = q_val >= 0 ? '+' : '';
      const m_part = m_str === '1' ? '' : (m_str === '-1' ? '-' : m_str);
      const finalResultStr = `y = ${m_part}x ${sign} ${q_str}`.replace(/\s+/g, ' ').replace(/\s([+-])\s0$/, '');

      return {
        id, type, difficulty,
        title: "Retta per Due Punti",
        operator: "A,B",
        finalResult: finalResultStr,
        metadata: { xa, ya, xb, yb, m_str, q_str, m_val, q_val },
        steps: [
          { id: 0, latex: `A(${xa}, ${ya}), B(${xb}, ${yb})`, description: "Calcola il coefficiente angolare m = (y_B - y_A) / (x_B - x_A).", expectedInput: `m=${m_str}`, hint: "Sostituisci le coordinate dei punti nella formula di m." }
        ]
      };
    }

    case ProblemType.LINE_EXPLORER:
      return {
        id, type, difficulty,
        title: "Esploratore Retta",
        operator: "📏",
        finalResult: "Explorer",
        steps: [{ id: 0, latex: "y = mx + q", description: "Muovi gli slider e osserva come cambiano pendenza e intercetta.", expectedInput: "", hint: "" }]
      };

    case ProblemType.FRACTIONAL_INEQUALITY:
    case ProblemType.FRACTIONAL_INEQUALITY_CLASSIC: {
      // N(x) = a1*x + b1
      // D(x) = a2*x + b2
      // (a1*x + b1) / (a2*x + b2) > 0 (or < 0)
      
      const a1 = Math.floor(Math.random() * 3) + 1;
      const b1 = (Math.floor(Math.random() * 10) - 5) * a1; // Ensure integer root for simplicity
      const a2 = Math.floor(Math.random() * 3) + 1;
      const b2 = (Math.floor(Math.random() * 10) - 5) * a2;
      
      // Avoid same root
      let root1 = -b1 / a1;
      let root2 = -b2 / a2;
      if (root1 === root2) {
        root2 += 1;
      }

      const op = Math.random() > 0.5 ? ">" : "<";
      const latex = `\\frac{${formatPoly(a1, b1)}}{${formatPoly(a2, b2)}} ${op} 0`;

      return {
        id, type, difficulty,
        title: type === ProblemType.FRACTIONAL_INEQUALITY ? "Disequazione Fratta (Visual)" : "Disequazione Fratta (Classic)",
        operator: op,
        finalResult: "Soluzione",
        metadata: { a1, b1, a2, b2, op, root1, root2 },
        steps: [{ id: 0, latex, description: "Studia separatamente il segno di numeratore e denominatore.", expectedInput: "", hint: "Trova dove N(x)=0 e D(x)=0" }]
      };
    }

    case ProblemType.FRACTIONAL_EQUATION: {
      const a1 = Math.floor(Math.random() * 3) + 1;
      const b1 = (Math.floor(Math.random() * 10) - 5) * a1; 
      const a2 = Math.floor(Math.random() * 3) + 1;
      const b2 = (Math.floor(Math.random() * 10) - 5) * a2;
      
      let root1 = -b1 / a1;
      let root2 = -b2 / a2;
      if (root1 === root2) {
        root2 += 1;
      }

      const latex = `\\frac{${formatPoly(a1, b1)}}{${formatPoly(a2, b2)}} = 0`;

      return {
        id, type, difficulty,
        title: "Equazione Fratta",
        operator: "=",
        finalResult: `x = ${formatFraction(-b1, a1)}`,
        metadata: { a1, b1, a2, b2, root1, root2 },
        steps: [{ id: 0, latex, description: "Risolvi l'equazione fratta.", expectedInput: "", hint: "Poni il numeratore uguale a zero e il denominatore diverso da zero." }]
      };
    }

    default:
      return {
        id, type, difficulty,
        title: "Problema Matematico",
        operator: "=",
        finalResult: "42",
        steps: [{ id: 0, latex: "x = 42", description: "Completa l'esercizio.", expectedInput: "x=42", hint: "Scrivi x=42" }]
      };
  }
};

export const normalizeMathString = (str: string): string => {
  return str
    .replace(/\s+/g, '')
    .toLowerCase()
    .replace(/−/g, '-')
    .replace(/×/g, '*')
    .replace(/\+-/g, '-')
    .replace(/-\+/g, '-')
    .replace(/--/g, '+')
    .replace(/(^|[-+*/=<>(])1x/g, '$1x')
    .replace(/(^|[-+*/=<>(])1y/g, '$1y')
    .replace(/([=<>({,])\+/g, '$1')
    .replace(/^\+/, '');
};

/**
 * Validates a single step of an inequality solution.
 */
export const validateIneqStep = (input: string, params: { a: number, b: number, c: number, op: string }): { isValid: boolean, isFinal: boolean } => {
  const normalized = normalizeMathString(input);
  const { a, b, c, op } = params;
  
  const valNum = c - b;
  const valDen = a;
  const valStr = formatFraction(valNum, valDen);

  if (normalized === normalizeMathString(`x${op}${valStr}`)) return { isValid: true, isFinal: true };
  if (normalized === normalizeMathString(`${a}x${op}${valNum}`)) return { isValid: true, isFinal: false };
  return { isValid: false, isFinal: false };
};

