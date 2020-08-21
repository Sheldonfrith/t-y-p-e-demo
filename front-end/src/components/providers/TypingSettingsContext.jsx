import React, {useState, useEffect} from 'react';
import {getPriorityList} from '../../lib/trainingModeUtils'
import generateNewTTT from '../../lib/generateNewTTT'

//initialize state structure here
export const TypingSettingsContext = React.createContext({
    difficulty: '',
    TTTLength: 0,
    trainingMode: '',
    priorityList: {},
    autoPauseTime: 0,
    maxCharsFromError: 0,
    currentTTT: [],
    changeDifficulty: ()=>{},
    changeAutoPauseTime: ()=> {},
    newTTT: ()=> {},
});


export default function TypingSettingsProvider({children}) {
    const [difficulty, setDifficulty] = useState('easy');
    const [TTTLength, setTTTLength] = useState(150);
    const [trainingMode, setTrainingMode] = useState('Special Characters Emphasis');
    const [priorityList, setPriorityList] = useState(getPriorityList());
    const [autoPauseTime, setAutoPauseTime] = useState(10000);
    const [currentTTT, setCurrentTTT] = useState(generateNewTTT(difficulty, TTTLength, priorityList));
    const [maxCharsFromError, setMaxCharsFromError] = useState(8);

    const changeDifficulty = (event) => {
        setDifficulty(event.target.value);
    }
    const changeAutoPauseTime = (event) => {
        setAutoPauseTime(event.target.value);
    }
    const newTTT = () => {
        generateNewTTT(difficulty, TTTLength, priorityList);
    }
    return (
    <TypingSettingsContext.Provider
        value={{
            difficulty: difficulty,
            TTTLength: TTTLength,
            trainingMode: trainingMode,
            priorityList: priorityList,
            autoPauseTime: autoPauseTime,
            maxCharsFromError: maxCharsFromError,
            currentTTT: currentTTT,
            changeDifficulty: changeDifficulty,
            changeAutoPauseTime: changeAutoPauseTime,
            newTTT: newTTT,
        }
        }
    >
        {children}
    </TypingSettingsContext.Provider>
    );
}



