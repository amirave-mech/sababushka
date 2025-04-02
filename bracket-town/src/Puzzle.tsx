import { forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
import Bracket from "./Bracket";

interface PuzzleProps {
    puzzleKey: string, requestHint: () => boolean
}
interface PuzzleRefHandle {
    submitAnswer: () => string; // Return type defined explicitly
}

const Puzzle = forwardRef<PuzzleRefHandle, PuzzleProps>(({ puzzleKey, requestHint }: PuzzleProps, ref: any) => {
    const [puzzleDom, setPuzzleDom] = useState<ReactNode[]>([]);
    const rootBracket = useRef<Bracket | null>(null);
    const setRootBracket = (newRootBracket: Bracket) => {rootBracket.current = newRootBracket};
    // const [curText, setCurText] = useState('');

    const getHint = useCallback((bracket: Bracket) => {
        console.log(puzzleDom);
        if (!rootBracket.current)
            throw new Error(`Cannot use hint when bracket is null!`);
        
        const isSure = confirm('להראות את האות הראשונה?')
        if (!isSure)
            return;
    
        const res = requestHint();
        if (!res)
            return;
    
        bracket.revealLetter();
        setPuzzleDom(rootBracket.current.toDom(getHint));
    }, [puzzleKey, puzzleDom, rootBracket, requestHint]);

    useEffect(() => {
        console.log(puzzleKey)
        const newBracket = Bracket.create(puzzleKey);
        setRootBracket(newBracket);
        console.log(newBracket);
    
        setPuzzleDom(newBracket.toDom(getHint));
    }, [puzzleKey]);

    useImperativeHandle(ref, () => ({
        submitAnswer
    }));

    const submitAnswer = (answer: string): [boolean, boolean] => {
        if (!rootBracket.current)
            throw new Error(`Cannot submit answer when bracket is null!`);

        const inners = rootBracket.current.getAllInners();

        for (let i = 0; i < inners.length; i++) {
            const bracket = inners[i];
            if (bracket.answer === answer) {
                bracket.collapse();
                setPuzzleDom(rootBracket.current.toDom(getHint));
                const isFinished = rootBracket.current.isInner;
                return [true, isFinished];
            }
        }

        return [false, false];
    }

    return (
        <div className='puzzle'>
            {puzzleDom}
        </div>
    );
});

export default Puzzle
