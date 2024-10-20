import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DarkModeToggle from './components/DarkModeToggle';
import Mushroom from './components/Mushroom';
import MushroomControlBtns from './components/MushroomControlBtns';
import ResetBtn from './components/ResetBtn';
import TimerBtn from './components/TimerBtn';
import GameModeBtn from './components/GameModeBtn';

const HomeScreen = ({ switchToGameMode }) => {
    const [mushrooms, setMushrooms] = useState([]);
    const [mushroomCount, setMushroomCount] = useState(10);
    const [timer, setTimer] = useState(3);
    const [timerActive, setTimerActive] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const timerRef = useState(null)

    // generate a single random mushroom
    const generateMushroom = () => {
      return {
        id: Math.random(),
        x: Math.floor(Math.random() * 90),
        y: Math.floor(Math.random() * 90),
      };
    };

    // spawn the desired number of mushrooms on mount (10)
    useEffect(() => {
      const initialMushrooms = [];
      for (let i = 0; i < mushroomCount; i++) {
        initialMushrooms.push(generateMushroom());
      }
      setMushrooms(initialMushrooms);
    }, []);

  // handle mushroom click or timeout
  const handleMushroomEvent = (id, wasClicked) => {
    setMushrooms((prevMushrooms) => {
      const newMushroom = generateMushroom();
      return prevMushrooms.map((mushroom) =>
        mushroom.id === id ? newMushroom : mushroom
      );
    });
  };

   // increase mushroom count
   const increaseMushroomCount = () => {
    if (mushroomCount < 20) {
      const newMushroom = generateMushroom();
      setMushrooms((prevMushrooms) => [...prevMushrooms, newMushroom]);
      setMushroomCount((prevCount) => prevCount + 1);
    }
  };

  // decrease mushroom count
  const decreaseMushroomCount = () => {
    if (mushroomCount > 1) {
      setMushrooms((prevMushrooms) => prevMushrooms.slice(0, -1));
      setMushroomCount((prevCount) => prevCount - 1);
    }
  };

  // reset mushrooms to 10
  const resetMushroomCount = () => {
    setMushrooms((prevMushrooms) => {
      if (prevMushrooms.length > 10) {
        return prevMushrooms.slice(0, 10);
      } else if (prevMushrooms.length < 10) {
        const additionalMushrooms = [];
        for (let i = prevMushrooms.length; i < 10; i++) {
          additionalMushrooms.push(generateMushroom());
        }
        return [...prevMushrooms, ...additionalMushrooms];
      }
      return prevMushrooms;
    });
    setMushroomCount(10);
  };

     // reset home screen
    const resetHomeScreen = () => {
      setMushroomCount(10);
      const resetMushrooms = [];
      for (let i = 0; i < 10; i++) {
        resetMushrooms.push(generateMushroom());
      }
      setMushrooms(resetMushrooms);
      setTimer(3);
      setTimerActive(false);
      clearInterval(timerRef.current);
    };

    // timer logic
    useEffect(() => {
      if (timerActive && timer > 0) {
        timerRef.current = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
      }
      if (timer === 0) {
        resetHomeScreen();
      }
      return () => clearInterval(timerRef.current);
    }, [timerActive, timer]);

    // start timer
    const startTimer = () => {
        setTimerActive(true);
      };

    // toggle Dark Mode
    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
      };



    return (
        // Light or dark mode
        <div className={`home-screen-ctnr ${darkMode ? 'dark' : ''}`}>
          <div className='top-edge-ctnr'>
            <Header
                title={'Moshe'}
            />
                <MushroomControlBtns
                increaseMushroomCount={increaseMushroomCount}
                resetMushroomCount={resetMushroomCount}
                decreaseMushroomCount={decreaseMushroomCount}
                mushroomCount={mushroomCount}
                />
            </div>
                <div className='bottom-edge-ctnr'>
                <ResetBtn 
            onReset={resetHomeScreen}
            />
            <GameModeBtn
            onClick={switchToGameMode}
            label="Grid"
            className="game-mode-btn"
            />
            <div className='timer-dark-mode-ctnr'>
            <TimerBtn
            timer={timer}
            timerActive={timerActive}
            onStart={startTimer}
            />
             <DarkModeToggle
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
            />
            </div>
            </div>
            {/* Render mushrooms */}
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