import React from 'react';

const GridIncorrectBar = ({ incorrectBarProgress }) => {
    return (
        <div className='incorrect-bar-ctnr'>
            <div className='incorrect-bar' style={{ height: `${incorrectBarProgress * 20}%` }}>
            </div>
        </div>
    );
};

export default GridIncorrectBar;