import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import Bracket from "./Bracket";

interface PuzzleProps { puzzleKey: string }
interface PuzzleRefHandle {
    submitAnswer: () => string; // Return type defined explicitly
}

const Puzzle = forwardRef<PuzzleRefHandle, PuzzleProps>(({ puzzleKey }: PuzzleProps, ref: any) => {
    const [puzzleDom, setPuzzleDom] = useState([]);
    // const [curText, setCurText] = useState('');

    useEffect(() => {
        // const text = getHtmlFromText(puzzleKey);
        console.log(puzzleKey)
        console.log(Bracket.create(puzzleKey, undefined));
        // @ts-ignore
        setPuzzleDom([Bracket.create(puzzleKey).toDom()]);

    }, [puzzleKey]);

    useImperativeHandle(ref, () => {
        submitAnswer
    });

    const submitAnswer = (answer: string): boolean => {
        return false;
    }

    const getHtmlFromText = (str: string) => {
        let text = [];
        let accum = '';
        let curInner = false;

        // let innerTexts

        for (let i = 0; i < str.length; i++) {
            let ch = str.charAt(i);

            if (ch === '\[') {
                text.push(accum);
                accum = '[';
                curInner = true;
            }
            else if (ch === '\]') {
                if (curInner) {
                    accum += ']'
                    text.push(<span className="highlight"> {accum} </span>);
                    accum = ''
                    curInner = false;
                } else {
                    text.push(accum);
                    accum = ']';
                }
            }
            else {
                accum += ch;
            }
        }

        text.push(accum);

        // @ts-ignore
        setPuzzleDom(text);
        // setCurText(puzzleKey);

        return text;
    }

    return (
        <>
            {puzzleDom}
        </>
    );
});

export default Puzzle
