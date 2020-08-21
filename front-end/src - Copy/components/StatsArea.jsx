import React, {useState, useEffect, useContext} from 'react';
import { TypingStatsContext } from './providers/TypingStatsContext';

export default function StatsArea(props) {

const typingStatsContext = useContext(TypingStatsContext);

return (
<div>
    <p>Current Speed: <b>{typingStatsContext.wpm}</b> wpm</p>
    <p>Accuracy: {typingStatsContext.accuracy}% correct</p>
    <p>Current Wasted Keystrokes: {typingStatsContext.wastedKeys}% </p>
    <p>Worst Character: {typingStatsContext.worstChar}</p>
</div>
);
}
