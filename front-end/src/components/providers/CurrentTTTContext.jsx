import React, {useState, useContext, useCallback, useEffect} from 'react';
import { TypingInputContext } from './TypingInputContext';
import { TypingStatsContext } from './TypingStatsContext';
import {TypingSettingsContext} from './TypingSettingsContext';
import {getPriorityList} from '../../lib/trainingModeUtils';
import generateNewTTT from '../../lib/generateNewTTT';

//initialize state structure here
export const CurrentTTTContext = React.createContext({
    currentTTT: [],
    newTTT: ()=> {},

});


export default function CurrentTTTProvider({children}) {
const typingSettingsContext = useContext(TypingSettingsContext);
const typingInputContext = useContext(TypingInputContext);
const newTTT = useCallback(() => {
    const newTTT = generateNewTTT(typingSettingsContext.difficulty, typingSettingsContext.TTTLength, getPriorityList());
    console.log('newTTT, ',newTTT);
    //update the parent components
    typingInputContext.getCurrentTTT(newTTT);
    setCurrentTTT(newTTT); 
},[typingSettingsContext.difficulty, typingSettingsContext.TTTLength, typingInputContext]);
const initialNewTTT = useCallback(() => {
    console.log('initial currentTTT State');
    return generateNewTTT(typingSettingsContext.difficulty, typingSettingsContext.TTTLength, getPriorityList());
},[typingSettingsContext.difficulty, typingSettingsContext.TTTLength]);
const [currentTTT, setCurrentTTT] = useState(initialNewTTT);

//on initial render , update the parent context
useEffect (()=> {
    typingInputContext.getCurrentTTT(currentTTT);
},[])


return (
    <CurrentTTTContext.Provider 
        value={{
            currentTTT: currentTTT,
            newTTT: newTTT,
        }}
    >
        {children}
    </CurrentTTTContext.Provider>
);
}
