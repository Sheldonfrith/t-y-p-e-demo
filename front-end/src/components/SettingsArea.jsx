import React, {useState, useContext, useCallback} from 'react';
import { TypingSettingsContext } from './providers/TypingSettingsContext';
import { TypingInputContext } from './providers/TypingInputContext';
import Slider from '@material-ui/core/Slider';
import { CurrentTTTContext } from './providers/CurrentTTTContext';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`settings-${index}`}
        aria-labelledby={`settings-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  function a11yProps(index) {
    return {
      id: `settings-${index}`,
      'aria-controls': `settings-${index}`,
    };
  }

const difficultySliderMarks = [
    {value: 0,
    label: 'Easy'},
    {value: 1,
    label: 'Medium'},
    {value: 2,
    label: 'Hard'},
    {value: 3,
    label: 'Very Hard'}
]
const autoPauseSliderMarks = [
    {value: 3000,
    label: '3s'},
    {value: 5000,
    label: '5s'},
    {value: 10000,
    label: '10s'},
    {value: 15000,
    label: '15s'},
]
const TTTLengthSliderMarks = [
    {value: 20,
    label: '20'},
    {value: 100,
    label: '100'},
    {value: 200,
    label: '200'},
    {value: 300,
    label: '300'},
]

//for material-ui sliders...
function valuetext(value) {
    return `${value}`;
  }

export default function SettingsArea(props) {
const typingSettingsContext = useContext(TypingSettingsContext);
const typingInputContext = useContext(TypingInputContext);
const [value, setValue] = useState(0);
const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
},[]);

return (
<div >Settings
      <AppBar position="static" className="settingsAppBar" color="transparent">
        <Tabs 
        value={value} 
        onChange={handleChange} 
        aria-label="simple tabs example"
        variant="scrollable"
        scrollButtons="auto"
        >
          <Tab label="Auto-Pause Timer" {...a11yProps(0)} />
          <Tab label="Difficulty" {...a11yProps(1)} />
          <Tab label="Text Length" {...a11yProps(2)} />
          <Tab label="Training Mode" {...a11yProps(3)}/>
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
      <div className="autoPauseSelector slider">
    <Slider
        defaultValue={10000}
        getAriaValueText={valuetext}
        aria-labelledby="difficulty-slider"
        step={1000}
        max={15000}
        min={2000}
        valueLabelDisplay="auto"
        marks={autoPauseSliderMarks}
        onChange={typingInputContext.changeAutoPauseTime}
      />
    </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <div className="difficultySelector slider">
    <Slider
        defaultValue={0}
        getAriaValueText={valuetext}
        aria-labelledby="difficulty-slider"
        step={1}
        max={3}
        valueLabelDisplay="auto"
        marks={difficultySliderMarks}
        onChange={typingSettingsContext.changeDifficulty}
      />
    </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <div className="TTTLengthSelector slider">
        <Slider
            defaultValue={150}
            getAriaValueText={valuetext}
            aria-labelledby="text-length-slider"
            step={10}
            max={400}
            min={20}
            valueLabelDisplay="auto"
            marks={TTTLengthSliderMarks}
            onChange={(e,val)=>{typingSettingsContext.setTTTLength(val);}}
        />
        </div>
      </TabPanel>
      <TabPanel value={value} index={3}>
          <div className="slider">something</div>
        </TabPanel>

    

</div>
);
}
