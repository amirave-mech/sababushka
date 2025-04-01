import { forwardRef, ReactNode, useEffect, useImperativeHandle, useState } from "react"
import Bracket from "./Bracket";

interface PuzzleProps { puzzleKey: string }
interface PuzzleRefHandle {
    submitAnswer: () => string; // Return type defined explicitly
}

const Puzzle = forwardRef<PuzzleRefHandle, PuzzleProps>(({ puzzleKey }: PuzzleProps, ref: any) => {
    const [puzzleDom, setPuzzleDom] = useState<ReactNode[]>([]);
    const [bracket, setBracket] = useState<Bracket|null>(null);
    // const [curText, setCurText] = useState('');

    useEffect(() => {
        // const text = getHtmlFromText(puzzleKey);
        console.log(puzzleKey)
        const newBracket = Bracket.create(puzzleKey);
        setBracket(newBracket);
        console.log(newBracket);

        setPuzzleDom([newBracket.toDom()]);

    }, [puzzleKey]);

    useImperativeHandle(ref, () => ({
        submitAnswer
    }));

    const submitAnswer = (answer: string): boolean => {
        if (!bracket)
            throw new Error(`Cannot submit answer when bracket is null!`);

        const inners = bracket.getAllInners();

        for (let i = 0; i < inners.length; i++) {
            const cur = inners[i];
            if (cur.answer === answer) {
                cur.collapse();
                setPuzzleDom(bracket.toDom());
                return true;
            }
        }

        return false;
    }

    return (
        <div className='puzzle'>
            {puzzleDom}
        </div>
    );
});

export default Puzzle
