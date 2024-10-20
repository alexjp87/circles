// * useEffect is a hook that lets you perform side effects in functional components. Side effects are operations that occur outside the render lifecycle of a React component, such as fetching data from an API, subscribing/unsubscribing to events, or setting up and clearing timers.
// * The useEffect hook takes two arguments:
// the effect function: this function contains the side effect code that should run after a render
// dependency array (optional): an array of values that the effect depends on. If any value in this array changes, the effect re-runs. If it’s an empty array ([]), the effect runs only once after the component mounts.
// 
// * useRef is a React hook that allows you to create and manage a mutable reference that persists across renders without causing the component to re-render when it changes. It can be used to reference DOM elements, or used to store any kind of mutable value that you want to retain between renders, such as a timer or an interval ID.
import React, { useState, useEffect, useRef } from "react";

import Mushroom from "./components/Mushroom";
import Header from "./components/Header";
import MushroomControlBtns from "./components/MushroomControlBtns";
import ResetBtn from "./components/ResetBtn";
import GameModeBtn from "./components/GameModeBtn";
import DarkModeToggle from "./components/DarkModeToggle";
import TimerBtn from "./components/TimerBtn";

// `switchToGameMode` prop passed down from `App.js`
const HomeScreen = ({ switchToGameMode }) => {
  // array destructuring to create state variables for managing component state
  const [mushrooms, setMushrooms] = useState([]);
  const [mushroomCount, setMushroomCount] = useState(10);
  const [timer, setTimer] = useState(3);
  const [timerActive, setTimerActive] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  // `timerRef` is a mutable reference to store the timer interval ID (the value returned by `setInterval()`)
  const timerRef = useRef(null);

  // 
  // 
  // 

  // --------------------------------------------------- //
  //  Generate, initialise and handle clicked mushrooms  //
  // --------------------------------------------------- //
  
  // Generate a mushroom object with a random id, and x and y coordinates [Math.random() returns a random number between 0 (inclusive)  and 1 (exclusive)]:
  const generateMushroom = () => {
    return {
      id: Math.random(),
      // [Math.random() can be used with Math.floor() to return random integers (i.e. `* 90` is used to return a floating point number between 1 and 90 (between 1 and 90 in order to create some padding around the area of possible co-ordinates, ensuring mushrooms are positioned at least partially within visible screen area (e.g. 0.9963767559596003*90=89.67))]
      x: Math.floor(Math.random() * 90),
      y: Math.floor(Math.random() * 90),
    };
  };


  // Initialise the default amount of mushrooms (10) when the component first renders:
  useEffect(() => {
    // array to hold the initial mushrooms
    const initialMushrooms = [];
    // generate a mushroom for each number in count and add to array
    for (let i = 0; i < mushroomCount; i++) {
      initialMushrooms.push(generateMushroom());
    }
    // update `mushrooms` stat
    setMushrooms(initialMushrooms);
  // empty dependency array ensures effect runs only once - after the component mounts (not when the component re-renders due to state changes)
  }, []);


  // Randomly regenerate a clicked mushroom:
  const handleMushroomEvent = (id) => {
    setMushrooms((prevMushrooms) => {
      // generate a new mushroom to replace the clicked one
      const newMushroom = generateMushroom();
      return prevMushrooms.map((mushroom) =>
        // if the id of the item in `prevMushrooms` matches the id of the clicked mushroom, replace it with the newly generated one (else return the original mushroom)
        mushroom.id === id ? newMushroom : mushroom
      );
    });
  };

  // 
  // 
  // 

  // -------------------------- //
  //  Mushroom control buttons  //
  // -------------------------- //

  // Increase mushroom count (max 20):
  const increaseMushroomCount = () => {
    if (mushroomCount < 20) {
      const newMushroom = generateMushroom();
      // add new mushroom to the array
      setMushrooms((prevMushrooms) => [...prevMushrooms, newMushroom]);
      // increment mushroom count
      setMushroomCount((prevCount) => prevCount + 1);
    }
  };

  // Decrease mushroom count (min 1):
  const decreaseMushroomCount = () => {
    if (mushroomCount > 1) {
      // remove the last mushroom from the array
      setMushrooms((prevMushrooms) => prevMushrooms.slice(0, -1));
      // decrement mushroom count
      setMushroomCount((prevCount) => prevCount - 1);
    }
  };

  // Reset mushroom count to 10:
  const resetMushroomCount = () => {
    setMushrooms((prevMushrooms) => {
      if (prevMushrooms.length > 10) {
        // return only the first 10
        return prevMushrooms.slice(0, 10);
      } else if (prevMushrooms.length < 10) {
        const additionalMushrooms = [];
        for (let i = prevMushrooms.length; i < 10; i++) {
          additionalMushrooms.push(generateMushroom());
        }
        return [...prevMushrooms, ...additionalMushrooms];
      }
      // if the length is already 10, return the original array
      return prevMushrooms;
    });
    setMushroomCount(10);
  };
  
  // 
  // 
  // 

  // ------------------------ //
  //  Start and manage timer  //
  // ------------------------ //

  // Start timer:
  const startTimer = () => {
    setTimerActive(true);
  };

  // Manage timer:
  useEffect(() => {
    if (timerActive && timer > 0) {
      // `timerRef.current` stores the interval ID returned by setInterval (for cleanup purposes)
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      // run effect every 1000ms (1 second)
      }, 1000);
    }
    if (timer === 0) {
      resetHomeScreen();
    }
    // "clean up" the side effect (i.e. ensure timer stops when component unmounts or when a dependency state changes)
    return () => clearInterval(timerRef.current);
    // re-run effect whenever `timerActive` or `timer` states change
  }, [timerActive, timer]);

  //
  //
  //

  // ------------------ //
  //  Toggle dark mode  //
  // ------------------ //

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // 
  // 
  // 

  // ------------------ //
  //  Reset the screen  //
  // ------------------ //

  const resetHomeScreen = () => {
    // reset mushrooms
    setMushroomCount(10);
    const resetMushrooms = [];
    for (let i = 0; i < 10; i++) {
      resetMushrooms.push(generateMushroom());
    }
    // reset and deactivate timer
    setMushrooms(resetMushrooms);
    clearInterval(timerRef.current);
    setTimer(3);
    setTimerActive(false);
  };

  // 
  // 
  // 

  return (
    <div className={`home-screen-ctnr ${darkMode ? "dark" : ""}`}>
      <div className="top-edge-ctnr">
        <Header title={"Moshe"} />
        <MushroomControlBtns
          increaseMushroomCount={increaseMushroomCount}
          resetMushroomCount={resetMushroomCount}
          decreaseMushroomCount={decreaseMushroomCount}
          mushroomCount={mushroomCount}
        />
      </div>
      <div className="bottom-edge-ctnr">
        <ResetBtn onReset={resetHomeScreen} />
        <GameModeBtn
          onClick={switchToGameMode}
          label="Grid"
          className="game-mode-btn"
        />
        <div className="timer-dark-mode-ctnr">
          <TimerBtn
            timer={timer}
            timerActive={timerActive}
            onStart={startTimer}
          />
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </div>
      {/* Mushrooms */}
      {mushrooms.map((mushroom) => (
        <Mushroom
          key={mushroom.id}
          id={mushroom.id}
          onClick={handleMushroomEvent}
          style={{
            top: `${mushroom.y}%`,
            left: `${mushroom.x}%`,
          }}
        />
      ))}
    </div>
  );
};

export default HomeScreen;
