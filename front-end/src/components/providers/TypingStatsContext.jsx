import React, { useState, useEffect, useCallback } from 'react';

import { getPriorityList } from '../../lib/trainingModeUtils'
import generateNewTTT from '../../lib/generateNewTTT'
import _ from 'lodash'

//initialize state structure here
export const TypingStatsContext = React.createContext({
    WPM: 0,
    mistypedChars: 0,
    accuracy: 0,
    wastedKeys: 0,
    getWorstChar: ()=> {},
    incrementWastedKeys: () => { },
    newMistypedChar: () => { },
    calcTypingSpeed: () => { },
    calcCharSpeed: () => { },
    unPauseUpdate: ()=> {},
    wastedKeysPercentage: ()=> {},
    updateAccuracyPercentage: ()=> {},
    updateWastedKeysPercentage: ()=> {},
});

let TTTStartTime = null;



export default function TypingStatsProvider({ children }) {
    const [WPM, setWPM] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [wastedKeys, setWastedKeys] = useState(0);
    const [wastedKeysPercentage, setWastedKeysPercentage] = useState(0);
    const [mistypedChars, setMistypedChars] = useState({});
    const [characterSpeeds, setCharacterSpeeds] = useState({
    });// structure {char: {totalTime: , timesTyped: }, ...}
    const [averageCharSpeeds, setAverageCharSpeeds] = useState({
    }); 
    const [lastCharTime, setLastCharTime] = useState(null);
    //non state variables

    //udpate average character speeds
    useEffect(()=> {
        let newAverageCharSpeeds = {};
        Object.keys(characterSpeeds).map(
            char => {
            console.log(characterSpeeds[char]);
            const thisAverage = (characterSpeeds[char].totalTime/characterSpeeds[char].timesTyped*1.0);
            _.set(newAverageCharSpeeds,char,thisAverage);
            }
        );
        setAverageCharSpeeds(newAverageCharSpeeds);

    }, [JSON.stringify(characterSpeeds)])

    const getWorstChar = useCallback(() => {
        const vals = Object.values(averageCharSpeeds);
        let slowestCharVal = 0;
        let slowestCharKey = '';
        Object.keys(averageCharSpeeds).forEach(char => {
            if (slowestCharVal < averageCharSpeeds[char]) {
                slowestCharKey = char;
                slowestCharVal = averageCharSpeeds[char];
            }
        }
        );
        console.log(slowestCharKey)
        return slowestCharKey;        
    }, [averageCharSpeeds]);

    const unPauseUpdate = (pauseDuration) => {
        TTTStartTime = TTTStartTime + pauseDuration;
        lastCharTime = lastCharTime + pauseDuration;
    }

    const insertCharacterSpeed = (char, time) => {
        //this function adds the total time taken to type each character to that character's
        //spot in the characterSpeeds object, as well as the total times typed, for average calculationns
        const newCharacterSpeeds = characterSpeeds;
        const oldCharObj = newCharacterSpeeds[char]?newCharacterSpeeds[char]:{};
        const newTotalTime = time + (oldCharObj.totalTime?oldCharObj.totalTime:0);
        const newTimesTyped = 1 + (oldCharObj.timesTyped?oldCharObj.timesTyped:0);
        const newCharObj = {totalTime: newTotalTime, timesTyped: newTimesTyped};
        _.set(newCharacterSpeeds, char, newCharObj); 
        setCharacterSpeeds(newCharacterSpeeds);
    }

    const newMistypedChar = (correctChar, totalRealCharacters) => {
        let newMistypedChars = mistypedChars;
        _.set(newMistypedChars, correctChar, mistypedChars[correctChar] ? mistypedChars[correctChar] + 1 : 1);
        const totalMistypedChars = Object.keys(newMistypedChars).reduce((total,char)=> total+newMistypedChars[char],0)
        setAccuracy(100.0-(totalMistypedChars/(totalRealCharacters/100.0)));  
        setMistypedChars(newMistypedChars);
    }
    const updateAccuracyPercentage =(totalRealCharacters) => {
        const totalMistypedChars = Object.keys(mistypedChars).reduce((total,char)=> total+mistypedChars[char],0)
        setAccuracy(100.0-(totalMistypedChars/(totalRealCharacters/100.0)));
    }
    const incrementWastedKeys = (totalCharactersTyped) => {
        setWastedKeysPercentage((wastedKeys+1)/(totalCharactersTyped/100));
        setWastedKeys(wastedKeys + 1);
    }

    const updateWastedKeysPercentage = (totalCharactersTyped) => {
        setWastedKeysPercentage((wastedKeys)/(totalCharactersTyped/100));
    }
    const calcTypingSpeed = (realCurrentIndex) => {
        //5 characters, in this case significant, required keystrokes (if backspace is required than it counts)
        //counts as one 'word' in the wpm calculation
        //the calculation starts when the first letter is successfully typed, this time is recorded and used
        //to calculate time elapsed after each 5 successfull characters

        //detecti if this is the first correct key press? if so initialize the starttime variable
        if (TTTStartTime === null) {
            TTTStartTime = Date.now();
        }
        //(current real index / 5 = words) / time since start in minutes
        let timeDiff = Math.abs(Date.now() - TTTStartTime);

        //to avoid using async, add one to time diff if it equals zero
        if (timeDiff === 0) { timeDiff = 1 };
        const words = realCurrentIndex / 5.0;
        const minutes = timeDiff / 60000.0;
        setWPM(Math.floor(words / minutes));
    }

    const calcCharSpeed = (char) => {
        // if char input is a character code, convert it to string
        if (typeof char === 'number') char = String.fromCharCode(char);

        const curTime = Date.now();
        //handle the first character typed
        if (lastCharTime === null) {
            //set the lastCharTime to the current time
            setLastCharTime(curTime);
            //do not alter the charSpeed object, since the speed for the first char is 
            //always unknown
            return;
        }
        //handle all characters after the first
        insertCharacterSpeed(char, (curTime - lastCharTime))
        setLastCharTime(curTime);
    }

    return (
        <TypingStatsContext.Provider
            value={{
                WPM: WPM,
                accuracy: accuracy,
                wastedKeys: wastedKeys,
                getWorstChar: getWorstChar,
                incrementWastedKeys: incrementWastedKeys,
                newMistypedChar: newMistypedChar,
                calcCharSpeed: calcCharSpeed,
                calcTypingSpeed: calcTypingSpeed,
                unPauseUpdate: unPauseUpdate,
                wastedKeysPercentage: wastedKeysPercentage,
                updateAccuracyPercentage: updateAccuracyPercentage,
                updateWastedKeysPercentage: updateWastedKeysPercentage,
            }
            }
        >
            {children}
        </TypingStatsContext.Provider>
    );
}



