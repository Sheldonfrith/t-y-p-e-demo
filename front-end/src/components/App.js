import React, {useState} from 'react';
import '../styles/App.css';
import TypingSettingsProvider from './providers/TypingSettingsContext'
import TypingInputProvider from './providers/TypingInputContext'
import TypingStatsProvider from './providers/TypingStatsContext'
import TypingArea from './TypingArea'
import StatsArea from './StatsArea'
import SettingsArea from './SettingsArea'
import Paper from '@material-ui/core/Paper'
import CurrentTTTProvider from './providers/CurrentTTTContext';
// import TestProvider from './providers/TestContext';
// import TestConsumer from './TestConsumer';

function App() {

  const [triggerTypingPause, setTriggerTypingPause] = useState(null);
  const handleGlobalKeyDown = (event) => {
    // if escape key pressed fire un-pause event
    if (event.key === 'Escape'){
      setTriggerTypingPause(prev => prev+1);
    }
  }

  return (
    <div  onKeyDown={handleGlobalKeyDown} tabIndex={-1}>
    <div className="App">
      <Paper elevation={3} className="App-header">
      <header>
        <h1>T-Y-P-E Demo</h1>
        <h3>A hardcore typing speed app by Sheldon Frith</h3>
        {/* <TestProvider>
          <TestConsumer/>
        </TestProvider> */}
      </header>
      </Paper>
      <TypingSettingsProvider>
      <TypingStatsProvider>
      <TypingInputProvider>
      <CurrentTTTProvider>
        <Paper elevation={3} className={'typingArea'}>
          <TypingArea pauseTrigger={triggerTypingPause}/>
        </Paper>
        <Paper elevation={2} className={'statsArea'}>
          <StatsArea/>
        </Paper>
        <Paper elevation={2} className={'settingsArea'}>
          <SettingsArea/>
        </Paper>
      </CurrentTTTProvider>
      </TypingInputProvider>
      </TypingStatsProvider>
      </TypingSettingsProvider>
    </div>
    </div>
  );
}

export default App;
