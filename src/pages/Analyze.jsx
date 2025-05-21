import React, { useState } from "react";
import Header from "../components/Header";
import ResponseBoxes from "../components/ResponseBoxes";
import SchoolSelector from "../components/SchoolSelector";

const Analyze = () => {
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  return (
    <div className="min-h-screen bg-[#fdf5eb] flex flex-col">
      <div className="w-full z-10">
        <Header showHomeLink={true} />
      </div>
      <div className="flex flex-grow items-center justify-center px-4 py-10 mt-[-80px]">
        <div className="bg-[#fdf5eb] shadow-xl p-8 rounded-xl w-full max-w-[95%] space-y-6">
          {/* School/Chapter selection */}
          <SchoolSelector
            selectedChapter={selectedChapter}
            setSelectedChapter={setSelectedChapter}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
          />

        </div>
      </div>
    </div>
  );
};

export default Analyze;