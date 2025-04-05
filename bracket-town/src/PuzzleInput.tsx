import React, { useState, useRef, useEffect } from 'react';
import './PuzzleInput.css';

interface PuzzleInputProps {
    initialValue?: string;
    onSubmit?: (text: string) => void;
}

const PuzzleInput: React.FC<PuzzleInputProps> = ({
    initialValue = '',
    onSubmit
}) => {
    const [text, setText] = useState<string>(initialValue);
    const [mobileMode, setMobileMode] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Hebrew keyboard layout - with ף added and delete button moved to first row
    const hebrewKeys: string[][] = [
        ['פםןוטארק', 'ףךלחיעכגדש', 'ץתצמנהבסז']
    ];

    // Prevent the OS keyboard from showing
    useEffect(() => {
        const matchQuery = window.matchMedia("(max-width: 640px)");
        setMobileMode(matchQuery.matches);
        matchQuery.addEventListener('change', (e) => setMobileMode(e.matches));
    }, []);

    // Handle key press
    const handleKeyPress = (key: string): void => {
        if (key === 'מחק') {
            // Delete last character
            const newText = text.slice(0, -1);
            setText(newText);
        } else {
            // Add character
            const newText = text + key;
            setText(newText);
        }

        // Keep focus on input
        // inputRef.current?.focus();
    };

    const submitAnswer = (e: React.FormEvent<HTMLFormElement>) => {
        if (onSubmit)
            onSubmit(text);

        setText('')
        e.preventDefault();
    }

    return (
        <div className="keyboard-container">
            <form className='input-container' onSubmit={submitAnswer}>
                <input
                    className='puzzle-input'
                    type='text'
                    name='answer'
                    placeholder='הקלד את הניחוש שלך...'
                    value={text}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                    ref={inputRef}
                    readOnly={mobileMode}
                    autoComplete='off'
                />
                <button className='bbutton puzzle-submit' disabled={(text ? false : true)}>שלח</button>
            </form>

            {mobileMode && (
                <div className="keyboard">
                    {/* First row with keys and delete button aligned to the right */}
                    <div className="key-row">
                        <button
                            onClick={() => handleKeyPress('מחק')}
                            className="key delete-key"
                        >
                            מחק
                        </button>
                        {hebrewKeys[0][0].split('').map((key, keyIndex) => (
                            <button
                                key={keyIndex}
                                onClick={() => handleKeyPress(key)}
                                className="key"
                            >
                                {key}
                            </button>
                        ))}
                    </div>

                    {/* Middle row*/}
                    <div className="key-row">
                        {hebrewKeys[0][1].split('').map((key, keyIndex) => (
                            <button
                                key={keyIndex}
                                onClick={() => handleKeyPress(key)}
                                className="key"
                            >
                                {key}
                            </button>
                        ))}
                    </div>

                    {/* Bottom row */}
                    <div className="key-row">
                        {hebrewKeys[0][2].split('').map((key, keyIndex) => (
                            <button
                                key={keyIndex}
                                onClick={() => handleKeyPress(key)}
                                className="key"
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PuzzleInput;