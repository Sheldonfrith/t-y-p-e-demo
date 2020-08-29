import React, {useState, useContext, useCallback} from 'react';
import { TypingSettingsContext } from './providers/TypingSettingsContext';
import { TypingInputContext } from './providers/TypingInputContext';
import Slider from '@material-ui/core/Slider';
import { CurrentTTTContext } from './providers/CurrentTTTContext';
import Tabs from './Tabs';
import PropTypes from 'prop-types';
import { sizing } from '@material-ui/system';
import Box from '@material-ui/core/Box'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';


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
const useStyles = makeStyles({
    root: {
    //   maxHeight: 5,
    //   padding: '1.8em',
      width: '70%',
      overflow: 'visible',
    },
    // content: {
    //     maxHeight: 5,

    // },
    markLabel: {
        top: '75%',
        overflow: 'visible',
    },
    track: {
        backgroundColor:'#F77F00',
        height: '4px',
    },
    thumb: {
        backgroundColor: '#D90368',
        height: '13px',
        '&:hover': {
            boxShadow: '0px 0px 0px 8px rgba(217, 3, 104, 0.16)',
        }
    },
    rail: {
        backgroundColor:'rgba(247, 127, 0, 0.4)',
        height: '4px',
    },
    mark: {
        backgroundColor: '#F77F00',
        height: '4px',
    }
  });

export default function SettingsArea(props) {
const typingSettingsContext = useContext(TypingSettingsContext);
const typingInputContext = useContext(TypingInputContext);
const [value, setValue] = useState(0);
const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
},[]);
const classes = useStyles();

return (
<div >
    <div className="settingsTitle">Settings:</div>
    <Tabs>
      <div className="autoPauseSelector slider" label="Auto Pause Time">
        <Slider
            classes={{
                root: classes.root,
                // content: classes.content,
                markLabel: classes.markLabel,
                track: classes.track,
                thumb: classes.thumb,
                rail: classes.rail,
                mark: classes.mark,
            }}
            defaultValue={10000}
            getAriaValueText={valuetext}
            aria-labelledby="difficulty-slider"
            step={1000}
            max={15000}
            min={2000}
            valueLabelDisplay="off"
            marks={autoPauseSliderMarks}
            onChange={typingInputContext.changeAutoPauseTime}
        />
      </div>
      <div className="difficultySelector slider" label="Difficulty">
        <Slider
            classes={{
                root: classes.root,
                // content: classes.content,
                markLabel: classes.markLabel,
                track: classes.track,
                thumb: classes.thumb,
                rail: classes.rail,
                mark: classes.mark,
            }}
            defaultValue={0}
            getAriaValueText={valuetext}
            aria-labelledby="difficulty-slider"
            step={1}
            max={3}
            valueLabelDisplay="off"
            marks={difficultySliderMarks}
            onChange={typingSettingsContext.changeDifficulty}
        />
      </div>
      <div className="TTTLengthSelector slider" label="Text Length">
        <Slider
            classes={{
                root: classes.root,
                // content: classes.content,
                markLabel: classes.markLabel,
                track: classes.track,
                thumb: classes.thumb,
                rail: classes.rail,
                mark: classes.mark,
            }}
            defaultValue={150}
            getAriaValueText={valuetext}
            aria-labelledby="text-length-slider"
            step={10}
            max={400}
            min={20}
            valueLabelDisplay="off"
            marks={TTTLengthSliderMarks}
            onChange={(e,val)=>{typingSettingsContext.setTTTLength(val);}}
        />
      </div>
    </Tabs>
</div>
);
}
