import React from 'react';
import Btn from './Btn';

const MushroomControlBtns = ({
  increaseMushroomCount,
  resetMushroomCount,
  decreaseMushroomCount,
  mushroomCount,
}) => {
  return (
    <div className="mushroom-control-btns-ctnr">
      <Btn
        onClick={increaseMushroomCount}
        label="+"
        className="increase-mushroom-count-btn"
        disabled={mushroomCount >= 20}
      />
      <Btn
        onClick={resetMushroomCount}
        label=":"
        className="reset-mushroom-count-btn"
      />
      <Btn
        onClick={decreaseMushroomCount}
        label="-"
        className="decrease-mushroom-count-btn"
        disabled={mushroomCount <= 1}
      />
    </div>
  );
};

export default MushroomControlBtns;
