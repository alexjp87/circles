import React from 'react';

const GridCorrectBar = ({ correctBarProgress }) => {
    return (
        <div className='correct-bar-ctnr'>
            <div className='correct-bar' style={{ height: `${correctBarProgress * 20}%` }}>
            </div>
        </div>
    );
};

export default GridCorrectBar;