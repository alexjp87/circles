import React from 'react';

const Header = ({ title }) => {
  return (
    <div className='header-ctnr'>
      <h1 className='header'>{title}</h1>
    </div>
  );
};

export default Header;