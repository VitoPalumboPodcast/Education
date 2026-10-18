
import React, { useEffect, useRef } from 'react';
import { InequalitySolution } from '../types';

interface InequalityGraphProps {
  solutions: InequalitySolution[];
}

const InequalityGraph: React.FC<InequalityGraphProps> = ({ solutions }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and Setup
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const margin = 50;
    const axisY = h / 2;
    const minVal = -2;
    const maxVal = 10;
    const range = maxVal - minVal;

    const toX = (val: number) => margin + ((val - minVal) / range) * (w - 2 * margin);

    // Draw Main Axis
    ctx.beginPath();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.moveTo(margin / 2, axisY);
    ctx.lineTo(w - margin / 2, axisY);
    ctx.stroke();

    // Draw Ticks
    for (let i = minVal; i <= maxVal; i++) {
      const x = toX(i);
      ctx.beginPath();
      ctx.moveTo(x, axisY - 5);
      ctx.lineTo(x, axisY + 5);
      ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(i.toString(), x, axisY + 20);
    }

    // Determine intersection interval
    let low = -Infinity;
    let high = Infinity;
    let lowInc = false;
    let highInc = false;

    solutions.forEach(sol => {
      if (sol.op.includes('>')) {
        if (sol.val > low) {
          low = sol.val;
          lowInc = sol.op.includes('=');
        }
      } else if (sol.op.includes('<')) {
        if (sol.val < high) {
          high = sol.val;
          highInc = sol.op.includes('=');
        }
      }
    });

    const drawLine = (x1: number, x2: number, isSolution: boolean) => {
      ctx.beginPath();
      ctx.lineWidth = 6;
      if (isSolution) {
        ctx.strokeStyle = '#10b981'; // Green
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = '#e2e8f0'; // Gray Dashed
        ctx.setLineDash([5, 5]);
      }
      ctx.moveTo(x1, axisY - 10);
      ctx.lineTo(x2, axisY - 10);
      ctx.stroke();
    };

    // Draw Intervals
    const startX = toX(minVal);
    const endX = toX(maxVal);
    const lowX = low === -Infinity ? startX : toX(low);
    const highX = high === Infinity ? endX : toX(high);

    if (low > high) {
      // Empty set
      drawLine(startX, endX, false);
    } else {
      drawLine(startX, lowX, false);
      drawLine(lowX, highX, true);
      drawLine(highX, endX, false);
    }

    // Draw Points
    const drawPoint = (val: number, isIncluded: boolean) => {
      if (val === -Infinity || val === Infinity) return;
      const x = toX(val);
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(x, axisY - 10, 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      if (isIncluded) {
        ctx.fillStyle = '#10b981';
        ctx.fill();
      } else {
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();
      }
    };

    drawPoint(low, lowInc);
    drawPoint(high, highInc);

  }, [solutions]);

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-inner flex flex-col items-center">
      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Rappresentazione Grafica Soluzioni</h5>
      <canvas ref={canvasRef} width={600} height={150} className="w-full h-auto max-w-full"></canvas>
      <div className="mt-4 flex gap-6 text-[10px] font-black uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-emerald-500 rounded-full"></div>
          <span className="text-emerald-600">Soddisfatto</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 border-t-2 border-dashed border-slate-300"></div>
          <span className="text-slate-400">Non Soddisfatto</span>
        </div>
      </div>
    </div>
  );
};

export default InequalityGraph;

