class Bracket {
    isInner: boolean = false;
    content: (string | Bracket)[] = [];
    answer: string | undefined = '';

    constructor(isInner: boolean, content: (string | Bracket)[], answer: string | undefined) {
        this.isInner = isInner;
        this.content = content;
        this.answer = answer;
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

    static create(text: string, thisAnswer: string | undefined = undefined): Bracket {
        let accum = '';
        let bracketCount = 0;
        let hasBrackets = false;
        let inAnswer = false;
        let answer = undefined;

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
                    if (!answer)
                        throw new Error(`Bracket ${text} is missing an answer`)
                    
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
                hasBrackets = true;
            }
            else {
                // If in bracket, added to accum, else add to last content
                if (bracketCount > 0) {
                    accum += ch;
                }
                else if (inAnswer) {
                    if (ch === '>') {
                        inAnswer = false;
                    } else {
                        answer += ch;
                    }
                } else {
                    if (ch === '<') {
                        inAnswer = true;
                        answer = '';
                    } else {
                        content[content.length - 1] += ch;
                    }
                }
            }
        }

        return new Bracket(!hasBrackets, content, thisAnswer);
    }
}

export default Bracket;