// Custom hook to manage game logic
import { useCallback, useEffect, useRef, useState } from "react";
import Bracket from "./Bracket";
import Toast from './Toast';
import PuzzleInput from './PuzzleInput';
import * as Constants from './Constants';
import { shareNative } from './ShareUtil';
import { PuzzleStateAction, savePuzzleState, loadPuzzleState, getPuzzle, clearPuzzleState } from './CookieUtils';
import { formatString, getScoreEmojis, isEqualHebrew } from "./Utils";

export interface PuzzleConfig {
  puzzleKey: string;
  puzzleDisplayName: string;
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

// Custom hook to manage game state and logic
function usePuzzleGame(config: PuzzleConfig, onFinish: (score: number) => void) {
  const [score, setScore] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<string | null>(null);
  const [actions, setActions] = useState<PuzzleStateAction[]>([]);
  const [isReady, setIsReady] = useState(false);

  const rootBracket = useRef<Bracket | null>(null);

  // Initial setup and load saved state
  useEffect(() => {
    const puzzle = getPuzzle(config.puzzleKey);
    const newBracket = Bracket.create(puzzle);
    rootBracket.current = newBracket;

    // Try to load saved state
    const savedState = loadPuzzleState(config.puzzleKey);

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
          const bracket = inners.find(b => isEqualHebrew(b.answer, action.answer));
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

    setIsReady(true);
  }, [config.puzzleKey]);

  // Save state whenever it changes
  useEffect(() => {
    if (isReady) {
      savePuzzleState(config.puzzleKey, { actions, score, isFinished, lastAnswer });
    }
  }, [isReady, actions, score, isFinished, lastAnswer, config.puzzleKey]);

  const getHint = useCallback((bracket: Bracket): void => {
    if (!rootBracket.current) return;

    if (!bracket.hintUsed) {
      const isSure = confirm('להראות את האות הראשונה?');
      if (!isSure) return;

      setScore((s) => Math.max(s - Constants.HINT_COST, 0));

      // Add hint action to state
      const path = bracket.getPath();
      setActions(prevActions => [...prevActions, { type: 'hint', path }]);

      bracket.revealLetter();
    }
    else if (!bracket.isSolved) {
      const isSure = confirm('לגלות את כל המילה?');
      if (!isSure) return;

      setScore((s) => Math.max(s - Constants.REVEAL_COST, 0));

      setActions(prevActions => [...prevActions, {
        type: 'guess',
        answer: bracket.answer!,
        correct: true
      }]);

      revealBracket(bracket);
    }
  }, []);

  const submitAnswer = useCallback((text: string): boolean => {
    if (!rootBracket.current) return false;

    text = text.trim();
    const inners = rootBracket.current.getAllInners();

    for (let i = 0; i < inners.length; i++) {
      const bracket = inners[i];
      if (!bracket.isSolved && isEqualHebrew(bracket.answer, text)) {
        revealBracket(bracket);

        setActions(prevActions => [...prevActions, {
          type: 'guess',
          answer: text,
          correct: true
        }]);

        return true;
      }
    }

    let wasGuessedAlready = false;
    actions.forEach(action => {
      if (action.type === 'guess' && isEqualHebrew(action.answer, text))
        wasGuessedAlready = true;
    });

    if (!wasGuessedAlready) {
      setActions(prevActions => [...prevActions, {
        type: 'guess',
        answer: text,
        correct: false
      }]);
      setScore((s) => Math.max(s - Constants.WRONG_GUESS_COST, 0));
    }

    return false;
  }, [actions]);

  const revealBracket = useCallback((bracket: Bracket) => {
    if (!rootBracket.current) return;

    bracket.collapse();
    setLastAnswer(bracket.answer!);

    setTimeout(() => {
      if (rootBracket.current?.isInner) {
        setIsFinished(true);
        onFinish(score);
      }
    }, 500);
  }, [onFinish, score]);

  const resetGame = useCallback(() => {
    clearPuzzleState(config.puzzleKey);
    setScore(100);
    setIsFinished(false);
    setLastAnswer(null);
    setActions([]);

    // Recreate bracket
    const newBracket = Bracket.create(getPuzzle(config.puzzleKey));
    rootBracket.current = newBracket;
  }, [config.puzzleKey]);

  const shareScore = useCallback(() => {
    const shareText = formatString(
      Constants.SHARE_MESSAGE_LEVEL,
      config.puzzleDisplayName,
      score.toString(),
      getScoreEmojis(score, 100)
    );
    shareNative(shareText);
  }, [config.puzzleDisplayName, score]);

  return {
    score,
    isFinished,
    lastAnswer,
    isReady,
    rootBracket: rootBracket.current,
    getHint,
    submitAnswer,
    resetGame,
    shareScore
  };
}

// Small component for Score display
function PuzzleScore({ score }: { score: number }) {
  return (
    <div className='puzzle-score'>
      <label>ניקוד: {score}/100</label>
      <progress value={score} max='100'>{score}%</progress>
    </div>
  );
}

// Component to display tutorial/help text
function PuzzleText({ text }: { text: string | null }) {
  if (!text) return null;
  return <div className='puzzle-tutorial'>{text}</div>;
}

// Component to display the entire puzzle board
function PuzzleBoard({
  bracket,
  isFinished,
  getHint,
  lastAnswer
}: {
  bracket: Bracket | null;
  isFinished: boolean;
  getHint: (bracket: Bracket) => void;
  lastAnswer: string | null;
}) {
  if (!bracket) return null;

  return (
    <div className={'puzzle' + (isFinished ? ' finished' : '')}>
      {bracket.toDom(getHint, lastAnswer)}
    </div>
  );
}

// Component for controls when puzzle is finished
function PuzzleComplete({
  endText,
  onShare,
  onContinue,
  onReset,
  showContinueButton
}: {
  endText: string | null;
  onShare: () => void;
  onContinue: () => void;
  onReset: () => void;
  showContinueButton: boolean;
}) {
  return (
    <div className='puzzle-stats'>
      <PuzzleText text={endText} />

      <div className='puzzle-end-buttons'>
        <button className='bbutton puzzle-share' onClick={onShare}>
          שתף עם חברים 📢
        </button>

        {showContinueButton && (
          <button className='bbutton puzzle-continue' onClick={onContinue}>
            [שלב הבא]
          </button>
        )}

        <button className="bbutton puzzle-reset" onClick={onReset}>
          אפס פאזל
        </button>
      </div>
    </div>
  );
}

// Main component
function PuzzleContainer({ config, onFinish, onContinue }: PuzzleContainerProps) {
  const game = usePuzzleGame(config, onFinish);
  const toastRef = useRef<any>(null);

  const handleSubmitAnswer = (text: string): boolean => {
    const result = game.submitAnswer(text);
    if (!result) {
      const wasGuessedAlready = false; // This would ideally be returned from submitAnswer
      if (wasGuessedAlready) {
        toastRef.current?.showError(`כבר ניחשת "${text}"!`);
      } else {
        toastRef.current?.showError('טעות! הניחוש לא תואם אף אחת מההגדרות.');
      }
    }
    return result;
  };

  const handleReset = () => {
    if (confirm('האם אתה בטוח שברצונך לאפס את הפאזל?')) {
      game.resetGame();
    }
  };

  return (
    <div className='puzzle-content'>
      {config.showScore && <PuzzleScore score={game.score} />}

      {!game.isFinished && <PuzzleText text={config.startText} />}

      <PuzzleBoard
        bracket={game.rootBracket}
        isFinished={game.isFinished}
        getHint={game.getHint}
        lastAnswer={game.lastAnswer}
      />

      {!game.isFinished ? (
        <>
          <Toast ref={toastRef} />
          <PuzzleInput onSubmit={handleSubmitAnswer} />
        </>
      ) : (
        <PuzzleComplete
          endText={config.endText}
          onShare={game.shareScore}
          onContinue={onContinue}
          onReset={handleReset}
          showContinueButton={config.showContinueButton}
        />
      )}
    </div>
  );
}

export default PuzzleContainer;