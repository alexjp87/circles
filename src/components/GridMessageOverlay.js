import React from 'react';

const GridMessageOverlay = ({ message, color, onClick }) => {
    return (
        <div className='grid-overlay-ctnr' onClick={onClick}>
          <h1 className='grid-overlay-message' style={{ backgroundColor: color }}>{message}</h1>
        </div>
    );
};

export default GridMessageOverlay;