import React, { useContext } from "react";
import { TestContext } from "./providers/TestContext";

export default function TestConsumer() {
  const testContext = useContext(TestContext);

  const changeSetter = async () => {
    await testContext.setSetter("new value"+Math.random());
    console.log("done async function");
  };
  const changeDependent = () => {
      testContext.setDependent('set from the component'+Math.random());
  }

  return (
    <>
      <button
        onClick={() => {
          changeSetter();
        }}
      >
        changeSetter
      </button>
      <button onClick={()=>{changeDependent();}}>change dependent</button>
      <button onClick={()=>{testContext.newSetter();}}>newSetter</button>
      <h3>
        Setter value: {testContext.setter}, dependent value:{" "}
        {testContext.dependent}
      </h3>
    </>
  );
}
