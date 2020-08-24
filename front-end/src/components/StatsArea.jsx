import React, {useState, useEffect, useContext} from 'react';
import { TypingStatsContext } from './providers/TypingStatsContext';
import { CurrentTTTContext } from './providers/CurrentTTTContext';
import { TypingInputContext } from './providers/TypingInputContext';
import Button from '@material-ui/core/Button'

export default function StatsArea(props) {

const typingStatsContext = useContext(TypingStatsContext);
const currentTTT = useContext(CurrentTTTContext);
const statsContext = useContext(TypingStatsContext);
const inputContext = useContext(TypingInputContext);

return (
<>
    <p><b>{typingStatsContext.WPM}</b> wpm</p>
    <p><b>{Math.round(typingStatsContext.accuracy)}%</b> accuracy</p>
    <p><b>{Math.round(typingStatsContext.wastedKeysPercentage)}%</b> keystrokes wasted </p>
    <p>Slowest character: <b>{typingStatsContext.getWorstChar()}</b></p>
    <button className="newTTTButton" onClick={async () => {
        await currentTTT.newTTT();
        await statsContext.newTTTReset();
        await inputContext.newTTTReset();
        inputContext.unPause();
        console.log('finished resetting and generating a new TTT')
    }}>Reset Text</button>
</>
);
}
