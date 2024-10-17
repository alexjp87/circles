import React from 'react';
import Btn from './Btn';

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className='dark-mode-toggle-ctnr'>
    <Btn
      onClick={toggleDarkMode}
      label={darkMode ? 'Light' : 'Dark'}
      className="dark-mode-toggle"
    />
    </div>
  );
};

export default DarkModeToggle;
