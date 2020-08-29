import React, {useState, useEffect, useContext} from 'react';

export default function Header(props) {

return (
    <div className={props.className}>
    <h1>T-Y-P-E Demo</h1>
    <h3>A hardcore typing speed app for programmers.</h3>
    <a href="https://sheldonfrith.com"><button className="actionButton">By Sheldon Frith</button></a>
    </div>
);
}
