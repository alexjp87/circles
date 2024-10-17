import React from 'react';

const Btn = ({ onClick, label, className=''}) => {
  return (
    <button
      onClick={onClick}
      label={label}
      className={`btn ${className}`}
    >
        {label}
    </button>
  );
};

export default Btn;
