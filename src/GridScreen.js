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

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

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
    setSelectedWord(randomWord);
    setTextColor(randomTextColor);
  };

  useEffect(() => {
    const initialColors = shuffleArray(colors);
    const initialGridMushrooms = generateGridMushrooms(initialColors);
    setGridMushrooms(initialGridMushrooms);
    randomizeWordAndColor();
  }, []);

  useEffect(() => {
    if (!isTimerRunning || isGameOver || isNextLevel || isPaused) return;

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
  }, [isTimerRunning, isGameOver, isNextLevel, isPaused]); // Add isPaused to dependency array

  const handleGridMushroomEvent = (id, clickedMushroomColor) => {
    if (isGameOver || isNextLevel) return;

    let isCorrectClick = clickedMushroomColor === selectedWord;
    let flashColor = isCorrectClick ? "#14f71f" : "red";
    flashBorders(flashColor);

    // Restart the timer with any click
    resetTimer();

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
  };

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
    setTimer(10.0); // Reset to 10 seconds
    setIsTimerRunning(true); // Start the timer again
  };

  const startGame = () => {
    setIsStartGame(false); // Hide overlay when the game starts
    resetTimer(); // Start the timer
  };

  const resetGridScreen = (shouldResetLevel = true) => {
    const resetGridMushrooms = generateGridMushrooms(shuffleArray(colors));
    setGridMushrooms(resetGridMushrooms);
    setCorrectBarProgress(0);
    setIncorrectBarProgress(0);
    setIsGameOver(false);
    setIsNextLevel(false);
    setIsPaused(false);
    setShouldFlashWarning(false);

    if (shouldResetLevel) {
      setLevel(1);
      setScore(0);
    }

    randomizeWordAndColor();
    resetTimer();
  };

  const advanceToNextLevel = () => {
    setLevel((prevLevel) => prevLevel + 1);
    resetGridScreen(false);
  };

  // Handle pause and resume
  const togglePause = () => {
    setIsPaused(!isPaused);
  }

  return (
    <div className={`grid-screen-ctnr ${darkMode ? "dark" : ""}`}>
      <div className="top-edge-ctnr">
        <Header title={`Grid Moshe : Level ${level}`} />
        <GridTimer
        timer={timer}
        isTimerRunning={isTimerRunning}
        />
        <GameModeBtn
          onClick={onReturnToHomeScreen}
          label="Home"
          className="game-mode-btn"
        />
      </div>

          <div className="grid-game-ctnr">
            <GridPrompt
              textColor={textColor}
              selectedWord={selectedWord}
              flashColor={borderFlashColor}
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
