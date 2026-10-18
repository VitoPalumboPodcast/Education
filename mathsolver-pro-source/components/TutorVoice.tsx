
import React, { useState, useEffect } from 'react';
import { speakText } from '../services/browserSpeech';

interface TutorVoiceProps {
  message: string;
  isAiEnabled: boolean;
}

const TutorVoice: React.FC<TutorVoiceProps> = ({ message, isAiEnabled }) => {
  const [visibleMessage, setVisibleMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisibleMessage(message);
      setIsVisible(true);
      speakText(message);

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 7000); 

      return () => clearTimeout(timer);
    }
  }, [message, isAiEnabled]);

  if (!isVisible || !visibleMessage) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex items-end gap-4 animate-slide-in pointer-events-none">
      <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl border-4 border-indigo-600 max-w-[320px] mb-8">
        <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1.5 opacity-80">
          {isAiEnabled ? 'AI Tutor' : 'Elisa (Standard)'}
        </p>
        <p className="text-indigo-900 font-bold text-base leading-relaxed italic">
          "{visibleMessage}"
        </p>
        <div className="absolute -bottom-4 right-8 w-8 h-8 bg-white border-r-4 border-b-4 border-indigo-600 rotate-45 transform translate-y-[-50%]"></div>
      </div>

      <div className={`w-20 h-20 ${isAiEnabled ? 'bg-indigo-600' : 'bg-pink-500'} rounded-full flex items-center justify-center border-4 border-white shadow-xl pointer-events-auto transition-colors duration-500`}>
        <span className="text-4xl">
          {isAiEnabled ? '🤖' : '👩‍🏫'}
        </span>
      </div>
    </div>
  );
};

export default TutorVoice;

