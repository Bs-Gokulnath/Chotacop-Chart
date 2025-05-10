import React, { useState } from "react";
import Header from "../components/Header";
import SchoolSelector from "../components/SchoolSelector";
import ResponseBoxes from "../components/ResponseBoxes";
import QuestionMatrix from "../components/QuestionMatrix";

const Analyze = () => {
  const [selectedChapter, setSelectedChapter] = useState("VELLORE");
  const [selectedSchool, setSelectedSchool] = useState("");

  return (
    <div className="min-h-screen bg-[#fdf5eb] flex flex-col">
      <div className="w-full z-10">
        <Header />
      </div>
      <div className="flex flex-grow items-center justify-center px-4 py-10 mt-[-130px]">
        <div className="bg-[#fdf5eb] shadow-xl p-8 rounded-xl w-full max-w-5xl space-y-6">
          {/* Top diamonds */}
          <div className="flex justify-between items-center mb-4">
            <div className="w-8 h-8 border-2 border-black rotate-45"></div>
            <div className="w-8 h-8 border-2 border-black rotate-45"></div>
            <div className="w-8 h-8 border-2 border-black rotate-45"></div>
          </div>
          {/* School/Chapter selection */}
          <SchoolSelector
            selectedChapter={selectedChapter}
            setSelectedChapter={setSelectedChapter}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
          />
          {/* Responses and boxes */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">Responses</label>
              <input
                className="w-full border p-2 rounded-lg"
                placeholder="Responses"
                disabled
              />
            </div>
            <ResponseBoxes count={7} />
          </div>
          {/* Main matrix */}
          <QuestionMatrix />
        </div>
      </div>
    </div>
  );
};

export default Analyze;
