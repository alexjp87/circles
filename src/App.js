// * useState is a React hook. Hooks are special functions that let you use React features (like state management and side effects) inside functional components
// * State refers to data that can change over time in a React component. React re-renders a component whenever its state changes, ensuring the UI reflects the latest data.
// * useState allows you to create and manage that piece of state. It returns two values:
// 1. The current state (i.e. `isHomeScreen`) which is the data you want to keep track of
// 2. A function to update the state (setIsHomeScreen), which lets you change the state when needed
// * `const [isHomeScreen, setIsHomeScreen]` is a technique called array destructuring. It extracts the two values returned by useState into separate variables:
// 1. `isHomeScreen` holds the current value of the state, which determines whether the home screen should be displayed
// 2. `setIsHomeScreen` is a function that allows you to update the value of `isHomeScreen`
import React, { useState } from "react";
// import components to be used in this component
import HomeScreen from "./HomeScreen";
import GridScreen from "./GridScreen";
// import CSS file
import "./App.css";

// Define `App.js` as a functional component
function App() {
  // load home screen by default (set state to true)
  const [isHomeScreen, setIsHomeScreen] = useState(true);

  // 
  // 
  // 

  // ------------------------- //
  //  Swtich screen functions  //
  // ------------------------- //

  // switch to game mode (i.e. set state to false)
  const switchToGameMode = () => {
    setIsHomeScreen(false);
  };
  // switch to home screen (i.e. set state back to true)
  const returnToHomeScreen = () => {
    setIsHomeScreen(true);
  };

  // 
  // 
  // 

  // render `HomeScreen` or `GridScreen` based on the value of the `isHomeScreen` state
  return (
    <div className="App">
      {isHomeScreen ? (
        <HomeScreen switchToGameMode={switchToGameMode} />
      ) : (
        <GridScreen returnToHomeScreen={returnToHomeScreen} />
      )}
    </div>
  );
}

export default App;
