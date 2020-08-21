import React, {useState, useCallback} from 'react';
import { useContext } from 'react';
import { TypingInputContext } from './providers/TypingInputContext';
import { useEffect } from 'react';

export default function TTTCharacter(props) {
const [currentClassName, setCurrentClassName] = useState('default');
const typingInputContext = useContext(TypingInputContext);

const getClassName = useCallback(() => {
    return (typingInputContext.colorList.bg[props.index]+' '+typingInputContext.colorList.text[props.index]);
}, [typingInputContext.colorList, props]);
//update the color on change of the master list
useEffect(
    () => {
        setCurrentClassName(getClassName());
    }
    , [typingInputContext.colorList, getClassName]
)
return (
    <span className={currentClassName}>
        {props.char}
    </span>
);
}
