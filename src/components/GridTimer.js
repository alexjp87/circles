import React from 'react';

const GridTimer = ({ timer }) => {
    return (
        <div className='grid-timer-ctnr'>
            <h2 className='grid-timer'>{timer.toFixed(2)}</h2>
        </div>
    );
};

export default GridTimer;