// * useState is a React hook. Hooks are special functions that let you use React features (like state management and side effects) inside functional components
// * State refers to data that can change over time in a React component. React re-renders a component whenever its state changes, ensuring the UI reflects the latest data.
// * useState allows you to create and manage that piece of state. It returns two values:
// the current state (isHomeScreen in this case), which is the data you want to keep track of
// a function to update the state (setIsHomeScreen), which lets you change the state when needed
// * `const [isHomeScreen, setIsHomeScreen]` is a technique called array destructuring. It extracts the two values returned by useState into separate variables:
// `isHomeScreen` holds the current value of the state, which determines whether the home screen should be displayed
// `setIsHomeScreen` is a function that allows you to update the value of `isHomeScreen`
import React, { useState } from "react";
// import components to be used in the App component
import HomeScreen from "./HomeScreen";
import GridScreen from "./GridScreen";
// import CSS file
import "./App.css";

function App() {
  // load home screen by default (set state to true)
  const [isHomeScreen, setIsHomeScreen] = useState(true);

  // switch to game mode (set state to false)
  const switchToGameMode = () => {
    setIsHomeScreen(false);
  };
  // switch to home screen (set state back to true)
  const returnToHomeScreen = () => {
    setIsHomeScreen(true);
  };

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
