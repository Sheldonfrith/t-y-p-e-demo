import React, {useState, useEffect, useContext} from 'react';

export default function Header(props) {

return (
    <div className={props.className}>
    <h1 className="title">T-Y-P-E Demo</h1>
    <h3>A hardcore typing speed app for programmers.</h3>
    <a href="https://sheldonfrith.com"><button className="actionButton">By Sheldon Frith</button></a>
    <a href="https://github.com/Sheldonfrith/t-y-p-e-demo"><button className="gitHubButton">View on GitHub</button></a>
    </div>
);
}
