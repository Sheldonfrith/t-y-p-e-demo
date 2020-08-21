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

    hiddenInput: null,
    colorList: {},
    isPaused: null,
    currentTTTStatus: null,
    pause: ()=>{},
    unPause: ()=>{},
    handleInput: ()=>{},
    handleKeyDown: ()=>{},
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
let tempColorList = [];



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
    const [currentKey, setCurrentKey]= useState(null);
    const [keyPressTrigger, setKeyPressTrigger] = useState(0);
    //first characters color should start as green
    const [colorList, setColorList] = useState({
        bg:currentSettings.currentTTT.map((char,index) => index===0?getClassNamesFromColor('green', 'bg'):getClassNamesFromColor('default', 'bg')),
        text:currentSettings.currentTTT.map((char,index) => getClassNamesFromColor('default', 'text')),
    })

    tempColorList = colorList;
    
    const setCurrentColor = useCallback((bgColor = null, textColor=null, index) => {
        console.log('setting current color ', bgColor, textColor, index);
        bgColor = bgColor?getClassNamesFromColor(bgColor, 'bg'): null;
        textColor = textColor? getClassNamesFromColor(textColor, 'text'):null;
        let newColorList = {
        bg: [...tempColorList.bg], 
        text: [...tempColorList.text], 
        }
        if (bgColor) {
            newColorList.bg[index] = bgColor
        }
        if (textColor) {
            newColorList.text[index] = textColor
        }
        tempColorList = newColorList;
    }, [colorList]);
    const setAllColor= useCallback((bgColor = null, textColor=null) => {
        bgColor = bgColor?getClassNamesFromColor(bgColor, 'bg'): null;
        textColor = textColor? getClassNamesFromColor(textColor, 'text'):null;
        //retain current values if new value isn't specified
        let newColorList = {
            bg: tempColorList.bg.map(color => bgColor?bgColor:color),
            text: tempColorList.text.map(color => textColor?textColor:color),
        }
        tempColorList = newColorList;
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
            console.log('ispaused use effect: ', isPaused);
            if(isPaused === true) {
                pauseOverlayDisplay = 'block';
                setAllColor(null, 'fade');
                startPause = new Date();
            }
            if (isPaused === false) {
                pauseOverlayDisplay = 'none';
                setAllColor(null, 'unfade');
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
        , [isPaused]
    )
    const pause = () => {
        setIsPaused(true);

    }
    const unPause = () => {
        setIsPaused(false);
        
    }
    const handleInput = (event) => {
        //clear the input box so only individual characters are returned from the input event
        setCurrentKey(event.target.value);
        setKeyPressTrigger(current => current+1);
    }
    const handleKeyDown = (event) => {
        //focus is assumed to be within input area, this should not fire otherwise
        const key = event.key
        //detect backspace event and handle it
        if(key ==='Backspace'){
        setCurrentKey(key);
        setKeyPressTrigger(current => current+1);
        }
        //detect tab event and prevent it from shifting focus away from input box
        if(key==='Tab'){
        event.preventDefault();
        }
    }
    //fire when keyTrigger Changes
    useEffect ( () => {
        if (currentKey===null) return;
        //only fire if currentKey has changed and index has changed (incase two identical keys)
        totalKeyPresses ++;
        
        console.log('currentkey useeffect :', currentKey);
        const handleTypingEventByType = async (eventType) => {
            let realCurrentIndex = errorIndex?errorIndex-1:currentCharIndex;
            console.log(eventType);
            switch (eventType) {
                case 'correct':
                    //TODO
                    currentStats.calcTypingSpeed(realCurrentIndex);
                    //TODO
                    currentStats.calcCharSpeed(currentKey);
                    //update correctlyTyped list
                    correctlyTypedChars[currentKey] = (correctlyTypedChars[currentKey]?correctlyTypedChars[currentKey]+1:1);
                    currentStats.updateWastedKeysPercentage(totalKeyPresses);
                    currentStats.updateAccuracyPercentage((errorState>0)?realCurrentIndex+2:realCurrentIndex+1);
                    //correct key press> current key white, move forward one, next key green
                    setCurrentColor('white',null, currentCharIndex);
                    currentCharIndex ++;
                    //detect if we are at the end of the text and if so stop listening for keypresses and exit
                    //also make sure we are not running this before the session has even started
                    if (currentCharIndex >= currentSettings.currentTTT.length && currentSettings.currentTTT.length >1) {
                        currentTTTStatus = 'finished';
                        //TODO and highlight the errors the user made
                        setAllColor(null, 'fade');
                        break;
                    }
                    setCurrentColor('green',null, parseInt(currentCharIndex));
                    break;
                case 'incorrect':
                    currentStats.incrementWastedKeys(totalKeyPresses);
                    errorState = 1;
                    errorIndex = currentCharIndex;
                    realCurrentIndex = errorIndex?errorIndex-1:currentCharIndex;
                    currentStats.newMistypedChar(currentSettings.currentTTT[currentCharIndex], (errorState>0)?realCurrentIndex+2:realCurrentIndex+1);
                    //detect and set barrier state
                    errorState > currentSettings.maxCharsFromError ? barrierState = true : barrierState = false;
                    //incorrect key press> current key red, move forward one, next key grey
                    setCurrentColor('red',null, currentCharIndex);
                    currentCharIndex ++;
                    setCurrentColor('grey', null, currentCharIndex);
                    break;
                case 'forward-error-state':
                    currentStats.incrementWastedKeys(totalKeyPresses);
                    //did we reach the maximum allowed chars from the error?
                    if (errorState > currentSettings.maxCharsFromError) {
                        //if so prevent userfrom doing anything but backspace
                        barrierState = true;
                        break;
                    }
                    errorState ++;
                    //any key press except backspace during error state> move forward one, next key grey
                    currentCharIndex ++;
                     setCurrentColor('grey', null, currentCharIndex);
                    break;
                case 'forward-barrier-state':
                    currentStats.incrementWastedKeys(totalKeyPresses);
                    break;
                case 'backspace-normal':
                    currentStats.incrementWastedKeys(totalKeyPresses);
                    //backspace with no error state> current key white, move back one, prev key green
                    //first check if back at beginning of text, don't allow to go any further
                    if (currentCharIndex ===0) return;
                     setCurrentColor('white',null, currentCharIndex);
                    currentCharIndex --;
                     setCurrentColor('green', null, currentCharIndex);
                    break;
                case 'backspace-error-state':
                    currentStats.incrementWastedKeys(totalKeyPresses);
                    //reduce inErrorState Count, make barrier state false
                    errorState --;
                    barrierState = false;
                    //if reached the error, remove the error index value
                    if (currentCharIndex <= errorIndex) errorIndex = null;
                    //backspace with error state> current key white, move back one, prev one same color unless its red then it becomes green
                    setCurrentColor('white',null,currentCharIndex);
                    currentCharIndex --;
                    //detect if this was the original error, make it green
                    if (currentCharIndex === errorIndex)  setCurrentColor('green', null, currentCharIndex);
                    break;
                default: 
                    console.log('error, detectkeypresstype did not catch that behaviour');
                    return;
    
            }
            //set the new state once:
            setColorList(tempColorList);
        }
        const detectTypingEventType =  () => {
            //are we listening for input right now? *handle finished typing event
            if (currentTTTStatus === 'finished') return;
            //is the typing paused?
            if (isPaused) return;
            //set timer for autoPause
            newPauseTimer();
    
            // variables for this function
            const correctChar = currentSettings.currentTTT[currentCharIndex];
    
            //Case 1: correct
            if (currentKey === correctChar && errorState < 1) {
                handleTypingEventByType('correct');
                return;
            }
            //Case 2: incorrect.... wrong key pressed, not backspace, and not already in an error state
            if (currentKey !== correctChar && currentKey !== 'Backspace' && errorState < 1) {
                handleTypingEventByType('incorrect');
                return;
            }
            //Case 3: forward error state
            if (errorState > 0 && barrierState === false && currentKey !== 'Backspace') {
                handleTypingEventByType('forward-error-state');
                return;
            }
            //Case 4: forward barrier state
            if (barrierState === true && currentKey !== 'Backspace') {
                handleTypingEventByType('forward-barrier-state');
                return;
            }
            //Case 5: backspace normal
            if (currentKey === 'Backspace' && errorState < 1 && barrierState === false) {
                handleTypingEventByType('backspace-normal');
                return;
            }
            //Case 6: backspace error state
            if (currentKey === 'Backspace' && (errorState > 0 || barrierState === true)) {
                handleTypingEventByType('backspace-error-state');
                return;
            }
            console.log('error, detectkeypresstype did not catch that behaviour');
        }
        const callAll= () => {
        detectTypingEventType();
        setHiddenInputVal('');
        }
        callAll();
    },
    [keyPressTrigger]);

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
        }
        }
    >
        {children}
    </TypingInputContext.Provider>
    );
}



