import React, {useState, useEffect, useCallback} from 'react';

//initialize state structure here
export const TypingSettingsContext = React.createContext({
    difficulty: '',
    TTTLength: 0,
    trainingMode: '',
    maxCharsFromError: 0,
    changeDifficulty: ()=>{},
    setTTTLength: ()=> {},
});


export default function TypingSettingsProvider({children}) {
    const [difficulty, setDifficulty] = useState('easy');
    const [TTTLength, setTTTLength] = useState(150);
    const [trainingMode, setTrainingMode] = useState('Special Characters Emphasis');
    const [maxCharsFromError, setMaxCharsFromError] = useState(8);

    const changeDifficulty = useCallback((event, value) => {
        let difficultyText = '';
        switch (value) {
            case 0:
                difficultyText = 'veryEasy';
                break;
            case 1:
                difficultyText = 'easy';
                break;
            case 2:
                difficultyText='medium';
                break;
            case 3:
                difficultyText='hard';
                break;
            default:
                console.log('difficulty slider is out of allowed range');
                return;
        }
        setDifficulty(difficultyText);
    },[]);
    
  
    return (
    <TypingSettingsContext.Provider
        value={{
            difficulty: difficulty,
            TTTLength: TTTLength,
            trainingMode: trainingMode,
            maxCharsFromError: maxCharsFromError,
            changeDifficulty: changeDifficulty,
            setTTTLength: setTTTLength,
        }
        }
    >
        {children}
    </TypingSettingsContext.Provider>
    );
}



