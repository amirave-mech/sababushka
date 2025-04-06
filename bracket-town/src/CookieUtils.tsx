import Cookies from 'js-cookie';
import Bracket from './Bracket';

export interface PuzzleStateGuessAction {
  type: 'guess',
  answer: string,
  correct: boolean
} 

export interface PuzzleStateHintAction {
  type: 'hint',
  path: number[]
}

export type PuzzleStateAction = PuzzleStateGuessAction | PuzzleStateHintAction; 

export interface PuzzleState {
  actions: PuzzleStateAction[]
  score: number;
  isFinished: boolean;
  lastAnswer: string | null;
}

// Cookie management
const COOKIE_KEY = 'puzzles';
const COOKIE_EXPIRY = 30; // days

export function savePuzzleState(puzzleKey: string, state: PuzzleState): void {
  Cookies.set(`${COOKIE_KEY}.${puzzleKey}`, JSON.stringify(state));
}

export function loadPuzzleState(puzzleKey: string): PuzzleState | null {
  const cookieData = Cookies.get(`${COOKIE_KEY}.${puzzleKey}`);
  if (!cookieData) return null;
  
  try {
    return JSON.parse(cookieData) as PuzzleState;
  } catch (e) {
    console.error('Failed to parse puzzle state from cookie:', e);
    return null;
  }
}

export function clearPuzzleState(puzzleKey: string): void {
  Cookies.remove(`${COOKIE_KEY}.${puzzleKey}`);
}