import React from "react";

const ResponseBoxes = ({ count }) => (
  <div className="flex gap-10 justify-end">
    {Array.from({ length: count }).map((_, idx) => (
      <div
        key={idx}
        className="w-8 h-8 border-2 border-black rounded-md flex items-center justify-center"
      ></div>
    ))}
  </div>
);

export default ResponseBoxes;
