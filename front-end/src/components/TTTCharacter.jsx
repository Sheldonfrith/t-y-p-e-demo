import React, {useState, useCallback} from 'react';
import { useContext } from 'react';
import { TypingInputContext } from './providers/TypingInputContext';
import { useEffect } from 'react';

export default function TTTCharacter(props) {
const [currentClassName, setCurrentClassName] = useState('default');
const typingInputContext = useContext(TypingInputContext);


//update the color on change of the master list
useEffect(
    () => {
        const newClassName = (typingInputContext.colorList.bg[props.index]+' '+typingInputContext.colorList.text[props.index]);
        console.log('color list change for char'+props.index+' to ', newClassName );
        setCurrentClassName(newClassName);
    }
    , [typingInputContext.colorList.bg[props.index], typingInputContext.colorList.text[props.index]]
)
return (
    <span className={currentClassName}>
        {props.char}
    </span>
);
}
