class Bracket {
    isInner: boolean = false;
    content: (string | Bracket)[] = [];
    answer: string = '';

    constructor(isInner: boolean, content: (string | Bracket)[], answer: string) {
        this.isInner = isInner;
        this.content = content;
        this.answer = answer;
    }

    serialize() {
        let text = '';

        this.content.forEach(elem => {
            if (elem instanceof Bracket)
                text += `[${elem.serialize()}]`;
            else
                text += elem;
        });

        return text;
    }

    static create(text: string): Bracket {
        let accum = '';
        let bracketCount = 0;
        let hasBrackets = false;

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
                    content.push(Bracket.create(accum))
                    accum = '';
                    content.push('');
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
                else {
                    content[content.length - 1] += ch;
                }
            }
        }

        return new Bracket(!hasBrackets, content);
    }

}

export default Bracket;