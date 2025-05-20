import React from "react";

const ResponseBoxes = ({ count }) => (
  <div className="grid grid-cols-[300px_repeat(8,80px)] gap-4 items-center mb-2">
    <div className="font-semibold"></div>
    {/* {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="w-8 h-8 text-center font-semibold">
        {idx + 1}
      </div>
    ))} */}
  </div>
);

export default ResponseBoxes;
