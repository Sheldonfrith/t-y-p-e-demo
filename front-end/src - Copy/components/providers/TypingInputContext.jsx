import React, {useState, useEffect,useCallback} from 'react';
import {getPriorityList} from '../../lib/trainingModeUtils'
import generateNewTTT from '../../lib/generateNewTTT'
import { useContext } from 'react';
import { TypingSettingsContext } from './TypingSettingsContext';
import { TypingStatsContext } from './TypingStatsContext';

//initialize state structure here
export const TypingInputContext = React.createContext({

    //when either the hidden input onchange is fired or the correct type of keydown event
    //then this component should detect the type of event that occured and update the ui and 
    //data accordingly

    //when typing is paused or unpaused update the ui and stats data accordingly

    hiddenInput: '',
    colorList: {},
    isPaused: false,
    currentTTTStatus: '',
    pause: ()=>{},
    unPause: ()=>{},
    handleInput: ()=>{},
    handleKeyDown: ()=>{},
    isPausedPrevious: false,
});

let pauseOverlayDisplay = 'none'; //either none or block
let currentTTTStatus = 'not-started';
let currentCharIndex = 0;
let previousCharIndex = (-1);
let totalKeyPresses = 0;
let correctlyTypedChars = {};
let errorState = 0;
let barrierState = false;
let errorIndex = null;
let startPause = null;
let endPause = null;



const getClassNamesFromColor = (color, textOrBackground) => {
    if (textOrBackground === 'bg') {
        switch (color) {
            case ('white' || 'default'):
                return 'white';
            case 'red':
                return 'red';
            case 'green':
                return 'green';
            case 'grey':
                return 'grey';
            default:
                return 'white';
        }
    }
    if (textOrBackground === 'text') {
        switch(color) {
            case ('normal' || 'default'|| 'unfade'):
                return 'blackText';
            case 'fade':
                return 'greyText';
            default:
                return 'blackText';
        }
    }
}


export default function TypingInputProvider({children}) {
    const currentSettings = useContext(TypingSettingsContext);
    const currentStats = useContext(TypingStatsContext);
    
    const [hiddenInputVal, setHiddenInputVal] = useState('');
    const [isPaused, setIsPaused] = useState(null);
    const [isPausedPrevious, setIsPausedPrevious] = useState(null);
    const [currentKey, setCurrentKey]= useState(null);
    const [currentKeyPrevious, setCurrentKeyPrevious] = useState(null);
    const [colorList, setColorList] = useState({
        bg:currentSettings.currentTTT.map(char => getClassNamesFromColor('default', 'bg')),
        text:currentSettings.currentTTT.map(char => getClassNamesFromColor('default', 'text')),
    })
    
    const setCurrentColor = useCallback((bgColor = null, textColor=null) => {
        bgColor = bgColor?getClassNamesFromColor(bgColor, 'bg'): null;
        textColor = textColor? getClassNamesFromColor(textColor, 'text'):null;
        let newColorList = [...colorList];
        newColorList.bg[currentCharIndex] = bgColor
        newColorList.text[currentCharIndex] = textColor
        setColorList(newColorList);
    }, [colorList]);
    const setAllColor= useCallback((bgColor = null, textColor=null) => {
        bgColor = bgColor?getClassNamesFromColor(bgColor, 'bg'): null;
        textColor = textColor? getClassNamesFromColor(textColor, 'text'):null;
        let newColorList = {
            bg: colorList.bg.map(color => bgColor?bgColor:color),
            text: colorList.text.map(color => textColor?textColor:color),
        }
        setColorList(newColorList);
    }, [colorList]);
    const newPauseTimer = useCallback(() => {
        const totalKeyPressesBeforeTimeout = totalKeyPresses;
        setTimeout(() => {
        if (totalKeyPressesBeforeTimeout === totalKeyPresses){
            pause();
        }
        return;
        }
        ,currentSettings.autoPauseTime
        );
    }, [currentSettings.autoPauseTime]);

    //run these changes whenever isPaused changes:
    useEffect(
        () => {
            //only run if isPaused has changed
            if (isPausedPrevious === isPaused) return;
            console.log('ispaused use effect: ', isPaused);
            if(isPaused === true) {
                pauseOverlayDisplay = 'block';
                setAllColor('fade');
                startPause = new Date();
            }
            if (isPaused === false) {
                pauseOverlayDisplay = 'none';
                setAllColor('unfade');
                //stats related stuff:
                //only do this if the TTT was already active
                if (currentTTTStatus !== 'not-started') {
                    //record end of pause period
                    endPause = new Date();
                    //colculate total duration of the pause
                    let pauseDuration = endPause-startPause;
                    //remove 10 miliseconds from pauseDuration just incase there is any async issues
                    //or the code is excecuting so fast that it sets startTime and lastCharTime to 0
                    //below...
                    pauseDuration += 10;
                    currentStats.unPauseUpdate(pauseDuration);
                }
            }
            return;
        }
        , [isPaused, currentStats, setAllColor]
    )
    const pause = () => {
        setIsPausedPrevious(false);
        setIsPaused(true);

    }
    const unPause = () => {
        setIsPausedPrevious(true);
        setIsPaused(false);
        
    }
    

    const handleInput = (event) => {
        //clear the input box so only individual characters are returned from the input event
        setCurrentKey(event.target.value);
    }
    const handleKeyDown = (event) => {
        //focus is assumed to be within input area, this should not fire otherwise

        const key = event.key
        //detect backspace event and handle it
        if(key ==='Backspace'){
        setCurrentKey(key);
        }
        //detect tab event and prevent it from shifting focus away from input box
        if(key==='Tab'){
        event.preventDefault();
        }
    }
    //fire when currentKey Changes
    useEffect ( () => {
        if (currentKey===null) return;
        //only fire if currentKey has changed and index has changed (incase two identical keys)
        // these two lines prevent infinite loops
        if (currentCharIndex === previousCharIndex && barrierState === false) return;
        if (barrierState === true && currentKey === currentKeyPrevious) return;

        console.log('currentkey useeffect :', currentKey);
        const handleTypingEventByType = async (eventType) => {
            console.log(eventType);
            switch (eventType) {
                case 'correct':
                    //TODO
                    const realCurrentIndex = errorIndex?errorIndex:currentCharIndex;
                    currentStats.calcTypingSpeed(realCurrentIndex);
                    //TODO
                    currentStats.calcCharSpeed(currentKey);
                    //update correctlyTyped list
                    correctlyTypedChars[currentKey] = (correctlyTypedChars[currentKey]?correctlyTypedChars[currentKey]+1:1);
    
                    //correct key press> current key white, move forward one, next key green
                    await setCurrentColor('white');
                    currentCharIndex ++;
                    //detect if we are at the end of the text and if so stop listening for keypresses and exit
                    //also make sure we are not running this before the session has even started
                    if (currentCharIndex >= currentSettings.currentTTT.length && currentSettings.currentTTT.length >1) {
                        currentTTTStatus = 'finished';
                        //TODO and highlight the errors the user made
                        await setCurrentColor('fade');
                        return;
                    }
                    await setCurrentColor('green');
                    return;
                case 'incorrect':
                    currentStats.incrementWastedKeys();
                    currentStats.newMistypedChar(currentSettings.currentTTT[currentCharIndex]);
                    errorState = 1;
                    errorIndex = currentCharIndex;
                    //detect and set barrier state
                    errorState > currentSettings.maxCharsFromError ? barrierState = true : barrierState = false;
                    //incorrect key press> current key red, move forward one, next key grey
                    await setCurrentColor('red');
                    currentCharIndex ++;
                    await setCurrentColor('grey');
                    return;
                case 'forward-error-state':
                    currentStats.incrementWastedKeys();
                    //did we reach the maximum allowed chars from the error?
                    if (errorState > currentSettings.maxCharsFromError) {
                        //if so prevent userfrom doing anything but backspace
                        barrierState = true;
                        return;
                    }
                    errorState ++;
                    //any key press except backspace during error state> move forward one, next key grey
                    currentCharIndex ++;
                    await setCurrentColor('grey');
                    return;
                case 'forward-barrier-state':
                    currentStats.incrementWastedKeys();
                    return;
                case 'backspace-normal':
                    currentStats.incrementWastedKeys();
                    //backspace with no error state> current key white, move back one, prev key green
                    //first check if back at beginning of text, don't allow to go any further
                    if (currentCharIndex ===0) return;
                    await setCurrentColor('white');
                    currentCharIndex ++;
                    await setCurrentColor('green');
                    return;
                case 'backspace-error-state':
                    currentStats.incrementWastedKeys();
                    //reduce inErrorState Count, make barrier state false
                    errorState --;
                    barrierState = false;
                    //if reached the error, remove the error index value
                    if (currentCharIndex <= errorIndex) errorIndex = null;
                    //backspace with error state> current key white, move back one, prev one same color unless its red then it becomes green
                    await setCurrentColor('white');
                    currentCharIndex --;
                    //detect if this was the original error, make it green
                    if (currentCharIndex === errorIndex) await setCurrentColor('green');
                    return;
                default: 
                    console.log('error, detectkeypresstype did not catch that behaviour');
                    return;
    
            }
        }
        const detectTypingEventType = async () => {
            //are we listening for input right now? *handle finished typing event
            if (currentTTTStatus === 'finished') return;
            //is the typing paused?
            if (isPaused) return;
            //increase the total key count, used to detect inactivity with pause timer
            totalKeyPresses ++;
            //set timer for autoPause
            newPauseTimer();
    
            // variables for this function
            const correctChar = currentSettings.currentTTT[currentCharIndex];
    
            //Case 1: correct
            if (currentKey === correctChar && errorState < 1) {
                await handleTypingEventByType('correct');
                return;
            }
            //Case 2: incorrect.... wrong key pressed, not backspace, and not already in an error state
            if (currentKey !== correctChar && currentKey !== 'Backspace' && errorState < 1) {
                await handleTypingEventByType('incorrect');
                return;
            }
            //Case 3: forward error state
            if (errorState > 0 && barrierState === false && currentKey !== 'Backspace') {
                await handleTypingEventByType('forward-error-state');
                return;
            }
            //Case 4: forward barrier state
            if (barrierState === true && currentKey !== 'Backspace') {
                await handleTypingEventByType('forward-barrier-state');
                return;
            }
            //Case 5: backspace normal
            if (currentKey === 'Backspace' && errorState < 1 && barrierState === false) {
                await handleTypingEventByType('backspace-normal');
                return;
            }
            //Case 6: backspace error state
            if (currentKey === 'Backspace' && (errorState > 0 || barrierState === true)) {
                await handleTypingEventByType('backspace-error-state');
                return;
            }
            console.log('error, detectkeypresstype did not catch that behaviour');
        }
        const callAll= async () => {
        await detectTypingEventType();
        await setHiddenInputVal('');
        }
        callAll();
    },
    [currentKey, setHiddenInputVal, currentSettings.currentTTT, currentSettings.maxCharsFromError,currentStats, isPaused, newPauseTimer, setCurrentColor]);

    return (
    <TypingInputContext.Provider
        value={{
            hiddenInputVal: hiddenInputVal,
            colorList: colorList,
            isPaused: isPaused,
            pauseOverlayDisplay: pauseOverlayDisplay,
            pause: pause,
            unPause: unPause,
            handleInput: handleInput,
            handleKeyDown: handleKeyDown,
            isPausedPrevious: isPausedPrevious,
        }
        }
    >
        {children}
    </TypingInputContext.Provider>
    );
}



