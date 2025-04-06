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