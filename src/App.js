import React, { useState } from 'react';
import HomeScreen from './HomeScreen';
import './App.css';
import GridScreen from './GridScreen';

function App() {
  const [isHomeScreen, setIsHomeScreen] = useState(true);

  // switch game screen
  const switchToGameMode = () => {
    setIsHomeScreen(false);
  };
  const returnToHomeScreen = () => {
    setIsHomeScreen(true);
  };

  return (
    <div className="App">
      {isHomeScreen ? (
        <HomeScreen onSwitchToGameMode={switchToGameMode} />
      ) : (
        <GridScreen onReturnToHomeScreen={returnToHomeScreen} />
      )}
    </div>
  );
}

export default App;