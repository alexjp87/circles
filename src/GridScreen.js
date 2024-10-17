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

const GridScreen = ({ onReturnToHomeScreen }) => {
  const [gridMushrooms, setGridMushrooms] = useState([]);
  const [score, setScore] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedWord, setSelectedWord] = useState("");
  const [textColor, setTextColor] = useState("");
  const [borderFlashColor, setBorderFlashColor] = useState(""); 
  const [correctBarProgress, setCorrectBarProgress] = useState(0); 
  const [incorrectBarProgress, setIncorrectBarProgress] = useState(0); 
  const [shouldFlashWarning, setShouldFlashWarning] = useState(false); // New state for flashing warning

  const [isGameOver, setIsGameOver] = useState(false); 
  const [isNextLevel, setIsNextLevel] = useState(false); 
  const [level, setLevel] = useState(1);  // Track the current level

  const [isNegativePrompt, setIsNegativePrompt] = useState(false);


  const colors = ["blue", "salmon", "silver", "purple", "goldenrod", "sienna", "violet", "yellow", "teal"];

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
    
    // For levels 2 and above, introduce negative prompts 50% of the time
  if (level >= 2 && Math.random() > 0.5) {
    setIsNegativePrompt(true);  // Set as a negative prompt
    setSelectedWord(`not ${randomWord}`);  // Add "not" to the selected word
  } else {
    setIsNegativePrompt(false);  // Set as a regular prompt
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

  const handleGridMushroomEvent = (id, clickedMushroomColor) => {
    if (isGameOver || isNextLevel) return; // No actions when game over or next level
  
    let isCorrectClick;
    if (isNegativePrompt) {
      // If negative prompt, correct if clicked color is NOT the prompt color
      isCorrectClick = clickedMushroomColor !== selectedWord.replace("not ", "");
    } else {
      // For regular prompt, correct if clicked color matches the prompt
      isCorrectClick = clickedMushroomColor === selectedWord;
    }
  
    let flashColor = isCorrectClick ? "#14f71f" : "red";  // Set flash color
    flashBorders(flashColor);
  
    if (isCorrectClick) {
      setScore((prevScore) => prevScore + 1);
  
      // Reduce incorrect progress if flashing warning
      if (incorrectBarProgress === 4) {
        setIncorrectBarProgress(3);
        setShouldFlashWarning(false);
      }
  
      setCorrectBarProgress((prevProgress) => {
        const newProgress = Math.min(prevProgress + 1, 5);
        if (newProgress === 5) {
          setIsNextLevel(true); // Advance to the next level
        }
        return newProgress;
      });
    } else {
      setScore((prevScore) => prevScore - 1);
      setIncorrectBarProgress((prevProgress) => {
        const newProgress = Math.min(prevProgress + 1, 5);
  
        if (newProgress === 4) {
          setShouldFlashWarning(true); // Start flashing warning
        } else {
          setShouldFlashWarning(false);
        }
  
        if (newProgress === 5) {
          setIsGameOver(true);  // Game over if progress reaches 5
        }
        return newProgress;
      });
    }
  
    // Shuffle mushrooms and prompt again
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

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const resetGridScreen = (shouldResetLevel = true) => {
    const resetGridMushrooms = generateGridMushrooms(shuffleArray(colors));
    setGridMushrooms(resetGridMushrooms);
    setCorrectBarProgress(0); 
    setIncorrectBarProgress(0); 
    setIsGameOver(false); 
    setIsNextLevel(false);
    setShouldFlashWarning(false);  // Reset flashing state

    if (shouldResetLevel) {
      setLevel(1); 
      setScore(0);
    }

    randomizeWordAndColor();
  };

  // Handle advancing to the next level
  const advanceToNextLevel = () => {
    setLevel((prevLevel) => prevLevel + 1); // Increase the level by 1
    resetGridScreen(false); // Reset the screen for the next level but don't reset the level
  };

  return (
    <div className={`grid-screen-ctnr ${darkMode ? "dark" : ""}`}>
      <div className="top-edge-ctnr">
        <Header title={`Grid Moshe : Level ${level}`} /> {/* Change the header dynamically */}
        <GameModeBtn onClick={onReturnToHomeScreen} label="Home" className="game-mode-btn" />
      </div>

      <div className="grid-game-ctnr">
        <GridPrompt
          textColor={textColor}
          selectedWord={selectedWord}
          flashColor={borderFlashColor} 
        />
        <GridIncorrectBar
        incorrectBarProgress={incorrectBarProgress}
        shouldFlashWarning={shouldFlashWarning}  // Pass the flashing state to the component
        />
        <div className="grid-mushrooms-ctnr">
          <div className="grid-mushrooms">
            {gridMushrooms.map((gridMushroom) => (
              <GridMushroom
                key={gridMushroom.id}
                id={gridMushroom.id}
                color={gridMushroom.color} 
                onClick={() => handleGridMushroomEvent(gridMushroom.id, gridMushroom.color)}
              />
            ))}
          </div>
        </div>
        <GridCorrectBar correctBarProgress={correctBarProgress} />
        <Score score={score} flashColor={borderFlashColor} />
      </div>

      <div className="bottom-edge-ctnr">
        <ResetBtn onReset={resetGridScreen} />
        <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      {isGameOver && (
        <GridMessageOverlay
        message={"Game Over"}
        color={"red"}
        onClick={resetGridScreen}  // Handle resetting the game
        />
      )}
      
      {isNextLevel && (
        <GridMessageOverlay
          message={"Next Level!"}
          color={"#14f71f"}
          onClick={advanceToNextLevel}  // Handle advancing to next level
        />
      )}
    </div>
  );
};

export default GridScreen;
