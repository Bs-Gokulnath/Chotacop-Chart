import React from "react";

const chapters = ["VELLORE", "BHOPAL", "SALEM"];
const velloreSchools = [
  "MOTHER SCHOOL",
  "VANI VIDYALAYA SCHOOL",
  "RBMS SCHOOL",
  "SHRISHTI SCHOOL"
];

const SchoolSelector = ({
  selectedChapter,
  setSelectedChapter,
  selectedSchool,
  setSelectedSchool
}) => (
  <div className="flex gap-4">
    <div className="flex-1">
      <label className="block text-gray-700 mb-1 mt-[20px] font-semibold">School name</label>
      <input
        className="w-full border p-2 rounded-lg"
        placeholder="School name"
        value={selectedSchool}
        onChange={e => setSelectedSchool(e.target.value)}
      />
    </div>
    <div className="flex-1">
      <label className="block text-gray-700 mb-1 mt-[20px] font-semibold">Chapter</label>
      <select
        className="w-full border p-2 rounded-lg"
        value={selectedChapter}
        onChange={e => setSelectedChapter(e.target.value)}
      >
        {chapters.map(ch => (
          <option key={ch} value={ch}>{ch}</option>
        ))}
      </select>
    </div>
  </div>
);

export default SchoolSelector;
