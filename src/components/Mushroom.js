import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Mushroom = ({ id, onClick, style }) => {
  const mushroomRef = useRef(null);

  useEffect(() => {
    gsap.to(mushroomRef.current, {
      scale: 1.5,
      backgroundColor: 'red',
      duration: 10, 
      onComplete: () => onClick(id, false)
    });
  }, [onClick, id]);

  return (
    <div
      ref={mushroomRef}
      className="mushroom"
      onClick={() => {
        onClick(id, true);
      }}
      style={style}
    >
    </div>
  );
};

export default Mushroom;
