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

const GridScreen = ({ onReturnToHomeScreen }) => {
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

  const randomizeWordAndColor = () => {
    const shuffledColors = shuffleArray(colors);
    const randomWord = shuffledColors[0];
    const randomTextColor = shuffledColors[1];

    // From Level 2 onwards, 25% chance of negative prompt
  if (level >= 2 && Math.random() < 0.25) {
    setIsNegativePrompt(true); // Negative prompt
    setSelectedWord(`not ${randomWord}`);
  } else {
    setIsNegativePrompt(false); // Regular prompt
    setSelectedWord(randomWord);
  }

    setTextColor(randomTextColor);
  };

  useEffect(() => {
    const initialColors = shuffleArray(colors);
    const initialGridMushrooms = generateGridMushrooms(initialColors);
    setGridMushrooms(initialGridMushrooms);
    randomizeWordAndColor();
  }, []);

  useEffect(() => {
    // Timer active from level 3 onwards
    if (level < 3 || !isTimerRunning || isGameOver || isNextLevel || isPaused) return;

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0.01) {
          handleTimerExpire(); 
          return 10.0; // Reset to 10 seconds
        }
        return prevTimer - 0.01;
      });
    }, 10); // Decrement every 10ms (hundredths of a second)

    return () => clearInterval(intervalId); // Cleanup on unmount or dependencies change
  }, [isTimerRunning, isGameOver, isNextLevel, isPaused, level]); // Add isPaused to dependency array

  const handleGridMushroomEvent = React.useCallback((id, clickedMushroomColor) => {
    if (isGameOver || isNextLevel || isPaused) return;

    let isCorrectClick;
    if (isNegativePrompt) {
      // For negative prompts, the correct click is on a mushroom that is NOT the prompt color
      const promptColor = selectedWord.replace("not ", "");
      isCorrectClick = clickedMushroomColor !== promptColor;
    } else {
      // For regular prompts, the correct click is on a mushroom that matches the prompt
      isCorrectClick = clickedMushroomColor === selectedWord;
    }
    
    let flashColor = isCorrectClick ? "#14f71f" : "red";
    flashBorders(flashColor);

    // Restart the timer with any click starting from level 3
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
        }
        return newProgress;
      });
    }

    const shuffledColors = shuffleArray(colors);
    const updatedGridMushrooms = generateGridMushrooms(shuffledColors);
    setGridMushrooms(updatedGridMushrooms);
    randomizeWordAndColor();
  }, [isGameOver, isNextLevel, isPaused, isNegativePrompt, selectedWord, incorrectBarProgress, correctBarProgress, level]);

  const flashBorders = (flashColor) => {
    setBorderFlashColor(flashColor);
    setTimeout(() => {
      setBorderFlashColor("");
    }, 100);
  };

  const handleTimerExpire = () => {
    setScore((prevScore) => prevScore - 1); // Decrease score by 1
    setIncorrectBarProgress((prevProgress) => {
      const newProgress = Math.min(prevProgress + 1, 5);

      if (newProgress === 5) {
        setIsGameOver(true);
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
      setTimer(9.5); // Set timer to 9 seconds from Level 4 onwards
    } else {
      setTimer(10.0); // Set timer to 10 seconds for earlier levels
    }
    setIsTimerRunning(true); // Start the timer again
  };

  const startGame = React.useCallback(() => {
    setIsStartGame(false); // Hide overlay when the game starts
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

    if (shouldResetLevel) {
      setLevel(1);
      setScore(0);
    }

    randomizeWordAndColor();

    if (level >= 3) {
      resetTimer();
    }
  }, [colors, level]);

  const advanceToNextLevel = React.useCallback(() => {
    setLevel((prevLevel) => prevLevel + 1);
    resetGridScreen(false);
  }, [resetGridScreen]);

  // Handle pause and resume
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
          onClick={onReturnToHomeScreen}
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
          onClick={togglePause} // Call startGame when clicked
        />
      )}
    </div>
  );
};

export default GridScreen;
