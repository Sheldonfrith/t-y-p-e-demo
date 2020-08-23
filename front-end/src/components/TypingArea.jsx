import React, {useState, useEffect, useContext, useRef} from 'react';
import TTTCharacter from './TTTCharacter'
import {TypingInputContext} from './providers/TypingInputContext'
import {TypingSettingsContext} from './providers/TypingSettingsContext'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { CurrentTTTContext } from './providers/CurrentTTTContext';

let prevPauseTrigger = null;
export default function TypingArea(props) {

const typingSettingsContext = useContext(TypingSettingsContext);
const typingInputContext = useContext(TypingInputContext);
const currentTTT = useContext(CurrentTTTContext);
const hiddenInputRef = useRef();
const [pauseOverlayDisplay, setPauseOverlayDisplay] = useState('none');

//when unpaused focus the hidden input
useEffect(
   () => {
       if (typingInputContext.isPaused === false) {
        hiddenInputRef.current.focus();
        //also change display of pauseOverlay
        setPauseOverlayDisplay('none');
       }
       if (typingInputContext.isPaused === true) {
           setPauseOverlayDisplay('block');
       }
   }, [typingInputContext.isPaused, hiddenInputRef]
)

//on initial render, focus the hidden input
useEffect(
    () => {
        document.activeElement.blur();
        hiddenInputRef.current.focus();
    }, []
)

//when pauseTrigger changes, send a unpause event
useEffect(()=> {
    if (prevPauseTrigger === props.pauseTrigger) return;
    typingInputContext.unPause();
    prevPauseTrigger = props.pauseTrigger;
}, [props.pauseTrigger, typingInputContext])


return (
    <ClickAwayListener onClickAway={() => typingInputContext.pause()}>

    <div className={'typingAreaContainer'}>
    <div onKeyDown={typingInputContext.handleKeyDown} onClick={typingInputContext.unPause}>
        
        {currentTTT.currentTTT?
        currentTTT.currentTTT.map((char, index) => <TTTCharacter char={char} index={index} key={'tttchar'+index} className={typingInputContext.colorList.bg[index]+' '+typingInputContext.colorList.text[index]}/>)
        :null}

      
    <div>
      <input 
        id="hiddenInput" 
        type="text" 
        value={typingInputContext.hiddenInputVal} 
        className="hiddenInput" 
        style={{opacity: 0}} 
        onChange={typingInputContext.handleInput}
        onBlur={typingInputContext.pause} 
        onFocus={typingInputContext.unPause}
        disabled={typingInputContext.isPaused}
        ref={hiddenInputRef}
        />
    </div>
    </div>
    <div className="pauseOverlay"  style={{display: pauseOverlayDisplay}}>
        <div className="pauseOverlayText" >Paused. Press Esc to unpause.</div>
      </div>
    </div>
    </ClickAwayListener>
);
}
