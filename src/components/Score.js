import React from 'react';

const ScoreDisplay = ({ score, flashColor }) => {
  return (
    <div className="score-ctnr" style={{ borderTopColor: flashColor || "#f0f0f0" }}>
      <h2 className='score'>Score: {score}</h2>
    </div>
  );
};

export default ScoreDisplay;