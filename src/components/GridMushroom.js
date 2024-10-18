import React, { useRef } from "react";
import { gsap } from "gsap";

const GridMushroom = ({ id, color, onClick, isPulsing }) => {
  const gridMushroomRef = useRef(null);

  // Add a click handler to trigger onClick
  const handleClick = () => {
    onClick(id);
  };

  return (
    <div
      ref={gridMushroomRef}
      className={`grid-mushroom ${isPulsing ? "pulse" : ""}`} // Apply the pulse class
      style={{ backgroundColor: color }} // Apply the color prop
      onClick={handleClick} // Trigger the click event
    >
    </div>
  );
};

export default GridMushroom;
