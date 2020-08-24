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
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header'

const useStyles = makeStyles({
  root: {
    backgroundColor: '#F6F7EB',
  },
});

function App() {

  const [triggerTypingPause, setTriggerTypingPause] = useState(null);
  const handleGlobalKeyDown = (event) => {
    // if escape key pressed fire un-pause event
    if (event.key === 'Escape'){
      setTriggerTypingPause(prev => prev+1);
    }
  }
  const classes = useStyles();

  return (
    <div  onKeyDown={handleGlobalKeyDown} tabIndex={-1}>
    <div className="App">
      <Header className="App-header"/>
      <TypingSettingsProvider>
      <TypingStatsProvider>
      <TypingInputProvider>
      <CurrentTTTProvider>
        <Paper elevation={3} className={'typingArea'} classes={{root:classes.root}}>
          <TypingArea pauseTrigger={triggerTypingPause}/>
        </Paper>
        <Paper elevation={2} className={'statsArea'} classes={{root:classes.root}}>
          <StatsArea/>
        </Paper>
        <Paper elevation={2} className={'settingsArea'} classes={{root:classes.root}}>
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
