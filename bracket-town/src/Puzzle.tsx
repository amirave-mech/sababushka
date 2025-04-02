import { forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
import Bracket from "./Bracket";

interface PuzzleProps {
    puzzleKey: string, requestHint: (num: number) => boolean, onFinish: () => void
}
interface PuzzleRefHandle {
    submitAnswer: () => string; // Return type defined explicitly
}

const Puzzle = forwardRef<PuzzleRefHandle, PuzzleProps>(({ puzzleKey, requestHint, onFinish }: PuzzleProps, ref: any) => {
    const [puzzleDom, setPuzzleDom] = useState<ReactNode[]>([]);
    const [lastAnswer, setLastAnswer] = useState<string|null>(null);
    const rootBracket = useRef<Bracket | null>(null);
    const setRootBracket = (newRootBracket: Bracket) => { rootBracket.current = newRootBracket };
    // const [curText, setCurText] = useState('');

    const getHint = useCallback((bracket: Bracket) => {
        console.log(puzzleDom);
        if (!rootBracket.current)
            throw new Error(`Cannot use hint when bracket is null!`);

        if (!bracket.hintUsed) {
            const isSure = confirm('להראות את האות הראשונה?')
            if (!isSure)
                return;

            const res = requestHint(1);
            if (!res)
                return;

            bracket.revealLetter();
            setPuzzleDom(rootBracket.current.toDom(getHint, lastAnswer));
        }
        else if (!bracket.isSolved) {
            const isSure = confirm('לגלות את כל המילה?')
            if (!isSure)
                return;

            const res = requestHint(2);
            if (!res)
                return;

            revealBracket(bracket)
        }
    }, [puzzleKey, puzzleDom, rootBracket, requestHint]);

    useEffect(() => {
        console.log(puzzleKey)
        const newBracket = Bracket.create(puzzleKey);
        setRootBracket(newBracket);
        console.log(newBracket);

        setPuzzleDom(newBracket.toDom(getHint, lastAnswer));
    }, [puzzleKey]);

    useImperativeHandle(ref, () => ({
        submitAnswer
    }));

    const submitAnswer = (answer: string): boolean => {
        if (!rootBracket.current)
            throw new Error(`Cannot submit answer when bracket is null!`);

        const inners = rootBracket.current.getAllInners();

        for (let i = 0; i < inners.length; i++) {
            const bracket = inners[i];
            if (bracket.answer === answer) {
                revealBracket(bracket);
                return true;
            }
        }

        return false;
    }

    const revealBracket = (bracket: Bracket) => {
        if (!rootBracket.current)
            throw new Error(`Cannot submit answer when bracket is null!`);
        
        bracket.collapse();
        setLastAnswer(bracket.answer!);
        setPuzzleDom(rootBracket.current.toDom(getHint, bracket.answer!));

        setTimeout(() => {
            const isFinished = rootBracket.current!.isInner;
            if (isFinished)
                onFinish();
        }, 500)
    }

    return (
        <div className='puzzle'>
            {puzzleDom}
        </div>
    );
});

export default Puzzle
