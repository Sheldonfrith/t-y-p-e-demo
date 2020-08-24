import React, {useState, useEffect, useContext} from 'react';

export default function Header(props) {

return (
    <div className={props.className}>
    <h1>T-Y-P-E Demo</h1>
    <h3>A hardcore typing speed app for programmers.</h3>
    <button className="actionButton" href="https://sheldonfrith.com">By Sheldon Frith</button>
    </div>
);
}
