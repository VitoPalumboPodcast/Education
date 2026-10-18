/** Reads guidance aloud with the browser's built-in Italian voice. */
export const speakText = (text: string): void => {
  if (!text || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const spoken = text.replace(/\bx\b/gi, 'ics').replace(/≤/g, ' minore o uguale a ').replace(/≥/g, ' maggiore o uguale a ')
    .replace(/=/g, ' uguale a ').replace(/\+/g, ' più ').replace(/−|-/g, ' meno ').replace(/\*/g, ' per ').replace(/\//g, ' diviso ');
  const utterance = new SpeechSynthesisUtterance(spoken);
  utterance.lang = 'it-IT';
  const voice = window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('it'));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
};

