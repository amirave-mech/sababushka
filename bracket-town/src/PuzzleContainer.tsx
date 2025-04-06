import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Bracket from "./Bracket";
import Toast from './Toast';
import PuzzleInput from './PuzzleInput';
import * as Constants from './Constants';
import { shareSMS, shareToClipboard } from './ShareUtil';
import { PuzzleState, PuzzleStateAction, savePuzzleState, loadPuzzleState } from './CookieUtils';
import { clearPuzzleState } from "./CookieUtils";

export interface PuzzleConfig {
  puzzleKey: string;
  startText: string | null;
  endText: string | null;
  showContinueButton: boolean;
  showScore: boolean;
}

interface PuzzleContainerProps {
  config: PuzzleConfig;
  onFinish: (finalScore: number) => void;
  onContinue: () => void;
}

function PuzzleContainer({ config, onFinish, onContinue }: PuzzleContainerProps) {
  const [isReady, setIsReady] = useState(false);
  const [score, setScore] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [puzzleDom, setPuzzleDom] = useState<ReactNode[]>([]);
  const [lastAnswer, setLastAnswer] = useState<string | null>(null);
  const [actions, setActions] = useState<PuzzleStateAction[]>([]);

  const stateRef = useRef({ actions, score, isFinished, lastAnswer });
  const rootBracket = useRef<Bracket | null>(null);
  const toastRef = useRef<any>(null);

  useEffect(() => {
    stateRef.current = { actions, score, isFinished, lastAnswer };
    if (isReady)
      savePuzzleState(config.puzzleKey, stateRef.current)
  }, [isReady, actions, score, isFinished, lastAnswer])

  // Load saved state on component mount
  useEffect(() => {
    const newBracket = Bracket.create(config.puzzleKey);
    rootBracket.current = newBracket;

    // Try to load saved state
    const savedState = loadPuzzleState(config.puzzleKey);

    console.log(savedState);

    if (savedState) {
      // Restore score and finished state
      setScore(savedState.score);
      setIsFinished(savedState.isFinished);
      setLastAnswer(savedState.lastAnswer);
      setActions(savedState.actions);

      // Replay actions to restore bracket state
      savedState.actions.forEach(action => {
        if (action.type === 'guess' && action.correct) {
          const inners = newBracket.getAllInners();
          const bracket = inners.find(b => b.answer === action.answer);
          if (bracket) {
            bracket.collapse();
          }
        } else if (action.type === 'hint') {
          // Find the bracket by path and reveal letter
          let targetBracket = newBracket.find(action.path);

          if (!targetBracket.isSolved) {
            targetBracket.revealLetter();
          }
        }
      });

      // If the puzzle was finished, make sure it's properly collapsed
      if (savedState.isFinished && !newBracket.isInner) {
        newBracket.collapse();
      }
    }

    setPuzzleDom(newBracket.toDom(getHint, savedState?.lastAnswer ?? null));
    setIsReady(true);
  }, [config.puzzleKey]);

  const updateState = () => {
    // if (rootBracket.current) {
    //   const currentState: PuzzleState = {
    //     actions : stateRef.current.actions,
    //     score: stateRef.current.score,
    //     isFinished: stateRef.current.isFinished,
    //     lastAnswer: stateRef.current.lastAnswer
    //   };

    //   savePuzzleState(config.puzzleKey, currentState);

    //   console.log(currentState);
    // }

    // savePuzzleState(config.puzzleKey, stateRef.current);
  };

  const getHint = useCallback((bracket: Bracket) => {
    if (!rootBracket.current) {
      throw new Error(`Cannot use hint when bracket is null!`);
    }

    if (!bracket.hintUsed) {
      const isSure = confirm('להראות את האות הראשונה?');
      if (!isSure) return;

      setScore((score) => Math.max(score - Constants.HINT_COST, 0));

      // Add hint action to state
      const path = bracket.getPath();
      setActions(prevActions => [...prevActions, { type: 'hint', path }]);

      bracket.revealLetter();
      setPuzzleDom(rootBracket.current.toDom(getHint, lastAnswer));
      updateState();
    }
    else if (!bracket.isSolved) {
      const isSure = confirm('לגלות את כל המילה?');
      if (!isSure) return;

      setScore((score) => Math.max(score - Constants.REVEAL_COST, 0));

      setActions(prevActions => [...prevActions, {
        type: 'guess',
        answer: bracket.answer!,
        correct: true
      }]);

      revealBracket(bracket);
      updateState();
    }
  }, [config.puzzleKey, puzzleDom, rootBracket, lastAnswer]);

  const submitAnswer = (text: string): boolean => {
    if (!rootBracket.current) {
      throw new Error(`Cannot submit answer when bracket is null!`);
    }

    const inners = rootBracket.current.getAllInners();

    for (let i = 0; i < inners.length; i++) {
      const bracket = inners[i];
      if (bracket.answer === text) {
        revealBracket(bracket);

        // Add successful guess to actions
        setActions(prevActions => [...prevActions, {
          type: 'guess',
          answer: text,
          correct: true
        }]);

        updateState();

        return true;
      }
    }

    // Add incorrect guess to actions
    setActions(prevActions => [...prevActions, {
      type: 'guess',
      answer: text,
      correct: false
    }]);

    updateState();

    return false;
  };

  const revealBracket = (bracket: Bracket) => {
    if (!rootBracket.current) {
      throw new Error(`Cannot submit answer when bracket is null!`);
    }

    bracket.collapse();
    setLastAnswer(bracket.answer!);
    setPuzzleDom(rootBracket.current.toDom(getHint, bracket.answer!));

    setTimeout(() => {
      const isFinished = rootBracket.current!.isInner;
      if (isFinished) {
        setIsFinished(true);
        updateState();
        onFinish(score);
      }
    }, 500);
  };

  const onSubmit = (text: string) => {
    const correct = submitAnswer(text);

    if (correct === false) {
      setScore((score) => Math.max(score - Constants.WRONG_GUESS_COST, 0));
      toastRef.current.showError('טעות! הניחוש לא תואם אף אחד מהסוגרים.');
    }
  };

  const onShare = () => {
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      shareSMS(Constants.SHARE_MESSAGE);
    } else {
      shareToClipboard(Constants.SHARE_MESSAGE);
    }
  };

  // Reset button handler to clear saved state
  const onReset = () => {
    if (confirm('האם אתה בטוח שברצונך לאפס את הפאזל?')) {
      // Clear saved state
      clearPuzzleState(config.puzzleKey);

      // Reset component state
      setScore(100);
      setIsFinished(false);
      setLastAnswer(null);
      setActions([]);

      // Recreate bracket
      const newBracket = Bracket.create(config.puzzleKey);
      rootBracket.current = newBracket;
      setPuzzleDom(newBracket.toDom(getHint, null));
    }
  };

  return (
    <div className='puzzle-content'>
      {config.showScore && (
        <div className='puzzle-score'>
          <label>ניקוד: {score}/100</label>
          <progress value={score} max='100'>{score}%</progress>
        </div>
      )}

      {(config.startText != null && !isFinished) && (
        <div className='puzzle-tutorial'>{config.startText}</div>
      )}

      <div className={'puzzle' + (isFinished ? ' finished' : '')}>
        {puzzleDom}
      </div>

      {!isFinished ? (
        <>
          <Toast ref={toastRef} />
          <PuzzleInput onSubmit={onSubmit} />
        </>
      ) : (
        <div className='puzzle-stats'>
          {config.endText != null && (
            <div className='puzzle-tutorial'>{config.endText}</div>
          )}

          <button className='bbutton puzzle-share' onClick={onShare}>
            שתף עם חברים 📢
          </button>

          {config.showContinueButton && (
            <button className='bbutton puzzle-continue' onClick={onContinue}>
              [שלב הבא]
            </button>
          )}

          <button className="bbutton puzzle-reset" onClick={onReset}>
            אפס פאזל
          </button>
        </div>
      )}
    </div>
  );
}

export default PuzzleContainer;