import React from 'react';
import Btn from './Btn';

const GameModeBtn = ({ onClick, label, className }) => {
    return (
        <div className='game-mode-btn-ctnr'>
            <Btn
                onClick={onClick}
                label={label}
                className={className}
            />
        </div>
    );
};

export default GameModeBtn;