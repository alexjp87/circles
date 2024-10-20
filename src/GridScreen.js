import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import DarkModeToggle from "./components/DarkModeToggle";
import GridMushroom from "./components/GridMushroom";
import ResetBtn from "./components/ResetBtn";
import GameModeBtn from "./components/GameModeBtn";
import Score from "./components/Score";
import GridPrompt from "./components/GridPrompt";
import GridIncorrectBar from "./components/GridIncorrectBar";
import GridCorrectBar from "./components/GridCorrectBar";
import GridMessageOverlay from "./components/GridMessageOverlay";
import GridTimer from "./components/GridTimer";
import PauseToggle from "./components/PauseToggle";

const GridScreen = ({ returnToHomeScreen }) => {
  const [gridMushrooms, setGridMushrooms] = useState([]);
  const [score, setScore] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedWord, setSelectedWord] = useState("");
  const [textColor, setTextColor] = useState("");
  const [borderFlashColor, setBorderFlashColor] = useState("");
  const [correctBarProgress, setCorrectBarProgress] = useState(0);
  const [incorrectBarProgress, setIncorrectBarProgress] = useState(0);
  const [shouldFlashWarning, setShouldFlashWarning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isNextLevel, setIsNextLevel] = useState(false);
  const [level, setLevel] = useState(1);
  const [isStartGame, setIsStartGame] = useState(true);
  const [timer, setTimer] = useState(10.0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isNegativePrompt, setIsNegativePrompt] = useState(false);
  const [pulsingMushroomId, setPulsingMushroomId] = useState(null);

  const colors = [
    "blue",
    "salmon",
    "silver",
    "purple",
    "goldenrod",
    "sienna",
    "violet",
    "yellow",
    "teal",
  ];

  const shuffleArray = React.useCallback((array) => {
    return [...array].sort(() => Math.random() - 0.5);
  }, []);

  const generateGridMushrooms = (colorsArray) => {
    return colorsArray.map((color, index) => ({
      id: index,
      color: color,
    }));
  };

  const assignPulsingMushroom = React.useCallback(() => {
    if (level >= 4) {
      const availableMushrooms = gridMushrooms.filter(
        (mushroom) => mushroom.color !== selectedWord
      );
      const randomPulsingMushroom = availableMushrooms[Math.floor(Math.random() * availableMushrooms.length)];
      setPulsingMushroomId(randomPulsingMushroom ? randomPulsingMushroom.id : null);
    } else {
      setPulsingMushroomId(null); // No pulsing mushroom in level 1
    }
  }, [level, gridMushrooms, selectedWord]);

  useEffect(() => {
    const initialColors = shuffleArray(colors);
    const initialGridMushrooms = generateGridMushrooms(initialColors);
    setGridMushrooms(initialGridMushrooms);
    randomizeWordAndColor();
  }, []); // Empty dependency array ensures this runs only once

  const randomizeWordAndColor = React.useCallback(() => {
    setIsNegativePrompt(false); // Ensure negative prompt is reset to false before randomizing

    const shuffledColors = shuffleArray(colors);
    const randomWord = shuffledColors[0];
    const randomTextColor = shuffledColors[1];

    if (level > 1 && Math.random() < 0.25) {
      setIsNegativePrompt(true);
      setSelectedWord(`not ${randomWord}`);
    } else {
      setIsNegativePrompt(false);
      setSelectedWord(randomWord);
    }

    setTextColor(randomTextColor);
  }, [level, shuffleArray, colors]);

  useEffect(() => {
    if (level >= 4) {
      assignPulsingMushroom();
    } else {
      setPulsingMushroomId(null);
    }
  }, [level, gridMushrooms, selectedWord, assignPulsingMushroom]);

  // Timer logic for levels 3 and onwards
  useEffect(() => {
    if (level < 3 || !isTimerRunning || isGameOver || isNextLevel || isPaused) return;

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0.1) {
          handleTimerExpire();
          return level >= 4 ? 9.5 : 10.0; // Reset to 9.5 seconds for level 4+, otherwise 10 seconds
        }
        return prevTimer - 0.1; // Decrement timer by hundredths of a second
      });
    }, 100); // Runs every 10ms for precise countdown

    return () => clearInterval(intervalId); // Cleanup the interval on unmount
  }, [isTimerRunning, isGameOver, isNextLevel, isPaused, level]);

  const handleGridMushroomEvent = React.useCallback((id, clickedMushroomColor) => {
    if (isGameOver || isNextLevel || isPaused) return;
  
    let isCorrectClick;
  
    // Check if the clicked mushroom is the pulsing mushroom
    const isPulsingClick = id === pulsingMushroomId;
  
    if (isPulsingClick) {
      // Handle pulsing mushroom click as an incorrect click with extra penalties
      setScore((prevScore) => prevScore - 2); // Decrease score by 2
      setIncorrectBarProgress((prevProgress) => {
        const newProgress = Math.min(prevProgress + 2, 5); // Increment incorrect bar by 2
  
        if (newProgress === 4) {
          setShouldFlashWarning(true);
        } else {
          setShouldFlashWarning(false);
        }
  
        if (newProgress === 5) {
          setIsGameOver(true);
          setPulsingMushroomId(null); // Remove pulsing mushroom on game over
        }
        return newProgress;
      });
  
      flashBorders("red"); // Flash borders red to indicate an incorrect click
      resetTimer();
    } else {
      // Proceed with normal logic for regular mushroom clicks
      if (isNegativePrompt) {
        const promptColor = selectedWord.replace("not ", "");
        isCorrectClick = clickedMushroomColor !== promptColor;
      } else {
        isCorrectClick = clickedMushroomColor === selectedWord;
      }
  
      let flashColor = isCorrectClick ? "#14f71f" : "red";
      flashBorders(flashColor);
  
      if (level >= 3) {
        resetTimer();
      }
  
      if (isCorrectClick) {
        setScore((prevScore) => prevScore + 1);
        if (incorrectBarProgress === 4) {
          setIncorrectBarProgress(3);
          setShouldFlashWarning(false);
        }
  
        setCorrectBarProgress((prevProgress) => {
          const newProgress = Math.min(prevProgress + 1, 5);
          if (newProgress === 5) {
            setIsNextLevel(true);
          }
          return newProgress;
        });
      } else {
        setScore((prevScore) => prevScore - 1);
        setIncorrectBarProgress((prevProgress) => {
          const newProgress = Math.min(prevProgress + 1, 5);
  
          if (newProgress === 4) {
            setShouldFlashWarning(true);
          } else {
            setShouldFlashWarning(false);
          }
  
          if (newProgress === 5) {
            setIsGameOver(true);
            setPulsingMushroomId(null); // Remove pulsing mushroom on game over
          }
          return newProgress;
        });
      }
    }
  
    const shuffledColors = shuffleArray(colors);
    const updatedGridMushrooms = generateGridMushrooms(shuffledColors);
    setGridMushrooms(updatedGridMushrooms);
    randomizeWordAndColor(); // Call after updating grid
    assignPulsingMushroom(); // Reassign pulsing mushroom after click event
  }, [isGameOver, isNextLevel, isPaused, isNegativePrompt, selectedWord, incorrectBarProgress, correctBarProgress, pulsingMushroomId, level, shuffleArray, randomizeWordAndColor, assignPulsingMushroom]);
  

  const flashBorders = (flashColor) => {
    setBorderFlashColor(flashColor);
    setTimeout(() => {
      setBorderFlashColor("");
    }, 100);
  };

  const handleTimerExpire = () => {
    setScore((prevScore) => prevScore - 1);
    setIncorrectBarProgress((prevProgress) => {
      const newProgress = Math.min(prevProgress + 1, 5);

      if (newProgress === 5) {
        setIsGameOver(true);
        setPulsingMushroomId(null); // Remove pulsing mushroom on game over
      }

      if (newProgress === 4) {
        setShouldFlashWarning(true);
      }

      return newProgress;
    });

    flashBorders("red"); // Flash the borders red
  };

  const resetTimer = () => {
    if (level >= 4) {
      setTimer(9.5); // Set timer to 9.5 seconds from Level 4 onwards
    } else {
      setTimer(10.0); // Set timer to 10 seconds for earlier levels
    }
    setIsTimerRunning(true); // Start the timer again
  };

  const startGame = React.useCallback(() => {
    setIsStartGame(false); // Hide overlay when the game starts
    setIsTimerRunning(true); // Ensure the timer starts running
    resetTimer(); // Start the timer
  }, [resetTimer]);

  const resetGridScreen = React.useCallback((shouldResetLevel = true) => {
    const resetGridMushrooms = generateGridMushrooms(shuffleArray(colors));
    setGridMushrooms(resetGridMushrooms);
    setCorrectBarProgress(0);
    setIncorrectBarProgress(0);
    setIsGameOver(false);
    setIsNextLevel(false);
    setIsPaused(false);
    setShouldFlashWarning(false);
    setIsNegativePrompt(false);
    setPulsingMushroomId(null); // Remove pulsing mushroom on reset

    if (shouldResetLevel) {
      setLevel(1);
      setScore(0);
    }

    randomizeWordAndColor();

    if (level >= 3) {
      resetTimer();
    }
  }, [shuffleArray, colors, randomizeWordAndColor]);

  const advanceToNextLevel = React.useCallback(() => {
    setLevel((prevLevel) => prevLevel + 1);
    resetGridScreen(false);
  }, [resetGridScreen]);

  const togglePause = React.useCallback(() => {
    setIsPaused(prevState => !prevState);
  }, []);

  return (
    <div className={`grid-screen-ctnr ${darkMode ? "dark" : ""}`}>
      <div className="top-edge-ctnr">
        <Header title={`Grid Moshe : Level ${level}`} />
        {level >= 3 && !isGameOver && (
        <GridTimer
        timer={timer}
        isTimerRunning={isTimerRunning}
        />
        )}
        <GameModeBtn
          onClick={returnToHomeScreen}
          label="Home"
          className="game-mode-btn"
        />
      </div>

      <div className="grid-game-ctnr">
        <GridPrompt
          textColor={textColor}
          selectedWord={(!isPaused && !isGameOver && !isStartGame && !isNextLevel) ? selectedWord : ""}  // Hide the word when certain states are active
          flashColor={borderFlashColor}
          isGameOver={isGameOver}
        />
        <GridIncorrectBar
          incorrectBarProgress={incorrectBarProgress}
          shouldFlashWarning={shouldFlashWarning}
        />
        <div className="grid-mushrooms-ctnr">
          <div className="grid-mushrooms">
            {gridMushrooms.map((gridMushroom) => (
              <GridMushroom
                key={gridMushroom.id}
                id={gridMushroom.id}
                color={gridMushroom.color}
                isPulsing={gridMushroom.id === pulsingMushroomId}
                onClick={() =>
                  handleGridMushroomEvent(
                    gridMushroom.id,
                    gridMushroom.color
                  )
                }
              />
            ))}
          </div>
        </div>
        <GridCorrectBar
          correctBarProgress={correctBarProgress}
        />
        <Score
          score={score}
          flashColor={borderFlashColor}
          isGameOver={isGameOver}
        />
      </div>

      <div className="bottom-sub-ctnr">
        <PauseToggle
          isPaused={isPaused}
          onClick={togglePause}
        />
      </div>

      <div className="bottom-edge-ctnr">
        <ResetBtn
          onReset={resetGridScreen}
        />
        <DarkModeToggle
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode((prevMode) => !prevMode)}
        />
      </div>
      
      {isStartGame && (
        <GridMessageOverlay
          message="Click to Start!"
          color="green"
          onClick={startGame} // Call startGame when clicked
        />
      )}
      {isNextLevel && (
        <GridMessageOverlay
          message={"Next Level!"}
          color={"#14f71f"}
          onClick={advanceToNextLevel}
        />
      )}
      {isGameOver && (
        <GridMessageOverlay
          message={"Game Over"}
          color={"red"}
          onClick={resetGridScreen}
        />
      )}
      {isPaused && (
        <GridMessageOverlay
          message="Paused"
          color="hotpink"
          onClick={togglePause}
        />
      )}
    </div>
  );
};

export default GridScreen;
