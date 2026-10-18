
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chart, registerables, Plugin } from 'chart.js';

Chart.register(...registerables);

const InteractiveLine: React.FC = () => {
  const [x1, setX1] = useState<number>(-2);
  const [y1, setY1] = useState<number>(1);
  const [x2, setX2] = useState<number>(3);
  const [y2, setY2] = useState<number>(3);
  const [m, setM] = useState<number>(0.4);
  const [q, setQ] = useState<number>(1.8);

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));
  const formatNum = (num: number) => Math.round(num * 100) / 100;

  // Sync points to M/Q
  const updateMQFromPoints = useCallback((nx1: number, ny1: number, nx2: number, ny2: number) => {
    if (nx1 === nx2) return;
    const nm = (ny2 - ny1) / (nx2 - nx1);
    const nq = ny1 - nm * nx1;
    setM(nm);
    setQ(nq);
  }, []);

  // Sync M/Q to points (preserve x, change y)
  const updatePointsFromMQ = useCallback((nm: number, nq: number) => {
    const ny1 = nm * x1 + nq;
    const ny2 = nm * x2 + nq;
    setY1(ny1);
    setY2(ny2);
  }, [x1, x2]);

  const cartesianPlugin: Plugin = {
    id: 'cartesianExplorerPlugin',
    afterDatasetsDraw: (chart) => {
      const { ctx, scales: { x, y } } = chart;
      const xZero = x.getPixelForValue(0);
      const yZero = y.getPixelForValue(0);

      ctx.save();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      
      // Axes
      ctx.beginPath();
      ctx.moveTo(x.left, yZero); ctx.lineTo(x.right, yZero);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(xZero, y.bottom); ctx.lineTo(xZero, y.top);
      ctx.stroke();

      // Frecce
      const arrowSize = 8;
      ctx.fillStyle = '#000000';
      ctx.beginPath(); ctx.moveTo(x.right, yZero); ctx.lineTo(x.right - arrowSize, yZero - arrowSize/2); ctx.lineTo(x.right - arrowSize, yZero + arrowSize/2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(xZero, y.top); ctx.lineTo(xZero - arrowSize/2, y.top + arrowSize); ctx.lineTo(xZero + arrowSize/2, y.top + arrowSize); ctx.fill();

      // Labels
      ctx.font = 'bold 16px Inter';
      ctx.fillText('X', x.right - 20, yZero + 30);
      ctx.fillText('Y', xZero - 30, y.top + 20);

      // Projections for A and B
      const drawProjection = (px: number, py: number, color: string, label: string) => {
        const xPix = x.getPixelForValue(px);
        const yPix = y.getPixelForValue(py);
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = color;
        ctx.moveTo(xPix, yPix); ctx.lineTo(xPix, yZero);
        ctx.moveTo(xPix, yPix); ctx.lineTo(xZero, yPix);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = color;
        ctx.font = 'bold 14px Inter';
        ctx.fillText(label, xPix + 5, yPix - 10);
      };

      drawProjection(x1, y1, '#16a34a', 'A');
      drawProjection(x2, y2, '#f97316', 'B');

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
              { label: 'Retta', data: [{ x: -10, y: m * -10 + q }, { x: 10, y: m * 10 + q }], borderColor: '#ef4444', borderWidth: 3, pointRadius: 0, fill: false },
              { label: 'A', data: [{ x: x1, y: y1 }], backgroundColor: '#16a34a', pointRadius: 7 },
              { label: 'B', data: [{ x: x2, y: y2 }], backgroundColor: '#f97316', pointRadius: 7 },
              { label: 'I', data: [{ x: 0, y: q }], backgroundColor: '#7c3aed', pointRadius: 5 },
              { label: 'J', data: m !== 0 ? [{ x: -q/m, y: 0 }] : [], backgroundColor: '#0ea5e9', pointRadius: 5 }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { type: 'linear', min: -10, max: 10, ticks: { stepSize: 1, color: '#94a3b8' }, grid: { color: '#f1f5f9' } },
              y: { type: 'linear', min: -10, max: 10, ticks: { stepSize: 1, color: '#94a3b8' }, grid: { color: '#f1f5f9' } }
            },
            plugins: { legend: { display: false } }
          },
          plugins: [cartesianPlugin]
        });
      }
    }
    return () => chartInstance.current?.destroy();
  }, [x1, y1, x2, y2, m, q]);

  const handlePointChange = (setter: Function, val: number, point: 'x1'|'y1'|'x2'|'y2') => {
    let nx1 = x1, ny1 = y1, nx2 = x2, ny2 = y2;
    if (point === 'x1') nx1 = val;
    else if (point === 'y1') ny1 = val;
    else if (point === 'x2') nx2 = val;
    else if (point === 'y2') ny2 = val;
    
    setter(val);
    updateMQFromPoints(nx1, ny1, nx2, ny2);
  };

  const handleMQChange = (setter: Function, val: number, isM: boolean) => {
    setter(val);
    if (isM) updatePointsFromMQ(val, q);
    else updatePointsFromMQ(m, val);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-slide-in">
      {/* Colonna controlli */}
      <div className="xl:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">1. Punti A e B</h3>
          <div className="grid grid-cols-3 gap-2 text-center items-center font-black text-[10px] text-slate-400 uppercase tracking-widest mb-2">
            <div></div><div>X</div><div>Y</div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
              <span className="font-black text-emerald-600 text-lg w-6">A</span>
              <input type="number" value={formatNum(x1)} onChange={(e) => handlePointChange(setX1, Number(e.target.value), 'x1')} className="w-full bg-white border border-emerald-200 rounded-xl p-2 text-center font-serif italic text-lg shadow-sm" />
              <input type="number" value={formatNum(y1)} onChange={(e) => handlePointChange(setY1, Number(e.target.value), 'y1')} className="w-full bg-white border border-emerald-200 rounded-xl p-2 text-center font-serif italic text-lg shadow-sm" />
            </div>
            <div className="flex items-center gap-4 bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
              <span className="font-black text-orange-600 text-lg w-6">B</span>
              <input type="number" value={formatNum(x2)} onChange={(e) => handlePointChange(setX2, Number(e.target.value), 'x2')} className="w-full bg-white border border-orange-200 rounded-xl p-2 text-center font-serif italic text-lg shadow-sm" />
              <input type="number" value={formatNum(y2)} onChange={(e) => handlePointChange(setY2, Number(e.target.value), 'y2')} className="w-full bg-white border border-orange-200 rounded-xl p-2 text-center font-serif italic text-lg shadow-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">2. Equazione y = m·x + q</h3>
          <div className="text-center p-6 bg-slate-900 rounded-[2rem] text-white shadow-2xl border-b-4 border-indigo-600 mb-6">
            <div className="text-4xl font-serif italic">
              y = {formatNum(m)}x {q >= 0 ? '+' : '-'} {Math.abs(formatNum(q))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span>Pendenza (m)</span> <span>{formatNum(m)}</span></div>
              <input type="range" min="-5" max="5" step="0.1" value={m} onChange={(e) => handleMQChange(setM, Number(e.target.value), true)} className="w-full accent-indigo-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span>Intercetta (q)</span> <span>{formatNum(q)}</span></div>
              <input type="range" min="-10" max="10" step="0.1" value={q} onChange={(e) => handleMQChange(setQ, Number(e.target.value), false)} className="w-full accent-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">3. Esplora Punti</h3>
          <div className="space-y-4">
            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">Intercetta Asse Y (I)</span>
                <div className="flex justify-between items-center font-serif italic text-xl">
                    <span>I (0, q)</span>
                    <span className="text-indigo-600 font-bold">(0, {formatNum(q)})</span>
                </div>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2 block">Intercetta Asse X (J)</span>
                <div className="flex justify-between items-center font-serif italic text-xl">
                    <span>J (-q/m, 0)</span>
                    <span className="text-blue-600 font-bold">({m !== 0 ? formatNum(-q/m) : '∞'}, 0)</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Piano Cartesiano */}
      <div className="xl:col-span-8 bg-white p-10 rounded-[4rem] shadow-2xl border border-slate-50 flex flex-col h-[750px] w-full min-w-0 transition-all">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-4xl font-black text-slate-800 italic tracking-tighter mb-1">Piano Cartesiano</h3>
              <span className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em]">Visualizzazione Dinamica</span>
            </div>
          </div>
          <div className="flex-grow bg-[#f8fafc] rounded-[3rem] border border-slate-100 p-8 shadow-inner relative overflow-hidden">
            <canvas ref={chartRef}></canvas>
          </div>
          <div className="mt-8 flex justify-center gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-[#ef4444]"></div> Retta</div>
              <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-[#16a34a]"></div> Punto A</div>
              <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-[#f97316]"></div> Punto B</div>
              <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-[#7c3aed]"></div> Intercetta Y</div>
              <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-[#0ea5e9]"></div> Intercetta X</div>
          </div>
      </div>
    </div>
  );
};

export default InteractiveLine;

