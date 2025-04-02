import { useRef, useState } from 'react';
import Puzzle from './Puzzle';
import Toast from './Toast';
import PuzzleInput from './PuzzleInput';

interface PuzzleComponentProps {
  puzzleKey: string;
  isTutorial: boolean;
  onFinish: (finalScore: number) => void;
}

function PuzzleContainer({ puzzleKey, isTutorial, onFinish }: PuzzleComponentProps) {
  const [score, setScore] = useState(100);
  const [isFinished, setIsFinished] = useState(false);

  const puzzleRef = useRef<any>(null);
  const toastRef = useRef<any>(null);

  const onSubmit = (text: string) => {
    const correct = puzzleRef.current.submitAnswer(text);

    if (correct === false) {
      setScore((score) => Math.max(score - 2, 0));
      toastRef.current.showError('טעות! הניחוש לא תואם אף אחד מהסוגרים.');
    }
  };

  const onRequestHint = (num: number) => {
    // First Hint (letter)
    if (num === 1)
      setScore((score) => Math.max(score - 10, 0));
    // Second Hint (entire word)
    if (num === 2)
      setScore((score) => Math.max(score - 20, 0));

    return true;
  };

  const onFinishPuzzle = () => {
    setIsFinished(true);
    onFinish(score);
  }

  return (
    <div className='puzzle-content'>
      {!isTutorial && <div className='puzzle-score'>
        <label>ניקוד: {score}/100</label>
        <progress value={score} max='100'>{score}%</progress>
      </div>}
      {isTutorial && <div className='puzzle-tutorial'>
        המטרה במשחק היא להפטר מכל הסוגרים על מנת לגלות את המשפט שמתחבא מתחת. כאשר מנחשים מילה התואמת את אחת ההגדרות בתוך סוגר, הסוגר יוחלף בפתרון. בהצלחה!
      </div>}
      <Puzzle
        ref={puzzleRef}
        puzzleKey={puzzleKey}
        requestHint={onRequestHint}
        onFinish={onFinishPuzzle}
      />
      <Toast ref={toastRef} />
      <PuzzleInput onSubmit={onSubmit} />
    </div>
  );
}

export default PuzzleContainer;