import React, {useState, useCallback} from 'react';
import { useContext } from 'react';
import { TypingInputContext } from './providers/TypingInputContext';
import { useEffect } from 'react';

export default function TTTCharacter(props) {

return (
    <span className={props.className}>
        {props.char}
    </span>
);
}
