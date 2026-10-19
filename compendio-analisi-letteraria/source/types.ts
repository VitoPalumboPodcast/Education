
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface PoemData {
  title: string;
  author: string;
  text: string;
  year?: string;
  rhymeScheme?: string[]; // Array di lettere corrispondenti ai versi non vuoti
  rhymeType?: string;
  stanzaType?: string;
  quiz?: QuizQuestion[];
}

export type SyllableType = 'normal' | 'accented' | 'sinalefe' | 'dialefe' | 'dieresi' | 'sineresi';

export interface Syllable {
  text: string;
  type: SyllableType;
  index: number;
}

export interface VerseAnalysis {
  verse: string;
  scansion?: Syllable[];
  syllables?: number;
  meter: string;
  caesuraIndex?: number;
  enjambement?: boolean;
  figuresOfSpeech?: string[];
  meaning: string;
  accents: number[] | string;
}

export interface AnalysisResult {
  sentiment: string;
  keywords: string[];
  explanation: string;
  style: string;
}
