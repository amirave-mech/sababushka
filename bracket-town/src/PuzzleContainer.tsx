import { useRef, useState } from 'react';
import Puzzle from './Puzzle';
import Toast from './Toast';
import PuzzleInput from './PuzzleInput';
import * as Constants from './Constants';
import { shareSMS, shareToClipboard } from './ShareUtil';

interface PuzzleComponentProps {
  config: PuzzleConfig;
  onFinish: (finalScore: number) => void;
  onContinue: () => void;
}

export interface PuzzleConfig {
  puzzleKey: string;
  startText: string | null;
  endText: string | null; 
  showContinueButton: boolean;
  showScore: boolean;
}

function PuzzleContainer({ config, onFinish, onContinue }: PuzzleComponentProps) {
  const [score, setScore] = useState(100);
  const [isFinished, setIsFinished] = useState(false);

  const puzzleRef = useRef<any>(null);
  const toastRef = useRef<any>(null);

  const onSubmit = (text: string) => {
    const correct = puzzleRef.current.submitAnswer(text);

    if (correct === false) {
      setScore((score) => Math.max(score - Constants.WRONG_GUESS_COST, 0));
      toastRef.current.showError('טעות! הניחוש לא תואם אף אחד מהסוגרים.');
    }
  };

  const onRequestHint = (num: number) => {
    // First Hint (letter)
    if (num === 1)
      setScore((score) => Math.max(score - Constants.HINT_COST, 0));
    // Second Hint (entire word)
    if (num === 2)
      setScore((score) => Math.max(score - Constants.REVEAL_COST, 0));

    return true;
  };

  const onFinishPuzzle = () => {
    setIsFinished(true);
    onFinish(score);
  }

  const onShare = () => {
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      shareSMS(Constants.SHARE_MESSAGE);
    }
    else {
      shareToClipboard(Constants.SHARE_MESSAGE);
    }
  }

  return (
    <div className='puzzle-content'>
      {config.showScore && <div className='puzzle-score'>
        <label>ניקוד: {score}/100</label>
        <progress value={score} max='100'>{score}%</progress>
      </div>}
      {(config.startText != null && !isFinished) && <div className='puzzle-tutorial'>
        {config.startText}
      </div>}
      <div className={'puzzle' + (isFinished ? ' finished' : '')}>
        <Puzzle
          ref={puzzleRef}
          puzzleKey={config.puzzleKey}
          requestHint={onRequestHint}
          onFinish={onFinishPuzzle}
        />
      </div>
      {!isFinished ? (
        <>
          <Toast ref={toastRef} />
          <PuzzleInput onSubmit={onSubmit} />
        </>
      ) : (
        <div className='puzzle-stats'>
          {config.endText != null && <div className='puzzle-tutorial'>
            {config.endText}
          </div>}
          <button className='bbutton puzzle-share' onClick={onShare}>
           שתף עם חברים 📢
          </button>
          {config.showContinueButton && <button className='bbutton puzzle-continue' onClick={onContinue}>
            [שלב הבא]
          </button>}
        </div>
      )}

    </div>
  );
}

export default PuzzleContainer;