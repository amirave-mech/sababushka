export function convertFinalHebrewLetters(text: string): string {
    const finalLettersMap: Record<string, string> = {
        'ך': 'כ', // Final Kaf to regular Kaf
        'ם': 'מ', // Final Mem to regular Mem
        'ן': 'נ', // Final Nun to regular Nun
        'ף': 'פ', // Final Pe to regular Pe
        'ץ': 'צ', // Final Tsadi to regular Tsadi
    };

    return text.split('').map(char => {
        return finalLettersMap[char] || char;
    }).join('');
}

export function isEqualHebrew(a: string | undefined, b: string | undefined) {
    if (b === undefined || a === undefined)
        return false;

    return convertFinalHebrewLetters(a) === convertFinalHebrewLetters(b);
}

export function getScoreEmojis(score: number, maxScore: number, emojiCount = 10) {
    const percentage = score / maxScore;

    const final = '🟦 '.repeat(Math.floor(percentage * emojiCount)) + '⬜ '.repeat(Math.ceil((1 - percentage) * emojiCount));

    return final;
}

export function formatString(str: string, ...args: string[]) {
    return str.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
}