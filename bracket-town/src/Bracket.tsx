import { ReactNode } from "react";

class Bracket {
    isInner: boolean = false;
    content: (string | Bracket | ReactNode)[] = [];
    answer: string | undefined = '';
    parent: Bracket| null;

    constructor(content: (string | Bracket)[], answer: string | undefined) {
        this.content = content;
        this.answer = answer;
        this.parent = null;
        
        this.recalculateIsInner();
    }

    setParent(parent: Bracket) {
        this.parent = parent;
    }

    toText() {
        let text = '';

        this.content.forEach(elem => {
            if (elem instanceof Bracket)
                text += `[${elem.toText()}]`;
            else
                text += elem;
        });

        return text;
    }

    toDom() {
        let dom: (string | React.ReactNode)[] = [];

        this.content.forEach(elem => {
            if (elem instanceof Bracket)
                if (elem.isInner)
                    dom.push(<span className="highlight"> [{elem.toDom()}] </span>);
                else
                    dom.push(<>[{elem.toDom()}]</>)
            else
                dom.push(elem);
        });

        return dom;
    }

    getAllInners(): Bracket[] {
        if (this.isInner)
            return [this];

        let inners: Bracket[] = [];

        for (let i = 0; i < this.content.length; i++) {
            const elem = this.content[i];

            if (!(elem instanceof Bracket))
                continue;

            inners = inners.concat(elem.getAllInners());
        }

        return inners;
    }

    collapse() {
        if (!this.parent)
            throw new Error(`Parent empty in bracket ${this.toText()}`);

        const index = this.parent.content.indexOf(this);
        this.parent.content[index] = (<span className="correct">{this.answer}</span>)

        this.parent.recalculateIsInner();
    }

    recalculateIsInner() {
        let isInner = true;
        
        this.content.forEach(elem => {
            if (elem instanceof Bracket)
                isInner = false;
        });

        this.isInner = isInner;
    }

    static create(text: string, thisAnswer: string | undefined = undefined): Bracket {
        let accum = '';
        let answer = undefined;
        let bracketCount = 0;

        let content: (string | Bracket)[] = [];

        content.push('');

        for (let i = 0; i < text.length; i++) {
            let ch = text.charAt(i);

            // If closing bracket in depth 0, parse it recursively
            if (ch === '\]') {
                if (bracketCount > 0)
                    accum += ch;

                bracketCount--;

                if (bracketCount == 0) {
                    if (answer === undefined)
                        throw new Error(`Bracket ${accum} does not have an answer`);

                    content.push(Bracket.create(accum, answer))
                    accum = '';
                    content.push('');
                    answer = undefined;
                }
            }
            // If opening bracket, mark as not inner
            else if (ch === '\[') {
                if (bracketCount > 0)
                    accum += ch;

                bracketCount++;
            }
            else if (ch === '|' && bracketCount == 1) {
                if (answer != undefined)
                    throw new Error(`Multiple answers in bracket ${text}`);

                answer = accum;
                accum = '';
            }
            else {
                // If in bracket, added to accum, else add to last content
                if (bracketCount > 0) {
                    accum += ch;
                } else {
                    content[content.length - 1] += ch;
                }
            }
        }

        const finalBracket = new Bracket(content, thisAnswer);
        
        content.forEach(elem => {
            if (elem instanceof Bracket)
                elem.setParent(finalBracket);
        })

        return finalBracket;
    }
}

export default Bracket;