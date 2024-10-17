import React from 'react';

const GridPrompt = ({ textColor, selectedWord, flashColor }) => {
    return (
        <div className='grid-prompt-ctnr' style={{ borderBottomColor: flashColor || "#f0f0f0" }}>
            <h1 className='grid-prompt' style={{ color: textColor }}>
                {selectedWord.toUpperCase()}
            </h1>
        </div>
    );
};

export default GridPrompt;