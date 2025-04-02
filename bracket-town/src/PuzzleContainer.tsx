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
    const [correct, isNowFinished] = puzzleRef.current.submitAnswer(text);

    if (correct === false) {
      setScore((score) => score - 2);
      toastRef.current.showError('טעות! הניחוש לא תואם אף אחד מהסוגרים.');
    }

    if (isNowFinished) {
      setIsFinished(true);
      onFinish(score);
    }
  };

  const onRequestHint = () => {
    setScore((score) => score - 15);
    return true;
  };

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
        requestHint={onRequestHint}
        puzzleKey={puzzleKey}
      />
      <Toast ref={toastRef} />
      <PuzzleInput onSubmit={onSubmit} />
    </div>
  );
}

export default PuzzleContainer;