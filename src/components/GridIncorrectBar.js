import React from 'react';

const GridIncorrectBar = ({ incorrectBarProgress, shouldFlashWarning }) => {
    return (
        <div className='incorrect-bar-ctnr'>
            <div className={`incorrect-bar ${shouldFlashWarning ? 'flash-warning' : ''}`} style={{ height: `${incorrectBarProgress * 20}%` }}>
            </div>
        </div>
    );
};

export default GridIncorrectBar;