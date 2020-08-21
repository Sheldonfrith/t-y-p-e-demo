import React, {useState, useEffect, useContext} from 'react';
import { TypingSettingsContext } from './providers/TypingSettingsContext';

export default function SettingsArea(props) {
const typingSettingsContext = useContext(TypingSettingsContext);

return (
<div>
    <div className="difficultySelector">
    <span>Difficulty:</span>
    <select onChange={typingSettingsContext.changeDifficulty}>
    <option value="veryEasy">Very Easy</option>
    <option value="easy">Easy</option>
    <option value="medium">Medium</option>
    <option value="hard">Hard</option>
    </select>
    </div>

    <div className="autoPauseSelector">
    <span>Auto-Pause After:</span>
    <select onChange={typingSettingsContext.changeAutoPauseTime} >
    <option value="10000">10s</option>
    <option value="5000">5s</option>
    <option value="3000">3s</option>
    <option value="2000">2s</option>
    </select>
    </div>

    <button onClick={typingSettingsContext.newTTT}>Generate Fresh Text</button>

</div>
);
}
