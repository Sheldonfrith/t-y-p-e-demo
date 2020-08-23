import React, { createContext, useState, useEffect } from "react";

export const TestContext = createContext({
  dependent: "",
  setter: "",
  setSetter: () => {},
  setDependent: ()=> {},
  newSetter: ()=> {},
});
export default function TestProvider({ children }) {
  const [dependent, setDependent] = useState("initial value");

    const newSetter =() =>{
        const newSetter = 'newSetter function'+Math.random();
        // typingInputContext.getCurrentTTT(newTTT);
        setSetter(newSetter);
    }

  const [setter, setSetter] = useState("initial value");
  

    useEffect(()=>{
        console.log('using dependent', dependent, ' in a useeffect depending on setter', setter);
        setDependent('new value :'+setter);
    }, [setter]);

    useEffect(()=> {
        console.log('using setter: ', setter,'in a useeffect depending on dependent', dependent);
    },[dependent])

  return (
    <TestContext.Provider
      value={{
        dependent: dependent,
        setter: setter,
        setSetter: setSetter,
        setDependent: setDependent,
        newSetter: newSetter,
      }}
    >
      {children}
    </TestContext.Provider>
  );
}
