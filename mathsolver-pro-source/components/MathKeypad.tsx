
import React from 'react';

interface MathKeypadProps {
  onInput: (char: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

const MathKeypad: React.FC<MathKeypadProps> = ({ onInput, onDelete, onClear }) => {
  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', 'x', 'y', '+',
    '=', '>', '<', '.'
  ];

  return (
    <div className="grid grid-cols-4 gap-2 bg-gray-100 p-4 rounded-xl shadow-lg border border-gray-200">
      {buttons.map((btn) => (
        <button
          key={btn}
          onClick={() => onInput(btn)}
          className="p-4 text-xl font-bold bg-white text-blue-600 rounded-lg shadow hover:bg-blue-50 active:bg-blue-100 transition-colors border border-gray-200"
        >
          {btn}
        </button>
      ))}
      <button
        onClick={onClear}
        className="p-4 text-xl font-bold bg-red-500 text-white rounded-lg shadow hover:bg-red-600 active:bg-red-700 transition-colors col-span-2"
      >
        Canc
      </button>
      <button
        onClick={onDelete}
        className="p-4 text-xl font-bold bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 active:bg-amber-700 transition-colors col-span-2"
      >
        Del
      </button>
    </div>
  );
};

export default MathKeypad;

