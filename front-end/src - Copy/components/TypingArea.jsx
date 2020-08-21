import React, {useState, useEffect, useContext, useRef} from 'react';
import TTTCharacter from './TTTCharacter'
import {TypingInputContext} from './providers/TypingInputContext'
import {TypingSettingsContext} from './providers/TypingSettingsContext'

export default function TypingArea(props) {

const typingSettingsContext = useContext(TypingSettingsContext);
const typingInputContext = useContext(TypingInputContext);
const hiddenInputRef = useRef();

//when unpaused, and on initial render, focus the hidden input
useEffect(
   () => {
    if (!typingInputContext.isPaused) {
        document.activeElement.blur();
        hiddenInputRef.current.focus();
    }
   }, [typingInputContext.isPaused]
)
return (
    <div onKeyDown={typingInputContext.handleKeyDown} onClick={typingInputContext.unPause}>
        
        {typingSettingsContext.currentTTT.map((char, index) => <TTTCharacter char={char} index={index} key={'tttchar'+index}/>)}

      <div id="pauseOverlay"  style={{display: typingInputContext.pauseOverlayDisplay}}>
        <div id="pauseOverlayText" >Paused. Press Esc to unpause.</div>
      </div>

      <input 
        id="hiddenInput" 
        type="text" 
        value={typingInputContext.hiddenInputVal} 
        className="hiddenInput" 
        //TODO add a ref and useeffect to focus the input when isPaused becomes false
                //set focus to input box unless already in focus, blur current element

        // onInput={typingInputContext.handleInput} 
        onChange={typingInputContext.handleInput}
        onBlur={typingInputContext.pause} 
        onFocus={typingInputContext.unPause}
        disabled={typingInputContext.isPaused}
        ref={hiddenInputRef}
        />

    </div>
);
}
