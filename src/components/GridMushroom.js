import React, { useRef } from "react";
import { gsap } from "gsap";

const GridMushroom = ({ id, color, onClick }) => {
  const gridMushroomRef = useRef(null);

  // Add a click handler to trigger onClick
  const handleClick = () => {
    onClick(id);
  };

  return (
    <div
      ref={gridMushroomRef}
      className="grid-mushroom"
      style={{ backgroundColor: color }} // Apply the color prop
      onClick={handleClick} // Trigger the click event
    >
    </div>
  );
};

export default GridMushroom;
