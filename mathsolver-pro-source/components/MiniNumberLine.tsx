
import React from 'react';
import { motion } from 'motion/react';

interface MiniNumberLineProps {
  root: number;
  rootLabel: string;
  type: 'N' | 'D'; // Numerator or Denominator
  isPositiveRight: boolean; // Usually true for ax+b with a > 0
  pointStatus: '0' | 'vietato';
}

const MiniNumberLine: React.FC<MiniNumberLineProps> = ({ root, rootLabel, type, isPositiveRight, pointStatus }) => {
  const colorClass = type === 'N' ? 'bg-blue-600 border-blue-200' : 'bg-red-600 border-red-200';
  const textColorClass = type === 'N' ? 'text-blue-600' : 'text-red-600';
  
  return (
    <div className="flex flex-col items-center py-10 w-full max-w-md mx-auto">
      <div className="relative w-full h-1.5 bg-slate-200 rounded-full flex items-center">
        {/* Left side sign */}
        <div className={`absolute left-1/4 -top-10 text-4xl font-black ${isPositiveRight ? 'text-rose-400' : 'text-emerald-400'}`}>
          {isPositiveRight ? '-' : '+'}
        </div>
        
        {/* The Point */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-6 h-6 rounded-full border-4 ${colorClass} z-10 shadow-md`}
          ></motion.div>
          <div className={`mt-3 text-[10px] font-black uppercase tracking-widest ${pointStatus === 'vietato' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'} px-3 py-1 rounded-full shadow-lg animate-bounce`}>
            {pointStatus === 'vietato' ? 'VIETATO' : 'ZERO'}
          </div>
          <div className="mt-2 font-serif italic text-xl text-slate-900 font-bold">{rootLabel}</div>
        </div>

        {/* Right side sign */}
        <div className={`absolute right-1/4 -top-10 text-4xl font-black ${isPositiveRight ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositiveRight ? '+' : '-'}
        </div>
      </div>
      
      <div className={`mt-16 text-[10px] font-black uppercase tracking-widest ${textColorClass} opacity-60`}>
        Segno del {type === 'N' ? 'Numeratore' : 'Denominatore'}
      </div>
    </div>
  );
};

export default MiniNumberLine;

