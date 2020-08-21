import React, {useState, useEffect} from 'react';

//initialize state structure here
export const GlobalContext = React.createContext();


export default function GlobalProvider(props) {

return (
    <GlobalContext.Provider 
        value={

        }
    >
        {children}
    </GlobalContext.Provider>
);
}
