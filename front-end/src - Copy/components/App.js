import React from 'react';
import '../styles/App.css';
import TypingSettingsProvider from './providers/TypingSettingsContext'
import TypingInputProvider from './providers/TypingInputContext'
import TypingStatsProvider from './providers/TypingStatsContext'
import TypingArea from './TypingArea'
import StatsArea from './StatsArea'
import SettingsArea from './SettingsArea'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sheldon Frith's Hardcore Typing Speed App Demo.</h1>
      </header>
      <main className="App-body">
      <TypingSettingsProvider>
      <TypingStatsProvider>
      <TypingInputProvider>
        <TypingArea/>
        <StatsArea/>
        <SettingsArea/>
      </TypingInputProvider> 
      </TypingStatsProvider>
      </TypingSettingsProvider>
      </main>
    </div>
  );
}

export default App;
