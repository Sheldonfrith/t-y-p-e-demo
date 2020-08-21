import React, { useState, useEffect } from 'react';
import { getPriorityList } from '../../lib/trainingModeUtils'
import generateNewTTT from '../../lib/generateNewTTT'
import _ from 'lodash'

//initialize state structure here
export const TypingStatsContext = React.createContext({
    WPM: 0,
    mistypedChars: 0,
    accuracy: 0,
    wastedKeys: 0,
    worstChar: '',
    incrementWastedKeys: () => { },
    newMistypedChar: () => { },
    calcTypingSpeed: () => { },
    calcCharSpeed: () => { },
    unPauseUpdate: ()=> {},
});


export default function TypingStatsProvider({ children }) {
    const [WPM, setWPM] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [wastedKeys, setWastedKeys] = useState(0);
    const [worstChar, setWorstChar] = useState('');
    const [mistypedChars, setMistypedChars] = useState({});
    const [characterSpeeds, setCharacterSpeeds] = useState({});
    const [lastCharTime, setLastCharTime] = useState(null);
    //non state variables
    let TTTStartTime = null;

    const unPauseUpdate = (pauseDuration) => {
        TTTStartTime = TTTStartTime + pauseDuration;
        lastCharTime = lastCharTime + pauseDuration;
    }

    const insertCharacterSpeed = (char, time) => {
        //this function adds the total time taken to type each character to that character's
        //spot in the characterSpeeds object
        let newCharacterSpeeds = characterSpeeds;
        _.set(newCharacterSpeeds, char, newCharacterSpeeds[char]?newCharacterSpeeds[char]+time:time );
        setCharacterSpeeds(newCharacterSpeeds);
    }

    const newMistypedChar = (correctChar) => {
        let newMistypedChars = mistypedChars;
        _.set(newMistypedChars, correctChar, mistypedChars[correctChar] ? mistypedChars[correctChar] + 1 : 1);
        setMistypedChars(newMistypedChars);
    }
    const incrementWastedKeys = () => {
        setWastedKeys(wastedKeys + 1);
    }
    const calcTypingSpeed = (realCurrentIndex) => {
        //5 characters, in this case significant, required keystrokes (if backspace is required than it counts)
        //counts as one 'word' in the wpm calculation
        //the calculation starts when the first letter is successfully typed, this time is recorded and used
        //to calculate time elapsed after each 5 successfull characters

        //detecti if this is the first correct key press? if so initialize the starttime variable
        if (TTTStartTime === null) {
            TTTStartTime = new Date();
        }
        //(current real index / 5 = words) / time since start in minutes
        const curTime = new Date();
        let timeDiff = Math.abs(curTime - TTTStartTime);
        //to avoid using async, add one to time diff if it equals zero
        if (timeDiff === 0) { timeDiff = 1 };
        const words = realCurrentIndex / 5.0;
        const minutes = timeDiff / 60000.0;
        setWPM(Math.floor(words / minutes));
    }

    const calcCharSpeed = (char) => {
        // if char input is a character code, convert it to string
        if (typeof char === 'number') char = String.fromCharCode(char);

        const curTime = new Date();
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
                worstChar: worstChar,
                incrementWastedKeys: incrementWastedKeys,
                newMistypedChar: newMistypedChar,
                calcCharSpeed: calcCharSpeed,
                calcTypingSpeed: calcTypingSpeed,
                unPauseUpdate: unPauseUpdate,
            }
            }
        >
            {children}
        </TypingStatsContext.Provider>
    );
}



