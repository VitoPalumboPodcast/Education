
import React, { useEffect, useRef } from 'react';

interface MathRendererProps {
  latex: string;
  onPartClick?: (part: string) => void;
  noPadding?: boolean;
}

const MathRenderer: React.FC<MathRendererProps> = ({ latex, onPartClick, noPadding = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mathJax = (window as any).MathJax;
    if (mathJax && containerRef.current) {
      mathJax.typesetPromise([containerRef.current]).then(() => {
        const clickables = containerRef.current?.querySelectorAll('.math-clickable');
        clickables?.forEach((el) => {
          el.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            onPartClick?.(target.textContent || '');
          });
        });
      });
    }
  }, [latex, onPartClick]);

  return (
    <div 
      ref={containerRef} 
      className={`text-2xl md:text-3xl font-serif text-slate-900 text-center bg-white ${noPadding ? '' : 'py-10 shadow-inner border border-blue-50 rounded-3xl min-h-[140px] px-8'} flex items-center justify-center transition-all duration-500`}
    >
      {`\\[ ${latex} \\]`}
    </div>
  );
};

export default MathRenderer;

