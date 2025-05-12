import React from "react";

const ResponseBoxes = ({ count }) => (
  <div className="flex gap-30 mr-[70px] justify-end">
    {Array.from({ length: count }).map((_, idx) => (
      <div
        key={idx}
        // className="w-8 h-8 border-2 border-black rounded-md flex items-center justify-center"
      >
        {idx + 1}
      </div>
    ))}
  </div>
);

export default ResponseBoxes;
