import React, {useState, useEffect,useCallback} from 'react';
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
    newTTTReset: ()=>{},
    changeAutoPauseTime: ()=>{},
    getCurrentTTT: ()=>{},
});

let pauseOverlayDisplay = 'none'; //either none or block
let finishedOverlayDisplay = 'none';
let currentTTTStatus = 'not-started';
let currentCharIndex = 0;
let totalKeyPresses = 0;
let correctlyTypedChars = {};
let errorState = 0;
let barrierState = false;
let errorIndex = null;
let startPause = null;
let endPause = null;
let tempColorList = [];
let prevCurrentTTT1 = null;
let prevCurrentTTT2 = null;
let prevIsPaused1 = null;
let prevKeyPressTrigger1 = null;


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
    
    const [autoPauseTime, setAutoPauseTime] = useState(10000);
    const [hiddenInputVal, setHiddenInputVal] = useState('');
    const [isPaused, setIsPaused] = useState(null);
    const [currentKey, setCurrentKey]= useState(null);
    const [keyPressTrigger, setKeyPressTrigger] = useState(0);
    const [currentTTT, setCurrentTTT] = useState([]);
    const [colorList, setColorList] = useState({bg:[getClassNamesFromColor('green','bg')],text:[getClassNamesFromColor('default','text')]});
    tempColorList = colorList;

    const updateColorList =useCallback((customTTT = currentTTT) =>{
        if (!customTTT) return;
        const newColorList ={
            bg:customTTT.map((char,index) => index===0?getClassNamesFromColor('green', 'bg'):getClassNamesFromColor('default', 'bg')),
            text:customTTT.map((char,index) => getClassNamesFromColor('default', 'text')),
        };
        setColorList(newColorList);
        tempColorList = newColorList;
    },[currentTTT]);
    const getCurrentTTT = useCallback((newTTT)=>{
        console.log('setting current ttt in typinginputcontext, colorlist is : ', colorList)
        updateColorList(newTTT);
        setCurrentTTT(newTTT);
    },[colorList, updateColorList]);

    //whenever TTT updates reset the colorlist
    useEffect(()=>{
        if (prevCurrentTTT1 === currentTTT) return;
        if (!currentTTT || !currentTTT.length) return;
        console.log('useEffect current TTT update, set colorList', currentTTT)
        updateColorList();
        prevCurrentTTT1 = currentTTT;
    },[currentTTT, updateColorList])
    //first characters color should start as green

    const setCurrentColor = useCallback((bgColor = null, textColor=null, index) => {
        // console.log('setting current color ', bgColor, textColor, index);
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
    },[] );
    const setAllColor= useCallback( (bgColor = null, textColor=null) => {
        tempColorList = colorList;
        console.log('setting all color; bg color',bgColor, 'text color', textColor, 'colorlist', tempColorList);
        bgColor = bgColor?getClassNamesFromColor(bgColor, 'bg'): null;
        textColor = textColor? getClassNamesFromColor(textColor, 'text'):null;
        //retain current values if new value isn't specified
        let newColorList = {
            bg: tempColorList.bg.map(color => bgColor?bgColor:color),
            text: tempColorList.text.map(color => textColor?textColor:color),
        }
        tempColorList = newColorList;
    },[colorList, ]);
    const newPauseTimer = useCallback((totalKeyPressesBeforeTimeout) => {
        setTimeout(() => {
        console.log('autopause timer done:', totalKeyPressesBeforeTimeout, totalKeyPresses);
        if (totalKeyPressesBeforeTimeout === totalKeyPresses){
            console.log('pausing due to timeout');
            pause();
        }
        return;
        }
        ,autoPauseTime
        );
    }, [autoPauseTime,]);

    const changeAutoPauseTime = useCallback((event, value) => {
        setAutoPauseTime(value);
    },[]);

    //run these changes whenever isPaused changes:
    useEffect(
        () => {
            if (prevIsPaused1 === isPaused) return;
            if(isPaused === true) {
                console.log('useeffect, detected pause');
                pauseOverlayDisplay = 'block';
                // setAllColor(null, 'fade');
                startPause = new Date();
                setColorList(tempColorList);
                prevIsPaused1 = isPaused;
            }
            if (isPaused === false) {
                console.log('useeffect, detected unpause');
                pauseOverlayDisplay = 'none';
                // setAllColor(null, 'unfade');
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
                setColorList(tempColorList);
                prevIsPaused1 = isPaused;
            }
            return;
        }
        , [isPaused, currentStats, setAllColor]
    )
    const pause = useCallback(() => {
         // dont fire if status is finished
         if (currentTTTStatus === 'finished') return;
         setIsPaused(true);
    },[]);
    const unPause = useCallback(() => {
        //don't fire at the begging of the app loading
        if (isPaused=== null) return;
        // dont fire if status is finished
        if (currentTTTStatus === 'finished') return;
        setIsPaused(false);    
    },[isPaused]);
    const endTTT = useCallback(()=>{
        console.log('current TTT finished');
        currentTTTStatus = 'finished';
        //color in all errors red
        currentStats.errorIndexes.forEach(errorIndex => {
            setCurrentColor('red',null,errorIndex);
        })

    },[setCurrentColor, currentStats.errorIndexes]);
    const handleInput = useCallback((event) => {
        //clear the input box so only individual characters are returned from the input event
        setCurrentKey(event.target.value);
        setKeyPressTrigger(current => current+1);
    },[]);
    const handleKeyDown = useCallback((event) => {
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
    },[]);
    //fire when keyTrigger Changes or currentTTT changes
    useEffect ( () => {

        //check that either key trigger or current TTT has changed
        if (prevKeyPressTrigger1 === keyPressTrigger && prevCurrentTTT2 === currentTTT) return;
        //only fire if currentKey has changed and index has changed (incase two identical keys)
        if (currentKey===null || keyPressTrigger === 0) return;
        totalKeyPresses ++;

        console.log('currentkey useeffect :', currentKey);
        const handleTypingEventByType = (eventType) => {
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
                    //*ENd of TTT
                    if (currentCharIndex >= currentTTT.length && currentTTT.length >1) {
                        endTTT();
                        break;
                    }
                    setCurrentColor('green',null, parseInt(currentCharIndex));
                    break;
                case 'incorrect':
                    currentStats.incrementWastedKeys(totalKeyPresses);
                    errorState = 1;
                    errorIndex = currentCharIndex;
                    realCurrentIndex = errorIndex?errorIndex-1:currentCharIndex;
                    currentStats.newMistypedChar(currentTTT[currentCharIndex], (errorState>0)?realCurrentIndex+2:realCurrentIndex+1, errorIndex);
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
                    setCurrentColor('white',null,currentCharIndex);
                    //if reached the error, remove the error index value
                    //! 
                    if (currentCharIndex === errorIndex+1){
                        errorIndex = null;
                        errorState = 0;
                        currentCharIndex --;
                        setCurrentColor('green',null,currentCharIndex);
                    }
                    else {currentCharIndex --;}

                    // if (currentCharIndex <= errorIndex) errorIndex = null;
                    // //backspace with error state> current key white, move back one, prev one same color unless its red then it becomes green
                    // setCurrentColor('white',null,currentCharIndex);
                    // currentCharIndex --;
                    // //detect if this was the original error, make it green
                    // if (currentCharIndex === errorIndex)  setCurrentColor('green', null, currentCharIndex);
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
            newPauseTimer(parseInt(totalKeyPresses));
    
            // variables for this function
            const correctChar = currentTTT[currentCharIndex];
            console.log('correct char', correctChar, currentCharIndex, currentTTT)
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
        console.log('callAll, relevant key detected');
        detectTypingEventType();
        setHiddenInputVal('');
        }
        callAll();
        prevCurrentTTT2 = currentTTT;
        prevKeyPressTrigger1 = keyPressTrigger;
        return function cleanup() {
            //cleanup the setTimeout function for the autoPauseTimer
            clearInterval(newPauseTimer);
        }
    },
    [keyPressTrigger, currentTTT, currentKey, currentSettings.maxCharsFromError, currentStats, isPaused,
    newPauseTimer, setAllColor, setCurrentColor, endTTT]);

    const newTTTReset = useCallback(() => {
        console.log('currentSettings:', currentTTT);
        setIsPaused(true);
        setCurrentKey('');
        setKeyPressTrigger(0);
        setColorList({
            bg:currentTTT.map((char,index) => index===0?getClassNamesFromColor('green', 'bg'):getClassNamesFromColor('default', 'bg')),
            text:currentTTT.map((char,index) => getClassNamesFromColor('default', 'text')),
        })
        currentTTTStatus = 'not-started';
        currentCharIndex = 0;
        totalKeyPresses = 0;
        correctlyTypedChars = {};
        errorState = 0;
        barrierState = false;
        errorIndex = null;
        startPause = null;
        endPause = null;
        tempColorList = [];
        console.log('done input');
    },[currentTTT,]);
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
            newTTTReset: newTTTReset,
            changeAutoPauseTime: changeAutoPauseTime,
            getCurrentTTT: getCurrentTTT,
            currentTTTStatus: currentTTTStatus,
        }
        }
    >
        {children}
    </TypingInputContext.Provider>
    );
}



